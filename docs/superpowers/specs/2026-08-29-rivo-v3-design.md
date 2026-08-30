# rivo v3 设计:角色编排的交付流程

状态:设计定稿,待实现
日期:2026-08-29

---

## 1. 为什么重构

v2.2 把交付建模成"一张有决定权、依赖和证据门禁的产物图",由 Team Lead 判断入口并全程编排。实际使用暴露四个问题:

**1.1 角色包耦合了编排。** 仓库是单体,入口只有 Team Lead,`coordinating` 假设自己要调度全部五层。想只用其中一个角色,没有支持路径。

**1.2 决定权归属与执行者错配。** 在公司里,PRD 和设计稿由真实的 PM、设计师持有。v2.2 仍要求 Product Agent"评审现有 PRD 并转成 rivo 结构"——产出的不是产物,是一份**没有归属、没有下游消费者的影子副本**。README 里明明写着"rivo 不夺走所有权,也不复制一份内部版本",但默认路径就是违反它。

**1.3 由模型编排,不确定且没必要。** Team Lead 判断入口既不准,也没意义——提需求的人本来就知道这是什么类型的需求。

**1.4 人类可以全程不在场。** 放行链路是"作者回应 → 提出者复核 → 无待处理发现 → 放行"。评审意见被 AI 静默采纳,方案在用户不知情的情况下漂移,最后验收的是一个自己没参与过演化的东西。

### 三个转向

| 从 | 到 |
| --- | --- |
| 装全套角色,按需闲置 | **装哪些角色 = 你实际持有哪些决定权** |
| 编排是模型的判断(Team Lead) | **编排是数据的查表**(流程定义 + CLI) |
| 人类只在最终验收出现 | **人类回到终审位置**,是唯一的信任机制 |

---

## 2. 核心模型

### 2.1 流程是对角色的编排,不是对任务的编排

一个节点代表**"轮到这个角色开始工作了"**。它内部用什么技能、走几步,是这个角色自己的事,流程上的其他角色不需要感知。

Product 在自己的节点里可能先做竞品调研、再更新路线图、最后产出方案;Engineer 在自己的节点里可能走完整的方案设计、编码、自审。对外都只是一个节点。

由此得到防止流程发胖的硬规则:

> **节点边界 = 交接点。不发生交接,就不切节点。**

切一个新节点只有三种理由:

1. **换角色了**(Product → Designer)
2. **需要别人表态**(评审节点,assignees 是另一组人)
3. **需要停下来等人**(assignee 是人类,没有绑定平台标识)

反例与正例:

```
  ✗ 任务视角(6 个节点)
    product-plan → plan-review → ui-design → system-design → implement → uat

  ✓ 角色视角:如果技术方案不拉产品和设计师评审
    product-plan → plan-review → ui-design → implement → uat
                                              ↑ 方案设计、编码、自审都在这个节点内部
```

只有当技术方案**真的要拉别人评审**时,`system-design` 才值得成为独立节点。

这条原则也解释了为什么"只装 `rivo-engineer`"成立:Engineer 在自己节点内部走完整的方案-实现链路,与 Product 在自己节点内部走调研-方案链路,是同一个形状。

### 2.2 节点语义是统一的

```
  节点 = assignees[] + 一个通过条件

  每个 assignee 在节点上只有两个动作:  approve  |  reject

  条件满足       → CLI 自动流转到下一节点
  条件不可能满足 → CLI 自动打回
```

**"推进"不是任何人的动作,是条件被满足的后果。** 于是"谁有权推进"这个问题不存在。

作者节点与评审节点**同构**:"产品方案设计"的 assignees 是 `[product]`,"产品方案评审"的 assignees 是 `[designer, engineer]`,底层模型完全一样。不为单人节点和多人节点设计两套动词。

作者节点上的 `reject` 天然表达"我做不下去了,该退回上游"——正是 Engineer 开发到一半发现需求自相矛盾的场景,不需要第二套语义。

### 2.3 通过条件只需要一个字段

```yaml
approve: all      # all | any | <N>,默认 all
```

打回条件不单独配置——**全部 assignee 表态后,达不到阈值就是打回**:

