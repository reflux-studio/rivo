<div align="center">

# Rivo

**设计由你主导，AI 查证、实施，并把理由留下来。**

面向 Claude Code 与 Codex 的软件交付技能

<img alt="version" src="https://img.shields.io/badge/version-0.11.0-2f9e6b">
<img alt="hosts" src="https://img.shields.io/badge/hosts-Claude%20Code%20%7C%20Codex-5f6b7a">
<img alt="license" src="https://img.shields.io/badge/license-MIT-5f6b7a">

[为什么](#为什么) · [怎样工作](#怎样工作) · [开始使用](#开始使用) · [设计原则](#设计原则) · [技能](#技能)

</div>

<br>

<p align="center">
  <img src="assets/delivery.svg" width="880" alt="一次交付：你给出需求与思路、决定取舍、批准并授权、验收；主代理依次经过讨论、方案、实施和知识整理，子代理负责查证、执行和独立审阅；已确认的内容要改时，按需经 revising 回到决定或方案">
</p>

## 为什么

AI 能写出可以运行的代码，团队却未必清楚它为什么这样设计。设计交给 AI 之后，人对系统的理解越来越少；等到下一次修改，还得重新查明哪些行为能改、哪些约束必须保留。

Rivo 让设计留在人手里。你带着需求和自己的拆解开始，AI 查清现状、指出需要决定的问题；重要取舍由你决定，理由写进文档。实施照着你批准的方案进行，验收后，核实过的机制和理由进入项目知识库。

## 怎样工作

| 阶段 | AI 做什么 | 你决定什么 | 留下什么 |
| --- | --- | --- | --- |
| **讨论** | 核对你的拆解，查清依赖，提出需要取舍的问题 | 范围和重要取舍 | `decisions.md`、ADR、调查笔记 |
| **方案** | 按模板写技术方案，组织一次独立审阅 | 是否批准 | `plan.md` |
| **实施** | 按可验收的结果实施，逐任务和整体各审一次 | 是否验收 | 代码、`task.md`、验证证据 |
| **知识** | 对照最新代码更新知识库，归档需求材料 | — | 项目知识库 |

实施中发现方案的假设不成立，AI 带着证据回来找你，只暂停受影响的任务。下图是实施阶段里你、主代理、执行者和审阅者之间的往来：

<p align="center">
  <img src="assets/review.svg" width="820" alt="实施中的往来：逐任务派发与轻审，P0 修复后由同一审阅者复核；已确认的内容要改时带证据交你决定，逐层修订后重做受影响的任务；整体审阅通过后请你验收">
</p>

每类产物只有一个位置，互不搬运：

| 产物 | 回答什么 | 位置 |
| --- | --- | --- |
| 现状 | 现有系统怎样工作，怎样查到的 | `research/` |
| 决定 | 本期做什么、不做什么，定了哪些事，为什么 | `decisions.md`、`adr/` |
| 技术方案 | 本期怎么做 | `plan.md`、`assets/` |
| 实施方案 | 按什么顺序做，实际做成了什么 | `task.md`、`evidence/` |
| 知识库 | 系统现在怎样工作 | `knowledge/` |

已确认的内容要改时，用 revising 从受影响的最上游一层改起，按决定、技术方案、实施方案、代码的顺序逐层核对。

## 开始使用

带着目标和你自己的拆解开始：

> 用 Rivo 完成供应商档案优化。本期包括字段配置、档案页展示、表单物料、历史数据处理和报表接入。先核对我的拆解，查清现状与依赖，再讨论需要决定的问题。

没有拆解也可以只说目标。交付依次经过讨论、方案、实施与用户验收、知识整理；方法技能可以独立使用，做完就结束：

> 用 investigating 查清数组字段的读取方式。
>
> 用 systematic-debugging 定位这个测试失败的原因。
>
> 用 writing-clearly 编辑这份报告，保留现有结构。

普通请求按普通方式处理。项目里有 `.rivo/` 目录，不会让每个请求都进入流程。

### 安装

#### Claude Code

在 Claude Code 会话中依次运行：

```text
/plugin marketplace add reflux-studio/rivo
/plugin install rivo@rivo
```

#### Codex

在终端依次运行：

```sh
codex plugin marketplace add reflux-studio/rivo
codex plugin add rivo@rivo
```

安装后开启新会话，说「用 Rivo」并描述需求即可。

## 设计原则

**人主导设计。** 你给出拆解和方向，AI 核对、查证、建议。范围、业务行为和重要取舍由你决定。

**一套流程，不分档位。** 小需求直接写代码，不必走 Rivo。中大型需求走同一套流程，是否进入由你决定。

**稳定的主线，随内容展开。** 每种产物有自己的模板和固定的位置，团队知道去哪里找什么；章节随本次需求的内容增减。

**审阅要克制。** 方案只在首次定稿前全量审阅一次，之后的修订由你确认。主代理核实每条审阅意见，可以拒绝。

**每次实施都是对方案的检验。** 执行者发现方案走不通时停下来报告证据，不绕开硬做。

**不维护状态。** 进度从文档、审阅报告和实际改动中核对，没有状态文件，也没有跨会话交接。

**技能自包含。** 每个阶段带着自己的模板和审阅提示词，不依赖别的技能的文件。

每条原则的来由见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 技能

<p align="center">
  <img src="assets/skills.svg" width="880" alt="技能结构：入口 using-rivo 路由到四个阶段技能，每个阶段带自己的 references；revising 在已确认的内容要改时回到决定或方案；方法技能按名称加载">
</p>

**交付流程**

| 技能 | 用途 | 模板与提示词 |
| --- | --- | --- |
| [converging](skills/converging/SKILL.md) | 核对范围，讨论并记录每个决定 | [决定记录](skills/converging/references/decisions.md)、[ADR](skills/converging/references/adr.md) |
| [writing-plans](skills/writing-plans/SKILL.md) | 编写、审阅和修订技术方案 | [技术方案](skills/writing-plans/references/plan-structure.md)、[审阅提示词](skills/writing-plans/references/plan-reviewer.md)、[接收审阅意见](skills/writing-plans/references/receiving-review.md) |
| [implementing-plans](skills/implementing-plans/SKILL.md) | 安排实施、审阅与验收 | [实施方案](skills/implementing-plans/references/planning.md)、[执行者](skills/implementing-plans/references/implementer.md)、[审阅者](skills/implementing-plans/references/reviewer.md)、[接收意见](skills/implementing-plans/references/receiving-review.md) |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 维护项目知识，归档交付材料 | [知识文档](skills/knowledge-management/references/knowledge.md) |
| [revising](skills/revising/SKILL.md) | 已确认的内容要改时，从上游逐层改到代码 | — |

**方法**

| 技能 | 用途 |
| --- | --- |
| [investigating](skills/investigating/SKILL.md) | 查清技术事实，维护[调查笔记](skills/investigating/references/note-structure.md) |
| [writing-clearly](skills/writing-clearly/SKILL.md) | 文档的表达规约，可独立使用 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 用失败测试驱动行为实现 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 复现异常，检验原因假设并验证修复 |

[using-rivo](skills/using-rivo/SKILL.md) 是入口，说明什么时候走 Rivo、交付顺序和宿主调用方式。

## 文件位置

```text
.rivo/
├── issues/<需求>/
│   ├── decisions.md   范围、决定与待决事项
│   ├── adr/           重要取舍及理由
│   ├── research/      调查笔记与原始材料
│   ├── plan.md        技术方案
│   ├── assets/        方案附件
│   ├── task.md        实施方案与实施记录
│   ├── evidence/      验证证据
│   └── reviews/       审阅报告
├── knowledge/         项目知识库
└── archived/          验收后归档的需求
```

用户或项目指定的位置优先。

## 参与修改

先读 [CONTRIBUTING.md](CONTRIBUTING.md)，再动技能。它记录了每个设计决定的理由。

## 许可证

[MIT](LICENSE)
