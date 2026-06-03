---
name: issue
description: 开始一个 rivo 交付：登记需求，并把它澄清成一份充实的 PRD（README.md）。用户想做某事、提新需求/工单、澄清需求时用。
argument-hint: <一句话需求描述 | issue-id> [--rebuild]
allowed-tools: Read, Write, Edit, Glob, Grep, Task, Bash(git add *), Bash(git commit *), Bash(git status *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:issue —— 开始交付：登记 + 澄清

把一个需求落成 issue 并澄清成 PRD：登记建目录、摸清代码现状、和用户对齐产品方向，交出一份充实的 PRD（`README.md`），推进到 `created`。验收标准（spec）由下一步 `/rivo:spec` 翻译，技术方案由 `/rivo:plan`——issue 只管产品侧。

rivo 在你**当前所在分支**上产出，不自建分支或 worktree；要不要为这个 issue 开独立分支（建议开，保持主线干净）按 `PROJECT.md` 的分支约定来，由你决定。

澄清可能要问好几轮；中途中断后，重跑 `/rivo:issue <id>` 会读已落盘的 `README.md` 接着澄清——目录与 PRD 一登记就在盘上，不靠独立状态做检查点。

## 任务清单

1. **前置检查** —— `.rivo/` 在；新需求时有描述；续跑 / `--rebuild` 时读对应 issue 的 `status`
2. **读 learnings** —— 扫 `.rivo/learnings/` 里和本需求主题相关的踩坑与模式
3. **登记（新需求）** —— 生成 id、写骨架 `README.md`、落 `status: created` 并 commit；多需求分别立项
4. **摸底代码现状** —— 内嵌 `/rivo:survey --internal`，产出 `context.md`
5. **对齐产品方向** —— 逐项问、带推荐答案，按依赖序收敛开放决策
6. **写 PRD** —— 结论写回 `README.md`，`/rivo:review`（类型 `prd`）机审收敛
7. **收尾** —— commit；手动模式走 `/rivo:report` 主讲，下一步 `/rivo:spec`

## 工作流程

**前置检查**

- `.rivo/` 不存在就提示「本仓库尚未接入 rivo，请先运行 `/rivo:init`」并退出。
- **新需求**（`$ARGUMENTS` 是描述、不是已有 id）：描述为空就问「想做什么？一句话描述即可」。若 `PROJECT.md` 约定每个 issue 走独立分支、而当前还在主分支，提醒用户先切到独立分支（rivo 不自建分支）；用户不在意就在当前分支继续。
- **续跑 / 返工**（`$ARGUMENTS` 是已有 id）：读 `.rivo/issues/<id>/README.md` frontmatter 的 `status`：
  - `created` 且 PRD 尚未澄清收敛（`reviews/prd.md` 不在）—— 跳过登记，直接进「摸底 → 澄清」续跑。
  - 带 `--rebuild`（通常是 reflow 回退后返工）—— 放宽状态校验，允许在 `created`、`specified`、`planned`、`coded` 上重做：基于现有产物和 reflow 报告修订需求，照常走 `prd` 评审闭环。改完按统一规则把 `status` 设回本 skill 出口态 `created`（即从下游回滚、显式标记 spec/plan/code 已 stale），下游由 reflow 报告或用户判断是否前向重跑 `/rivo:spec`、`/rivo:plan`、`/rivo:code`。

**登记（仅新需求）**

- 扫 `.rivo/issues/`、`.rivo/archived/`，取现有最大序号 +1，三位零填充；slug 把需求要点压成 kebab-case 短语（英文小写，3–5 词内）。id 形如 `001-add-dark-mode`。
- 粗估优先级：基于描述给 P0–P3（P0 最高）并附一句理由，明确告诉用户可改；用户给了就用用户的，不为优先级阻塞流程。
- 按 [templates/readme.md](templates/readme.md) 写 `.rivo/issues/<id>/README.md`，雏形即可（空缺留待澄清补充，不自行编造）。落 `status: created`，提交 `docs: issue <id>` —— 目录与雏形一落盘，续跑就有依据。
- 如果用户一次性给了多个**彼此无关**的需求，提示分别 `/rivo:issue` 各自交付——这是用户给的多需求，不是你主动拆解。

**摸底与对齐**

- 摸底默认要做：内嵌 `/rivo:survey --internal`，基于真实现状澄清，才不会建空中楼阁，产出 `context.md`。只有当需求明显和现有代码无关（纯新项目、纯产品决策）时才跳过，并说明原因。
- 对齐时读完 README 和 context.md，找出要用户拍板的开放决策：范围边界、核心交互、优先取舍、非目标。**逐项收敛**：一次只问一个、给推荐答案和一句理由，按依赖序（被依赖的先问），用前一个答案收窄后面的选项，直到决策树收敛。往根因上挖，别停在表面诉求；需求里不自洽的地方，当场指出来澄清。

**PRD**

- PRD 写回 `README.md`，补全背景、目标、非目标、核心场景、关键约束，以及每个开放问题的决议。写完跑 `/rivo:review`（类型传 `prd`：产品 / 用户视角，机审完整性 / 可行性 / 一致性，自动收敛）。
- spec 不在这里做——issue 只交付 PRD。验收标准的翻译留给 `/rivo:spec`。

<HARD-GATE>
PRD（`README.md`）在 commit、收尾指向 `/rivo:spec` 前必须：`/rivo:review`（类型 `prd`）已跑完并收敛（机械项已改、判断项已标出）。review 未收敛禁止 commit、禁止收尾、禁止进入 `/rivo:spec`。
- **手动模式**：收敛后走 `/rivo:report` 向用户主讲 PRD；skill 到此结束、工作流自然暂停，是否进入 spec 由用户决定（跑 `/rivo:spec` 即认可；不满意则 `/rivo:issue <id> --rebuild` 或 `/rivo:reflow`）。
- **auto 编排下**：review 收敛即推进，跳过 report、不等人类批准（产物质量交给 review 自审）；仅开放决策（澄清收敛）/ `reflow-required` 处停（会丢已提交工作的操作任何模式都停，见全局纪律）。
</HARD-GATE>

**收尾**

- `status` 保持 `created`、更新 `updated`，提交 `docs: clarify <id>`。
- 结束语交代产物（`README.md`、`context.md`、`reviews/prd.md`）、定下的核心产品判断（至多 3 条）、下一步 `/rivo:spec <id>`。

## 核心原则

- **不碰你的分支** —— rivo 只在当前分支上产出，不自建分支/worktree、不 merge；隔离与合并按 `PROJECT.md` 的约定、归你。
- **先现状，后澄清** —— 没摸过代码，别急着定方案边界。
- **只做产品侧** —— 需求与 PRD；验收标准是 spec 的事、技术方案是 plan 的事。
- **深挖根因** —— 用户说的往往是症状，要问到他真正想解决的问题。

## 反例

**"需求挺简单，直接写 PRD"** —— 跳过摸底、不把开放决策逐项问清就动手，看着省事，实则把没问清的假设埋进了 PRD，到 spec / plan / code 才爆。再简单的需求，也先摸一眼现状、把开放决策问清楚。

**"顺便把技术选型也定了"** —— 澄清深色模式时问「偏好存 localStorage 还是后端」，看着是在对齐需求，其实已经滑进 plan。这类「看着像产品、实则是技术」的问题，要往上提一层、提到用户能观察到的行为：该问的不是「存哪」，而是「这个选择要不要被记住、要不要跨设备一致」——后者落成 PRD 决议、再由 spec 译成 AC，存储方案留给 plan 去推导。issue 问「要什么」，plan 答「怎么做」。