| 期望语义 | 配置 | 全部表态后的判定 |
| --- | --- | --- |
| 任一 approve 即通过 | `approve: any` | 至少 1 个 approve → 通过,否则打回 |
| 全部 approve 才通过 | `approve: all` | 全部 approve → 通过,否则打回 |
| 3 人过 2 | `approve: 2` | ≥2 个 approve → 通过,否则打回 |

单字段的两个好处:不会出现"两个独立条件都没满足"的悬空态;单人节点就是 `approve: all` 的退化情形,不需要特殊处理。

### 2.4 无鉴权,但有身份

这两件事必须分开:

- **鉴权**:验证你是不是你说的那个人 → rivo **不做**
- **身份**:你说你是谁 → **一个 flag**

```bash
rivo issue approve fix-login --as engineer --reason "..."
```

自报家门,类似 `git commit --author`。可以从 `RIVO_AGENT` 环境变量兜底。

Agent 可以撒谎,但这里本来就没有信任边界——**人类终审是唯一的信任机制**。CLI 依然完全无状态:身份随每次调用传入,不存 session、不存 token。

### 2.5 并行表态一次性回传

多人节点**必须等全部 assignee 都显式表态**后才判定流转,**不短路**——即使第一个人就 reject 且已注定打回,也要等其余的人跑完。两个理由:

1. 短路会让其他 assignee 已经启动的运行白跑
2. 作者一次拿到全部意见,只推理一轮;分两次收到反馈会改两次,第二次还可能推翻第一次

这是有意用一点等待换掉重复推理,不是实现疏漏。

---

## 3. 包结构

### 3.1 四个包,互不依赖

```
  rivo                using-rivo/            主文件:跑流程
                        references/setup.md  配置:agent add / flow new / doctor

  rivo-product        agent.md
                      writing-requirements/  + 4 references
                      running-uat/
                      writing-competitive-brief/
                      updating-roadmap/
                      longtermism/

  rivo-designer       agent.md
                      writing-ui-design/     + 3 references
                      longtermism/

  rivo-engineer       agent.md
                      writing-system-design/ + 3 references
                      implementing/
                      test-driven-development/
                      systematic-debugging/
                      shipping/
                      assessing-tech-debt/
                      longtermism/
```

**零依赖是硬约束。** 三条验证:

- 公司电脑只装 `rivo-engineer`,不装 `rivo`,能完整工作(消化外部 PRD、写方案、交付)
- 只装 `rivo`,flow 节点的 `assignees` 写自己起的名字,`rivo agent add <name> --ref <id>` 把这个名字绑定到自己建的平台 Agent,能完整跑流程
- setup 不需要知道装了哪些角色包——`rivo agent add` 接受任意 agent

`rivo` **不内置任何现成流程**。`rivo flow new <name>` 生成带注释的空骨架;真实流程会引用 `product` / `engineer` 这些名字,内置它就等于 core 依赖角色包。示例流程放 README。

### 3.2 一个名字贯穿

```
  插件名 rivo-engineer  →  agent.md 的 name: engineer
                        →  flow.yaml 节点的 assignees: [engineer]
                        →  平台上创建的 Agent 名 engineer
                        →  settings.json 的 agents.engineer
```

中间没有映射表。用自己的 Agent 时同理。

### 3.3 二进制不进插件

Node 实现,走 npm/npx。插件里只有技能,第一步检查 `rivo --version`,没装就引导安装。

理由:插件是 git 仓库 + markdown,塞四平台二进制会让体积失控,安装不管执行权限位,macOS 还有 codesign 一关,插件版本和二进制版本容易对不上。

### 3.4 技能命名规则

- **做事的技能** → 动名词:`writing-requirements`、`implementing`、`shipping`、`using-rivo`
- **方法论的技能** → 名词/形容词:`test-driven-development`、`systematic-debugging`、`longtermism`

### 3.5 `longtermism`:一体三面

三份长期认知(`PRODUCT.md` / `DESIGN.md` / `ENGINEERING.md`)不再是散落的文件,而是一个技能定义的三个动作:

