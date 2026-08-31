import { existsSync, mkdirSync } from "node:fs";
import { checkFlowAgents, loadFlow, nodeById, nodeIndex, prevNode } from "./flow.js";
import { appendEvent, nowIso, readLog } from "./log.js";
import { issuePaths } from "./paths.js";
import { type Flow, type FlowNode, type Settings, SettingsSchema, type Verdict } from "./schema.js";
import { runScript, type Vars } from "./scripts.js";
import { loadSettings } from "./settings.js";
import { decide, foldLog, type State } from "./state.js";

export type IssueView = {
  slug: string;
  flow: string;
  mode: "manual" | "auto";
  node: string | null;
  closed: boolean;
  completed: boolean;
  assignees: string[];
  pending: string[];
  verdicts: Verdict[];
  path: string[];
  stale: number;
  /** Unparseable log lines: the folded state below is built without them. */
  malformed: number;
  /** Set when the flow could not be loaded; everything flow-derived is degraded. */
  flowError?: string;
  issueDir: string;
  instruction?: string;
};

/** A flow naming an agent absent from settings is a misconfiguration; fail loudly rather than notifying nobody. */
function assertKnownAgents(flow: Flow, flowName: string, settings: Settings): void {
  const missing = checkFlowAgents(flow, settings);
  if (missing.length) {
    throw new Error(`流程 ${flowName} 引用了未声明的 agent:${missing.join(", ")};先用 rivo agent add 声明`);
  }
}

// Deliberately does NOT call assertKnownAgents: this is the entry point for
// show/approve/reject/recall/close on an issue already in flight. Settings
// drifting after creation (someone edits ~/.rivo/settings.json) must never
// brick a delivery — close in particular is the escape hatch when a delivery
// is stuck, and it must keep working even then. notifyEntered warns loudly
// about an undeclared agent instead; newIssue still refuses to create one.
function load(ws: string, slug: string) {
  const { issueDir, logPath } = issuePaths(ws, slug);
  if (!existsSync(logPath)) throw new Error(`交付 ${slug} 不存在`);
  const { events, malformed } = readLog(logPath);
  // The flow is lazy: closeIssue never needs it, and a deleted or renamed
  // flow file must not make an in-flight delivery un-closeable.
  return {
    issueDir,
    logPath,
    events,
    malformed,
    state: foldLog(events),
    settings: tolerantSettings(ws),
    flow: (state: State) => loadFlow(ws, state.flow),
  };
}

/**
 * A corrupt settings file must not brick a delivery either — same fallback
 * doctor already uses. Empty settings mean no scripts fire, which is a
 * degraded notification, not a lost transition.
 */
function tolerantSettings(ws: string): Settings {
  try {
    return loadSettings(ws);
  } catch (e) {
    console.warn(
      `[rivo] settings 读取失败:${e instanceof Error ? e.message : String(e)}\n` +
        `       已按空配置继续,通知脚本不会执行;修好之后跑 rivo doctor 复查。`,
    );
    return SettingsSchema.parse({});
  }
}

/** The log lost lines, so the folded state may be wrong. Say so before appending to it. */
function warnMalformed(logPath: string, malformed: number): void {
  if (!malformed) return;
  console.warn(
    `[rivo] ${logPath} 有 ${malformed} 行无法解析,当前状态可能不完整;\n` +
      `       这一步会基于它继续追加,先跑 rivo doctor 确认。`,
  );
}

function vars(ws: string, slug: string, state: State, extra: Vars): Vars {
  const { issueDir, logPath } = issuePaths(ws, slug);
  return {
    issue_slug: slug,
    flow: state.flow,
    issue_dir: issueDir,
    log_path: logPath,
    workspace_dir: ws,
    ...extra,
  };
}

/**
 * The last node passed but the delivery has not been closed yet. Needs the
 * flow, so it cannot live in foldLog. Never throws: `show` is the diagnostic
 * command and must stay readable even against a damaged log.
 */
function isCompleted(flow: Flow | null, node: FlowNode | null, verdicts: Verdict[]): boolean {
  if (!flow || !node) return false;
  try {
    const d = decide(flow, node, verdicts);
    return d.kind === "advance" && d.to === null;
  } catch {
    return false;
  }
}

/**
 * Every reason recorded on the node, joined. Spec §2.5: the author gets all
 * the opinions in one go, so `{reason}` carries all of them rather than
 * picking one arbitrarily. Approve reasons are the handoff notes.
 */
