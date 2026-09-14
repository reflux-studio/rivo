# Rivo

让软件交付与人的理解共同演进。

Rivo 通过 **需求定义 → 技术设计 → 增量交付** 组织 AI 协作。AI 核实事实，与用户明确行为、约束和重要选择，再展开可实施的设计，通过独立审阅与验证完成交付。三个阶段共享结论与图源；写作、建模、调试和知识维护可独立使用。

## 一次交付

1. **需求定义。** requirements-definition 从项目知识、PRD、设计稿与代码核实现状，对齐目标、范围、行为和验收，按需确认影响需求成立的架构方向。通过 write-spec 和 write-adr 保存结论。
2. **技术设计。** technical-design 承接需求、决定和图源，查明复用依据，展开模块、接口、数据、失败恢复、兼容和迁移安排。通过 write-design 保存方案，新的重要取舍可随时记录为 ADR。
3. **增量交付。** incremental-delivery 拆分可验证任务，由执行者实施和自审，再由独立审阅者检查；处理碰撞并完成整体审阅、组合验证和授权交接。

完成后主线程组织复盘，通过 knowledge-management 维护已核实的当前知识与架构 JSON、修复导航，再归档需求材料。

按已有依据从任何阶段进入，已有充分结论直接沿用。小改动可用短讨论和已有设计，不为流程制造文档。只要求分析、评审或独立写作时，完成对应请求后交回结果。需要改变需求或架构方向的发现回到需求定义，具体设计问题回到技术设计，原要求仍有效的实现错误直接修复。

三个阶段用宿主任务工具维护当前 Checklist，嵌入已有任务；总入口不另建竞争清单。独立能力被调用时步骤嵌入当前项，独立使用时可保留短清单。无任务工具时使用对话清单，不另建状态文件。

### 一个交付故事

用户提出“补齐供应商档案字段，增加信息完善入口”。需求定义先调查现有页面和接口，核实审批中是否允许编辑，与用户对齐入口、状态及验收。如果立即生效或异步审批会改变用户行为，就在此比较方向，记录必要的 ADR。

技术设计再展开页面与 SDK 的职责、共享组件复用、接口契约和异常恢复，沿用同一套 before/target 更新架构对比。用户判断时看到当前变化，确认版本随方案保留。

实施中如果发现共享组件依赖另一条业务线，就带着代码证据回到相应设计问题；影响用户约定时再回到需求定义。交付后对照实际实现更新知识库的现状图源，下次需求从这份现状继续。

## 技能

一个总入口、三个阶段流程、七个独立能力。名称表达要完成的工作；各技能都可以直接调用，无需先经过 using-rivo。

| 层次 | 技能 | 适用问题 |
| --- | --- | --- |
| 总入口 | [using-rivo](skills/using-rivo/SKILL.md) | 选择技能、承接上下文、组织交接与收尾 |
| 阶段流程 | [requirements-definition](skills/requirements-definition/SKILL.md) | 定义需求、验收与所需架构方向 |
| 阶段流程 | [technical-design](skills/technical-design/SKILL.md) | 调查、推演并形成技术方案 |
| 阶段流程 | [incremental-delivery](skills/incremental-delivery/SKILL.md) | 分段实施、独立审阅与验证 |
| 独立能力 | [write-spec](skills/write-spec/SKILL.md) | 将已有需求结论整理为 Spec |
| 独立能力 | [write-adr](skills/write-adr/SKILL.md) | 在任何阶段保存重要决定或提议 |
| 独立能力 | [write-design](skills/write-design/SKILL.md) | 将已有设计结论整理为技术方案文档 |
| 独立能力 | [domain-modeling](skills/domain-modeling/SKILL.md) | 澄清业务术语、关系与规则 |
| 独立能力 | [test-driven-development](skills/test-driven-development/SKILL.md) | 红、绿、重构与缺陷回归 |
| 独立能力 | [systematic-debugging](skills/systematic-debugging/SKILL.md) | 基于证据定位异常原因 |
| 独立能力 | [knowledge-management](skills/knowledge-management/SKILL.md) | 查找、核实、更新与清理项目知识 |