- **建立**:首次调研(吸收原 `surveying-product` / `surveying-design` / `surveying-codebase`)
- **遵循**:动手前先读;产物必须与认知一致;冲突时以事实为准,并回写认知,而不是绕开它
- **维护**:调研后、**交付被打回后**、用户纠正后写入

"打回后"这一条是白捡的:打回原因就躺在 `log.jsonl` 里,那就是"这次为什么错了"的一手记录。**这是让 rivo 交付进化的机制,不需要额外攒数据**,老 rivo 的 `organizing-retro` 和 `retro.md` 因此都不需要了。

每个角色包各带一份 `longtermism`,内容随领域不同。共享技能层不存在。

三份认知固定在 `.rivo/PRODUCT.md` / `DESIGN.md` / `ENGINEERING.md`。**这不构成对 core 的依赖**——`.rivo/` 只是普通目录,没装 CLI 也能写。

---

## 4. CLI

### 4.1 只做五件事

```
  建目录        issue new
  追加事件      approve / reject / recall / close
  折叠状态      show（读 log,不落盘）
  校验          flow schema · agent 引用 · 事件链条连续性
  跑 script     模板切 argv → execFile,不经 shell
```

没有第六件。它不判断内容对错,不知道人在不在,不认识任何平台。

### 4.2 校验的边界

> **CLI 只校验"这个操作在结构上说得通吗",不校验"这个操作是不是好主意"。**

| 类别 | 例子 | CLI 管吗 |
| --- | --- | --- |
| 结构 | 目标节点存在吗、flow schema 合法吗、事件链条连续吗 | ✅ |
| 判断 | 评审意见处理完了吗、现在该不该推进、方案够好吗 | ❌ |

反例:"有人 reject 了就不许 approve" —— 作者完全可能看了 reject、和评审者聊完、达成一致再推进。CLI 凭什么拦。

### 4.3 命令面

```bash
# 交付
rivo issue new     <slug> --flow <name>
rivo issue show    <slug> [--json]
rivo issue approve <slug> --as <agent> --reason "..."
rivo issue reject  <slug> --as <agent> --reason "..." [--to <node>]
rivo issue recall  <slug> --as <who>   --reason "..." --to <node>
rivo issue log     <slug>
rivo issue close   <slug> [--reason "..."]

# 流程定义
rivo flow show <name> [--node <node>] [--json]
rivo flow new  <name>
rivo flow list

# 参与者
rivo agent add <name> [--ref <id>]
rivo agent list
rivo agent remove <name>

# 检查
rivo doctor
```

**没有 `push`。** 流转是条件满足的后果,不是命令。

**没有 `note`。** log 是流转记录,不是聊天记录;要记录内容就写进产物文件。`--reason` 在 `approve` / `reject` 上强制,这顺手把老 rivo 里"同意和反对一样需要理由"这句规矩变成了机制。

**没有 `next` 字段。** `show` 不推断调用者身份、不告诉 Agent 该做什么——CLI 无鉴权,它不知道"你"是谁;而且该 Agent 做事时它自然会被 script 唤起,唤起本身就是指令。

### 4.4 `recall`:显式的越权操作

填的空洞是:**非当前节点 assignee 的人想把流程拉回去**。产品或用户喊停时他们不是 `implement` 节点的 assignee,没有这个命令就只能冒充 Engineer 去 reject,log 里会留下假记录。

不能合并进 `reject`,因为语义不同:

- `reject` 是**在当前节点投的一票**,参与阈值计算
- `recall` **无条件、立即扭转**,不参与任何计数

合并会让阈值逻辑长出"如果投票人不是 assignee 则跳过计数"的分支——特例又回来了。

**只允许往回,不允许往前跳。** 向前跳 = 跳过节点,目前没有用例。放宽不是破坏性变更,收窄才是。

log 里 `recall` 事件一眼看得出这不是正常打回,是人工干预。**危险的东西要显眼,不能伪装成常规操作。**

### 4.5 输出约定

所有命令默认人类可读文本,`--json` 开关切结构化。一致性优先于省一个 flag。

### 4.6 `doctor` 检查清单

