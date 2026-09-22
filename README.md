# Rivo

用户主导，AI 辅助：把你的方案想清楚、写明白，再落实为经过验证的实现。

Rivo 面向需要方案设计、团队评审和持续维护的软件交付。你可以带着已有思路来，让 AI 查证前提、挑战薄弱处、补全细节并落实；没有确定做法时，也可以一起探索。目标和方向由你主导，AI 主动完成调查、表达、实现与验证，重要选择在讨论中形成。

各技能可以单独调用。你可以从新需求开始，也可以带着评审意见改方案、重新调查一个机制，或继续已有任务。方案、任务和实现由独立子代理审阅；审阅负责发现问题，不能替你决定采用哪种设计。

## 开始使用

安装插件后，直接描述当前工作：

> 用 Rivo 完成这个需求。我打算沿用现有审批链，增加供应商发起入口。先帮我查证这个思路，讨论清楚缺口，再写方案并安排交付。

也可以调用具体技能：

> 用 writing-designs 根据同事的评审意见修改这份方案。

> 用 investigating 查清 OA 怎样读取数组字段，更新现有 note。

> 用 planning-tasks 把这份已批准方案拆成实施任务。

> 用 implementing-tasks 继续这些任务；设计变化先和我讨论。

AI 会先加载技能并说明用途。已有材料和批准继续沿用，不因切换技能而重跑整个流程。

## 接入

仓库提供两种插件清单，按宿主的插件安装流程加载本仓库：

| 宿主 | 插件清单 |
| --- | --- |
| Codex | [.codex-plugin/plugin.json](.codex-plugin/plugin.json) |
| Claude Code | [.claude-plugin/plugin.json](.claude-plugin/plugin.json) 和 [marketplace.json](.claude-plugin/marketplace.json) |

[启动 Hook](hooks/hooks.json)提供入口指引，各技能也可以直接调用。修改源码后，需要另外刷新已安装的插件副本。

绘图需要安装支持 `deliver --format svg` 的 Archify。Rivo 不附带或自动更新 Archify；使用时核对实际 CLI 能力。写作继续使用环境中可用的 `writing-clearly-and-concisely`。

## 一次完整交付

### 方案讨论

`discussing-designs` 先理解或询问你的思路。你可以一开始就讲，也可以让 AI 读完材料后再讲；明确没有方向时，再一起探索。AI 从你的目标和理由出发，用场景、证据和图示检验方案，也会指出同事评审时可能追问的问题。发现反例或更合适的做法时，讲清差异，再由你判断；不会默默换成自己的推荐。重要选择记录为 ADR。

交流重点是你尚未参与的判断和真正需要决定的事情。已经明确的内容不反复询问，AI 能查明的事实主动查证。方案收敛时讲清完整做法、理由和不确定性，给你纠正的机会，不能只交一篇长文求批准。

采用 Rivo 完成交付，就留下技术方案和实施任务，并完成相应审阅。需求简单时文档可以短，流程不另分档。只调用某个技能处理一项工作，不需要重跑整条流程。

### 编写技术方案

`writing-designs` 将已确认结论整理为 `plan.md`，保留你的设计意图、选择理由和明确限制，方便你向同事解释和讨论。需求分析、功能范围、整体设计、影响面、外部协同、验证、发布和回滚，在同一份文档中说明。已有 PRD 作为输入，不再单独生成一份 Spec。

方案按功能或主题连续展开。字段一行一个；目录结构、核心伪代码、JSON、消息体、SDK 契约和部署配置保留在相关章节，方便同事评审与对接。源码查证过程进入调查笔记，逐步编码安排进入实施任务。

文档经过自查、独立审阅和你的审阅后，才作为正式实施依据。

### 编排实施任务

`planning-tasks` 将获批方案写成 `task.md`，明确每项工作的范围、契约、依赖、修改位置和验证要求。任务按可验证结果划分，不按文件数量拆分。

task 经过自查和独立审阅，默认不需要你逐项审批。拆任务时发现设计缺口，回到具体问题与你讨论；不能把未批准的决定藏进实施步骤。

### 实施任务

