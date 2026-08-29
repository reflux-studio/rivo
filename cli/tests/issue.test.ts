import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

// A mutable object so individual tests can configure agent declarations and
// notification scripts without affecting the rest of the suite.
const { settingsState, runScriptCalls } = vi.hoisted(() => ({
  settingsState: {
    agents: { product: {}, designer: {}, engineer: {} } as Record<string, { ref?: string }>,
    scripts: {} as Record<string, string>,
  },
  runScriptCalls: [] as { event: string; agent: string; agentRef: string }[],
}));

vi.mock("../src/settings.js", async (orig) => {
  const actual = await orig<typeof import("../src/settings.js")>();
  return {
    ...actual,
    loadSettings: () => settingsState,
  };
});

// Records who notifyEntered actually called runScript for, then delegates to
// the real implementation (a no-op when no script template is configured).
vi.mock("../src/scripts.js", async (orig) => {
  const actual = await orig<typeof import("../src/scripts.js")>();
  return {
    ...actual,
    runScript: (
      settings: Parameters<typeof actual.runScript>[0],
      event: Parameters<typeof actual.runScript>[1],
      vars: Parameters<typeof actual.runScript>[2],
    ) => {
      runScriptCalls.push({ event, agent: vars.agent ?? "", agentRef: vars.agent_ref ?? "" });
      return actual.runScript(settings, event, vars);
    },
  };
});

const { closeIssue, newIssue, recallIssue, recordVerdict, showIssue } = await import(
  "../src/issue.js"
);

let ws: string;

beforeEach(() => {
  settingsState.agents = { product: {}, designer: {}, engineer: {} };
  settingsState.scripts = {};
  runScriptCalls.length = 0;
  ws = mkdtempSync(join(tmpdir(), "rivo-issue-"));
  mkdirSync(join(ws, ".rivo", "flows"), { recursive: true });
  writeFileSync(
    join(ws, ".rivo", "flows", "demo.yaml"),
    `
nodes:
  - id: plan
    assignees: [product]
    instruction: 写方案
  - id: review
    assignees: [designer, engineer]
  - id: implement
    assignees: [engineer]
`,
  );
});

describe("newIssue", () => {
  it("建目录并落第一条 transition", () => {
    newIssue(ws, "fix-login", "demo");
    const view = showIssue(ws, "fix-login");
    expect(view.node).toBe("plan");
    expect(view.flow).toBe("demo");
    expect(view.assignees).toEqual(["product"]);
    expect(view.instruction).toBe("写方案");
  });

  it("重复创建同名 issue 报错", () => {
    newIssue(ws, "fix-login", "demo");
    expect(() => newIssue(ws, "fix-login", "demo")).toThrow(/已存在/);
  });

  it("流程不存在时报错", () => {
    expect(() => newIssue(ws, "x", "nope")).toThrow(/nope/);
  });

  it("assignee 声明了 ref 时触发通知脚本", () => {
    settingsState.agents.product = { ref: "product-bot" };
    newIssue(ws, "i", "demo");
    const call = runScriptCalls.find((c) => c.agent === "product");
    expect(call).toBeDefined();
    expect(call?.agentRef).toBe("product-bot");
  });

  it("assignee 没有 ref 时不触发通知脚本(人工节点),但流转仍然发生", () => {
    // fixture 里 product 没有声明 ref
    newIssue(ws, "i", "demo");
    const call = runScriptCalls.find((c) => c.agent === "product");
    expect(call).toBeUndefined();
    const view = showIssue(ws, "i");
    expect(view.node).toBe("plan");
  });
});

describe("未声明的 agent", () => {
  it("new 时仍然拒绝引用了未声明 agent 的流程", () => {
    writeFileSync(
      join(ws, ".rivo", "flows", "orphan.yaml"),
      `
nodes:
  - id: plan
    assignees: [ghost]
`,
    );
    expect(() => newIssue(ws, "o", "orphan")).toThrow(/ghost/);
  });

  it("settings 中途撤掉声明后不能把交付变砖:show/推进/close 都不报错,只是警告", () => {
    writeFileSync(
      join(ws, ".rivo", "flows", "orphan.yaml"),
      `
nodes:
  - id: plan
    assignees: [ghost]
  - id: review
    assignees: [ghost]
`,
    );
    settingsState.agents.ghost = {}; // 声明够用,先把 issue 建出来
    newIssue(ws, "o", "orphan");
    delete settingsState.agents.ghost; // 创建之后 settings 漂移:撤掉声明

    expect(() => showIssue(ws, "o")).not.toThrow();

    // vi.spyOn(console, "warn") gets clobbered mid-test by vitest's own
    // console interception in this setup, so capture calls with a plain
    // monkey-patch instead — the smallest thing that reliably works.
    const originalWarn = console.warn;
    const warnCalls: unknown[][] = [];
    console.warn = (...args: unknown[]) => {
      warnCalls.push(args);
    };
    let threw: unknown;
    try {
      recordVerdict(ws, "o", "ghost", "approve", "ok");
    } catch (e) {
      threw = e;
    } finally {
      console.warn = originalWarn;
    }
    expect(threw).toBeUndefined();
    expect(warnCalls.some((c) => String(c[0]).includes("ghost"))).toBe(true);

    const view = showIssue(ws, "o");
    expect(view.node).toBe("review");

    expect(() => closeIssue(ws, "o", "human", "结束")).not.toThrow();
  });
});

