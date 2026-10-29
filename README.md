<div align="center">

# Rivo

**设计由你主导，AI 查证、实施，并把理由留下来。**

面向 Claude Code 与 Codex 的产品、开发和测试协作技能 · v1.1.0 · MIT

[怎样工作](#怎样工作) · [安装](#安装) · [技能](#技能) · [贡献](CONTRIBUTING.md)

</div>

## 怎样工作

Rivo 让参与者围绕同一需求协作，保留决定、依据和验证结果。你可以从已有材料或当前问题开始，也可以单独使用公共方法，不必走完整交付流程。

| 插件 | 职责 |
| --- | --- |
| `rivo` | 统一入口、协作、恢复、调查、修订、写作、委派与知识整理 |
| `rivo-product` | 问题探索、研究、需求、设计与指标 |
| `rivo-development` | 技术讨论、方案、实施、调试与测试驱动开发 |
| `rivo-testing` | 测试设计、执行、缺陷报告与复测 |

先安装公共 `rivo`，再按需安装领域包；领域工作流至少需要公共包和所选领域包，领域包之间不互相依赖。公共方法可单独使用。输入可以是你提供的文件、链接、粘贴内容或同事的材料，不要求来自其他插件。

[using-rivo](skills/using-rivo/SKILL.md) 是统一入口，按需读取领域参考。共用目录集中在其 `references/workspace.md`，领域主文档与专有目录由 `references/product.md`、`development.md` 和 `testing.md` 维护；用户提供的现有位置优先，无需复制材料。

需求目录按产物组织：常读的主文档直接放在需求根目录，用文件名区分内容；调研、审阅和执行证据按主题、被审对象和运行编号放在共用目录。每份材料仍有负责人和依据版本，共用目录不改变修改权。只创建当前工作需要的产物，已有目录不自动迁移。

工单保持精简：登记参与方、角色、负责产物和协作索引；问题详情、回复和审计证据放在独立记录中。产品负责产品产物，开发负责技术方案与产品代码，测试负责用例与报告；跨角色问题交对应负责人，不代改对方产物。同一会话承担多个角色不构成独立质量保证。专业测试与开发自测分别报告；验收由有权的人决定。

## 安装

先添加市场并安装公共包，再选择需要的领域包。以下领域命令是可选项，可安装一个或多个。

### Claude Code

```text
/plugin marketplace add reflux-studio/rivo
/plugin install rivo@rivo
/plugin install rivo-product@rivo
/plugin install rivo-development@rivo
/plugin install rivo-testing@rivo
```

### Codex

```sh
codex plugin marketplace add reflux-studio/rivo
codex plugin add rivo@rivo
codex plugin add rivo-product@rivo
codex plugin add rivo-development@rivo
codex plugin add rivo-testing@rivo
```

开启新会话，说「用 Rivo」并描述任务。也可以单独请求公共方法，例如「用 writing-clearly 编辑这份报告」。涉及界面时，开发实施者和审阅者对照可访问的设计来源、版本与状态；无法读取时说明缺口。

## 从 0.x 升级

`rivo` 在 1.0 中变为公共插件，原开发流程移到 `rivo-development`。已有开发用户升级后需要同时安装 `rivo` 和 `rivo-development`；产品与测试按职责另行选择。旧需求目录继续沿用既有位置，不自动迁移。各领域只读取用户给定材料，不要求其他领域插件生成输入。

完整变更见 [CHANGELOG](CHANGELOG.md)。

## 技能

| 包 | 技能 |
| --- | --- |
| 公共 | [using-rivo](skills/using-rivo/SKILL.md)、[collaborating](skills/collaborating/SKILL.md)、[resume](skills/resume/SKILL.md)、[writing-clearly](skills/writing-clearly/SKILL.md)、[investigating](skills/investigating/SKILL.md)、[dispatching-subagents](skills/dispatching-subagents/SKILL.md)、[revising](skills/revising/SKILL.md)、[knowledge-management](skills/knowledge-management/SKILL.md) |
| 产品 | [discovering-products](plugins/rivo-product/skills/discovering-products/SKILL.md)、[market-research](plugins/rivo-product/skills/market-research/SKILL.md)、[competitive-analysis](plugins/rivo-product/skills/competitive-analysis/SKILL.md)、[user-research](plugins/rivo-product/skills/user-research/SKILL.md)、[writing-prds](plugins/rivo-product/skills/writing-prds/SKILL.md)、[designing-products](plugins/rivo-product/skills/designing-products/SKILL.md)、[reviewing-metrics](plugins/rivo-product/skills/reviewing-metrics/SKILL.md) |
| 开发 | [converging](plugins/rivo-development/skills/converging/SKILL.md)、[writing-plans](plugins/rivo-development/skills/writing-plans/SKILL.md)、[implementing-plans](plugins/rivo-development/skills/implementing-plans/SKILL.md)、[systematic-debugging](plugins/rivo-development/skills/systematic-debugging/SKILL.md)、[test-driven-development](plugins/rivo-development/skills/test-driven-development/SKILL.md) |
| 测试 | [designing-tests](plugins/rivo-testing/skills/designing-tests/SKILL.md)、[testing](plugins/rivo-testing/skills/testing/SKILL.md)、[reporting-defects](plugins/rivo-testing/skills/reporting-defects/SKILL.md) |

每个包的技能只在其对应目录维护一份。设计原则和贡献方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 本地检查

运行 `python3 scripts/check-package.py` 核对四包结构与实际 Hook 输出，运行 `python3 tests/check-distributions.py` 检查隔离组合、负例与本地并发登记。站点使用 `pnpm --dir site typecheck` 和 `pnpm --dir site build`。这些检查不替代真实宿主安装、Agent 行为试用或浏览器验证。
