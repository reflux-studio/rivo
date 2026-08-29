# 配置 rivo

## 声明参与者

```bash
rivo agent add engineer --ref <平台上的 agent 标识>
rivo agent add qa                    # 不绑 ref:agent_ref 会以空字符串传给脚本模板,能不能唤起取决于平台脚本怎么处理空值,兜底还是人来做
```

默认写 `~/.rivo/settings.json`。加 `--local` 写项目的 `.rivo/settings.local.json`(会自动 gitignore),只在这个项目要接不同工作区时才需要。

`rivo agent list [--json]` 看已声明的参与者,`rivo agent remove <name> [--local]` 移除。

## 配置平台接入

`settings.json` 的 `scripts` 形态和 `package.json` 的 scripts 一样,key 是事件,value 是一条命令:

```jsonc
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

**具体命令怎么写取决于你的平台。** 去读那个平台 CLI 的 `--help` 或文档,找到"把一个任务指派给某个 agent"和"给某个任务留言"对应的命令,填进模板。rivo 不认识任何平台,也不该认识。

模板按空格切成参数,**不经过 shell**——不能写管道、`&&` 和重定向。需要复杂逻辑就调脚本文件:

```jsonc
"reject": "{workspace_dir}/.rivo/on-reject.sh {issue_slug} {agent_ref} {reason}"
```

## 建流程

```bash
rivo flow new product-feature      # 生成带注释的骨架
rivo doctor                        # 校验:agent 是否已声明、模板变量是否拼错、log 是否连续
```

`rivo flow list [--json]` 看已有哪些流程,`rivo flow show <name> [--node <id>] [--json]` 看流程或某个节点的细节。

`doctor` 检查的这几类问题不会在 `rivo issue new` / `approve` 等命令里被自动拦下——模板变量拼错时不会报错,只会静默渲染成空字符串。提前跑 `rivo doctor` 能在配置阶段一次性发现,而不是等流转出了怪现象才回头查。

## 开一次交付

```bash
rivo issue new fix-login --flow product-feature
```
