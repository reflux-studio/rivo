# rivo 角色包重构 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 v2.2 的 `roles/` + `skills/` 单体拆成三个互不依赖的角色插件,删掉 Team Lead 与 Verifier,把三路 `surveying-*` 合并成各自的 `longtermism`,并重写 README。

**Architecture:** 纯 markdown 重构,不含代码。终态是四个零依赖插件:`plugins/rivo`(计划 1 已完成)与 `plugins/rivo-product` / `rivo-designer` / `rivo-engineer`。每个角色包自包含——`agent.md` 不引用任何外部技能,包内技能不引用其他包。

**Tech Stack:** Markdown · Claude Code 插件清单(`.claude-plugin/plugin.json`)· git mv 保留历史

**Spec:** [docs/superpowers/specs/2026-08-29-rivo-v3-design.md](../specs/2026-08-29-rivo-v3-design.md) —— 第 3 节(包结构)、第 7 节(角色包内容与迁移)是本计划的直接依据。

## Global Constraints

- **零依赖是硬约束。** 角色包不依赖 `rivo`,`rivo` 也不依赖角色包。任何 `agent.md` 或包内技能出现"遵循 `collaborating`""上报 Team Lead""交 Verifier 验证"都是违反。
- **一个名字贯穿:** 插件名 `rivo-engineer` → `agent.md` 的 `name: engineer` → `flow.yaml` 的 `agent: engineer` → `settings.json` 的 `agents.engineer`。中间没有映射表。
- **技能命名规则:** 做事的技能用动名词(`writing-requirements`、`implementing`);方法论用名词/形容词(`test-driven-development`、`longtermism`)。
- **文档为中文。** 代码注释英文的约束在本计划中不适用——这里没有代码。
- **`git mv` 而非删除重建**,保留文件历史。
- 提交信息用中文。

## 迁移映射(全量,逐文件)

```
  删除（git rm -r）
    roles/team-lead/               7 个文件
    roles/verifier/                7 个文件
    skills/collaborating/          2 个文件
    skills/brainstorming/          1 个文件
    skills/frontier-questioning/   1 个文件

  移动 + 改名（git mv）
    roles/product/skills/writing-requirements/  → plugins/rivo-product/skills/writing-requirements/
    roles/product/skills/running-uat/           → plugins/rivo-product/skills/running-uat/
    roles/product/skills/competitive-brief/     → plugins/rivo-product/skills/writing-competitive-brief/
    roles/product/skills/roadmap-update/        → plugins/rivo-product/skills/updating-roadmap/
    roles/product/agent.md                      → plugins/rivo-product/agent.md

    roles/designer/skills/writing-ui-design/    → plugins/rivo-designer/skills/writing-ui-design/
    roles/designer/agent.md                     → plugins/rivo-designer/agent.md

    roles/engineer/skills/writing-system-design/    → plugins/rivo-engineer/skills/writing-system-design/
    roles/engineer/skills/implementing-changes/     → plugins/rivo-engineer/skills/implementing/
    roles/engineer/skills/test-driven-development/  → plugins/rivo-engineer/skills/test-driven-development/
    roles/engineer/skills/systematic-debugging/     → plugins/rivo-engineer/skills/systematic-debugging/
    roles/engineer/skills/shipping/                 → plugins/rivo-engineer/skills/shipping/
    roles/engineer/skills/tech-debt/                → plugins/rivo-engineer/skills/assessing-tech-debt/
    roles/engineer/agent.md                         → plugins/rivo-engineer/agent.md

  吸收（surveying-* 并入各自的 longtermism,原目录 git rm）
    roles/product/skills/surveying-product/   → plugins/rivo-product/skills/longtermism/
    roles/designer/skills/surveying-design/   → plugins/rivo-designer/skills/longtermism/
    roles/engineer/skills/surveying-codebase/ → plugins/rivo-engineer/skills/longtermism/
```

## File Structure

| 路径 | 职责 |
| --- | --- |
| `plugins/rivo-<role>/.claude-plugin/plugin.json` | 插件清单 |
| `plugins/rivo-<role>/agent.md` | 角色的全局规约。三重身份:插件 agent 定义、平台 `--instructions` 内容、手工使用时的规约。必须完全自包含 |
| `plugins/rivo-<role>/skills/<name>/SKILL.md` | 各技能主文件 |
| `plugins/rivo-<role>/skills/<name>/references/*.md` | 按需加载的结构模板与检查清单 |
| `plugins/rivo-<role>/skills/longtermism/SKILL.md` | 建立 / 遵循 / 维护该角色的长期认知 |
| `README.md` | 重写:现在描述的是即将被删的架构 |

