# rivo-cli

**流程是对角色的编排，不是对任务的编排**

一个无状态的 AI 交付流程编排器。一次交付要经过哪些角色、什么时候轮到谁、多少人同意才算过——这些是数据（`flow.yaml`），不是某个 Agent 现场判断出来的。CLI 只做记账：谁在什么时候表了什么态，条件满不满足，该不该往下走。它不懂产品、不懂代码、不懂平台，也不需要懂。

状态全部落在仓库里的 `.rivo/issues/<slug>/log.jsonl`，append-only，进 git。**这是 rivo 存在的理由**：交付过程是可 diff、可在 PR 里 review、跟着分支走的文本，而不是宿主平台里查不到历史的一段状态。

完整设计、角色包和使用说明见 [github.com/reflux-studio/rivo](https://github.com/reflux-studio/rivo)。

## 安装

```bash
npm i -g rivo-cli
```

命令名是 `rivo`。需要 Node 22+。

## 用法

```bash
cd your-project

rivo flow new product-feature      # 生成带注释的骨架，自己编辑
rivo doctor                        # 校验 flow / scripts 变量

rivo issue new fix-login --flow product-feature
rivo issue approve fix-login --as product --reason "方案完成，requirement.md 在 issue_dir 里"
```

**没有初始化命令。** `.rivo/` 不存在时，`rivo flow new` 和 `rivo issue new` 会在当前目录就地建——唯一被拒绝的地方是用户主目录，那里是 user 层配置的位置，交付日志必须待在仓库里。

## 核心模型

```
节点 = assignees[] + 一个通过条件（approve: all | any | <N>）

每个 assignee 在节点上只有两个动作：approve | reject

全部 assignee 表态齐了 →
  达到通过条件 → 写一条 transition，进入下一节点
  没达到       → 写一条 transition，打回上一个（或 reject 指定的）节点
```

推进不是命令，是条件满足的后果——**没有 `push`**。「谁能推进流程」这个问题不存在，只有「条件是否满足」。

一个节点代表「轮到这个角色开始工作了」，它内部走几步是这个角色自己的事。由此得到防止流程发胖的硬规则：**节点边界 = 交接点，不发生交接就不切节点。**

多人节点必须等**全部** assignee 都表态才判定，不会因为已经有人 reject 就提前打回——这样另一位 assignee 不白跑，作者也一次拿到全部意见。

## 命令面

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
rivo flow new  <name> [--scope user|project]              # 默认 project
rivo flow list [--json]

# 检查
rivo doctor [--json]
```

身份是自报的（`--as`，或环境变量 `RIVO_AGENT`），类似 `git commit --author`。**rivo 不做鉴权**——这里没有信任边界要护，人类终审才是唯一的信任机制，机器门禁只是重复设防。

`--reason` 在 approve / reject 上是强制的：同意和反对一样需要理由。approve 的 reason 就是给下游的交接说明。

## 两层作用域

配置和流程定义都有两层，按名字查找、项目覆盖 user，和 git config 是同一个模式：

```
~/.rivo/settings.json              agents 与 scripts，手写
~/.rivo/flows/                     个人流程模板，跨项目复用

<repo>/.rivo/settings.local.json   项目覆盖，自动 gitignore
<repo>/.rivo/flows/                团队流程约定，flow new 默认写这里，进 git
<repo>/.rivo/issues/               交付日志与产物，进 git
```

写操作用 `--scope user|project` 选层，读操作不用管。两者默认层不同，因为自然作用域不同：`scripts` 取决于你用哪个平台的 CLI，一台机器上都一样；流程定义是团队约定，要进 git 跟着代码演进。

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

模板按空格切成参数，**不经过 shell 执行**——不能写管道、`&&`、重定向，复杂逻辑就调一个脚本文件。脚本是尽力而为：失败只警告，不会让已经写进 log 的流转看起来失败；有 30 秒超时，不继承 stdin。拼错的变量名由 `rivo doctor` 当场抓出。

新平台支持是写一组模板，不是写代码。

## License

[MIT](https://github.com/reflux-studio/rivo/blob/main/LICENSE) © Reflux Studio
