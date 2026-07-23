# 交付状态示例

交付状态是 Team Lead 维护的账本，默认位于 `.rivo/issues/<slug>/state.md`。宿主有工单或原生状态机制时可以映射过去，字段名不必一致，语义不能缺失。当前状态直接反映在字段里，不能要求读完整个历史才能判断下一步。

```markdown
# 订单导出 CSV — 交付状态

- 原始请求：用户需要把筛选后的订单导出成 CSV（2026-07-21，会话）
- 入口：requirement——改变用户能力
- 当前状态：system-design 发现处理中
- 下一步：Engineer 回应 R-4；若不修改，提交正式理由给 Designer 复核

## 产物

| 类型 | 负责人 | 位置 | 当前版本 | 状态 |
| --- | --- | --- | --- | --- |
| requirement | Product | ./requirement.md | r3 | 已放行 |
| system-design | Engineer | ./system-design.md | r1 | 发现处理中 |
| 实现 | Engineer | ./implementation.md + 源码仓库 | — | 未开始 |

## 记录

| 类型 | 位置 | 最新结论 |
| --- | --- | --- |
| 交叉评审 | ./reviews.md | requirement 已通过；system-design 有 1 条待处理 |
| 独立验证 | ./verification.md | requirement 已通过；system-design 待验证 |
| UAT | ./uat.md | 未开始 |
| 发布 | ./release.md | 未开始 |

## 未关闭发现

| # | 来源 | 对象 | 严重度 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| R-4 | Designer 交叉评审 | system-design r1 | 一般 | 待处理 | Engineer 修改或说明不处理理由 |

## 待响应通知

| 上游版本 | 接收人 | 回复 |
| --- | --- | --- |
| requirement r3 | Engineer | 需要更新（已发布 system-design r1） |

## 用户决定

| 决定 | 状态 |
| --- | --- |
| 导出上限 1 万行，超出提示分批 | 已同意 |

## 历史

- 07-21 requirement r1 发布；Engineer 评审提出容量问题
- 07-22 requirement r3 的发现全部已解决或跳过，放行；system-design r1 发布
```

状态只呈现当前现场。每条发现的完整内容、作者回应、跳过理由和裁决留在 `reviews.md` 或 `verification.md`，不复制进状态。
