---
name: code
description: 按 plan.md 实现需求——每个 task 走红绿灯 TDD，全绿后评审并向用户主讲交付。用户想开始写、实现需求或执行 plan 时用。
argument-hint: <issue-id> [--rebuild]
allowed-tools: Read, Write, Edit, Glob, Grep, Task, Bash
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:code —— 实现 + 红绿灯

按 `plan.md` 把需求实现出来。每个 task 都走红绿灯——先写测试再写实现，全部 task 跑通后把 issue 推到 `coded`。

## 任务清单

1. **前置检查** —— `.rivo/` 在、`status` 为 `planned`、`plan.md` 与 `test-cases.md` 都在
2. **读 learnings** —— 扫 `.rivo/learnings/` 里实现、测试、踩坑相关的 case
3. **按 task 红绿灯** —— 逐个 task 执行，每个先红后绿再重构
4. **每个 task 收口** —— 过质量门禁，一 task 一 commit
5. **全部完成** —— 跑全量测试、`/rivo:review`（类型 `code`）收敛；手动模式 `/rivo:report` 主讲交付
6. **推进状态** —— review 收敛 + 全量测试绿后改 `status: coded`，commit
7. **遇阻处理** —— 方向性缺陷停下走 reflow

## 工作流程

**前置检查**

- `.rivo/` 不存在就引导用户先跑 `/rivo:init`，然后退出。
- 从 `$ARGUMENTS` 取 issue-id，读 `README.md` frontmatter 确认 `status` 是 `planned`。
- 当前 issue 的 `plan.md` 与 `test-cases.md` 都已存在。
- **复用 stale 实现**：若 `status` 为 `planned` 却已存在上一轮实现（reflow 回退后上游 `--rebuild` 把 `status` 回滚到了 `planned`，但盘上代码没删），照新 `plan.md` / `test-cases.md` **改写复用**已有实现，别推倒重来——red 先补/改到反映新方案，再 green。
- 带 `--rebuild` 时（来自 uat 缺陷或 reflow 指向 code 层）允许在 `coded` 上原地重入修复：照红绿灯补测试、改实现，修完按需重新验收（uat 缺陷则回 `/rivo:uat` 复验；reflow 指向 code 层则重跑 review / 全量测试即可，uat 本是可选节点），按统一规则状态保持本 skill 出口态 `coded`（同层返工、不回滚）。根因落在 code 层但 `status` 仍为 `planned` 时无需 `--rebuild`，直接继续 `/rivo:code` 即可；`code --rebuild` 专指从 `coded`（含 uat 缺陷）原地重入。

**逐个 task 走红绿灯**

- 按 `plan.md` 的任务拆分逐个执行，默认顺序执行。只有当 plan 明确标出几个互不依赖、也不共享文件的 task 时，才并行派 subagent（单条消息发多个 Agent、每个 prompt 自包含）。
- 每个 task 内部走一轮红绿灯：
  1. **红** —— 照 `test-cases.md` 里这个 task 覆盖的 `[auto]` 场景写测试，跑一遍，确认它失败。
  2. **绿** —— 写最小实现让测试通过。
  3. **重构** —— 在绿灯保护下清理代码。

**每个 task 收口**

- 完成后过一遍质量门禁：类型检查和 lint 无错；这个 task 的自动化测试连同已有套件全绿；对应 AC 项手测确认。
- 全过了就一个 task 一个 commit：`feat: <简述>`（按改动性质也可以是 fix/refactor），message 末尾加一行 `Closes Task N of <id>`。
- 有任何一项没过，先修；实在修不动、是方向性的问题，就跑 `/rivo:reflow` 诊断。别绕过 hook，别用 `--no-verify`。

**全部完成后收尾**

- 跑一遍全量测试套件，确认整体绿。
- 对整体 code 做评审：`/rivo:review` 类型 `code`（架构师 / 工程师视角：正确性、安全、与 plan 一致、**是否满足 spec 每条 AC**、测试充分、对齐 ARCHITECTURE）并自动收敛，留痕落 `reviews/code.md`。

<HARD-GATE>
整体 code 在推进 `status: coded`、commit 前必须：① 全量测试绿；② `/rivo:review`（类型 `code`）已收敛。两者未满足禁止推进 `status`、禁止进入 `/rivo:uat` 或 `/rivo:archive`。
- **手动模式**：达标后走 `/rivo:report` 向用户主讲实现与对 plan 的偏离（形状 / 自填决策 / 不确定项 + 证据：AC 覆盖、测试结果）；skill 到此结束、工作流自然暂停，是否进入下一步由用户决定（跑 `/rivo:uat` 或 `/rivo:archive` 即认可；不满意则 `/rivo:code <id> --rebuild` 或 `/rivo:reflow`）。
- **auto 编排下**：达标即推进，跳过 report、不等人类批准（产物质量交给 review 自审）；仅 `reflow-required` / 会丢已提交工作的操作处停。
</HARD-GATE>

- 把 `status` 改 `coded`、更新 `updated`，提交 `docs: complete <id>`。
- 结束语交代产物（源码 commits、`reviews/code.md`）、实现要点与对 plan 的偏离（至多 3 条）、下一步 `/rivo:uat <id>` 或 `/rivo:archive <id>`。

**遇阻处理**

如果实现中发现 plan 或 spec 有方向性缺陷，或者 `/rivo:review` 报了 `reflow-required`，不要硬推。停下来，提示用户运行 `/rivo:reflow <id>`（reflow 只由用户显式触发）去诊断根因，再由用户决定回退到哪一步。

## 核心原则

- **先测后码** —— 红灯确认失败，再写实现；别跳过这一步直接写功能。
- **一 task 一 commit** —— 每个 task 是独立可追溯、可回退的单元。
- **门禁不可绕** —— 测试、lint、hook 没过就别推；`--no-verify` 不是选项。
- **方向问题不硬扛** —— plan/spec 错了，停下走 reflow，而不是在错误的方案上硬凑实现。

## 反例

**"先把功能写完，测试回头补"** —— 这就把红绿灯做反了：实现先行、测试沦为事后摆设，既验证不了行为、也守不住重构。每个 task 都从写一个会失败的测试开始。
