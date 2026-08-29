import { describe, expect, it } from "vitest";
import { parseFlow, nodeById } from "../src/flow.js";
import type { Event, Verdict } from "../src/schema.js";
import { decide, foldLog, threshold } from "../src/state.js";

const flow = parseFlow(
  `
nodes:
  - id: plan
    assignees: [product]
  - id: review
    assignees: [designer, engineer]
  - id: implement
    assignees: [engineer]
`,
  "demo",
);

const ts = "2026-08-29T10:00:00Z";
const v = (by: string, verdict: "approve" | "reject", to?: string): Verdict => ({
  by,
  verdict,
  reason: "r",
  ...(to ? { to } : {}),
});

describe("threshold", () => {
  it("all 等于总人数", () => expect(threshold("all", 3)).toBe(3));
  it("any 等于 1", () => expect(threshold("any", 3)).toBe(1));
  it("数字按原值", () => expect(threshold(2, 3)).toBe(2));
  it("数字超过总人数时收敛到总人数", () => expect(threshold(5, 3)).toBe(3));
});

describe("decide", () => {
  const review = nodeById(flow, "review");

  it("没表态齐就等待——即使已注定打回", () => {
    expect(decide(flow, review, [v("designer", "reject")])).toEqual({ kind: "waiting" });
  });

  it("全部 approve 且达到阈值就前进", () => {
    expect(decide(flow, review, [v("designer", "approve"), v("engineer", "approve")])).toEqual({
      kind: "advance",
      to: "implement",
    });
  });

  it("表态齐但达不到阈值就打回", () => {
    expect(decide(flow, review, [v("designer", "approve"), v("engineer", "reject")])).toEqual({
      kind: "reject",
      to: "plan",
    });
  });

  it("多个 reject 目标时取最上游那个", () => {
    const f = parseFlow(
      `
nodes:
  - id: a
    assignees: [x]
  - id: b
    assignees: [x]
  - id: c
    assignees: [p, q]
`,
      "d",
    );
    const decision = decide(f, nodeById(f, "c"), [v("p", "reject", "b"), v("q", "reject", "a")]);
    expect(decision).toEqual({ kind: "reject", to: "a" });
  });

  it("approve: any 表态齐后一票通过即前进", () => {
    const f = parseFlow(
      `
nodes:
  - id: a
    assignees: [x]
  - id: b
    assignees: [p, q]
    approve: any
`,
      "d",
    );
    expect(decide(f, nodeById(f, "b"), [v("p", "approve"), v("q", "reject")])).toEqual({
      kind: "advance",
      to: null,
    });
  });

  it("最后一个节点通过时 to 为 null", () => {
    expect(decide(flow, nodeById(flow, "implement"), [v("engineer", "approve")])).toEqual({
      kind: "advance",
      to: null,
    });
  });

  it("非 assignee 的表态不凑数:表态没齐仍然等待", () => {
    // review 的 assignees 中途被改过,ghost 是改之前留下的一票
    expect(decide(flow, review, [v("designer", "approve"), v("ghost", "approve")])).toEqual({
      kind: "waiting",
    });
  });

  it("非 assignee 的 approve 不参与阈值", () => {
    const f = parseFlow(
      `
nodes:
  - id: a
    assignees: [x]
  - id: b
    assignees: [p, q]
    approve: any
`,
      "d",
    );
    expect(
      decide(f, nodeById(f, "b"), [v("p", "reject"), v("q", "reject"), v("ghost", "approve")]),
    ).toEqual({ kind: "reject", to: "a" });
  });

  it("第一个节点打回且没给 to 时抛错", () => {
    expect(() => decide(flow, nodeById(flow, "plan"), [v("product", "reject")])).toThrow(
      /没有上游/,
    );
  });
});

describe("foldLog", () => {
  it("当前节点是最后一条 transition", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "plan", flow: "demo" },
      { t: "approve", ts, node: "plan", by: "product", reason: "done" },
      { t: "transition", ts, node: "review", cause: "approve" },
    ];
    const s = foldLog(events);
    expect(s.node).toBe("review");
    expect(s.flow).toBe("demo");
    expect(s.path).toEqual(["plan", "review"]);
    expect(s.verdicts).toEqual([]);
  });

  it("表态只统计最后一条 transition 之后的", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "plan", flow: "demo" },
      { t: "approve", ts, node: "plan", by: "product", reason: "done" },
      { t: "transition", ts, node: "review", cause: "approve" },
      { t: "approve", ts, node: "review", by: "designer", reason: "ok" },
    ];
    expect(foldLog(events).verdicts).toEqual([
      { by: "designer", verdict: "approve", reason: "ok" },
    ]);
  });

  it("同一人多次表态取最后一次", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "review", flow: "demo" },
      { t: "approve", ts, node: "review", by: "designer", reason: "first" },
      { t: "reject", ts, node: "review", by: "designer", reason: "changed my mind" },
    ];
    const s = foldLog(events);
    expect(s.verdicts).toHaveLength(1);
    expect(s.verdicts[0]).toMatchObject({ verdict: "reject", reason: "changed my mind" });
  });

  it("节点对不上的表态计为 stale 且不计入", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "review", flow: "demo" },
      { t: "approve", ts, node: "plan", by: "product", reason: "陈旧" },
    ];
    const s = foldLog(events);
    expect(s.stale).toBe(1);
    expect(s.verdicts).toEqual([]);
  });

  it("重复的 transition 计为 stale,不重复推进 path", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "plan", flow: "demo" },
      { t: "transition", ts, node: "review", cause: "approve" },
      { t: "transition", ts, node: "review", cause: "approve" },
    ];
    const s = foldLog(events);
    expect(s.path).toEqual(["plan", "review"]);
    expect(s.stale).toBe(1);
  });

  it("传入 flow 时,非当前 assignee 的表态计为 stale", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "review", flow: "demo" },
      { t: "approve", ts, node: "review", by: "ghost", reason: "改 assignees 之前留下的" },
    ];
    expect(foldLog(events, flow).stale).toBe(1);
    expect(foldLog(events).stale).toBe(0);
  });

  it("close 之后 closed 为真", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "plan", flow: "demo" },
      { t: "close", ts, by: "human", reason: "已发布" },
    ];
    const s = foldLog(events);
    expect(s.closed).toBe(true);
  });

  it("recall 后由随后的 transition 定位当前节点", () => {
    const events: Event[] = [
      { t: "transition", ts, node: "implement", flow: "demo" },
      { t: "recall", ts, from: "implement", to: "plan", by: "human", reason: "需求变更" },
      { t: "transition", ts, node: "plan", cause: "recall" },
    ];
    expect(foldLog(events).node).toBe("plan");
  });
});
