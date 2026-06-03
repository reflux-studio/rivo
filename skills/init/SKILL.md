---
name: init
description: 仓库首次接入 rivo，建立 .rivo/ 骨架与 PROJECT.md 项目宪章。用户想接入或初始化 rivo 时用。
allowed-tools: Read, Write, Glob, Grep, Bash(git add *), Bash(git commit *), Bash(git status *), Bash(git rev-parse *), Bash(git branch *), Bash(mkdir *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:init —— 接入 rivo

为仓库建立 `.rivo/` 骨架、项目宪章 `PROJECT.md` 与技术架构文档 `ARCHITECTURE.md`。这是唯一在 `.rivo/` 不存在时仍可运行的 skill。

## 任务清单

1. **检查** —— 不在 git 仓库就提示先 `git init`（rivo 不负责建仓库）；`.rivo/` 已存在就提示已接入，问是否只补 `PROJECT.md` / `ARCHITECTURE.md`
2. **摸项目** —— 读构建配置、README、CLAUDE.md 与代码结构，认出技术栈、命令，以及模块 / 依赖 / 数据流 / 存储 / 分层
3. **建骨架** —— 创建 `.rivo/` 目录结构
4. **写 PROJECT.md + ARCHITECTURE.md** —— 项目身份与操作落 PROJECT.md，技术架构落 ARCHITECTURE.md
5. **commit** —— 提交 `chore: init rivo`
6. **结束语** —— 交代产物、关键决策、下一步 `/rivo:issue`

## 工作流程

**摸项目**

读 `package.json`、`Makefile`、`pyproject.toml`、`README`、`CLAUDE.md` 等，认出技术栈、构建 / 测试 / lint 命令、目录约定、默认分支。再扫一遍代码结构，摸清主要模块、依赖方向、数据流与存储——这是 `ARCHITECTURE.md` 的素材。都要基于真实配置与代码、不凭印象填；代码规模大时可内嵌 `/rivo:survey --internal` 摸底。

**建骨架**

```
.rivo/
├── PROJECT.md
├── ARCHITECTURE.md
├── issues/
├── archived/
└── learnings/
```

rivo 在你当前所在分支上工作、不自建分支或 worktree；要不要为每个 issue 开独立分支属隔离偏好，写进 PROJECT.md 的「分支与交付约定」即可。

**写 PROJECT.md + ARCHITECTURE.md 并收尾**

- 按 [templates/project.md](templates/project.md) 写项目宪章（身份 / 用户 / 能力 / 技术栈 / 命令 / 规约 / 分支约定）；按 [templates/architecture.md](templates/architecture.md) 把摸到的架构落成 `ARCHITECTURE.md`（组件、依赖、数据流、存储、目录骨架，能画 ASCII 图就画）。都填真实信息，没摸清的留占位、不编造。
- 在仓库提交 `chore: init rivo`。
- 结束语交代产物（`.rivo/PROJECT.md`、`ARCHITECTURE.md` 加骨架）、关键决策（技术栈 / 构建·测试·lint 命令 / 架构骨架，至多 3 条）、下一步 `/rivo:issue` 开第一个需求。

## 核心原则

- **摸了再写** —— PROJECT.md 的命令约定、ARCHITECTURE.md 的架构都基于真实配置与代码，写错了后续每个阶段都跟着错。
- **唯一的例外入口** —— 这是 `.rivo/` 不存在时唯一能跑的 skill，其它 skill 都要先接入。

## 反例

**"构建 / 测试命令凭印象填"** —— PROJECT.md 是后续所有阶段的命令来源，命令错一条，code 的门禁、测试就全跑空。拿不准就去 `package.json` / `Makefile` 里核实。
