# Rivo

让软件交付与人的理解共同演进。

Rivo 是一组可独立使用的交付技能。AI 承担调查、设计、实现与验证；人在真实场景、重要取舍和关键机制上参与判断。模型、方案、代码与运行证据共同支持理解。

## 技能

| 技能 | 解决的问题 |
| --- | --- |
| [using-rivo](skills/using-rivo/SKILL.md) | 路由手册：按任务选择方法、控制深度、处理碰撞 |
| [collaborative-modeling](skills/collaborative-modeling/SKILL.md) | 理解业务与系统现状，通过场景对齐目标变化 |
| [architecture-decisions](skills/architecture-decisions/SKILL.md) | 比较架构选择，保留决定理由与重新考虑的条件 |
| [system-design](skills/system-design/SKILL.md) | 形成以职责、复用和行为契约为中心的技术方案 |
| [incremental-delivery](skills/incremental-delivery/SKILL.md) | 分段实施、独立审阅与碰撞处理的编排循环 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 用红、绿、重构循环建立行为反馈 |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | 从可观察的分歧定位原因，验证修复 |
| [capturing-knowledge](skills/capturing-knowledge/SKILL.md) | 更新跨交付可复用的规则、理由与反例 |

`using-rivo` 是路由手册，方法技能负责如何做好各自的工作。每个方法都可携带其 `references/` 独立使用，不要求先调用入口或采用 `.rivo`。

## 一次交付怎么发生

通常从共同建模开始，明确重要架构决定，再设计可协作的契约。随后按可验证的能力分段实施，在新发现出现时修正模型、决定或方案。已有充分依据的部分可以沿用。

```text
主线程：建模 → 架构决定 → 技术方案 → 准备当前任务
                                      ↓
新执行者：                       实施 → 测试 → 自审
                                      ↓
新独立审阅者：                    契约、质量与证据审阅
                                      ↓
主线程：                 修复复审／与用户对齐／完成任务
                                      ↓
                          下一个任务 → 独立终审 → 沉淀归档
```

新任务使用新的执行者和审阅者，由主线程显式提供方法、简报和契约。执行者不嵌套派发。模型、ADR 或方案与实现不符时，主线程必须把分歧带回用户——原预期、证据、后果和处理选择——不能只在后台改文档消掉。

## 交付材料

默认用 `.rivo/` 管理，用户指定位置或项目惯例优先。

```text
.rivo/
├── models/<domain>/     # 跨交付领域知识
├── issues/<slug>/       # 目标、决定、方案、任务简报、审阅与证据
└── archived/<slug>/     # 完结归档
```

## 调用

完整交付：

> 用 Rivo 完成这个需求。先结合已有系统和我对齐业务变化，再推进设计与实现。

独立使用：

> 用 collaborative-modeling 帮我推演这个流程，先聚焦两种角色对退回操作的不同理解。

> 用 architecture-decisions 比较这两个持久化方案，说明主要后果和建议。

> 用 incremental-delivery 组织这次实施，我已经有了方案和任务拆分。

## 安装

### Claude Code

```sh
claude plugin add /path/to/rivo
```

会话中可用 `/rivo:using-rivo` 或 `/rivo:collaborative-modeling` 等入口。

### Codex

使用 `.codex-plugin/plugin.json` 和共享 `skills/`。在新任务的技能选择器中选择入口。

### ZCode

ZCode 兼容 `.claude-plugin/plugin.json`，共享技能目录。在「设置 → 插件」中添加并安装。

## 插件结构

```text
rivo/
├── .claude-plugin/plugin.json   # Claude Code 与 ZCode
├── .codex-plugin/plugin.json    # Codex
├── skills/
│   ├── using-rivo/              # 路由手册
│   ├── collaborative-modeling/  # 方法：建模
│   ├── architecture-decisions/  # 方法：架构决策
│   ├── system-design/           # 方法：技术设计
│   ├── incremental-delivery/    # 编排：实施 + 审阅 + 碰撞
│   ├── test-driven-development/ # 方法：TDD
│   ├── systematic-debugging/    # 方法：调试
│   └── capturing-knowledge/     # 方法：知识沉淀
└── README.md
```

插件没有运行时脚本、Hooks 或 MCP 服务，调度使用宿主原生子代理能力。

## License

MIT