---

### Task 1: 包骨架——移动、改名、删除

纯机械操作,没有内容编辑。本任务结束时 `roles/` 与 `skills/` 应当完全消失。

**Files:**
- Create: `plugins/rivo-product/.claude-plugin/plugin.json`
- Create: `plugins/rivo-designer/.claude-plugin/plugin.json`
- Create: `plugins/rivo-engineer/.claude-plugin/plugin.json`
- Move: 见上方迁移映射的"移动 + 改名"与"吸收"两节
- Delete: 见迁移映射的"删除"一节

**Interfaces:**
- Consumes: 无
- Produces: `plugins/rivo-{product,designer,engineer}/` 的目录结构,后续每个任务都在其中编辑文件

- [ ] **Step 1: 建三份插件清单**

`plugins/rivo-product/.claude-plugin/plugin.json`:

```json
{
  "name": "rivo-product",
  "version": "0.1.0",
  "description": "rivo 意图层角色:澄清产品问题、持有 requirement 与产品认知、组织用户验收"
}
```

`plugins/rivo-designer/.claude-plugin/plugin.json`:

```json
{
  "name": "rivo-designer",
  "version": "0.1.0",
  "description": "rivo 体验层角色:设计用户如何理解和操作产品,持有 ui-design 与设计系统"
}
```

`plugins/rivo-engineer/.claude-plugin/plugin.json`:

```json
{
  "name": "rivo-engineer",
  "version": "0.1.0",
  "description": "rivo 机制层角色:设计系统方案、实现、发布并系统化调查问题"
}
```

- [ ] **Step 2: 移动并改名**

逐条执行迁移映射的"移动 + 改名"一节。`git mv` 目录整体移动,不要逐文件移。例:

```bash
mkdir -p plugins/rivo-product/skills plugins/rivo-designer/skills plugins/rivo-engineer/skills
git mv roles/product/skills/writing-requirements plugins/rivo-product/skills/writing-requirements
git mv roles/product/skills/competitive-brief    plugins/rivo-product/skills/writing-competitive-brief
git mv roles/engineer/skills/implementing-changes plugins/rivo-engineer/skills/implementing
git mv roles/engineer/skills/tech-debt            plugins/rivo-engineer/skills/assessing-tech-debt
# ……其余按映射表执行
```

- [ ] **Step 3: 把 surveying-\* 移到 longtermism 的位置**

三路 `surveying-*` 的内容会在 Task 2 被吸收改写,本步只负责搬到目标路径:

```bash
git mv roles/product/skills/surveying-product   plugins/rivo-product/skills/longtermism
git mv roles/designer/skills/surveying-design   plugins/rivo-designer/skills/longtermism
git mv roles/engineer/skills/surveying-codebase plugins/rivo-engineer/skills/longtermism
```

- [ ] **Step 4: 删除不再存在的角色与共享技能**

```bash
git rm -r roles/team-lead roles/verifier skills/collaborating skills/brainstorming skills/frontier-questioning
```

- [ ] **Step 5: 确认 roles/ 与 skills/ 已空并移除**

```bash
find roles skills -type f 2>/dev/null
```

Expected: 无输出。**若有残留文件,说明映射表漏了某项——报告出来,不要自行决定去留。** 确认无输出后再 `rm -rf roles skills` 清掉空目录(git 不跟踪目录,所以这一步只影响工作区)。

- [ ] **Step 6: 一致性检查**

逐个断言目标路径存在、源路径消失。不要用 `git status` 的重命名计数来验证——那数的是文件数不是目录数,17 次目录移动会展开成一个不确定的文件数,对不上任何预期值。

```bash
for f in \
  plugins/rivo-product/agent.md \
  plugins/rivo-product/skills/writing-requirements/SKILL.md \
  plugins/rivo-product/skills/running-uat/SKILL.md \
  plugins/rivo-product/skills/writing-competitive-brief/SKILL.md \
  plugins/rivo-product/skills/updating-roadmap/SKILL.md \
  plugins/rivo-product/skills/longtermism/SKILL.md \
  plugins/rivo-designer/agent.md \
  plugins/rivo-designer/skills/writing-ui-design/SKILL.md \
  plugins/rivo-designer/skills/longtermism/SKILL.md \
  plugins/rivo-engineer/agent.md \
  plugins/rivo-engineer/skills/writing-system-design/SKILL.md \
  plugins/rivo-engineer/skills/implementing/SKILL.md \
  plugins/rivo-engineer/skills/test-driven-development/SKILL.md \
  plugins/rivo-engineer/skills/systematic-debugging/SKILL.md \
  plugins/rivo-engineer/skills/shipping/SKILL.md \
  plugins/rivo-engineer/skills/assessing-tech-debt/SKILL.md \
  plugins/rivo-engineer/skills/longtermism/SKILL.md ; do
  test -f "$f" || echo "缺失: $f"
done
echo "以上若无「缺失」行,17 个目标全部到位"
```

