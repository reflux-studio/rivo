import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

/** Walk up from `from` until a directory containing `.rivo/` is found. */
export function findWorkspace(from: string): string {
  let dir = resolve(from);
  for (;;) {
    if (existsSync(join(dir, ".rivo"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(`从 ${from} 向上未找到 .rivo 目录,先跑 rivo issue new`);
    }
    dir = parent;
  }
}

export function paths(workspaceDir: string) {
  const rivoDir = join(workspaceDir, ".rivo");
  return {
    rivoDir,
    flowsDir: join(rivoDir, "flows"),
    issuesDir: join(rivoDir, "issues"),
    localSettings: join(rivoDir, "settings.local.json"),
    gitignore: join(rivoDir, ".gitignore"),
  };
}

export function issuePaths(workspaceDir: string, slug: string) {
  const issueDir = join(workspaceDir, ".rivo", "issues", slug);
  return { issueDir, logPath: join(issueDir, "log.jsonl") };
}

export function globalSettingsPath(): string {
  return join(homedir(), ".rivo", "settings.json");
}