- 每份 `flow.yaml` 通过 schema
- flow 引用的 agent 都在 settings 中已声明(**声明即可,不要求已绑定 `ref`**)
- 节点图连通,`reject` / `recall` 的目标节点存在
- `scripts` 模板里的变量都在变量表内(拼错的 `{agnet_ref}` 当场抓出)
- 每个进行中 issue 的 log 链条连续
- settings 合并后 `agents` 非空

**校验函数写在"解析 flow + 折叠 log"这一层,`approve` / `reject` / `recall` 和 `doctor` 都调它。** 不能只有 doctor 有——漏跑的人会在流程中间炸,而那时 log 已经写了几行。

---

## 5. 数据格式

### 5.1 `flow.yaml`

```yaml
# .rivo/flows/product-feature.yaml     文件名即流程名
mode: manual                 # manual | auto,流程级
description: |
  产品功能的标准交付。产品方案先定,体验和技术依次展开,
  有用户可感知结果时走 UAT。

nodes:
  - id: product-plan
    assignees: [product]
    instruction: |
      产出产品方案。输入是用户的原始诉求和 PRODUCT.md。
      自审通过、并得到用户明确许可后再 approve。

  - id: plan-review
    assignees: [designer, engineer]
    approve: all             # all | any | <N>,默认 all
    instruction: |
      从你的辖区评审产品方案。只提影响你辖区的问题。
      与你辖区无关时 approve 并在 reason 里说明。

  - id: ui-design
    assignees: [designer]
  - id: implement
    assignees: [engineer]
  - id: uat
    assignees: [product]
```

**顺序即数组顺序**,不需要 `next` 字段——流程是线性的(见 §8 关于不做嵌套子流程的决定)。`reject --to` 默认上一个节点。

`instruction` 是被唤起的 Agent 拿到的简报,`rivo flow show --node X` 直接打印。**内联而不是旁边开 md,是为了逼它短**:三五行说清"产出什么、输入在哪、什么时候可以 approve"。要写长就在里面贴链接。

`mode: auto` 由 `rivo issue show` 返回给 Agent,`using-rivo` 里规定 auto 模式允许跳过征询用户许可。**它是给 Agent 读的数据,不是 CLI 执行的门禁**——CLI 始终不判断人在不在(见 §8)。

### 5.2 `log.jsonl`

```jsonl
{"t":"transition","ts":"2026-08-29T10:00:00Z","node":"product-plan","flow":"product-feature"}
{"t":"approve","ts":"...","node":"product-plan","by":"product","reason":"方案完成,PRD 在 ./requirement.md"}
{"t":"transition","ts":"...","node":"plan-review","cause":"approve"}
{"t":"approve","ts":"...","node":"plan-review","by":"designer","reason":"与体验无关"}
{"t":"reject","ts":"...","node":"plan-review","by":"engineer","reason":"迁移成本被低估","to":"product-plan"}
{"t":"transition","ts":"...","node":"product-plan","cause":"reject"}
{"t":"recall","ts":"...","from":"implement","to":"product-plan","by":"human","reason":"需求变更"}
{"t":"close","ts":"...","by":"human","reason":"已发布"}
```

事件类型五个:`transition`(CLI 写)· `approve` · `reject` · `recall` · `close`。

**为什么 `transition` 由 CLI 落盘,而不是折叠时算出来:**

`flow.yaml` 会随时间改。如果流转只靠"用今天的 flow 重放旧 log"推出来,**改一次流程,历史交付的路径就变了**——对一个存在 git 里、要跨时间回溯的东西是致命的。CLI 每次判定条件达成就落一条 `transition`,log 因此自包含。

它还提供了或签/会签必需的东西:**一个明确的状态扭转时刻**。approve/reject 是执行信号,transition 是流转结果,两者不能混为一谈。

**折叠因此退化成一次线性扫描:**

```
  当前节点   = 最后一条 transition 的 node
  当前表态   = 最后一条 transition 之后的 approve / reject
  走过的路径 = 所有 transition 连起来
```

**判定逻辑:**