Expected: 只打印最后一行

另外确认 references 一并跟着搬了(它们是子目录,`git mv` 目录时自动带走):

```bash
find plugins/rivo-*/skills -name '*.md' | wc -l   # 应为 24
```

24 的来源(`agent.md` 不在 `skills/` 下,不计入):product 9(writing-requirements 的 SKILL + 4 份
references,加 running-uat、writing-competitive-brief、updating-roadmap、longtermism 各 1)
· designer 5(writing-ui-design 的 SKILL + 3 份 references,加 longtermism)
· engineer 10(writing-system-design 的 SKILL + 3 份 references,加其余 6 个技能各 1)

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "refactor(roles): 角色包移入 plugins/,技能改名,删除 team-lead 与 verifier"
```

---

### Task 2: 三份 `longtermism` 技能

同形批量任务:三个包各写一份,结构相同、领域不同。每份都吸收原 `surveying-*` 的调研方法作为"建立"这一面。

**Files:**
- Rewrite: `plugins/rivo-product/skills/longtermism/SKILL.md`(原 `surveying-product`)
- Rewrite: `plugins/rivo-designer/skills/longtermism/SKILL.md`(原 `surveying-design`)
- Rewrite: `plugins/rivo-engineer/skills/longtermism/SKILL.md`(原 `surveying-codebase`)

**Interfaces:**
- Consumes: Task 1 的目录结构
- Produces: 三份技能,`agent.md`(Task 3)会引用它们的名字

- [ ] **Step 1: 读三份原文件**

先读 `git show HEAD~1:roles/product/skills/surveying-product/SKILL.md` 等三份原始内容——调研方法本身是有价值的资产,不要推倒重写,而是把它放进"建立"这一面。

- [ ] **Step 2: 按统一结构改写三份**

每份 frontmatter:

```yaml
---
name: longtermism
description: 建立、遵循并维护本角色对这个项目的长期认知。首次调研、动手前查阅、以及交付被打回后回写,都用本技能。
---
```

正文固定四节,**顺序与标题一致**,内容随角色不同:

```
# 长期认知

<一句话:这份认知是什么、存在哪个文件、为什么它比会话更重要>

## 建立

<原 surveying-* 的调研方法整体放在这里。产品调研定位与价值;
 设计调研设计系统、组件、token、交互惯例;工程调研架构、依赖、
 运行方式与验证基础,并实际运行关键命令>

## 遵循

- 动手前先读,产物必须与认知一致
- 认知与事实冲突时以事实为准,并回写认知,而不是绕开它
- 认知里没有的东西不要假装有;不确定就标为待确认

## 维护

三个触发时机:
- 调研之后
- **交付被打回之后**——打回原因就在 `.rivo/issues/<slug>/log.jsonl` 里,
  那是"这次为什么错了"的一手记录
- 用户纠正之后

<写什么、不写什么:写稳定的判断与惯例,不写单次交付的状态>
```

三份的文件名分别是 `.rivo/PRODUCT.md`、`.rivo/DESIGN.md`、`.rivo/ENGINEERING.md`。每份在开头点明自己持有哪一份。

- [ ] **Step 3: 确认没有跨包引用**

```bash
grep -rn "collaborating\|Team Lead\|Verifier\|surveying-" plugins/*/skills/longtermism/
```

Expected: 无输出

- [ ] **Step 4: 提交**

```bash
git add plugins/*/skills/longtermism/
git commit -m "feat(roles): longtermism 技能——建立、遵循、维护长期认知"
```

---

### Task 3: 三份 `agent.md` 重写

同形批量任务。`agent.md` 有三重身份:插件的 agent 定义、平台上 `--instructions` 的内容、手工使用该角色时的全局规约。因此必须**完全自包含**。

**Files:**
- Rewrite: `plugins/rivo-product/agent.md`
- Rewrite: `plugins/rivo-designer/agent.md`
- Rewrite: `plugins/rivo-engineer/agent.md`

**Interfaces:**
- Consumes: Task 1 的结构、Task 2 的 `longtermism` 技能名
- Produces: 三份角色规约,README(Task 5)会引用它们

- [ ] **Step 1: 读三份现有 agent.md**

它们的骨架是对的,问题在于引用了已删除的东西。逐句检查后改写,不要从零重写。

- [ ] **Step 2: 按统一结构改写**

frontmatter 保持 `name: product` / `designer` / `engineer`(**不带 `rivo-` 前缀**——名字贯穿规则要求它等于 flow 里的 agent 名)。

正文五节:

```
# <Role>

