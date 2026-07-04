# rivo

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-d97757.svg)](https://docs.claude.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#贡献)

> 一个人，一支 AI 产研团队。

rivo 是跑在 Claude Code 里的 AI 产研团队。你提需求、在该拍板的地方拍板；团队按标准的产研流程，把需求从澄清一路推进到上线。

AI 写代码早就不是瓶颈，交付才是：需求问清楚、方案审一遍、测试配齐、上线前带用户真跑一遍。单干的人最容易省这些环节，而省掉的地方就是 bug 和返工的来源。rivo 把它们变成流程的默认值，不靠自觉。

## 安装

前置：Claude Code，并开启实验特性 Agent Team（`settings.json` 或环境变量）：

```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

安装插件：

```
/plugin marketplace add reflux-studio/rivo
/plugin install rivo@rivo-marketplace
```

## 团队

五个成员，四个生产，一个推进：

| 成员 | 负责 | 产出 |
| --- | --- | --- |
| **Product** | 需求、缺陷复现、UAT | spec、复现记录、uat 记录 |
| **Designer** | 界面的交互与视觉（仅前端） | ui-spec |
| **Engineer** | 技术方案、编码、测试、发布 | plan、代码、测试记录 |
| **Reviewer** | 评审一切承载判断的产物 | 评审意见 |
| **Team Lead** | 开工单、照流程表推进、把该拍板的事收口给你 | —— |

为什么这么分？不是在模拟人类分工——模型没有精力上限，按职业拆开不会让它更能干。每道拆分对应一个真实机制：**立场**，Reviewer 被授权挑剔、Engineer 被授权为架构推回需求，对冲模型天生的顺从倾向；**隔离**，评审者只拿产物、不听作者辩解，独立判断靠物理隔开的上下文保证；**异构**，把关的座位可以换不同厂商的模型，错误分布不相关，才是真正的第二双眼睛。

## 一次交付长什么样

第一次进项目先跑 `/rivo:onboarding`：Engineer 勘测代码库、Designer 勘测设计体系、Product 和你对话，产出三份长期文档，之后所有方案和评审以它们为准绳。

然后把需求丢给团队。Team Lead 判断工单类型，照该类型的流程表推进：

```
产品需求  产品方案 → 〔界面设计〕 → 技术方案 → 编码 → 测试 → UAT → 发布 → 复盘
缺陷      复现 → 定修复预期 → 〔技术方案〕 → 编码 → 测试 → 发布 → 复盘
技术任务  定目标 → 技术方案 → 编码 → 测试 → 发布 → 复盘
```

每个产出步骤后面都跟着 Reviewer 的评审；评审由作者直接发起，打回直达作者，通过才推进。

你只在少数几处出现：需求定稿、方案定稿、UAT、发布放行，以及一切不可逆变更——数据迁移、对外接口变更、换技术栈，无论改动多小都等你点头。其余时间团队自己往前走，不需要你一步步说「继续」。

再小的需求也开工单、走完整流程——改一行文案也是产品需求。它不会因此变重：spec 一句话，方案一句话，评审三十秒。**流程的重量跟着决策量缩放，不跟步骤数。**

## 设计选择

真正有取舍的几条：

- **流程是预设的，不是动态编排的。** 现实中的产研团队也不靠 PM 每单现场发明流程。三类工单三张流程表，Team Lead 照表推进；表上的步骤不许跳，但每步的产物按决策量收缩。
- **决策与写作分离。** 每类产物两个技能：brainstorming 管探索与收敛（对话式），writing 管决策定稿后一次性成文——product-brainstorming 配 writing-specs，architecture-brainstorming 配 writing-plans。写作中发现大方向没定，停下来回探索。
- **评审是双模的。** 同一套检查清单，评自家产物给裁决，评外来的 PRD 和设计稿给反馈与澄清问题。企业环境的存量输入和个人项目的自产产物，一套方法通吃。
- **单一事实源。** 设计稿能查到的值不抄进文档，代码能读出的事实不抄进勘测记录——抄一份就是双写，源头一改副本就撒谎。文档只写源头表达不了的东西，并告诉你去哪查。
- **状态落盘。** 会话上下文随时可清，进度和结论住在工单目录里，断了从盘上接着走。
- **方法技能可移植。** 技能全部用「若已连接……」的能力句式写成，正文零 rivo 词汇，拎出去在任何环境单独可用。方法内化自 Anthropic 官方插件与 superpowers，保留原有的结构与密度。
- **团队会记事。** 每个成员有私有记忆。复盘的经验三个去向：全队通用的进 `learnings/`，属于某份长期文档的直接改文档，属于个人工作方式的进各自记忆——同一条经验只住一个家。

## 留在你仓库里的东西

```
your-repo/
├── .rivo/
│   ├── PROJECT.md          ← 给谁用、什么算价值、交付约定（Product 维护）
│   ├── ARCHITECTURE.md     ← 架构、代码规约、验证基建（Engineer 维护）
│   ├── DESIGN.md           ← token、组件库、业务组件清单（Designer 维护，仅前端）
│   ├── issues/<id>/        ← 进行中的工单：ticket、spec、plan、评审意见、测试与 uat 记录
│   ├── archived/<id>/      ← 已交付的工单
│   └── learnings/          ← 跨工单的团队经验（INDEX.md 索引，一条一文件）
└── .claude/agent-memory/   ← 各成员的私有记忆（Claude Code 内置，随项目入库）
```

## 贡献

欢迎提 issue 和 PR。rivo 没有构建步骤，整个插件是一组 Markdown，分三层，写之前先想清楚内容属于哪一层：

- `agents/`——**成员**。五节解剖：身份、立场与价值序、行为红线、协作方式、记忆职责。不写流程时序，不写方法；检验标准是卸掉所有技能，光凭这份文件拉起来的成员性格仍然是对的。
- `skills/`（方法技能）——**方法**。对标 Anthropic 官方技能的结构与密度写作：编号工作流、可翻查的方法知识、产出结构、注意事项；外部依赖一律写成「若已连接……未连接则基于现有信息推进」的能力句式。检验标准是拎出 rivo 在任何环境单独可用。reviewing 系技能的检查清单与对应 writing 技能的产出结构成对维护，改一边必查另一边。
- `skills/collaborating`、`skills/onboarding`——**协作协议**。角色分工、流程表、交接与记录规则；只编排，不夹带方法，持有型内容必须短。
- 命名规则：生态里有既定名的照搬原名（product-brainstorming、test-driven-development、systematic-debugging）；自造的用动词-产物格式（writing-specs、reviewing-code、surveying-codebases）。

改完在自己的 Claude Code 里装个本地版本，拿一个真实需求走一单验证，再提 PR。改动尽量小而聚焦，附上改了什么、为什么。

## 许可

[MIT](LICENSE)。
