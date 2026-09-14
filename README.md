# Rivo

让软件交付与人的理解共同演进。

Rivo 通过**协作讨论 → 增量实施 → 复盘**组织 AI 交付。调研、需求澄清、决策与设计在讨论中交替推进，AI 查明事实、提供有依据的选择，用具体改动、理由和影响帮助人作出判断。文档由写作技能按模板整理；实施中的碰撞会带回协作，确认后的知识用于下一次工作。

## 一次交付

1. **协作讨论。** brainstorming 围绕当前问题读取知识、PRD、设计稿和代码，核实路径与能力，澄清范围、行为和 UI 形态，比较重要选择并逐步展开设计。新证据可以改变需求或方向。需要保存结论时调用 writing-docs 按模板整理。
2. **实施。** incremental-delivery 按可验证的能力拆任务，由新执行子代理完成实现、适用的 TDD 和自审，再由独立审阅者检查。修复复审、处理碰撞，最后进行整体审阅和组合验证。
3. **复盘。** 完成授权范围内的交接，维护本次影响的业务、交互和工程知识，修复导航与引用，归档交付材料。

各技能写明后续衔接条件，按用户授权继续或交回结果。已有充分依据的结论直接沿用，写完文档后继续原问题。小改动可以只用短讨论和已有材料；不为流程制造文档或重复审批。前提未定的设计不提前定稿，独立工作可以继续。

编排技能（using-rivo、brainstorming、incremental-delivery）在开始前将 Checklist 写入宿主任务工具，已有步骤直接沿用。方法和工具技能被调用时，步骤嵌入调用方的当前清单项，不另建竞争清单；独立使用时可自建短清单。子代理维护局部步骤，由主线程核对结果后更新总任务。没有任务工具时用对话短清单，不另建状态文件。

### 一个交付故事

用户提出"补齐供应商档案字段，增加信息完善入口"。Rivo 先调查页面、接口和既有流程，指出 PRD 中尚未说明的审批中行为，结合设计稿对齐页面状态。

双方围绕 SDK 接入与组件复用策略继续查证和讨论，必要时调整范围，再分段展开目录调整、组件装配、接口依赖和发布安排。需求约定、重要决定和完整技术方案由 writing-docs 按对应模板保存，随后继续讨论剩余问题。

实施时若发现准备复用的组件依赖另一条业务线，主线程会说明原判断、代码证据、用户后果和处理建议。仍有效的要求直接修复，需要改变决定的部分重新对齐。交付结束后，已验证的接入方式与复用限制进入知识库，下次需求从这些依据继续调查。

## 技能

using-rivo 是交付入口；brainstorming 负责调查与协作设计，incremental-delivery 负责实施与审阅。writing-docs 负责 Spec、ADR 和技术方案的模板化写作，domain-modeling、test-driven-development、systematic-debugging 和 knowledge-management 提供按需方法。

| 技能 | 适用问题 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 组织完整交付或继续进行中的任务 |
| [brainstorming](skills/brainstorming/SKILL.md) | 查清现状、对齐需求、比较选择与打磨设计 |
| [writing-docs](skills/writing-docs/SKILL.md) | 按模板编写 Spec、ADR 或技术方案 |
| [incremental-delivery](skills/incremental-delivery/SKILL.md) | 子代理实施、独立审阅与碰撞处理 |
| [domain-modeling](skills/domain-modeling/SKILL.md) | 澄清业务术语、关系与规则 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 红、绿、重构与缺陷回归 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 基于证据定位异常原因 |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 查找、核实、更新、合并与清理项目知识 |

各技能可直接调用，不要求经过 using-rivo；需要协作或写作时按链接调用对应技能。新建或实质修订交付文档前，writing-docs 读取对应模板，写后核对结构和内容。讨论技能负责形成结论，写作技能不擅自补出缺失的决定。

领域建模用于业务含义不清楚或发生变化的情况，不是所有交付的前置阶段。纯前端、SDK 或工程任务可以沿用已有业务规则，专注交互和工程设计。知识管理贯穿调研与交付，知识库不限于领域模型。

## 展示变化

讨论流程、状态生命周期、跨模块调用、数据流或职责划分的实质变化时，brainstorming 主动调用 Archify，在相关问题需要判断时展示现状与目标或候选方案，复用仍准确的已有图。用户明确不需要图或不涉及这些变化时说明不适用；工具不可用时说明原因，用 Mermaid、表格或文字继续。UI 布局结合设计稿或原型。图表与模拟不代替真实实现证据。

## 材料各自记录什么

| 材料 | 内容 |
| --- | --- |
| 需求 Spec | 目标、非目标、角色、可观察行为、UI 形态、规则和验收；可引用已有 PRD |
| ADR | 一项重要决定的结论、依据、备选、代价与重新考虑的条件 |
| 技术方案 | 整体做法、实际模块和组件、复用分析、接口、数据、影响与交付安排 |
| 审阅与证据 | 具体版本的检查结果、偏差、处理和验证 |
| 项目知识 | 可复用的当前结论、适用范围和原始依据 |

默认位置：

```text
.rivo/
├── knowledge/          # 导航与主题知识，按内容增长
├── issues/<slug>/      # 本次 Spec、ADR、方案、任务、审阅与证据
└── archived/<slug>/    # 已完成交付
```

项目已有结构或用户指定位置优先。计划能力保留在交付材料中，不能提前写成系统现状；确认的术语可以及时维护。没有新知识时不制造总结，也不预建空目录。

组织交付材料时参考 [交付工作区约定](skills/using-rivo/references/delivery-workspace.md)。知识维护形式参考 [知识组织](skills/knowledge-management/references/knowledge.md)。

## 调用示例

> 用 Rivo 完成这个需求。先和我查清现状、对齐需求并打磨方案，再推进实施。

> 用 brainstorming 评审这份 PRD 和设计稿，结合代码查证并讨论影响范围与交互缺口。

> 用 brainstorming 和我打磨方案，重点检查组件复用和状态管理。

> 用 writing-docs 把我们已对齐的需求整理成 Spec。

> 用 writing-docs 保存刚才的 SDK 接入决定及其理由。

> 用 writing-docs 把设计结论整理成完整技术方案。

> 用 domain-modeling 澄清"暂存"和"提交"的区别，更新已有名词解释。

> 用 knowledge-management 清理 SDK 知识中的过时内容，保留决定依据并修复导航。

> 用 incremental-delivery 按已确认方案实施，任务完成后独立审阅。

## 插件结构与接入

```text
rivo/
├── .codex-plugin/plugin.json    # Codex 清单
├── .claude-plugin/              # Claude Code / ZCode 清单与市场条目
├── hooks/                      # 支持 SessionStart 的宿主使用的轻量入口提示
├── skills/                     # 八个技能及按需参考
└── README.md
```

使用宿主支持的插件安装方式加载本目录。源码更新与已安装副本刷新分别进行，升级源码不会自动修改已安装副本。

启动 Hook 只提示入口技能的位置，不预先注入整个工作流。子代理调度使用宿主原生能力；宿主不支持子代理时，明确降级为单代理执行与自审，不声称已经独立审阅。

## License

MIT