function joinReasons(node: FlowNode, verdicts: Verdict[], kind: "approve" | "reject"): string {
  return verdicts
    .filter((v) => v.verdict === kind && node.assignees.includes(v.by))
    .map((v) => v.reason)
    .join("; ");
}

/**
 * Fire one script per assignee of the node just entered. Best effort: by the
 * time this runs the transition is already committed to the log, so nothing
 * in here — including the flow/settings the caller already loaded — may
 * escape and make a successful command look failed.
 */
function notifyEntered(
  ws: string,
  slug: string,
  flow: Flow,
  settings: Settings,
  state: State,
  nodeId: string,
  cause: "approve" | "reject" | "recall",
  reason: string,
): void {
  try {
    const event = cause === "approve" ? "transition" : cause;
    for (const agent of nodeById(flow, nodeId).assignees) {
      const declared = settings.agents[agent];
      if (!declared) {
        // Not declared at all is a misconfiguration, not a human node. It
        // must not look identical to the ref-less case below — warn loudly
        // naming the agent, but don't block the transition over it.
        console.warn(
          `[rivo] 节点 ${nodeId} 的 assignee ${agent} 未在 settings 中声明,已跳过通知;` +
            `请用 rivo agent add 声明,或检查流程配置。`,
        );
        continue;
      }
      const ref = declared.ref;
      // No ref means a human does this node: nothing to wake, they advance
      // by hand. Skip silently rather than calling the script with an empty
      // {agent_ref}.
      if (!ref) continue;
      const result = runScript(
        settings,
        event,
        vars(ws, slug, state, {
          node: nodeId,
          agent,
          agent_ref: ref,
          reason,
        }),
      );
      if (result.error) {
        console.warn(
          `[rivo] scripts.${event} 执行失败:${result.error}\n` +
            `       流转已写入 log,状态是对的;请手工通知 ${agent}。`,
        );
      }
    }
  } catch (e) {
    console.warn(
      `[rivo] 通知失败:${e instanceof Error ? e.message : String(e)}\n` +
        `       流转已写入 log,状态是对的;请手工确认通知是否送达。`,
    );
  }
}

export function newIssue(ws: string, slug: string, flowName: string): void {
  const { issueDir, logPath } = issuePaths(ws, slug);
  if (existsSync(logPath)) throw new Error(`交付 ${slug} 已存在`);
  const flow = loadFlow(ws, flowName);
  const settings = loadSettings(ws);
  assertKnownAgents(flow, flowName, settings);
  mkdirSync(issueDir, { recursive: true });
  const first = flow.nodes[0].id;
  appendEvent(logPath, { t: "transition", ts: nowIso(), node: first, flow: flowName });
  notifyEntered(ws, slug, flow, settings, foldLog(readLog(logPath).events), first, "approve", "");
}

export function showIssue(ws: string, slug: string): IssueView {
  const { issueDir, events, malformed, state: folded, flow: lazyFlow } = load(ws, slug);
  let flow: Flow | null = null;
  let flowError: string | undefined;
  try {
    flow = lazyFlow(folded);
  } catch (e) {
    flowError = e instanceof Error ? e.message : String(e);
  }
  const state = foldLog(events, flow ?? undefined);
  let node: FlowNode | null = null;
  if (flow && state.node) {
    if (nodeIndex(flow, state.node) < 0) {
      flowError = `流程 ${state.flow} 中没有节点 ${state.node}`;
    } else {
      node = nodeById(flow, state.node, state.flow);
    }
  }
  const acted = new Set(state.verdicts.map((v) => v.by));
  return {
    slug,
    flow: state.flow,
    // Unknown without the flow. manual is the schema default and the safe
    // answer: it asks for a human before anything advances.
    mode: flow?.mode ?? "manual",
    node: state.node,
    closed: state.closed,
    completed: isCompleted(flow, node, state.verdicts),
    assignees: node?.assignees ?? [],
    pending: (node?.assignees ?? []).filter((a) => !acted.has(a)),
    verdicts: state.verdicts,
    path: state.path,
    stale: state.stale,
    malformed,
    ...(flowError ? { flowError } : {}),
    issueDir,
    instruction: node?.instruction,
  };
}

