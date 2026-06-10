---
name: archive
description: 沉淀学习经验、同步架构文档并归档 issue
when_to_use: 用户验收完成后，需求完结，需要复盘沉淀并归档 issue 时使用
argument-hint: <issue-id>
arguments: [issue_id]
---

# 归档

把已完成的 issue 收尾：复盘、沉淀 learnings、同步宪章文档、移到归档目录。

若 [using-rivo](../using-rivo/SKILL.md) 总纲尚未在上下文中，先读它。

## 获取必要的上下文

1. 确认 `.rivo/` 存在
2. 读 `.rivo/issues/$issue_id/` 下全套产物——prd、spec、plan、tasks、reviews、uat
3. 重点读 plan.md 的「现状与影响面」一节，对照初始判断和最终实现，找出哪里判断偏了——learning 多藏在这
4. 读 `git log` 里本次 issue 的所有 commits
5. 扫 `.rivo/learnings/` 已有案例做复盘对照
6. 检查 `uat.md`：不存在（还没走 verify）或结论不是「全部通过」时，如实向用户指出，确认是否仍要归档——归不归由用户拍板

## 复盘与 learnings

通读全过程产物 + 源码 commits，对照三类判据：

- 踩过的坑及根因（下次怎么避免）
- 被验证有效的模式 / 决策
- 被推翻的假设（如果中途返工过）

命中任何一类，就按 [templates/learning.md](templates/learning.md) 格式沉淀到 `.rivo/learnings/<slug>.md`。slug 用 3-5 个词的 kebab-case 概括主题，不带 issue-id。落盘前扫 `.rivo/learnings/` 的已有 slug，避免撞名。

**门槛要高，但别漏真货**：三类一条都没命中，就如实说「本次无特殊经验沉淀」，跳过，不凑流水账；命中了却拿不准值不值得写的，宁可写——被推翻的假设和建模层面的决策最容易被低估。发现已有 learning 过时了，顺手更新或标记。

## 同步 PROJECT.md

本次动了技术栈（新增 / 升级 / 替换了语言、框架或关键依赖），就把 `.rivo/PROJECT.md` 更新到与代码一致；都没动就跳过。

对照 `package.json` 等依赖声明文件核验，代码是唯一真相。

## 同步 ARCHITECTURE.md

本次动了模块增删、依赖方向、数据流、存储模型、分层边界任一项，就把 `.rivo/ARCHITECTURE.md` 更新到与代码一致；都没动就跳过。

对照 plan.md 里「打算怎么动架构」核验最终实现。代码是唯一真相，冲突时以代码为准。

## 同步 DESIGN.md

本次动了设计 token、新增了可复用组件、或改了组件库约定任一项，就把 `.rivo/DESIGN.md` 更新到与代码一致；纯业务改动、没动设计规约就跳过。

对照 `ui-contract.md` 里的新增组件清单核验最终实现。代码是唯一真相，冲突时以代码为准。

## 移目录与收尾

- 移动目录：`mv .rivo/issues/$issue_id/ .rivo/archived/$issue_id/`，然后 `git add` 旧路径和新路径。不要用 `git mv`——如果其他分支仍有同名 issue 目录，git mv 可能在合并时引发冲突。
- 提交 `chore: archive $issue_id`，含目录移动、learnings（如有）、PROJECT / ARCHITECTURE / DESIGN 更新（如有）
- 列交付物：归档目录、learnings（如有）、各宪章文档是否更新
- 摘关键复盘发现，至多 3 条
- 指下一步：按 PROJECT.md 合并清理分支

## 核心原则

- **learnings 宁缺毋滥** —— 凑数的流水账污染检索、稀释真正有用的
- **宪章文档动了就同步** —— PROJECT、ARCHITECTURE、DESIGN 只要实际有变动就必须更新，不是高门槛沉淀
- **不 merge** —— 提交落在当前分支，合并清理由用户按 PROJECT.md 执行

## 危险信号

- 「这次没什么特别的，写一条简单的 learning 凑数」—— 宁缺毋滥，流水账污染检索。
- 「架构改动不大，下次归档再一起更新」—— 架构动了就必须同步，推迟就是文档开始腐化。
- 「uat 说基本通过，应该可以归档了」——「基本」「有条件」不是「通过」，把偏差指给用户看，归不归由用户决定。
