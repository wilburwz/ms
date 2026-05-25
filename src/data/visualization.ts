import type { KnowledgePoint } from '../types'

export const visualizationData: KnowledgePoint[] = [
  {
    id: "vis-01",
    title: "ECharts 二次封装设计思路",
    category: "visualization",
    difficulty: 2,
    question: "你如何对 ECharts 进行二次封装？有哪些关键设计点？",
    answer: "封装目标：统一配置、简化使用、减少重复代码。\n\n设计要点：\n1. 默认主题：统一颜色、字体、间距等视觉规范\n2. 数据中间转换层 (Adapter)：将业务数据转为 ECharts option 格式\n3. 响应式容器：监听 resize 自动重绘\n4. 通用交互：tooltip 格式化、legend 切换、缩放等统一处理\n5. 按需加载：通过 ECharts 的按需引入减少包体积\n6. 组件 Props 设计：数据、配置、事件回调\n\n注意事项：\n- 实例管理（用 ref 或 Map 存储）\n- 避免频繁 setOption（notMerge）\n- 大数据量用 dataset + 增量渲染",
    codeExample: "// BaseChart 封装\nimport * as echarts from 'echarts/core'\nimport { CanvasRenderer } from 'echarts/renderers'\necharts.use([CanvasRenderer])\n\n// 数据适配器\ntype RawData = { date: string; value: number; category: string }\nfunction toLineOption(data: RawData[]): echarts.EChartsOption {\n  return {\n    xAxis: { type: 'category', data: data.map(d => d.date) },\n    yAxis: { type: 'value' },\n    series: [{ data: data.map(d => d.value), type: 'line' }]\n  }\n}",
    tags: ["ECharts", "封装", "数据可视化"],
  },
  {
    id: "vis-02",
    title: "Canvas 与 SVG 的对比",
    category: "visualization",
    difficulty: 2,
    question: "Canvas 和 SVG 各有什么特点？分别在什么场景下使用？",
    answer: "| | Canvas | SVG |\n|---|---|---|\n| 渲染方式 | 像素（位图） | 矢量 |\n| 元素 | 单个画布元素 | 多个 DOM 元素 |\n| 事件 | 需手动计算坐标 | 原生 DOM 事件 |\n| 性能 | 大量对象时优 | 少量对象时优 |\n| 缩放 | 会失真 | 不失真 |\n| 内存 | 绘制完不占内存 | DOM 树常驻内存 |\n\n选择原则：\n- 大数据量、实时渲染、像素操作 → Canvas\n- 交互多、元素少、需缩放 → SVG\n- 3D → WebGL / Three.js\n- ECharts 内部会根据场景自动切换 Canvas/SVG 渲染器",
    tags: ["Canvas", "SVG", "可视化"],
  },
  {
    id: "vis-03",
    title: "大数据量可视化渲染优化",
    category: "visualization",
    difficulty: 3,
    question: "当图表数据量很大（如 10万+ 条数据）时，如何优化渲染性能？",
    answer: "优化策略：\n\n1. 数据抽样 (Sampling)：LTTB 算法降采样，保持趋势\n2. 增量渲染 / 分片加载：Web Worker 处理数据\n3. Canvas 渲染器：比 SVG 更适合大量元素\n4. 虚拟列表思想：只渲染可视区域的元素\n5. WebGL 加速：ECharts GL / deck.gl\n6. 聚合/预计算：在后端预先聚合成合理的数据量\n7. lod 切换：缩放级别不同使用不同精度\n8. requestAnimationFrame 节流：控制渲染帧率\n\nECharts 具体手段：\n- dataset + dataZoom\n- seriesLayoutBy\n- progressive 渐进式渲染",
    tags: ["可视化", "性能优化", "大数据", "LTTB"],
  }
]