获得实施授权后，`implementing-tasks` 派发任务，由执行者实现并自查，再由独立审阅者检查改动、约定和证据。实现缺陷由 AI 修复并复审；新发现需要改变原方案时，先带回证据和影响与你讨论。最后检查各部分一起运行时是否满足原始需求。

已有实施授权不重复询问；写好方案或 task 本身不代表获得了实施授权。单独要求代码评审或验证时，只完成这项工作。

完整路径见[参考工作流](skills/using-rivo/SKILL.md#参考工作流)。它是常见顺序，各技能也可以从已有材料直接进入。

## 调查与变化

`investigating` 可以在讨论、文档评审或实施中调用，持续维护 `note.md`。笔记按机制和问题组织，说明职责、调用链、数据与配置、边界和证据，类似一份围绕当前需求的专题 Wiki。每次调查整合到已有主题，不追加工作流水。

同事的意见或新的事实改变设计时，AI 重新调查、讨论决定、修改 ADR，并重写受影响的方案、任务和图。各流程技能内部都规定了修订后的复审要求，旧报告不能覆盖新内容；已完成和正在执行的相关任务也要检查。

文档维护当前结论，结构不合适时可以整篇重写。历史 ADR、审阅报告和验证证据保留。只改措辞不重做设计，重要决定改变则取得你的确认；无关工作继续沿用有效约定。

跨需求复用的事实通过 `knowledge-management` 整理到已有项目知识库。note 保存本需求的认识，知识库保存经过核实的项目现状，不把尚未实现的目标写成已有能力。

## 图示与过程文件

系统关系、流程与状态使用 Archify 绘图，直接交付 SVG 并嵌入 Markdown，保留图源和回执。正文也要说清关键规则，让读者和 AI 不看图也能理解。图和文档变化后同步检查。

确实未安装 Archify 时，AI 会说明“当前环境未安装 Archify，使用 Mermaid 替代”。替代格式按实际选择写 ASCII、Mermaid 或 PlantUML。已经安装但缺少 SVG 能力时，报告具体缺口，不通过临时 HTML 提取图片绕过。

默认文件位置：

```text
.rivo/
  issues/<需求目录>/
    plan.md               面向评审与协作的完整技术方案
    task.md               面向执行的实施任务
    note.md               按主题维护的调查笔记
    adr/                  独立决策记录
    assets/architecture/  图源、SVG 与交付回执
    reviews/              历轮审阅报告
    evidence/             验证证据
  decisions/              不属于某项需求的独立决定
  knowledge/              项目知识
  archived/               已完成需求的归档
```

用户或项目指定的位置优先。跨仓库集中保存文档，代码在各自项目中修改。恢复工作时核对文件、审阅报告、实际改动和会话决定，不另建状态台账。已有 PRD、旧 Spec 和方案都可作为输入，不自动删除历史材料。

## 技能

| 技能 | 用途 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 根据当前请求选择技能，了解参考工作流。 |
| [discussing-designs](skills/discussing-designs/SKILL.md) | 讨论需求、调查现状并形成完整方案。 |
| [writing-designs](skills/writing-designs/SKILL.md) | 编写、修订和审阅技术方案。 |
| [planning-tasks](skills/planning-tasks/SKILL.md) | 编写、调整和审阅实施任务。 |
| [implementing-tasks](skills/implementing-tasks/SKILL.md) | 组织实施、审阅、修复和验证。 |
| [investigating](skills/investigating/SKILL.md) | 查证具体问题，维护专题调查笔记。 |
| [using-archify](skills/using-archify/SKILL.md) | 绘制和维护 SVG 图示。 |
| [architecture-decisions](skills/architecture-decisions/SKILL.md) | 比较重要选择，记录及修订 ADR。 |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 查找、核实和维护项目知识。 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 用失败测试驱动行为实现。 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 复现异常、查证根因并验证修复。 |

四个流程技能维护当前工作清单。调查、绘图、排障等方法技能交回结果，不创建嵌套进度。入口负责路由，执行和修订规则写在各技能内部。

## 修改与验证

修改技能时同步检查模板、审阅提示词、插件入口和 README。用独立审阅和真实请求检查单独调用、修订后复审、批准与交接行为；格式检查通过不代表实际使用一定正确。

## 许可证

[MIT](LICENSE)