describe("recordVerdict", () => {
  it("单人节点 approve 后流转到下一节点", () => {
    newIssue(ws, "i", "demo");
    recordVerdict(ws, "i", "product", "approve", "方案完成");
    const view = showIssue(ws, "i");
    expect(view.node).toBe("review");
    expect(view.path).toEqual(["plan", "review"]);
  });

  it("多人节点只有一人表态时留在原地并列出 pending", () => {
    newIssue(ws, "i", "demo");
    recordVerdict(ws, "i", "product", "approve", "ok");
    recordVerdict(ws, "i", "designer", "approve", "无关");
    const view = showIssue(ws, "i");
    expect(view.node).toBe("review");
    expect(view.pending).toEqual(["engineer"]);
  });

  it("表态齐且有 reject 时打回上游", () => {
    newIssue(ws, "i", "demo");
    recordVerdict(ws, "i", "product", "approve", "ok");
    recordVerdict(ws, "i", "designer", "approve", "无关");
    recordVerdict(ws, "i", "engineer", "reject", "成本低估");
    const view = showIssue(ws, "i");
    expect(view.node).toBe("plan");
    expect(view.verdicts).toEqual([]);
  });

  it("非 assignee 表态被拒绝", () => {
    newIssue(ws, "i", "demo");
    expect(() => recordVerdict(ws, "i", "engineer", "approve", "x")).toThrow(/不是节点/);
  });

  it("走完最后一个节点后 completed 为真且 node 保持不变", () => {
    newIssue(ws, "i", "demo");
    recordVerdict(ws, "i", "product", "approve", "ok");
    recordVerdict(ws, "i", "designer", "approve", "ok");
    recordVerdict(ws, "i", "engineer", "approve", "ok");
    recordVerdict(ws, "i", "engineer", "approve", "实现完成");
    const view = showIssue(ws, "i");
    expect(view.completed).toBe(true);
    expect(view.node).toBe("implement");
  });

  it("已 close 的 issue 不能再表态", () => {
    newIssue(ws, "i", "demo");
    closeIssue(ws, "i", "human", "不做了");
    expect(() => recordVerdict(ws, "i", "product", "approve", "x")).toThrow(/已关闭/);
  });

  it("首节点打回被拒绝,且不写入任何事件", () => {
    newIssue(ws, "i", "demo");
    expect(() => recordVerdict(ws, "i", "product", "reject", "不该做")).toThrow(/没有上游/);
    const view = showIssue(ws, "i");
    expect(view.node).toBe("plan");
    expect(view.verdicts).toEqual([]);
  });

  it("打回到下游节点被拒绝,且不写入任何事件", () => {
    newIssue(ws, "i", "demo");
    recordVerdict(ws, "i", "product", "approve", "ok");
    expect(() =>
      recordVerdict(ws, "i", "designer", "reject", "想跳过", "implement"),
    ).toThrow(/之前/);
    const view = showIssue(ws, "i");
    expect(view.node).toBe("review");
    expect(view.verdicts).toEqual([]);
  });

  it("通知脚本执行失败不影响流转,且不抛出", () => {
    // review's assignees need a ref, otherwise notifyEntered skips them
    // entirely (they're human) and never calls the failing script.
    settingsState.agents.designer = { ref: "designer-bot" };
    settingsState.agents.engineer = { ref: "engineer-bot" };
    newIssue(ws, "i", "demo");
    settingsState.scripts.transition = "/no/such/rivo-notify-script-xyz";
    expect(() => recordVerdict(ws, "i", "product", "approve", "ok")).not.toThrow();
    const view = showIssue(ws, "i");
    expect(view.node).toBe("review");
  });
});

describe("recallIssue", () => {
  it("从任意节点拉回上游", () => {
    newIssue(ws, "i", "demo");
    recordVerdict(ws, "i", "product", "approve", "ok");
    recallIssue(ws, "i", "human", "plan", "需求变更");
    const view = showIssue(ws, "i");
    expect(view.node).toBe("plan");
  });

  it("不允许往前跳", () => {
    newIssue(ws, "i", "demo");
    expect(() => recallIssue(ws, "i", "human", "implement", "跳过评审")).toThrow(/只能回退/);
  });

  it("目标节点不存在时报错", () => {
    newIssue(ws, "i", "demo");
    expect(() => recallIssue(ws, "i", "human", "nope", "x")).toThrow(/nope/);
  });
});
