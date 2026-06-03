---
name: using-rivo
description: 在 rivo 仓库的每次对话开始时使用。导航总纲：介绍 rivo 工作流、可用 skill、issue 状态机、目录结构与典型路径。任何提到需求/工单/澄清/方案/实现/评审/调研/归档的请求都先看这里。
user-invocable: false
---

<SUBAGENT-STOP>
作为 subagent 被派发执行具体任务时，跳过本 skill。父级已经为你加载了正确的上下文；你的职责是那个任务，不是这套启动引导。
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
只要某个 rivo skill 有哪怕 1% 可能适用，就**优先调用它**（对 `disable-model-invocation` 的 reflow 则**主动提示用户**运行）。多触发一次的代价（skill 前置检查后退出）远低于少触发一次的代价（AI 自行臆断，写出不符合规范的产物）。每个 skill 的触发场景写在它自己的 `description` 里、始终在上下文，按语义匹配即可——不必额外记关键词表。
</EXTREMELY-IMPORTANT>

## rivo 是什么

rivo 是一个需求驱动的 AI 开发工作流。一次交付被拆成 5 个生命周期状态 —— **created → specified → planned → coded → archived** —— 每个阶段独立可中断、可评审、可回退，并配套 3 个横切方法论（survey / handoff / report）、2 个产物链治理机制（review / reflow）、1 个可选开发节点（design，搭 UI 壳）、1 个可选验收节点（uat）、1 个编排入口（auto）。

核心心法：**文档是唯一交付物**（skill 间靠文件路径而非对话传递）、**单向数据流 + 显式回退**（reflow 不 rewind 产物，只回滚 `status` 指针）、**AI 决定动作、用户决定方向**（开放决策 / 方向 / 安全停点必停问人）、**产物质量交给 review 自审**（不逐个停下求批准）。

## 可用 skill

### 项目设置（一次性 / 偶发）

| skill | 作用 |
|-------|------|
| `/rivo:init` | 仓库首次接入 rivo，建立 `.rivo/` 骨架、`PROJECT.md` 与 `ARCHITECTURE.md` |

> `init` 产出两份**跨 issue 维护**的文档：`PROJECT.md`（身份 / 用户 / 能力 / 技术栈 / 规约）与 `ARCHITECTURE.md`（技术架构：模块 / 数据流 / 存储 / 不变量）。后者由 `plan` 读取做架构决策、`review` 当尺子、`archive` 在架构变动时同步——是 rivo 约束「架构逐渐失控」的抓手。代码仍是实现唯一真相，ARCHITECTURE.md 是与代码对齐的骨架与意图、冲突时以代码为准。

### 生命周期（推进 issue 状态）

全程在你当前所在的分支上执行（rivo 不自建分支/worktree，隔离按 `PROJECT.md` 的分支约定、归你）。"产品"（issue 登记+澄清 PRD、spec 译验收标准）与"开发"（plan / design / code / uat / archive）只是概念区分，无物理分界。

| skill | 作用 | 入口 | 出口 |
|-------|------|------|------|
| `/rivo:issue` | 登记需求，并澄清成 PRD | — | `created` |
| `/rivo:spec` | 把 PRD 机械翻译成 EARS 验收标准 | `created` | `specified` |
| `/rivo:plan` | 拆 plan.md + test-cases.md（进入实现） | `specified` | `planned` |
| `/rivo:design`（可选） | spec 涉及 UI 时用真实前端栈还原 UI 壳 | `planned`（UI 先行可放宽到 `specified`） | `planned` |
| `/rivo:code` | 按 plan 实现 + 红绿灯测试 | `planned` | `coded` |
| `/rivo:uat`（可选） | 指引人工验收、收集反馈 | `coded` | `coded` |
| `/rivo:archive` | 完结 + 沉淀 learnings、移目录 | `coded` | `archived` |

> `issue` 只产出 PRD（`README.md`），不再含 spec——验收标准由独立的 `/rivo:spec` 翻译。issue 一次性产出 PRD 即到 `created`，**没有 `draft` 这个中间态**；澄清中途中断，重跑 `/rivo:issue <id>` 读已落盘的 README 续清即可。

### 横切方法论

场景 / 流程无关的标准化作业方法。不依赖 rivo 的状态机或产物链，任何阶段、任何调用方都能调用，也可独立于 rivo 使用。详见各自 SKILL.md。

| skill | 作用 | 典型调用方 |
|-------|------|-------------|
| `/rivo:survey` | 内部代码现状摸底（→ context.md）或外部技术调研（→ surveys/） | issue（内部）/ plan（外部）/ 用户独立调用 |
| `/rivo:handoff` | 上下文 checkpoint | 用户主动触发；产物存 `handoffs/<ts>.md` |
| `/rivo:report` | 把产物用人话主讲给用户、求校准（即焚、不落文件） | 手动模式下 issue / spec / plan / code 收尾主讲 / 用户独立调用、讲给干系人；auto 下不触发 |

