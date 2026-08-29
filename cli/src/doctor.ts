import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkFlowAgents, parseFlow } from "./flow.js";
import { issuePaths, paths } from "./paths.js";
import { readLog } from "./log.js";
import { type Flow, SCRIPT_EVENTS, type Settings, SettingsSchema } from "./schema.js";
import { unknownVars } from "./scripts.js";
import { loadSettings } from "./settings.js";
import { foldLog } from "./state.js";

export type Problem = { where: string; message: string };

export function doctor(ws: string): Problem[] {
  const problems: Problem[] = [];
  // A corrupt settings file must not abort the run — doctor is what people
  // reach for when something is broken, and a bad settings file is exactly
  // the kind of broken they're running it for. Fall back to empty settings
  // so every later check still runs.
  let settings: Settings;
  try {
    settings = loadSettings(ws);
  } catch (e) {
    problems.push({ where: "settings", message: e instanceof Error ? e.message : String(e) });
    settings = SettingsSchema.parse({});
  }
  const { flowsDir, issuesDir } = paths(ws);

  if (Object.keys(settings.agents).length === 0) {
    problems.push({ where: "settings", message: "没有声明任何 agent,先跑 rivo agent add" });
  }

  for (const event of SCRIPT_EVENTS) {
    const template = settings.scripts[event];
    if (!template) continue;
    const unknown = unknownVars(template);
    if (unknown.length) {
      problems.push({
        where: `scripts.${event}`,
        message: `未知变量 ${unknown.map((v) => `{${v}}`).join(", ")}`,
      });
    }
  }

  const flowFiles = existsSync(flowsDir)
    ? readdirSync(flowsDir).filter((f) => f.endsWith(".yaml"))
    : [];
  const flows = new Map<string, Flow>();
  for (const file of flowFiles) {
    const where = `flows/${file}`;
    const name = file.replace(/\.yaml$/, "");
    try {
      const flow = parseFlow(readFileSync(join(flowsDir, file), "utf8"), name);
      flows.set(name, flow);
      const missing = checkFlowAgents(flow, settings);
      if (missing.length) {
        problems.push({ where, message: `引用了未声明的 agent:${missing.join(", ")}` });
      }
    } catch (e) {
      problems.push({ where, message: e instanceof Error ? e.message : String(e) });
    }
  }

  const slugs = existsSync(issuesDir) ? readdirSync(issuesDir) : [];
  for (const slug of slugs) {
    const { logPath } = issuePaths(ws, slug);
    if (!existsSync(logPath)) continue;
    const where = `issues/${slug}`;
    const { events, malformed } = readLog(logPath);
    if (malformed) problems.push({ where, message: `${malformed} 行 log 无法解析` });

    // Spec §9: changing a flow takes effect immediately on in-flight issues,
    // and doctor is what catches the node ids that no longer line up.
    const base = foldLog(events);
    const flow = flows.get(base.flow);
    const state = flow ? foldLog(events, flow) : base;
    if (state.stale) problems.push({ where, message: `${state.stale} 条陈旧事件被忽略` });
    if (state.closed) continue;
    if (!flow) {
      problems.push({ where, message: `流程 ${state.flow} 不存在或无法解析,交付看不了也推不动` });
      continue;
    }
    if (state.node && !flow.nodes.some((n) => n.id === state.node)) {
      problems.push({ where, message: `当前节点 ${state.node} 不在流程 ${state.flow} 中` });
    }
  }

  return problems;
}
