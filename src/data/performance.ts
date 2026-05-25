import type { KnowledgePoint } from '../types'

export const performanceData: KnowledgePoint[] = [
  {
    id: "perf-01",
    title: "前端性能指标 (Core Web Vitals)",
    category: "performance",
    difficulty: 1,
    question: "Core Web Vitals 包含哪些指标？如何测量？",
    answer: "三大核心指标：\n\n1. LCP (Largest Contentful Paint)：最大内容绘制\n   - 衡量加载性能\n   - 目标：< 2.5s\n   - 最大文本/图片渲染时间\n\n2. INP (Interaction to Next Paint)：交互到下次绘制\n   - 衡量交互响应性（取代 FID）\n   - 目标：< 200ms\n   - 所有交互的响应延迟\n\n3. CLS (Cumulative Layout Shift)：累积布局偏移\n   - 衡量视觉稳定性\n   - 目标：< 0.1\n   - 意外的布局移动\n\n测量工具：\n- Lighthouse\n- Chrome DevTools Performance\n- Web Vitals 库\n- Search Console\n- RUM (Real User Monitoring)",
    tags: ["性能", "Core Web Vitals", "LCP", "INP", "CLS"],
  },
  {
    id: "perf-02",
    title: "前端性能优化全面总结",
    category: "performance",
    difficulty: 2,
    question: "请从多个维度总结前端性能优化策略。",
    answer: "网络层：\n- CDN 加速静态资源\n- HTTP/2 多路复用\n- Gzip/Brotli 压缩\n- DNS 预解析 / 预连接\n- 资源预加载 (preload/prefetch)\n\n资源层：\n- 图片优化：WebP/AVIF, srcset, 懒加载\n- 代码分割：动态 import, 路由懒加载\n- Tree-shaking：移除无用代码\n- 字体优化：font-display: swap\n\n渲染层：\n- 关键渲染路径优化\n- 减少重排重绘\n- CSS containment\n- 虚拟列表\n\n框架层：\n- 组件懒加载\n- 缓存策略（keep-alive, useMemo）\n- 防抖节流\n- Web Worker 处理密集计算",
    codeExample: "// 资源预加载\n<link rel=\"preload\" href=\"/font.woff2\" as=\"font\" crossorigin>\n<link rel=\"prefetch\" href=\"/next-page.js\">\n<link rel=\"dns-prefetch\" href=\"//cdn.example.com\">\n\n// 图片懒加载\n<img loading=\"lazy\" src=\"photo.webp\" />\n\n// 路由懒加载\nconst Page = () => import('./Page.vue')",
    tags: ["性能优化", "Lighthouse", "加载", "渲染"],
  },
  {
    id: "perf-03",
    title: "图片优化策略",
    category: "performance",
    difficulty: 1,
    question: "前端图片优化有哪些策略？",
    answer: "格式优化：\n- WebP：比 JPEG/PNG 小 25-35%\n- AVIF：比 WebP 再小 20%\n- SVG：矢量图，适合图标\n- JPEG XL：新格式，压缩率更高\n\n加载策略：\n- 懒加载：loading=\"lazy\"\n- 响应式：srcset + sizes\n- 渐进式加载：模糊占位 → 清晰图\n- 预加载关键图片\n\n尺寸优化：\n- 按需裁剪（CDN 图片处理）\n- 合理尺寸（不加载过大原图）\n- CSS sprite / SVG sprite（小图标）\n\n渲染优化：\n- width/height 预留空间（减少 CLS）\n- object-fit 控制填充\n- decode=\"async\" 异步解码\n\n工具：\n- Sharp：Node 图片处理\n- Squoosh：Google 在线压缩\n- ImageMin：构建时压缩",
    tags: ["图片优化", "WebP", "懒加载", "性能"],
  },
  {
    id: "perf-04",
    title: "虚拟列表实现原理",
    category: "performance",
    difficulty: 2,
    question: "什么是虚拟列表？如何实现？",
    answer: "虚拟列表：只渲染可视区域内的列表项，大幅减少 DOM 数量。\n\n原理：\n1. 计算可视区域可容纳的项数\n2. 只渲染可视项 + 上下缓冲区\n3. 滚动时更新渲染项的起始索引\n4. 用 padding/transform 模拟完整列表高度\n\n实现要点：\n- 容器固定高度 + overflow: auto\n- 内部占位元素撑开滚动高度\n- 滚动事件监听 + 计算可见范围\n- 防抖/RAF 优化滚动计算\n\n变体：\n- 固定高度项：计算简单\n- 动态高度项：需测量或预估\n- 无限滚动：滚动到底部加载更多\n\n库：\n- react-window / react-virtuoso\n- vue-virtual-scroller",
    codeExample: "function VirtualList({ items, itemHeight = 40, visibleHeight = 600 }) {\n  const [scrollTop, setScrollTop] = useState(0)\n  const totalHeight = items.length * itemHeight\n  const startIndex = Math.floor(scrollTop / itemHeight)\n  const endIndex = Math.min(\n    startIndex + Math.ceil(visibleHeight / itemHeight) + 1,\n    items.length\n  )\n  const visibleItems = items.slice(startIndex, endIndex)\n\n  return (\n    <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>\n      <div style={{ height: totalHeight }}>\n        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>\n          {visibleItems.map(item => <Row key={item.id} />)}\n        </div>\n      </div>\n    </div>\n  )\n}",
    tags: ["虚拟列表", "性能", "滚动", "大列表"],
  },
  {
    id: "perf-05",
    title: "Service Worker 与离线缓存",
    category: "performance",
    difficulty: 2,
    question: "Service Worker 的作用是什么？如何实现离线缓存？",
    answer: "Service Worker：独立线程，可拦截网络请求。\n\n特点：\n- 独立于主线程，无 DOM 访问\n- 可拦截和处理网络请求\n- 支持后台同步和推送通知\n- 生命周期：install → activate → fetch\n\n离线缓存方案：\n1. Cache API + Service Worker\n2. 缓存优先策略：先读缓存，无则请求\n3. 网络优先策略：先请求，失败读缓存\n4. Workbox：Google 缓存策略库\n\n应用场景：\n- PWA 离线可用\n- 缓存静态资源\n- 后台数据同步\n- 推送通知\n- 请求拦截修改",
    codeExample: "// 注册 Service Worker\nnavigator.serviceWorker.register('/sw.js')\n\n// sw.js\nself.addEventListener('install', (e) => {\n  e.waitUntil(\n    caches.open('v1').then(cache =>\n      cache.addAll(['/', '/app.js', '/style.css'])\n    )\n  )\n})\n\nself.addEventListener('fetch', (e) => {\n  e.respondWith(\n    caches.match(e.request).then(r => r || fetch(e.request))\n  )\n})",
    tags: ["Service Worker", "PWA", "离线缓存", "缓存"],
  }
]
