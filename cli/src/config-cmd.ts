import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type Scope, paths, userFlowsDir, userSettingsPath } from "./paths.js";
import { flowSearchPath } from "./flow.js";
import { readSettingsFile } from "./settings.js";

function settingsPath(ws: string | null, scope: Scope): string {
  if (scope === "user") return userSettingsPath();
  if (!ws) throw new Error("--scope=project 需要在项目里执行,当前目录向上没有 .rivo 工作区");
  return paths(ws).localSettings;
}

function writeRaw(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Keep the local settings file out of git the moment it first appears. */
function ensureGitignore(ws: string) {
  const file = paths(ws).gitignore;
  const line = "settings.local.json";
  const existing = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (existing.split("\n").includes(line)) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, existing ? `${existing.replace(/\n*$/, "\n")}${line}\n` : `${line}\n`);
}

export function addAgent(
  ws: string | null,
  name: string,
  ref: string | undefined,
  scope: Scope,
): void {
  const path = settingsPath(ws, scope);
  const settings = readSettingsFile(path);
  settings.agents[name] = ref ? { ref } : {};
  // Gitignore the local settings file before it exists, so there is no window
  // where settings.local.json is on disk but untracked-by-git status isn't guaranteed yet.
  if (scope === "project" && ws) ensureGitignore(ws);
  writeRaw(path, settings);
}

export function removeAgent(ws: string | null, name: string, scope: Scope): void {
  const path = settingsPath(ws, scope);
  const settings = readSettingsFile(path);
  if (!(name in settings.agents)) throw new Error(`${path} 中没有 agent ${name}`);
  delete settings.agents[name];
  writeRaw(path, settings);
}

const FLOW_SKELETON = `# 节点按角色切,不按任务切:不发生交接就不切节点。
mode: manual                 # manual | auto
description: |
  这个流程解决什么问题,什么时候用它。

nodes:
  - id: first-node
    assignees: [<role>]      # 换成你的角色名,必须先 rivo agent add 声明;不绑 ref 表示人来做
    approve: all             # all | any | <数字>,默认 all
    instruction: |
      产出什么、输入在哪、什么时候可以 approve。三五行说清即可。
`;

export function newFlow(ws: string | null, name: string, scope: Scope): string {
  const dir = scope === "user" ? userFlowsDir() : flowsDirOf(ws);
  const file = join(dir, `${name}.yaml`);
  if (existsSync(file)) throw new Error(`流程 ${name} 已存在:${file}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, FLOW_SKELETON, "utf8");
  return file;
}

function flowsDirOf(ws: string | null): string {
  if (!ws) throw new Error("--scope=project 需要在项目里执行,当前目录向上没有 .rivo 工作区");
  return paths(ws).flowsDir;
}

function namesIn(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => f.replace(/\.yaml$/, ""));
}

/**
 * Union of both scopes, project first. A name present in both is listed once as
 * `project` — that is the one `loadFlow` will pick, and seeing which scope won
 * is the whole point of listing.
 */
export function listFlows(ws: string | null): { name: string; scope: Scope }[] {
  const out: { name: string; scope: Scope }[] = [];
  const seen = new Set<string>();
  for (const { scope, dir } of flowSearchPath(ws)) {
    for (const name of namesIn(dir)) {
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, scope });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
