import { existsSync, readFileSync } from "node:fs";
import { type Settings, SettingsSchema } from "./schema.js";
import { paths, userSettingsPath } from "./paths.js";

export function readSettingsFile(path: string): Settings {
  if (!existsSync(path)) return SettingsSchema.parse({});
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    throw new Error(`${path} 不是合法的 JSON:${e instanceof Error ? e.message : String(e)}`);
  }
  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`${path} 格式错误:\n${parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`);
  }
  return parsed.data;
}

/** Shallow merge; project values win per key, same as git config / .npmrc. */
export function mergeSettings(user: Settings, project: Settings): Settings {
  return {
    agents: { ...user.agents, ...project.agents },
    scripts: { ...user.scripts, ...project.scripts },
  };
}

/** `null` workspace = user settings only, for commands that run outside a project. */
export function loadSettings(workspaceDir: string | null): Settings {
  const user = readSettingsFile(userSettingsPath());
  if (!workspaceDir) return user;
  return mergeSettings(user, readSettingsFile(paths(workspaceDir).localSettings));
}
