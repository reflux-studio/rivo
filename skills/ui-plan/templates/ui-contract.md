# UI 契约 — <特性名称>

> 用户走查通过后填写：基于已实现的 UI 代码如实记录页面、组件与数据接口依赖，供 **plan** 阶段对接。<...> 为占位符，填完删除。

## 已实现页面

| 路由            | 页面组件          | 状态覆盖                 |
| --------------- | ----------------- | ------------------------ |
| /orders         | OrderListPage     | 正常、空态、加载中、错误 |
| /orders/exports | ExportHistoryPage | 正常、空态、加载中、错误 |

## 新增组件清单

| 组件              | 路径                             | Props                                                                                 | 类型              |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------- | ----------------- |
| ExportDialog      | src/features/orders/ExportDialog | `visible: boolean, filters: FilterState, onConfirm: () => void, onCancel: () => void` | 受控弹窗 |
| ExportStatusBadge | src/components/ExportStatusBadge | `status: 'PENDING' \| 'PROCESSING' \| 'DONE' \| 'FAILED'`                             | 展示组件 |

## 复用的已有组件（未改动）

- Button, Modal, Table, Toast, Pagination（基础组件库）
- OrderCard, FilterBar（已有业务组件）

## 设计 Token 引用

- 所有颜色、间距、字号均引用 `DESIGN.md` 中的 token
- 响应式断点遵循 `DESIGN.md` 中约定

## 数据接口依赖（供 **plan** 阶段参考）

- ExportDialog 的 `filters` 字段需与 `POST /api/v1/orders/export` 请求体一致
- OrderTable 的数据结构需匹配 `GET /api/v1/orders` 返回的 `items` 字段
