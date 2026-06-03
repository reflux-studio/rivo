---
name: survey
description: 调研——内部分支摸代码现状（→ context.md），外部分支联网做选型 / 性能 / 安全（→ surveys/）。用户想调研、选型，或 issue / plan 内部需要时用。
argument-hint: <--internal|--external> [topic] [issue-id]
allowed-tools: Read, Glob, Grep, Write, Task, WebSearch, WebFetch
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:survey —— 调研

两个分支，由调用方传参决定（issue 传 `--internal`，plan 传 `--external`；用户独立调用时据 topic 自己判断，拿不准就问）：

- **`--internal`** —— 摸项目代码现状：现有实现、约定、影响面。产出 `context.md`。
- **`--external`** —— 联网调研：技术选型、三方库对比、性能 / 安全权衡。产出 `surveys/<topic>.md`。

## 任务清单

1. **解析参数** —— 分支（internal / external）、topic、issue-id
2. **派 subagent** —— 重读放进 subagent 里跑，多主题并行
3. **落文件** —— 按分支写 `context.md` 或 `surveys/<topic>.md`
4. **结束语** —— 产物路径 + 关键发现，回到调用方的下一步

## 工作流程

**派 subagent**

- 重读放进 subagent 里跑，省主线程上下文：内部用 `Explore`（只读），外部用带 Web 能力的 `general-purpose`。
- 多主题并行：每个候选 / 主题各派一个 subagent（单条消息发多个 Agent、每个 prompt 自包含），主线程汇总落文件。
  - internal → prompt 写明要摸的模块 / 问题 / 输出格式，让它读代码后返回现状摘要加关键文件路径。
  - external → prompt 写明选型问题 / 评估维度 / 输出格式。
- 联网降级：探测到 WebSearch / WebFetch 就用；没有就靠模型知识，并在产物里**标注局限**。

**落文件**

- internal → `issues/<id>/context.md`
- external → `issues/<id>/surveys/<topic>.md`
- 独立调用（无 issue）→ inline 返回结论，并问用户是否存盘。

结束语给产物路径、关键发现（至多 3 条）、回到调用方的下一步。

## 核心原则

- **重读在 subagent 里** —— 调研要读大量代码 / 网页，放 subagent 跑才不挤占主线程上下文。
- **没联网就标局限** —— 拿不到实时信息时靠模型知识可以，但必须在产物里写清这是未经核实的。
- **不推状态、不 commit** —— survey 是调用方的内嵌子过程，产物由调用方在自己的 commit 里带上。

## 反例

**"联网能力没探到，就把模型记忆当事实写进选型结论"** —— 版本、基准、API 这类会过时的信息，没核实就当定论会误导下游。拿不到就明确标注「未联网核实」。
