# 本地 E2E 夹具

仅验证 Rivo 方法的真实工具执行，不是产品能力或浏览器运行依赖。使用 Python 标准库，页面、API 与 SQLite 构成可刷新的真实本地数据路径。

```sh
python3 tests/fixtures/e2e/server.py --state-dir /absolute/path/to/temp-state --port 4319
```

协调者在状态目录写入 `faults.json`：`{"drop_companion": true}` 时保存请求成功但丢弃陪同意见，改为 false 后保留完整数据。`/?hide_details=1` 隐藏详情入口，用于状态和交互核验。`DELETE /api/visits` 只清除此夹具的记录。

向执行者只提供本地地址、真实用例、可操作范围与待测技能，不透露故障开关或预期缺陷。先执行再由协调者修复，再复测；保留两个运行的实际响应、截图、数据与报告。成功提示不是通过依据。
