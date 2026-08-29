import { describe, expect, it } from "vitest";
import { EventSchema, FlowSchema, SettingsSchema } from "../src/schema.js";

describe("FlowSchema", () => {
  it("approve 缺省为 all", () => {
    const flow = FlowSchema.parse({
      nodes: [{ id: "plan", assignees: ["product"] }],
    });
    expect(flow.nodes[0].approve).toBe("all");
    expect(flow.mode).toBe("manual");
  });

  it("拒绝空 assignees", () => {
    expect(() =>
      FlowSchema.parse({ nodes: [{ id: "plan", assignees: [] }] }),
    ).toThrow();
  });

  it("拒绝重复的 node id", () => {
    expect(() =>
      FlowSchema.parse({
        nodes: [
          { id: "plan", assignees: ["product"] },
          { id: "plan", assignees: ["engineer"] },
        ],
      }),
    ).toThrow();
  });

  it("approve 接受正整数", () => {
    const flow = FlowSchema.parse({
      nodes: [{ id: "r", assignees: ["a", "b", "c"], approve: 2 }],
    });
    expect(flow.nodes[0].approve).toBe(2);
  });
});

describe("EventSchema", () => {
  it("approve 必须带非空 reason", () => {
    expect(() =>
      EventSchema.parse({
        t: "approve",
        ts: "2026-08-29T10:00:00Z",
        node: "plan",
        by: "product",
        reason: "",
      }),
    ).toThrow();
  });

  it("transition 不需要 reason", () => {
    const e = EventSchema.parse({
      t: "transition",
      ts: "2026-08-29T10:00:00Z",
      node: "plan",
    });
    expect(e.t).toBe("transition");
  });

  it("recall 必须带 from 与 to", () => {
    expect(() =>
      EventSchema.parse({
        t: "recall",
        ts: "2026-08-29T10:00:00Z",
        from: "implement",
        by: "human",
        reason: "需求变更",
      }),
    ).toThrow();
  });
});

describe("SettingsSchema", () => {
  it("空对象得到空 agents 和空 scripts", () => {
    const s = SettingsSchema.parse({});
    expect(s.agents).toEqual({});
    expect(s.scripts).toEqual({});
  });

  it("agent 可以只声明不绑定 ref", () => {
    const s = SettingsSchema.parse({ agents: { qa: {} } });
    expect(s.agents.qa.ref).toBeUndefined();
  });
});