## 你是谁
<领域责任与取舍倾向。保留现有内容>

## 持有什么
<产物 + 那份长期认知的文件名>

## 怎么工作
<有哪些技能、什么时候用哪个。技能名要与 Task 1 改名后的一致>

## 协作姿态
- 兜底:看到问题就报告——不管是不是你的辖区、是不是你造成的
- 底线:他人辖区你只有提案权;损害你辖区的决定,你有职责驳回。
  同意和反对一样需要理由

## 原则
<领域特有的判断标准。保留现有内容>
```

**必须删掉的内容:**
- "全程遵循 `collaborating`"及任何对该技能的引用
- "上报 Team Lead""交 Team Lead 判断"
- "为 Verifier 提供……""交独立验证"
- 原有的"记忆"一节——那部分现在归 `longtermism`

**协作姿态**这一节是从原 `collaborating` 第 3 节救回来的——它是真正的行为规约,机制替代不了,必须进 `agent.md`。

- [ ] **Step 3: 逐包确认自包含**

```bash
grep -rn "collaborating\|Team Lead\|Verifier\|verifying\|frontier-questioning" plugins/*/agent.md
```

Expected: 无输出

对每个包分别确认:它引用的每个技能名都在自己包内存在。

```bash
for p in product designer engineer; do
  echo "== rivo-$p =="; ls plugins/rivo-$p/skills/
done
```

- [ ] **Step 4: 提交**

```bash
git add plugins/*/agent.md
git commit -m "refactor(roles): agent.md 完全自包含,补回协作姿态"
```

---

### Task 4: 清理技能内的残留引用

20 个文件引用 `collaborating`,9 个提到 Team Lead,8 个提到 Verifier。这些引用现在全部悬空。

**Files:**
- Modify: `plugins/*/skills/*/SKILL.md` 与 `plugins/*/skills/*/references/*.md` 中所有命中的文件

**Interfaces:**
- Consumes: Task 1–3 的成果
- Produces: 无悬空引用的技能集

- [ ] **Step 1: 列出所有命中**

```bash
grep -rn "collaborating\|Team Lead\|Verifier\|verifying\|frontier-questioning\|surveying-\|brainstorming" plugins/*/skills/
```

把结果写进你的报告——这是本任务的工作清单。

- [ ] **Step 2: 逐处按语义替换,不做机械删除**

替换规则:

| 原文含义 | 改成 |
| --- | --- |
| "遵循 `collaborating`" | 删掉整句。规矩已在 `agent.md` 的协作姿态里 |
| "由 Team Lead 判断入口 / 调度 / 收口" | 删掉。入口由用户选流程决定,调度由 rivo CLI 负责 |
| "交 Verifier 独立验证" | 改为"自审"或"交给流程的下一个节点",视上下文 |
| "用 `frontier-questioning` 提问" | 就地展开成一两句提问原则:沿决策依赖提问,把默认假设摆到台面 |
| "用 `brainstorming` 产生候选" | 就地展开:产生真正不同的候选方向,而不是同一方向的变体 |
| "`surveying-*`" | 改为 `longtermism` |
| 引用 `.rivo/` 布局(原 workspace-layout) | 改为"产出写进 `rivo issue show` 返回的 `issue_dir`" |

**判断标准:** 删掉这句话之后,读者会做出错误判断吗?不会就删;会,就把那条信息就地写清楚,而不是指向一个不存在的技能。

- [ ] **Step 3: 确认清理干净**

```bash
grep -rn "collaborating\|Team Lead\|Verifier\|verifying\|frontier-questioning\|surveying-" plugins/
```

Expected: 无输出。`brainstorming` 允许作为普通词出现(如"脑暴"),但不得作为技能引用。

- [ ] **Step 4: 提交**

```bash
git add plugins/
git commit -m "refactor(roles): 清理指向已删除角色与共享技能的悬空引用"
```

---

### Task 5: README 重写 + 全仓一致性检查

现有 README 描述的是被本次重构删掉的架构——多入口产物图、五个角色、Team Lead 编排、双查放行。整篇需要重写。

**Files:**
- Rewrite: `README.md`
- Verify: 全仓

**Interfaces:**
- Consumes: Task 1–4 的全部成果、`plugins/rivo/` 的 CLI 与技能(计划 1 已完成)
- Produces: 面向新读者的入口文档

- [ ] **Step 1: 读 spec,按它的结构组织 README**

spec 的第 1、2、3 节就是 README 的骨架。README 是 spec 的对外版本:少讲为什么重构,多讲这是什么、怎么用。

必须覆盖:

```
  标题与一句话定位
  为什么不是"五个 Agent 演人类岗位"——装哪些角色 = 你持有哪些决定权
  核心模型:流程是对角色的编排
    · 节点 = assignees[] + 一个 approve 阈值
    · 推进不是命令,是条件满足的后果
    · 节点边界 = 交接点,不发生交接就不切节点
  四个包,零依赖  ← 三条验证写出来
  五分钟跑通:rivo init → agent add → flow new → issue new → approve
  一个真实的 flow.yaml 示例
  log.jsonl 长什么样(几行就够)
  平台接入:scripts 像 package.json 的 scripts,变量表不含平台概念
  明确不做的事(spec 第 8 节的精简版,保留理由)
  仓库结构
  License
