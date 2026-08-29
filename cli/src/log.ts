import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { type Event, EventSchema } from "./schema.js";

export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Append-only, one line per call. No read-modify-write, so concurrent writers
 * never lose each other's events.
 */
export function appendEvent(logPath: string, event: Event): void {
  const validated = EventSchema.parse(event);
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify(validated)}\n`, "utf8");
}

export function readLog(logPath: string): { events: Event[]; malformed: number } {
  if (!existsSync(logPath)) return { events: [], malformed: 0 };
  const events: Event[] = [];
  let malformed = 0;
  for (const line of readFileSync(logPath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      events.push(EventSchema.parse(JSON.parse(line)));
    } catch {
      malformed += 1;
    }
  }
  return { events, malformed };
}
