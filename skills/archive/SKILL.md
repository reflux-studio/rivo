---
name: archive
description: 完结并归档一个已交付的 issue：抽 learnings、移目录到 archived/、改状态。用户想归档、结案或收尾时用。
argument-hint: <issue-id>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git add *), Bash(git mv *), Bash(git commit *), Bash(git status *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:archive —— 完结 + 沉淀 learnings

把 `coded` 的 issue 收尾归档：复盘沉淀 learnings、移动目录、推到 `archived`。

提交落在你当前所在的分支上。rivo 自己不 merge、不直提主线——分支合并与清理按 `PROJECT.md` 的约定、由你（或外部 PM 工具）做。

## 任务清单

1. **前置检查** —— `.rivo/` 在、`status` 为 `coded`、若有 `uat.md` 须结论为通过
2. **读 learnings** —— 扫 `.rivo/learnings/` 里相关 case（为复盘提供对照，也避免抽出重复条目）
3. **复盘、抽 learnings** —— 高门槛，没值得沉淀的就跳过
4. **同步 ARCHITECTURE.md** —— 本次若动了架构（模块/依赖/数据流/存储/边界）就必须更新；纯增量则跳过
5. **移目录 + 改状态** —— `git mv` 到 `archived/<id>/`，`status: archived`
6. **commit** —— `chore: archive <id>`
7. **结束语** —— 交代产物、关键决策、下一步

## 工作流程

**前置检查**

- `.rivo/` 不存在就引导用户先跑 `/rivo:init`，然后退出。
- 从 `$ARGUMENTS` 取 issue-id，读 `README.md` frontmatter 确认 `status` 是 `coded`。
- 若存在 `uat.md`，其结论必须是「通过」；没通过就拒绝归档，提示先按缺陷分流处理（见 `/rivo:uat`）。

**复盘与 learnings**

- 先扫 `.rivo/learnings/` 已有相关 case（既作复盘对照，也避免抽出重复条目），再通读本次全过程产物（README、spec、plan、reviews、uat、reflow）加源码 commits，找**真问题、真痛点**，不是记流水账。门槛要高：并非每次都得产出 learning，没有值得沉淀的就如实说明、跳过。
- 值得沉淀的（按 [templates/learning.md](templates/learning.md) 写进 `.rivo/learnings/<slug>.md`）：
  - 踩过的坑及根因（下次怎么避免）
  - 被验证有效的模式 / 决策
  - 被推翻的假设（reflow 暴露的方向性误判）
- 顺手处理过期 learnings：该改的改、该删的删，附变更说明。

**同步 ARCHITECTURE.md**

- 本次交付若改动了系统架构——新增/删除模块、改了依赖方向、数据流、存储模型或分层边界——就**必须**把 `.rivo/ARCHITECTURE.md` 更新到与代码一致（含 ASCII 图），对照 `plan.md` 里记的「打算怎么动架构」核对最终实现。这是条件强制、不是高门槛沉淀：动了架构就更新，纯增量、没动架构则跳过。
- 代码是实现的唯一真相；ARCHITECTURE.md 与代码对不上时以代码为准——这次就是把文档校准回代码的时机。

**移目录与收尾**

- `git mv` 把 `issues/<id>/` 整体移到 `archived/<id>/`，并把它的 `README.md` frontmatter 改成 `status: archived`、更新 `updated`。
- 提交 `chore: archive <id>`（含 learnings、ARCHITECTURE 更新如有、目录移动、状态）。
- 结束语交代产物（`archived/<id>/`、`learnings/<slug>.md` 如有、`ARCHITECTURE.md` 是否更新、归档 commit）、是否沉淀 learning 及要点（至多 3 条）、下一步：按 `PROJECT.md` 的分支约定把本次交付合并进主线、清理分支（rivo 不 merge），再开下一个 `/rivo:issue`。

## 核心原则

- **learnings 高门槛** —— 只沉淀真痛点和真模式，没有就如实跳过，绝不凑流水账。
- **架构动了就同步** —— ARCHITECTURE.md 是条件强制：动了模块/数据流/存储/边界就更新到与代码一致，纯增量则跳过；它不是高门槛沉淀。
- **不直提、不自清** —— 提交落在当前分支，合并与分支清理由你（或外部 PM 工具）按 `PROJECT.md` 约定做，rivo 不 merge。

## 反例

**"归档嘛，凑一条 learning 交差"** —— learnings 是给未来的自己省坑用的，凑数的流水账只会污染检索、稀释真正有用的那几条。这次没有真正值得记的，就明说跳过。
