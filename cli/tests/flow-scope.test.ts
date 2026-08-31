import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ home: "" }));

vi.mock("node:os", async (orig) => {
  const actual = await orig<typeof import("node:os")>();
  return { ...actual, homedir: () => state.home || actual.homedir() };
});

const { loadFlow, resolveFlow } = await import("../src/flow.js");
const { listFlows, newFlow } = await import("../src/config-cmd.js");

let home: string;
let proj: string;

const flow = (node: string) => `nodes:\n  - id: ${node}\n    assignees: [product]\n`;

function writeFlow(dir: string, name: string, node: string) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.yaml`), flow(node), "utf8");
}

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "rivo-fakehome-"));
  state.home = home;
  proj = join(home, "code", "app");
  mkdirSync(join(proj, ".rivo"), { recursive: true });
});

describe("flow 的两层作用域", () => {
  it("项目里没有时回退到 user", () => {
    writeFlow(join(home, ".rivo", "flows"), "demo", "from-user");
    expect(loadFlow(proj, "demo").nodes[0].id).toBe("from-user");
  });

  it("两层都有时项目覆盖 user", () => {
    writeFlow(join(home, ".rivo", "flows"), "demo", "from-user");
    writeFlow(join(proj, ".rivo", "flows"), "demo", "from-project");
    expect(resolveFlow(proj, "demo")?.scope).toBe("project");
    expect(loadFlow(proj, "demo").nodes[0].id).toBe("from-project");
  });

  it("没有工作区时仍然能读到 user 的流程", () => {
    writeFlow(join(home, ".rivo", "flows"), "demo", "from-user");
    expect(loadFlow(null, "demo").nodes[0].id).toBe("from-user");
  });

  it("两层都没有时,报错列出找过的路径", () => {
    expect(() => loadFlow(proj, "demo")).toThrow(/已找过[\s\S]*\.rivo/);
  });
});

describe("listFlows", () => {
  it("合并两层,重名只出现一次并标成 project", () => {
    writeFlow(join(home, ".rivo", "flows"), "demo", "n");
    writeFlow(join(home, ".rivo", "flows"), "only-user", "n");
    writeFlow(join(proj, ".rivo", "flows"), "demo", "n");

    expect(listFlows(proj)).toEqual([
      { name: "demo", scope: "project" },
      { name: "only-user", scope: "user" },
    ]);
  });
});

describe("newFlow", () => {
  it("--scope=user 写进 ~/.rivo/flows,不碰项目", () => {
    const file = newFlow(null, "demo", "user");
    expect(file).toBe(join(home, ".rivo", "flows", "demo.yaml"));
    expect(existsSync(join(proj, ".rivo", "flows", "demo.yaml"))).toBe(false);
  });

  it("--scope=project 在项目外执行时报错,而不是悄悄写进 user", () => {
    expect(() => newFlow(null, "demo", "project")).toThrow(/--scope=project/);
    expect(existsSync(join(home, ".rivo", "flows", "demo.yaml"))).toBe(false);
  });
});
