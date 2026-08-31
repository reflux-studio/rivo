import { Command, Option } from "commander";
import { addAgent, listFlows, newFlow, removeAgent } from "./config-cmd.js";
import { doctor } from "./doctor.js";
import { loadFlow, nodeById } from "./flow.js";
import { closeIssue, newIssue, recallIssue, recordVerdict, showIssue } from "./issue.js";
import { readLog } from "./log.js";
import { type Scope, ensureWorkspace, findWorkspace, issuePaths, requireWorkspace } from "./paths.js";
import { loadSettings } from "./settings.js";

const program = new Command();
program.name("rivo").description("无状态的 AI 交付流程编排器").version("0.1.0");

/** Reads or advances an existing delivery: the workspace must already be there. */
function ws(): string {
  return requireWorkspace(process.cwd());
}

/** Starts a delivery: builds the workspace in place rather than demanding a setup step. */
function newWs(): string {
  return ensureWorkspace(process.cwd());
}

/** For commands that fall back to user scope and work fine outside a project. */
function optionalWs(): string | null {
  return findWorkspace(process.cwd());
}

function scopeOption(description: string) {
  return new Option("--scope <scope>", description).choices(["user", "project"]);
}

function who(opt?: string): string {
  const name = opt ?? process.env.RIVO_AGENT;
  if (!name) throw new Error("需要 --as <name> 指定身份,或设置 RIVO_AGENT 环境变量");
  return name;
}

const issue = program.command("issue").description("交付");

issue
  .command("new <slug>")
  .requiredOption("--flow <name>", "使用哪个流程")
  .action((slug: string, opts: { flow: string }) => {
    const dir = newWs();
    newIssue(dir, slug, opts.flow);
    console.log(showIssue(dir, slug).node);
  });

issue
  .command("show <slug>")
  .option("--json", "输出 JSON")
  .action((slug: string, opts: { json?: boolean }) => {
    const view = showIssue(ws(), slug);
    if (opts.json) {
      console.log(JSON.stringify(view, null, 2));
      return;
    }
    console.log(`交付   ${view.slug}(流程 ${view.flow},模式 ${view.mode})`);
    console.log(`节点   ${view.node ?? "已关闭"}`);
    if (view.pending.length) console.log(`待表态 ${view.pending.join(", ")}`);
    if (view.completed) console.log("全部节点已通过,可以 rivo issue close");
    if (view.stale) console.log(`注意   有 ${view.stale} 条陈旧事件被忽略`);
    if (view.malformed) console.log(`注意   有 ${view.malformed} 行 log 无法解析,状态可能不完整`);
    if (view.flowError) console.log(`注意   流程加载失败,节点信息不可用:${view.flowError}`);
    console.log(`路径   ${view.path.join(" → ")}`);
    console.log(`目录   ${view.issueDir}`);
    if (view.instruction) console.log(`\n节点说明\n${view.instruction}`);
  });

for (const verdict of ["approve", "reject"] as const) {
  const cmd = issue
    .command(`${verdict} <slug>`)
    .option("--as <name>", "你的身份")
    .requiredOption("--reason <text>", "理由");
  if (verdict === "reject") cmd.option("--to <node>", "打回到哪个节点");
  cmd.action((slug: string, opts: { as?: string; reason: string; to?: string }) => {
    recordVerdict(ws(), slug, who(opts.as), verdict, opts.reason, opts.to);
    console.log(showIssue(ws(), slug).node);
  });
}

issue
  .command("recall <slug>")
  .option("--as <name>", "你的身份")
  .requiredOption("--to <node>", "回退到哪个节点")
  .requiredOption("--reason <text>", "理由")
  .action((slug: string, opts: { as?: string; to: string; reason: string }) => {
    recallIssue(ws(), slug, who(opts.as), opts.to, opts.reason);
    console.log(showIssue(ws(), slug).node);
  });

issue
  .command("close <slug>")
  .option("--as <name>", "你的身份")
  .option("--reason <text>", "理由")
  .action((slug: string, opts: { as?: string; reason?: string }) => {
    closeIssue(ws(), slug, who(opts.as), opts.reason);
    console.log("已关闭");
  });

issue.command("log <slug>").action((slug: string) => {
  const { logPath } = issuePaths(ws(), slug);
  for (const e of readLog(logPath).events) console.log(JSON.stringify(e));
});

const flowCmd = program.command("flow").description("流程定义");

flowCmd
  .command("show <name>")
  .option("--node <id>", "只看某个节点")
  .option("--json", "输出 JSON")
  .action((name: string, opts: { node?: string; json?: boolean }) => {
    const flow = loadFlow(optionalWs(), name);
    const payload = opts.node ? nodeById(flow, opts.node) : flow;
    if (opts.json) {
      console.log(JSON.stringify(payload, null, 2));
      return;
    }
    if (opts.node) {
      const node = payload as ReturnType<typeof nodeById>;
      console.log(`节点 ${node.id}`);
      console.log(`assignees ${node.assignees.join(", ")}`);
      console.log(`approve   ${node.approve}`);
      if (node.instruction) console.log(`\n${node.instruction}`);
      return;
    }
    for (const node of flow.nodes) {
      console.log(`${node.id}  [${node.assignees.join(", ")}]  approve=${node.approve}`);
    }
  });

flowCmd
  .command("new <name>")
  .addOption(scopeOption("写到哪一层,默认 project").default("project"))
  .action((name: string, opts: { scope: Scope }) => {
    console.log(newFlow(opts.scope === "user" ? null : newWs(), name, opts.scope));
  });

flowCmd
  .command("list")
  .option("--json", "输出 JSON")
  .action((opts: { json?: boolean }) => {
    const flows = listFlows(optionalWs());
    if (opts.json) {
      console.log(JSON.stringify(flows, null, 2));
      return;
    }
    for (const f of flows) console.log(`${f.name}\t${f.scope}`);
  });

const agentCmd = program.command("agent").description("参与者");

agentCmd
  .command("add <name>")
  .option("--ref <id>", "平台标识;不给表示由人承担")
  .addOption(scopeOption("写到哪一层,默认 user").default("user"))
  .action((name: string, opts: { ref?: string; scope: Scope }) => {
    addAgent(optionalWs(), name, opts.ref, opts.scope);
    console.log(`已声明 ${name}${opts.ref ? ` → ${opts.ref}` : "(未绑定,由人承担)"}`);
  });

agentCmd
  .command("list")
  .option("--json", "输出 JSON")
  .action((opts: { json?: boolean }) => {
    const { agents } = loadSettings(optionalWs());
    if (opts.json) {
      console.log(JSON.stringify(agents, null, 2));
      return;
    }
    for (const [name, a] of Object.entries(agents)) {
      console.log(`${name}\t${a.ref ?? "(未绑定)"}`);
    }
  });

agentCmd
  .command("remove <name>")
  .addOption(scopeOption("从哪一层移除,默认 user").default("user"))
  .action((name: string, opts: { scope: Scope }) => {
    removeAgent(optionalWs(), name, opts.scope);
    console.log(`已移除 ${name}`);
  });

program
  .command("doctor")
  .option("--json", "输出 JSON")
  .action((opts: { json?: boolean }) => {
    const problems = doctor(optionalWs());
    if (opts.json) {
      console.log(JSON.stringify(problems, null, 2));
      if (problems.length > 0) process.exit(1);
      return;
    }
    if (problems.length === 0) {
      console.log("一切正常");
      return;
    }
    for (const p of problems) console.log(`${p.where}: ${p.message}`);
    process.exit(1);
  });

try {
  program.parse();
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}
