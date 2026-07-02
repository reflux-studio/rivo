---
name: onboarding
description: 团队入场新项目的协调：建 .rivo 骨架、派各 Agent 用 surveying 技能分头勘测产出全局契约、自校 + 用户确认定稿
when_to_use: Orchestrator 接手一个还没有 rivo 全局契约的项目时
user-invocable: true
---

# onboarding

团队第一次进这个项目，先摸清它，产出长期全局契约，作后续所有需求决策的共同依据。每个 Agent 从自己的站位分头勘测，各产一份契约。

## 建骨架

项目根没有 `.rivo/` 就建一个，预建 `.rivo/issues/`、`.rivo/archived/`、`.rivo/learnings/`。已存在就只补缺的，不动现有产物。

## 分头勘测

各 Agent 调 **surveying** 技能勘测自己站位对应的侧面，产出契约到 `.rivo/`（涉及前端才有 DESIGN）：

- **Framer** → `PROJECT.md`：项目身份、用户、能力、技术栈。
- **Planner** → `ARCHITECTURE.md`：模块、数据流、存储、分层边界。
- **Designer** → `DESIGN.md`：设计 token、组件库、断点。
- **Implementor** → `CONVENTIONS.md`：命名、目录、错误处理、测试范式等代码规约。
- **Verifier** → `TESTING.md`：怎么跑起来、测试与 e2e 现状、种子数据。

## 定稿

全局契约不走 Reviewer 评审：勘测者自校一遍，把要点和标为推断的项摆给用户确认，确认过才算定稿。空项目就按各自模板逐项问用户，不编造。
