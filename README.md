# rivo

> 一套把需求拆成可中断、可评审、可回退节点的 AI 研发工作流。

rivo 是一组 Agent Skills，把"一次需求交付"拆成几个有明确输入输出的阶段——`issue` 澄清需求、`spec` 定验收标准、`plan` 出方案、`code` 写实现、`archive` 归档。每个阶段读上一阶段落在磁盘上的文件，产出自己的文件，再把任务推进到下一个状态。

它针对的是**用 AI 持续迭代、维护一个真实系统**的场景，不是一次性出 demo。一句话生成一个能跑的应用，AI 已经很擅长；但在需要长期维护的系统上，放任 AI 自由发挥常出三类问题：曲解意图（说了不做的偏做、要做的漏掉）、不调研现状就动手（给出充满幻觉的改动）、没有系统设计（架构和产品逐渐失控）。rivo 用一套固定流程约束这件事——每一步都先摸现状、再产出、可评审、可回退——并把方向性的决策停下来交给你。

## 它用起来是什么样

比如你想给设置页加个深色模式开关：

```
/rivo:issue 给设置页加一个深色模式开关
```

rivo 不会立刻动手写代码。它先扫一眼你现有的代码摸清现状，然后一个一个地跟你对齐产品上拿不准的地方——一次只问一个，每个都带上它的推荐和理由：

> 用户选了深色之后，这个选择要记住吗？
> - **A. 记住，而且跨设备一致**（换台电脑登录还是深色）
> - B. 只在当前浏览器记住（换设备回默认）
> - C. 不记，每次进来跟随系统 —— （推荐：这是最小可用版，"记住偏好"可以下个迭代再说）
>
> 选哪个？

注意它问的是"用户能看到什么"，不是"代码怎么写"——偏好存 localStorage 还是后端、要不要建配置表，那些是下一阶段 `plan` 的事。你每答一题，它用你的回答收窄接下来的问题，直到该拍的板都拍完。然后它才把结论写成一份 PRD，自己跨模型评审一轮收敛，再用人话讲给你听。

到这里 `issue` 阶段结束，产出一份 PRD（`README.md`）。接下来 `spec` 把它逐条译成验收标准、`plan` 出方案、`code` 写实现，每一步都是这个节奏：先对齐，再产出，再讲清楚。

## 核心：一次交付，分阶段推进

一个需求从澄清到归档，依次经过这些阶段。每个阶段读上一阶段落在磁盘上的文件，产出自己的文件，然后把 issue 推进到下一个状态：

```
一个需求
  │ issue      把需求澄清成 PRD
  ▼
created ─────── README.md (PRD)
  │ spec       把 PRD 逐条译成 EARS 验收标准
  ▼
specified ───── spec.md
  │ plan       拆成技术方案 + 测试用例
  ▼
planned ─────── plan.md · test-cases.md
  │ (design)   涉及 UI 时可选：用真实前端栈搭一个零业务逻辑的 UI 壳
  │ code       按方案实现，每个 task 走红绿灯（先写失败的测试，再写实现）
  ▼
coded ───────── 源码 commits
  │ (uat)      可选：指引你做人工验收
  │ archive    沉淀经验、归档 issue
  ▼
archived
  │ (你)      按你的分支约定合并、清理（rivo 不 merge）
```

几个值得知道的点：

- **不碰你的分支。** rivo 只在你当前所在的分支上产出，不自建分支/worktree、不 merge。要不要为每个 issue 开独立分支（建议开，保持主线干净）、怎么合并清理，按 `PROJECT.md` 的分支约定来，归你。
- **issue 一次产出 PRD。** 没有中间 `draft` 态；澄清中途断了，重跑 `/rivo:issue <id>` 会读已落盘的 README 接着澄清，不用重来。
- **方向错了能退回来。** 真实开发里常常到下游才发现上游的坑——写代码时才看出方案有硬伤。这时跑 `/rivo:reflow`：它只诊断根因、给重跑建议，**不会擦掉任何已有产物**（写过的代码不是白费的）——它回滚的是 `status` 指针、不是产物，由你决定从哪一步重走。

## 上手