export function recordVerdict(
  ws: string,
  slug: string,
  by: string,
  verdict: "approve" | "reject",
  reason: string,
  to?: string,
): void {
  const { logPath, state, malformed, settings, flow: lazyFlow } = load(ws, slug);
  if (state.closed) throw new Error(`交付 ${slug} 已关闭`);
  if (!state.node) throw new Error(`交付 ${slug} 没有当前节点`);
  const flow = lazyFlow(state);

  const node = nodeById(flow, state.node, state.flow);
  if (isCompleted(flow, node, state.verdicts)) {
    throw new Error(`交付 ${slug} 已走完全部节点,请 rivo issue close`);
  }
  if (!node.assignees.includes(by)) {
    throw new Error(`${by} 不是节点 ${node.id} 的 assignee(${node.assignees.join(", ")})`);
  }
  if (to) {
    nodeById(flow, to, state.flow); // throws if the target node does not exist
    if (nodeIndex(flow, to) >= nodeIndex(flow, node.id)) {
      throw new Error(`打回目标必须在当前节点之前,${to} 不在 ${node.id} 之前`);
    }
  }
  // A reject at the first node has nowhere upstream to go, and --to cannot
  // help: every node is at or after this one. Reject before any append, or
  // the event lands on disk while `decide` throws below, and every later
  // `show` hits the same throw forever.
  if (verdict === "reject" && prevNode(flow, node.id) === null) {
    throw new Error(`节点 ${node.id} 没有上游,不能打回;要终止这次交付请用 rivo issue close`);
  }
  warnMalformed(logPath, malformed);

  appendEvent(logPath, {
    ts: nowIso(),
    node: node.id,
    by,
    reason,
    ...(verdict === "approve" ? { t: "approve" as const } : { t: "reject" as const, ...(to ? { to } : {}) }),
  });

  const after = foldLog(readLog(logPath).events);
  const decision = decide(flow, node, after.verdicts);
  if (decision.kind === "waiting") return;

  if (decision.kind === "advance") {
    if (decision.to === null) return; // last node passed; wait for close
    appendEvent(logPath, { t: "transition", ts: nowIso(), node: decision.to, cause: "approve" });
    const notes = joinReasons(node, after.verdicts, "approve");
    notifyEntered(ws, slug, flow, settings, after, decision.to, "approve", notes);
    return;
  }

  appendEvent(logPath, { t: "transition", ts: nowIso(), node: decision.to, cause: "reject" });
  const objections = joinReasons(node, after.verdicts, "reject");
  notifyEntered(ws, slug, flow, settings, after, decision.to, "reject", objections);
}

export function recallIssue(
  ws: string,
  slug: string,
  by: string,
  to: string,
  reason: string,
): void {
  const { logPath, state, malformed, settings, flow: lazyFlow } = load(ws, slug);
  if (state.closed) throw new Error(`交付 ${slug} 已关闭`);
  if (!state.node) throw new Error(`交付 ${slug} 没有当前节点`);
  const flow = lazyFlow(state);

  nodeById(flow, to, state.flow); // throws if the target node does not exist
  if (nodeIndex(flow, to) >= nodeIndex(flow, state.node)) {
    throw new Error(`recall 只能回退到更早的节点,${to} 不在 ${state.node} 之前`);
  }
  warnMalformed(logPath, malformed);

  appendEvent(logPath, { t: "recall", ts: nowIso(), from: state.node, to, by, reason });
  appendEvent(logPath, { t: "transition", ts: nowIso(), node: to, cause: "recall" });
  notifyEntered(ws, slug, flow, settings, foldLog(readLog(logPath).events), to, "recall", reason);
}

export function closeIssue(ws: string, slug: string, by: string, reason?: string): void {
  // Deliberately never touches the flow: close is the escape hatch, and it
  // has to work when the flow file is gone or the settings file is corrupt.
  const { logPath, state, malformed, settings } = load(ws, slug);
  if (state.closed) throw new Error(`交付 ${slug} 已关闭`);
  warnMalformed(logPath, malformed);
  appendEvent(logPath, { t: "close", ts: nowIso(), by, ...(reason ? { reason } : {}) });
  // Nobody is being woken here, so {agent} is whoever closed it — the only
  // agent this event knows about — and {node} is where the delivery stopped.
  const result = runScript(
    settings,
    "close",
    vars(ws, slug, state, {
      node: state.node ?? "",
      agent: by,
      agent_ref: settings.agents[by]?.ref ?? "",
      reason: reason ?? "",
    }),
  );
  if (result.error) console.warn(`[rivo] scripts.close 执行失败:${result.error}`);
}
