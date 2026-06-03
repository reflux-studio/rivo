---
name: uat
description: 指引用户人工验收一个已完成的 issue——跑 manual 用例、逐条走查 AC，结论落 uat.md。用户想验收、UAT 或走查时用。
argument-hint: <issue-id>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git add *), Bash(git commit *), Bash(git status *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:uat —— 人工验收

指引用户对 `coded` 的 issue 做人工验收：跑 `[manual]` 用例、逐条走查 AC，把结论与问题落到 `uat.md`。

## 任务清单

1. **前置检查** —— `.rivo/` 在、`status` 为 `coded`、`spec.md` 与 `test-cases.md` 在
2. **读 learnings** —— 扫 `.rivo/learnings/` 里验收、易漏场景相关的 case
3. **起项目** —— 让用户能实际操作
4. **给验收清单、逐条引导** —— 据 AC 和 `[manual]` 用例引导用户确认
5. **写 uat.md** —— 记结论、走查、问题
6. **缺陷分流** —— 按性质决定去 code / reflow / issue
7. **commit** —— `docs: uat <id>`
8. **结束语** —— 交代结论、关键问题及去向、下一步

## 工作流程

**前置检查**

- `.rivo/` 不存在就引导用户先跑 `/rivo:init`，然后退出。
- 从 `$ARGUMENTS` 取 issue-id，读 `README.md` frontmatter 确认 `status` 是 `coded`。
- 当前 issue 的 `spec.md` 与 `test-cases.md` 都在。

**起项目与走查**

- 检测到 `run` / `verify` / 浏览器能力就起项目，让用户能实际操作；没有就把启动命令告诉用户，请他本地起。
- 据 `spec.md` 的每条 AC 加 `test-cases.md` 的 `[manual]` 用例，整理成一份验收清单，逐条引导用户确认通过 / 不通过，记录他的实际观察和遇到的问题。

**记录与分流**

- 按 [templates/uat.md](templates/uat.md) 写 `uat.md`。
- 缺陷按性质分流，别一刀切：
  - **轻微实现 bug** → `/rivo:code <id> --rebuild` 修复（返工模式，允许在 `coded` 上原地重入），修完重新验收。
  - **方向性 / spec 问题**（场景不自洽、需求理解偏差）→ `/rivo:reflow <id>` 回上游重评估。
  - **范围外新诉求** → 建议 `/rivo:issue` 另立新需求，不塞进本次。
- 把每条问题的去向都写进 `uat.md`。

**收尾**

- 提交 `docs: uat <id>`，状态保持 `coded`（uat 是验收门、不改状态）。验收不通过就不要进 `/rivo:archive`。
- 结束语交代验收结论、关键问题及去向（至多 3 条）、下一步：通过就 `/rivo:archive`，不通过就按分流走 code / reflow / issue。

## 核心原则

- **靠用户实操** —— 你负责引导和记录，通过与否由用户实际操作说了算，不替他判断。
- **缺陷分性质** —— 实现 bug、方向性问题、范围外诉求去向不同，分流别一刀切。
- **不通过不归档** —— uat 没过的 issue 不能进 archive。

## 反例

**"AC 看着都实现了，直接标通过"** —— 验收的意义就在用户**实际操作**每一条，而不是你替他下结论。逐条引导用户验，把他真实的观察记下来。
