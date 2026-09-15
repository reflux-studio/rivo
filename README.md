# Rivo

让软件交付与人的理解共同演进。

Rivo 通过 **需求定义 → 技术设计 → 增量交付** 组织 AI 协作。人和 AI 从具体场景建立模型，用证据与反例检验，再将规则落实到代码。

## 一次交付

1. **需求定义。** 核实现状、PRD 和设计稿，对齐概念、规则、交互与验收，写入 `spec.md`，自审并修正。
2. **技术设计。** 读取 Spec，设计职责、接口、数据和状态，确定交付切片、依赖与验证方式，写入 `plan.md`，对照 Spec 自审并修正。
3. **增量交付。** 沿用 plan 的切片，逐项实施、自审、独立审阅和修复，最后验证组合行为与原始目标。

Spec 和 plan 是阶段交付物。任务小就写短，产物和自审步骤保持完整。继续已有交付时，核对文档与进度，从未完成的步骤继续。用户单独请求评审、整理或某个技能时，完成指定范围。

AI 在开始阶段工作前加载执行技能，并声明名称与目的。主线程维护一份宿主任务清单，随实际进度更新。流程及回路见 [Rivo 交付流程图](skills/using-rivo/SKILL.md#交付流程)。

## 共同建模

需求阶段检验业务概念与规则，设计阶段检验技术结构，实现阶段从分支、重复维护和失败证据检查模型。AI 提出候选与反例，用户判断重要语义和取舍。

例如，四个账号操作可能共享“设置指定账号为主账号”这一动作，同时保留各入口的权限和审批差异。模型应解释这些场景、保留真实差异，并值得其理解和维护成本。

业务模型写入 Spec 的“概念与规则”，实现模型写入 plan 的“技术模型与关键选择”。集中比较或长期追踪的重要选择写入 ADR。跨需求复用的结论合入项目知识。

## 技能与产物

一个入口、三个阶段、四个独立方法。各技能也支持直接调用。

| 技能 | 工作 | 产物 |
| --- | --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 导航、声明和进度管理 | 当前工作安排 |
| [requirements-definition](skills/requirements-definition/SKILL.md) | 核实现状、对齐需求、写作与自审 | spec.md |
| [technical-design](skills/technical-design/SKILL.md) | 设计模型、契约和交付安排，写作与自审 | plan.md |
| [incremental-delivery](skills/incremental-delivery/SKILL.md) | 实施、自审、独立审阅、验证与交接 | 代码、测试、reviews/*.md |
| [architecture-decisions](skills/architecture-decisions/SKILL.md) | 比较与记录重要选择 | ADR |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 核实和维护跨需求知识 | 当前主题文档与图源 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 红、绿、重构与缺陷回归 | 实现与验证证据 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 定位原因并验证修复 | 原因与修复依据 |

技能正文说明步骤、产物结构和输出位置；图示、派发和知识维护的操作细节放在相应参考文档。

写作时使用可用的 `writing-clearly-and-concisely` 技能，当前阶段负责保存和自审。文案先给结论，再给依据；用具体对象与行为表达，每段只讲一件事。

## 展示变化与维护知识

结构变化影响判断时，使用可用的 Archify：核实并固定 before，随讨论演进候选 target，在同一个 compare 入口展示变化，保留可恢复的确认版本。操作与留存要求见 [架构图协作参考](skills/requirements-definition/references/architecture-diagrams.md)。

JSON 是维护源，HTML 是阅读入口，需要图片时从图源导出。图参与当轮讨论，检查通过后保留证据，按实际生成清单清理辅助文件。工具不可用时说明替代方式。

交付后对照实现核实模型和图源，检查知识库是否已被其他需求更新，再合并本次变化、维护导航。知识库记录已核实的现状，方案保留目标与决定依据。

## 产物位置

需求材料写入目标项目根目录的 `.rivo/issues/<slug>/`，项目知识写入 `.rivo/knowledge/`。同一需求共用 slug；跨仓库任务选定一个主交付根目录，代码在所属工程修改。

用户指定或项目配置声明的路径优先，已有文件原位维护。输入资料的目录与交付目录分别确定，写入时创建目录。完成交付后可归档到 `.rivo/archived/<slug>/`，并修复链接；未完成的发布或交接事项保留在进度中。

## 调用示例

> 用 Rivo 完成这个需求，先核实现状，和我一起检查场景背后的规则。

> 用 requirements-definition 把已经对齐的需求写入 Spec 并自审。

> 用 technical-design 设计实现方案，重点检查共享规则、状态归属和交付依赖。

> 用 architecture-decisions 比较实时读取和快照，记录理由与后果。

> 用 incremental-delivery 按方案实施，新证据推翻模型时带回具体问题。

> 用 knowledge-management 核实当前模型并更新已有主题。

## 0.5.3

- 用 Mermaid 明确交付顺序，保留技能声明、任务清单与 Red Flags。
- 需求阶段交付 Spec，设计阶段交付 plan，两阶段均完成自审。
- 写作时使用可用的 writing-clearly-and-concisely 技能，统一技能与参考文案。
- 修正重复确认、评审误入实施和可选改进阻塞交付的问题。

## 从旧版本升级

- `write-spec` 合入 requirements-definition，`write-design` 合入 technical-design。阶段技能负责调查、讨论、保存和自审。
- `write-adr` 由 architecture-decisions 接替，负责比较选择、形成决定和记录结论。
- `domain-modeling` 融入需求、设计和实施。业务规则进入 Spec，实现结构进入 plan，跨需求结论进入项目知识。
- 新技术方案命名为 `plan.md`，包含设计与主要交付切片；增量交付细化当前切片。

更新自定义提示词中的旧技能名。已有 `spec.md`、`ADR.md` 和 `system-design.md` 原位维护，其中 `system-design.md` 继续承担技术方案职责。

## 插件接入

共享 skills 目录通过 `.codex-plugin/plugin.json` 和 `.claude-plugin/` 接入宿主。启动 Hook 注入 using-rivo，执行技能在相应工作开始前加载。源码更新和已安装副本刷新分别进行。

子代理使用宿主原生调度能力。能力不可用或授权不允许时，明确采用单代理执行与自审；用户要求独立审阅作为完成条件时，报告该缺口。

## License

MIT
