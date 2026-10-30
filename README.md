<div align="center">

# Rivo

**设计由你主导，AI 查证、实施，并把理由留下来。**

面向 Claude Code 与 Codex 的产品、开发和测试协作技能 · v1.2.0 · MIT

[为什么](#为什么) · [从你正在做的工作开始](#从你正在做的工作开始) · [一次需求怎样走完](#一次需求怎样走完) · [安装](#安装) · [技能](#技能) · [参与修改](CONTRIBUTING.md)

</div>

## 为什么

AI 让交付变快了，但人的理解未必跟得上。代码已经能运行，团队却说不清为什么这样设计、哪些约束不能改。等到下一次需求，又要让 AI 从代码里重新查一遍。交付速度超过理解形成的速度，欠下的就是认知债务。

留下文档也不一定解决问题。方案写的是当时准备怎么做，实际接入时可能已经换了做法；设计理由没有留下，或者知识停在旧版本，新会话依然得从头调查。需求、计划、代码如果只向前传递，实施和测试中发现的新事实就很难回到原来的判断里。这是瀑布式单向交接的问题，不能靠先把需求写得更长来解决。

Rivo 把这些往返放进工作过程。你参与会改变业务和系统认识的重要取舍，AI 查清事实、核对假设，把做法和理由写成同事能读懂的方案。实施和专业测试继续检验这些认识，遇到差异就带着证据交回有权处理的人。用户验收后，再对照实际结果整理知识，供下一次工作读取和核实。

你可以只用产品、开发或测试中的一部分，从手头已有的材料开始。下面先看各自怎样工作，再把它们接成一次交付。

## 从你正在做的工作开始

先安装公共 `rivo`，再选一个需要的领域包，就可以开始。输入可以是本地文件、文档链接、粘贴的内容或同事交来的材料，不要求其他角色也安装 Rivo。

下面始终用一个**说明案例**：供应商档案支持多个联系人，其中只能有一个生效的主联系人。

### 我负责开发，已经拿到了需求

安装 `rivo` 和 `rivo-development`，把需求、设计和代码位置交给 AI，也可以附上自己的拆解：

> 用 Rivo 开发供应商多联系人功能。需求和设计在这里。我想先拆成联系人维护、主联系人切换和旧接口适配。请核对这个拆解，查清现在的数据和权限，再讨论需要决定的问题。

AI 先查现有调用和存储：主联系人由哪个字段确定，权限在哪里校验，旧接口怎样读写联系人。你和 AI 据此讨论唯一来源、兼容方式和重要取舍。做法确认后，写成可审阅的技术方案；获得实施授权，再按任务实现、自测并安排独立审阅。涉及界面时，执行者和审阅者都要对照实际设计稿。

开发 AI 最后交出可提测版本，说明自测和审阅覆盖了什么、还有哪些限制，交给用户、人类测试同事或已登记的测试参与方。开发无需先安装测试包，也不需要替测试同事另建一套用例。开发完成、专业测试通过和用户验收是不同的结论。

### 我负责测试，要验证一个版本

安装 `rivo` 和 `rivo-testing`，给出需求、设计、待测版本、环境和可用账号：

> 用 Rivo 测试供应商多联系人功能。需求、设计和提测说明在这里。先按风险设计用例，再检查主联系人切换、停用和权限，保留刷新后的实际结果。

AI 先核对预期和可观察结果，设计场景，再通过已连接的工具执行接口、集成或用户流程检查。没有环境时，也可以先设计用例，把执行所需条件交回团队；不要求完整源码或产品、开发插件。

你判断规则歧义和剩余风险需要谁处理。测试 AI 发现差异后，留下版本、步骤、预期、实际结果和证据，交给开发修复；收到修复版本后，先复验原问题，再按影响做回归。测试 AI 维护自己的用例、脚本和报告，不修改产品代码，也不为了通过测试改掉原来的预期。最终交给用户或有权负责人的是已测结果、缺陷与验证缺口，由他们决定风险是否接受、交付是否验收。

### 我负责产品，想把问题变成可交付的需求

安装 `rivo` 和 `rivo-product`，从访谈、反馈、现有流程或初步想法开始：

> 用 Rivo 梳理供应商多联系人需求。这些是业务反馈和现有流程。请先查清大家遇到的问题，再一起确定主联系人和停用规则，写出开发、测试都能使用的需求。

AI 帮你区分反复出现的问题、个别建议和待验证假设，按需要开展研究、比较选择或设计交互。你决定目标、范围和业务取舍。在这个例子中，“停用联系人不能设为主联系人”“停用当前主联系人之前必须先选新主联系人”需要在需求和界面状态里说清，不能留给实现者自行猜测。

当前工作可以结束于研究结论、需求或产品设计，不必一直走到代码。交给开发和测试时，说明依据、已确认规则、验收标准和仍待回答的问题。后续技术或测试反馈改变了原来认识时，由产品负责人修订对应需求与设计。

## 一次需求怎样走完

下面用产品 AI、开发 AI 和测试 AI 表示分别承担这些工作的会话。它们围绕同一需求协作；其中任一角色也可以由你的同事承担，你也可以只在某一段使用 Rivo。

<p align="center">
  <img src="assets/readme-delivery.svg" width="980" alt="Rivo 典型交付：产品 AI 澄清需求，开发 AI 讨论、写方案并实施，测试 AI 提前设计用例、执行与复验；确认点由你或有权负责人处理，新约束和缺陷带着证据返回对应环节。">
</p>

图中的确认点由你或有权负责人处理。测试可以提前设计用例，实施和测试中的新发现也可以回到讨论。

| 走到哪里 | 这次要弄清什么 | 接下来交给谁 |
| --- | --- | --- |
| 澄清需求 | 多联系人解决什么问题，主联系人与停用有哪些规则 | 开发讨论技术做法，测试提前设计场景 |
| 讨论与方案 | 规则由哪里保证，怎样接入现有系统，为什么这样选 | 用户确认重要取舍，独立审阅者核对方案 |
| 实施与接入 | 代码是否实现方案，现实依赖是否符合假设 | 开发审阅后交提测；新问题交对应负责人 |
| 专业测试 | 当前版本的实际行为是否满足需求和设计 | 开发修复差异，测试复验和回归 |
| 验收与知识 | 用户是否接受结果，哪些认识已经得到核实 | 留给维护者和下一次需求 |

### 先把规则与做法讲明白

产品负责人确认主联系人与停用规则、产品 AI 更新需求后，开发 AI 进一步查证：是不是多个页面各自维护一个“主联系人”标记？历史数据会不会有两个主联系人？旧接口是否也能修改它？讨论要把唯一来源、权限校验、存储约束和旧接口适配放到真实调用链里看。需要取舍时，AI 带着依据和可选做法回来，由用户或有权负责人决定，理由随决定留下。

技术方案解释数据怎样流转、规则在哪里保证、失败时用户会看到什么。方案接受独立审阅，检查有没有遗漏需求、职责是否合理、验证能否证明承诺。人也要能读懂并讲清方案，讲不清的地方继续讨论。测试 AI 此时就可以依据需求和设计准备切换、停用、权限与重复操作等场景，不必等实现完成；测试设计也不构成开发开工的额外前提。

### 用实施中的新事实修正原来的认识

实施按任务推进，每项任务先自测，再做独立轻审，重点看该任务的验收、契约、明显缺陷和首次形成的重要结构。集成完成后再做整体独立审阅，检查跨任务影响和整体完成度，不能把各任务通过简单相加当作整体通过。执行者与审阅者都对照需求、技术方案和实际设计。

接入时，开发 AI 发现旧接口会整组覆盖联系人。两个人分别修改不同联系人，后保存的人可能覆盖前一个人的更新。这个事实影响了原方案的并发假设，AI 需要说明现有行为、影响范围，以及局部更新、版本校验等可选做法和代价，交有权负责人处理。如果需要改变交互或业务规则，就请产品负责人调整；技术方案与实现由开发调整。重要取舍仍由用户或有权负责人决定。

受影响的任务暂停，其他任务可以继续。确认修订后，从受影响的依据开始同步方案、任务和代码，再继续验证。这样，接入时遇到的事实会改变原来的设计，也会留下改变的理由。

### 让测试反馈回到可复验的版本

<p align="center">
  <img src="assets/readme-feedback.svg" width="920" alt="需求与缺陷的协作往返：开发 AI 向产品 AI 提出需求疑问，负责人确认后更新需求；测试 AI 记录缺陷，开发 AI 修复并提供新版本，测试 AI 再复测回归。">
</p>

开发 AI 交提测后，测试 AI 发现：连续切换主联系人，页面提示成功，刷新却又回到旧值。测试 AI 按实际版本记录复现步骤和持久化结果，交给开发 AI 核对。开发 AI 定位并修复自己负责的代码，重跑受影响自测，提供明确的修复版本。

测试 AI 确认环境里实际运行了新版本，再重复原步骤，检查刷新后主联系人是否正确，并回归停用、权限和重复操作。报告保留原始失败，也说明本轮通过、失败、受阻和未执行的部分。开发自测、独立审阅和专业测试分别说明依据与覆盖范围；同一会话切换角色不能因此算作独立质量保证，缺少独立能力时如实报告。

### 验收后留下下一次能用的知识

用户验收后，在收尾授权范围内，把已实现、已核实的机制和理由写回知识：主联系人由哪里确定，停用前为什么要先选新主，旧接口如何兼容，并发修改受到什么保护。写入时对照当前代码和验证结果，注明版本、适用范围和仍未验证的部分，不能把方案目标直接写成系统现状。

下一次需求增加联系人导入入口，AI 先读这些知识，再核对当前实现。新入口也要遵守同一套主联系人和停用规则，已有理由能帮助人理解为什么；如果实现或依赖已经变化，就重新核实并修订。知识因此有机会被持续使用和纠正，而不是写完就放下。

### 材料和反馈怎样传递

协作按产物归属进行：产品维护需求与设计，开发维护技术方案和产品代码，测试维护用例、脚本和报告。参与方与主要材料位置记在精简工单里，协作记录指向问题详情和实际产物。文件、链接或人类转交都能接续，不要求 Agent 直接通信。

AI 查资料、运行系统或发送协作请求时，使用当前已经连接且获授权的工具。宿主支持直接交流、用户也授权联系对应参与方时，才通过通信工具发送；否则保留待转交记录，说明需要谁处理。工具或环境不足时，报告未完成的范围与解除条件，继续不依赖它的工作。

换个会话时，给出需求目录或材料，说“用 resume 了解这个需求并继续”。AI 先核对自己的职责，再对照当前产物、协作记录、代码和验证证据恢复工作。已有目录继续沿用，只创建本次需要的材料；位置约定见[共享工作区](skills/using-rivo/references/workspace.md)，各领域产物见[产品](skills/using-rivo/references/product.md)、[开发](skills/using-rivo/references/development.md)、[测试](skills/using-rivo/references/testing.md)。

## 安装

先添加市场并安装公共包，再选择需要的领域包。下面以开发为例。

**Claude Code**：在会话中运行：

```text
/plugin marketplace add reflux-studio/rivo
/plugin install rivo@rivo
/plugin install rivo-development@rivo
```

**Codex**：在终端运行：

```sh
codex plugin marketplace add reflux-studio/rivo
codex plugin add rivo@rivo
codex plugin add rivo-development@rivo
```

做产品或测试时，将示例中的 `rivo-development@rivo` 换为 `rivo-product@rivo` 或 `rivo-testing@rivo`。需要多个领域时分别安装，公共包只安装一次。安装后开启新会话，说“用 Rivo”并描述当前工作即可。

公共方法也可以单独使用：

> 用 investigating 查清旧接口怎样更新联系人。
>
> 用 writing-clearly 编辑这份报告，保留现有结构。

普通请求按普通方式处理。项目里有 `.rivo/` 目录，不会让每个请求都进入完整流程。

## 技能

| 包 | 技能 |
| --- | --- |
| 公共 | [using-rivo](skills/using-rivo/SKILL.md)、[collaborating](skills/collaborating/SKILL.md)、[resume](skills/resume/SKILL.md)、[writing-clearly](skills/writing-clearly/SKILL.md)、[investigating](skills/investigating/SKILL.md)、[dispatching-subagents](skills/dispatching-subagents/SKILL.md)、[revising](skills/revising/SKILL.md)、[knowledge-management](skills/knowledge-management/SKILL.md) |
| 产品 | [discovering-products](plugins/rivo-product/skills/discovering-products/SKILL.md)、[market-research](plugins/rivo-product/skills/market-research/SKILL.md)、[competitive-analysis](plugins/rivo-product/skills/competitive-analysis/SKILL.md)、[user-research](plugins/rivo-product/skills/user-research/SKILL.md)、[writing-prds](plugins/rivo-product/skills/writing-prds/SKILL.md)、[designing-products](plugins/rivo-product/skills/designing-products/SKILL.md)、[reviewing-metrics](plugins/rivo-product/skills/reviewing-metrics/SKILL.md) |
| 开发 | [converging](plugins/rivo-development/skills/converging/SKILL.md)、[writing-plans](plugins/rivo-development/skills/writing-plans/SKILL.md)、[implementing-plans](plugins/rivo-development/skills/implementing-plans/SKILL.md)、[systematic-debugging](plugins/rivo-development/skills/systematic-debugging/SKILL.md)、[test-driven-development](plugins/rivo-development/skills/test-driven-development/SKILL.md) |
| 测试 | [designing-tests](plugins/rivo-testing/skills/designing-tests/SKILL.md)、[testing](plugins/rivo-testing/skills/testing/SKILL.md)、[reporting-defects](plugins/rivo-testing/skills/reporting-defects/SKILL.md) |

[using-rivo](skills/using-rivo/SKILL.md) 是统一入口。需要模板或委派提示词的技能，在自己的 references 中维护，方法按名称加载。设计原则及其来由见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 本地检查

运行 `python3 scripts/check-package.py` 核对四包结构与 Hook 输出，运行 `python3 tests/check-distributions.py` 检查隔离组合、负例与本地并发登记。站点使用 `pnpm --dir site typecheck` 和 `pnpm --dir site build`。这些检查不替代真实宿主安装、Agent 行为试用或浏览器验证。

## 许可证

[MIT](LICENSE)
