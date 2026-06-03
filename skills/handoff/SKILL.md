---
name: handoff
description: 上下文 checkpoint——把当前进度存成自包含文档，便于新会话接续。用户想交接、handoff 或要离开时用。
argument-hint: [issue-id]
allowed-tools: Read, Write, Glob, Bash(git status *), Bash(git log *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:handoff —— 上下文 checkpoint

把当前进度存成一份自包含文档，让新会话（或另一个人 / agent）据此无缝接续。

## 任务清单

1. **定位 issue** —— 从 `$ARGUMENTS` 或 `.rivo/issues/` 现状推断；推断不出就问用户
2. **写 handoff 文档** —— 存到 `issues/<id>/handoffs/<ts>.md`
3. **结束语** —— 产物（handoff 路径）、关键交接点（≤3 条）、下一步（新会话读它即可接续）

## 工作流程

**定位 issue**

从 `$ARGUMENTS` 或 `.rivo/issues/` 现状推断 issue-id。推断不出（独立调用、不对应任何 issue）时，问用户：是归到某个 issue（让其给出 id），还是做无 issue 的临时交接（inline 返回 handoff 正文，或落到用户指定路径）——别默认 `issues/<id>/` 强行编个 id。

**写 handoff 文档**

按 [templates/handoff.md](templates/handoff.md) 逐项写满到 `issues/<id>/handoffs/<ts>.md`，务必**自包含**——让接手的会话不必回头猜上下文。git 状态用 `git status` / `git log` 如实记进文档。

## 核心原则

- **自包含** —— 接手者只读这一份就能续上，不依赖当前会话的记忆。
- **只存档** —— 不推进状态、不 commit 源码改动；git 状态记在文档里即可。handoff 文件本身也未提交，跑 `git reset --hard` / `clean` / `stash` 前注意别误删（必要时先拷出仓库或手动提交）。

## 反例

**"handoff 写两句'继续做就行'"** —— 新会话拿到这种 handoff 等于从零开始。把卡在哪、下一步具体做什么、有哪些已定/未定的决策都写清，才叫交接。
