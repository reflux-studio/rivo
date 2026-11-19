<div align="center">

# Rivo

**设计由你主导，AI 查证、实施，并把理由留下来。**

面向 Claude Code、Codex、Antigravity 与 Gemini CLI 的软件交付技能，围绕代码仓库分阶段推进需求。

<img alt="version" src="https://img.shields.io/badge/version-0.13.0-2f9e6b">
<img alt="hosts" src="https://img.shields.io/badge/hosts-Claude%20Code%20%7C%20Codex%20%7C%20Antigravity%20%7C%20Gemini%20CLI-5f6b7a">
<img alt="license" src="https://img.shields.io/badge/license-MIT-5f6b7a">

[为什么](#为什么) · [怎样工作](#怎样工作) · [开始使用](#开始使用) · [设计原则](#设计原则) · [技能](#技能)

</div>

<br>

<p align="center">
  <img src="assets/delivery.svg" width="880" alt="四阶段交付：讨论、方案、实施、知识；你在阶段间确认理解、批准并授权、验收；需变更已确认内容时，经你确认后从受影响的上游修订">
</p>

## 为什么

AI 写出了能运行的代码，团队却未必清楚它为什么这样设计。等到下一次修改，大家还得重新查明哪些行为可以改、哪些约束必须保留。

Rivo 把设计和决定权留在人手里。你从需求和自己的思路开始，AI 查清现状、提出需要取舍的问题；重要决定由你拍板，理由写进文档。方案批准后拆成可逐项走查的任务，做完经过独立审阅与验收，再把核实过的机制整理进项目知识库。

## 怎样工作

| 阶段 | AI 做什么 | 你决定什么 | 留下什么 |
| --- | --- | --- | --- |
| **讨论** | 先问你是否已有方向，查清现状与组件映射，按决策树提问 | 范围、方向与重要取舍 | `decisions.md`、ADR、`research/` |
| **方案** | 写出精炼的技术方案并审阅；你批准后，在同会话拆出 `task.md` | 是否批准方案 | `plan.md`、`task.md` |
| **实施** | 按任务实施、自测与独立审阅，收尾时对照项目约定核对发布准备 | 走查校准与是否验收 | 代码、`task.md`、验证与审阅记录 |
| **知识** | 对照最新代码把核实过的机制合进知识库 Wiki，归档需求目录 | — | 项目知识库（`knowledge/`） |

实施中发现方案局部有误时，通过 `revising` 从受影响的最上游一层逐层修改；如果中后期发现底层模型需要推翻重做，先收尾或冻结当前需求，另开独立的重构需求。下图是实施阶段的往来：

<p align="center">
  <img src="assets/review.svg" width="820" alt="实施时序：每项任务实施与审阅；有属实 P0 时修复并复核，需改变已确认内容时进入修订；全部任务完成后整体审阅并核对发布准备，再请你验收">
</p>

每类产物只有一个位置，互不搬运：

| 产物 | 回答什么 | 位置 |
| --- | --- | --- |
| 现状 | 现有系统怎样工作，设计稿对应哪些本地组件 | `research/` |
| 决定 | 本期做什么、不做什么，定了哪些事，为什么 | `decisions.md`、`adr/` |
| 技术方案 | 架构边界、核心模型、参照样板与新增契约 | `plan.md`、`assets/` |
| 实施方案 | 任务拆解、复用约定，以及每项任务的实测踩坑记录 | `task.md`、`evidence/` |
| 知识库 | 各系统模块现在怎样工作（按系统域组织的 Wiki） | `knowledge/` |

## 开始使用

带着目标和你自己的思路开始（还没有具体思路时，也可以让 AI 先查现状再给建议）：

> 用 Rivo 完成供应商档案优化。本期包括字段配置、档案页展示、表单物料、历史数据处理和报表接入。先核对我的拆解，查清现状与组件映射，再讨论需要决定的问题。

交付依次经过讨论、方案（含拆解 `task.md`）、实施与用户验收、知识整理；方法技能可以独立使用，做完就结束：

> 用 investigating 查清数组字段的读取方式。
>
> 用 systematic-debugging 定位这个测试失败的原因。

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

#### Antigravity

在终端运行：

```sh
agy plugin install https://github.com/reflux-studio/rivo
```

#### Gemini CLI

在终端运行：

```sh
gemini extensions install https://github.com/reflux-studio/rivo
```

各宿主分别通过根目录 `plugin.json`（Antigravity）、`gemini-extension.json`（Gemini CLI）、`.claude-plugin/` 与 `hooks/claude-hooks.json`（Claude Code）、`.codex-plugin/`（Codex）加载同一套 `skills/`。安装后开启新会话，说「用 Rivo」并描述需求即可。

## 设计原则

- 人主导设计：设计前先问你是否已有方向，没有时 AI 再拟方案；代码和配置能查明的事实由 AI 自己查，重要取舍由你决定。
- 方案与任务同会话产出，实施分次接力：批准 `plan.md` 后趁当前上下文完整立即拆出 `task.md`；之后可按任务分次开启新会话推进，靠 `task.md` 的实测记录和已提交的样板代码接力，既不用一个会话硬撑上千轮，也不用把新功能盲目外包给缺少上下文的子代理。
- 方案做减法，代码先复用：`plan.md` 只写架构、边界、参照样板和新增契约，不抄 PRD 里的按钮显隐细则；动手写代码前先复用仓库已有的组件和样板。
- 独立双轴审阅：每项任务和整体收尾由独立审阅者分别检查“代码写得好不好”和“需求做对没有”，并在任务开始时建待办清单防止遗漏。
- 知识库按系统域维护：像 Wiki 一样按系统或能力域合并更新，不为每个需求单新建结项总结；写作和画图遵循项目自身的约定，不绑定特定工具。

每条原则的来由见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 技能

<p align="center">
  <img src="assets/skills.svg" width="880" alt="技能分类：入口 using-rivo、按需修订 revising、四个阶段技能，以及可独立使用的调查、委派、测试和调试方法">
</p>

**交付流程**

| 技能 | 用途 | 模板与提示词 |
| --- | --- | --- |
| [converging](skills/converging/SKILL.md) | 询问方向、查清事实与组件映射，按决策树讨论并记录决定 | [决定记录](skills/converging/references/decisions.md)、[ADR](skills/converging/references/adr.md) |
| [writing-plans](skills/writing-plans/SKILL.md) | 编写、审阅和修订技术方案，批准后在同会话拆出 `task.md` | [技术方案](skills/writing-plans/references/plan-structure.md)、[方案审阅](skills/writing-plans/references/plan-reviewer.md)、[接收意见](skills/writing-plans/references/receiving-review.md)、[拆解任务](skills/writing-plans/references/planning.md) |
| [implementing-plans](skills/implementing-plans/SKILL.md) | 按任务实施、独立双轴审阅、发布核对与验收 | [审阅者](skills/implementing-plans/references/reviewer.md)、[接收意见](skills/implementing-plans/references/receiving-review.md) |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 把核实过的机制合进知识库 Wiki，归档需求材料 | [知识 Wiki 结构](skills/knowledge-management/references/knowledge.md) |
| [revising](skills/revising/SKILL.md) | 已确认的内容局部有变时，从受影响的上游逐层改到代码 | — |

**方法**

| 技能 | 用途 |
| --- | --- |
| [investigating](skills/investigating/SKILL.md) | 查清技术事实与组件映射，维护[调查笔记](skills/investigating/references/note-structure.md) |
| [dispatching-subagents](skills/dispatching-subagents/SKILL.md) | 安排独立调查、独立审阅或样板定型后的批量委派 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 用失败测试驱动行为实现 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 复现异常，检验原因假设并验证修复 |

[using-rivo](skills/using-rivo/SKILL.md) 是入口，说明什么时候走 Rivo、交付顺序和目录约定。

## 文件位置

```text
.rivo/
├── issues/<需求>/
│   ├── decisions.md   范围、决定与待决事项
│   ├── adr/           重要取舍及理由
│   ├── research/      按主题维护的调查笔记
│   ├── plan.md        技术方案
│   ├── assets/        方案附件
│   ├── task.md        实施方案与每项任务的实测记录
│   ├── evidence/      验证证据与一次性排障记录
│   └── reviews/       审阅报告
├── knowledge/         按系统域组织的知识库 Wiki
└── archived/          验收后归档的需求
```

用户或项目指定的位置优先。需求根目录只放以上入口，不留临时对比或一次性脚本。

## 参与修改

先读 [CONTRIBUTING.md](CONTRIBUTING.md)，再动技能。它记录了每个设计决定的理由。

## 许可证

[MIT](LICENSE)
