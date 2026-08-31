import { existsSync, mkdirSync, realpathSync } from "node:fs";
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
 * at the home directory. `~/.rivo` is the user-scope settings location, so
 * without this stop any project under $HOME without its own `.rivo` would
 * resolve to $HOME and write its log.jsonl outside every repository.
 */
export function findWorkspace(from: string): string | null {
  const home = real(homedir());
  let dir = resolve(from);
  for (;;) {
    if (atOrAboveHome(dir, home)) return null;
    if (existsSync(join(dir, ".rivo"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** For commands that read or advance an existing delivery: never creates. */
export function requireWorkspace(from: string): string {
  const ws = findWorkspace(from);
  if (!ws) {
    throw new Error(
      `从 ${from} 向上未找到 .rivo 工作区(查找到用户主目录为止);` +
        `在项目根目录跑 rivo issue new 会就地建立它`,
    );
  }
  return ws;
}

/**
 * For commands that legitimately start a workspace. Creates at `from` when the
 * upward walk finds nothing — but never at or above home, where delivery logs
 * would land outside every repository.
 */
export function ensureWorkspace(from: string): string {
  const found = findWorkspace(from);
  if (found) return found;
  const dir = resolve(from);
  if (atOrAboveHome(dir, real(homedir()))) {
    throw new Error("不能在用户主目录建立工作区:~/.rivo 是 user 作用域的配置目录,交付日志必须待在仓库里");
  }
  mkdirSync(join(dir, ".rivo"), { recursive: true });
  return dir;
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

/** Where a config or flow definition lives. Project shadows user on lookup. */
export type Scope = "user" | "project";

/** The user-scope root: settings plus flow templates shared across projects. */
export function userRivoDir(): string {
  return join(homedir(), ".rivo");
}

export function userSettingsPath(): string {
  return join(userRivoDir(), "settings.json");
}

export function userFlowsDir(): string {
  return join(userRivoDir(), "flows");
}
