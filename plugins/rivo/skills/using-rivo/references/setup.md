# 配置 rivo

## 安装

发布的 npm 包不在这份计划范围内,眼下要从仓库的 `cli/` 目录构建并链接:

```bash
cd cli && npm install && npx tsup && npm link
```

(以后会有发布好的 npm 包替代这一步。)

## 初始化工作区

在项目根目录跑一次:

```bash
rivo init                            # 建 .rivo/flows/,幂等
```

和 `git init` 一样是显式的一步。**没有它,`rivo issue new` / `flow new` / `doctor` 都会报错**——rivo 靠向上找 `.rivo` 目录定位工作区,而这次查找会在用户主目录停下:`~/.rivo` 是全局设置的位置,不是任何项目的工作区。所以在主目录里 `rivo init` 也会被拒绝,交付日志必须待在仓库里。

`agent add` / `agent list` / `agent remove`(不带 `--local`)操作的是 `~/.rivo/settings.json`,不需要工作区,可以在 `init` 之前跑。

## 声明参与者

```bash
rivo agent add engineer --ref <平台上的 agent 标识>
rivo agent add qa                    # 不绑 ref:这个节点由人接手,rivo 不会为这个 assignee 调用脚本
```

默认写 `~/.rivo/settings.json`。加 `--local` 写项目的 `.rivo/settings.local.json`(会自动 gitignore),只在这个项目要接不同工作区时才需要。

`rivo agent list [--json]` 看已声明的参与者,`rivo agent remove <name> [--local]` 移除。

## 配置平台接入

`settings.json` 的 `scripts` 形态和 `package.json` 的 scripts 一样,key 是事件,value 是一条命令:

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

可用变量只有这些:`{issue_slug}` `{node}` `{agent}` `{agent_ref}` `{reason}` `{flow}` `{log_path}` `{issue_dir}` `{workspace_dir}`。

`{reason}` 按事件取值,多人表态时用 `; ` 拼成一条:`transition` 拿上游全部 approve 的交接说明,`reject` 拿全部打回意见,`recall` 拿 recall 的理由,`close` 拿 close 的理由。`{agent}` / `{agent_ref}` 是**被唤起的那个 assignee**,脚本按 assignee 逐个执行;只有 `close` 例外,那里没人被唤起,`{agent}` 是执行 close 的人。

脚本是尽力而为:失败只警告,不会让已经写进 log 的流转看起来失败。它也不继承 stdin,并且有 30 秒超时——无人值守的 agent 场景里挂死比失败更糟。

**具体命令怎么写取决于你的平台。** 去读那个平台 CLI 的 `--help` 或文档,找到"把一个任务指派给某个 agent"和"给某个任务留言"对应的命令,填进模板。rivo 不认识任何平台,也不该认识。

模板按空格切成参数,**不经过 shell**——不能写管道、`&&` 和重定向。需要复杂逻辑就调脚本文件:

```json
"reject": "{workspace_dir}/.rivo/on-reject.sh {issue_slug} {agent_ref} {reason}"
```

## 建流程

```bash
rivo flow new product-feature      # 生成带注释的骨架
rivo doctor                        # 一次性体检,见下
```

`rivo flow list [--json]` 看已有哪些流程,`rivo flow show <name> [--node <id>] [--json]` 看流程或某个节点的细节。

`rivo doctor` 检查这些:

- `settings` 能不能解析,合并之后 `agents` 是不是空的
- `scripts` 模板里的变量是不是都在变量表内(拼错的 `{agnet_ref}`、`{agentRef}` 当场抓出)
- 每份 `flow.yaml` 过不过 schema、有没有引用未声明的 agent
- 每个 issue 的 log 有没有无法解析的行、有没有被忽略的陈旧事件
- 每个**在途** issue 的流程还在不在、当前节点还在不在那个流程里(改流程会立刻对在途交付生效)

它**不**做流程图的静态连通性检查。

其中模板变量拼写这一类不会在 `rivo issue new` / `approve` 等命令里被自动拦下——拼错时不报错,只会静默渲染成空字符串。提前跑 `rivo doctor` 能在配置阶段一次性发现,而不是等流转出了怪现象才回头查。

**flow 引用了未声明的 agent 时,不同命令的态度不一样,不要指望统一报错:**

- `rivo issue new` 会直接拒绝创建。
- 交付一旦开始,`show` / `approve` / `reject` / `recall` / `close` 不会再因为这个原因报错——settings 是事后可能被编辑的,不能让一次配置改动就让正在跑的交付看不了、关不掉。取而代之的是:进入下一个节点时,rivo 会为每个未声明的 assignee 打印 `console.warn`,点名是谁、在哪个节点,流转本身照常写入 log。

所以"没人被唤起"要先分清楚是哪种:没配 `scripts`、assignee 没绑 `ref`(设计如此,人来接手)、还是 assignee 压根没声明(配置错了,看 warn 里点的名)。

## 开一次交付

```bash
rivo issue new fix-login --flow product-feature
```

`rivo issue show <slug>` 里出现"全部节点已通过"之后,用 `rivo issue close <slug> --reason "..."` 收尾;`rivo issue log <slug>` 打印这次交付的原始事件流。
