---
name: verify
description: 按验收标准逐条人工走查，收集反馈
when_to_use: build 完成后、archive 前，对交付做人工验收时使用
argument-hint: <issue-id>
arguments: [issue_id]
---

# 人工验收

按 spec 的 AC 逐条走查，指引用户亲手验证功能是否满足预期，把结论落到 `uat.md`。全部通过进 **archive**，有缺陷交给 **backtrack** 定位并修复。

若 [using-rivo](../using-rivo/SKILL.md) 总纲尚未在上下文中，先读它。

## 获取必要的上下文

0. 读 `.rivo/issues/$issue_id/handoff.md`（如有），定位现状与本轮验收范围
1. 读 `.rivo/issues/$issue_id/spec.md` —— 验收的唯一标准
2. 读 `.rivo/issues/$issue_id/prd.md` —— PRD 的核心场景
3. 若存在 `.rivo/issues/$issue_id/ui-contract.md`，读它 —— UI 验收依据
4. 读本次源码改动（git diff）—— 确认实际交付了什么

## 逐条验收

按 spec 的 AC 逐条列出，让用户逐条确认。每条给三个选项：

- ✅ 通过 —— 行为完全符合
- ⚠️ 有缺陷 —— 行为偏离，但功能在
- ❌ 未实现 —— 完全不符合或缺失

涉及 UI 的，指引用户起项目实际看、实际点——不跑起来看不算验收。

验收结论按 [templates/uat.md](templates/uat.md) 落到 `.rivo/issues/$issue_id/uat.md`。如果是回溯修复后的重新验收，在 uat.md 中追加新记录（标注轮次），不覆盖上一轮的结果。

## 分流

- **全部通过** → 下一步 **archive**。
- **有任一 ⚠️ / ❌** → 用 **backtrack** 技能，逐条把缺陷交给它定位根因层并修复。返工修复完成后，回到「逐条验收」重新验证。

## 收尾

全部通过后：

- 用 **handoff** 技能更新交接纪要
- 提交 `docs: uat $issue_id`
- 总结：通过的 AC 数量、验收轮次（如有回溯返工）
- 交代产物和下一步

## 核心原则

- **AC 是唯一标准** —— 验收依据是 spec 的 AC，不是主观感觉
- **UI 验收必须运行项目** —— 涉及 UI 的必须起项目实际查看，光读代码不算
- **判定与回退分离** —— verify 只判 ✅ / ⚠️ / ❌ 并写进 uat.md，缺陷修复交给 **backtrack**
- **重新验收追加记录** —— 返工后复验不覆盖上轮 uat.md，追加记录保持可追溯

## 危险信号

- 「代码看着没问题，UI 不用跑了吧」—— UI 的正确性在屏幕上，不在代码里。
- 「这个 AC 有点偏差但差不多，算通过吧」—— AC 没有「差不多」，偏差就是有缺陷。
- 「顺手把缺陷在 uat 这里改了得了」—— 验收不改代码，修复一律走 **backtrack**。
- 「用户提了个新想法，顺手加到这次验收里」—— 新想法 = 新 issue，不混入本次验收。
