import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { type Flow, type FlowNode, FlowSchema, type Settings } from "./schema.js";
import { paths } from "./paths.js";

export function parseFlow(text: string, name: string): Flow {
  const parsed = FlowSchema.safeParse(parseYaml(text));
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`流程 ${name} 定义有误:\n${detail}`);
  }
  return parsed.data;
}

export function loadFlow(workspaceDir: string, name: string): Flow {
  const file = join(paths(workspaceDir).flowsDir, `${name}.yaml`);
  if (!existsSync(file)) {
    throw new Error(`流程 ${name} 不存在:${file}`);
  }
  return parseFlow(readFileSync(file, "utf8"), name);
}

export function nodeIndex(flow: Flow, id: string): number {
  return flow.nodes.findIndex((n) => n.id === id);
}

export function nodeById(flow: Flow, id: string): FlowNode {
  const node = flow.nodes[nodeIndex(flow, id)];
  if (!node) throw new Error(`流程中没有节点 ${id}`);
  return node;
}

export function nextNode(flow: Flow, id: string): string | null {
  const i = nodeIndex(flow, id);
  if (i < 0) throw new Error(`流程中没有节点 ${id}`);
  return flow.nodes[i + 1]?.id ?? null;
}

export function prevNode(flow: Flow, id: string): string | null {
  const i = nodeIndex(flow, id);
  if (i < 0) throw new Error(`流程中没有节点 ${id}`);
  return i === 0 ? null : flow.nodes[i - 1].id;
}

/** Agent names referenced by the flow but not declared in settings. */
export function checkFlowAgents(flow: Flow, settings: Settings): string[] {
  const declared = new Set(Object.keys(settings.agents));
  const missing = new Set<string>();
  for (const node of flow.nodes) {
    for (const a of node.assignees) if (!declared.has(a)) missing.add(a);
  }
  return [...missing];
}