```js
// 当前节点之外的表态 = 陈旧事件（并发写入的第二条）
if (event.node !== currentNode) → 标记 stale,不计入,show 里报警

// 每次 approve/reject 后评估
const { approved, rejected, total } = tally(currentNode)   // total = assignees.length

if (approved + rejected < total)   → waiting               // 必须等齐,见 §2.5
else if (approved >= threshold)    → transition(next)
else                               → transition(rejectTarget)
```

**先等齐再比阈值**,不做"已不可能达成就提前打回"的短路——那正是 §2.5 要避免的白跑。

`rejectTarget` = 所有 reject 事件里 `to` 最上游的那个;都没给 `to` 时取上一个节点。取最上游是保守选择:多个 reviewer 认为要退回不同深度时,退到最深的那个才能让所有意见都被处理。

**并发安全:** append-only,每次只追加一行,没有读改写。多个 assignee 同时表态天然无竞争。两个调用者同时触发流转时会写出两条事件,第二条的 `node` 对不上当前节点,折叠时被标为 stale 并在 `show` 里报警——比加锁简单,而且不会静默丢事件。

### 5.3 `settings.json`:配置不进仓库

配置是**机器局部**的:公司电脑和私人电脑接的不是同一个工作区,agent id 也不一样。它不该躺在项目目录里等着被误提交,所以主位置在用户目录:

```
  ~/.rivo/settings.json                默认位置,agent add / setup 默认写这里
  <repo>/.rivo/settings.local.json     可选的项目覆盖,gitignore
```

**加载 = 两份浅合并,项目覆盖全局**(`agents` 与 `scripts` 各自合并),和 git config、`.npmrc`、VS Code settings 是同一个模式,不需要额外解释。加载逻辑本身只有几行。

`~/.rivo/settings.json` 长这样(`readSettingsFile` 走 `JSON.parse`,**不支持注释**):

```json
{
  "agents": {
    "product":  { "ref": "a1b2…" },
    "designer": { "ref": "c3d4…" },
    "engineer": { "ref": "e5f6…" },
    "qa":       {}
  },
  "scripts": {
    "transition": "multica issue assign {issue_slug} --to-id {agent_ref}",
    "reject":     "{workspace_dir}/.rivo/on-reject.sh {issue_slug} {agent_ref} {reason}",
    "recall":     "multica issue assign {issue_slug} --to-id {agent_ref}",
    "close":      "multica issue status {issue_slug} done"
  }
}
```

`qa` 已声明但没绑 `ref` → 这个节点由人承担。

**为什么默认全局而不是每项目一份:** 两类配置的自然作用域不同——`scripts` 模板取决于你用哪个平台的 CLI,同一台机器上对所有项目都一样;`agents` 的 `ref` 是工作区级的,多数人只有一个工作区。所以绝大多数情况下**只需要那一个全局文件**。

`rivo agent add` 默认写全局,`--local` 才写项目文件。项目文件只在这个项目确实要偏离时才出现(接了另一个工作区、临时换平台),不是每个项目都要建的样板。

`.local.json` 这个后缀让"不进 git"一眼可见,不靠记忆。项目文件出现时,`rivo` 顺手写 `.gitignore`。

`agents` 里没有 `platform` 字段——**rivo 代码中不存在任何平台枚举**,`ref` 是不透明标识,rivo 只传递不解释。

### 5.4 什么进 git

| 路径 | 进 git | 理由 |
| --- | --- | --- |
| `.rivo/flows/*.yaml` | ✅ | 流程定义是团队约定,跟着代码演进 |
| `.rivo/issues/<slug>/log.jsonl` | ✅ | **这是 rivo 存在的理由**:交付过程是代码的一部分,可 diff、可 review、可回溯 |
| `.rivo/issues/<slug>/*.md` | ✅ | 产物同上 |
| `.rivo/PRODUCT.md` `DESIGN.md` `ENGINEERING.md` | ✅ | 跟着装了哪个角色包走,没装就没有 |
| `.rivo/settings.local.json` | ❌ | 机器局部;主位置在 `~/.rivo/settings.json`,根本不在仓库里 |

