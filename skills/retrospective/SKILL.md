---
name: retrospective
description: 团队复盘：各 Agent 写回各自记忆，团队经验沉淀到 learnings，同步契约、归档
when_to_use: Orchestrator 在一个需求交付完成、要复盘收尾时
user-invocable: true
---

# retrospective

一件事做完，团队一起复盘：各自总结做得好与坏的、沉淀经验，再把这次的认知同步回全局契约，最后归档。

## 各 Agent 自我复盘

Orchestrator 请这次参与、带私有记忆的常驻 Agent（生产型四位 Framer / Designer / Planner / Implementor，加 Verifier）做自我复盘、各自回报：

- 我这个站位这次哪里做对了、哪里搞砸了？
- 踩了什么坑，根因是什么，下次怎么避免？
- 哪个假设被推翻了（如果中途返工过）？

他们把**对自己这个站位下次有用**的经验写进自己的私有记忆，下次被拉起时就带着它开工。Reviewer 每轮临时拉起、审完即弃，不留私有记忆；它这次审出的、值得复用的评审视角，由 Orchestrator 在下一节摘进全局 learnings。

## 沉淀全局学习

Orchestrator 把各 Agent 复盘里**跨站位、对整个团队有用**的，连同 Reviewer 值得复用的评审视角，汇总成一份学习文档，按 [learning.md](../../templates/learning.md) 落到 `.rivo/learnings/<slug>.md`。门槛要高：踩过的坑 + 根因、被验证有效的模式、被推翻的假设，命中才写，不凑流水账；一条都没命中就如实说「本次无特殊经验沉淀」。

复盘结论也是无下游的产物：沉淀前过一轮 Reviewer 本质内审，看每条经验是真有根因支撑、还是流水账凑数。没人会在以后引用 learnings 时帮你纠错，这轮内审是它唯一的把关。

## 同步契约

这次动了的同步回全局契约，一切以代码现状为准：

- 动了技术栈（语言 / 框架 / 关键依赖增删换）→ 更新 PROJECT.md
- 动了模块、依赖方向、数据流、存储、分层 → 更新 ARCHITECTURE.md
- 动了 token、新增可复用组件、改了组件库约定 → 更新 DESIGN.md
- 动了命名 / 目录 / 错误处理 / 测试范式等代码规约 → 更新 CONVENTIONS.md
- 动了怎么跑起来、测试 / e2e 现状、种子数据 → 更新 TESTING.md

都没动就跳过。

## 归档

- 把 `.rivo/issues/<id>/` 整体移到 `.rivo/archived/<id>/`
- 列交付物，摘至多 3 条关键复盘发现

## 核心原则

- **各自长记性**：Agent 经验进各自记忆，团队经验进全局 learnings，别混。
- **learnings 宁缺毋滥**：凑数的流水账污染检索。
- **契约动了就同步**：不同步就是文档开始腐化。
