import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { globalSettingsPath, paths } from "./paths.js";
import { readSettingsFile } from "./settings.js";

function targetPath(ws: string, local: boolean): string {
  return local ? paths(ws).localSettings : globalSettingsPath();
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

export function addAgent(ws: string, name: string, ref: string | undefined, local: boolean): void {
  const path = targetPath(ws, local);
  const settings = readSettingsFile(path);
  settings.agents[name] = ref ? { ref } : {};
  // Gitignore the local settings file before it exists, so there is no window
  // where settings.local.json is on disk but untracked-by-git status isn't guaranteed yet.
  if (local) ensureGitignore(ws);
  writeRaw(path, settings);
}

export function removeAgent(ws: string, name: string, local: boolean): void {
  const path = targetPath(ws, local);
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
    assignees: [product]     # 必须先 rivo agent add 声明;不绑 ref 表示人来做
    approve: all             # all | any | <数字>,默认 all
    instruction: |
      产出什么、输入在哪、什么时候可以 approve。三五行说清即可。
`;

export function newFlow(ws: string, name: string): string {
  const file = join(paths(ws).flowsDir, `${name}.yaml`);
  if (existsSync(file)) throw new Error(`流程 ${name} 已存在:${file}`);
  mkdirSync(paths(ws).flowsDir, { recursive: true });
  writeFileSync(file, FLOW_SKELETON, "utf8");
  return file;
}

export function listFlows(ws: string): string[] {
  const dir = paths(ws).flowsDir;
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => f.replace(/\.yaml$/, ""));
}