**产物落点:core 管目录,角色管文件名。** `rivo issue new` 建 `.rivo/issues/<slug>/` 并由 `show` 返回 `issue_dir`;`using-rivo` 只说"产出写进 issue_dir",不规定文件名;角色技能说自己产出什么;flow 的 `instruction` 想钉死文件名也可以。

---

## 6. 平台接入

### 6.1 `scripts`:形态对齐 `package.json`

key 是事件,value 是命令,rivo 不解释内容。事件面只有四个:`transition`(唤起新节点的 assignees)、`reject`(通知被打回方)、`recall`、`close`。

script 不必是"唤起 Agent":发飞书、打 webhook、触发 CI、`echo` 什么都不做,rivo 一概不关心。

### 6.2 模板切 argv,不经 shell

```js
// ✗ 命令注入:reason 是 Agent 写的自由文本
exec(`multica issue comment add ${issue} --content "${reason}"`)

// ✓ 变量永远是独立 argv,不进 shell
execFile("multica", ["issue", "comment", "add", issue, "--content", reason])
```

模板写成字符串(可读、像 npm scripts),执行时按空格切分,变量**整体替换成一个 argv 元素**。`{reason}` 里有空格、反引号、`$()` 都无所谓。

代价:模板里不能写管道、`&&`、重定向。这是好事,复杂逻辑就调脚本文件,和 npm scripts 的实践一致。

### 6.3 变量表

```
  {issue_slug}  {node}  {agent}  {agent_ref}  {reason}  {flow}
  {log_path}  {issue_dir}  {workspace_dir}
```

**表里没有一个平台概念**,这条可以被 `doctor` 机器校验。

### 6.4 主仓库完全平台无关

| 层 | 平台知识 |
| --- | --- |
| CLI | **零**。测试不需要任何平台 |
| `using-rivo` 主文件 | **零**。只讲流程语义 |
| settings | 有,但在用户目录,根本不进仓库 |

**rivo 仓库里不出现任何平台名。** 不做 `references/<platform>.md`——那种文件 90% 是"怎么在某平台建 Agent",属于那个平台自己的文档;在 rivo 里养一份必然失同步,而且没人会发现。

rivo 唯一需要规定的是 §6.3 那张变量表和"script 是一条命令模板"这个契约。具体命令怎么写,setup 时问 AI——它能读那个平台的 `--help` 和文档,不需要 rivo 教。

### 6.5 setup 是技能,不是命令

确定性能力在子命令里(`rivo agent add` / `flow new` / `doctor`),对话在技能里(`using-rivo/references/setup.md`)。

不做交互式 CLI 向导:那要写问答顺序、回退、状态机、校验提示,一堆代码,教学效果还不如对话。手动路径也没丢——可以绕过技能直接调子命令。

`setup` 与 `using-rivo` 合并成一个技能:会有一类问题掉在两者中间(比如"流程卡住了,doctor 说 agent 未声明"既是使用问题也是配置问题),分家就会漏。按频率分层:主文件放跑流程(高频),配置放 `references/`(低频)。

---

## 7. 角色包内容与迁移

### 7.1 `collaborating` 的去向

它是被吸收了,不是被删了:

| 原第 N 节 | 去向 |
| --- | --- |
| 1 总则 | 一半进 `agent.md`;产物 ID / 后端配置那部分**真删** |
| 2 决定权 | "你持有什么"进 `agent.md`,"谁在哪个节点"进 `flow.yaml` |
| 3 协作姿态(兜底 / 底线 / 不越权代改) | **进 `agent.md`**——真正的行为规约,机制替代不了 |
| 4 工作如何进入产物图 | **真删**。入口 = 你选了哪个 flow |
| 5 放行:双查 | **真删**。变成 flow 里节点的形状 |
| 6 发现与共识 | 大部分删;"同意和反对一样需要理由"变成 `--reason` 强制 |
| 7 响应上游变更 | **真删**。变成 `reject` / `recall` + 重放下游 |
| 8 产物发布约定 | 目录约定进 `using-rivo`,文件名交给角色技能 |
| 9 自由协作 | **真删**。不装 `rivo` 就是自由协作 |
| 10 任何阶段发现的问题 | 并进 `systematic-debugging` |

