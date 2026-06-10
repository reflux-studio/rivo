---
name: using-rivo
description: rivo 工作流总纲——阶段、产物、目录与全局原则
when_to_use: 使用任何 rivo 技能前先读它，了解当前阶段在整个工作流中的位置
user-invocable: false
---

# rivo 是什么

rivo 是一套帮独立开发者从需求澄清到代码交付的全流程工作流，让 AI 像一个真实的产研团队那样交付：每个阶段对应团队里的一个环节，产物人类可读，需求与方案两道关口由人把关。

核心信条：**代码只是产品，理解才是资产。** AI 负责写，用户负责懂——关键决策必须摆到用户面前确认。

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

两个横切能力，任意阶段按需调用：

- **review** —— 任何产物写完，派一个独立上下文的模型交叉评审，分级分类后驱动修复
- **backtrack** —— 下游发现上游错时，定位根因层、回该层修正、再向下重放

## 技能总表

每个技能对应真实团队里的一个环节：

| 技能 | 对应环节 | 作用 | 产物 | 触发 |
| --- | --- | --- | --- | --- |
| `init` | 接手盘点 | 调研仓库，建 `.rivo/` 骨架与宪章 | PROJECT / ARCHITECTURE / DESIGN.md | 一次性 |
| `clarify` | 需求评审 | 提出 / 变更需求，澄清到位，请用户定版 | prd.md + spec.md | 每个需求起点 |
| `ui-plan` | 设计走查 | 设计评审、视觉还原、交互验收 | ui-plan.md + ui-contract.md | 涉及前端 |
| `plan` | 方案评审 | 技术方案请用户定版，再拆任务 | plan.md + tasks.md | 需求澄清后 |
| `build` | 开发 | 逐任务 TDD 实现，每个任务过两级审查 | 实现代码 | 方案与拆分后 |
| `verify` | UAT 验收 | 按验收标准（AC）逐条人工验收 | uat.md | build 完成后 |
| `archive` | 复盘会 | 沉淀 learnings、同步架构、归档 | learnings + 归档 | 需求完结 |
| `review` | 同行评审 | 独立上下文交叉评审产物并驱动修复 | reviews/ | 横切，任意产物 |
| `backtrack` | 缺陷返工 | 定位缺陷根因层并回源修复 | —— | 横切，发现上游错 |

## 目录结构

```
your-repo/
├── .rivo/
│   ├── PROJECT.md              # 项目宪章：身份 / 技术栈 / 规约
│   ├── ARCHITECTURE.md         # 技术架构：模块 / 数据流 / 存储 / 分层
│   ├── DESIGN.md               # 设计规约：token / 组件库 / 断点（涉及前端才有）
│   ├── issues/<issue-id>/      # 进行中的 issue
│   │   ├── prd.md              # PRD（clarify 产出）
│   │   ├── spec.md             # 需求规格：EARS 功能需求 + AC 验收标准（clarify 产出）
│   │   ├── ui-plan.md          # UI 还原计划（ui-plan 产出，可选）
│   │   ├── ui-contract.md      # UI 契约（ui-plan 产出，可选）
│   │   ├── plan.md             # 技术方案，含「现状与影响面」（plan 产出）
│   │   ├── tasks.md            # 任务清单（plan 产出）
│   │   ├── uat.md              # 验收记录（verify 产出）
│   │   ├── reviews/            # 交叉评审记录
│   │   └── assets/             # 用户放入的截图 / 设计稿 / 资料
│   ├── reviews/                # 不属于任何 issue 的评审记录（如宪章文档）
│   ├── archived/<issue-id>/    # 已归档 issue
│   └── learnings/<slug>.md     # 跨 issue 沉淀的经验
└── ...
```

issue 的标识（即各技能参数里的 `issue-id`）是一个 3–5 词的 kebab-case slug（如 `order-export`），由 clarify 在新建时确定，不带序号——多分支并行也不撞。

## 全局原则

- **宪章约束决策，决策派生执行** —— 宪章文档（PROJECT / ARCHITECTURE / DESIGN）一次定义、长期维护，约束每个需求的决策文档（prd / plan，人读人签）；决策再落成给 AI 的执行清单（spec / tasks）。约束与决策各有归处。
- **文件可省，决策不可省** —— 小需求可以跳过某些文件，但不能跳过文件背后的决策。文件只是决策留下的痕迹。
- **工作流单向，纠偏靠 backtrack** —— 沿工作流向下走；下游发现上游错时，用 **backtrack** 定位根因层、回源头改、向下重放，不在下游打补丁。
- **写完就评审** —— 任何产物落地后用 **review** 交叉评审，不能既当运动员又当裁判。
- **两道关口，人来把关** —— 需求定版（**clarify**）与方案定版（**plan**）是工作流仅有的两道关口，AI 把结论摆到用户面前，用户点头才放行。
- **存疑即问，决策归人** —— 不确定就确认而非猜测，歧义当场指出；方向上的决策一律由用户拍板。
- **一切落文件** —— 决策、评审、验收都留痕，对抗遗忘、可追溯。
- **产物落盘即提交** —— 每个阶段收尾把本阶段产物（含 reviews/）单独提交：`docs: clarify <issue-id>`、`feat: ui <issue-id>`、`docs: plan <issue-id>`、`docs: uat <issue-id>`、`chore: archive <issue-id>`；build 的代码提交跟红绿循环走，message 带 `(Task N of <issue-id>)`。文档与代码不混提。
