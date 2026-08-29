import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ home: "" }));

vi.mock("node:os", async (orig) => {
  const actual = await orig<typeof import("node:os")>();
  return { ...actual, homedir: () => state.home || actual.homedir() };
});

const { findWorkspace } = await import("../src/paths.js");

let home: string;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "rivo-fakehome-"));
  state.home = home;
});

describe("findWorkspace 与主目录", () => {
  it("主目录自己有 .rivo 也不算工作区", () => {
    mkdirSync(join(home, ".rivo"), { recursive: true });
    expect(() => findWorkspace(home)).toThrow(/rivo init/);
  });

  it("主目录下的项目不会向上落到主目录", () => {
    mkdirSync(join(home, ".rivo"), { recursive: true });
    const proj = join(home, "code", "app");
    mkdirSync(proj, { recursive: true });
    expect(() => findWorkspace(proj)).toThrow(/rivo init/);
  });

  it("项目自己有 .rivo 时正常找到", () => {
    const proj = join(home, "code", "app");
    mkdirSync(join(proj, ".rivo"), { recursive: true });
    expect(findWorkspace(join(proj, "src"))).toBe(proj);
  });
});