十节里五节真删,原因一致:**它们描述的是"人要记住的规矩",而这些规矩现在要么变成了 flow 的结构,要么变成了 CLI 的行为。**

同样的模式贯穿整个重构——**规矩变成结构**:

- "未触达的层不建占位文件" → 只装 `rivo-engineer` 就只有 `ENGINEERING.md`,包边界解决
- "同意和反对一样需要理由" → `--reason` 强制
- "状态可恢复" → 状态是 log 的折叠结果,不落盘就不会漂移
- "一个决定一个归属" → 节点的 assignees + 装哪些角色包

### 7.2 `agent.md` 的新形态

三重身份:插件的 agent 定义、平台上 `--instructions` 的内容、手工使用该角色时的全局规约。因此必须**完全自包含**,不能出现"遵循 `collaborating`""上报 Team Lead"这类外部引用。

```
  你是谁          领域责任和取舍倾向
  你持有什么      产物 + 那份长期认知
  你怎么工作      有哪些技能,什么时候用哪个
  协作姿态        兜底:看到问题就报,不管是不是你的辖区
                  底线:他人辖区只有提案权;损害你辖区的决定你有职责驳回
  原则            领域特有的判断标准
```

原"记忆"一节删掉,那部分归 `longtermism`。

### 7.3 迁移动作

```
  删   roles/team-lead/             7 个文件（agent + coordinating / onboarding / organizing-retro 及其 references）
  删   roles/verifier/              7 个文件（agent + verifying 及其 5 份 references）
  删   skills/collaborating/        2 个文件
  删   skills/brainstorming/        1 个（各角色按需自带口味版本）
  删   skills/frontier-questioning/ 1 个（融进 setup 和 writing-requirements）

  改名 implementing-changes → implementing
       tech-debt            → assessing-tech-debt
       competitive-brief    → writing-competitive-brief
       roadmap-update       → updating-roadmap
       surveying-*          → 各自并入 longtermism

  重写 3 个 agent.md（product / designer / engineer,去掉 collaborating 与 Team Lead 引用,补协作姿态）
  重写 README（现在描述的是即将被删的架构）

  新建 rivo 包:CLI + using-rivo
```

删除 18 个文件,新增 1 个包。

### 7.4 依赖选型

| 用途 | 依赖 |
| --- | --- |
| 解析 flow.yaml | `yaml` |
| 校验 flow + log 事件 + settings | `zod`(顺带白送 TS 类型和可读错误,`doctor` 的大半靠它) |
| CLI 参数 | `commander` 或 `citty` |
| 跑 script | `node:child_process`(`execFile`) |
| 模板替换 | 三行 `String.replace`,**不引模板引擎**——一引就会有人在模板里写条件和循环 |

---

## 8. 明确不做,以及为什么

这一节是这份 spec 最重要的部分。结论容易复述,取舍的理由才是会丢失的东西。

**不用 SQLite 存状态。** 它是二进制文件,会立刻干掉 rivo 存在的理由——`git diff` 看不见流程怎么走的、PR 里没法 review 一次打回、两个分支都推进过流程没法 merge。它唯一的优势(并发写)被 append-only JSONL 用更简单的方式解决了。

**不引流程引擎库(XState / BPMN / workflow-\*)。** rivo 的"引擎"是一次 fold 加一个聚合守卫,不是状态机问题。XState 的价值在嵌套状态、并行区域、actor 模型,而 rivo 是线性节点链;而且 XState 是内存里跑的解释器,rivo 是无状态 CLI 每次从 log 重建——要写 YAML→machine 翻译、从 log 水合、抽状态落盘,**这层适配代码比被替代的逻辑还长**。npm 上的 `workflow-*` 包大多停更三年以上,引一个死库比手写三行危险。

> 何时回头引:出现嵌套子流程、并行分支需要各自独立推进、或需要流程可视化编辑器。目前一条都没有。

**不做 TUI 流程编辑器。** 一辈子大概写五个流程模板,写完基本不动。为五次编辑做一个要跟 schema 一起演进的 TUI,投入产出极差。`rivo flow new` 生成骨架 + `doctor` 校验覆盖了它的全部价值。而且高频写 flow 的其实是 AI,它写 YAML 比操作 TUI 强。