```

**必须删掉的旧内容:** 多入口产物图、产物生命周期图、五个角色表、Team Lead 与 Verifier、双查放行、发现闭环三条出路、`.rivo` 旧布局(有 `state.md` / `reviews.md` / `verification.md` 那份)、常见问题里所有基于旧架构的问答。

`assets/` 下三张 SVG(`artifact-map.svg`、`artifact-lifecycle.svg`、`roles.svg`)画的都是旧架构,一并 `git rm`。README 不再内嵌图。

- [ ] **Step 2: 全仓一致性检查**

```bash
echo "== 悬空引用 =="
grep -rn "collaborating\|Team Lead\|Verifier\|frontier-questioning\|surveying-" README.md plugins/ || echo "  无"

echo "== 旧目录是否残留 =="
ls roles skills 2>/dev/null || echo "  已移除"

echo "== 四个包的清单是否齐备 =="
for p in rivo rivo-product rivo-designer rivo-engineer; do
  test -f plugins/$p/.claude-plugin/plugin.json && echo "  $p ✓" || echo "  $p ✗ 缺清单"
done

echo "== README 是否还提到旧架构 =="
grep -n "产物图\|生命周期\|双查\|Team Lead\|Verifier" README.md || echo "  无"

echo "== 平台无关性 =="
grep -rni "multica" plugins/ README.md || echo "  无平台名"
```

Expected: 每项都是"无"或全部 ✓

- [ ] **Step 3: CLI 仍然可用(重构不应影响它)**

```bash
cd cli && npx vitest run 2>&1 | tail -3 && npx tsc --noEmit && echo "CLI 未受影响"
```

Expected: 104 测试通过,typecheck 干净

- [ ] **Step 4: 提交**

```bash
git rm assets/artifact-map.svg assets/artifact-lifecycle.svg assets/roles.svg
git add README.md
git commit -m "docs: README 重写为角色编排架构,移除旧架构示意图"
```

---

## 完成标准

- [ ] `roles/` 与 `skills/` 不再存在
- [ ] `plugins/` 下四个包,每个都有 `.claude-plugin/plugin.json`
- [ ] 全仓 grep 不到 `collaborating` / `Team Lead` / `Verifier` / `frontier-questioning` / `surveying-`
- [ ] 三份 `agent.md` 各自自包含:引用的每个技能名都在同一个包内
- [ ] 三个包各有一份 `longtermism`
- [ ] README 不再出现多入口产物图、五角色、双查放行
- [ ] `cli/` 的 104 个测试仍然通过
- [ ] 全仓不出现任何平台名

## 不在本计划范围内

- 各技能正文的内容改进——本计划只清理悬空引用与改名,不重写方法本身
- `plugins/rivo` 包(计划 1 已完成)
- npm 包名核实与首次发布
- `rivo-qa` 包——spec 第 8 节已裁定先不建,用"`qa` 节点 + 人类 assignee"跑一段时间再看
