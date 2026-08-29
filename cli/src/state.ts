import { nodeIndex, nextNode, prevNode } from "./flow.js";
import type { Event, Flow, FlowNode, Verdict } from "./schema.js";

export type State = {
  flow: string;
  /** Current node id; null once the issue is closed. */
  node: string | null;
  closed: boolean;
  /** Verdicts recorded after the most recent transition, one per assignee. */
  verdicts: Verdict[];
  path: string[];
  stale: number;
};

export type Decision =
  | { kind: "waiting" }
  /** `to === null` means the last node passed. */
  | { kind: "advance"; to: string | null }
  | { kind: "reject"; to: string };

export function threshold(approve: FlowNode["approve"], total: number): number {
  if (approve === "all") return total;
  if (approve === "any") return 1;
  return Math.min(approve, total);
}

/**
 * `flow` is optional because the flow name only becomes known by folding, and
 * a missing flow file must not stop the fold. Pass it when you have it: it is
 * what turns a verdict from a former assignee into a stale one.
 */
export function foldLog(events: Event[], flow?: Flow): State {
  const state: State = {
    flow: "",
    node: null,
    closed: false,
    verdicts: [],
    path: [],
    stale: 0,
  };
  // Keyed by assignee so a later verdict replaces an earlier one.
  let latest = new Map<string, Verdict>();

  for (const e of events) {
    switch (e.t) {
      case "transition":
        // Two writers can both commit the same transition (the TOCTOU window
        // in §9). Applying it twice duplicates the path and re-fires the
        // notification script; no legal transition ever targets its own node.
        if (e.node === state.node) {
          state.stale += 1;
          break;
        }
        if (e.flow) state.flow = e.flow;
        state.node = e.node;
        state.path.push(e.node);
        latest = new Map();
        break;
      case "approve":
      case "reject":
        if (e.node !== state.node) {
          state.stale += 1;
          break;
        }
        latest.set(e.by, {
          by: e.by,
          verdict: e.t,
          reason: e.reason,
          ...(e.t === "reject" && e.to ? { to: e.to } : {}),
        });
        break;
      case "recall":
        // The transition event that follows carries the new node.
        latest = new Map();
        break;
      case "close":
        state.closed = true;
        state.node = null;
        break;
    }
  }

  state.verdicts = [...latest.values()];
  // Editing a node's assignees mid-flight (spec §9) leaves verdicts behind
  // from people who no longer count. `decide` ignores them; surface them.
  const node = flow && state.node ? flow.nodes.find((n) => n.id === state.node) : undefined;
  if (node) {
    state.stale += state.verdicts.filter((v) => !node.assignees.includes(v.by)).length;
  }
  return state;
}

export function decide(flow: Flow, node: FlowNode, verdicts: Verdict[]): Decision {
  // Verdicts are keyed by author, not by membership: foldLog knows nothing
  // about assignees. Counting raw verdicts lets a stale one from a former
  // assignee pad the tally, so the node advances before everyone has spoken.
  const relevant = verdicts.filter((v) => node.assignees.includes(v.by));
  if (relevant.length < node.assignees.length) return { kind: "waiting" };

  const approved = relevant.filter((v) => v.verdict === "approve").length;
  if (approved >= threshold(node.approve, node.assignees.length)) {
    return { kind: "advance", to: nextNode(flow, node.id) };
  }

  // Most upstream target among the rejects; falls back to the previous node.
  const targets = relevant
    .filter((v) => v.verdict === "reject" && v.to)
    .map((v) => v.to as string);
  if (targets.length > 0) {
    const upstream = targets.reduce((a, b) => (nodeIndex(flow, a) <= nodeIndex(flow, b) ? a : b));
    return { kind: "reject", to: upstream };
  }

  const prev = prevNode(flow, node.id);
  if (!prev) {
    throw new Error(`节点 ${node.id} 没有上游,打回时必须用 --to 指定目标节点,或直接 close`);
  }
  return { kind: "reject", to: prev };
}
