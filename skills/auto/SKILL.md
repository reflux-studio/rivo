---
name: auto
description: 自动串联整条 rivo 生命周期（issue→spec→plan→(design)→code→(uat)→archive），遇方向/安全停点必停问人。仅当用户明确要全自动、一路跑完、不用逐步参与时触发（如『你自己走完』『别停下问我』『全自动交付』）；普通需求默认走手动（从 issue 起步、逐阶段暂停），不要擅自升级成全自动。
argument-hint: <需求描述 | issue-id>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:auto —— 自动编排

把整条生命周期自动串起来，人类只提需求。auto 不替用户做**方向**决策：产物质量交给各 skill 的 `/rivo:review` 自审，auto 不再逐个停下等人批准产物；但遇到方向 / 安全停点必停问人。天然适配 multica（Agents as Teammates）。

**触发边界**：auto 自动化的是**动作**、不是**方向**——它把全部方向决策都交给停点（见下），所以可由用户明确的全自动意图触发：自然语言（「你自己一路走完」「别停下问我」）或显式 `/rivo:auto` 都行，不必非记命令。但全自动是一次**有意识的选择**、不是默认：普通需求默认走手动（从 `issue` 起步、逐阶段 `report` 主讲后暂停），只有用户明确表示不想逐步参与时才转 auto——别替用户把手动需求悄悄升级成全自动。（对比 `reflow` 仍保留 `disable-model-invocation`：回退是纯**方向决策**，必须由用户拍板，故不开放 AI 自主触发。）

## 任务清单

1. **定起点** —— 需求描述就先 `/rivo:issue`；issue-id 就读 `status` 从对应阶段续跑
2. **按状态机推进** —— issue → spec → plan →（design）→ code →（uat）→ archive
3. **该停就停** —— 开放决策、`reflow-required`、uat 不通过、会丢已提交工作的操作，四处必停
4. **编排模式调子 skill** —— 各 skill 跳过 report 主讲与暂停，review 收敛即自动续跑
5. **返工回流** —— reflow / uat 触发 `--rebuild` 后，等用户决定并续跑
6. **收尾** —— 到 `archived` 提示用户按 `PROJECT.md` 约定合并/清理分支

## 工作流程

**按状态机推进**

- `$ARGUMENTS` 是需求描述就先 `/rivo:issue`；是 issue-id 就读它的 `status`，从对应阶段续跑（`status` 为 `created` 且 PRD 尚未收敛时重跑 `/rivo:issue <id>` 续清，否则按 `status` 推进下一阶段）。
- 顺着 `issue → spec → plan →（design，若 spec 涉及 UI）→ code →（uat，若需人工验收）→ archive` 依次调对应的生命周期 skill：`created`→spec、`specified`→plan、`planned`→code、`coded`→（uat→）archive。
- **回滚感知**：若 reflow 后某层 `--rebuild` 把 `status` 回滚到了上游（如 plan 重做 → `status` 回到 `planned`），auto 直接读 `status` 从该层下游前向续跑——不需要记忆下游曾跑到哪，status 就是唯一真相。
- **编排模式**：你驱动各 skill 时让它们处于 auto 编排——`review` 收敛后**跳过 `/rivo:report` 主讲与暂停批准**，直接推进下一步（产物质量由 review 自审把关）。

**该停就停（不可自动略过）**

auto 自动的是动作，不是方向 / 安全。下列四处停下问人：

- **开放决策** —— issue 的需求收敛、design 的 UI 方向等只在用户脑子里的取舍，停下逐项问（带推荐）。
- **`reflow-required`** —— review 报方向性矛盾，停下提示走 `/rivo:reflow`，等用户决定回退。
- **uat 不通过** —— 停下，按 uat 的缺陷分流（轻微 bug → `/rivo:code --rebuild`、方向性 → `/rivo:reflow`、范围外 → 新 `/rivo:issue`）等用户决定；仅 uat 通过才进 `/rivo:archive`。
- **会丢已提交工作的操作** —— `revert` / `reset --hard` / 强删分支等，停下等用户明确批准。

此外——**收敛门仅同模型兜底（低可信）时**：环境探不到异质 reviewer、本轮 review 只能同模型自评，外部视角缺失。手动模式有 report 主讲兜底，auto 没有，所以 auto 下额外停一下：提示用户该收敛门可信度低、建议人工复核，再由用户决定继续——别让防误判/防幻觉的最后防线随环境静默变薄。

**返工回流**

reflow / uat 不通过触发 `--rebuild` 时，auto 停下交还用户；用户决定并跑对应 `/rivo:<skill> <id> --rebuild`（基于现有产物重做；`status` 按统一规则设回该 skill 出口态——上游层重做即把 `status` 回滚、显式标记下游 stale，code 同层返工则 `status` 不变），重走 review 收敛后，auto 读回滚后的 `status` 从该层下游前向续联。返工同样在上述四个停点处停。

**收尾**

到 `archived` 提示用户按 `PROJECT.md` 的分支约定合并、清理分支（rivo 不 merge）。结束语三段：产物（已交付到 `archived/<id>/` 的全套产物、源码 commits）、关键决策（整条链的核心判断，至多 3 条）、下一步（按约定合并/清理分支，再开下一个 `/rivo:issue`）。

## 核心原则

- **不替用户决方向** —— auto 自动的是动作，不是方向；开放决策、reflow、uat 分流一律停。
- **产物质量交给 review** —— 不再逐个停下等人批准产物，质量由各 skill 的 review 自审收敛保证；auto 下不走 report。
- **只编排，不绕过** —— 本质工作仍由各生命周期 skill 完成，auto 不跳过它们的前置检查和 review。
- **会丢工作的操作必停** —— 任何可能丢失已提交工作的操作，停下问人。
- **learnings 由子 skill 各自读** —— auto 只编排，不重复读 `.rivo/learnings/`；各生命周期 skill 在自己开头读。

## 反例

**"design 的 UI 方向有好几种选法，我挑了个看起来最稳的就接着往下跑了"** —— 这是 auto 最隐蔽的滑坡：把"用户决定方向"偷换成"我替他选了"。产物质量可以交给 review 自审、不必停下求批准；但**方向**（开放决策、reflow、uat 分流）和**安全**（会丢工作的操作）是用户的地盘，auto 必须停下问人，哪怕你觉得某个选项明显更好。
