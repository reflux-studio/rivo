<h1 align="center">Rivo</h1>

<p align="center"><b>和 AI 讨论方案，完成实施，并留下设计理由。</b><br>一套面向 Claude Code 与 Codex 的软件交付技能。</p>

<p align="center">
  <img alt="version" src="https://img.shields.io/badge/version-0.9.0-2f9e6b">
  <img alt="hosts" src="https://img.shields.io/badge/hosts-Claude%20Code%20%7C%20Codex-5f6b7a">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-5f6b7a">
</p>

---

AI 写出了能运行的代码，团队却未必清楚它为什么这样设计。等到下一次修改，大家还得重新查明哪些行为可以改、哪些约束必须保留。Rivo 在讨论、实施和验收时记录这些理由，供团队评审和后续修改时查阅。

你从需求和已有的思路开始，AI 查清现状，提出需要讨论的问题。重要取舍由你决定，也可以明确委托 AI 选择。双方确认的做法写成技术方案；实施中发现假设不成立，再带着证据回来修订。验收后，把核实过的机制和设计理由整理进项目知识库，供后续工作使用。

![交付经过讨论、方案、实施和知识整理；重要取舍、方案批准、实施授权和验收由用户确认](docs/assets/delivery.svg)

## 怎样协作

AI 负责查清技术事实，并在已授权的范围内选择实现方式。需求范围、业务行为、权限和公共契约等重要取舍由你决定，也可以明确委托 AI。一个选择有多个选项，或者曾经写进方案，并不意味着每次调整都需要请示。

例如，为审批系统增加供应商入口时，调查发现现有审批链只接受内部员工账号。扩展身份规则还是由内部员工代发起，会改变业务责任和权限，需要讨论；确定做法之后，内部函数怎样拆分由 AI 处理。

方案先说明本期怎样工作，再写接入所需的契约。调查过程保存在笔记中，重要选择的来由保存在 ADR 中。方案本身应当连续读懂，一个问题在合适的位置讲清，不重复解释，也不让读者在章节之间来回查找。

首次方案经过独立审阅，你批准并授权后开始实施。这两项授权可以一次给出。实施中发现设计不成立，暂停受影响的任务，继续已有授权覆盖的其他工作；修订及复核范围随实际影响确定。

审阅记录对应的版本、范围和未关闭问题。代码修好后还要验证和复核，旧的通过记录不代表新改动已经通过。独立审阅暂不可用时保留待审状态，继续能做的工作，并明确报告缺口。

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

`task.md` 记录可验收的任务、依赖和实际证据。每项任务完成后聚焦检查验收要求与契约，最终审阅再对照原始需求和已批准的范围变更，确认没有在实施中漏掉需求。

用户验收后，AI 核对最新代码，在已有知识结构中更新本次涉及的主题，保留其他工作的内容，再归档需求材料。

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

画图优先用 [Archify](https://github.com/tt-a1i/archify)，没有时按 writing-clearly 的模板手写 SVG。本页流程图的图源保存在 `docs/assets/delivery.workflow.json`。

## 接入与调用

| 宿主 | 插件入口 |
| --- | --- |
| Claude Code | [.claude-plugin/plugin.json](.claude-plugin/plugin.json)、[marketplace.json](.claude-plugin/marketplace.json) |
| Codex | [.codex-plugin/plugin.json](.codex-plugin/plugin.json) |

以上链接是仓库中的插件清单，用于宿主发现插件。完成接入后，可先让 AI 加载 `rivo:using-rivo`，说明当前可用的技能；在 Codex 中也可让它读取本仓库的 `skills/using-rivo/SKILL.md`。仅能读取技能文件，不代表插件的全部宿主能力都已配置好。

Claude Code 的[启动 Hook](hooks/hooks.json)在含 `.rivo/` 的项目里注入完整入口，其他项目只注入一行提示。各技能的宿主调用方式见 [using-rivo](skills/using-rivo/SKILL.md)。执行可由主代理或子代理完成，独立审阅使用宿主子代理；模型沿用宿主配置，Rivo 不指定。

## 修改 Rivo

修改技能时按 writing-clearly 写，同步核对参考文件、审阅提示词、插件清单、hook 和 README。`python3 tests/check_package.py` 检查包内引用、清单、模拟 Hook 输出和案例准备工具。

修改执行规则后，还要用具体需求试用，检查模型是否能按预期提问、记录、实施和收尾。离线案例和判定方法放在 `tests/behavior/`，用 `python3 tests/behavior/prepare.py <案例名> <仓库外的空目录>` 准备试用。准备案例与实际运行模型分别记录，格式与链接检查不能代替行为试用。

## 许可证

[MIT](LICENSE)
