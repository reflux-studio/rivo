import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findWorkspace, issuePaths } from "../src/paths.js";
import { mergeSettings } from "../src/settings.js";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "rivo-"));
  mkdirSync(join(root, ".rivo", "flows"), { recursive: true });
  return root;
}

describe("findWorkspace", () => {
  it("从子目录向上找到 .rivo", () => {
    const root = fixture();
    const deep = join(root, "a", "b");
    mkdirSync(deep, { recursive: true });
    expect(findWorkspace(deep)).toBe(root);
  });

  it("找不到就抛错", () => {
    const bare = mkdtempSync(join(tmpdir(), "bare-"));
    expect(() => findWorkspace(bare)).toThrow(/未找到 \.rivo/);
  });
});

describe("issuePaths", () => {
  it("拼出 issue 目录与 log 路径", () => {
    const p = issuePaths("/w", "fix-login");
    expect(p.issueDir).toBe("/w/.rivo/issues/fix-login");
    expect(p.logPath).toBe("/w/.rivo/issues/fix-login/log.jsonl");
  });
});

describe("mergeSettings", () => {
  it("项目覆盖全局的同名 agent", () => {
    const merged = mergeSettings(
      { agents: { engineer: { ref: "global" } }, scripts: { transition: "g" } },
      { agents: { engineer: { ref: "local" } }, scripts: {} },
    );
    expect(merged.agents.engineer.ref).toBe("local");
  });

  it("项目没写的 key 保留全局值", () => {
    const merged = mergeSettings(
      { agents: { product: { ref: "p" } }, scripts: { transition: "g" } },
      { agents: { engineer: { ref: "e" } }, scripts: {} },
    );
    expect(merged.agents.product.ref).toBe("p");
    expect(merged.agents.engineer.ref).toBe("e");
    expect(merged.scripts.transition).toBe("g");
  });

  it("项目的 script 覆盖全局", () => {
    const merged = mergeSettings(
      { agents: {}, scripts: { transition: "g", close: "gc" } },
      { agents: {}, scripts: { transition: "l" } },
    );
    expect(merged.scripts.transition).toBe("l");
    expect(merged.scripts.close).toBe("gc");
  });
});
