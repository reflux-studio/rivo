# Rivo

用户主导，AI 辅助：把你的方案想清楚、写明白，再落实为经过验证的实现。

一次交付像一条河。你的蓝图、AI 对现状的调研、项目知识和手上的材料，像几条支流汇成干流；方案勘定河道；水顺着河道流下，哪里的堤岸不牢一冲便知；最后在入海口，这次得到的认识沉淀成三角洲。

| 阶段 | 技能 | 做什么 |
| --- | --- | --- |
| 汇流 | confluence | 从你的蓝图出发逐轮讨论，每个定下的分叉当场记成 ADR |
| 河道 | course | 把讨论写成给人评审的技术方案 plan.md，独立审阅后交你和团队评审 |
| 水流 | flow | 按粗粒度的实施方案 task.md 派发实施，实施本身就是对方案的验证 |
| 三角洲 | delta | 你验收之后，把认识整理进项目知识库，归档本次材料 |

沿途的独立审阅像水文站，只观测、不替你做决定；任务像船闸一样逐级通过；评审或实施推翻了某个决定时，逆流回到上游重新勘定。

## 为什么是这样

很多人把方案设计也交给 AI，结果代码能跑，却没人真正理解它为什么这样设计，这就是认知债务。Rivo 让你先给出脑中的蓝图，AI 查证前提、追问缺口、补全细节，重要的判断都在讨论中由你做出，并当场留下记录。方案写给人读，能拿去团队评审；实施被当作一次次验证，方案不对就停下来改方案，而不是绕过去硬做。

## 开始使用

安装插件后，直接描述要做的事：

> 用 Rivo 完成这个需求。我打算沿用现有审批链，增加供应商发起入口。先查清现状，再和我逐轮讨论。

也可以点名某个技能：

> 用 course 根据团队评审意见修订这份技术方案。

> 用 flow 按已批准的方案实施。

> 我验收通过了，用 delta 收尾。

> 用 investigating 查清 OA 怎样读取数组字段，更新 note。

是否走 Rivo 由你决定。你没有提到 Rivo 的请求，即使在 Rivo 项目里，AI 也按普通方式处理；遇到明显较大的需求，AI 会先建议，你同意后才进入流程。小改动直接做就好。

## 一次完整交付

**汇流（confluence）。** AI 先读需求、材料、项目知识库和团队规约，确认你的思路和理由，画出现状的 before 图。然后按轮提问：每轮问出所有前提已经确定的问题，附上场景、依据和建议答案；能查到的事实由 AI 自己查，只把决定交给你。每轮结束时，定下的分叉写成 ADR，`adr/` 目录就是这棵决策树。讨论要同时满足三个条件才结束：没有未决的分叉，主场景和失败场景都能走通，你确认双方理解一致。

**河道（course）。** AI 把讨论写成 `plan.md`：需求与范围、现状与总体方案、按主题展开的设计、影响面、验证与发布，涉及结构或流程变化的地方配 before/after 图。写完先自查，再交给独立审阅者全量审阅。审阅意见分阻塞和非阻塞，只剩非阻塞问题即通过；同一份方案三轮仍未通过，AI 会停下来分析原因并告诉你。审阅通过后交给你自审或拉团队评审，批准后标为定稿 v1.0，此后每次修改都升版本并告诉你改了什么、为什么。

**水流（flow）。** 你授权实施后，AI 写一份粗粒度的 `task.md`：每项任务的可验证结果、依赖、契约和验收方式，不写到文件级。执行者读方案和代码自己完成任务，发现方案走不通就停下报告；每项任务都由新的审阅者检查实现效果、成本和对方案的偏离。偏离分三种处理：违反 ADR 的回到讨论由你决定，改变方案内容的修订 plan.md 并请你确认，方案没写到的实现选择由 AI 决定并记录。全部完成后做一次整体审阅，再请你验收。

**三角洲（delta）。** 你明确验收通过后，AI 结合最新代码，把本次的 ADR、调查笔记、方案和图整理进项目知识库，只改本次涉及的主题，写成新同事能从头读懂的文字；然后把需求目录移入 `.rivo/archived/`。

## 图示

图文结合是减少认知债务的核心手段。技术方案和知识库里的图都是嵌入 Markdown 的 SVG，并保留图源；涉及结构或流程变化时同时给出 before 和 after，你能一眼看出这次改了什么、没改什么。环境里有支持 SVG 交付的 [Archify](https://github.com/tt-a1i/archify) 时优先使用它，还可以用它的 compare 生成可交互的对照页；没有时 AI 直接手写 SVG。

## 文件位置

```text
.rivo/
  issues/<需求目录>/
    adr/          决策树的每个分叉
    plan.md       技术方案，给人读、给人评审
    task.md       粗粒度实施方案与实施记录
    note.md       按主题组织的调查笔记
    assets/       图源、SVG 与交付回执
    reviews/      每轮审阅报告
    evidence/     验证证据
  knowledge/      项目知识库：首页导读和按主题的文件
  archived/       验收后归档的需求目录
```

用户或项目指定的位置优先，项目已有知识库或 wiki 时在原处维护。Rivo 不维护状态文件，继续工作时从这些材料和实际改动中核对进度。

## 技能

| 技能 | 用途 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 入口：什么时候走 Rivo、交付顺序与宿主调用 |
| [confluence](skills/confluence/SKILL.md) | 讨论需求与方案，边问边记 ADR |
| [course](skills/course/SKILL.md) | 编写、审阅和修订技术方案 plan.md |
| [flow](skills/flow/SKILL.md) | 编排实施方案 task.md，组织实施、审阅与验收 |
| [delta](skills/delta/SKILL.md) | 验收后维护项目知识库并归档；查阅项目知识，按你的指定重写已有知识库 |
| [investigating](skills/investigating/SKILL.md) | 查清具体问题，维护调查笔记 |
| [drawing-diagrams](skills/drawing-diagrams/SKILL.md) | 绘制 before/after 图 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 用失败测试驱动行为实现 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 复现异常并验证根因 |

## 接入

仓库提供两种插件清单，按宿主的插件安装流程加载本仓库：

| 宿主 | 插件清单 |
| --- | --- |
| Codex | [.codex-plugin/plugin.json](.codex-plugin/plugin.json) |
| Claude Code | [.claude-plugin/plugin.json](.claude-plugin/plugin.json) 和 [marketplace.json](.claude-plugin/marketplace.json) |

在 Claude Code 中，[启动 Hook](hooks/hooks.json) 只在当前目录含 `.rivo/` 的项目里注入完整入口，其他项目只注入一行提示。修改源码后，需要另外刷新已安装的插件副本。

## 从 0.7 升级

技能名换成了河流的名字，点名调用旧名字会找不到技能：

| 0.7 | 0.8 |
| --- | --- |
| discussing-designs、architecture-decisions | confluence |
| writing-designs | course |
| planning-tasks、implementing-tasks | flow |
| knowledge-management | delta |
| using-archify | drawing-diagrams |

产物名不变，已有项目不需要迁移：`plan.md` 仍是技术方案，`task.md` 仍是实施方案，只是 0.8 的 task.md 更粗；方案审阅报告仍是 `reviews/plan-<n>.md`。旧目录里的 `reviews/design-*` 是 0.7 的讨论审阅，0.8 不再产生。0.7 的 `.rivo/decisions/` 不再使用，决定都记在所属需求的 `adr/` 中。

## 修改 Rivo

修改技能时同步检查参考文件、审阅提示词、插件清单、hook 和本 README。格式检查通过不代表实际使用正确，改完要在真实需求上试用。

## 许可证

[MIT](LICENSE)
