---
name: design
description: 用项目现有前端栈搭 UI 壳——路由、页面、组件、mock 数据，纯 UI/UX、零业务逻辑。用户想看界面、做原型 / demo、还原设计稿或搭页面时用。
argument-hint: <issue-id>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git add *), Bash(git commit *), Bash(git status *)
---

<SUBAGENT-STOP>
若本次是被父级 agent 以具体子任务派发（prompt 已含明确任务），忽略本 SKILL.md 的流程编排与前置检查，只完成 prompt 指定的子任务。
</SUBAGENT-STOP>

# /rivo:design —— 还原 / 搭建 UI 壳

像"CSS 还原"岗那样，用**项目现有前端栈**把界面搭出来：路由、页面、跳转、组件、mock 数据。

铁律：纯 UI/UX 视角，零业务逻辑。不接真实接口、不写状态逻辑、不碰后端——那些全留给 `/rivo:code`。这一步只交付一个可点击、可跳转、视觉符合预期的静态 UI 壳。

## 任务清单

1. **前置检查** —— `.rivo/` 在、`status` 为 `planned`（UI 先行见下）、`plan.md` 在、spec 涉及 UI（纯后端跳过）
2. **读 learnings** —— 扫 `.rivo/learnings/` 里 UI 还原、组件复用相关的踩坑
3. **盘点现有组件** —— 调 `/rivo:survey` 内部分支摸前端栈，记 `design/components.md`
4. **探测设计源** —— 按保真度从高到低：Figma MCP → 设计产物 → 截图 → greenfield
5. **还原 UI 壳** —— 搭路由、页面、组件、mock 数据，UI 方向决策一次一个问你定（带推荐）
6. **视觉验证 + 用户确认** —— 起项目看运行效果，请用户肉眼确认
7. **commit** —— `design: <id> UI 壳`，状态不变
8. **结束语** —— 交代产物、关键决策、下一步

## 工作流程

**前置检查**

- `.rivo/` 不存在就引导用户先跑 `/rivo:init`，然后退出。
- 从 `$ARGUMENTS` 取 issue-id，读 `README.md` frontmatter 确认 `status` 是 `planned`（即已过 plan）。**UI 先行例外**：若用户确认要在 plan 之前先搭 UI 探索方向，可放宽到 `specified`（spec 已在、可据以界定 UI 范围）；此时 `plan.md` 尚不存在属正常，不要据此报错。
- 常规顺序 plan → design → code 下 `plan.md` 应已存在；缺失且非 UI 先行场景就提示先跑 `/rivo:plan`。
- 只有 spec 涉及 UI 时才需要这个 skill，纯后端需求直接跳过。

**盘点现有组件**

先摸清项目前端再动手：调 `/rivo:survey` 内部分支看技术栈、组件库 / 设计系统、设计 token、现有页面与路由约定。还原时优先映射到已有组件，不要凭空造新的视觉原语——这是 B 端（antd 等）保持一致、避免返工的关键。把组件清单记入 `design/components.md`。

**探测设计源**

按保真度从高到低探，探到哪档用哪档：

1. **Figma 等设计工具 MCP** —— 语义检测当前会话有没有 Figma 类 MCP 能力（不硬编码工具名）。有就直接拉 frame、组件、间距、色板等结构化数据，保真最高；没连接就提示用户导出截图，降到第 3 档。
2. **已产出的设计产物**（设计稿、HTML 原型等）—— 本地化接入：把视觉意图映射到项目真实组件，而不是照搬它的私有样式。
3. **仅截图**（设计图、原型图、手绘，多在 `assets/`）—— 靠模型视觉能力还原，逐区域识别组件、布局、模式，尽量映射到已有组件。
4. **无设计源**（greenfield）—— 从 spec 加品味生成。检测到 `frontend-design` 等能力就复用，没有就自由发挥。rivo 不解决设计风格，只管交付流程。

**还原 UI 壳**

按所选来源搭路由、页面、跳转、组件，填 mock 数据。UI 方向上的开放决策（布局取舍、交互细节）一次一个、带推荐地问用户定——这是 taste，只在用户脑子里，逐项对齐。全程保持零业务逻辑。

**视觉验证与收尾**

- design 的产物是视觉的，正确性靠看运行效果，不靠跨模型代码评审——所以**不走 `/rivo:review`**。
- 检测到 `webapp-testing` 或浏览器能力，就启动 UI、截图运行页面，和设计源做视觉比对，对差异迭代；截图存 `design/`。没有浏览器能力就把启动命令告诉用户，请他在本地起项目肉眼比对。
- 请用户看**实际运行**的 UI 并明确确认（光说 "OK" 不算，要看过运行效果）；要求修改就改完重起再看。
- 用户确认后提交 `design: <id> UI 壳`，**状态保持不变**（常规为 `planned`；UI 先行场景为 `specified`——此时仍须回跑 `/rivo:plan` 才能把 `specified` 推进到 `planned`，design 不承担该跃迁）、更新 `updated`。
- 结束语交代产物（前端代码、`design/` 截图与说明、`components.md`）、所用设计源与组件映射、UI 取舍（至多 3 条）、下一步 `/rivo:code <id>` 填业务逻辑。

## 核心原则

- **零业务逻辑** —— 只搭壳，不接口、不状态、不后端。
- **优先复用已有组件** —— 不凭空造视觉原语，一致性和免返工都靠这个。
- **眼见为实** —— 正确性靠看运行效果，不靠代码评审。
- **不管设计风格** —— rivo 只管交付流程，风格好坏不在它职责内。
- **不参与回退** —— design 是 planned 态内的脚手架 UI 子步骤，不进 reflow 产物链、也没有 `--rebuild`。code 收尾后 UI 真相活在代码里，UI 方向问题在 code 阶段直接迭代或另开 issue。

## 反例

**"为了让界面动起来，顺手接了真实接口、写了点状态逻辑"** —— 这就破了零业务逻辑的铁律。design 只交付静态可点的 UI 壳，数据用 mock；接接口、写状态是 code 的事。
