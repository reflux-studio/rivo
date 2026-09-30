<h1 align="center">Rivo</h1>

<p align="center"><b>和 AI 讨论方案，完成实施，并留下设计理由。</b><br>一套面向 Claude Code 与 Codex 的软件交付技能。</p>

<p align="center">
  <img alt="version" src="https://img.shields.io/badge/version-0.8.4-2f9e6b">
  <img alt="hosts" src="https://img.shields.io/badge/hosts-Claude%20Code%20%7C%20Codex-5f6b7a">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-5f6b7a">
</p>

---

AI 写出了能运行的代码，团队却未必清楚它为什么这样设计。等到下一次修改，大家还得重新查明哪些行为可以改、哪些约束必须保留。Rivo 在讨论、实施和验收时记录这些理由，供团队评审和后续修改时查阅。

你从需求和已有的思路开始，AI 查清现状，提出需要讨论的问题。重要取舍由你决定，也可以明确委托 AI 选择。双方确认的做法写成技术方案；实施中发现假设不成立，再带着证据回来修订。验收后，把核实过的机制和设计理由整理进项目知识库，供后续工作使用。

![交付经过讨论、方案、实施和知识整理；重要取舍、方案批准、实施授权和验收由用户确认](docs/assets/delivery.svg)

## 怎样协作

假设你要在现有审批系统里增加供应商发起入口。调查后发现，现有审批链要求发起人是内部员工，而供应商使用外部账号。接下来至少有两种做法：扩展审批链，让它识别外部账号；或者由内部员工代供应商发起，保留现有审批链。

这两种做法改变的范围不同，业务责任也不同。AI 需要查明影响哪些接口、权限和操作，再向你说明代价。假如你决定本期由员工代发起，理由是暂不改变审批链的身份规则，这个决定及其理由就会写进 ADR（架构决策记录）。之后还要继续讨论：员工可以替哪些供应商发起，记录里怎样区分申请人与代办人。

下图用另一组模板审批问题展示决定之间的依赖：

![模板审批的一个决定引出后续决定和待回答的问题](docs/assets/decision-tree.svg)

讨论确定的做法会写成技术方案，普通细节也一并纳入。方案经过独立审阅，交给你或团队评审；你批准并授权实施后，AI 再按任务推进。

实施中如果发现接口不能保留申请人与代办人的区别，AI 会说明证据和影响，请你确认怎样调整方案。每项任务完成后检查验收要求，全部完成后再整体审阅。最后交付代码、验证结果和未解决的问题，由你验收。

## 开始使用

插件接入后，直接描述要做的事：

> 用 Rivo 完成这个需求。我打算沿用现有审批链，增加供应商发起入口。先查清现状，再和我讨论。

没有具体方案也可以从目标开始。是否进入完整流程由你决定；普通请求按普通方式处理，明显较大的需求会先建议使用 Rivo。

也可以单独使用某个技能：

> 用 writing-plans 根据团队评审意见修订这份技术方案。
>
> 我验收通过了，用 knowledge-management 收尾。
>
> 用 investigating 查清审批系统怎样读取数组字段。

## 一次交付会留下什么

| 阶段 | 技能 | 产出 | 需要你参与的事 |
| --- | --- | --- | --- |
| 讨论 | converging | ADR、调查笔记、现状图 | 提供思路，决定重要取舍，确认理解一致 |
| 方案 | writing-plans | `plan.md`、方案审阅报告 | 自审或请团队评审，批准方案 |
| 实施 | implementing-plans | `task.md`、代码、验证证据、审阅报告 | 授权实施，确认方案变更，验收 |
| 知识 | knowledge-management | 项目知识库、归档材料 | 通常无需额外操作；未核实事项会单独报告 |

`plan.md` 说明需求、现状、设计、影响面，以及验证和发布安排。开发、联调和发布需要对照的契约留在这里，关键理由在正文中说明，完整的选项比较可在 ADR 中查阅。图帮助说明结构和流程，正文也应能独立读懂。

`task.md` 按可验收的结果安排实施，写清任务依赖和共同约定，具体做法由执行者阅读方案和代码后确定。需要改变重要决定时重新讨论，需要改变方案约定时修订方案；未改变行为和接口约定的实现细节，由 AI 选择并记录。

用户验收后，AI 对照最新代码更新知识库，只改本次涉及的主题，再归档需求目录并检查链接。

## 文件位置

```text
.rivo/
  issues/<需求>/
    adr/          重要决定、理由和依赖关系
    plan.md       技术方案
    task.md       实施方案与实施记录
    note.md       调查笔记；成文前暂存已确认的方案细节
    assets/       图与图源
    reviews/      审阅报告
    evidence/     验证证据
  knowledge/      项目知识库
  archived/       验收后归档的需求
```

用户或项目指定的位置优先。Rivo 不另设状态文件。继续工作时，先对照这些材料和实际改动核对进度；记录不足的部分需要补查，不能仅凭某个文件存在就认定阶段已经完成。

## 技能

| 技能 | 用途 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 说明入口、交付顺序和宿主调用方式 |
| [converging](skills/converging/SKILL.md) | 讨论需求与方案，记录重要取舍 |
| [writing-plans](skills/writing-plans/SKILL.md) | 编写、审阅和修订技术方案 |
| [implementing-plans](skills/implementing-plans/SKILL.md) | 安排实施、审阅与验收 |
| [knowledge-management](skills/knowledge-management/SKILL.md) | 查阅和维护项目知识，归档交付材料 |
| [investigating](skills/investigating/SKILL.md) | 查清具体问题，维护调查笔记 |
| [writing-clearly](skills/writing-clearly/SKILL.md) | 写清文档、图和提示词 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 先用测试表达预期行为，再实现和验证 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 复现异常、检验原因假设并验证修复 |

画图优先用 [Archify](https://github.com/tt-a1i/archify)，没有时按 writing-clearly 的模板手写 SVG。本页的两张图分别用这两种方式生成，图源在 [docs/assets](docs/assets)。

## 接入与调用

| 宿主 | 插件入口 |
| --- | --- |
| Claude Code | [.claude-plugin/plugin.json](.claude-plugin/plugin.json)、[marketplace.json](.claude-plugin/marketplace.json) |
| Codex | [.codex-plugin/plugin.json](.codex-plugin/plugin.json) |

以上链接是仓库中的插件清单，用于宿主发现插件。完成接入后，可先让 AI 加载 `rivo:using-rivo`，说明当前可用的技能；在 Codex 中也可让它读取本仓库的 `skills/using-rivo/SKILL.md`。仅能读取技能文件，不代表插件的全部宿主能力都已配置好。

Claude Code 的[启动 Hook](hooks/hooks.json)在含 `.rivo/` 的项目里注入完整入口，其他项目只注入一行提示。各技能的宿主调用方式见 [using-rivo](skills/using-rivo/SKILL.md)。子代理的模型沿用宿主配置，Rivo 不指定。

## 修改 Rivo

修改技能时按 writing-clearly 写，同步核对参考文件、审阅提示词、插件清单、hook 和 README。修改执行规则后，还要用具体需求试用，检查模型是否能按预期提问、记录、实施和收尾。格式与链接检查只能发现部分问题。

## 许可证

[MIT](LICENSE)
