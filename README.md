# Rivo

和 AI 一起讨论需求、设计方案、完成实现。

Rivo 把软件交付分成需求定义、技术设计和增量交付三个阶段。AI 查证事实、提出方案，你决定业务规则和模型；文档与代码由独立子代理审阅。

## 开始使用

安装插件后，在会话中提出需求：

> 用 Rivo 完成这个需求。先核实现状，和我讨论清楚，再写 Spec 和 plan。

AI 会先加载相关技能，说明名称和用途，再开始工作。你可以随时纠正它的理解，或指定只完成某个阶段：

> 用 requirements-definition 评审这份 PRD 和设计稿。

> 用 technical-design 展开已经确认的需求，比较方案和交付安排。

> 用 incremental-delivery 按已确认的方案实施。

> 用 systematic-debugging 查清这个问题的原因。

## 接入

仓库为两种插件格式提供了清单：

| 宿主 | 插件清单 |
| --- | --- |
| Codex | [.codex-plugin/plugin.json](.codex-plugin/plugin.json) |
| Claude Code | [.claude-plugin/plugin.json](.claude-plugin/plugin.json) 和 [marketplace.json](.claude-plugin/marketplace.json) |

按宿主的插件安装流程加载本仓库。[启动 Hook](hooks/hooks.json)提供技能入口；Codex 中需要先信任插件 Hook。各技能也可以直接调用。修改源码后，需要另外刷新已安装的插件副本。

## 一次交付怎么走

### 1. 讨论需求

AI 先明确本期范围，沿真实场景查清实际行为、工程机制和限制，用图向你呈现并对齐理解，再讨论目标。问题按依赖关系逐轮展开，每轮带上场景、依据、候选后果和建议。最后展示完整目标及其相对现状的变化，等待你批准。

你批准完整结论后，AI 写入 `spec.md`。子代理检查需求是否清楚、模型是否成立、验收能否识别错误行为。修复并复审通过后，再请你检查文档是否准确表达了讨论结果。

### 2. 设计方案

AI 沿用需求阶段查清的现状，根据 Spec 设计职责、接口、数据、状态和交付切片，与你比较重要选择。设计中的调查围绕具体事实缺口或候选方案展开，不重新全面调研。方案写清改动位置、输入输出、字段含义、关键机制和验证安排，配图解释结构与运行过程。你批准完整方案后，AI 写入 `plan.md`。

子代理检查方案能否落实需求，以及切片能否继续细化。逐步开发操作留到增量交付阶段。审阅通过后，再请你确认文档和实施安排。

### 3. 实现与验证

AI 按切片实现、验证并自查，每轮由新的子代理独立审阅，修复后再复审。最后检查各部分一起运行时的行为，是否满足已确认的验收标准，再更新相关项目知识。

模型决策和重大不可逆操作先请你确认。普通实现缺陷按已确认规则修复；反复审阅没有进展时，先查清争议和缺少的证据。

任务小就写短，Spec、plan 和审阅仍要完成。完整顺序见[交付流程图](skills/using-rivo/SKILL.md#交付流程)。

流程技能维护任务清单，排障、绘图、测试等方法沿用当前任务的进度。调查可以直接进行，也可以把具体问题交给子代理；发现用于讨论，获批后将必要事实和机制写入 Spec 或 plan，重要取舍写入 ADR。不要求每次调查另写报告。

## 图示与文件

Spec、plan 和 ADR 使用 Markdown。正文连贯解释问题、做法与理由，接口和状态等关键约定写在文字与表格中；即使不看图，AI 也能据此设计和实施。链接用于查证来源，不代替正文。

讨论实体关系、系统协作、流程或状态时，AI 先加载 `rivo:using-archify`，再加载原生 Archify。图在讨论中展示，并以 SVG 嵌入文档对应段落。现状与目标分别保存，重要选择独立记录 ADR，正文仍保留主要理由。

**SVG 交付需要支持 `deliver --format svg` 的 Archify。** 该能力来自 [Archify PR #272](https://github.com/tt-a1i/archify/pull/272)；安装时核对实际 CLI 能力，不能只看版本名称。Rivo 不附带或自动更新 Archify，也不通过 HTML 提取图片。

确实未安装 Archify 时，AI 会说明“当前环境未安装 Archify，使用 Mermaid 替代”，然后继续。替代格式按实际选择写 ASCII、Mermaid 或 PlantUML。已经安装但缺少 SVG 能力时，报告具体缺口，保留图源，不把图示交付标成完成。

默认文件位置：

```text
.rivo/
  issues/<需求目录>/
    spec.md
    plan.md
    adr/               每个重要决定独立保存
    assets/architecture/  JSON 图源、SVG 和交付回执
    reviews/           审阅与复审报告
    tasks/             需要保存的任务简报
    evidence/          验证证据
  decisions/           不属于某项需求的独立决定
  knowledge/           项目知识
  archived/            已完成需求的归档
```

同一需求使用同一个目录。用户或项目指定了路径，就按指定路径保存；已有文件直接修改原文件。涉及多个仓库时，选一个项目集中保存文档，代码仍在各自项目中修改。

已有 ADR 格式和项目文件约定继续沿用。继续任务时，AI 读取文档、审阅报告和实际改动判断下一步，用户意见从会话中核对。归档保留历史，并更新引用链接。

## 技能

| 技能 | 用途 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 选择相关技能，说明顺序和共同规则 |
| [requirements-definition](skills/requirements-definition/SKILL.md) | 查证并讨论需求，完成 Spec |
| [technical-design](skills/technical-design/SKILL.md) | 设计模型、方案和交付切片，完成 plan |
| [incremental-delivery](skills/incremental-delivery/SKILL.md) | 实施、审阅、修复和验证 |
| [using-archify](skills/using-archify/SKILL.md) | 核实并呈现现状与目标，交付 SVG 并嵌入 Markdown |
| [architecture-decisions](skills/architecture-decisions/SKILL.md) | 比较重要选择，记录理由与后果 |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 查找、核实和维护项目知识 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 先写失败测试，再实现和重构 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 复现问题、定位原因、验证修复 |

## 修改与验证

修改技能时，同时检查阶段步骤、相关审阅提示词和宿主工具用法是否一致。用独立审阅和真实任务验证范围、批准与交接行为；文件格式或链接检查通过，不代表模型一定遵循流程。

## 许可证

[MIT](LICENSE)
