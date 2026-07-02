# rivo

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-d97757.svg)](https://docs.claude.com/en/docs/claude-code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#贡献)

> 一个人，一支 AI 产研团队。

rivo 是跑在 Claude Code 里的多 Agent 交付工作流。你提需求、在该拍板的地方拍板，澄清、设计、编码、评审、验收、复盘——整条交付链由一支各守一问的 Agent 团队跑完。

AI 写代码早就不是瓶颈，交付才是：需求问清楚、方案审一遍、测试配齐、上线前真跑一遍。单干的人最容易省这些环节，而省掉的地方就是 bug 和返工的来源。rivo 把这些环节变成流程的默认值，不靠自觉。

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

## 一次交付长什么样

第一次进项目，先跑 `/rivo:onboarding`：五个 Agent 分头勘测你的代码库，产出项目身份、系统架构、设计系统、代码规约、验证基建五份契约，作为之后所有决策的依据。

然后把需求丢给 `/rivo:orchestrating`：

1. **澄清。** Framer 和你对话，把模糊诉求变成带验收标准（AC）的需求规格。每轮只问一小组问题、都附建议答案，你在锚点上拍板就行。
2. **定方案。** 前端需求 Designer 先出 UI 规格；Planner 出全栈技术方案，接口、数据模型、组件契约拆到能直接施工。
3. **写代码。** Implementor 照方案 TDD 施工，一条 AC 一轮红绿。
4. **过双门。** 每份产物先过 Reviewer 评审——按产物类型的清单逐项审，高风险多开几个并行；代码再加一道：Verifier 把系统真跑起来，逐条 AC 亲手点、亲手验。不过就打回，直到过。
5. **UAT。** 上线前带你把真实场景走一遍，由你确认价值兑现。收尾跑 `/rivo:retrospective`，团队各自沉淀经验，下次更懂这个项目。

你只在少数几处出现：需求定版、方案定版、UAT，以及所有**不可逆变更**（数据迁移、对外契约、技术栈更换——这是唯一的硬门，无论改动多小）。小需求聊清楚了团队自己干完，你不用一步步说「下一步」。

缺陷工单走另一条轨道，从「真的坏了吗」进：Verifier 先黑盒复现，Framer 再定该修成什么样，Planner 拿着复现测试定位根因——修复本质就是把那个失败测试改绿。

交付中队友要问你的问题，都由 Orchestrator 收口：按你的偏好，提醒你进那个队友的会话直接聊，或代为转述。转述可以把「SSR 还是 CSR」翻成「要不要被搜索引擎良好收录」，但选项和代价保真，答案永远由你给。

## 团队

主线程是 **Orchestrator**——控制面，只做编排：判型、派活、守门、推进，从不下场创作。干活的是六个 Agent，每个只对一个问题负责：

| Agent | 回答的问题 | 产出 |
| --- | --- | --- |
| **Framer** | 做什么、做成什么样算成功 | spec |
| **Designer** | 用户怎么交互（仅前端） | ui-spec |
| **Planner** | 怎么做 | plan |
| **Implementor** | 把事做完 | 代码 |
| **Reviewer** | 写得对不对 | 评审报告（临时拉起，审完即弃） |
| **Verifier** | 真的坏了吗、做完了没有 | 复现结论、验收记录 |

**为什么按问题分，不按岗位分？** 人类团队按岗位分工，是因为一个人精力有限；把模型切成只做一件事的工种，只会平白多出交接损耗。rivo 拆开 Agent 只为一件事：让视角彼此独立——定需求的不下场实现，写代码的不审自己的代码，验收的不读实现。质量不靠自觉，靠交叉验证。

## 设计选择

真正有取舍的几条：

- **流程按问题组织，不按产物链硬串。** 轨道的每个阶段回答一个问题，主办就是管这个问题的站位。裁掉一个阶段，等于断言这个问题的答案已经摆在那了——答案真一眼见底就跳（最小轨道只剩几行 spec、编码和质量门），答案不明还跳才是偷步。
- **方法与流程分层。** 技能只装方法，检验标准是拎出 rivo 也能单独用；谁在什么阶段用什么技能、读写哪个产物，全部绑定在编排层。换宿主平台时，方法层原样带走。
- **两道质量门，作者都不碰自己的。** Reviewer 静态审读，Verifier 黑盒实证、不读实现，专逮「代码看着对、点下去不对」的问题。按你的习惯，评审还可以调本机外部 AI CLI 做跨厂商外审。
- **集中编排，不靠自组织。** 走哪一步由 Orchestrator 定，Agent 不自己决定流程。模型干活通常一口气到底，靠产物落盘和独立评审兜底，不指望它们中途互相问。
- **团队会记事。** 常驻 Agent 有私有记忆，复盘时把对全队有用的经验沉淀成 learnings，契约随代码同步。

## 留在你仓库里的东西

```
your-repo/
├── .rivo/
│   ├── PROJECT.md              # 项目契约：身份、用户、能力、技术栈
│   ├── ARCHITECTURE.md         # 架构契约：模块、数据流、存储、分层
│   ├── DESIGN.md               # 设计契约：token、组件库、断点（涉及前端才有）
│   ├── CONVENTIONS.md          # 代码规约契约：命名、目录、错误处理、测试范式
│   ├── TESTING.md              # 验证基建契约：怎么跑起来、测试与 e2e 现状
│   ├── issues/<id>/            # 进行中的需求（ticket / spec / ui-spec / plan / reviews / verification / uat / assets）
│   ├── archived/<id>/          # 已归档需求
│   └── learnings/<slug>.md     # 跨需求沉淀的团队经验
└── .claude/agent-memory/<agent>/  # 各 Agent 的私有记忆（Claude Code 内置，随项目入库）
```

需求标识 `<id>` 是一个 3 到 5 词的 kebab-case slug（如 `order-export`），澄清需求时定，不带序号，多分支并行也不会撞。

## 贡献

欢迎提 issue 和 PR。rivo 没有构建步骤，整个插件就是一组 Markdown，分四层，写之前先想清楚内容属于哪一层：

- `agents/<agent>.md`：**站位**——它是谁、答什么问题、协作时的行为约束、边界在哪。不写流水线时序，也不写方法。
- `skills/<skill>/SKILL.md`：**方法**——这件事怎么做好，检验标准是拎出 rivo 也能单独用。引用 rivo 产物用「（rivo 里是 X）」的软绑定；各产物的评审清单在 `reviewing` 的 `checklists/` 下，外审配方在它的 `external-audit.md`。
- `skills/orchestrating/`：**绑定**——谁在什么阶段用什么技能、读写哪个产物、怎么把关和返工，全在这里和 `flows.md`。
- `templates/<产物>.md`：**产物契约**——每份产物长什么样。「写什么」以模板为准，技能只管「怎么写」。

改完在自己的 Claude Code 里装个本地版本，走一遍真实需求验证，再提 PR。改动尽量小而聚焦，附上改了什么、为什么。

## 许可

[MIT](LICENSE)。