### 产物链治理机制

因 rivo 的单向数据流而生，与产物链、状态机耦合，**不可独立于 rivo 使用**：review 是**前向收敛门**（机器侧自审、按产物类型自动收敛），reflow 是**后向回退门**（诊断方向性缺陷、回上游重评估）。

| skill | 作用 | 典型调用方 |
|-------|------|-------------|
| `/rivo:review` | 按产物类型派跨模型 / 跨角色视角评审并自动收敛（机器侧，`user-invocable: false`） | issue / spec / plan / code 的收敛门内嵌，不由用户直接调 |
| `/rivo:reflow` | 诊断产物链根因 + 建议回退路径（只诊断，不改产物） | code/uat 遇方向性问题 / 用户主动 |

> review 按**产物类型**组织、各有固定角色视角：`prd`（产品/用户）、`spec`（产品/用户+可验证）、`plan`（架构师/工程师）、`test-cases`（测试）、`code`（架构师/工程师+满足 AC）。留痕落 `reviews/<type>.md`。

### 编排

| skill | 作用 |
|-------|------|
| `/rivo:auto` | 自动串联整条生命周期；遇开放决策 / reflow / uat 不通过 / 会丢工作的操作、以及收敛门仅同模型兜底（低可信）时必停问人 |

## issue 状态机

```
[无] ─issue─▶ created ─spec─▶ specified ─plan─▶ planned ─code─▶ coded ─archive─▶ archived
                                                    │              │
                                          design(可选,不改态)   uat(可选,验收门,不改态)
   reflow 诊断根因层 ─▶ 用户对该层 --rebuild ─▶ status 回滚到该层出口 ─▶ 下游前向重跑(复用产物)
```

- `issue` 一次性产出 PRD 到 `created`（无 `draft` 中间态，中断后重跑 `issue <id>` 读 README 续清）；`spec` 译验收标准到 `specified`；`plan` 是 `specified → planned` 的边界（进入实现）。
- **统一状态规则**：`status` = 最近跑完的生命周期 skill 的出口态（=「一致性前沿」，所有产物彼此一致的最远点）。首次推进与 `--rebuild` 返工同此一条规则。
- `design` 常规在 `planned`（plan 之后）；经用户确认做 **UI 先行**探索时可放宽到 `specified`（此时 `plan.md` 尚不存在属正常）。`design` / `uat` 都**不改状态**——UI 先行后仍须回跑 `/rivo:plan` 才能把 `specified` 推进到 `planned`；uat 是 `coded` 上的 pass/fail 验收门。
- 非法迁移由各 skill 前置检查兜底。
- **reflow + 回滚**：reflow 不直接改状态（只产诊断报告 + 重跑建议）；用户对根因层跑 `--rebuild` 后，按统一规则 `status` **回滚到该层出口态**（PRD→`created`、spec→`specified`、plan→`planned`），下游被显式标记 stale、由用户前向重跑收敛。盘上产物**不删、可复用**——reflow 只回滚指针、不 rewind 产物。reflow 回退路径可指向 **issue / spec / plan** 任一上游层。
- **`--rebuild` 允许态**（放宽入口校验、读 reflow 报告、基于现有产物重做；改完按统一规则设 `status` 为该 skill 出口态）：`issue` 可在 `created`/`specified`/`planned`/`coded` 上重做 → 回 `created`；`spec` 在 `specified`/`planned`/`coded` → 回 `specified`；`plan` 在 `planned`/`coded` → 回 `planned`；`code` 在 `coded` 上原地返工 → 保持 `coded`（同层、不回滚）。`design`/`uat` 无 `--rebuild`。
- `archive` 前若存在 `uat.md`，其结论须为「通过」；uat 不通过不进 archive，按 uat 缺陷分流（code --rebuild / reflow / 新 issue）回流，验收通过后再 archive。
- 归档后按 `PROJECT.md` 的分支约定合并、清理由用户（或外部 PM）做，rivo 不 merge、不直提主线。

## 目录结构