using-rivo 在实质工作开始前必须实际加载对应技能：有宿主技能工具就调用，否则读取对应 SKILL.md。路由表不代替技能加载。technical-design 负责形成设计，write-design 负责整理表达；所有写作技能先读模板，写后核对，不擅自补出缺失的决定。ADR 可以独立产出，也可在任何阶段新增或修订。

领域建模不是所有交付的前置步骤；纯前端、SDK 或工程任务可以沿用已有业务规则。项目知识包括业务、交互、系统结构和工程约定，不限于领域模型。

## 展示变化与知识沉淀

存在影响判断的结构变化时，需求定义和技术设计主动加载 Archify：先从知识库找到并核实模块现状 JSON，固定本需求的 before，随讨论修改 target，用一个 compare HTML 展示 Before / Delta / After，每轮成功生成后刷新同一入口。图在需要判断的当轮展示，并随确认版本成为方案的一部分。

已核实的 Archify 2.16 compare 仅支持 architecture；其他图型使用对应图示与变化说明。没有共同组件 ID 的全新系统展示目标及新建范围，不伪造基线。内置 preview 监听单份 JSON，双输入 compare 由 AI 每轮重新生成，不承诺自动监听。工具不可用时说明替代方式；UI 形态使用设计稿或原型。

JSON 是维护源，HTML 是交互阅读产物，图片按需导出。完成视觉检查后，将需要留存的截图和回执集中保存，按本次产物清单清理无需留存的辅助文件，保留确认版本及必要证据。

用户确认的目标属于方案；交付后对照实际实现与验证核实最终 JSON，再检查知识库是否已被其他需求更新，合并维护当前图源与导航。具体规则见 [架构图协作参考](skills/requirements-definition/references/architecture-diagrams.md) 和 [知识组织](skills/knowledge-management/references/knowledge.md)。

## 交付材料

| 材料 | 内容 |
| --- | --- |
| Spec | 范围、行为、UI 形态、规则与验收 |
| ADR | 重要选择、依据、备选、代价与重新考虑条件 |
| 技术方案 | 实际模块、契约、数据、机制、影响与交付安排 |
| 架构材料 | before、target、compare、确认版本与来源 |
| 审阅与证据 | 具体版本的检查、偏差处理与验证结果 |
| 项目知识 | 已核实的当前结论、图源、适用范围与依据 |

默认使用 `.rivo/knowledge/`、`.rivo/issues/<slug>/` 和 `.rivo/archived/<slug>/`。项目已有结构或用户指定位置优先；有内容再建立目录，不预建空文件。计划能力不提前写成现状。组织材料时参考 [交付工作区约定](skills/using-rivo/references/delivery-workspace.md)。

## 调用示例

> 用 Rivo 完成这个需求，先和我核实现状并定义需求，再设计和实施。

> 用 requirements-definition 评审这份 PRD 和设计稿。

> 用 technical-design 展开已确认需求，重点检查组件复用和状态管理。

> 用 write-spec 把已对齐的需求整理成 Spec。

> 用 write-adr 保存刚才的 SDK 接入决定及理由。

> 用 write-design 把设计结论整理成完整技术方案。

> 用 knowledge-management 核实这个模块的现状图并更新知识。

> 用 incremental-delivery 按已确认方案实施。

## 从 0.3.0 升级到 0.4.0

原 brainstorming 的需求与方向职责迁移到 requirements-definition，详细技术设计迁移到 technical-design；原 writing-docs 拆为 write-spec、write-adr 和 write-design，模板随对应技能迁移。自定义提示词和技能路径应改用新名称。已有需求材料的 spec.md、ADR.md、system-design.md 无需改名。

## 插件结构与接入

```text
rivo/
├── .codex-plugin/plugin.json    # Codex 清单
├── .claude-plugin/              # Claude Code / ZCode 清单与市场条目
├── hooks/                      # SessionStart 轻量入口提示
├── skills/                     # 11 个技能及按需参考
└── README.md
```

使用宿主支持的插件安装方式加载本目录。源码更新与已安装副本刷新分别进行，升级源码不会自动修改已安装副本。

启动 Hook 只提示技能路由与加载要求，不预先注入整个工作流。子代理调度使用宿主原生能力；宿主不支持时明确降级为单代理执行与自审，不声称已完成独立审阅。

## License

MIT