**不做 adaptor 抽象类 / hook 接口。** 拆开后发现平台差异只有两处:状态存哪(答案:都在仓库里,不存平台)和命令怎么送达(答案:命令模板)。**新平台支持 = 写一组模板,零代码。**

**不做 findings 强门禁。** 人类已经在终审位置,机器门禁是重复设防。反过来说,将来若真开自动交付的口子,那个口子里才需要机器 gate——因为人不在场了。

**不做节点级 human gate 字段。** CLI 无鉴权,分辨不出调用者是人还是 Agent,这个字段读出来也无法执行,只能是装饰。规矩写进 `using-rivo`:"自审通过、得到用户明确许可后方可 approve"。`mode: auto` 是给 Agent 读的数据,不是 CLI 执行的门禁。

**不保留多入口产物图。** 入口由"选哪个流程"决定,这张图的信息已经内化进流程模板。它区分"决定层"与"过程记录"的认知仍有价值,沉淀成写流程模板的设计指南。

**不保留 Team Lead。** 它的编排从"模型的判断"降级成"数据的查表"后,执行体可以是任何东西。入口判断移到发起时由人选流程,更准也更省。

**不保留 Verifier。** 它承担的两件事分别有了去处:独立上下文由 subagent 自评覆盖;跑证据由 Engineer 自己和流程里的测试节点承接。更根本的是,**人类终审是唯一的信任机制**,AI 自评和交叉评审都只是"帮你先过滤掉一些显而易见的问题"。

**暂不建 `rivo-qa`。** 判断一个角色值不值得建包的标准:**它有没有一份自己的长期认知要持有**。Product / Designer / Engineer 各有一份;Verifier 的 `VERIFICATION.md` 是"可选、有特殊校准知识时才建",本来就没有真正属于自己的长期资产,所以该死。QA 如果持有"测试策略 + 回归资产 + 环境知识",它就成立,且与 Engineer 的 TDD 边界清楚(Engineer 测自己写的,QA 从需求出发测、不读实现);如果只是"帮 Engineer 再跑一遍",那就是 Verifier 换名。

> 现在的做法:用 `qa` 节点 + 人类 assignee(声明不绑 `ref`)跑一段时间,看那份长期认知会不会自然长出来。长出来了再建包,技能清单从实践里读,不靠猜。

**`recall` 不允许向前跳。** 向前跳 = 跳过节点,目前没有用例。放宽容易,收窄是破坏性变更。

**不为自审留痕。** 作者写完自己确认一遍,这属于"方案设计"节点内部的过程,不是独立环节。它的结论落在 approve 的 `reason` 或产物本身。

---

## 9. 已知边界

**rivo 无法中止运行中的 Agent 任务。** `recall` 时对方可能正在平台上跑着,rivo 只会 fire `scripts.recall`——能通知、能取消指派,杀不掉正在执行的 task。这不是缺陷,是边界:rivo 不知道平台上有"任务"这个概念。接入方在 script 里自己实现终止,不终止也不影响正确性。`using-rivo` 里要有一句提醒。

**流转判定存在 TOCTOU 窗口。** 靠折叠时的链条校验兜底,不加锁。

> `# ponytail: 真出现高频并发再上 O_EXCL 锁文件`

**流程定义变更不影响历史。** `transition` 由 CLI 落盘,log 自包含。但**正在进行中**的 issue 如果 flow 改了,下一次流转会按新 flow 计算——这是有意的(改流程就是为了立刻生效),`doctor` 会在节点 id 对不上时报错。

---

## 10. 待实现清单

1. `rivo` CLI:log 读写、折叠、校验(zod)、模板替换、`execFile`
2. `flow.yaml` / `log.jsonl` / `settings.json` 三份 zod schema
3. `using-rivo` 技能 + `references/setup.md`
4. 三个角色包的技能改名、合并、`agent.md` 重写
5. `longtermism` 技能(三份,各角色一份)
6. README 重写
7. 老 `roles/team-lead`、`roles/verifier`、`skills/` 删除
