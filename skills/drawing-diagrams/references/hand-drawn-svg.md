# 手写 SVG 规范

没有可用的 Archify 时，直接写 SVG 文件。SVG 本身就是图源：把它保存在 `assets/` 下，嵌入正文的就是这份文件。用脚本批量生成 SVG 时，脚本才是图源，与 SVG 一起保存。

## 画布与字号

- 同时写 `viewBox` 和 `width`、`height`，三者比例一致。宽度控制在 960 以内，嵌入 Markdown 后接近原尺寸显示。
- 正文字号 14，次要说明 12，标题 16；按这个尺寸在正文里能读清为准。
- 根元素带 `role="img"`、`lang="zh-CN"` 和一个 `<title>`，内容与正文里的替代文字一致。

## 配色

颜色全部写成 `<style>` 里的 CSS 变量，用 `prefers-color-scheme` 提供暗色值；元素只引用类名，不写死颜色。背景铺一个 `.bg` 矩形，保证在任何页面底色上都可读。

| 变量 | 用途 |
| --- | --- |
| `--bg` | 画布背景 |
| `--node`、`--node-stroke` | 普通节点的填充和边框 |
| `--text`、`--muted` | 主文字、次要文字和连线标签 |
| `--edge` | 连线和箭头 |
| `--accent` | after 中新增或修改的节点 |

## 节点、连线与标签

- 节点是圆角矩形（`rx="8"`），边框 1.5；外部系统或用户可用虚线边框区分，并在图例说明。
- 每个节点放在一个 `<g id="…">` 里，ID 用稳定的英文短名，例如 `n-api`、`e-api-db`。
- 连线用 `<path>` 画折线或直线，终点用 `<marker>` 箭头；连线从节点边缘出发，不穿过无关节点。
- 连线标签放在线段旁的空白处，底下垫一个 `.bg` 小矩形，避免和线重叠。
- 图例只列图中真实用到的样式。

## 文字

- 每段文字都是一个绝对定位的 `<text>`，用 `x`、`y`、`text-anchor="middle"` 和 `dominant-baseline="central"` 定在节点中心。多行文字用多个 `<text>` 分别定位。
- 字体写成 `system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`，布局不依赖等宽字体。
- 按一个汉字约 1 个字号宽、一个英文字母或数字约 0.6 个字号宽估算文字宽度，节点宽度至少比文字宽 24。

## before/after

1. 先画 before，确定所有对象的 ID 和坐标。
2. 复制 before 文件作为 after：保留的对象 ID 和坐标不变；移除的对象整组删掉；新增的对象用新 ID 放在空白处，必要时整体加大画布，不挪动已有对象。
3. after 中新增或修改的节点加 `accent` 类，并在图例里说明；新增或移除的连线由正文讲清。

## 校验

- 用可用的 XML 解析器确认文件合法，例如 `xmllint --noout after.svg`。
- 按技能正文的视觉检查做法，在浏览器中打开或渲染成图片，亮色和暗色各看一遍，确认文字没有溢出、连线没有遮挡。
- 对照 before 和 after，确认同一对象的 ID 与位置一致。

## 示例

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 140" width="480" height="140" role="img" lang="zh-CN">
  <title>订单服务写入订单库</title>
  <style>
    :root { --bg:#ffffff; --node:#f4f6f8; --node-stroke:#8a96a3; --text:#1f2933; --muted:#5f6b7a; --edge:#5f6b7a; --accent:#2f7de1; }
    @media (prefers-color-scheme: dark) {
      :root { --bg:#16191d; --node:#232830; --node-stroke:#6b7685; --text:#e6e9ed; --muted:#9aa5b1; --edge:#9aa5b1; --accent:#5aa2ff; }
    }
    text { font-family: system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; fill: var(--text); }
    .bg { fill: var(--bg); }
    .node { fill: var(--node); stroke: var(--node-stroke); stroke-width: 1.5; }
    .accent .node { stroke: var(--accent); stroke-width: 2; }
    .edge { fill: none; stroke: var(--edge); stroke-width: 1.5; }
    .arrow { fill: var(--edge); }
    .label { font-size: 12px; fill: var(--muted); }
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

这是一张 after 图：`n-db` 带 `accent` 类，表示本次新增的节点。对应的 before 去掉 `n-db` 和 `e-order-db` 两组，`n-order` 的 ID 和坐标保持不变。
