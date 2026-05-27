import type { KnowledgePoint } from '../types'

export const visualizationData: KnowledgePoint[] = [
  {
    id: "vis-01",
    title: "ECharts 二次封装设计思路",
    category: "visualization",
    difficulty: 2,
    question: "你如何对 ECharts 进行二次封装？有哪些关键设计点？",
    answer: 'ECharts 是百度开源的可视化库，是我用最多的——文档全、中文支持好、图表类型多。AntV 是蚂蚁金服的方案——G2 偏向统计图表、G6 做关系图、L7 做地图可视化。D3.js 更底层——给你操作 SVG/Canvas 的能力但图表要自己搭，灵活度最高但学习成本也最高。实际选型：业务报表用 ECharts（开箱即用），复杂定制和交互用 D3，地图和关系图用 AntV。',
    codeExample: "// BaseChart 封装\nimport * as echarts from 'echarts/core'\nimport { CanvasRenderer } from 'echarts/renderers'\necharts.use([CanvasRenderer])\n\n// 数据适配器\ntype RawData = { date: string; value: number; category: string }\nfunction toLineOption(data: RawData[]): echarts.EChartsOption {\n  return {\n    xAxis: { type: 'category', data: data.map(d => d.date) },\n    yAxis: { type: 'value' },\n    series: [{ data: data.map(d => d.value), type: 'line' }]\n  }\n}",
    tags: ["ECharts", "封装", "数据可视化"],
  },
  {
    id: "vis-02",
    title: "Canvas 与 SVG 的对比",
    category: "visualization",
    difficulty: 2,
    question: "Canvas 和 SVG 各有什么特点？分别在什么场景下使用？",
    answer: '大屏数据可视化的技术要点：固定宽高比（设计稿 1920×1080，用 transform: scale 等比缩放适配各种屏幕分辨率）。性能优化——数据量大的图表要降低渲染频率（requestAnimationFrame 控制帧率）、降低数据精度（不必要的小数点去掉减少渲染开销）、使用 WebGL 渲染（ECharts GL 模式）提升大量数据场景的性能。大屏一般接 WebSocket 实时推送数据，不是轮询。',
    tags: ["Canvas", "SVG", "可视化"],
  },
  {
    id: "vis-03",
    title: "大数据量可视化渲染优化",
    category: "visualization",
    difficulty: 3,
    question: "当图表数据量很大（如 10万+ 条数据）时，如何优化渲染性能？",
    answer: '图表性能优化在数据量大时特别重要。ECharts 的 dataZoom 做数据窗口——全量数据在内存里，但只渲染可视区域的数据点。大数据量用 Canvas 渲染而非 SVG（Canvas 对大量元素更高效）。WebGL 渲染（ECharts GL）适合超大数据集的散点图和 3D 图表。数据采样——如果数据精度远高于屏幕像素精度，采样不会损失任何视觉效果。',
    tags: ["可视化", "性能优化", "大数据", "LTTB"],
  }
]
