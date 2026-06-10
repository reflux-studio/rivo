# UI 还原计划 — <特性名称>

> 起草视觉还原计划时填写：逐项列出复用清单、新增清单（含新建理由）与页面组件树，标注复用 / 新建。<...> 为占位符，填完删除。

## 1. 复用清单

| 组件                        | 来源                          | 说明             |
| --------------------------- | ----------------------------- | ---------------- |
| Button, Modal, Table, Toast | 基础组件库                    | 保持不变         |
| OrderCard                   | src/features/orders/OrderCard | 保持不变         |
| ExportStatusBadge           | —                             | 本次新建，见下方 |

## 2. 新增清单

| 组件              | 路径                             | Props                                               | 新建理由                                |
| ----------------- | -------------------------------- | --------------------------------------------------- | --------------------------------------- |
| ExportDialog      | src/features/orders/ExportDialog | `visible, filters, onConfirm, onCancel`             | 导出交互为全新流程，现有 Modal 仅为容器 |
| ExportStatusBadge | src/components/ExportStatusBadge | `status: 'PENDING'\|'PROCESSING'\|'DONE'\|'FAILED'` | 导出状态展示为通用 UI，可跨页面复用     |

## 3. 页面组件树

### 订单列表页（追加导出入口）

```
OrderListPage
├── FilterBar (复用)
├── OrderTable (复用)
│   └── OrderCard (复用)
├── ExportButton (新建，调用 ExportDialog)
└── ExportDialog (新建)
    ├── Modal (复用)
    ├── FilterSummary (新建)
    └── ActionButtons (复用 Button)
```

### 导出历史页（新增页面）

```
ExportHistoryPage
├── PageHeader (复用)
├── ExportTable (新建)
│   └── ExportStatusBadge (新建)
└── Pagination (复用)
```