```
your-repo/
├── .rivo/
│   ├── PROJECT.md                       # 项目宪章：身份/能力/技术栈/规约（/rivo:init）
│   ├── ARCHITECTURE.md                  # 技术架构：模块/数据流/存储/不变量（init 播种，archive 同步）
│   ├── issues/<id>/                     # 进行中的 issue
│   │   ├── README.md                    # 需求描述 + 状态 frontmatter（PRD，issue）
│   │   ├── spec.md                      # 验收标准 EARS（spec）
│   │   ├── plan.md                      # 技术方案（plan）
│   │   ├── test-cases.md                # 测试用例（plan）
│   │   ├── context.md                   # 代码现状（survey 内部分支，可选）
│   │   ├── surveys/<topic>.md           # 外部调研（survey 外部分支，可多份）
│   │   ├── design/                      # 设计稿 + demo（design，可选）
│   │   ├── reviews/<type>.md            # 评审记录（review）：prd/spec/plan/test-cases/code；多轮加 <type>-r<N>.md + <type>-loop.md
│   │   ├── reflows/<ts>-<topic>.md      # 诊断报告（reflow，可多份）
│   │   ├── uat.md                       # 验收记录（uat，可选）
│   │   ├── handoffs/<ts>.md             # 上下文 checkpoint（handoff，可选）
│   │   └── assets/                      # 截图 / PRD / 外部文档
│   ├── archived/<id>/                   # 已归档的 issue（同上结构）
│   └── learnings/<slug>.md              # 跨 issue 的踩坑 / 模式沉淀
└── ...                                  # 源代码

# 注：.rivo/ 与源码改动都落在你当前所在的分支上；要不要为每个 issue 开独立分支、怎么合并/清理，
#     按 PROJECT.md 的分支约定来——rivo 不自建分支、不 merge、不直提主线。
```

## 典型路径

> 路径是导航参考，不是硬性规定。不确定下一步就回查这里，仍不确定就问用户。

```
/rivo:issue <desc>     登记 + 澄清 PRD                      → created
                       内嵌 survey（代码现状 → context.md）；逐项收敛需求决策
                       review(prd) 收敛；手动模式 report 主讲 PRD，自然暂停
/rivo:spec <id>        把 PRD 译成 EARS 验收标准 spec.md     → specified
                       review(spec) 收敛；手动模式 report 主讲，自然暂停
/rivo:plan <id>        拆 plan.md + test-cases.md           → planned
                       读 ARCHITECTURE/PROJECT 做架构决策；内嵌 survey（外部选型 → surveys/，如需）
                       review(plan)+review(test-cases) 收敛；手动模式 report 主讲，自然暂停
[条件] /rivo:design     spec 涉及 UI 时，plan 后用真实前端栈还原 UI 壳，起项目视觉验证 + 用户确认
/rivo:code <id>        按 plan 实现 + 红绿灯测试             → coded
                       每 task 自查（测试/lint）；全部完成后 review(code) 收敛；手动模式 report 主讲，自然暂停
                       遇阻：/rivo:reflow 诊断 + 用户决定回哪步
[可选] /rivo:uat <id>   指引人工验收 → uat.md
/rivo:archive <id>     沉淀 learnings、架构变动则同步 ARCHITECTURE.md、移目录、改状态  → archived
（你）按 PROJECT.md 分支约定合并、清理（rivo 不 merge）
```

通用动作（任意阶段）：`/rivo:handoff`（上下文将满）、`/rivo:survey [topic]`（独立调研）、`/rivo:report <id>`（让 AI 主讲当前产物）、`/rivo:reflow <id>`（主动诊断回退）。

## 全局约定（速查）

硬纪律（前置检查、review 收敛门、红绿灯门禁、commit、ARCHITECTURE 同步、learnings 读写）已**内联在各生命周期 skill 正文**，调用即生效。这里只列真正跨 skill、且不在单个 skill 里的约定：

- **语言偏好** —— 产物（README / spec / plan / 代码注释 / commit / reviews / 结束语等）跟随对话语言：中文对话→中文产物，英文→英文；混用跟最近主导语言，同一份文件内不混用。
- **Subagent 并行** —— 多候选 / 多视角 / 多独立 task 默认并行：单消息多 Agent 才真并行；prompt 自包含（要读的路径、问题、输出格式都写进去）；以实际产物（diff / 文件）为准，不只看 subagent 的总结；顺序依赖 / 共享写同一文件 / 需用户决策时不并行。
- **评审与批准** —— 产物质量由机器侧 `/rivo:review` 按产物类型自审收敛把关（两种模式都跑）。skill 默认按**手动模式**执行；仅当由 `/rivo:auto` 编排驱动时才走 **auto 模式**。手动模式下生命周期 skill（issue / spec / plan / code）review 收敛、commit 后走 `/rivo:report` 主讲，skill 自然结束、工作流暂停，用户跑下一个 skill 即认可（不满意则 `--rebuild` / `reflow`），不需要单独的"请批准→OK"握手。auto 模式不走 report、不等产物批准，仅在开放决策 / `reflow-required` / uat 不通过 / 会丢工作的操作处停。（`design` 例外：产物是视觉的，靠起项目肉眼确认，不跑 review/report。）
- **会丢工作的操作需批准** —— `revert` / `git reset --hard` / 强删分支等可能丢失已提交工作的操作，无论手动还是 auto，都要用户明确批准。
- **跨模型 reviewer** —— 见 `/rivo:review`：跨厂商优先（高可信）→ 同厂商不同模型（中）→ 同模型兜底（低，须显眼标注）。

---

不确定下一步：回查"典型路径"。还不确定就问用户。
