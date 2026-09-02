import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { type Flow, type FlowNode, FlowSchema } from "./schema.js";
import { type Scope, paths, userFlowsDir } from "./paths.js";

export function parseFlow(text: string, name: string): Flow {
  let raw: unknown;
  try {
    raw = parseYaml(text);
  } catch (e) {
    throw new Error(`流程 ${name} 不是合法的 YAML:${e instanceof Error ? e.message : String(e)}`);
  }
  const parsed = FlowSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`流程 ${name} 定义有误:\n${detail}`);
  }
  return parsed.data;
}

/** Lookup order for flow definitions: a repo's own definition beats the personal template. */
export function flowSearchPath(workspaceDir: string | null): { scope: Scope; dir: string }[] {
  const dirs: { scope: Scope; dir: string }[] = [];
  if (workspaceDir) dirs.push({ scope: "project", dir: paths(workspaceDir).flowsDir });
  dirs.push({ scope: "user", dir: userFlowsDir() });
  return dirs;
}

export function resolveFlow(
  workspaceDir: string | null,
  name: string,
): { file: string; scope: Scope } | null {
  for (const { scope, dir } of flowSearchPath(workspaceDir)) {
    const file = join(dir, `${name}.yaml`);
    if (existsSync(file)) return { file, scope };
  }
  return null;
}

export function loadFlow(workspaceDir: string | null, name: string): Flow {
  const hit = resolveFlow(workspaceDir, name);
  if (!hit) {
    const tried = flowSearchPath(workspaceDir)
      .map((s) => `  ${join(s.dir, `${name}.yaml`)}`)
      .join("\n");
    throw new Error(`流程 ${name} 不存在,已找过:\n${tried}`);
  }
  return parseFlow(readFileSync(hit.file, "utf8"), name);
}

/** Flow has no name field, so callers that know it pass it in for the message. */
function noSuchNode(id: string, flowName?: string): string {
  return flowName ? `流程 ${flowName} 中没有节点 ${id}` : `流程中没有节点 ${id}`;
}

export function nodeIndex(flow: Flow, id: string): number {
  return flow.nodes.findIndex((n) => n.id === id);
}

export function nodeById(flow: Flow, id: string, flowName?: string): FlowNode {
  const node = flow.nodes[nodeIndex(flow, id)];
  if (!node) throw new Error(noSuchNode(id, flowName));
  return node;
}

export function nextNode(flow: Flow, id: string, flowName?: string): string | null {
  const i = nodeIndex(flow, id);
  if (i < 0) throw new Error(noSuchNode(id, flowName));
  return flow.nodes[i + 1]?.id ?? null;
}

export function prevNode(flow: Flow, id: string, flowName?: string): string | null {
  const i = nodeIndex(flow, id);
  if (i < 0) throw new Error(noSuchNode(id, flowName));
  return i === 0 ? null : flow.nodes[i - 1].id;
}
