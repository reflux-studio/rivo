import { Command } from "commander";
import { closeIssue, newIssue, recallIssue, recordVerdict, showIssue } from "./issue.js";
import { readLog } from "./log.js";
import { findWorkspace, issuePaths } from "./paths.js";

const program = new Command();
program.name("rivo").description("无状态的 AI 交付流程编排器").version("0.1.0");

function ws(): string {
  return findWorkspace(process.cwd());
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
    newIssue(ws(), slug, opts.flow);
    console.log(showIssue(ws(), slug).node);
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

try {
  program.parse();
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}
