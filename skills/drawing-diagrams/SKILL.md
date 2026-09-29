---
name: drawing-diagrams
description: 按 Rivo 的图的标准画 before/after 图：嵌入 Markdown 的 SVG 并保留图源，优先用支持 SVG 交付的 Archify，没有时手写 SVG。用户要求用 Rivo 画图、点名本技能或继续已有需求目录时使用；confluence、course、flow、delta、investigating 等 Rivo 技能需要画图时也会加载。
---

# 画图

开始时声明："正在使用 rivo:drawing-diagrams，按图的标准画出这次要说明的关系。"

图是减少认知债务的手段：before/after 对照让读者一眼看出这次改了什么、没改什么。本技能是方法技能，只负责把图画对、画清楚，结果交回调用它的流程技能，不建立自己的进度或阶段。

## 图的标准

- 技术方案、调查笔记和知识库里的图是嵌入 Markdown 的 SVG，同时保留能重新生成它的图源。
- 结构、流程或状态发生变化时，同时给出 before 和 after。同一对象在两张图里使用相同的 ID 和相近的位置，读者对照时只需要看变化的部分。
- 正文用文字讲清图里的关键关系，只读文字也能理解；图帮助理解，规则仍写在正文里。
- 给人读的文档不使用 ASCII 图：中文和非等宽字体下它会错位。

一张图回答一个主要问题。组件协作用架构图，操作顺序用流程图，调用和回调用时序图，状态转换用生命周期图，数据流转用数据流图。内容多时拆成几张用途明确的图。图中文字使用业务名称，并与正文里的代码标识对应。

## 什么时候画

- 讨论开始、呈现现状时，先画 before，和用户对"现在是什么样"达成一致，再讨论改变。
- plan.md 凡涉及结构、流程或状态的变化，必须有 before/after，嵌在对应说明旁。
- 知识库维护当前的图。验收后按实际实现核实 after，再更新知识库里的当前图，已有对象保留原来的 ID。

## 先画对

before 只画已核实的对象和关系：连线要有调用、配置或运行证据，代码存在不等于已经接入。核实不了的关系在正文里说明未知。沿用知识库或历史方案里的图之前，先按当前代码核对。

after 从核实后的 before 复制而来，保留相同对象的 ID 和布局，再画出新增、修改和移除。讨论中的 after 是候选，展示时说明它尚未被决定。

## 选择实现方式

**第一选择是 Archify。** 能力以命令行实际输出为准：先找到 Archify 的安装位置：技能列表里名为 archify 的技能所在目录，以及 `~/.claude/skills/`、`~/.agents/skills/`、宿主插件目录下的 `archify/`，用文件系统查找 `bin/archify.mjs`。Archify 是技能，工具搜索找不到不能说明未安装；以上位置都找不到 `bin/archify.mjs`，才算没有可用的 Archify。对每个找到的 Archify 运行

```bash
node <archify-root>/bin/archify.mjs --help
```

输出中 `deliver` 的用法行列出 `--format`，且取值包括 `svg`（形如 `[--format html|svg]`），这份 Archify 才可用。环境中可能有同名但只能交付 HTML 的版本，判断只看这一行。

**没有可用的 Archify 时，手写 SVG。** 先读 [手写 SVG 规范](references/hand-drawn-svg.md)，按其中的配色变量、节点样式和 before/after 共用布局来画。向用户说明本次用的是手写 SVG，以及没有采用 Archify 的原因（未安装，或已安装版本的 deliver 不支持 SVG，写明版本位置）。

## 用 Archify 交付

加载 archify 技能，按它的 schema 编写图源、用 `validate` 修复诊断。before 和 after 分别交付 SVG：

```bash
node <archify-root>/bin/archify.mjs deliver <type> before.<type>.json before.svg \
  --format svg --theme auto --quality showcase --json > before.receipt.json
```

`--theme auto` 让 SVG 随阅读环境切换明暗。交付以退出码为准：非零退出时输出路径上可能还是上一次的产物，不能当作本轮结果。按诊断修改图源后重新交付。按 archify 的修复规则连续两轮没有改进时，停下来报告未解决的诊断，由用户决定是继续修还是改用手写。

需要交互式对照时，另外生成对照页作为评审附件，正文仍嵌入两张 SVG：

```bash
node <archify-root>/bin/archify.mjs compare architecture \
  before.architecture.json after.architecture.json compare.html \
  --receipt compare.receipt.json --json
```

`compare` 只支持架构图，其他类型的 before/after 靠两张 SVG 和正文对照。

## 校验与视觉检查

检查分三件事，分别报告实际做了哪些、结果如何：

1. **自动校验。** Archify 看交付回执里的 `ok`、`format`、`theme`、`validation` 和 `svgValidation`；手写 SVG 看手写规范里的校验。
2. **视觉检查。** 把 SVG 在浏览器中打开或渲染成图片后查看，暗色用浏览器的暗色模式，看节点文字、连线含义、遮挡、裁切、明暗两种主题和正文中的阅读尺寸。自己无法看图时，请用户查看。archify 的 `visual-check` 面向 HTML 交付物，SVG 按这里的做法检查。
3. **事实核对。** 图中每个对象和关系与已核实的事实、讨论中的决定一致。

回执只证明自动检查通过，不证明图中事实正确，也不证明好读。没有做的检查就说没有做。

文件生成了不等于用户看到了。用宿主支持的方式把 SVG 展示给用户；无法内嵌时打开实际文件，并说明显示上的限制。

## 保存与嵌入

图存放在需求目录 `.rivo/issues/<slug>/assets/` 下，按图的类型或主题分子目录，例如 `assets/architecture/`：

| 文件 | 内容 |
| --- | --- |
| `before.<type>.json`、`after.<type>.json` | Archify 图源 |
| `before.svg`、`after.svg` | 嵌入正文的图；手写时 SVG 本身就是图源 |
| `*.receipt.json` | Archify 交付和对照回执 |
| `compare.html` | 需要时生成的交互式对照页 |

其他图按用途命名，例如 `approval.sequence.json` 与 `approval.svg`。输出路径写明确的项目内路径，不写进插件安装目录。知识库里的图按 delta 的知识维护参考存放。

在对应段落用相对路径嵌入，替代文字概括图的结论：

```markdown
![审批以模板为单位，全部模板通过后活动归档](assets/approval/after.svg)
```

## 交回与修订

画图本身不批准新的行为或技术选择。画的过程中发现图改变了已有的决定或方案里的关系、契约，停下来交回调用本技能的流程技能。讨论或写方案阶段，冲突交回当前的 confluence 或 course。方案获批后，按冲突的对象分流：违反某份 ADR 的，回到 confluence 由用户决定；改变 plan.md 写明内容的，由 course 修订 plan.md、全量重审，告诉用户改了什么、为什么，由用户确认；方案没有写到的纯实现选择，由主代理决定并记进 task.md。

修订图时改图源并重新交付，再核对图源、SVG 和正文三者说的是同一件事。修订后的图只表达当前的做法，读起来应当像第一次就画对了：删除错误的对象和连线，在原处重画受影响的部分，不在图上叠加删除线、"已废弃"一类的标注，也不因为一次纠正在正文旁追加"不要……""而不是……"的否定句。before/after 是有意保留的对照，不属于这种补丁。改名或批量修改后，先在图源、SVG 和正文里自查残留，再交回。
