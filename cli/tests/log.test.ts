import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appendEvent, nowIso, readLog } from "../src/log.js";

function logFile() {
  return join(mkdtempSync(join(tmpdir(), "rivo-log-")), "log.jsonl");
}

describe("appendEvent / readLog", () => {
  it("追加后读回同一条事件", () => {
    const p = logFile();
    appendEvent(p, { t: "transition", ts: nowIso(), node: "plan", flow: "demo" });
    const { events, malformed } = readLog(p);
    expect(malformed).toBe(0);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ t: "transition", node: "plan" });
  });

  it("多次追加保持顺序", () => {
    const p = logFile();
    appendEvent(p, { t: "transition", ts: nowIso(), node: "plan" });
    appendEvent(p, { t: "approve", ts: nowIso(), node: "plan", by: "product", reason: "ok" });
    const { events } = readLog(p);
    expect(events.map((e) => e.t)).toEqual(["transition", "approve"]);
  });

  it("坏行被计数但不中断读取", () => {
    const p = logFile();
    appendEvent(p, { t: "transition", ts: nowIso(), node: "plan" });
    writeFileSync(p, readFileSync(p, "utf8") + "{ not json\n");
    appendEvent(p, { t: "approve", ts: nowIso(), node: "plan", by: "product", reason: "ok" });
    const { events, malformed } = readLog(p);
    expect(malformed).toBe(1);
    expect(events).toHaveLength(2);
  });

  it("log 不存在时返回空", () => {
    const { events, malformed } = readLog(logFile());
    expect(events).toEqual([]);
    expect(malformed).toBe(0);
  });

  it("reason 为空的 approve 写不进去", () => {
    const p = logFile();
    expect(() =>
      appendEvent(p, { t: "approve", ts: nowIso(), node: "plan", by: "x", reason: "" } as never),
    ).toThrow();
  });
});
