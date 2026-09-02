# 配置 rivo

## 安装

```bash
npm i -g rivo-cli
```

命令名是 `rivo`，需要 Node 22+。从源码跑的话：`cd cli && npm install && npx tsup && npm link`。

## 两层作用域

配置和流程定义都有两层，按名字查找，**项目覆盖 user**：

```
  ~/.rivo/settings.json              参与者与平台接入，默认写这里
  ~/.rivo/flows/                     个人流程模板，跨项目复用

  <repo>/.rivo/settings.local.json   项目覆盖，自动 gitignore
  <repo>/.rivo/flows/                团队流程约定，进 git
  <repo>/.rivo/issues/               交付日志与产物，进 git
```

写操作用 `--scope user|project` 选层，读操作不用管——找不到就自动回退到 user。

`agents` 和 `scripts` 一般都写 user 层：`scripts` 模板取决于你用哪个平台的 CLI，同一台机器上对所有项目都一样；`ref` 也基本是一台机器一份。绝大多数情况下只需要那一个全局文件。

`flow new` 默认 `project`：流程定义是团队约定，要跟着代码进 git 一起演进。写个人模板时才加 `--scope user`。

**没有初始化命令。** `.rivo/` 不存在时，`rivo issue new` 和 `rivo flow new` 会在当前目录就地建。唯一的例外是用户主目录——那里会被拒绝，因为 `~/.rivo` 是 user 层的配置目录，交付日志必须待在仓库里。

## 把 assignee 绑到平台上

`flow.yaml` 里的 `assignees` 是你自己起的名字。想让 rivo 唤起它，就在 `settings.json` 的 `agents` 里给这个名字配一个 `ref`：

```json
{
  "agents": {
    "engineer": { "ref": "<平台上的 agent 标识>" },
    "qa": {}
  }
}
```

**rivo 不校验这张表。** 它只是回调参数的查找表：查得到 `ref` 就带着它调脚本，查不到就跳过——不管是因为这个节点本来就由人接手，还是因为名字打错了。rivo 分辨不出这两种情况，也不去猜：猜错了不是骚扰配置正确的人，就是把真错误埋进一条没人看的告警里。名字打错时，`rivo issue show` 打出来的 assignee 就是你发现它的地方。

## 配置平台接入

`settings.json` 的 `scripts` 形态和 `package.json` 的 scripts 一样，key 是事件，value 是一条命令：

```json
{
  "scripts": {
    "transition": "<平台 CLI> <指派命令> {issue_slug} {agent_ref}",
    "reject":     "...",
    "recall":     "...",
    "close":      "..."
  }
}
```

可用变量只有这些：`{issue_slug}` `{node}` `{agent}` `{agent_ref}` `{reason}` `{flow}` `{log_path}` `{issue_dir}` `{workspace_dir}`。

`{reason}` 按事件取值，多人表态时用 `; ` 拼成一条：`transition` 拿上游全部 approve 的交接说明，`reject` 拿全部打回意见，`recall` 拿 recall 的理由，`close` 拿 close 的理由。`{agent}` / `{agent_ref}` 是**被唤起的那个 assignee**，脚本按 assignee 逐个执行；只有 `close` 例外，那里没人被唤起，`{agent}` 是执行 close 的人。

脚本是尽力而为：失败只警告，不会让已经写进 log 的流转看起来失败。它不继承 stdin，并且有 30 秒超时——无人值守的 agent 场景里挂死比失败更糟。**脚本失败时没有重放机制**，告警会点名该通知谁，手工通知即可。

**具体命令怎么写取决于你的平台。** 去读那个平台 CLI 的 `--help` 或文档，找到"把一个任务指派给某个 agent"和"给某个任务留言"对应的命令，填进模板。rivo 不认识任何平台，也不该认识。

模板按空格切成参数，**不经过 shell**——不能写管道、`&&` 和重定向。需要复杂逻辑就调脚本文件：

```json
"reject": "{workspace_dir}/.rivo/on-reject.sh {issue_slug} {agent_ref} {reason}"
```

## 建流程

```bash
rivo flow new product-feature        # 在项目里生成带注释的骨架
rivo flow new product-feature --scope user
rivo doctor                          # 一次性体检，见下
```

`rivo flow list [--json]` 列出两层的全部流程，并标出每个来自哪一层；重名时只列项目那份，因为它才是实际会被用到的。`rivo flow show <name> [--node <id>] [--json]` 看流程或某个节点的细节。

`rivo doctor` 检查这些：

- `settings` 能不能解析
- `scripts` 模板里的变量是不是都在变量表内（拼错的 `{agnet_ref}`、`{agentRef}` 当场抓出）
- 两层的每份 `flow.yaml` 过不过 schema
- 每个 issue 的 log 有没有无法解析的行、有没有被忽略的陈旧事件
- 每个**在途** issue 的流程还在不在、当前节点还在不在那个流程里（改流程会立刻对在途交付生效）

它**不**做流程图的静态连通性检查。

其中模板变量拼写这一类不会在 `rivo issue new` / `approve` 等命令里被自动拦下——拼错时不报错，只会静默渲染成空字符串。提前跑 `rivo doctor` 能在配置阶段一次性发现，而不是等流转出了怪现象才回头查。

**它不检查 `agents`。** flow 里的 assignee 有没有对应的 `ref`，rivo 一概不管——见上面「把 assignee 绑到平台上」。所以"没人被唤起"只有两种原因：没配 `scripts`，或者这个 assignee 没有 `ref`。

## 开一次交付

```bash
rivo issue new fix-login --flow product-feature
```

`rivo issue show <slug>` 里出现"全部节点已通过"之后，用 `rivo issue close <slug> --reason "..."` 收尾；`rivo issue log <slug>` 打印这次交付的原始事件流。
