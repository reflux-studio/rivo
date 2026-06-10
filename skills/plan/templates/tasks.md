# 执行任务清单 — <特性名称>

> 把 plan 拆成可独立执行、可验证的原子任务，每个任务标清依赖、覆盖的 AC、文件、描述、验证标准。
> 「覆盖」填本任务承接 spec 的哪些 AC 编号；无直接对应 AC 的支撑性任务，注明它支撑哪个任务。
> 下面是一份订单导出的完整示例，照此格式填。

## 任务依赖图（概述）

```
T1 创建数据表
  └─▶ T2 实现 ExportService 核心逻辑
        └─▶ T3 实现 ExportController 接口
              └─▶ T4 集成 RabbitMQ Worker
T5 安装前端依赖（如需）
  └─▶ T6 对接导出按钮与弹窗（使用已有 UI）
        └─▶ T7 实现导出历史页面数据绑定
```

## 任务列表

### T1: 创建 export_tasks 数据表

- **依赖**：无
- **覆盖**：无直接 AC（支撑 T2）
- **文件**：`db/migrations/xxx_create_export_tasks.sql`
- **描述**：按照 plan.md 定义创建 `export_tasks` 表，包含字段、枚举、索引。
- **验证**：运行迁移后，数据库中可见 `export_tasks` 表，结构符合定义。

### T2: 实现 ExportService 核心逻辑

- **依赖**：T1
- **覆盖**：AC-001、AC-004
- **文件**：`src/services/export.ts`（新增）
- **描述**：
  - 实现 `createTask`：写入 `export_tasks` 表，状态 PENDING。
  - 实现 `processTask`：生成 CSV，上传 MinIO，更新状态 DONE/FAILED。
  - 包含限流逻辑、幂等处理、重试机制。
- **验证**：单元测试覆盖正常创建、限流拒绝、幂等返回、导出成功/失败流转。

### T3: 实现 ExportController

- **依赖**：T2
- **覆盖**：AC-001、AC-002
- **文件**：`src/controllers/export.ts`（新增）
- **描述**：
  - `POST /api/v1/orders/export`：校验权限、筛选条件，调用 Service 创建任务，返回 200 和 taskId。
  - `GET /api/v1/orders/export/{taskId}`：返回任务状态和下载链接。
  - 错误处理：按 spec 返回对应错误码。
- **验证**：集成测试验证接口契约、权限控制、错误码。

### T4: 集成 RabbitMQ Worker

- **依赖**：T2
- **覆盖**：AC-004
- **文件**：`src/workers/export-worker.ts`（新增）
- **描述**：消费 `export-jobs` 队列，调用 `ExportService.processTask`。
- **验证**：发送测试消息，Worker 消费并完成任务，状态流转正确。

### T5: 安装前端时间处理依赖（如需）

- **依赖**：无
- **覆盖**：无直接 AC（支撑 T7）
- **文件**：`package.json`
- **描述**：若导出历史需要格式化时间，安装 `dayjs`（如已有则跳过）。
- **验证**：`npm list dayjs` 显示已安装。

### T6: 对接导出按钮与弹窗

- **依赖**：T3, T5（可选）
- **覆盖**：AC-001
- **文件**：`src/features/orders/OrderListPage.tsx`（修改）
- **描述**：
  - 在订单列表页引入 `ExportButton` 和 `ExportDialog`（已在 UI 契约中实现）。
  - 连接 `POST /export` 接口，处理加载、成功 / 失败提示。
  - 遵循 UI 契约中导出的交互细节。
- **验证**：点击导出，弹窗出现；确认后发送请求，Toast 弹出「导出任务已创建」。

### T7: 实现导出历史页面数据绑定

- **依赖**：T3
- **覆盖**：AC-003
- **文件**：`src/pages/ExportHistoryPage.tsx`（修改）
- **描述**：
  - 对接 `GET /export/{taskId}` 等接口（或历史列表接口），获取任务列表数据。
  - 将数据注入已实现的 `ExportHistoryPage` 组件，正确显示 `ExportStatusBadge`。
  - 处理加载、空数据、错误状态。
- **验证**：页面能展示历史任务，状态 badge 随数据更新正确显示，空态正常。

### T8: 更新路由和权限配置

- **依赖**：T6, T7
- **覆盖**：AC-005
- **文件**：`src/router.ts`, 权限配置文件
- **描述**：添加 `/exports` 路由，确保需要 `order:export` 权限；在订单列表页启用导出按钮（需权限控制）。
- **验证**：有权限用户可见导出按钮和历史页，无权限用户不可见。

### T9: 端到端回归验证

- **依赖**：T1-T8
- **覆盖**：全部 AC（端到端复核）
- **描述**：运行全量 E2E 测试或手动冒烟测试，确保原有功能不受影响，新功能符合 spec 验收标准。
- **验证**：所有 AC 通过，无回归错误。
