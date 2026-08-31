import { existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ home: "" }));

vi.mock("node:os", async (orig) => {
  const actual = await orig<typeof import("node:os")>();
  return { ...actual, homedir: () => state.home || actual.homedir() };
});

const { findWorkspace, ensureWorkspace } = await import("../src/paths.js");

let home: string;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "rivo-fakehome-"));
  state.home = home;
});

describe("findWorkspace 与主目录", () => {
  it("主目录自己有 .rivo 也不算工作区", () => {
    mkdirSync(join(home, ".rivo"), { recursive: true });
    expect(findWorkspace(home)).toBeNull();
  });

  it("主目录下的项目不会向上落到主目录", () => {
    mkdirSync(join(home, ".rivo"), { recursive: true });
    const proj = join(home, "code", "app");
    mkdirSync(proj, { recursive: true });
    expect(findWorkspace(proj)).toBeNull();
  });

  it("项目自己有 .rivo 时正常找到", () => {
    const proj = join(home, "code", "app");
    mkdirSync(join(proj, ".rivo"), { recursive: true });
    expect(findWorkspace(join(proj, "src"))).toBe(proj);
  });
});

describe("ensureWorkspace", () => {
  it("找不到就在当前目录建,而不是要求先跑一个初始化命令", () => {
    const proj = join(home, "code", "app");
    mkdirSync(proj, { recursive: true });
    expect(ensureWorkspace(proj)).toBe(proj);
    expect(existsSync(join(proj, ".rivo"))).toBe(true);
    expect(existsSync(join(home, ".rivo", "issues"))).toBe(false);
  });

  it("向上找到了就用找到的那个,不在子目录里另起一个", () => {
    const proj = join(home, "code", "app");
    mkdirSync(join(proj, ".rivo"), { recursive: true });
    const sub = join(proj, "src", "deep");
    mkdirSync(sub, { recursive: true });
    expect(ensureWorkspace(sub)).toBe(proj);
    expect(existsSync(join(sub, ".rivo"))).toBe(false);
  });

  it("拒绝在主目录建:交付日志必须待在仓库里", () => {
    mkdirSync(join(home, ".rivo"), { recursive: true });
    expect(() => ensureWorkspace(home)).toThrow(/主目录/);
  });
});
