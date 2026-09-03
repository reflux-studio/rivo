import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type Scope, paths, userFlowsDir } from "./paths.js";
import { flowSearchPath } from "./flow.js";

const FLOW_SKELETON = `# 节点按角色切,不按任务切:不发生交接就不切节点。
mode: manual                 # manual | auto
description: |
  这个流程解决什么问题,什么时候用它。

nodes:
  - id: first-node
    assignees: [<name>]      # 你自己起的名字,rivo 不校验。想让 rivo 唤起它,就在
                             # settings.json 的 agents 里给这个名字配一个 ref;
                             # 不配就是没东西可唤起,停在这里等人
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
