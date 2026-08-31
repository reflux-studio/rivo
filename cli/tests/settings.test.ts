import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { findWorkspace, issuePaths, userSettingsPath as origUserSettingsPath } from "../src/paths.js";
import { mergeSettings, loadSettings } from "../src/settings.js";
import * as pathsModule from "../src/paths.js";

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

  it("找不到就返回 null,由调用方决定是建还是报错", () => {
    const bare = mkdtempSync(join(tmpdir(), "bare-"));
    expect(findWorkspace(bare)).toBeNull();
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

describe("loadSettings with file I/O", () => {
  it("两个文件都不存在时返回空 settings", () => {
    const tempGlobalPath = join(mkdtempSync(join(tmpdir(), "global-")), "settings.json");
    const workspaceDir = mkdtempSync(join(tmpdir(), "ws-"));
    mkdirSync(join(workspaceDir, ".rivo"), { recursive: true });

    vi.spyOn(pathsModule, "userSettingsPath").mockReturnValue(tempGlobalPath);

    const result = loadSettings(workspaceDir);
    expect(result).toEqual({ agents: {}, scripts: {} });

    vi.restoreAllMocks();
  });

  it("只有全局文件时使用其值", () => {
    const tempGlobalPath = join(mkdtempSync(join(tmpdir(), "global-")), "settings.json");
    const workspaceDir = mkdtempSync(join(tmpdir(), "ws-"));
    mkdirSync(join(workspaceDir, ".rivo"), { recursive: true });

    writeFileSync(tempGlobalPath, JSON.stringify({
      agents: { engineer: { ref: "global-eng" } },
      scripts: { transition: "g-trans" },
    }));

    vi.spyOn(pathsModule, "userSettingsPath").mockReturnValue(tempGlobalPath);

    const result = loadSettings(workspaceDir);
    expect(result.agents.engineer.ref).toBe("global-eng");
    expect(result.scripts.transition).toBe("g-trans");

    vi.restoreAllMocks();
  });

  it("两个文件都存在时项目覆盖全局", () => {
    const tempGlobalPath = join(mkdtempSync(join(tmpdir(), "global-")), "settings.json");
    const workspaceDir = mkdtempSync(join(tmpdir(), "ws-"));
    mkdirSync(join(workspaceDir, ".rivo"), { recursive: true });

    writeFileSync(tempGlobalPath, JSON.stringify({
      agents: { product: { ref: "p-global" }, engineer: { ref: "e-global" } },
      scripts: { transition: "g-trans", close: "g-close" },
    }));

    writeFileSync(join(workspaceDir, ".rivo", "settings.local.json"), JSON.stringify({
      agents: { engineer: { ref: "e-local" } },
      scripts: { transition: "l-trans" },
    }));

    vi.spyOn(pathsModule, "userSettingsPath").mockReturnValue(tempGlobalPath);

    const result = loadSettings(workspaceDir);
    expect(result.agents.engineer.ref).toBe("e-local");
    expect(result.agents.product.ref).toBe("p-global");
    expect(result.scripts.transition).toBe("l-trans");
    expect(result.scripts.close).toBe("g-close");

    vi.restoreAllMocks();
  });

  it("未知 script key 时抛错并包含文件路径", () => {
    const tempGlobalPath = join(mkdtempSync(join(tmpdir(), "global-")), "settings.json");
    const workspaceDir = mkdtempSync(join(tmpdir(), "ws-"));
    mkdirSync(join(workspaceDir, ".rivo"), { recursive: true });

    writeFileSync(join(workspaceDir, ".rivo", "settings.local.json"), JSON.stringify({
      agents: {},
      scripts: { transitoin: "x" },
    }));

    vi.spyOn(pathsModule, "userSettingsPath").mockReturnValue(tempGlobalPath);

    const localSettingsPath = join(workspaceDir, ".rivo", "settings.local.json");
    expect(() => loadSettings(workspaceDir)).toThrow();
    try {
      loadSettings(workspaceDir);
    } catch (e) {
      expect((e as Error).message).toContain(localSettingsPath);
    }

    vi.restoreAllMocks();
  });
});
