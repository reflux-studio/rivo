import { existsSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

/**
 * Symlinked paths compare unequal otherwise: on macOS `os.homedir()` yields the
 * `/var/...` form while `process.cwd()` yields `/private/var/...`.
 */
function real(dir: string): string {
  try {
    return realpathSync(dir);
  } catch {
    return resolve(dir);
  }
}

/** True when `dir` is the home directory itself or one of its ancestors. */
function atOrAboveHome(dir: string, home: string): boolean {
  const rel = relative(real(dir), home);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

/**
 * Walk up from `from` until a directory containing `.rivo/` is found, stopping
 * at the home directory. `~/.rivo` is the global settings location, so without
 * this stop any project under $HOME without its own `.rivo` would silently
 * resolve to $HOME and write its log.jsonl outside every repository.
 */
export function findWorkspace(from: string): string {
  const home = real(homedir());
  let dir = resolve(from);
  for (;;) {
    if (atOrAboveHome(dir, home)) break;
    if (existsSync(join(dir, ".rivo"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`从 ${from} 向上未找到 .rivo 目录(不含用户主目录),先在项目根目录跑 rivo init`);
}

/** `rivo init` here would build a workspace findWorkspace then refuses to resolve. */
export function isHomeDir(dir: string): boolean {
  return real(dir) === real(homedir());
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
