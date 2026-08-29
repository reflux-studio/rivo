import { execFileSync } from "node:child_process";
import {
  type ScriptEvent,
  type Settings,
  TEMPLATE_VARS,
  type TemplateVar,
} from "./schema.js";

export type Vars = Partial<Record<TemplateVar, string>>;

const VAR_PATTERN = /\{([a-z_]+)\}/g;
const KNOWN = new Set<string>(TEMPLATE_VARS);

/**
 * Split on whitespace FIRST, then substitute. A variable's value therefore
 * always lands in exactly one argv element, no matter what it contains, and
 * nothing ever reaches a shell.
 */
export function renderTemplate(template: string, vars: Vars): string[] {
  return template
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) =>
      word.replace(VAR_PATTERN, (_, name: string) => vars[name as TemplateVar] ?? ""),
    );
}

export function unknownVars(template: string): string[] {
  const found = new Set<string>();
  for (const match of template.matchAll(VAR_PATTERN)) {
    if (!KNOWN.has(match[1])) found.add(match[1]);
  }
  return [...found];
}

/**
 * Unattended agents drive this, so a hang is worse than a failure: a script
 * that waits on stdin or never returns would block the CLI forever with the
 * transition already committed. Bounded and stdin-less instead.
 */
const TIMEOUT_MS = 30_000;

/**
 * Notification is best effort: the log is the source of truth, so a failing
 * script never rolls anything back. The transition is already committed by
 * the time this runs; on failure the caller warns and recovery is manual.
 */
export function runScript(
  settings: Settings,
  event: ScriptEvent,
  vars: Vars,
): { ran: boolean; error?: string } {
  const template = settings.scripts[event];
  if (!template) return { ran: false };

  const [cmd, ...args] = renderTemplate(template, vars);
  if (!cmd) return { ran: false, error: `scripts.${event} 模板为空` };

  try {
    execFileSync(cmd, args, { stdio: ["ignore", "inherit", "inherit"], timeout: TIMEOUT_MS });
    return { ran: true };
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code === "ETIMEDOUT") {
      return { ran: false, error: `scripts.${event} 超过 ${TIMEOUT_MS / 1000} 秒未结束,已终止` };
    }
    return { ran: false, error: e instanceof Error ? e.message : String(e) };
  }
}
