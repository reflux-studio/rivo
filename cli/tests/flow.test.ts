import { describe, expect, it } from "vitest";
import { checkFlowAgents, nextNode, nodeById, parseFlow, prevNode } from "../src/flow.js";
import { SettingsSchema } from "../src/schema.js";

const yaml = `
mode: manual
nodes:
  - id: plan
    assignees: [product]
  - id: review
    assignees: [designer, engineer]
    approve: all
  - id: implement
    assignees: [engineer]
`;

describe("parseFlow", () => {
  it("解析节点与默认值", () => {
    const flow = parseFlow(yaml, "demo");
    expect(flow.nodes.map((n) => n.id)).toEqual(["plan", "review", "implement"]);
    expect(flow.nodes[0].approve).toBe("all");
  });

  it("非法 yaml 报错时带上流程名", () => {
    expect(() => parseFlow("nodes: []", "demo")).toThrow(/demo/);
  });
});

describe("导航", () => {
  const flow = parseFlow(yaml, "demo");

  it("nextNode 在最后一个节点返回 null", () => {
    expect(nextNode(flow, "plan")).toBe("review");
    expect(nextNode(flow, "implement")).toBeNull();
  });

  it("prevNode 在第一个节点返回 null", () => {
    expect(prevNode(flow, "review")).toBe("plan");
    expect(prevNode(flow, "plan")).toBeNull();
  });

  it("nodeById 找不到就抛错", () => {
    expect(() => nodeById(flow, "nope")).toThrow(/nope/);
  });
});

describe("checkFlowAgents", () => {
  it("列出未声明的 agent", () => {
    const settings = SettingsSchema.parse({ agents: { product: { ref: "x" } } });
    expect(checkFlowAgents(parseFlow(yaml, "demo"), settings).sort()).toEqual([
      "designer",
      "engineer",
    ]);
  });

  it("声明但未绑定 ref 也算已声明", () => {
    const settings = SettingsSchema.parse({
      agents: { product: {}, designer: {}, engineer: {} },
    });
    expect(checkFlowAgents(parseFlow(yaml, "demo"), settings)).toEqual([]);
  });
});
