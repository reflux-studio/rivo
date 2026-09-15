# Rivo

让软件交付与人的理解共同演进。

Rivo 通过 **需求定义 → 技术设计 → 增量交付** 组织 AI 协作。每个阶段完整负责调查、讨论、表达和保存。人和 AI 从具体场景提出模型，用证据与反例检验，让形成的理解进入代码，并在新发现出现时修正。

## 一次交付

1. **需求定义。** 核实项目知识、PRD、设计稿与实际行为，从场景中寻找共同概念、业务动作和约束，与用户对齐范围、交互和验收，直接保存 `spec.md`。
2. **技术设计。** 选择能表达这些规则的职责、接口、数据与状态结构，核实复用和关键机制，确定主要交付切片、依赖与验证方式，直接保存 `plan.md`。
3. **增量交付。** 沿用方案划分，细化当前任务，实施、自审、独立审阅并验证组合结果。新增例外或重复规则时检查模型，必要时带着证据回到具体问题。

已有充分依据可从任何阶段进入。小改动不要求补齐全部文档；只要求评审、整理已有结论或先出草稿时按范围完成。需要人判断的问题逐个讨论，已有确认与委托直接沿用，不用整份文档和问题清单替代协作。

主线程沿用宿主任务清单恢复进度；各阶段对结果负责，入口不另建竞争清单。独立能力按问题使用，不作为每次交付的必经环节。

## 共同建模

需求明确之后仍可寻找更好的解释。例如，四个账号操作可能共享“设置指定账号为主账号”这一业务动作，同时保留各入口真实的权限或审批差异。

需求阶段检验业务概念与规则；设计阶段检验技术结构能否自然表达规则；实现阶段从分支、重复维护和失败证据检查模型。AI 提出候选和反例，人参与重要语义与取舍；有充分依据、行为不变的局部改进可在授权内直接完成。

不以减少 if、增加间接层或最大化复用衡量模型质量。模型需要解释场景、保留真实差异，并值得其理解与维护成本；现有模型已合适时直接沿用。

模型结果嵌入 Spec 的“概念与规则”和 plan 的“技术模型与关键选择”。重要选择的理由可留在对应文件；值得集中推演或长期追踪时用 ADR。跨需求复用的当前模型合入项目知识，ADR 保留重要选择的历史与理由。

## 技能与产物

一个轻量入口、三个阶段、四个独立方法。各技能可直接使用，不要求先运行总入口。

| 技能 | 完整责任 | 主要产物 |
| --- | --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 选择入口、恢复进度、承接上下文 | 当前工作安排 |
| [requirements-definition](skills/requirements-definition/SKILL.md) | 核实现状、推演规则、对齐或整理需求 | `spec.md` |
| [technical-design](skills/technical-design/SKILL.md) | 形成或整理技术模型、契约和交付安排 | `plan.md` |
| [incremental-delivery](skills/incremental-delivery/SKILL.md) | 细化当前任务、实施、审阅、验证和交接 | 代码、测试、`reviews/*.md` |
| [architecture-decisions](skills/architecture-decisions/SKILL.md) | 调查、比较、形成或记录重要选择 | ADR |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 查找、核实和维护跨需求知识 | 当前主题文档与图源 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 红、绿、重构与缺陷回归 | 实现与验证证据 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 基于证据定位异常和验证修复 | 原因与修复依据 |

开始相应工作前实际加载所需技能。短小的产物结构和 Output Location 放在技能正文，长篇图示、派发和维护细节按需读取参考。阶段自己完成写作，不为保存文件切换技能，也不要求为每个概念生成独立模型文档。

`architecture-decisions` 可以从开放问题开始比较，也可以直接记录已有结论。ADR 采用 MADR 的简洁结构，允许保留提议；没有单独 ADR 不阻塞已有充分依据的工作。重要选择的理由与后果应有明确留存位置。

## 展示变化与维护知识

存在影响判断的结构变化时，使用可用的 Archify：核实并固定 before，随讨论演进候选 target，在同一个 compare 入口展示变化，保留可恢复的确认版本。具体能力与留存规则见 [架构图协作参考](skills/requirements-definition/references/architecture-diagrams.md)。

JSON 是维护源，HTML 是阅读与协作入口，图片按需导出。图参与当轮讨论；检查通过后保留必要证据并按实际产物清单清理辅助文件。工具不可用时说明替代方式，不虚报图示或验证完成。

交付后按实际实现核实模型和最终图源，再检查知识库是否已被其他需求更新，合并当前结论并维护导航。目标已确认不等于已经实现。没有新知识时沿用原材料，不制造总结。

## 产物位置

各技能直接说明自己的默认输出位置：需求材料位于目标项目根目录的 `.rivo/issues/<slug>/`，当前知识位于 `.rivo/knowledge/`。同一需求沿用 slug，跨仓库选定一个主交付根目录；代码在所属工程修改。

用户指定或项目明确的交付目录约定优先；修订已有文件时原位更新。输入 PRD 位于 docs/ 不代表新产物也写入 docs/，只有实际需要时才创建目录。完成交付后可归档到 `.rivo/archived/<slug>/` 并修复链接，未完成发布或交接的状态保持可见。

## 调用示例

> 用 Rivo 完成这个需求，先核实现状，和我一起检查这些场景背后的规则。

> 用 requirements-definition 评审这份 PRD，并保存已经对齐的需求。

> 用 requirements-definition 把现有结论整理成 Spec，不重新展开讨论。

> 用 technical-design 设计实现方案，重点检查共享规则、状态归属和交付依赖。

> 用 architecture-decisions 比较实时读取和快照，记录理由与后果。

> 用 architecture-decisions 保存刚才已经决定的 SDK 边界。

> 用 incremental-delivery 按方案实施，新证据推翻模型时带回具体问题。

> 用 knowledge-management 核实当前模型并更新已有主题。

## 0.5.0：阶段完整负责，建模贯穿交付

- `write-spec` 合入 requirements-definition，`write-design` 合入 technical-design；阶段正文直接提供产物结构与位置。
- `write-adr` 由 architecture-decisions 接替，覆盖比较选择、形成决定和记录已有结论。
- `domain-modeling` 的方法融入需求、设计与实现，模型直接落在当前材料，跨需求结论按需进入知识库。
- 新技术方案默认命名为 `plan.md`，包括技术设计与主要交付切片；增量交付细化当前任务，避免重复拆分。
- 移除集中工作区规则及写作交接，保留按需使用的图示和审阅参考。

### 升级

更新自定义提示词中的旧技能名。已有 `spec.md`、`ADR.md` 和 `system-design.md` 继续原位维护，不批量改名或生成竞争副本。原 domain-modeling 请求按问题进入需求或技术设计；纯当前知识整理使用 knowledge-management。

保留 0.4.1 的逐问题协作、候选图当轮展示、确认版本留存与实际技能加载，以及后续的输入目录和产物目录区分规则。

## 插件接入

共享 skills 目录通过 `.codex-plugin/plugin.json` 和 `.claude-plugin/` 接入各宿主。启动 Hook 注入 using-rivo，其他技能按当前问题加载。源码更新与已安装副本刷新分别进行，修改源码不会自动刷新已安装副本。

子代理调度使用宿主原生能力；不可用或当前授权不允许时明确采用单代理执行与自审，不声称已经独立审阅。用户要求独立审阅作为完成条件时保留缺口。

## License

MIT
