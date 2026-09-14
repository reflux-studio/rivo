---
name: using-rivo
description: 组织需求调研、决策、设计、实施与复盘，用于完整交付或继续进行中的 Rivo 任务。
---

# Using Rivo

让调查、设计、实现与人的判断共同推进。按用户目标选择工作深度，已有依据与授权直接沿用。只要求分析时完成分析，不进入实施。

被派发的执行者或审阅者只处理任务简报，不重新组织整项交付。

## 技能

| 当前需要 | 技能 | 主要结果 |
| --- | --- | --- |
| 查清现状、澄清需求、比较选择与打磨设计 | [brainstorming](../brainstorming/SKILL.md) | 有依据的需求和设计结论 |
| 按模板编写 Spec、ADR 或技术方案 | [writing-docs](../writing-docs/SKILL.md) | 交付文档 |
| 分段实施与独立审阅 | [incremental-delivery](../incremental-delivery/SKILL.md) | 实现与验证证据 |
| 澄清业务术语、关系或规则 | [domain-modeling](../domain-modeling/SKILL.md) | 更新共同理解 |
| 用失败测试驱动行为实现 | [test-driven-development](../test-driven-development/SKILL.md) | 红、绿、重构反馈 |
| 追查异常原因 | [systematic-debugging](../systematic-debugging/SKILL.md) | 原因与修复依据 |
| 查找、核实或维护项目知识 | [knowledge-management](../knowledge-management/SKILL.md) | 当前知识与有效导航 |

brainstorming 负责协作形成结论，writing-docs 负责按模板整理 Spec、ADR 和技术方案，incremental-delivery 负责拆分实施与审阅。写作按材料需要发生，不要求依次产出三份文档。复盘由主线程组织，知识管理承担知识维护。

建模、知识管理、TDD 和调试在需要时使用；纯前端或工程任务不必做领域建模。只加载当前适用的方法和参考，跨技能承接结论，不重新询问已决定的问题。

## 逐步收敛

先查事实，再讨论重要选择。每轮给出已知依据、当前问题、建议及具体后果；依赖未定选择的细节暂不定稿。没有关键未决问题时继续完成授权范围内的工作。

需要人判断时进行真正的讨论，不用一次性生成方案代替对齐。尊重用户已作的决定和委托，不因切换技能或保存文档重复索要许可。

流程、状态生命周期、跨模块调用、数据流或职责划分发生实质变化时，按 brainstorming 的展示变化要求调用 Archify；UI 形态结合设计稿或原型。

## 交付材料

默认使用 `.rivo/knowledge/`、`.rivo/issues/<slug>/` 和 `.rivo/archived/<slug>/`，项目已有位置或用户指定位置优先。组织材料时读 [交付工作区约定](references/delivery-workspace.md)，将位置传给方法技能。

## 碰撞处理

发现实现、证据与已确认需求、ADR、技术方案或知识不符时，说明原约定、发现、后果和处理建议。

- 原规则仍有效的实现错误：按原决定修复，无需重批。
- 需要改变业务含义、取舍或协作承诺：在既有授权内处理；未获决定暂停依赖部分，继续独立工作。
- 证据不足：先调查，保留不确定性。

更新受影响的材料和任务上下文，保留旧理由。

## 完成与复盘

按增量交付完成组合验证和终审，处理阻塞项，完成授权交接。结果说明改了什么、为什么、怎样验证和仍有何限制。

通过 knowledge-management 更新本次影响的知识及导航，再归档交付材料。没有新知识时不制造总结。
