---
name: review
description: 跨模型 / 跨视角评产物并自动收敛，减少单模型盲区。issue / spec / plan / code 的收敛门内嵌调用（机器侧），不由用户直接调。
argument-hint: <issue-id|产物路径> <类型>
user-invocable: false
allowed-tools: Read, Glob, Grep, Edit, Write, Task, Bash
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:review —— 跨视角评审（机器侧）

派与原作者不同模型的独立视角评产物，减少单模型盲区。跑完就把产物收敛到位，自己不面向用户、不推状态。

**评审按产物类型组织**——真正被评的是产物，每种产物有固定的角色视角与侧重，写在 [prompts/](prompts/) 下的对应 rubric 里：

| 类型 | 评的产物 | 角色视角 | rubric | 留痕 |
|---|---|---|---|---|
| `prd` | `README.md`（PRD） | 产品 / 用户 | [prompts/prd.md](prompts/prd.md) | `reviews/prd.md` |
| `spec` | `spec.md` | 产品 / 用户 + 可验证性 | [prompts/spec.md](prompts/spec.md) | `reviews/spec.md` |
| `plan` | `plan.md` | 架构师 / 工程师 | [prompts/plan.md](prompts/plan.md) | `reviews/plan.md` |
| `test-cases` | `test-cases.md` | 测试 | [prompts/test-cases.md](prompts/test-cases.md) | `reviews/test-cases.md` |
| `code` | 整体 diff（对照 plan + spec） | 架构师 / 工程师 | [prompts/code.md](prompts/code.md) | `reviews/code.md` |

**永远收敛——但分清三种 finding，不越界替用户拍板**：

- **机械、明确的**（格式、和约定不符、实现跟上游对不上）→ **直接改产物**，重评，收敛到没有这类问题（最多 3 轮兜底）。
- **要权衡的**（怎么改是个 tradeoff、该用户定）→ **不擅自选边，在报告里标出来**，交回调用方。
- **方向性的**（产物和上游矛盾，即 `reflow-required`）→ **停下，提示走 `/rivo:reflow`**。

## 任务清单

1. **解析** —— 从 `$ARGUMENTS` 取产物（阶段产物或直接路径）与**类型**（`prd`/`spec`/`plan`/`test-cases`/`code`）
2. **选 reviewer** —— 跨厂商优先，逐级降级
3. **派 reviewer subagent** —— 每个不同模型一个，单消息多 Agent，prompt = 该类型 rubric + 通用 finding 格式 + 产物路径
4. **收敛** —— 机械的改掉、要权衡的标出来、方向性的提示 reflow；每轮 findings 写进 `reviews/<type>.md`
5. **结束语** —— 产物（`reviews/<type>*.md`）、关键结论（findings 数与严重度分布、改了哪些 / 标了哪些 / 是否需 reflow，≤3 条）、交回调用方

## 工作流程

**选 reviewer（异质优先）**

按可信度从高到低选，目的是减少单模型盲区。不硬编码工具名，靠语义匹配当前会话能力：

1. **跨厂商**（检测到 codex 系等跨厂商 review 能力时优先）→ 高可信
2. **同厂商不同模型**（如 Opus 评 Sonnet）→ 中可信
3. **同模型兜底** → 低可信，必须在报告里显眼标注

**派 reviewer 与收敛**

- 按调用方传入的**类型**取 [prompts/](prompts/) 下对应 rubric——角色视角与侧重都在里面，调用方不再自己列维度。
- 每个与原作者不同的模型派一个 reviewer subagent（单消息多 Agent）。每个 subagent 的 prompt 自包含，由三段拼成：① 该类型的 rubric 内容（或让它读 `prompts/<type>.md`）；② 通用 finding 格式——逐条给**严重度、位置、问题**，并归类为「机械 / 要权衡 / 方向性」三类之一；③ 要读的产物路径（`code` 类型还要给 `plan.md` + `spec.md` 作对照基准）。
- 汇总进 `reviews/<type>.md`（多轮每轮写 `<type>-r<N>.md`，外加收敛总结 `<type>-loop.md`）。每条 finding 写清严重度、位置、问题，以及怎么处理的（已改 / 待用户定 / 需 reflow）。

**收敛**

机械的直接改产物、重评，收敛到没有这类问题（最多 3 轮兜底）；要权衡的标出来、交回调用方；遇 `reflow-required` 就停下、提示用户走 reflow。

3 轮后仍有机械项没消干净：别静默当作已收敛——标 `unconverged`、把残留清单写进 `<type>-loop.md`，交回调用方决定升级 reflow 或人工介入。多数情况下，3 轮还改不掉的「机械」项其实是被误分类的 tradeoff / 方向性问题，按后两类（标出 / `reflow-required`）处理即可。

## 核心原则

- **按产物组织、角色化视角** —— 评的是产物，类型定 rubric、rubric 定角色（产品评 prd/spec、工程评 plan/code、测试评 test-cases）；异质模型 × 角色视角双重独立。
- **异质模型** —— reviewer 要和原作者不同模型，同模型兜底必须标低可信。
- **不硬编码工具名** —— 靠语义匹配当前会话能力，而不是写死某个工具。
- **只收敛产物，不推状态** —— review 改产物 + 产 `reviews/<type>.md`（它影响下游产物，故留痕可审计）；要不要批准、批准了没，是调用方按自己 HARD-GATE 的事，不归 review 管。

## 反例

**"跨厂商能力没探到，就默默用同模型评审，还不标低可信"** —— 同模型自评本身是允许的兜底，**不标注**才是真陷阱：调用方和用户会把它当成有外部视角的评审来信任，盲区被悄悄放行。探不到异质 reviewer 时可以兜底，但必须在报告里显眼标「低可信」，让大家心里有数。
