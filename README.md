# rivo

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 一套给独立开发者的 AI 研发工作流：让 AI 像一个真实的产研团队那样交付。

**一个人，跑出一个团队的交付质量。**

AI 已经能把代码全写了，但「写得出」和「交付得住」之间，隔着一整个团队的流程：需求有人澄清、方案有人评审、代码有测试纪律、上线前有人验收、出了问题能追到根因。独立开发者没有这个团队。rivo 把这套流程原样搬给你的 AI——每个阶段对应一个角色的活儿，产物人类可读，关键决策由你拍板。

rivo 是一套 agent skills——一组 SKILL.md 指令文件加插件声明，以插件形式装进 Claude Code 或 Codex 即生效，按 `/rivo:<阶段>` 调用。

## 它和别的工作流有什么不同

同类工作流的取舍可以放在四个维度上看：事实源放在哪、有没有宪章层、自动化推到多满、为谁优化。

| | 事实源 | 宪章层 | 自动化程度 | 为谁优化 |
| --- | --- | --- | --- | --- |
| [openspec](https://github.com/Fission-AI/OpenSpec) | spec（长期活文档，变更合回） | 无 | 低——人审每个变更提案 | 人机对需求无歧义 |
| [speckit](https://github.com/github/spec-kit) | spec | 有（constitution） | 中——流程化命令逐步推进 | 把 SDD 流程标准化 |
| [superpowers](https://github.com/obra/superpowers) | 代码 + 测试（计划是过程产物） | 无 | 高——subagent 自治执行 | 最少人工干预把活干完 |
| [GSD](https://github.com/glittercowboy/get-shit-done)（get-shit-done） | 计划文档（.planning/） | 有（PROJECT.md） | 高——并行 subagent 自动提交 | 大项目对抗上下文腐化 |
| **rivo** | 调研结果（内部现状 + 外部实践），决策由它派生 | 有（PROJECT / ARCHITECTURE / DESIGN） | 中——两道关口人把关 | 一个人跑出一个团队的交付纪律 |

它们优化的各是流程里的某一段——需求共识、执行效率、或规模工程化。rivo 搬的是真实产研团队的完整仪式：需求评审、设计走查、方案评审、TDD、同行评审、验收、复盘，一个不少，关键节点仍由你拍板。

### UI 还原是一等环节

设计稿先精确还原、由你走查定版、锁进 `ui-contract.md`，build 只做接数据——AI 不会在写逻辑的同时顺手糊样式。全局设计规约 `DESIGN.md` 管住 token、组件库与断点。

> 思想源自于早年间前后端不分离时代的样式还原工程师，只负责产出前端代码，不负责填写业务逻辑

### 评审用的是另一双眼睛

任何产物落地，都派**独立上下文**的模型交叉评审，能跨厂商就跨厂商——比如让 GPT 审 Claude 的产出。作者审自己必然放水，换一双眼睛是原生设计，不是可选插件。

### 返工回根因层

下游发现上游错，不就地打补丁——**backtrack** 先判定根因在哪一层（实现、任务、方案还是需求），回那一层修正，再向下重放。代价是多走几步，换来的是 spec、plan、代码永远一致。

## 核心理念

- **先调研，再下结论**：聊需求、定方案之前先做调研——内部读代码现状，外部查业界实践。决策从调研派生，不从模型记忆里掏。
- **宪章约束决策，决策派生执行**：宪章文档（`PROJECT.md` / `ARCHITECTURE.md` / `DESIGN.md`）一次定义、长期维护，约束每个需求的决策文档（`prd.md` / `plan.md`，人读人签）；决策再落成给 AI 的执行清单（`spec.md` / `tasks.md`）。约束与决策各有归处。
- **工作流单向，纠偏靠 backtrack**：PRD 是唯一需要人来写的源头，spec、plan、代码沿工作流逐级产出，下游忠于上游。要改，回到出错的那一层改起，再向下重放——而不是在下游打补丁。
- **关键决策由你拍板**：需求定版（clarify）和方案定版（plan）两道关口，AI 把结论摆到你面前、你点头才放行；其余环节遇到拿不准的，停下来问而不是替你猜。
- **文件可省，决策不可省**：小需求可以跳过某些文件，但不能跳过文件背后的决策——文件只是决策留下的痕迹。
- **写完就评审**：任何产物落地后，派一个独立上下文的模型交叉评审——不能既当运动员又当裁判。
- **阶段间靠交接**：一个阶段一个会话，收尾写交接纪要、开工先读它——上下文靠交接衔接，不靠攒长对话。

## 工作流

需求沿工作流单向流动，每一阶段的产物是下一阶段的输入：

```
[一个需求]
  │ clarify    聊清产品诉求                    → prd.md + spec.md
  ▼
  ┊ ui-plan    设计评审 / 视觉还原 / 交互验收     → ui-plan.md + ui-contract.md    （涉及前端才走）
  ▼
  │ plan       技术方案 + 任务拆分               → plan.md + tasks.md
  ▼
  │ build      逐任务 TDD 红-绿-重构             → 实现代码
  ▼
  │ verify     按 AC 逐条人工验收                → uat.md
  ▼
  │ archive    复盘沉淀 / 同步架构 / 归档          → learnings + 归档目录
  ▼
[完结]
```

三个横切能力，由各阶段按需调用：

- **review** —— 任何产物写完，派一个独立上下文的模型交叉评审，分级分类后驱动修复。
- **backtrack** —— 下游发现上游错时，定位根因层、回该层修正、再向下重放。
- **handoff** —— 阶段收尾沉淀交接纪要，下一阶段开新会话凭它快速接手，不靠攒长对话。

## 技能一览

每个技能对应真实团队里的一个环节：

| 技能 | 对应环节 | 作用 | 产物 |
| --- | --- | --- | --- |
| `init` | 接手盘点 | 调研仓库，建 `.rivo/` 骨架与宪章 | PROJECT / ARCHITECTURE / DESIGN.md |
| `clarify` | 需求评审 | 提出 / 变更需求，澄清到位，请你定版 | prd.md + spec.md |
| `ui-plan` | 设计走查 | 设计评审、视觉还原、交互验收（涉及前端才走） | ui-plan.md + ui-contract.md |
| `plan` | 方案评审 | 技术方案请你定版，再拆任务 | plan.md + tasks.md |
| `build` | 开发 | 逐任务 TDD 实现，每个任务过两级审查 | 实现代码 |
| `verify` | UAT 验收 | 按验收标准（AC）逐条人工验收 | uat.md |
| `archive` | 复盘会 | 沉淀 learnings、同步架构、归档 | learnings + 归档 |
| `review` | 同行评审 | 独立上下文交叉评审产物（横切，任意产物） | reviews/ |
| `backtrack` | 缺陷返工 | 定位根因层并回源修复（横切，发现上游错） | —— |
| `handoff` | 交接 | 沉淀交接纪要，下一阶段在新会话快速接手（横切，每阶段收尾） | handoff.md |

## 安装

### Claude Code

```
/plugin marketplace add reflux-studio/rivo
/plugin install rivo@rivo-marketplace
```

### Codex

在 Codex CLI 中输入 `/plugins` 搜索 `rivo` 安装（上架官方插件市场后可用）。

## 怎么用

1. **接入一次**：在仓库里跑 `/rivo:init`，调研项目、建立 `.rivo/` 骨架与宪章文档。
2. **每个需求沿工作流走**：`/rivo:clarify` →（`/rivo:ui-plan`）→ `/rivo:plan` → `/rivo:build` → `/rivo:verify` → `/rivo:archive`。带括号的 ui-plan 按需走——不涉及前端就跳过。
3. **发现上游错就回溯**：任意阶段察觉根因在更上游，用 **backtrack** 回源头改、向下重放，而不是就地打补丁。

以「订单列表加导出」为例，一个需求的完整旅程：

```
/rivo:clarify 订单列表要支持导出 CSV
   # 对话澄清 → 产出 prd.md + spec.md（含 AC 编号）→ 请你定版
/rivo:ui-plan order-export
   # 设计稿评审 → 还原 UI → 你走查通过 → 产出 ui-contract.md
/rivo:plan order-export
   # 调研 → 技术方案 → 请你定版 → 拆成任务清单
/rivo:build order-export
   # 逐任务 TDD，每个任务过两级审查，最后全局终审
/rivo:verify order-export
   # 按 AC 逐条人工验收，结论落 uat.md
/rivo:archive order-export
   # 复盘沉淀 learnings → 同步宪章文档 → 归档
```

## 最佳实践

- **宪章文档要持续维护**。`PROJECT.md` / `ARCHITECTURE.md` / `DESIGN.md` 是整个工作流的约束源，归档阶段动了架构就同步回去，别让它腐化。
- **把好两道关**。clarify 和 plan 收尾时 AI 会请你定版——认真读完再点头，掌控感来自这两次确认，而不是事后翻代码。
- **方向性问题交给人**。评审发现的不是简单缺陷、而是需求或方案本身的缺陷时，回上游或交你拍板，别让 AI 自作主张硬补。
- **learnings 宁缺毋滥**。只沉淀真问题、真经验，凑数的流水账会污染检索。

## 目录结构

```
your-repo/
├── .rivo/
│   ├── PROJECT.md              # 项目宪章：身份 / 技术栈 / 规约
│   ├── ARCHITECTURE.md         # 技术架构：模块 / 数据流 / 存储 / 分层
│   ├── DESIGN.md               # 设计规约：token / 组件库 / 断点（涉及前端才有）
│   ├── issues/<issue-id>/      # 进行中的 issue（prd / spec / plan / tasks / uat / handoff / reviews / assets）
│   ├── archived/<issue-id>/    # 已归档 issue
│   └── learnings/<slug>.md     # 跨 issue 沉淀的经验
└── ...
```

issue 的标识（即各技能参数里的 `issue-id`）是一个 3–5 词的 kebab-case slug（如 `order-export`），由 clarify 在新建时确定，不带序号——多分支并行也不撞。
