import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { doctor } from "../src/doctor.js";
import * as pathsModule from "../src/paths.js";

// Deliberately does NOT mock settings.js, unlike doctor.test.ts — this test
// needs the real loadSettings to actually throw on a corrupt file on disk.

describe("doctor 遇到损坏的 settings 文件", () => {
  it("不因 settings 损坏中断,同一次运行里流程问题也一起报出", () => {
    const tempGlobalPath = join(mkdtempSync(join(tmpdir(), "global-")), "settings.json");
    const ws = mkdtempSync(join(tmpdir(), "rivo-doctor-err-"));
    mkdirSync(join(ws, ".rivo", "flows"), { recursive: true });

    writeFileSync(join(ws, ".rivo", "settings.local.json"), "{not valid json");
    writeFileSync(
      join(ws, ".rivo", "flows", "demo.yaml"),
      "nodes:\n  - id: plan\n    assignees: [product]\n",
    );

    vi.spyOn(pathsModule, "userSettingsPath").mockReturnValue(tempGlobalPath);

    const problems = doctor(ws);

    expect(problems.some((p) => p.where === "settings")).toBe(true);
    expect(problems.some((p) => p.message.includes("product"))).toBe(true);
    expect(problems.length).toBeGreaterThanOrEqual(2);

    vi.restoreAllMocks();
  });
});
