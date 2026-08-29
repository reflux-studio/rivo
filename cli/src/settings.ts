import { existsSync, readFileSync } from "node:fs";
import { type Settings, SettingsSchema } from "./schema.js";
import { globalSettingsPath, paths } from "./paths.js";

function readOne(path: string): Settings {
  if (!existsSync(path)) return SettingsSchema.parse({});
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`${path} 格式错误:\n${parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`);
  }
  return parsed.data;
}

/** Shallow merge; project values win per key, same as git config / .npmrc. */
export function mergeSettings(global: Settings, local: Settings): Settings {
  return {
    agents: { ...global.agents, ...local.agents },
    scripts: { ...global.scripts, ...local.scripts },
  };
}

export function loadSettings(workspaceDir: string): Settings {
  return mergeSettings(
    readOne(globalSettingsPath()),
    readOne(paths(workspaceDir).localSettings),
  );
}
