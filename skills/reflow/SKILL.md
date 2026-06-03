---
name: reflow
description: 诊断产物链根因 + 建议回退路径，只诊断不改产物。实现 / 验收发现上游方向性缺陷、或外部变更需打回重做时用。用户说打回、plan 错了、需要回头改时触发。
argument-hint: <issue-id> [问题描述]
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Write
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:reflow —— 诊断 + 回上游重评估

单向数据流下的回退机制。reflow **不 rewind 任何已有产物**——已产出的代码和方案不是毫无意义的。它只产出诊断报告加重跑建议，回退由用户决定。

回退动的是 `status` 指针、不是产物：用户对根因层跑 `--rebuild` 后，`status` 按统一规则回滚到该层出口态（显式标记下游 stale），但盘上的下游产物**保留、可复用**——下游 skill 前向重跑时按新上游改写，不当 greenfield。

回上游重评估是方向性动作，所以 `disable-model-invocation: true`：只由用户、或 review 报 `reflow-required` 提示之后，显式触发。

## 任务清单

1. **定位 issue + 问题** —— 从 `$ARGUMENTS` 取 issue-id 和问题描述
2. **沿产物链诊断** —— 顺着 PRD → spec → plan → test-cases → code 找根因层
3. **写诊断报告** —— 落到 `issues/<id>/reflows/<ts>-<topic>.md`
4. **结束语** —— 给根因层和建议回退点，把执行权交用户

## 工作流程

**沿产物链诊断**

问题可能来自 `$ARGUMENTS`，也可能来自 code / uat 的阻塞或 review 的 `reflow-required`。顺着产物链 `README(PRD) → spec → plan → test-cases → code` 定位**根因在哪一层**。关键是分清两类：

- **实现 bug** —— 不该 reflow，回 code 修。
- **上游方向性缺陷** —— 该 reflow，回对应上游层重评估。

**写诊断报告**

按 [templates/reflow.md](templates/reflow.md) 写报告，讲清现象、根因层、影响面、建议回退点，以及哪些现有产物可复用、不必推倒重来。

**交回用户**

结束语给根因层加建议回退点，把执行权交给用户：由用户对上游 skill 跑**返工模式** `/rivo:<skill> <id> --rebuild`（放宽入口状态校验、读本报告、基于现有产物重做）。返工层重做后 `status` 按统一规则回滚到该层出口态（PRD→`created`、spec→`specified`、plan→`planned`），下游被显式标记 stale；用户再前向重跑下游 skill（`/rivo:spec` / `/rivo:plan` / `/rivo:code`）逐层收敛，下游会复用盘上已有产物、按新上游改写。根因层映射：PRD→`issue`、spec→`spec`、plan / test-cases→`plan`、code 实现 bug→`code`（不 reflow，直接 `code --rebuild`）。

> 诊断报告尚未提交（reflow 只产报告、不 commit）。下一步 `--rebuild` 的 commit 会把它一并纳入；但在此之前跑 `git reset --hard` / `clean` / `stash` 时注意别误删这份回退依据。

## 核心原则

- **只诊断，不动手** —— reflow 不改任何产物、不动状态，只产报告。改由用户跑 `--rebuild`。
- **分清 bug 与方向问题** —— 实现 bug 回 code，别动用 reflow；方向性缺陷才回上游重评估。
- **线性、无嵌套** —— 每个回退节点都是顶层调用，不在 reflow 里套 reflow。

## 反例

**"诊断出 plan 有问题，顺手就把 plan 改了"** —— 这破坏了单向数据流，也越过了用户对回退的决定权。reflow 只交报告；改不改、从哪步重走，是用户跑 `--rebuild` 的事。
