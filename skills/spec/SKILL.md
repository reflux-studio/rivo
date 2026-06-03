---
name: spec
description: 把已澄清的 PRD 机械翻译成 spec.md（EARS 验收标准）。用户想写 spec、定验收标准、把需求落成可验证的 AC 时用。
argument-hint: <issue-id> [--rebuild]
allowed-tools: Read, Write, Edit, Glob, Grep, Task, Bash(git add *), Bash(git commit *), Bash(git status *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:spec —— 把 PRD 译成验收标准

把 `created` 的 issue 那份 PRD（`README.md`）逐条翻译成 `spec.md`（EARS 验收标准），推进到 `specified`。

这一步是**机械翻译，不是再创作**：只把 PRD 已经定下的决议落成可验证的 AC，不引入 PRD 里没有的新决策、不向用户发起第二轮澄清。翻译中若发现 PRD 本身不自洽或有缺口，**停下**、提示回 `/rivo:issue <id> --rebuild` 修需求，而不是在 spec 里自行补决策。

## 任务清单

1. **前置检查** —— `.rivo/` 在、`status` 为 `created`、PRD（`README.md`）已澄清收敛（`reviews/prd.md` 在）
2. **读 learnings** —— 扫 `.rivo/learnings/` 里和验收标准、易漏场景相关的 case
3. **翻译成 spec.md** —— 把 PRD 每条决议译成 EARS 五类 AC
4. **评审** —— `/rivo:review`（类型 `spec`）机审收敛
5. **推进状态** —— 改 `status: specified`，commit；手动模式走 `/rivo:report` 主讲
6. **结束语** —— 产物、关键决策、下一步 `/rivo:plan`

## 工作流程

**前置检查**

- `.rivo/` 不存在就提示「本仓库尚未接入 rivo，请先运行 `/rivo:init`」并退出。
- 从 `$ARGUMENTS` 取 issue-id，读 `.rivo/issues/<id>/README.md` frontmatter 确认 `status` 是 `created`，且 PRD 已澄清收敛（`reviews/prd.md` 存在）。PRD 还没收敛就提示先把 `/rivo:issue <id>` 跑完。
- 带 `--rebuild` 时（通常是 reflow 回退后返工）放宽状态校验，允许在 `specified`、`planned`、`coded` 上重做：基于现有 `spec.md` 和 reflow 报告修订，照常走 review 收敛。改完按统一规则把 `status` 设回本 skill 出口态 `specified`（即从下游回滚，显式标记下游 plan/code 已 stale）。

**翻译成 spec.md**

- 按 [templates/spec.md](templates/spec.md) 的 EARS 格式写 `spec.md`。每条 AC 单一、可验证、无歧义，覆盖持续行为、触发、状态、异常、可选分支（对应模板五类 Ubiquitous / Event / State / Unwanted / Optional）。
- 逐条回扣 PRD：每条 AC 都能追溯到 PRD 的某条决议；不引入 PRD 没有的目标或约束。
- 翻译中发现 PRD 不自洽、有缺口、或某决议无法落成可验证 AC：**停下**，提示用户回 `/rivo:issue <id> --rebuild` 补需求，别在 spec 里自行补决策。

**评审与收尾**

- 跑 `/rivo:review`（类型传 `spec`：产品 / 用户视角 + 可验证性，自动收敛；留痕落 `reviews/spec.md`）。

<HARD-GATE>
`spec.md` 在推进 `status: specified`、commit 前必须：`/rivo:review`（类型 `spec`）已跑完并收敛（机械项已改、判断项已标出）。review 未收敛禁止 commit、禁止推进 `status`、禁止进入 `/rivo:plan`。
- **手动模式**：收敛后走 `/rivo:report` 向用户主讲（逐条过 AC 清单、点出翻译时被迫做判断的地方）；skill 到此结束、工作流自然暂停，是否进入 plan 由用户决定（跑 `/rivo:plan` 即认可；不满意则 `/rivo:spec <id> --rebuild` 或 `/rivo:reflow`）。
- **auto 编排下**：review 收敛即推进，跳过 report、不等人类批准（产物质量交给 review 自审）；仅 `reflow-required` 处停（会丢已提交工作的操作任何模式都停，见全局纪律）。
</HARD-GATE>

**收尾**

- `status` 改 `specified`、更新 `updated`，提交 `docs: spec <id>`。
- 结束语交代产物（`spec.md`、`reviews/spec.md`）、翻译时被迫做的判断（至多 3 条）、下一步 `/rivo:plan <id>`。

## 核心原则

- **翻译不再创作** —— spec 忠实于 PRD，只把已定决议落成可验证 AC，不夹带新目标、新约束。
- **不发起二次澄清** —— 澄清是 issue 的事；spec 发现 PRD 有缺口就停下回 `issue --rebuild`，不自己问用户、不自己补决策。
- **每条 AC 可追溯** —— 每条 AC 都回扣 PRD 的某条决议，且单一、可验证、无歧义。

## 反例

**"翻译时顺手把 PRD 没说清的边界自己定了"** —— 这就把机械翻译做成了再创作，把没问清的假设埋进了验收标准。spec 发现 PRD 缺口只有一个动作：停下，提示回 `/rivo:issue <id> --rebuild`。补需求是 issue 的地盘，不是 spec 的。
