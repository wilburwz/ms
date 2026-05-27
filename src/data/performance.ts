import type { KnowledgePoint } from '../types'

export const performanceData: KnowledgePoint[] = [
  {
    id: "perf-01",
    title: "前端性能指标 (Core Web Vitals)",
    category: "performance",
    difficulty: 1,
    question: "Core Web Vitals 包含哪些指标？每个指标衡量什么？如何测量和优化？",
    answer: `## 一、三大核心指标

### LCP（Largest Contentful Paint）— 最大内容绘制
衡量加载性能：页面主要内容对用户可见的时间点。
- 目标：< 2.5s（优秀）、2.5-4s（需改进）、> 4s（差）
- 触发元素：大图片、视频封面、大文本块、CSS 背景图
- 注意：不可见元素（opacity:0、visibility:hidden）、被其他元素完全覆盖的元素不算

面试追问：LCP 和 load 事件有什么区别？
→ load 是页面所有资源加载完成（包括不重要的第三方脚本），用户可能早在 1-2s 就看到内容了。
   LCP 衡量的是「用户感知的加载完成」，比 load 更能反映真实体验。

### INP（Interaction to Next Paint）— 交互到下次绘制
衡量交互响应性：用户交互后浏览器绘制下一帧的延迟。取所有交互的 p98 值。
- 目标：< 200ms（优秀）、200-500ms（需改进）、> 500ms（差）
- 交互类型：点击、触摸、键盘输入
- 取代了旧的 FID（First Input Delay，只看第一次交互）

面试追问：INP 为什么只看 p98 而不是平均值？
→ 因为少数极慢的交互（比如点击一个按钮卡了 2 秒）会毁掉用户体验。
   平均值会被大量快速交互稀释，p98 更能捕捉到最差的体验。

### CLS（Cumulative Layout Shift）— 累积布局偏移
衡量视觉稳定性：页面生命周期中布局意外移动的累积分数。
- 目标：< 0.1（优秀）、0.1-0.25（需改进）、> 0.25（差）
- 计算方式：影响面积比例 × 移动距离比例
- 常见原因：无尺寸的图片/视频、动态注入的广告/弹窗、Web 字体加载

面试追问：transform 动画会触发 CLS 吗？
→ 不会！CLS 只计算「意外的」布局偏移。transform 是用 CSS 动画主动做的视觉变化，
   浏览器知道这是有意的，不计入 CLS。这也是为什么动画应该用 transform 而非 top/left。

## 二、测量工具

Lab Data（实验室数据 — 固定环境可复现）：
- Lighthouse（Chrome DevTools / CLI / PSI）
- WebPageTest
- Chrome DevTools Performance 面板

Field Data（真实用户数据 — RUM）：
- Chrome UX Report（CrUX，公开数据集）
- Web Vitals 库（JS 库，页面中采集）
- Search Console（Core Web Vitals 报告）
- Sentry Performance / 自建上报

面试追问：Lab Data 和 Field Data 差别大怎么办？
→ 非常常见。Lab 用模拟设备（固定网络/CPU），Field 是真实用户（各种设备/网络）。
   印度 3G 用户和深圳光纤用户体验完全不同。关注 p75 分位数，而非平均值。
   策略：Lab 设性能预算防回退，Field 做真实监控。

## 三、优化策略速查

LCP 优化：
- 图片：WebP/AVIF 格式 + srcset + preload 关键图片
- 服务端：SSR/SSG 直出 HTML
- 阻塞资源：内联关键 CSS + JS defer + 第三方脚本延迟加载

INP 优化：
- 拆分长任务（> 50ms）为多个微任务
- React：useTransition 标记非紧急更新
- 减少 JS 执行时间（代码分割 + 懒加载）
- Web Worker 移除非 UI 计算

CLS 优化：
- 图片/视频/iframe 设置明确 width/height（或 aspect-ratio）
- 动态内容预留空间（骨架屏、min-height）
- 字体：font-display: optional / swap + fallback 字体匹配尺寸
- 动画只用 transform + opacity（GPU 加速 + 不影响布局）`,
    tags: ["性能", "Core Web Vitals", "LCP", "INP", "CLS"],
  },
  {
    id: "perf-02",
    title: "前端性能优化全面总结",
    category: "performance",
    difficulty: 2,
    question: "请从网络层、资源层、渲染层、框架层四个维度系统总结前端性能优化策略。",
    answer: `## 一、网络层优化

- CDN 加速静态资源：将 JS/CSS/图片分发到全球边缘节点，减少物理距离延迟
- HTTP/2 多路复用：单连接多请求并行，消除 HTTP/1.1 的队头阻塞
- Gzip/Brotli 压缩：Brotli 比 Gzip 压缩率高 15-25%，文本资源可压缩到 30% 以下
- DNS 预解析 dns-prefetch + 预连接 preconnect：提前解析第三方域名
- 资源预加载：preload（当前页关键资源）、prefetch（未来页面资源）
- 减少请求数：SVG sprite、CSS sprite、小图 base64 内联（< 4KB）

面试追问：preload 和 prefetch 的区别？
→ preload 是强制浏览器提前下载当前页面必需资源（如首屏 hero 图、关键 CSS）。
   prefetch 是在浏览器空闲时下载未来可能用到的资源（如下一页 JS）。
   preload 优先级高，prefetch 优先级低。

## 二、资源层优化

- 图片优化：WebP/AVIF 格式、srcset 响应式、loading="lazy"、CDN 动态裁剪
- 代码分割：路由级 React.lazy + 动态 import 组件级、vite/rollup manualChunks
- Tree Shaking：ESM 模块自动支持，注意副作用（sideEffects: false）
- 字体优化：font-display: swap（避免 FOIT）+ woff2 格式 + 子集化
- Bundle 优化：移除 moment.js → dayjs（省 200KB）、lodash → lodash-es
- 资源压缩：图片压缩（Squoosh/Sharp）、CSS/JS 压缩（构建工具自动）

面试追问：Tree Shaking 什么情况下失效？
→ 1) CommonJS 模块（require/exports）无法 Tree Shake，必须用 ESM。
   2) 副作用：如果模块有顶层副作用代码（如 polyfill 的立即执行），会被认为整包都有副作用。
   3) 动态导入：import(variable) 编译器无法静态分析。

## 三、渲染层优化

- 关键渲染路径：减少关键资源数量 + 大小 + 往返次数
- CSS 优化：内联关键 CSS（首屏样式 < 14KB）+ 非关键 CSS 异步加载 + CSS containment
- 避免重排（Reflow）：批量修改 DOM + 用 transform 替代 top/left + 读-写分离
- 避免重绘（Repaint）：减少不必要的样式变化 + GPU 合成层
- 虚拟列表：只渲染可视区域 DOM，滚动时动态替换（react-window / @tanstack/virtual）
- requestAnimationFrame：动画和滚动事件用 rAF 而非 setInterval

面试追问：什么操作会触发重排？
→ 几何属性变化：width/height/padding/margin/border、offsetTop/scrollTop 读取、
   DOM 增删、display:none、浏览器窗口 resize、字体加载。重排会级联影响后续元素，代价最高。

## 四、框架层优化

- 组件懒加载：React.lazy + Suspense / defineAsyncComponent
- 缓存策略：keep-alive（Vue）/ React.memo + useMemo + useCallback
- 防抖/节流：搜索输入 300ms 防抖、滚动事件 100ms 节流
- Web Worker：密集计算（排序/加密/数据处理）放入 Worker，不阻塞主线程
- 状态管理：拆分 Store 粒度、精确 selector + shallow 比较
- 减少渲染次数：React Profiler 定位不必要的渲染、useDeferredValue 延迟非关键更新`,
    codeExample: `// 资源预加载
<link rel="preload" href="/font.woff2" as="font" crossorigin>
<link rel="prefetch" href="/next-page.js">
<link rel="dns-prefetch" href="//cdn.example.com">

// 图片懒加载 + 响应式
<img loading="lazy" srcset="small.webp 400w, large.webp 800w" sizes="(max-width:600px) 400px, 800px">

// 路由懒加载
const Page = () => import('./Page.vue')`,
    tags: ["性能优化", "Lighthouse", "加载", "渲染"],
  },
  {
    id: "perf-03",
    title: "图片优化策略",
    category: "performance",
    difficulty: 1,
    question: "前端图片优化有哪些策略？从格式选择、加载策略、尺寸管理到渲染优化逐一说明。",
    answer: `## 一、格式选择（按场景）

- WebP：主流选择，比 JPEG/PNG 小 25-35%，支持透明和动画，浏览器覆盖率 97%+
- AVIF：下一代格式，比 WebP 再小 20-30%，HDR 支持更好，覆盖率 93%
- SVG：矢量图，适合图标/Logo，无限缩放不失真，可内联或外链
- JPEG XL：最新格式，无损转码，但浏览器支持有限（仅 Safari 实验性）
- PNG：需要精确像素级透明度时仍是最佳选择

面试追问：为什么不用 WebP 还提供 JPEG fallback？
→ 用 <picture> 标签，浏览器自动选择支持的格式：
   <picture><source srcset="img.avif" type="image/avif"><source srcset="img.webp" type="image/webp"><img src="img.jpg"></picture>

## 二、加载策略

懒加载：
- 原生：<img loading="lazy" /> 最简单，但控制力弱
- Intersection Observer：更灵活，支持占位图、淡入动画、距离阈值
- 注意：首屏图片不要懒加载（会延迟 LCP），用 fetchpriority="high" 提升优先级

响应式图片：
- srcset + sizes：根据屏幕宽度和设备像素比自动选择最佳尺寸
- <picture> + media：艺术方向（不同断点展示不同裁剪的图片）
- CDN 动态处理：?w=400&h=300&fit=crop&f=webp

渐进式加载：
- LQIP（低质量占位）：先加载 20px 模糊图作为占位，再加载原图
- BlurHash：用 20-30 字符的哈希编码图片颜色，极小的占位方案

## 三、尺寸管理

- 按需裁剪：不加载原图（可能 4000px 宽），按显示尺寸裁剪（如 400px 宽）
- 合理压缩：JPEG quality 70-80%、WebP quality 75-85% 视觉无损
- CSS/Inline SVG：小图标直接内联 SVG，避免额外 HTTP 请求
- SVG Sprite：多个 SVG 合并为一个文件，用 <use> 引用

面试追问：什么时候用 base64 内联图片？
→ 仅限 < 4KB 的小图、且是首屏关键图片、复用在多处。
   base64 比原文件大 33%，且无法被浏览器缓存（跟着 HTML 一起缓存），通常不推荐。

## 四、渲染优化

- 防 CLS：width/height 或 aspect-ratio 预留空间
- 异步解码：decoding="async" 让浏览器在空闲时解码
- 硬件加速：will-change: transform 或 transform: translateZ(0) 创建合成层
- object-fit：cover/contain 控制填充方式，配合 overflow:hidden`,
    tags: ["图片优化", "WebP", "懒加载", "性能"],
  },
  {
    id: "perf-04",
    title: "虚拟列表实现原理",
    category: "performance",
    difficulty: 2,
    question: "什么是虚拟列表？为什么 5000 行数据需要虚拟列表？请详细说明实现原理和常见变体。",
    answer: `## 一、为什么需要虚拟列表

5000 行数据如果全量渲染：
- 创建 5000+ DOM 节点 → 内存占用 50MB+
- 首次渲染耗时 1-3 秒（JS 执行 + Layout + Paint）
- 滚动卡顿（每个 scroll 事件触发大量重排）
- 排序/筛选时全量重新渲染，用户体验极差

虚拟列表：只渲染可视区域内的 ~20 个 DOM 节点，滚动时动态替换。DOM 数量恒定，性能与数据量无关。

## 二、核心实现原理

四个关键步骤：
1. 容器固定高度（如 600px）+ overflow: auto
2. 占位元素撑开滚动高度：totalHeight = items.length × itemHeight
3. 滚动监听：scrollTop → 计算可见起始索引 startIndex = Math.floor(scrollTop / itemHeight)
4. 渲染窗口：只渲染 arr.slice(startIndex, startIndex + visibleCount + buffer)

关键计算：
- visibleCount = Math.ceil(containerHeight / itemHeight)
- buffer = 3-5 项（上下各预渲染几项，避免快速滚动时出现白屏）
- offsetY = startIndex × itemHeight（用 transform: translateY 定位可见项）

## 三、固定高度 vs 动态高度

固定高度（最简单）：
- 所有项高度相同，计算 O(1)
- 适合：日志列表、通知列表、简单表格行

动态高度（更复杂）：
- 需要预估值 + 实际测量结合
- 维护一个高度缓存 Map<index, height>
- 库方案：@tanstack/virtual 的 measureElement（ResizeObserver 自动测量）
- 适用：富文本评论、卡片列表、自适应表格行

面试追问：动态高度下如何定位项的位置？
→ 维护一个累积高度数组 offsets[i] = sum(height[0..i])。
   用二分查找 O(log n) 定位 scrollTop 对应的起始索引。
   新增项后增量更新 offsets，不需要全量重算。

## 四、常见库对比

- react-window（推荐）：轻量（~5KB），固定/可变高度，生产级
- @tanstack/virtual：框架无关（React/Vue/Solid），支持动态高度 + ResizeObserver
- vue-virtual-scroller：Vue 专用，API 简洁
- react-virtuoso：支持分组、粘性头部、自动计算尺寸`,
    codeExample: "// 虚拟列表核心实现（固定高度）\n" +
    "function VirtualList({ items, itemHeight = 40, containerHeight = 600 }) {\n" +
    "  const [scrollTop, setScrollTop] = useState(0)\n" +
    "  const totalHeight = items.length * itemHeight\n" +
    "  const buffer = 3\n" +
    "  \n" +
    "  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)\n" +
    "  const visibleCount = Math.ceil(containerHeight / itemHeight) + buffer * 2\n" +
    "  const endIndex = Math.min(startIndex + visibleCount, items.length)\n" +
    "  const visibleItems = items.slice(startIndex, endIndex)\n" +
    "\n" +
    "  return (\n" +
    "    <div\n" +
    "      style={{ height: containerHeight, overflow: 'auto' }}\n" +
    "      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}\n" +
    "    >\n" +
    "      <div style={{ height: totalHeight, position: 'relative' }}>\n" +
    "        <div style={{ transform: 'translateY(' + startIndex * itemHeight + 'px)' }}>\n" +
    "          {visibleItems.map(item => (\n" +
    "            <div key={item.id} style={{ height: itemHeight }}>{item.text}</div>\n" +
    "          ))}\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  )\n" +
    "}",
    tags: ["虚拟列表", "性能", "滚动", "大列表", "react-window"],
  },
  {
    id: "perf-05",
    title: "Service Worker 与离线缓存",
    category: "performance",
    difficulty: 2,
    question: "Service Worker 的作用是什么？五种缓存策略分别适用于什么场景？如何与 PWA 结合？",
    answer: `## 一、Service Worker 基础

Service Worker 是独立于页面主线程的后台脚本，充当浏览器与网络之间的代理层。

核心特点：
- 独立线程：不阻塞主线程，无法直接访问 DOM
- 网络拦截：可拦截和处理所有页面发出的网络请求
- 事件驱动：install → activate → fetch → push → sync
- HTTPS 必须：安全策略要求（localhost 例外）
- 生命周期独立：页面关闭后 SW 仍可运行（后台同步/推送）

生命周期：
1. install — 首次安装，预缓存关键资源（event.waitUntil 确保完成）
2. activate — 激活后接管页面，清理旧缓存
3. fetch — 拦截每个网络请求，决定如何响应
4. idle/terminated — 空闲或被浏览器终止以节省内存

## 二、五种缓存策略

Cache First（缓存优先）：
- 策略：先查缓存，命中直接返回；未命中发网络请求并缓存
- 适用：不常变的静态资源（库文件、字体、Logo）
- 缺点：缓存更新不及时

Network First（网络优先）：
- 策略：先发网络请求，成功返回并更新缓存；失败则返回缓存
- 适用：数据频繁更新的接口（但用户体验优先）
- 缺点：慢网络下等待时间长

Stale-While-Revalidate（缓存返回+后台更新）：
- 策略：立即返回缓存，同时发网络请求更新缓存（下次使用新版）
- 适用：对实时性要求不高但希望最新（新闻标题、用户头像）
- 优点：即时响应 + 自动更新

Network Only（仅网络）：
- 策略：始终发网络请求，不缓存
- 适用：实时性极强的数据（支付状态、库存、聊天消息）

Cache Only（仅缓存）：
- 策略：只从缓存返回，不发网络请求
- 适用：确定不变的资源（应用 Shell）

## 三、PWA 离线可用

- Manifest.json：定义应用名、图标、启动页、主题色、显示模式（standalone）
- installable（可安装）：浏览器检测到用户经常访问 + HTTPS + Manifest + SW
- 离线兜底：SW 捕获 fetch 错误，返回自定义离线页面
- Background Sync：用户离线操作（如发消息）排队，联网后自动发送

面试追问：SW 更新后旧缓存怎么处理？
→ activate 事件中 caches.keys() 获取所有缓存，与预设白名单对比，删除不再需要的旧缓存。
   同时调用 self.skipWaiting() + clients.claim() 让新 SW 立即接管所有页面。

追问 2：Service Worker 的缓存空间限制？
→ 各浏览器不同：Chrome 按源配额（约磁盘可用空间的 60%），Safari 约 50MB/源。
   超出限制时浏览器自动清理（LRU 策略）。可用 navigator.storage.estimate() 查询。`,
    codeExample: `// 注册 + install + activate + fetch
// main.js
navigator.serviceWorker.register('/sw.js')

// sw.js
const CACHE_NAME = 'v2'

// install: 预缓存关键资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/', '/app.js', '/style.css', '/offline.html'])
    )
  )
  self.skipWaiting() // 立即激活
})

// activate: 清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  clients.claim() // 立即接管所有页面
})

// fetch: Stale-While-Revalidate 策略
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(networkRes => {
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkRes.clone()))
        return networkRes
      })
      return cached || fetchPromise // 缓存优先，同时后台更新
    })
  )
})`,
    tags: ["Service Worker", "PWA", "离线缓存", "缓存策略"],
  },

  // ══════════════ 新增 ══════════════

  {
    id: "perf-06",
    title: "Bundle 分析与代码分割",
    category: "performance",
    difficulty: 2,
    question: "如何分析前端 Bundle 体积？代码分割有哪些策略？如何配置分包？",
    answer: `## 一、Bundle 分析工具

- vite-bundle-analyzer / webpack-bundle-analyzer：可视化显示每个模块占用的空间
- 用法：构建时生成 stats.json，工具将其转化为可交互的矩形树图
- 关注：最大的几个依赖（红色/大矩形）、重复打包的模块、未 Tree Shake 的代码

面试追问：发现一个依赖占了 200KB，怎么优化？
→ 1) 找替代品：moment.js(200KB) → dayjs(2KB)、lodash → lodash-es
   2) 按需导入：import { Bar } from 'echarts/charts' 而非 import * as echarts
   3) 版本升级：新版本可能已内置 Tree Shaking
   4) 如果包不可替代：独立分包 + CDN 外链

## 二、代码分割策略

路由级分割（最重要）：
- React：React.lazy(() => import('./Page')) + Suspense
- Vue：defineAsyncComponent 或路由配置中的 component: () => import(...)
- 效果：用户访问 A 页面时，B/C/D 页面的代码不下载

组件级分割：
- 大组件：编辑器（Monaco ~1MB）、图表（ECharts ~800KB）、视频播放器
- 条件加载：Modal 内容在打开时才加载、Tab 内容在切换时才加载
- 使用动态 import() 返回 Promise

Vendor 分包：
- 将稳定的第三方依赖单独打包（变化频率低 → 缓存命中率高）
- Vite 配置 build.rollupOptions.output.manualChunks
- 示例：react-vendor（React/ReactDOM）、ui-vendor（组件库）、utils-vendor（lodash/dayjs）

面试追问：怎么判断分包粒度是否合理？
→ 每个 chunk 200-500KB（gzip 后 50-150KB）比较理想。
   太小：请求数过多，HTTP 开销大；太大：单文件加载慢，缓存粒度粗。
   用 bundle analyzer 观察，按「变化频率」而非「体积」分组。

## 三、实战示例`,
    codeExample: `// vite.config.ts — 分包配置
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'utils-vendor': ['dayjs', 'lodash-es'],
          'editor': ['@tiptap/react', '@tiptap/starter-kit'], // 编辑器独立分包
        }
      }
    }
  }
})

// React 路由懒加载
const Editor = lazy(() => import('./pages/Editor'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<Skeleton />}>
  <Routes>
    <Route path="/editor" element={<Editor />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>`,
    tags: ["Bundle", "代码分割", "lazy", "分包", "性能"],
  },
  {
    id: "perf-07",
    title: "浏览器渲染原理与关键渲染路径",
    category: "performance",
    difficulty: 3,
    question: "浏览器从收到 HTML 到渲染出页面，经历了哪些步骤？什么是关键渲染路径？如何优化？",
    answer: `## 一、浏览器渲染完整流程

1. 解析 HTML → DOM Tree（Document Object Model）
   - 词法分析 + 语法分析，构建节点树
   - 遇到 CSS（非阻塞解析但阻塞渲染）→ 暂停等待 CSSOM
   - 遇到同步 JS（阻塞解析 + 渲染）→ 暂停执行

2. 解析 CSS → CSSOM Tree（CSS Object Model）
   - CSS 解析很快，但 CSSOM 构建完成前无法渲染
   - 这也是为什么 CSS 是「渲染阻塞资源」

3. DOM + CSSOM → Render Tree
   - 合并两棵树，过滤掉 display:none 的节点
   - 只包含可见元素

4. Layout（布局/重排）：
   - 计算每个元素的确切位置和尺寸
   - 触发条件：几何属性变化（width/height/padding 等）、DOM 增删、resize

5. Paint（绘制）：
   - 将元素的视觉样式绘制到图层上
   - 触发条件：color/background/shadow 等外观变化

6. Composite（合成）：
   - 将多个图层合并为最终屏幕显示
   - transform/opacity 只触发 Composite（最高效）

## 二、关键渲染路径（Critical Rendering Path）

定义：从收到 HTML 到首次渲染的最短路径。优化策略：

- 减少关键资源数量：内联关键 CSS（首屏样式 < 14KB）+ 非关键 CSS 异步
- 减少关键字节数：压缩 HTML/CSS/JS + Tree Shaking
- 缩短关键路径长度：减少资源间的依赖链

面试追问：为什么首屏 CSS 要内联？
→ 如果 CSS 是外链，浏览器需要先下载 CSS 文件 → 构建 CSSOM → 才能渲染。
   内联直接写在 HTML 中，省去一次网络往返。但内联过多会增加 HTML 体积，只内联首屏关键样式。

追问 2：JS 的 async 和 defer 对渲染有什么影响？
→ 普通 script：暂停 HTML 解析 → 下载 + 执行 JS → 恢复解析（最差）
   async：下载时不阻塞解析，但执行时暂停解析（适合独立脚本如统计）
   defer：下载不阻塞，等 HTML 解析完再执行（适合应用主脚本，推荐）

## 三、重排、重绘、合成的代价

| 操作 | 触发属性 | 影响范围 | 优化 |
|------|---------|---------|------|
| 重排 | width/height/padding/margin/left/top | 当前 + 所有后续元素 | 批量修改 + 读写分离 |
| 重绘 | color/background/visibility | 仅当前元素 | GPU 合成层 |
| 合成 | transform/opacity | 仅当前图层 | 硬件加速 |

面试追问：如何避免强制同步布局？
→ 先读后写原则：批量读取所有需要的布局属性，再批量修改。
   如果先读 scrollTop，再改 width，再读 offsetHeight → 浏览器必须立即布局来获取正确的 offsetHeight。
   这种「读-写-读」模式会触发强制同步布局（Forced Synchronous Layout），严重拖慢性能。`,
    codeExample: `// ❌ 强制同步布局（读-写-读）
el.style.width = '100px'       // 写
const h1 = el.offsetHeight     // 读 → 强制浏览器立即布局！

// ✅ 批量修改
const reads = [el1.offsetHeight, el2.scrollTop] // 先全部读
el1.style.width = '100px'      // 再全部写
el2.style.width = '200px'`,
    tags: ["浏览器渲染", "关键渲染路径", "重排", "重绘", "Composite"],
  },
  {
    id: "perf-08",
    title: "前端内存泄漏排查与优化",
    category: "performance",
    difficulty: 3,
    question: "什么是前端内存泄漏？常见的内存泄漏场景有哪些？如何使用 Chrome DevTools 排查？",
    answer: `## 一、什么是内存泄漏

不再需要的对象仍然被引用，导致 GC（垃圾回收）无法回收，内存持续增长。
前端影响：页面越来越卡、响应变慢、移动端可能崩溃（Safari 内存限制更严格）。

面试追问：V8 GC 的机制？
→ V8 使用分代垃圾回收：新生代（Scavenge，复制算法，频繁回收小对象）+
   老生代（Mark-Sweep-Compact，标记清除+整理，低频回收大对象）。
   JS 无法手动触发 GC，只能解除引用让 GC 自动回收。

## 二、常见泄漏场景及修复

1. 未清理的定时器/动画帧：
   - setInterval 在组件卸载时未 clearInterval
   - requestAnimationFrame 未 cancelAnimationFrame
   - 修复：useEffect 返回清理函数

2. 未移除的事件监听：
   - addEventListener 在组件卸载时未 removeEventListener
   - 修复：useEffect 清理 + AbortController signal

3. 闭包引用：
   - 闭包持有大对象引用（如整个 DOM 树），即使只需要一个小属性
   - 修复：在闭包中只引用需要的变量，或使用 WeakMap/WeakRef

4. DOM 引用残留：
   - JS 变量持有已从 DOM 树移除的元素引用
   - 修复：清理变量引用，或使用 WeakRef

5. WebSocket/EventSource 未关闭：
   - 组件卸载时未断开连接
   - 修复：useEffect 返回清理函数

6. 全局变量：
   - 意外挂到 window 上的变量永远不会被回收
   - 修复：避免全局变量 + ESLint no-global-assign

面试追问：WeakMap 和 Map 的内存泄漏区别？
→ Map 持有 key 的强引用，即使 key 的原对象已无其他引用，Map 中的 key 也不会被 GC。
   WeakMap 持有 key 的弱引用，如果 key 的原对象被 GC，WeakMap 中对应的 entry 自动清除。
   适合用于缓存 DOM 节点相关的元数据。

## 三、Chrome DevTools 排查流程

1. Memory 面板 → Heap Snapshot：
   - 操作前拍快照 → 操作 → 操作后拍快照
   - 对比两个快照，看哪些对象的数量/大小异常增长
   - 关注 Detached DOM Tree（脱离 DOM 树但被 JS 引用的元素）

2. Performance 面板 → Memory 复选框：
   - 录制一段操作，观察 JS Heap 曲线
   - 如果操作结束后内存没有回落到基线水平 → 泄漏

3. Performance Monitor（三点菜单 → More tools）：
   - 实时观察 JS Heap Size、DOM Nodes 的趋势
   - DOM Nodes 持续增长不回落 = 泄漏信号`,
    codeExample: `// ❌ 泄漏示例：未清理的定时器
function LeakyComponent() {
  useEffect(() => {
    setInterval(() => { /* 轮询 */ }, 3000) // 卸载后仍然运行！
  }, [])
}

// ✅ 修复
function FixedComponent() {
  useEffect(() => {
    const id = setInterval(() => { /* 轮询 */ }, 3000)
    return () => clearInterval(id) // 卸载时清理
  }, [])
}

// ✅ 利用 AbortController 一次性清理多个监听
useEffect(() => {
  const controller = new AbortController()
  window.addEventListener('resize', handler, { signal: controller.signal })
  ws.addEventListener('message', msgHandler, { signal: controller.signal })
  return () => controller.abort() // 一行清理所有
}, [])`,
    tags: ["内存泄漏", "Chrome DevTools", "GC", "WeakMap", "性能"],
  },
  {
    id: "perf-09",
    title: "前端缓存策略全解",
    category: "performance",
    difficulty: 2,
    question: "前端有哪些缓存手段？HTTP 缓存、Service Worker、本地存储各自适用什么场景？",
    answer: `## 一、HTTP 缓存（浏览器自动处理）

强缓存（不需要发请求）：
- Cache-Control: max-age=31536000（一年）+ immutable（文件永不变化）
- 适用：带 hash 的 JS/CSS/字体（文件名变了自动请求新版本）
- Expires：旧方案（绝对时间），被 Cache-Control 取代

协商缓存（需要发请求验证）：
- ETag / If-None-Match：文件内容 hash，服务端 304 Not Modified
- Last-Modified / If-Modified-Since：文件修改时间
- 适用：HTML 入口文件（必须每次都验证，确保拿到最新版本）

面试追问：为什么 HTML 不能做强缓存？
→ HTML 是入口文件，引用了 JS/CSS 的 hash 文件名。如果缓存了旧 HTML，
   用户拿不到新 JS 文件（即使已经在服务器上更新了）。HTML 必须 no-cache 每次都验证。

## 二、Service Worker 缓存（可编程控制）

Cache API：caches.open().then(cache.addAll([...]))
- 精细化控制：什么资源缓存、什么时候更新、缓存策略自定义
- 离线优先：即使无网络也能返回缓存内容
- 存储限制：Chrome 约磁盘空闲 60%、Safari 约 50MB/源

Workbox（Google 的 SW 工具库）：
- 预缓存（Precaching）：构建时生成资源清单
- 运行时缓存（Runtime Caching）：运行时动态缓存
- 5 种内置策略 + 自定义插件

## 三、HTTP 缓存 vs SW 缓存对比

| 维度 | HTTP 缓存 | SW 缓存 |
|------|---------|--------|
| 控制粒度 | Header 控制 | JS 完全可编程 |
| 离线支持 | 否（需在线验证） | 是（离线优先） |
| 更新机制 | 依赖 URL 变化 | 自定义策略 |
| 存储位置 | 浏览器 HTTP Cache | Cache Storage API |

## 四、前端本地存储

- localStorage：5MB，同步 API，持久化，适合小量用户偏好
- sessionStorage：5MB，同步 API，Tab 关闭清除，适合临时数据
- IndexedDB：无限（配额管理），异步 API，支持索引和事务，适合大量结构化数据
- Cookies：4KB，每次 HTTP 请求自动发送，适合 token/session

面试追问：IndexedDB vs localStorage 如何选择？
→ < 50KB + 简单 KV：localStorage 足够
   > 50KB + 需要查询/索引：IndexedDB（用 Dexie.js 简化 API）
   需要事务/并发控制：IndexedDB
   需要离线数据同步：IndexedDB + Background Sync`,
    tags: ["缓存", "HTTP缓存", "Service Worker", "IndexedDB", "localStorage"],
  },
  {
    id: "perf-10",
    title: "React/Vue 框架层性能优化",
    category: "performance",
    difficulty: 3,
    question: "在 React 和 Vue 中，分别有哪些框架层面的性能优化手段？对比二者的优化哲学差异。",
    answer: `## 一、React 性能优化

1. React.memo / PureComponent：
   - 浅比较 props，props 不变就不渲染
   - 陷阱：对象/数组/函数作为 props 时每次都是新引用，需配合 useMemo/useCallback

2. useMemo / useCallback：
   - useMemo：缓存计算结果（大数组排序、过滤）
   - useCallback：稳定函数引用（传给 memo 子组件）
   - 不要无脑用：memo 和 useMemo 本身也有开销

3. useDeferredValue / useTransition：
   - useDeferredValue：延迟接收值的变化（输入搜索场景）
   - useTransition：标记状态更新为低优先级

4. 代码分割：React.lazy + Suspense + dynamic import

5. Context 拆分：
   - 不要把所有状态放一个 Context
   - 按更新频率拆分（高频更新的状态和低频的分开）

面试追问：React.memo 什么时候无效？
→ 1) props 中有对象/数组/函数，每次新引用 → memo 认为 props 变了 → 重新渲染。
   2) 子组件使用了 Context，Context 变化会绕过 memo。
   3) 父组件传入的 children prop 每次渲染都是新的 React Element → 如果用 memo 的组件接收 children，大概率无效。

## 二、Vue 性能优化

1. computed vs methods：
   - computed 自动缓存依赖，依赖不变不重新计算
   - methods 每次调用都重新执行

2. v-memo + v-once：
   - v-memo：类似 React.memo，缓存子树（Vue 3.2+）
   - v-once：只渲染一次，永不更新（纯静态内容）

3. shallowRef / shallowReactive：
   - 只对顶层属性做响应式，深层不做代理
   - 适用：大型不可变数据、第三方类实例

4. KeepAlive 缓存组件：
   - 切换 Tab/路由时保留组件状态，避免销毁重建
   - include/exclude/max 控制缓存范围

5. 异步组件：defineAsyncComponent + Suspense

## 三、React vs Vue 优化哲学差异

| 维度 | React | Vue |
|------|-------|-----|
| 默认优化 | 默认全量重新渲染 | 默认精确更新（响应式追踪） |
| 手动优化 | memo/useMemo/useCallback | v-memo/shallowRef |
| 编译器优化 | React Forget（开发中） | 模板编译优化（PatchFlag/Block Tree） |
| 子组件渲染 | 父组件更新 → 子组件默认也更新 | 只更新依赖变化的子组件 |

面试追问：为什么 React 默认不优化，Vue 默认优化？
→ React 的函数式哲学：「渲染 = f(state)」，每次状态变化重新执行整个组件函数最直观。
   优化是开发者按需添加的。Vue 的响应式系统天然知道「哪个属性变了 → 哪些组件依赖它」，
   所以能做到默认精确更新。两种思路各有利弊。`,
    codeExample: `// React: 避免不必要渲染
const ExpensiveList = memo(({ items, onSelect }: Props) => {
  // items 是新数组引用 → memo 失效，需要 useMemo 包裹父组件的过滤逻辑
})

// ✅ 父组件
const filtered = useMemo(() => items.filter(...), [items, query])
const handleSelect = useCallback((id) => { ... }, [])
<ExpensiveList items={filtered} onSelect={handleSelect} />

// Vue: 天然优化
<script setup>
const props = defineProps<{ items: Item[] }>()
// 模板中只访问 props.items → 只有 items 变化时才重新渲染
// 不需要额外的 memo/useMemo
</script>`,
    tags: ["React", "Vue", "memo", "computed", "性能优化"],
  },
  {
    id: "perf-11",
    title: "资源加载优先级与预加载策略",
    category: "performance",
    difficulty: 2,
    question: "浏览器如何确定资源加载优先级？preload、prefetch、preconnect、dns-prefetch 分别怎么用？fetchpriority 属性如何影响加载顺序？",
    answer: `## 一、浏览器默认优先级

浏览器根据资源类型和位置自动分配优先级（Chrome 为例）：

- Highest：HTML、关键 CSS（head 中的 <link>）
- High：首屏图片、字体、preload 的资源
- Medium：非首屏 JS/CSS、fetch API
- Low：prefetch、async 脚本、非首屏图片
- Lowest：tracking scripts、广告

面试追问：如何查看资源的加载优先级？
→ Chrome DevTools → Network 面板 → 表头右键 → 勾选 Priority 列。
   可以看到每个资源的 Initial Priority。后来 Chrome 引入了 Priority Hints（fetchpriority）
   允许开发者手动调整。

## 二、预加载指令详解

preload（强制预加载）：
- <link rel="preload" href="hero.webp" as="image">
- 告诉浏览器：这个资源当前页面一定需要，立即下载，高优先级
- 适用：首屏 hero 图、关键字体、关键 CSS/JS
- 必须指定 as 属性（image/font/script/style），否则无效
- 3 秒内未使用 → Chrome 控制台警告

prefetch（空闲预取）：
- <link rel="prefetch" href="next-page.js">
- 浏览器空闲时下载，低优先级，未来导航可能用到
- 适用：下一页的 JS/CSS、hover 时预取链接目标
- 注意：prefetch 的资源可能被浏览器在内存压力下丢弃

preconnect（预连接）：
- <link rel="preconnect" href="https://api.example.com">
- 提前建立连接（DNS + TCP + TLS），节省 100-300ms
- 适用：确定会用到的第三方域名（API、CDN、字体）

dns-prefetch（预解析）：
- <link rel="dns-prefetch" href="//cdn.example.com">
- 只做 DNS 解析（不做 TCP/TLS），比 preconnect 更轻量
- 适用：可能但不一定用到的域名（第三方统计、社交分享）

面试追问：preconnect 和 dns-prefetch 如何选择？
→ 确定会用 + 跨域关键资源 → preconnect（但只对前 4-6 个域名，多了反而开销大）
   可能用到 + 次要域 → dns-prefetch
   同一域不要同时用两个

## 三、fetchpriority（优先级提示）

Chrome 101+ 支持的属性，直接控制资源加载优先级：

- fetchpriority="high"：提升优先级（如首屏 LCP 图片、hero banner）
- fetchpriority="low"：降低优先级（如非首屏图片、页脚脚本）
- 适用元素：<img>、<link>、<script>、<iframe>

面试追问：fetchpriority 真的有效吗？
→ 有效但不是绝对的。浏览器仍然有最终决定权。
   比如 low 优先级的资源如果阻塞了渲染，浏览器可能仍提升其优先级。
   它是一个「提示（hint）」而非「指令」。`,
    codeExample: `<!-- preload：当前页关键资源 -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">
<link rel="preload" href="/font.woff2" as="font" crossorigin>

<!-- prefetch：下一页面可能用到 -->
<link rel="prefetch" href="/search-page.js">

<!-- preconnect：确定会用的第三方 API -->
<link rel="preconnect" href="https://api.example.com">

<!-- dns-prefetch：可能用到的统计/分析 -->
<link rel="dns-prefetch" href="//www.googletagmanager.com">

<!-- fetchpriority：首屏关键图片提升优先级 -->
<img src="hero.webp" fetchpriority="high" />
<img src="footer-logo.webp" loading="lazy" fetchpriority="low" />`,
    tags: ["preload", "prefetch", "preconnect", "fetchpriority", "性能"],
  },
]
