<div align="center">

# rivo

**流程是对角色的编排，不是对任务的编排**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/reflux-studio/rivo/pulls)
![Host Agnostic](https://img.shields.io/badge/host-agnostic-blue.svg)

</div>

---

## 这是什么

rivo 是一个**无状态的 AI 交付流程编排器**：一个 CLI，加一组按角色划分的技能包。

一次交付要经过哪些角色、什么时候轮到谁、多少人同意才算过——这些是数据（`flow.yaml`），不是某个 Agent 现场判断出来的。CLI 只做记账：谁在什么时候表了什么态，条件满不满足，该不该往下走。它不懂产品、不懂代码、不懂平台，也不需要懂。

## 为什么不是"五个 Agent 演人类岗位"

装哪些角色包 = 你实际持有哪些决定权。

公司里 PRD 已经有真的产品经理在写，那就只装 `rivo-engineer`——工程师消化外部 PRD、出方案、实现、交付，全程不需要 rivo 认识"产品"这个角色。如果你团队确实没有专职设计师，也不必为了凑齐一整套角色包去装一个用不上的包。

反过来，只装 `rivo` 本身也能跑完整流程——flow 的节点里 `assignees` 写你自己起的名字，在 `settings.json` 的 `agents` 里把这个名字配一个 `ref`，指向你在某个平台建的 Agent 即可，rivo 不关心那个 Agent 是用什么角色包提示词跑出来的。

## 核心模型

### 节点 = 轮到谁工作

一个节点代表"轮到这个角色开始工作了"。它内部要走几步、用什么方法，是这个角色自己的事，流程上的其他人不需要感知。产品在自己的节点里可能先做调研、再定方案；工程师在自己的节点里可能走完方案设计、编码、自审——对外都只是一个节点。

由此得到防止流程发胖的硬规则：

> **节点边界 = 交接点。不发生交接，就不切节点。**

切一个新节点只有三种理由：

1. **换角色了**
2. **需要别人表态**（评审节点，assignees 是另一组人）
3. **需要停下来等人**（assignee 是人类，没有绑定平台标识）

一个技术方案如果不需要拉产品和设计评审，它就该待在"实现"这个节点内部，不该独立成 `system-design` 节点。只有当真的要拉别人评审时，拆出来才值得。

### 推进不是命令，是条件满足的后果

```
节点 = assignees[] + 一个通过条件（approve: all | any | <N>）

每个 assignee 在节点上只有两个动作：approve | reject

全部 assignee 表态齐了 →
  达到通过条件 → CLI 写一条 transition，进入下一节点
  没达到       → CLI 写一条 transition，打回上一个（或 reject 指定的）节点
```

没有人有权限"推进流程"这件事本身——"谁能推进"这个问题不存在，只有"条件是否满足"。也没有 `push` 命令。

作者节点和评审节点是同一个模型：单人节点的 `approve` 就是 `approve: all` 的退化情形，不需要两套动词。作者节点上的 `reject` 天然表达"我做不下去了，该退回上游"。

多人节点必须等**全部** assignee 都表态才判定，不会因为已经有人 reject 就提前打回——这是为了不让已经在跑的另一位 assignee 白跑，也让作者一次拿到全部意见，不用改两次方案。

## 四个包，零依赖

```
rivo            using-rivo 技能（CLI 在 cli/，不打包进插件）
rivo-product    意图层：product-principles / writing-requirements / running-uat / writing-competitive-brief / updating-roadmap / longtermism
rivo-designer   体验层：design-principles / writing-ui-design / longtermism
rivo-engineer   机制层：engineering-principles / aligning-on-requirement / setting-direction / writing-system-design / agile-development / test-driven-development / systematic-debugging / shipping / assessing-tech-debt / longtermism
```

每个包各带一份 `longtermism`——建立、遵循、维护一份跨交付的长期认知（`.rivo/PRODUCT.md` / `DESIGN.md` / `ENGINEERING.md`，随装了哪个包出现），和一份 `*-principles`——这套技能共同遵循的判断与边界，其他技能在开头点名引用它。

**三个包互不引用，技能正文里不出现别的角色名。** 单装一个包的人没有 multi-agent 的概念："requirement 由 Product 持有"这种话他读不懂，AI 也理解不了——对它而言它孑然一身。同一件事要写成两种场景下都成立的说法："拍板权在提出需求的人手里，可能是产品经理，可能是你的搭档，也可能是戴着另一顶帽子的你自己"。"上游""下游"同理，它们假设了一条有上下游的流水线。

编排是 `rivo` 主包（CLI + `using-rivo`）的事，技能包不承担。

**零依赖不是一句口号，是三条可验证的事实：**

- 公司电脑只装 `rivo-engineer`，不装 `rivo`，能完整工作——消化外部 PRD、写方案、实现、交付，角色包本身不依赖 CLI。
- 只装 `rivo`，`assignees` 里写自己起的名字、在 `settings.json` 里给它配一个 `ref` 指向自己在某平台建的 Agent，能完整跑通一次流程——CLI 不内置任何角色定义或现成流程。
- 名字是什么由你定，rivo 不校验、也不需要知道你装了哪些角色包。

`rivo` 本身不内置任何现成流程，`rivo flow new` 生成的是一份带注释的空骨架——真实流程会引用 `product` / `engineer` 这些名字，内置一份就等于让 CLI 依赖角色包了。示例见下文。

## 五分钟跑通

装 CLI：

```bash
npm i -g rivo-cli
```

命令名是 `rivo`，需要 Node 22+。想从源码跑：`cd cli && npm install && npx tsup && npm link`。

装角色包（在 Claude Code 里）：

```
/plugin marketplace add <这个仓库>
/plugin install rivo-engineer
```

跑一次交付：

```bash
cd your-project

rivo flow new product-feature                # 生成带注释的骨架，自己编辑
rivo doctor                                  # 校验 flow / scripts 变量

rivo issue new fix-login --flow product-feature
rivo issue approve fix-login --as product --reason "方案完成，requirement.md 在 issue_dir 里"
```

**没有初始化命令。** `.rivo/` 不存在时，`rivo flow new` 和 `rivo issue new` 会在当前目录就地建——唯一被拒绝的地方是用户主目录，那里是 user 层配置的位置，交付日志必须待在仓库里。

被唤起去某个节点工作时，标准动作是：

```bash
rivo issue show <slug> --json      # 看当前节点、节点说明、产物目录
rivo flow show <flow> --node <id>  # 看这个节点具体要做什么
# 干活，产出写进 issue_dir
rivo issue approve <slug> --as <角色名> --reason "..."   # 或 reject
```

身份是自报的（`--as`，或环境变量 `RIVO_AGENT`），类似 `git commit --author`——rivo 不做鉴权，**人类终审是唯一的信任机制**，不是机器门禁。`--reason` 在 approve / reject 上是强制的：同意和反对一样需要理由。

流程走完最后一个节点后不会自动结束，收尾是显式动作：

```bash
rivo issue close <slug> --reason "已发布" [--as <角色名>]
```

## 一个真实的 flow.yaml

```yaml
# .rivo/flows/product-feature.yaml
mode: manual                 # manual | auto，流程级
description: |
  产品功能的标准交付。产品方案先定，体验和技术依次展开。

nodes:
  - id: product-plan
    assignees: [product]
    instruction: |
      产出产品方案。自审通过、并得到用户明确许可后再 approve。

  - id: plan-review
    assignees: [designer, engineer]
    approve: all              # all | any | <N>，默认 all
    instruction: |
      从你的辖区评审产品方案，只提影响你辖区的问题。

  - id: ui-design
    assignees: [designer]

  - id: implement
    assignees: [engineer]
```

顺序即数组顺序，没有 `next` 字段——流程是线性的。`reject` 不带 `--to` 时默认打回上一个节点。

## log.jsonl 长什么样

`.rivo/issues/<slug>/log.jsonl` 是一次交付的全部状态，append-only，进 git：

```jsonl
{"t":"transition","ts":"2026-08-29T10:00:00Z","node":"product-plan","flow":"product-feature"}
{"t":"approve","ts":"...","node":"product-plan","by":"product","reason":"方案完成，requirement.md 已写好"}
{"t":"transition","ts":"...","node":"plan-review","cause":"approve"}
{"t":"approve","ts":"...","node":"plan-review","by":"designer","reason":"与体验无关"}
{"t":"reject","ts":"...","node":"plan-review","by":"engineer","reason":"迁移成本被低估","to":"product-plan"}
{"t":"transition","ts":"...","node":"product-plan","cause":"reject"}
```

`transition` 由 CLI 写，不是折叠 log 时算出来的——`flow.yaml` 会改，如果流转靠"用今天的 flow 重放历史 log"推导，改一次流程，过去交付走过的路径就跟着变了。`rivo issue show` 给的是折叠后的结论（当前节点、待表态的人），`rivo issue log` 给的是这份原始记录，排查"为什么停在这里"时看它。

**这是 rivo 存在的理由**：交付过程是仓库里的文本，可 diff、可在 PR 里 review、跟着分支走，不是宿主平台里查不到历史的一段状态。

## 平台接入

`settings.json` 里的 `scripts` 形态对齐 `package.json` 的 `scripts`——key 是事件，value 是一条命令模板：

```json
{
  "scripts": {
    "transition": "<你的平台 CLI> <指派命令> {issue_slug} {agent_ref}",
    "reject":     "{workspace_dir}/.rivo/on-reject.sh {issue_slug} {agent_ref} {reason}",
    "recall":     "...",
    "close":      "..."
  }
}
```

可用变量只有这些，**表里没有一个平台概念**：

```
{issue_slug} {node} {agent} {agent_ref} {reason} {flow} {log_path} {issue_dir} {workspace_dir}
```

具体命令怎么写取决于你接的平台——去读那个平台自己 CLI 的 `--help` 或文档，找到"把任务指派给某个 agent"对应的命令，填进模板。rivo 不认识任何平台，变量表能不能覆盖你的场景由 `rivo doctor` 校验（拼错的变量名会被当场抓出）。模板按空格切成参数，**不经过 shell 执行**——不能写管道、`&&`、重定向，复杂逻辑就调一个脚本文件。

配置和流程定义都有两层，按名字查找、项目覆盖 user，和 git config 是同一个模式：

```
~/.rivo/settings.json              agents 与 scripts，手写
~/.rivo/flows/                     个人流程模板，跨项目复用

<repo>/.rivo/settings.local.json   项目覆盖，自动 gitignore
<repo>/.rivo/flows/                团队流程约定，flow new 默认写这里，进 git
<repo>/.rivo/issues/               交付日志与产物，进 git
```

写操作用 `--scope user|project` 选层，读操作不用管——项目里没有就回退到 user。两层的默认值不同，因为两类东西的自然作用域不同：`scripts` 模板取决于你用哪个平台的 CLI，一台机器上对所有项目都一样；流程定义是团队约定，要跟着代码进 git 一起演进。

## 明确不做的事

**不做鉴权。** `--as` 是自报家门，rivo 分辨不出调用者是不是真人。这里本来就没有信任边界要护——人类终审才是，机器门禁只是重复设防。

**不做节点级 human gate 字段。** CLI 无鉴权，读出这样一个字段也无法执行，只会是装饰。`mode: auto` 是给 Agent 读的数据（"自审通过后可以自主 approve，无需再征询用户"），不是 CLI 执行的门禁。

**不用数据库存状态。** 二进制文件会立刻干掉 rivo 存在的理由——`git diff` 看不出流程怎么走的，PR 里没法 review 一次打回。它唯一的优势（并发写）被 append-only 的 JSONL 用更简单的方式解决了。

**不引流程引擎库。** rivo 的"引擎"是一次线性折叠加一个阈值判断，不是状态机问题——流程是线性节点链，没有嵌套子流程、没有并行分支要各自独立推进。真出现这些需求再回头考虑。

**不建 adaptor 抽象层。** 平台差异拆开后只剩两处：状态存哪（答案：都在仓库里，不存平台）、命令怎么送达（答案：命令模板）。新平台支持是写一组模板，不是写代码。

**`recall` 不允许向前跳。** 向前跳等于跳过节点，目前没有用例；收窄是破坏性变更，放宽随时可以做。

**`rivo` 不内置任何现成流程。** 内置一份就等于让 CLI 依赖某个角色包的角色名。

## 仓库结构

```text
rivo/
├── .claude-plugin/          # marketplace.json，插件市场清单
├── cli/                     # CLI 实现（TypeScript，npx tsup 构建）
├── plugins/
│   ├── rivo/                # using-rivo 技能（跑流程、配置）
│   ├── rivo-product/        # 意图层角色包
│   ├── rivo-designer/       # 体验层角色包
│   └── rivo-engineer/       # 机制层角色包
└── docs/                    # 设计文档
```

三个包结构一致，只有 `skills/`，没有 `agent.md`。技能是唯一可移植的单元：装了包就能直接在会话里调用，不需要 harness 支持 agent 定义，也不需要先建立"角色"的概念——大多数人只装其中一个，直接起会话用。

每个技能各自带 `references/` 存放按需加载的模板。

## License

[MIT](LICENSE) © Reflux Studio
