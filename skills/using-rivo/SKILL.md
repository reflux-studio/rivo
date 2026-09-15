---
name: using-rivo
description: Rivo 全局规约与技能路由，确保选择正确入口并遵循协作纪律。
---

# Using Rivo

## 规约

加载技能再动手。拿不准用哪个时先看路由表——不确定不等于不需要。

阶段技能各自调查、协作和保存产物。无需为写文件切换技能，无需制造中间状态文件或仪式性文档。

建模贯穿需求、设计与实现，不是独立阶段。重要选择可通过 architecture-decisions 记录 ADR，但不强制。

只请求评审、整理或局部问题时完成该范围，不自动扩展为完整交付。已有充分依据可直接进入后续工作，小改动无需补齐所有文档。

用户指令（CLAUDE.md 等）优先于技能约定。

## 路由

| 当前工作 | 技能 | 产物 |
| --- | --- | --- |
| 核实现状、推演业务规则、定义或整理需求 | [requirements-definition](../requirements-definition/SKILL.md) | spec.md |
| 形成或整理技术模型、契约与交付安排 | [technical-design](../technical-design/SKILL.md) | plan.md |
| 实施、审阅、验证与处理新发现 | [incremental-delivery](../incremental-delivery/SKILL.md) | 代码、测试与审阅记录 |
| 集中比较或记录重要选择 | [architecture-decisions](../architecture-decisions/SKILL.md) | ADR |
| 查找、核实或维护跨需求知识 | [knowledge-management](../knowledge-management/SKILL.md) | 当前结论与有效来源 |
| 用失败测试驱动行为实现 | [test-driven-development](../test-driven-development/SKILL.md) | 实现与回归证据 |
| 从证据定位异常 | [systematic-debugging](../systematic-debugging/SKILL.md) | 原因与修复依据 |

独立能力（TDD、调试、ADR、知识管理）按问题使用，不作为必经环节。
