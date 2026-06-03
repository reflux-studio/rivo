---
name: plan
description: 把 spec 拆成技术方案 plan.md（架构 + 任务拆分）和 test-cases.md（BDD 场景）。用户想出方案、拆任务或做技术设计时用。
argument-hint: <issue-id> [--rebuild]
allowed-tools: Read, Write, Edit, Glob, Grep, Task, Bash(git add *), Bash(git commit *), Bash(git status *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:plan —— 技术方案 + 测试用例

把 `spec.md` 拆成可执行的技术方案 `plan.md` 和测试场景 `test-cases.md`。

只出方案与用例文档，不写实现代码、也不写测试代码——那是 `/rivo:code`（含红绿灯）。

## 任务清单

1. **前置检查** —— `.rivo/` 在、`status` 为 `specified`、`spec.md` 在
2. **读 learnings** —— 扫 `.rivo/learnings/` 里架构、选型、踩坑相关的 case
3. **外部调研** —— 涉及选型或权衡时，调 `/rivo:survey` 外部分支，产出 `surveys/`
4. **技术决策** —— AI 自主衍生并定（每个带理由）；需你拍板的少数项留到收敛门由 report 顶给你
5. **写 plan.md** —— 架构决策 + 任务拆分，标清互不依赖的 task
6. **写 test-cases.md** —— 每条 AC 对应 BDD 场景，标 `[auto]` / `[manual]`
7. **评审** —— `/rivo:review` 分别评 `plan` 与 `test-cases` 并收敛；手动模式走 `/rivo:report` 主讲
8. **推进状态** —— 改 `status: planned`，commit
9. **结束语** —— 交代产物、关键决策、下一步

## 工作流程

**前置检查**

- `.rivo/` 不存在就引导用户先跑 `/rivo:init`，然后退出。
- 从 `$ARGUMENTS` 取 issue-id，读 `README.md` frontmatter 确认 `status` 是 `specified`。
- 当前 issue 的 `spec.md` 已存在（由 `/rivo:spec` 产出）；不在就提示先跑 `/rivo:spec`。
- 带 `--rebuild` 时（通常是 reflow 回退后返工）放宽状态校验，允许在 `planned`、`coded` 上基于 reflow 报告在现有 plan / test-cases 上修订：照常走 review 收敛门（手动模式 report 主讲）。改完按统一规则把 `status` 设回本 skill 出口态 `planned`（即从 `coded` 回滚、显式标记下游 code 已 stale），下游 code 由 reflow 报告或用户判断是否前向重跑（`/rivo:code` 会复用盘上已有实现、按新方案改写，不当 greenfield）。

**调研与技术决策**

- 涉及技术选型、三方库、性能或安全权衡时，内嵌 `/rivo:survey` 外部分支调研，产出 `issues/<id>/surveys/<topic>.md`。没有这类不确定性就跳过。
- 技术决策（选型、分层、数据结构、迁移策略）尽量从 spec + `PROJECT.md` + `ARCHITECTURE.md`（系统骨架、依赖与不变量）+ 代码现状**自主衍生并定**，每个写清理由与否掉的备选——这些是可推导的，不必逐项问用户。方案须落在 `ARCHITECTURE.md` 的边界内；若需动架构（模块/数据流/存储/分层），在 `plan.md` 写清「打算怎么动、为什么」，由 code 实现、archive 时再同步回 `ARCHITECTURE.md`。个别真正需用户拍板的（成本 vs 延迟这类业务取舍），别擅自定：留到收敛门由 `/rivo:report` 顶给用户；若发现是 PRD / spec 漏项，停下走 `/rivo:reflow`。

**写 plan 与 test-cases**

- 按 [templates/plan.md](templates/plan.md) 写 `plan.md`。任务拆分要标清哪些 task **互不依赖且不共享改动文件**——这才是 code 阶段能并行派 subagent 的条件，给它提供依据。
- 按 [templates/test-cases.md](templates/test-cases.md) 写 `test-cases.md`，每条 AC 对应一个或多个 BDD 场景。`[auto]` 表示能写成自动化测试（code 阶段红绿灯覆盖），`[manual]` 表示成本高、不好自动化、留给 `/rivo:uat` 人工执行。覆盖要回扣 spec 的每一条 AC。

**评审与收尾**

- 跑两道评审（单消息可并行派发）：`/rivo:review` 类型 `plan`（架构师 / 工程师视角：架构合理性、对齐 ARCHITECTURE、任务完备与并行标注、影响面）与类型 `test-cases`（测试视角：AC 全覆盖、失败路径、标注合理）。各自收敛，留痕落 `reviews/plan.md` 与 `reviews/test-cases.md`。

<HARD-GATE>
`plan.md` 与 `test-cases.md` 在 commit、推进 `status` 前必须：两道 `/rivo:review`（`plan` 与 `test-cases`）都已跑完并收敛（机械项已修、判断项已标出）。任一未收敛禁止 commit、禁止推进 `status`、禁止进入 `/rivo:design` 或 `/rivo:code`。
- **手动模式**：收敛后走 `/rivo:report` 向用户主讲方案（形状 / 自填决策 / 不确定项）；skill 到此结束、工作流自然暂停，是否进入下一步由用户决定（跑 `/rivo:design` 或 `/rivo:code` 即认可；不满意则 `/rivo:plan <id> --rebuild` 或 `/rivo:reflow`）。
- **auto 编排下**：review 收敛即推进，跳过 report、不等人类批准（产物质量交给 review 自审）；仅 `reflow-required` 处停（会丢已提交工作的操作任何模式都停，见全局纪律）。
</HARD-GATE>

- plan 是 `specified → planned` 的边界（从这里进入实现）。把 `status` 改 `planned`、更新 `updated`，提交 `docs: plan <id>`。
- 结束语交代产物（`plan.md`、`test-cases.md`、`surveys/`、`reviews/plan.md`、`reviews/test-cases.md`）、核心架构选择与任务拆分要点（至多 3 条）、下一步：spec 涉及 UI 就 `/rivo:design <id>`，否则 `/rivo:code <id>`。

## 核心原则

- **只出文档** —— 方案与用例；实现代码和测试代码都是 code 的事。
- **任务拆分服务于并行** —— 标清依赖与可并行项（互不依赖 + 不共享改动文件），code 才能放心并行派发。
- **测试回扣 AC** —— spec 的每条 AC 都要有对应场景，一条都不漏。
- **方案对齐 spec 与架构** —— 不引入 spec 里没有的目标，不越 `ARCHITECTURE.md` 的边界；方案是 spec 的落地不是再设计。

## 反例

**"方案想清楚了，顺手把代码也写了"** —— plan 一旦开始写实现，就越过了红绿灯、也跳过了用户对方案的确认。这里只产出文档；动手写代码是 code 的事。
