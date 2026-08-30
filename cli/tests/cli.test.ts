import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

// End-to-end against the built CLI. Every unit test in this suite mocks the
// module that would fail on a fresh machine, which is exactly how "the CLI
// cannot bootstrap itself" survived nine reviews — so run the real binary.
const cliRoot = fileURLToPath(new URL("..", import.meta.url));
const cliJs = join(cliRoot, "dist", "cli.js");

function run(args: string[], cwd: string, home: string) {
  const r = spawnSync(process.execPath, [cliJs, ...args], {
    cwd,
    env: { ...process.env, HOME: home, RIVO_AGENT: "human" },
    encoding: "utf8",
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

/** Two separate roots so the fake home is never on the project's walk-up path. */
function fixture() {
  return {
    home: mkdtempSync(join(tmpdir(), "rivo-home-")),
    proj: mkdtempSync(join(tmpdir(), "rivo-proj-")),
  };
}

beforeAll(() => {
  spawnSync("npx", ["tsup"], { cwd: cliRoot, encoding: "utf8" });
  if (!existsSync(cliJs)) throw new Error(`构建失败,没有 ${cliJs}`);
}, 120_000);

describe("裸目录里的引导流程", () => {
  it("init 之前报错点名 rivo init,init 之后 flow new / issue new 都能跑", () => {
    const { home, proj } = fixture();

    const before = run(["issue", "new", "fix-login", "--flow", "demo"], proj, home);
    expect(before.code).toBe(1);
    expect(before.err).toMatch(/rivo init/);

    const init = run(["init"], proj, home);
    expect(init.code).toBe(0);
    expect(existsSync(join(proj, ".rivo", "flows"))).toBe(true);

    const again = run(["init"], proj, home);
    expect(again.code).toBe(0);
    expect(again.out).toMatch(/已存在/);

    expect(run(["agent", "add", "<role>"], proj, home).code).toBe(0);
    expect(run(["flow", "new", "demo"], proj, home).code).toBe(0);

    const created = run(["issue", "new", "fix-login", "--flow", "demo"], proj, home);
    expect(created.code).toBe(0);
    expect(created.out.trim()).toBe("first-node");
    expect(existsSync(join(proj, ".rivo", "issues", "fix-login", "log.jsonl"))).toBe(true);
  });

  it("全局作用域的 agent 命令不需要工作区", () => {
    const { home, proj } = fixture();

    expect(run(["agent", "add", "product", "--ref", "p1"], proj, home).code).toBe(0);
    const list = run(["agent", "list"], proj, home);
    expect(list.code).toBe(0);
    expect(list.out).toMatch(/product/);
    expect(run(["agent", "remove", "product"], proj, home).code).toBe(0);
    expect(existsSync(join(proj, ".rivo"))).toBe(false);
  });
});

describe("工作区不会落到主目录", () => {
  it("主目录有 .rivo 时,主目录下没初始化的项目仍然报错,不写进 ~/.rivo", () => {
    const { home } = fixture();
    // ~/.rivo exists the moment anyone runs `agent add`, i.e. always after setup.
    mkdirSync(join(home, ".rivo"), { recursive: true });
    const proj = join(home, "code", "app");
    mkdirSync(proj, { recursive: true });

    const r = run(["issue", "new", "fix-login", "--flow", "demo"], proj, home);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/rivo init/);
    expect(existsSync(join(home, ".rivo", "issues"))).toBe(false);
  });
});

/** A workspace with one delivery in flight, built entirely through the CLI. */
function bootstrapped() {
  const { home, proj } = fixture();
  run(["init"], proj, home);
  run(["agent", "add", "product"], proj, home);
  writeFileSync(
    join(proj, ".rivo", "flows", "demo.yaml"),
    "nodes:\n  - id: plan\n    assignees: [product]\n  - id: ship\n    assignees: [product]\n",
  );
  const created = run(["issue", "new", "fix-login", "--flow", "demo"], proj, home);
  expect(created.code).toBe(0);
  return { home, proj };
}

// No mocks on purpose: mocking loadSettings is what let a corrupt settings
// file brick `show` and `close` through nine reviews.
describe("配置漂移之后 show 和 close 仍然可用", () => {
  it("settings.json 损坏", () => {
    const { home, proj } = bootstrapped();
    writeFileSync(join(home, ".rivo", "settings.json"), "{ 这不是 JSON");

    const show = run(["issue", "show", "fix-login"], proj, home);
    expect(show.code).toBe(0);
    expect(show.out).toMatch(/plan/);

    expect(run(["issue", "close", "fix-login", "--reason", "收尾"], proj, home).code).toBe(0);
  });

  it("flow 文件被删掉", () => {
    const { home, proj } = bootstrapped();
    rmSync(join(proj, ".rivo", "flows", "demo.yaml"));

    const show = run(["issue", "show", "fix-login"], proj, home);
    expect(show.code).toBe(0);
    expect(show.out).toMatch(/流程加载失败/);

    expect(run(["issue", "close", "fix-login", "--reason", "收尾"], proj, home).code).toBe(0);
  });

  it("flow 里的节点 id 对不上时 show 降级但不报错", () => {
    const { home, proj } = bootstrapped();
    writeFileSync(
      join(proj, ".rivo", "flows", "demo.yaml"),
      "nodes:\n  - id: renamed\n    assignees: [product]\n",
    );

    const show = run(["issue", "show", "fix-login"], proj, home);
    expect(show.code).toBe(0);
    expect(show.out).toMatch(/没有节点 plan/);
    expect(run(["issue", "close", "fix-login", "--reason", "收尾"], proj, home).code).toBe(0);
  });
});