rivo 是个 [Agent Skills](https://agentskills.io) 插件。在 Claude Code 里安装：

```
/plugin marketplace add reflux-studio/rivo
/plugin install rivo@rivo-marketplace
```

然后三步开始第一个需求：

```
/rivo:init                       # 仓库首次接入：摸清技术栈与架构，建 .rivo/ 骨架、PROJECT.md、ARCHITECTURE.md
/rivo:issue <一句话需求>          # 登记需求、澄清成 PRD
/rivo:spec <id>                  # 把 PRD 译成验收标准；接着 plan → code → archive 一路往下
```

每个 skill 收尾都会告诉你产物在哪、做了哪些关键决策、建议的下一步是什么。不确定下一步，照着走就行。

## Skill 一览

rivo 的能力都以 `/rivo:<skill>` 调用，分两组：**主线**按顺序推进一次交付，**辅助**随时可叫、或被主线自动调用。

**主线**（按顺序推进交付状态）

| skill | 作用 | 入口 → 出口 |
|---|---|---|
| `/rivo:issue` | 登记需求并澄清成 PRD | — → `created` |
| `/rivo:spec` | 把 PRD 机械翻译成 EARS 验收标准 | `created` → `specified` |
| `/rivo:plan` | 把 spec 拆成技术方案 + 测试用例 | `specified` → `planned` |
| `/rivo:design` | 涉及 UI 时用真实前端栈还原 UI 壳（可选） | `planned` |
| `/rivo:code` | 按 plan 实现，每个 task 走红绿灯 TDD | `planned` → `coded` |
| `/rivo:uat` | 指引人工验收、收集反馈（可选） | `coded` |
| `/rivo:archive` | 沉淀 learnings、归档 issue | `coded` → `archived` |

**辅助**（随时可叫，或被主线自动调用）

| skill | 作用 | 谁来调 / 何时 |
|---|---|---|
| `/rivo:review` | 按产物类型派跨模型 / 跨角色评审、自动收敛 | issue/spec/plan/code 的收敛门自动调，不用你管 |
| `/rivo:survey` | 调研代码现状或外部技术选型 | issue/plan 自动内嵌，也可你单独调 |
| `/rivo:report` | 把产物用人话讲给你、求校准 | 手动模式各阶段收尾自动调，也可你单独调 |
| `/rivo:reflow` | 诊断方向性缺陷、建议回退 | 你显式调（方案出错时） |
| `/rivo:handoff` | 存档当前上下文进度 | 你主动调（上下文快满时） |
| `/rivo:auto` | 自动串起整条主线 | 你要全自动交付时调 |

> 关于评审与停顿：产物质量交给 `review` 自审收敛，所以 rivo 不会每产出一个文件就停下来求你批准。手动模式下，每个阶段评审通过、`report` 主讲完就自然暂停——你跑下一个 skill 就算认可，不满意就 `--rebuild`（只在产出该产物的阶段、其允许的状态上可用——`design` 没有 `--rebuild`，精确规则见状态机）或 `reflow`。全自动的 `auto` 模式连主讲也省了，只在真正需要你拍板或可能丢工作的地方才停。

## 设计决策

几条贯穿全流程的设计选择。

**1 · 方向决策归你，执行归 AI。**
范围边界、技术选型、要不要回退、验收过不过——这些 rivo 会停下来问你，哪怕在全自动的 `auto` 下也必停；其余的执行与规范性（按流程跑、过门禁、写测试）交给 AI。这不是立场，是分工：当前 AI 在方向判断上还不够稳，把这些点留给人，是为了少返工。

**2 · 文档是唯一交付物。**
skill 之间不靠对话记忆传递信息，只靠文件路径：`issue` 产出 PRD，`spec` 读 PRD 产出 spec，`plan` 读 spec 产出 plan.md，`code` 读 plan.md……每一步的输入都是上一步落在磁盘上的文件。好处很实在——决策有书面依据可审计；subagent 能在自己的上下文里展开、最后只把路径交回主线；长对话不必背着全部历史；换个工具（今天 Claude Code、明天 Codex）文档照样能读。

**3 · 单向数据流，显式回退。**
阶段单向推进：方案基于需求，测试基于方案。但现实里上游的坑常常到下游才暴露，外部也会变（三方库出事、需求改了）。`reflow` 就是那条显式回退的路——它诊断、给建议，不 rewind 已有产物，由你决定回到哪一步。这和真实产研里的"变更流程"是一回事。

**4 · 代码是唯一真相，spec 会漂移。**
有些 spec-driven 框架把 spec 当成长期维护的事实源，代码和 spec 不一致时以 spec 为准。rivo 反过来：需求一旦交付，真相就活在代码里，那份 spec 当场开始过时。所以 rivo 靠 `survey` 去读代码理解现状，而不是翻旧 spec；一个 issue 的全部产物只服务一个目的——把这次任务做对——交付后整个 issue 归档，不再回头维护。下次理解系统，还是回到代码。

**5 · 跨 issue 的系统设计有处可栖。**
单个 issue 的 spec / plan 交付即归档、不再维护；但「这系统整体长什么样」需要一个持久的家——`ARCHITECTURE.md`：`init` 播种，`plan` 读它做架构决策，`review` 拿它的不变量当尺子，`archive` 在架构变动时把它同步回代码。它和 #4 不冲突：代码仍是实现的唯一真相，ARCHITECTURE.md 是与代码对齐的**骨架与意图**（慢变、冲突时以代码为准），不像 spec 那样会被推翻式漂移。配合记录项目身份与规约的 `PROJECT.md`，这是 rivo 仅有的两份跨 issue 维护的文档——也是它约束「架构逐渐失控」的抓手。

## 目录结构

```
your-repo/
├── .rivo/
│   ├── PROJECT.md              # 项目宪章：身份/能力/技术栈/规约（/rivo:init）
│   ├── ARCHITECTURE.md         # 技术架构：模块/数据流/存储/不变量（init 播种，archive 同步）
│   ├── issues/<id>/            # 进行中或已澄清的 issue
│   │   ├── README.md           #   需求描述 + 状态（PRD）
│   │   ├── spec.md             #   验收标准（EARS）
│   │   ├── plan.md             #   技术方案
│   │   ├── test-cases.md       #   测试用例
│   │   ├── context.md          #   代码现状（survey 内部，可选）
│   │   ├── surveys/            #   外部调研（survey 外部，可选）
│   │   ├── design/             #   设计稿 + demo（design，可选）
│   │   ├── reviews/            #   评审记录（review）：reviews/<type>.md，type ∈ prd/spec/plan/test-cases/code
│   │   ├── reflows/            #   诊断报告（reflow，可选）
│   │   ├── uat.md              #   验收记录（uat，可选）
│   │   ├── handoffs/           #   上下文 checkpoint（handoff，可选）
│   │   └── assets/             #   截图 / PRD / 外部文档（用户放入，可选）
│   ├── archived/<id>/          # 已归档的 issue（同上结构）
│   └── learnings/<slug>.md     # 跨 issue 的踩坑 / 模式沉淀
└── ...                         # 你的源代码
```

rivo 只在你当前所在的分支上产出（issue 产物与源码改动都落在这）；要不要为每个 issue 开独立分支、怎么合并清理，按 `PROJECT.md` 的分支约定来——rivo 不自建分支、不 merge。

## 适用边界

rivo 以**单个 issue 的串行交付**为设计中心。几件事它有意不内建，交给你：

- **并发 / 协作**：多 issue 并行、团队多人隔离，靠你的分支策略（`PROJECT.md` 约定）承载，rivo 不做跨 issue 协调。
- **issue 粒度**：一个需求若大到要拆成多个独立可交付的增量，建议拆成多个 issue——rivo 提醒，但不替你切。
- **非需求驱动的维护**（热修 / 依赖升级 / CVE）：可以照走一个轻量 issue（`survey → plan → code` 的 TDD 仍适用），也可以不接入 rivo 直接改。rivo 不强求一切都进流程。

## 平台无关

rivo 基于 [Agent Skills](https://agentskills.io) 开放标准构建，同一套 skill 文件可以在任何支持该标准的 AI 工具里工作——它的方法论、文件约定、状态机不绑定任何特定 host。

落在 Claude Code 上时，它顺手用了几个原生能力：skill 参数（`/rivo:issue <id> --rebuild` 这类调用）、subagent（把 survey / review 这种重读型工作派出去，主对话只留汇总）、调用控制（让 `reflow` 只能由你显式触发）、以及检测可用的跨厂商模型来做真正的跨模型评审。换个 host，这些细节会变，核心不变。
