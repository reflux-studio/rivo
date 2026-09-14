# Rivo

让软件交付与人的理解共同演进。

Rivo 通过**调研 → 决策 → 设计 → 实施 → 复盘**组织 AI 协作交付。AI 查明事实、提供有依据的选择、完成实现；人与 AI 逐步讨论重要问题，方案用具体改动、理由和影响表达。实施中的碰撞会带回协作，确认后的知识用于下一次工作。

## 一次交付

1. **调研。** 阅读相关知识、PRD、设计稿和代码，核实受影响的路径与能力。先呈现现状和缺口，再逐步澄清范围、行为和 UI 形态，形成需求与交互 Spec。
2. **决策。** 根据需求和调查结果比较关键选择，按依赖收敛，必要时做针对性调查或实验。重要取舍用 ADR 保留结论、理由与代价。
3. **设计。** 先讲总体做法，再讨论组件、复用、数据流和接口细节。整理为可以拿去团队评审的统一技术方案，按实际模块展开。
4. **实施。** 按可验证的能力拆任务，由新执行子代理完成实现、适用的 TDD 和自审，再由独立审阅者检查。修复复审、处理碰撞，最后进行整体审阅和组合验证。
5. **复盘。** 完成授权范围内的交接，维护本次影响的业务、交互和工程知识，修复导航与引用，归档交付材料。

各技能写明后续衔接条件，按用户授权继续或交回结果。长任务从需求澄清起保存当前阶段、已定结论、未决问题与下一步，在阶段转换或重要决定变化时更新。阶段承接已确认结论，已有充分依据的部分直接沿用。小改动可以只用短讨论和已有材料；不为流程制造文档或重复审批。前提未定的设计不提前定稿，独立工作可以继续。

### 一个交付故事

用户提出“补齐供应商档案字段，增加信息完善入口”。Rivo 先调查页面、接口和既有流程，指出 PRD 中尚未说明的审批中行为，结合设计稿对齐页面状态。

需求清楚后，双方讨论 SDK 接入与组件复用策略，记录重要决定。Rivo 再分段展开目录调整、组件装配、接口依赖和发布安排，形成完整技术方案。

实施时若发现准备复用的组件依赖另一条业务线，主线程会说明原判断、代码证据、用户后果和处理建议。仍有效的要求直接修复，需要改变决定的部分重新对齐。交付结束后，已验证的接入方式与复用限制进入知识库，下次需求从这些依据继续调查。

## 技能

using-rivo 是交付入口；requirements-clarification、architecture-decisions、system-design 和 incremental-delivery 推进交付阶段；domain-modeling、test-driven-development、systematic-debugging 和 knowledge-management 提供贯穿各阶段的方法。技能按职责命名，不要求统一词形。

| 技能 | 适用问题 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 组织完整交付或恢复进行中的任务 |
| [requirements-clarification](skills/requirements-clarification/SKILL.md) | 调查现状，澄清需求、范围与交互 |
| [architecture-decisions](skills/architecture-decisions/SKILL.md) | 比较重要选择，保留 ADR |
| [system-design](skills/system-design/SKILL.md) | 逐步形成可评审的技术方案 |
| [incremental-delivery](skills/incremental-delivery/SKILL.md) | 子代理实施、独立审阅与碰撞处理 |
| [domain-modeling](skills/domain-modeling/SKILL.md) | 澄清业务术语、关系与规则 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 红、绿、重构与缺陷回归 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 基于证据定位异常原因 |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 查找、核实、更新、合并与清理项目知识 |

各技能可以携带其参考材料独立使用，不要求调用 using-rivo 或采用 `.rivo`。入口只路由当前适用的技能，模板也按需读取。

领域建模用于业务含义不清楚或发生变化的情况，不是所有交付的前置阶段。纯前端、SDK 或工程任务可以沿用已有业务规则，专注交互和工程设计。知识管理贯穿调研与交付，知识库不限于领域模型。

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

组织和恢复材料时参考 [交付工作区约定](skills/using-rivo/references/delivery-workspace.md)。知识维护形式参考 [知识组织](skills/knowledge-management/references/knowledge.md)。

## 技术方案与对比呈现

使用一份 [技术方案模板](skills/system-design/references/system-design.md)，按实际模块展开，复杂部分可拆附属文档。裁剪依据是调查得到的影响范围，不能因当前仓库或执行职责而遗漏其他系统的依赖。模板提供组织方式，调查和讨论负责形成有依据的内容。

流程、状态、职责或组件变化需要直观比较时，使用可用的 Archify 技能呈现现状与目标或候选方案；没有该工具时采用 Mermaid、表格或文字。UI 布局结合设计稿或原型。图表与模拟不代替真实实现证据。

## 调用示例

> 用 Rivo 完成这个需求。先调查现状并和我澄清需求，再推进决策、设计和实施。

> 用 requirements-clarification 评审这份 PRD 和设计稿，先找出影响范围与交互的缺口。

> 用 system-design 和我打磨前端方案，重点检查组件复用和状态管理。

> 用 domain-modeling 澄清“暂存”和“提交”的区别，更新已有名词解释。

> 用 knowledge-management 清理 SDK 知识中的过时内容，保留决定依据并修复导航。

> 用 incremental-delivery 按已确认方案实施，任务完成后独立审阅。

## 从旧版升级

- collaborative-modeling 的需求澄清职责由 requirements-clarification 承接；现状调研为澄清需求提供依据，业务概念与规则的澄清由 domain-modeling 承接。新版不再保留旧技能入口。
- capturing-knowledge 升级为 knowledge-management，覆盖读取、核实和完整维护。
- `.rivo/models/` 仍可作为已有知识来源。不会自动迁移；需要整理时再合并到 knowledge，修复引用并保留历史入口。
- 技术方案统一使用一个模板，按实际模块展开，不再选择前端、后端或全栈模板。
- 新版去掉逐步禁止写文件、每步固定确认和强制完整模型格式；仍保留关键未决选择的协作、独立审阅和碰撞反馈。

## 插件结构与接入

```text
rivo/
├── .codex-plugin/plugin.json    # Codex 清单
├── .claude-plugin/              # Claude Code / ZCode 清单与市场条目
├── hooks/                      # 支持 SessionStart 的宿主使用的轻量入口提示
├── skills/                     # 九个技能及按需参考
└── README.md
```

使用宿主支持的插件安装方式加载本目录。源码更新与已安装副本刷新分别进行，升级源码不会自动修改已安装副本。

启动 Hook 只提示入口技能的位置，不预先注入整个工作流。子代理调度使用宿主原生能力；宿主不支持子代理时，明确降级为单代理执行与自审，不声称已经独立审阅。

## License

MIT
