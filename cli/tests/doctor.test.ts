import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const settings = { agents: {} as Record<string, { ref?: string }>, scripts: {} as Record<string, string> };

vi.mock("../src/settings.js", async (orig) => {
  const actual = await orig<typeof import("../src/settings.js")>();
  return { ...actual, loadSettings: () => settings };
});

const { doctor } = await import("../src/doctor.js");

let ws: string;

beforeEach(() => {
  ws = mkdtempSync(join(tmpdir(), "rivo-doctor-"));
  mkdirSync(join(ws, ".rivo", "flows"), { recursive: true });
  settings.agents = {};
  settings.scripts = {};
});

function writeFlow(name: string, body: string) {
  writeFileSync(join(ws, ".rivo", "flows", `${name}.yaml`), body);
}

const ts = "2026-08-29T10:00:00Z";

function writeIssue(slug: string, events: object[]) {
  const dir = join(ws, ".rivo", "issues", slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(dir + "/log.jsonl", `${events.map((e) => JSON.stringify(e)).join("\n")}\n`);
}

describe("doctor", () => {
  it("报出未声明的 agent", () => {
    writeFlow("demo", "nodes:\n  - id: plan\n    assignees: [product]\n");
    const problems = doctor(ws);
    expect(problems.some((p) => p.message.includes("product"))).toBe(true);
  });

  it("报出 schema 非法的流程", () => {
    writeFlow("bad", "nodes: []\n");
    expect(doctor(ws).some((p) => p.where === "flows/bad.yaml")).toBe(true);
  });

  it("报出模板里的未知变量", () => {
    settings.agents = { product: {} };
    settings.scripts = { transition: "mycli --id={agnet_ref}" };
    writeFlow("demo", "nodes:\n  - id: plan\n    assignees: [product]\n");
    expect(doctor(ws).some((p) => p.message.includes("agnet_ref"))).toBe(true);
  });

  it("agents 为空时报出来", () => {
    expect(doctor(ws).some((p) => p.message.includes("没有声明任何 agent"))).toBe(true);
  });

  it("在途 issue 的当前节点不在流程里时报出来", () => {
    settings.agents = { product: {} };
    writeFlow("demo", "nodes:\n  - id: renamed\n    assignees: [product]\n");
    writeIssue("fix-login", [{ t: "transition", ts, node: "plan", flow: "demo" }]);
    expect(doctor(ws).some((p) => p.message.includes("当前节点 plan"))).toBe(true);
  });

  it("在途 issue 的流程文件不存在时报出来", () => {
    settings.agents = { product: {} };
    writeIssue("fix-login", [{ t: "transition", ts, node: "plan", flow: "gone" }]);
    expect(doctor(ws).some((p) => p.message.includes("流程 gone"))).toBe(true);
  });

  it("已关闭的 issue 不因流程变化报错", () => {
    settings.agents = { product: {} };
    writeIssue("done", [
      { t: "transition", ts, node: "plan", flow: "gone" },
      { t: "close", ts, by: "human" },
    ]);
    expect(doctor(ws)).toEqual([]);
  });

  it("全部合法时返回空数组", () => {
    settings.agents = { product: {} };
    settings.scripts = { transition: "mycli assign {issue_slug} --to {agent_ref}" };
    writeFlow("demo", "nodes:\n  - id: plan\n    assignees: [product]\n");
    expect(doctor(ws)).toEqual([]);
  });
});
