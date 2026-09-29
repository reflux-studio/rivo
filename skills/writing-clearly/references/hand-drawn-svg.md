# 手写 SVG

没有 archify 时直接写 SVG。SVG 本身就是图源；用脚本批量生成时，脚本才是图源，和 SVG 存在一起。

## 画布

- 同时写 `viewBox`、`width`、`height`，比例一致，宽度不超过 960
- 根元素带 `role="img"`、`lang="zh-CN"` 和 `<title>`，内容与正文的替代文字一致
- 第一个元素铺一个白色背景矩形。透明背景配黑字，在暗色页面上看不清

## 节点与连线

- 节点是圆角矩形（`rx="8"`），边框 1.5；外部系统或用户用虚线边框
- 每个节点、每条连线放在一个 `<g id="…">` 里，ID 用稳定的英文短名，例如 `n-api`、`e-api-db`。before/after 靠 ID 对应
- 连线用 `<path>`，终点用 `<marker>` 箭头，从节点边缘出发，不穿过无关节点
- 连线标签底下垫一个白色小矩形，避免和线重叠
- 图例只列图中真实用到的样式

## 文字

- 字号：正文 14，次要说明 12，标题 16
- 每段文字一个 `<text>`，用 `text-anchor="middle"`、`dominant-baseline="central"` 定在节点中心；多行用多个 `<text>`
- 字体：`system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
- 估算宽度：汉字约 1 个字号宽，英文和数字约 0.6 个；节点至少比文字宽 24

## before/after

1. 先画 before，定下所有对象的 ID 和坐标
2. 复制 before 作为 after：保留的对象 ID 和坐标不变；移除的整组删掉；新增的用新 ID 放在空白处，必要时加大画布，不挪已有对象
3. after 中新增或修改的节点加 `accent` 类，并在图例里说明

## 检查

- `xmllint --noout <文件>.svg` 确认文件合法
- 打开看一眼：文字没溢出，连线没遮挡
- 对照 before 和 after，同一对象的 ID 与位置一致

## 模板

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 140" width="480" height="140" role="img" lang="zh-CN">
  <title>订单服务写入订单库</title>
  <style>
    text { font-family: system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; fill: #1f2933; }
    .bg { fill: #ffffff; }
    .node { fill: #f4f6f8; stroke: #8a96a3; stroke-width: 1.5; }
    .accent .node { stroke: #2f7de1; stroke-width: 2; }
    .edge { fill: none; stroke: #5f6b7a; stroke-width: 1.5; }
    .arrow { fill: #5f6b7a; }
    .label { font-size: 12px; fill: #5f6b7a; }
    .name { font-size: 14px; }
  </style>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path class="arrow" d="M0,0 L10,5 L0,10 z"/>
    </marker>
  </defs>
  <rect class="bg" width="480" height="140"/>
  <g id="n-order">
    <rect class="node" x="40" y="45" width="120" height="50" rx="8"/>
    <text class="name" x="100" y="70" text-anchor="middle" dominant-baseline="central">订单服务</text>
  </g>
  <g id="n-db" class="accent">
    <rect class="node" x="320" y="45" width="120" height="50" rx="8"/>
    <text class="name" x="380" y="70" text-anchor="middle" dominant-baseline="central">订单库</text>
  </g>
  <g id="e-order-db">
    <path class="edge" d="M160,70 L320,70" marker-end="url(#arrow)"/>
    <rect class="bg" x="212" y="42" width="56" height="18"/>
    <text class="label" x="240" y="51" text-anchor="middle" dominant-baseline="central">写入订单</text>
  </g>
  <g id="legend" class="accent">
    <rect class="node" x="40" y="116" width="14" height="10" rx="2"/>
    <text class="label" x="62" y="121" dominant-baseline="central">本次新增</text>
  </g>
</svg>
```

这是一张 after 图：`n-db` 带 `accent` 类，表示本次新增。对应的 before 去掉 `n-db` 和 `e-order-db` 两组，`n-order` 的 ID 和坐标不变。
