import type { KnowledgePoint } from '../types'

/**
 * 简历深度面试题 — 基于 Mark 简历技术栈定制
 * 覆盖：React 架构 / Vue 深入 / 前端工程化 / AI 前端集成 / 性能优化 / 实时通信 /
 *        高并发前端 / 数据埋点 / 组件库设计 / 测试策略 / 团队协作
 * 每题均为深度追问级别，含详细答案与实战场景。
 */
export const resumeData: KnowledgePoint[] = [

  // ══════════════ React 架构深度 (1-5) ══════════════
  {
    id: 'res-01',
    title: 'React Fiber 架构与调度机制',
    category: 'resume',
    subCategory: 'React 架构深度',
    difficulty: 3,
    question: '请深入解释 React Fiber 架构的设计动机、核心数据结构与调度原理。在 6 年前端项目中，Fiber 如何影响你的架构决策？',
    answer: '设计动机：React 15 的 Stack Reconciler 是同步递归的，一旦开始渲染就无法中断，导致长任务阻塞主线程。Fiber 的目标是实现可中断的异步渲染。\n\n核心数据结构 — Fiber Node：\n- 每个组件对应一个 Fiber 节点，构成一棵 Fiber 树\n- 关键字段：type（组件类型）、stateNode（对应 DOM/实例）、child/sibling/return（链表结构替代递归调用栈）、alternate（双缓冲）、effectTag（副作用标记）、lanes（优先级）\n\n双缓冲机制：current 树是当前屏幕上的 Fiber 树，workInProgress 树是正在内存中构建的新树。Commit 阶段完成后两棵树通过 alternate 指针互换。\n\n调度原理（Scheduler）：\n- Render 阶段可中断，通过 MessageChannel 实现时间切片（5ms 一帧）\n- Lane 模型：31 种优先级车道，取代 expirationTime，更细粒度控制更新\n- Commit 阶段不可中断，同步执行 DOM 变更\n\n架构决策影响：\n- 大型列表/表格 → 使用 useTransition 标记低优先级更新，避免输入卡顿\n- 高频数据刷新 → 利用 startTransition 包裹非紧急状态\n- 组件拆分粒度 → Fiber 节点过多导致遍历开销，需平衡拆分粒度\n\n--- 深度补充：Fiber 实战 ---\n双缓冲：current 树（屏幕显示）和 workInProgress（内存构建），Commit 阶段通过 alternate 指针原子交换。Lane 优先级：lane=1 用户输入、lane=4 setState、lane=16 useTransition。React 用 MessageChannel 实现 5ms 时间切片，而非 requestIdleCallback（Safari 不支持）。',
    codeExample: `// useTransition 实战：搜索输入 + 结果列表
function SearchPage() {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    setQuery(e.target.value)           // 紧急：输入框立即响应
    startTransition(() => {
      setResults(filterData(e.target.value))  // 非紧急：搜索结果可延迟
    })
  }

  return <>
    <input value={query} onChange={handleChange} />
    {isPending && <Spinner />}
    <ResultList data={results} />
  </>
}`,
    tags: ['React', 'Fiber', '调度', 'Lane', 'useTransition', '双缓冲'],
  },
  {
    id: 'res-02',
    title: 'React Server Components 原理与实践',
    category: 'resume',
    subCategory: 'React 架构深度',
    difficulty: 3,
    question: 'React Server Components (RSC) 的核心原理是什么？在 Next.js App Router 中如何决策「客户端组件」与「服务端组件」的边界？结合你简历中的项目经验，哪些场景适合 RSC？',
    answer: 'RSC 核心原理：\n- Server Component 在服务端渲染为特殊序列化格式（RSC Payload），不是 HTML 也不是 JSON，而是包含组件树结构的流式数据\n- 客户端收到后通过 React reconciler 重建组件树，但 Server Component 代码永远不会发送到浏览器\n- 零 bundle size：服务端组件及其依赖不会打包到客户端 JS\n\n客户端 vs 服务端边界决策：\n服务端组件（默认）：数据获取（直接访问数据库/API，无需暴露端点）、敏感逻辑（token 验证）、大依赖库（markdown 解析）、静态内容渲染\n客户端组件（"use client"）：交互事件（onClick/onChange）、浏览器 API（useEffect/useState）、第三方客户端库（图表、编辑器）、自定义 Hooks\n\n简历项目映射：\n- AI 多媒体平台 → 媒体列表/详情用 RSC（服务端直查数据），字幕编辑器/标注工具用客户端组件\n- 游戏官网 → 新闻列表/游戏介绍用 RSC + ISR，活动互动模块用客户端组件\n- 企业后台 → 报表页面可 RSC 直查数据，表单编辑/批量操作用客户端\n\n--- 深度补充：RSC 实战 ---\n服务端组件可直接访问数据库，媒体列表页用 RSC 直查 PostgreSQL 零 JS 渲染。RSC Payload 是 React 特有流式格式非 JSON。陷阱：Server Component 不能用 useState/useEffect，需抽 Client Component 通过 children 传递。',
    tags: ['React', 'RSC', 'Server Components', 'Next.js', '客户端组件'],
  },
  {
    id: 'res-03',
    title: 'React 状态管理架构分层设计',
    category: 'resume',
    subCategory: 'React 架构深度',
    difficulty: 3,
    question: '你在简历中提到用 Zustand、Context+useReducer 做状态管理。请详细阐述复杂前端项目中如何分层设计状态管理架构。Server State / UI State / Form State / URL State 的最佳管理方案是什么？',
    answer: '状态分层架构（由外向内）：\n\n1. URL State（路由参数、查询参数）\n工具：Next.js useSearchParams / Vue Router query\n特点：可分享、可书签、SEO 友好\n适用：搜索关键词、分页、筛选条件、Tab 切换\n\n2. Server State（服务端数据）\n工具：TanStack Query / SWR\n特点：自动缓存、去重、后台刷新、乐观更新、分页/无限滚动\n绝不放入全局 store：服务端数据有独立的生命周期（staleTime、cacheTime）\n\n3. UI State（界面交互状态）\na. 局部 UI（Modal/Tab/Accordion）→ useState\nb. 跨组件 UI（全局 Loading/主题/侧栏）→ Zustand\nc. 持久化 UI（用户偏好）→ Zustand + persist middleware\n\n4. Form State（表单状态）\n工具：React Hook Form / Formik\n特点：独立于全局 store，避免每次按键触发全局重渲染\n仅在提交时将数据提升到 Server State\n\n选型决策：服务端数据 → TanStack Query；跨组件客户端状态 → Zustand；复杂状态转换 → useReducer；团队规范强约束 → Redux Toolkit\n\n--- 深度补充：状态管理实战 ---\nTanStack Query staleTime（数据变陈旧时间）vs gcTime（垃圾回收时间）常被搞混。排行榜 staleTime=30s、gcTime=5min。Zustand selector 精确订阅需 shallow 比较对象返回值。React Hook Form 非受控模式 register 不触发重渲染。',
    codeExample: `// Zustand 最佳实践：按领域拆分 Store
// stores/authStore.ts
export const useAuthStore = create((set) => ({
  user: null,
  login: (u) => set({ user: u }),
  logout: () => set({ user: null }),
}))

// stores/uiStore.ts
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
}))`,
    tags: ['React', '状态管理', 'Zustand', 'React Query', '架构设计'],
  },
  {
    id: 'res-04',
    title: '组件库分层设计与 API 规范',
    category: 'resume',
    subCategory: 'React 架构深度',
    difficulty: 3,
    question: '你在简历中提到「设计并落地前端组件库与业务组件体系」。请详细阐述如何从零设计一个跨产品线的 React 组件体系：分层策略、API 设计原则、样式方案、版本管理。',
    answer: '组件分层四层模型：\n\nLayer 1 — Base / Primitive（基础组件）\nButton、Input、Select、Modal、Tooltip、Toast 等原子组件。无业务逻辑，只关注 UI 表现和行为。API 设计原则：Props 少而精、组合优于配置、受控/非受控双模式。样式：CSS Variables + Tailwind / CSS Modules，支持主题化。\n\nLayer 2 — Composite（复合组件）\nDatePicker、Table、Form、Upload、Tree 等。封装常见交互模式（多选、拖拽排序、虚拟滚动）。通过 Render Props / Slots 提供自定义能力。\n\nLayer 3 — Business（业务组件）\nMediaCard、UserAvatar、PaymentForm、GameRanking 等。包含业务逻辑（数据格式、校验规则、权限判断）。跨项目共享需考虑配置化。\n\nLayer 4 — Page Template（页面模板）\nDashboardLayout、ListPage、DetailPage 等。定义页面信息架构、数据流和路由。\n\nAPI 设计原则：一致性（相同语义用相同 Props 名）、可组合（children/renderProp 优先）、类型安全（泛型 Props + 严格 TS 导出）、渐进增强\n\n版本管理：Monorepo（pnpm + Turborepo）+ Changesets + 语义化版本 + CHANGELOG 自动生成 + Storybook 文档化\n\n--- 深度补充：组件库工程 ---\nCSS Variables 三层 Token：primitive(blue-500)→semantic(color-primary)→component(button-bg)。Storybook CSF 3.0 + Chromatic 视觉回归测试。Monorepo 中组件库 peerDependencies 标记 external 避免打包多份 React。',
    codeExample: `// 高质量组件 API 示例
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}
// 使用：<Button variant="primary" loading icon={<Save />}>保存</Button>`,
    tags: ['组件库', '架构设计', 'API设计', 'Storybook', 'Monorepo'],
  },
  {
    id: 'res-05',
    title: 'React 性能优化系统化方法论',
    category: 'resume',
    subCategory: 'React 架构深度',
    difficulty: 3,
    question: '你在简历中多次提到性能优化。请从「测量 → 分析 → 优化 → 监控」四个阶段，系统阐述 React 应用的性能优化方法论。给出实际项目中的具体优化案例和数据变化。',
    answer: '完整四阶段流水线：\n\n阶段一：测量\n- Core Web Vitals：LCP（< 2.5s）、INP（< 200ms）、CLS（< 0.1）\n- 工具：Lighthouse CI、PageSpeed Insights、Web Vitals 库、Chrome UX Report\n- React Profiler：定位哪些组件渲染了、为什么渲染、渲染耗时\n\n阶段二：分析\n- Bundle 分析：vite-bundle-analyzer，找出大依赖（moment.js→dayjs、lodash→lodash-es）\n- Network 瀑布图：关键请求链、资源阻塞\n- React DevTools Profiler：火焰图找瓶颈组件\n- 内存分析：Chrome Memory Profiler 排查闭包泄漏\n\n阶段三：优化\n- 渲染优化：React.memo + useMemo + useCallback（先 profiling 再优化）\n- 代码分割：React.lazy + Suspense 路由级；动态 import 组件级\n- 虚拟列表：react-window / @tanstack/virtual\n- 图片优化：WebP/AVIF、响应式 srcset、lazy loading、CDN 裁剪\n- 数据获取：TanStack Query 缓存 + staleTime、乐观更新\n\n阶段四：监控\n- RUM：Sentry / 自建 Web Vitals 上报\n- 建立性能预算：bundle < 200KB（gzip）、LCP < 2.5s\n- CI 集成 Lighthouse 断言，阻止性能回退\n\n实战案例：游戏活动页首屏 LCP 2.8s → 1.6s（图片 WebP + 预加载 + 移除阻塞脚本）；企业后台大表格 5000 行卡顿 → 虚拟滚动 + React.memo，渲染从 2s → 200ms\n\n--- 深度补充：性能优化实战 ---\nLab Data vs Field Data(CrUX)差距大，看 p75 分位数。React.memo 浅比较陷阱：对象/数组/函数每次新引用导致失效，需 useMemo/useCallback。moment.js→dayjs 省 200KB+，用 lodash-es 支持 Tree Shaking。',
    codeExample: `// useDeferredValue：大量数据过滤不阻塞输入
function SearchList({ items }) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(() =>
    items.filter(i => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  )
  return <>
    <input value={query} onChange={e => setQuery(e.target.value)} />
    <List data={filtered} style={{ opacity: query !== deferredQuery ? 0.5 : 1 }} />
  </>
}`,
    tags: ['性能优化', 'Core Web Vitals', '虚拟列表', '代码分割', 'React Profiler'],
  },

  // ══════════════ Vue 深入 (6-8) ══════════════
  {
    id: 'res-06',
    title: 'Vue 3 响应式系统深度剖析',
    category: 'resume',
    subCategory: 'Vue 深入',
    difficulty: 3,
    question: '请深入解释 Vue 3 响应式系统的实现细节：reactive() 的 Proxy 拦截策略、ref() 的内部机制、effect 追踪与触发依赖的过程，以及 computed 的惰性求值与缓存机制。',
    answer: 'Vue 3 响应式系统三层架构：\n\n第一层：reactive() — Proxy 代理\n- 对传入对象创建 Proxy，拦截 get、set、deleteProperty、has、ownKeys\n- 惰性递归：嵌套对象在被访问时才转为 Proxy，非初始化时全量递归\n- 缓存机制：WeakMap<target, Proxy> 保证同一对象返回同一 Proxy\n\n第二层：ref() — getter/setter\n- 内部创建 Dep 对象维护订阅者，.value 访问触发 track，赋值触发 trigger\n- 模板中自动解包 .value（编译时转换）\n- ref 嵌套在 reactive 对象中也会自动解包\n\n第三层：effect() — 依赖追踪与触发\n- effect(fn) 执行时设置 activeEffect，fn 内访问响应式数据时 get 拦截器将 effect 加入依赖集合\n- 数据变更时 set 拦截器找出所有订阅 effect 并调度执行\n- 清理机制：每次 effect 重新执行前清理旧的依赖关系\n\ncomputed 惰性求值：\n- 内部也是 effect，依赖变化时不立即执行，只标记 _dirty = true\n- 下次 .value 访问时检查 _dirty，真则重新计算并缓存\n- 多次访问返回缓存值，直到依赖变化触发 _dirty\n\n--- 深度补充：响应式调试 ---\nVue DevTools Timeline 追踪 effect 触发链。shallowRef 适合大量不可变数据，避免深度响应式开销。toRaw 获取原始对象传给第三方库，markRaw 标记永不响应式。',
    codeExample: `// 响应式系统简化实现
const targetMap = new WeakMap()
let activeEffect = null

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (dep) dep.forEach(effect => effect())
}`,
    tags: ['Vue', '响应式', 'Proxy', 'ref', 'computed', 'effect'],
  },
  {
    id: 'res-07',
    title: 'Vue 3 Compiler 优化与 Vapor Mode',
    category: 'resume',
    subCategory: 'Vue 深入',
    difficulty: 3,
    question: 'Vue 3 的编译器做了哪些优化来提升运行时性能？Vapor Mode 是什么？在你的项目中选择 Vue 还是 React 的决策框架是什么？',
    answer: 'Vue 3 Compiler 五大优化：\n\n1. 静态提升（Static Hoisting）：编译时将不变 VNode 提升到 render 函数外部，复用同一对象跳过 diff\n2. Patch Flags：编译时为每个动态绑定生成标记（1=TEXT, 2=CLASS, 8=PROPS），Diff 时只比较标记类型，静态节点直接跳过\n3. Block Tree：模板按动态节点切分成 Block，Diff 时只遍历动态子节点\n4. 事件缓存：onClick 等事件处理函数编译时自动缓存，避免子组件因函数引用变化 re-render\n5. 静态 Tree 提升：整段静态 HTML 提升为常量，完全跳过 diff\n\nVapor Mode（无 Virtual DOM 模式）：编译时直接将模板编译为命令式 DOM 操作代码，运行时不需要 Virtual DOM，内存和性能接近 Vanilla JS。\n\nVue vs React 选型：\n- Vue：中小团队、需要快速上手、模板语法统一团队风格、中文生态需求\n- React：大团队需要灵活度、复杂交互场景多、服务端组件需求、生态广度\n- 个人偏好：React 用于复杂管理后台 + AI 交互类，Vue 用于活动页 + 内容网站 + 快速交付\n\n--- 深度补充：编译器验证 ---\nPatch Flags 在编译后代码中以数字标记（1=TEXT, 8=PROPS）。Vapor Mode 牺牲 VDOM 灵活性换极致性能。选型：5 人以下团队偏 Vue，10 人以上偏 React。',
    tags: ['Vue', 'Compiler', 'Patch Flags', 'Vapor Mode', '选型'],
  },
  {
    id: 'res-08',
    title: 'Vue Composables 与 React Hooks 对比',
    category: 'resume',
    subCategory: 'Vue 深入',
    difficulty: 2,
    question: '结合项目经验，阐述 Vue 3 Composables 的最佳实践。与 React Hooks 相比有何异同？常见反模式有哪些？',
    answer: 'Composable 设计原则：\n1. 单一职责：每个 Composable 只做一件事（useAuth、useMediaQuery、useWebSocket）\n2. 返回值约定：只读状态用 computed/readonly，可变状态用 ref/reactive，函数用 camelCase\n3. 副作用清理：onMounted/onUnmounted/watch 在 Composable 内自动管理，不需要像 React 手动声明依赖数组\n4. 参数响应式：接收 ref/getter 函数，用 toValue()（Vue 3.3+）统一处理\n\n与 React Hooks 对比：\n- 相同：都是逻辑复用的函数封装\n- 不同：Vue 不需要依赖数组（自动追踪），避免了 stale closure 问题；Vue 的 setup() 只执行一次，Hooks 每次渲染都执行；Vue watchEffect 自动追踪，React useEffect 需手动声明\n\n常见反模式：\n- Composable 内直接修改 props\n- 在 Composable 内创建新 reactive 对象不考虑外部引用\n- 忘记在 onUnmounted 中清理定时器/事件监听/WebSocket\n- Composable 嵌套过深导致回调地狱\n\n--- 深度补充：Composable 测试 ---\n用 @vue/test-utils + defineComponent 包裹测试。Composable vs Mixin：Mixin 有命名冲突和来源不透明问题。与 React Hooks 对比：Vue 不需要依赖数组（自动追踪），setup 只执行一次。',
    codeExample: `// 优秀的 Composable 设计
import { ref, onMounted, onUnmounted, readonly } from 'vue'

export function useWebSocket(url: string | Ref<string>) {
  const data = ref(null)
  const status = ref<'connecting' | 'open' | 'closed'>('closed')
  let ws: WebSocket | null = null

  const connect = () => {
    ws = new WebSocket(toValue(url))
    status.value = 'connecting'
    ws.onopen = () => (status.value = 'open')
    ws.onmessage = (e) => (data.value = JSON.parse(e.data))
    ws.onclose = () => (status.value = 'closed')
  }

  onMounted(connect)
  onUnmounted(() => ws?.close())

  return { data: readonly(data), status: readonly(status), send: (msg: string) => ws?.send(msg) }
}`,
    tags: ['Vue', 'Composables', '设计模式', 'Hooks', '最佳实践'],
  },

  // ══════════════ 前端工程化 (9-12) ══════════════
  {
    id: 'res-09',
    title: 'Vite 构建原理与自定义插件',
    category: 'resume',
    subCategory: '前端工程化',
    difficulty: 3,
    question: '请深入解释 Vite 的构建原理：开发模式下的按需编译如何实现？生产构建的 Rollup 打包做了哪些优化？Vite 插件机制与 Rollup 插件有何关系？',
    answer: '开发模式 — 按需编译：\n1. 启动时用 esbuild 预构建 node_modules 依赖（转 ESM、合并碎片模块）\n2. 源码通过浏览器原生 ESM import 加载\n3. Vite Dev Server 拦截 .vue/.ts/.jsx 请求，按需转换返回\n4. 模块图：维护 import 关系图，文件变更时精确 HMR（只更新受影响模块）\n\n生产构建 — Rollup：\n- 为什么不用 esbuild：代码拆分和 CSS 处理能力弱\n- Rollup 优势：Tree-shaking 天然支持、代码分割灵活、插件生态成熟\n- Vite 统一了 dev/build 的插件接口和配置\n\nVite 插件机制：\n- 兼容 Rollup 插件接口，同时扩展了 Vite 特有 Hooks\n- 开发阶段 Hooks：config、configResolved、configureServer、transformIndexHtml、handleHotUpdate\n- 通用 Hooks（Rollup 兼容）：resolveId、load、transform\n\n实战：自定义 SVG Sprite 插件 — configureServer 阶段扫描所有 SVG 生成 symbol 列表，transformIndexHtml 阶段注入脚本，handleHotUpdate 监听 SVG 变更通知客户端更新\n\n--- 深度补充：esbuild 限制 ---\nesbuild 不能替代 Rollup 生产构建：代码分割弱、CSS 处理基本为零。Vite 预构建用 esbuild 将 CJS 转 ESM、合并碎片模块，缓存在 node_modules/.vite。HMR 精确度取决于模块边界。',
    codeExample: `// 自定义 Vite 插件：构建信息注入
function buildInfoPlugin() {
  return {
    name: "build-info",
    transformIndexHtml(html) {
      const info = \`BUILD: \${new Date().toISOString().slice(0, 19)}\`
      return html.replace("</head>", \`<meta name="build" content="\${info}"></head>\`)
    },
    config(config, { command }) {
      if (command === "build") {
        config.define = { ...config.define, __BUILD_TIME__: JSON.stringify(Date.now()) }
      }
    }
  }
}`,
    tags: ['Vite', 'Rollup', 'esbuild', '插件', 'HMR', '构建优化'],
  },
  {
    id: 'res-10',
    title: '前端 CI/CD 与自动化质量保障',
    category: 'resume',
    subCategory: '前端工程化',
    difficulty: 2,
    question: '结合简历中的工程化经验，详细描述一套前端 CI/CD 流水线的设计。从代码提交到生产部署，每个阶段做哪些检查？如何保障代码质量和构建产物的一致性？',
    answer: '完整前端 CI/CD 流水线：\n\nPre-commit（Husky + lint-staged）：对 staged 文件执行 ESLint + Prettier，运行相关单元测试（jest --findRelatedTests），commitlint 校验 commit message 格式\n\nPR 检查（GitHub Actions）：npm ci 锁定依赖 → tsc --noEmit 类型检查 → ESLint + Prettier 全量 → 单元测试 + 组件测试（Vitest）→ 构建验证 → Bundle 体积分析 → Lighthouse CI 断言\n\n合并到 main：E2E 测试（Playwright，关键用户路径）→ 部署 Staging → 冒烟测试 → 视觉回归测试（Percy/Chromatic）\n\n生产部署：构建生产产物 → 上传 CDN/OSS → 更新 Nginx 配置 → 灰度发布 → 监控告警（Sentry + Web Vitals）\n\n质量卡点：禁止直接 push 到 main，PR 必须通过所有 CI 检查 + 至少 1 人 Code Review，TypeScript strict: true 禁止 any，测试覆盖率门槛 > 80%\n\n--- 深度补充：CI 优化 ---\nPR 检查按需运行（--since=origin/main）。actions/cache@v4 缓存 pnpm store。Bundle 体积监控用 GitHub Actions 在 PR 评论贴对比表，总 bundle >500KB gzip 阻断 CI。Husky v9 需 npm pkg set scripts.prepare。',
    tags: ['CI/CD', 'Husky', 'ESLint', 'GitHub Actions', '质量保障'],
  },
  {
    id: 'res-11',
    title: 'Monorepo 架构与 Turborepo',
    category: 'resume',
    subCategory: '前端工程化',
    difficulty: 3,
    question: '如果你要为公司搭建 Monorepo 管理多个前端项目（官网、后台、H5、组件库），如何设计？Turborepo 的核心机制是什么？如何处理依赖管理和版本发布？',
    answer: 'Monorepo 架构设计：\napps/ — 各应用（web、admin、h5）\npackages/ — 共享包：ui（组件库）、utils（工具函数）、config-eslint、config-ts、hooks\n\nTurborepo 核心机制：\n1. 缓存：本地缓存构建产物哈希，未变更包跳过构建；远程缓存让团队共享\n2. 并行执行：依赖拓扑排序，无依赖任务并行\n3. 依赖图：package.json workspaces + turbo.json pipeline 配置\n\nturbo.json pipeline 配置：build dependsOn [^build]（先构建依赖包），test dependsOn [build]，lint 无依赖可并行，dev 不缓存\n\n版本发布（Changesets）：开发者 changeset add 选择变更包和版本类型 → CI 中 changeset version 自动更新版本号和 CHANGELOG → changeset publish 发布到 npm\n\n简历关联：组件库建设 + 多项目维护需要 Monorepo 统一管理共享代码和配置。\n\n--- 深度补充：pnpm 依赖 ---\npnpm 硬链接节省 50%+ 磁盘，严格依赖隔离避免幽灵依赖。Turborepo 远程缓存使冷启动构建缩短 60-80%。Changesets 工作流：add→version→publish，changeset 文件需提交 Git。',
    codeExample: `// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": { "dependsOn": ["build"] },
    "lint": {},
    "dev": { "cache": false, "persistent": true }
  }
}`,
    tags: ['Monorepo', 'Turborepo', 'Changesets', 'pnpm', '架构'],
  },
  {
    id: 'res-12',
    title: 'TypeScript 高级类型与工程实践',
    category: 'resume',
    subCategory: '前端工程化',
    difficulty: 3,
    question: '在 6 年 TypeScript 实践中，你用过哪些高级类型？举例说明条件类型、模板字面量类型、映射类型、infer 关键字在真实项目中的使用场景。如何在大型项目中保持类型安全与开发效率的平衡？',
    answer: '高级类型实战：\n\n1. 条件类型 + infer — API 响应类型推断\n- infer R 提取 Promise 内部类型，用于 TanStack Query 的 select 回调类型推导\n\n2. 模板字面量类型 — 事件系统\n- type EventName = `on${Capitalize<string>}` 约束事件命名\n- CSS Prop 类型：`mt-${number}` | `mb-${number}`\n\n3. 映射类型 — 权限系统\n- type ReadonlyFields<T, K extends keyof T> = Omit<T, K> & { readonly [P in K]: T[P] }\n- 服务端返回某些字段前端只读，映射类型自动生成\n\n4. 表单校验类型体 — FieldConfig<T> 从数据模型自动推导表单字段配置，避免 field name 与数据类型不匹配\n\n平衡策略：\n- strict: true 是底线\n- 公共 API（组件 Props、API 响应）必须有完整类型\n- 内部工具函数适度使用 as/any（加注释说明原因）\n- 复杂泛型加 JSDoc 说明意图\n- CI 中 tsc --noEmit 阻断类型错误\n\n--- 深度补充：TS 严格模式 ---\nstrictNullChecks、noUncheckedIndexedAccess、noImplicitAny 必须全开。类型体操边界：如果类型定义比实现代码长，考虑简化。.d.ts 中 import 会将文件变为模块——用 import type 避免。',
    codeExample: `// 实战：通用 API Hook 类型
async function fetchAPI<T>(url: string): Promise<{ data: T; ok: boolean }> {
  const res = await fetch(url)
  return res.json()
}

// 提取 Promise 泛型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// API 响应类型
type UserResponse = { id: number; name: string; role: 'admin' | 'user' }

// 使用时自动推导
const { data } = await fetchAPI<UserResponse>('/api/user')
// data 自动为 UserResponse 类型，有完整智能提示`,
    tags: ['TypeScript', '高级类型', 'infer', '条件类型', '类型安全'],
  },

  // ══════════════ AI 前端集成 (29, 13-15, 26-28) ══════════════
  // AI 项目介绍 (29)
  {
    id: 'res-29',
    title: 'AI项目介绍：多媒体互动平台全览',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 2,
    question: '请详细介绍你在简历中提到的 AI 视频直播/多媒体互动平台项目。涵盖：项目概述、核心功能、AI 能力集成细节、面向用户、前端技术栈全景。',
    answer: 'AI 视频直播 / 多媒体互动平台 — 项目全览\n\n--- 一、项目概述 ---\n我负责前端架构与核心开发的 AI 多媒体平台，面向内容创作者和媒体团队的 SaaS 产品。整合 AI 视觉识别、语音转写、智能标签和自然语言搜索，管理海量非结构化媒体资产。\n\n--- 二、核心功能 ---\n1. 媒体资产管理：大文件分片上传（Resumable.js）+ 进度可视化 + 断点续传。支持图片、视频、音频预览、分类、标签和全文搜索。\n2. AI OCR 文字识别：集成 PaddleOCR，前端实现交互式标注——用户可在图片上框选修正 AI 识别结果，支持拖拽选区、编辑文本、置信度可视化（低置信度标红）。\n3. Whisper 语音转字幕：上传视频/音频自动生成多语言字幕。前端实现逐句同步高亮、Canvas 时间轴编辑器（拖拽调整时间点）、字幕文本编辑（合并拆分、双语字幕）。\n4. 智能标签与搜索：OpenAI/视觉模型自动打标签（物体、场景、人物、情绪）。前端展示标签云、自然语言搜索（"找一张有猫的图片"→ 向量搜索 → 结果展示）。\n5. 会员与权限：多租户架构，RBAC 权限控制（路由级+组件级），操作日志审计。\n\n--- 三、AI 能力集成 ---\n- Prompt Engineering：多层 Prompt 体系——基础 Prompt（角色+格式）→ 任务 Prompt（具体指令）→ 上下文 Prompt（用户当前媒体信息）。Zustand 管理 Prompt 模板库。\n- 流式处理：自然语言搜索和 AI 标签生成用 SSE 流式返回，textBuffer + rAF 批量渲染。\n- WebSocket：直播字幕、多人协作标注通过 Socket.io 实现，断线重连和离线消息队列。\n- Web Worker：OCR 图片裁剪、Canvas 坐标计算在 Worker 中执行，避免阻塞主线程。\n\n--- 四、面向用户 ---\n内容创作者（YouTuber/短视频博主）用于字幕生成和素材管理；媒体制作团队用于海量素材 AI 标注和检索；在线教育平台用于课程视频字幕和知识点标签化。\n\n--- 五、前端技术栈全景 ---\n框架：React 18 + TypeScript + Next.js 14（App Router）\n状态管理：Zustand（全局）+ TanStack Query（服务端）\n样式：Tailwind CSS + CSS Variables 主题系统\n构建：Vite + pnpm Monorepo\n核心能力：Canvas API（时间轴）、WebSocket/Socket.io、SSE 流式、Web Worker、IndexedDB\n测试：Vitest + Playwright\n工程化：ESLint + Prettier + Husky + GitHub Actions CI/CD + Sentry + Web Vitals\nAI 工具：Codex/Claude Code 辅助需求拆解、组件生成、测试用例编写',
    tags: ['AI项目', '多媒体平台', 'OCR', 'Whisper', '流式处理', 'Canvas', 'WebSocket', '前端架构'],
  },

  {
    id: 'res-13',
    title: 'AI Chat 前端架构设计',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 3,
    question: '你在简历中提到 AI 能力的前端集成。如果要设计一个通用 AI Chat 前端框架（类似 ChatGPT），请从流式响应渲染、会话管理、上下文窗口、插件系统四个维度详细阐述架构设计。',
    answer: '通用 AI Chat 前端架构：\n\n一、流式响应渲染（SSE / Stream）\n- 后端返回 ReadableStream，前端 fetch + getReader() 逐 chunk 读取\n- 解析 SSE 格式：data: {"choices":[{"delta":{"content":"..."}}]}\n- Markdown 增量渲染：维护文本 buffer + 按段落刷新，避免整体重新渲染闪烁\n- 中止机制：AbortController signal 传入 fetch，用户停止时调用 abort()\n- 断线重连：记录已接收 token 数，重连时传 last_message_id 继续\n\n二、会话管理\n- 数据结构：Conversation { id, messages[], createdAt }，Message { id, role, content, status }\n- 状态管理：Zustand store，conversations 数组 + activeId\n- 持久化：IndexedDB（Dexie.js）缓存最近会话\n- 多会话切换：虚拟列表懒加载历史消息\n\n三、上下文窗口管理\n- Token 计算：tiktoken 在浏览器端估算\n- 窗口溢出策略：滑动窗口（保留最近 N 条）、摘要压缩（超限用 LLM 总结早期对话）、智能截断（优先级 system > 最近用户消息 > 历史上下文）\n- 前端 token 指示器显示当前占用/最大窗口\n\n四、插件系统\n- 插件注册：definePlugin({ name, icon, tools[], onMessage })\n- Function Calling UI：识别 tool_calls 响应，渲染为特殊消息卡片\n- 确认模式：敏感操作弹出二次确认\n- 插件隔离：iframe / Web Worker 沙箱执行\n\n简历关联：AI 多媒体平台的自然语言搜索、智能标签推荐、Whisper 字幕渲染都涉及类似流式处理和状态管理。\n\n--- 深度补充：生产级 Chat ---\nToken 计数器用进度条+颜色编码（绿<60%/黄60-85%/红>85%）。流式渲染每 chunk 调 setState 导致 60+次/秒更新——用 ref+ rAF 批量。移动端用 visualViewport API 防键盘遮挡。',
    codeExample: `// 流式读取 OpenAI 风格 SSE
async function* streamChat(messages: Message[]) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, stream: true }),
    signal: controller.signal,
  })
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        yield JSON.parse(line.slice(6)).choices[0].delta.content || ''
      }
    }
  }
}`,
    tags: ['AI Chat', 'SSE', '流式渲染', '架构设计', 'Function Calling'],
  },
  {
    id: 'res-14',
    title: 'Whisper 字幕渲染与编辑器设计',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 3,
    question: '你在 AI 多媒体平台中做过「Whisper 字幕实时渲染与时间轴同步」。请详细阐述：1) 字幕数据模型与缓存策略；2) 字幕与视频播放的精确时间轴同步（二分查找 + requestAnimationFrame）；3) 字幕编辑器的交互设计（拖拽、编辑、合并拆分、撤销）。',
    answer: '完整字幕系统前端方案：\n\n一、字幕数据模型\n- { id, start: number(秒), end: number, text: string, speaker?: string }\n- 按语句切分（Whisper 默认粒度），传输全量字幕（通常 < 100KB）\n\n二、时间轴同步\n- 监听 video.ontimeupdate（~250ms 触发）\n- 二分查找定位当前字幕（数组已按 start 排序，O(log n)）\n- 用 requestAnimationFrame 节流 ontimeupdate 高频触发\n- 预渲染：提前 500ms 准备下一条字幕 DOM，避免切换闪烁\n- 样式：当前字幕高亮，前后半透明\n\n三、字幕编辑器\n- Canvas 时间轴可视化：横向时间轴 + 字幕块的起始结束位置\n- 拖拽调整：拖拽字幕块移动改 start/end，拖拽边缘只改一侧，相邻字幕边缘自动吸附\n- 文本编辑：双击 → textarea 内联编辑 → Enter 确认\n- 合并/拆分：合并取第一条 start + 最后一条 end 拼接 text；拆分在光标位置计算新时间点\n- 撤销/重做：Command Pattern 维护操作历史栈\n\n四、实时字幕（直播场景）\n- WebSocket 接收 Whisper 实时转写（逐句推送）\n- 字幕 buffer 缓存 3-5 秒，平滑显示避免抖动\n- 延迟补偿标注 "live" 状态\n\n--- 深度补充：生产级字幕 ---\nSRT 时间码用逗号（,）非点（.）分隔毫秒，UTF-8 with BOM 防 Windows 中文乱码。Canvas 坐标原点左上角，px=(time/totalDuration)*canvasWidth。字幕（同步时间轴）vs 弹幕（异步 CSS animation）方案完全不同。',
    codeExample: `// 二分查找当前字幕
function findCurrentSubtitle(subtitles: Subtitle[], time: number): Subtitle | null {
  let lo = 0, hi = subtitles.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const sub = subtitles[mid]
    if (time >= sub.start && time <= sub.end) return sub
    if (time < sub.start) hi = mid - 1
    else lo = mid + 1
  }
  return null
}`,
    tags: ['Whisper', '字幕', '时间轴', '编辑器', '视频同步'],
  },
  {
    id: 'res-15',
    title: 'AI 辅助前端开发流程设计',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 2,
    question: '你在简历中多次提到用 Codex/Claude Code 辅助开发。请系统阐述 AI 辅助前端开发的完整流程。哪些场景 AI 做得好，哪些需人工主导？如何建立「AI 生成 → 人工审查 → 自动化验证」的标准流水线？',
    answer: 'AI 辅助前端开发五阶段流水线：\n\n需求拆解（AI 辅助度 ★★★）：AI 擅长将 PRD 拆解为技术任务、识别边界条件；人工必需确认优先级、权衡方案\n\n组件生成（AI 辅助度 ★★★★）：AI 擅长 React/Vue 脚手架、Tailwind 样式、表单校验、CRUD 模板；人工必需自定义交互、复杂动画、性能优化\n\nDiff Review（AI 辅助度 ★★）：AI 擅长检测命名不一致、类型缺失、空值风险；人工必需验证架构合理性、安全漏洞、业务逻辑\n\n测试生成（AI 辅助度 ★★★★）：AI 擅长单元测试框架、Mock 数据、边界用例；人工必需 E2E 路径设计、测试优先级\n\n文档生成（AI 辅助度 ★★★★）：AI 擅长 README、组件文档、部署说明；人工必需 ADR、选型理由\n\n标准化流水线：写好 .cursorrules / CLAUDE.md 提供项目上下文 → AI 生成 → TypeScript + ESLint + 单元测试 → Diff 必须人工逐段审查 → 合入\n\nAI 擅长 vs 人工主导：重复性工作/模板代码/已知模式 → AI 强项；架构决策/性能优化/安全防护/UX 设计 → 人工主导\n\n--- 深度补充：AI 开发实践 ---\nPrompt 迭代：简单任务 1-2 次、复杂 3-5 次。AI 常见 Bug：不处理 loading/error、过时 API、缺 key prop、缺 useEffect 清理。代码"AI 味"检测：过度注释、变量名无领域缩写、依赖数组完美但逻辑有漏洞。',
    tags: ['AI辅助开发', 'Codex', 'Claude Code', 'Code Review', '流水线'],
  },

  // ══════════════ 性能优化 (16-18) ══════════════
  {
    id: 'res-16',
    title: 'Core Web Vitals 实战优化',
    category: 'resume',
    subCategory: '性能优化',
    difficulty: 3,
    question: '结合你的游戏活动页和 AI 媒体平台经验，详细阐述 LCP、INP、CLS 三个核心指标的优化策略。给出实际项目中的具体数值变化和优化手段。',
    answer: 'LCP（< 2.5s）优化 — 游戏活动页实战：LCP 2.8s → 1.6s\n① 识别 LCP 元素：首屏大 Banner（2MB PNG）\n② 图片优化：WebP + 响应式 srcset → 降到 300KB\n③ 预加载：<link rel="preload" as="image" fetchpriority="high">\n④ 移除阻塞：第三方脚本加 async/defer\n⑤ 关键 CSS 内联到 <head>\n\nINP（< 200ms）优化 — AI 媒体平台实战：INP 350ms → 120ms\n① 定位：Performance 面板录制用户操作\n② 问题：搜索输入触发全量过滤 → 渲染长任务 300ms\n③ 修复：useDeferredValue 延迟列表 + 虚拟列表（只渲染 20 条可见项）\n④ 进一步：Web Worker 做关键词匹配，主线程只做渲染\n\nCLS（< 0.1）优化：图片无宽高 → 加 width/height + aspect-ratio；动态广告 → 预留占位 min-height；Web 字体跳动 → font-display: swap + 预设 fallback 字体匹配；动画用 transform 替代 top/left\n\n--- 深度补充：Web Vitals 监控 ---\nweb-vitals 库 <2KB 收集真实指标。INP 替代 FID 反映整个页面生命周期的交互延迟。LCP 四种元素：<img>、<image>、<video> poster、背景图。Hero 图片用 fetchpriority="high" 优先加载。',
    codeExample: `// 图片预加载 + 响应式
<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="主视觉" width="1200" height="600"
       fetchpriority="high" loading="eager">
</picture>`,
    tags: ['Core Web Vitals', 'LCP', 'INP', 'CLS', '性能优化'],
  },
  {
    id: 'res-17',
    title: '前端资源加载策略与 Bundle 优化',
    category: 'resume',
    subCategory: '性能优化',
    difficulty: 2,
    question: '你的简历项目涉及多页面应用、活动页、管理后台。不同类型的页面应如何设计资源加载策略？Bundle 分割的原则是什么？如何平衡首屏速度与后续页面加载体验？',
    answer: '按应用类型设计加载策略：\n\n游戏活动页（首屏优先）：关键资源内联 + 非关键延迟。首屏 CSS 内联 + 预加载 Hero 图片。非首屏路由 lazy load。第三方脚本延迟到 onload 后。预连接第三方域名。\n\n管理后台（整体体验优先）：预加载 + 缓存优先。路由级代码分割 + modulepreload。Service Worker 缓存静态资源。独立分包不参与首屏的模块。\n\n内容型网站（SEO 优先）：SSR/SSG + 渐进式加载。关键内容服务端渲染。Islands Architecture：静态内容零 JS，交互孤岛按需加载。\n\nBundle 分割原则：Vendor chunk（node_modules 单独分包，缓存命中率高）、Common chunk（多入口共享代码）、Route chunk（每个路由独立）、Component chunk（大型非首屏组件独立）\n\nVite 配置：build.rollupOptions.output.manualChunks 手动分包，build.chunkSizeWarningLimit 调整阈值，build.cssCodeSplit: true\n\n--- 深度补充：预加载策略 ---\n四种预加载：preload 强制立即（关键资源）、prefetch 空闲加载（未来页面）、modulepreload Vite 自动生成、preconnect 只握手。SW 缓存策略：Stale-While-Revalidate（静态资源）、Network First（API）。',
    codeExample: `// Vite 手动分包
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "vendor-react": ["react", "react-dom"],
        "vendor-ui": ["@radix-ui/react-dialog"],
        "editor": ["@tiptap/react"],
      }
    }
  }
}`,
    tags: ['Bundle优化', '代码分割', '加载策略', 'Vite', '缓存'],
  },
  {
    id: 'res-18',
    title: 'WebSocket 大规模实时通信架构',
    category: 'resume',
    subCategory: '性能优化',
    difficulty: 3,
    question: '你在社群 Web App 中使用 Socket.io 做即时通讯。如果要支撑 10 万在线用户的直播聊天室，前端需要做哪些架构设计？消息风暴如何应对？',
    answer: '大规模实时通信前端架构：\n\n一、消息分级与节流\n- 系统消息（高优先，可靠通道）\n- 普通聊天（可丢弃，快速通道）\n- 弹幕/点赞（可合并，高频通道）500ms 内合并为一条\n\n二、虚拟列表渲染\n- 消息列表用 @tanstack/virtual（动态高度），只渲染可视区 + buffer 上下各 5 条\n- 新消息自动滚动到底部（检测用户是否在查看历史）\n\n三、WebSocket 连接管理\n- 心跳保活：30s ping/pong，超时 3 次重连\n- 指数退避：1s → 2s → 4s → 8s → max 30s\n- 重连后同步：传 lastMessageId 拉取离线消息\n- 多 Tab 共享：SharedWorker / BroadcastChannel\n\n四、消息可靠性\n- 客户端生成临时 ID，乐观插入（"发送中"）\n- 服务端 ACK 确认 → "已发送"\n- 超时未 ACK → "发送失败" + 重试\n- 去重：服务端 clientMsgId 幂等，客户端忽略重复 ID\n\n--- 深度补充：WebSocket 可靠性 ---\nSocket.io 降级：WebSocket→长轮询。心跳：客户端 30s ping，90s 无 pong 断连。ACK 封装为 Promise + 5s 超时。企业代理可能阻断 WebSocket，需测试降级路径。',
    codeExample: `// 消息合并防抖
const mergeQueue = new Map()
function handleHighFreqMsg(type, data) {
  const existing = mergeQueue.get(type)
  if (existing) { existing.count++; clearTimeout(existing.timer) }
  mergeQueue.set(type, {
    count: (existing?.count || 0) + 1,
    timer: setTimeout(() => {
      emit(type, { ...data, merged: existing?.count })
      mergeQueue.delete(type)
    }, 500)
  })
}`,
    tags: ['WebSocket', '实时通信', '虚拟列表', '可靠性', '消息风暴'],
  },

  // ══════════════ 数据埋点与增长 (19-21) ══════════════
  {
    id: 'res-19',
    title: 'GA4 + GTM 埋点体系设计',
    category: 'resume',
    subCategory: '数据埋点与增长',
    difficulty: 2,
    question: '你在游戏活动页和企业后台中搭建了 GA4 + GTM 埋点体系。请详细阐述如何设计一套可维护的前端埋点方案。dataLayer 的结构设计原则是什么？如何保证埋点正确性和覆盖率？',
    answer: '埋点体系分层设计：\n\n第一层：数据层（dataLayer）\n- 规范：统一命名（snake_case）、必选字段（event、event_category、event_label、timestamp）\n- 全局上下文自动注入：page_type、user_role、ab_experiment_id\n\n第二层：埋点 SDK 封装\n- 统一 API：track(event, params)\n- 自动注入通用字段（页面 URL、时间戳、session_id）\n- TypeScript 约束 event 名称和 params 结构\n- Debug 模式：开发环境 console 打印 + GA4 DebugView\n\n第三层：GTM 配置\n- 变量（内置 + 数据层 + 常量）\n- 触发器（Page View、CSS selector 点击、自定义事件）\n- Tag（GA4 Configuration 全局 + GA4 Event 具体事件）\n\n埋点质量保障：埋点需求文档（类似 API 文档）、开发自测（DebugView 实时验证）、E2E 自动化（Playwright 模拟 + 检查 dataLayer）、上线验证（Realtime Report 确认）\n\n--- 深度补充：埋点设计 ---\n事件命名 Object-Action 模式（purchase_complete），方便 GA4 按前缀分组。用户标识：User-ID > Google Signals > Device-ID。验证：GA4 DebugView + GTM Preview + Omnibug 扩展三层。',
    codeExample: `// 前端统一埋点 SDK
const analytics = {
  track(event: string, params?: Record<string, any>) {
    const payload = {
      event,
      event_category: params?.category || 'interaction',
      event_label: params?.label || '',
      timestamp: Date.now(),
      page_url: location.href,
      ...params,
    }
    if (import.meta.env.DEV) console.log('[Analytics]', payload)
    window.dataLayer?.push(payload)
  }
}
// 使用：analytics.track('purchase_complete', { value: 648, item_name: 'skin_pack' })`,
    tags: ['GA4', 'GTM', 'dataLayer', '埋点', '数据分析'],
  },
  {
    id: 'res-20',
    title: 'A/B Testing 前端基础设施设计',
    category: 'resume',
    subCategory: '数据埋点与增长',
    difficulty: 3,
    question: '你要从零为公司的前端项目搭建 A/B Testing 基础设施。请设计：1) 实验分流策略（如何保证用户分组稳定？）；2) 前端如何无闪烁地切换实验版本；3) 如何与埋点体系打通量化实验效果。',
    answer: '完整 A/B Testing 前端基础设施：\n\n一、分流策略\n- 用户标识：优先 userId（登录用户），fallback 到 deviceId（localStorage UUID）\n- 哈希分流：hash(userId + experimentId) % 100 → variant，同一用户永远在同一组\n- 分层实验：不同实验用不同 hash salt，避免互相干扰\n\n二、无闪烁切换\n- 方案 1（推荐）：服务端读取实验分组，直接返回对应版本（SSR）\n- 方案 2：<head> 中同步执行最小化分流脚本（< 1KB），设置 CSS class\n- 方案 3：CSS visibility: hidden 初始隐藏 → 分组确定后移除\n\n三、前端实验 SDK\n- useExperiment(id) → { variant, trackConversion }\n- 自动上报 experiment_impression\n- 暴露 trackConversion(goal) 供业务调用\n\n四、与埋点打通\n- 所有 GA4 事件自动注入 experiment_id + variant 维度\n- GA4 自定义报告：按实验维度分组对比核心指标\n- 统计显著性自建后端做 Z-test（GA4 不提供）\n\n简历关联：游戏活动页 Banner/文案 A/B Test 需要用户进入页面时无感知分配版本。\n\n--- 深度补充：A/B 统计 ---\np-value 看统计显著性，effect size 看实际意义。AA Test 验证分流均匀性。实验周期至少一周（覆盖周末），两周消除新奇效应。节假日数据单独分析。',
    codeExample: `// 前端实验 SDK 简化版
function getVariant(experimentId: string): string {
  const userId = getUserId()
  const hash = simpleHash(userId + experimentId)
  return hash % 2 === 0 ? "control" : "treatment"
}

function useExperiment(id: string) {
  const variant = useMemo(() => getVariant(id), [id])
  useEffect(() => {
    analytics.track("experiment_impression", { experiment_id: id, variant })
  }, [id, variant])
  return { variant, trackConversion: (goal) =>
    analytics.track("experiment_conversion", { experiment_id: id, variant, goal }) }
}`,
    tags: ['A/B Testing', '实验分流', '无闪烁', 'GA4', '统计'],
  },
  {
    id: 'res-21',
    title: '前端 SEO 体系化方案',
    category: 'resume',
    subCategory: '数据埋点与增长',
    difficulty: 2,
    question: '你在多个项目中负责 SEO 优化。请体系化阐述前端 SEO 的技术方案：渲染策略、结构化数据、Core Web Vitals、内容优化到监控闭环。SPA 和 SSR 混合应用如何处理 SEO 关键路径？',
    answer: '前端 SEO 五维体系：\n\n一、渲染策略（确保内容可爬取）\n- SPA 需做 SSR/SSG/Prerender\n- Next.js：内容页 SSG+ISR、列表页 SSR、工具页 CSR\n- 混合应用关键：搜索引擎看到的 HTML 必须包含核心内容\n\n二、Meta 标签体系\n- <title>、<meta description>（每页唯一，含关键词）\n- Open Graph：og:title/description/image（社交分享）\n- Twitter Card：twitter:card/image\n- 结构化数据：JSON-LD（Article、Product、BreadcrumbList、FAQ、Video）\n- Canonical URL 避免重复内容\n\n三、技术性能：Core Web Vitals（前题已详述）\n\n四、内容与结构优化\n- 语义化 HTML：h1（每页唯一）→ h2 → h3 层级清晰\n- 图片 SEO：alt 文本、文件名语义化、Image Sitemap\n- 内链策略：相关推荐、面包屑导航\n- URL 结构：语义化、短小、含关键词、连字符分隔\n\n五、监控闭环\n- Google Search Console：索引覆盖率、搜索词排名\n- Lighthouse CI：PR 构建阻断性能/SEO 退化\n- 竞品监控：定期对比排名和结构化数据\n\n--- 深度补充：SEO 进阶 ---\nCWV 是排名"门槛"非"加分项"，达标即可。Rich Results Test 验证结构化数据 JSON-LD。Google 可渲染 JS 但有延迟——关键内容必须 SSR 直出 HTML。Prerender 是折中方案。',
    tags: ['SEO', 'SSR', '结构化数据', 'JSON-LD', 'Search Console'],
  },

  // ══════════════ 游戏 / 高互动前端 (22-24) ══════════════
  {
    id: 'res-22',
    title: '高并发前端防重复与状态一致性',
    category: 'resume',
    subCategory: '游戏 / 高互动',
    difficulty: 3,
    question: '你在游戏活动页中处理了「防重复提交、状态锁定、错误重试、缓存策略」。请以抽奖活动为例，详细设计高并发场景下的前端交互方案：从请求去重、乐观更新、并发控制到异常回滚。',
    answer: '抽奖活动前端完整方案：\n\n一、防重复提交\n- 按钮点击后立即 disabled + loading\n- 生成请求唯一 ID（uuid），存入 pendingRequests Set\n- 同一 ID pending 期间再次触发直接 return\n- 请求完成后从 Set 移除\n- React 18 useOptimistic 可声明式处理\n\n二、乐观更新\n- 点击抽奖 → 立即播放动画（假定成功）\n- 同时发起 API 请求\n- 成功 → 展示奖品，更新余额\n- 失败 → 回滚动画（需用 fadeOut 自然过渡，不可突兀跳变）\n\n三、并发控制\n- 限流：前端同一用户 1 秒内只发 1 次（防抖 1s）\n- 错误重试：网络错误自动重试 3 次（指数退避 1s→2s→4s）\n- 重试去重：请求 ID 保证不会重复抽奖\n\n四、状态一致性\n- 抽奖成功后立即更新本地状态\n- 轮询补偿：每 3 秒从服务端拉取最新状态校准\n- 版本号机制：状态带 version，更新时比对防覆盖\n\n五、缓存策略\n- 奖品列表 staleTime: 5min\n- 用户余额 staleTime: 0，用乐观更新减少体感延迟\n- 活动配置 staleTime: Infinity + 后台静默刷新\n\n--- 深度补充：并发特性 ---\nuseOptimistic（React 19）声明式乐观更新。useTransition 控制状态更新优先级，useDeferredValue 控制值的延迟——抽奖用前者、搜索用后者。竞态处理：AbortController 或版本号判断。',
    codeExample: `// useOptimistic 乐观更新
function DrawButton() {
  const [optimisticPrize, addOptimistic] = useOptimistic(prize, (_, newP) => newP)
  async function handleDraw() {
    addOptimistic({ name: "抽奖中...", image: loadingGif })
    try {
      const result = await drawAPI()
      setPrize(result)  // 真实结果替换
    } catch {
      setPrize(null)     // 失败回滚
      toast.error("抽奖失败，请重试")
    }
  }
  return <button onClick={handleDraw} disabled={!!optimisticPrize}>抽奖</button>
}`,
    tags: ['防重复', '乐观更新', '并发控制', '状态一致性', 'React 18'],
  },
  {
    id: 'res-23',
    title: '排行榜系统前端设计',
    category: 'resume',
    subCategory: '游戏 / 高互动',
    difficulty: 3,
    question: '你在游戏项目中实现了排行榜功能。请设计一个支持「实时更新 + 分页 + 周边排名 + 高亮自己」的排行榜前端方案。如何平衡实时性与服务端压力？',
    answer: '排行榜前端方案：\n\n一、数据获取策略（分级加载）\n- Top 100：SSR/SSG 首屏渲染，staleTime: 30s 后台刷新\n- 周边排名（用户前后各 10 名）：客户端按需请求\n- 自己排名：单独 API { rank, score, totalPlayers }\n\n二、实时更新\n- 非金融级实时，10-30 秒轮询即可\n- WebSocket 推送（活动高峰）：服务端排名变化时推送增量更新\n- 客户端：对比当前数据，仅差异项更新\n- 动画：排名变化时数字滚动动画\n\n三、组件设计\n- LeaderboardTable：虚拟列表（Top 5000 以内分页+虚拟滚动）\n- 前三名特殊样式（金/银/铜色 + 头像框）\n- 自己的行：不同背景色高亮，自动滚动到可视区\n- RankBadge：排名数字动画过渡\n- RankingSparkline：排名趋势图（需历史数据）\n\n四、性能优化\n- 数据归一化：{ [userId]: { rank, score } }，前端按排名数组排序\n- 预计算派生数据用 useMemo\n- DOM 复用：虚拟列表复用节点\n- 图片懒加载：前 50 名加载头像，其他占位符\n\n--- 深度补充：排行榜架构 ---\nRedis ZSet 跳表 O(log n)，百万级毫秒返回 vs MySQL 全表扫描百毫秒。Cursor-based 分页防翻页重复/遗漏。Snapshot 分页展示"截至 10:30 的排名"。"自己"排名卡片紫色高亮。',
    tags: ['排行榜', '虚拟列表', '实时更新', '动画', 'Redis'],
  },
  {
    id: 'res-24',
    title: '复杂数据表格与交互设计',
    category: 'resume',
    subCategory: '游戏 / 高互动',
    difficulty: 3,
    question: '你在企业后台中处理过「订单管理、权限控制、工单流转」等复杂交互。请以订单管理系统为例，阐述如何设计包含筛选、批量操作、行内编辑、导出等功能的复杂数据表格前端架构。',
    answer: '复杂表格前端架构：\n\n一、状态管理分层\n- URL State：搜索关键词、筛选条件、排序、当前页码\n- Server State（TanStack Query）：表格数据、汇总统计\n- UI State（useState/Zustand）：选中行、列显隐、行内编辑状态\n\n二、表格组件设计（Headless 模式）\n- 数据层（@tanstack/react-table）：列定义、排序/筛选/分页、行选择\n- 渲染层：自定义 UI，与样式解耦\n- 插件层：列固定 sticky、列拖拽排序、列宽调整\n\n三、核心功能\n- 筛选：文本模糊搜索、范围筛选（日期/金额）、枚举筛选（状态下拉），筛选变更 → 重置分页 → 重新请求\n- 批量操作：区分「全选当前页」vs「全选所有匹配」，批量按钮（删除/导出/状态变更）+ Modal 二次确认 + 进度条\n- 行内编辑：双击单元格进入编辑模式（input/select/datepicker），Enter 确认/Esc 取消，乐观更新 + 服务端校验，失败回滚 + 行高亮错误\n- 导出：前端导出（js-xlsx，< 10000 行），大数据量服务端生成下载链接 + 轮询状态\n\n四、性能优化\n- 虚拟滚动（大数据量）\n- 列配置持久化（localStorage）\n- 请求去重：切换 Tab 时 AbortController 取消上一个请求\n\n--- 深度补充：表格架构 ---\n@tanstack/react-table Headless 设计：数据逻辑与渲染分离。Sticky Columns：position:sticky + 累计偏移量。批量操作乐观更新：立即移除行+toast，失败后恢复+提示。',
    tags: ['数据表格', '批量操作', '行内编辑', '性能', '复杂交互'],
  },

  // ══════════════ 测试与团队协作 (25) ══════════════
  {
    id: 'res-25',
    title: '前端测试金字塔与策略',
    category: 'resume',
    subCategory: '测试与协作',
    difficulty: 2,
    question: '你的简历涉及单元测试、组件测试、E2E 测试。请阐述前端测试金字塔的演变（静态检查 → 单元 → 组件 → 集成 → E2E）。对于 AI 多媒体平台项目，如何制定测试策略和优先级？',
    answer: '前端测试金字塔（自下而上，成本递增）：\n\nLayer 0：静态检查（成本最低，收益最高）\n- TypeScript strict mode\n- ESLint（逻辑规则 + 最佳实践）\n- Prettier（格式一致性）\n- Husky + lint-staged 提交前自动执行\n\nLayer 1：单元测试（Vitest/Jest）\n- 覆盖：工具函数、Hooks/Composables、状态管理逻辑\n- 纯逻辑测试，不涉及 DOM\n- ROI 最高的测试层\n\nLayer 2：组件测试（Vitest + Testing Library）\n- 覆盖：关键业务组件（登录表单、支付流程、抽奖按钮）\n- 测试用户行为，不测试实现细节\n- 用 role/text 查找元素，不用 className/testId\n\nLayer 3：集成测试\n- 覆盖：多组件协作流程（搜索→过滤→分页→详情）\n- Mock API 层（MSW），测试完整数据流\n\nLayer 4：E2E 测试（Playwright）\n- 覆盖：核心用户路径（注册→登录→充值→抽奖→查看记录）\n- 只测 5-10 条关键路径，成本高但保障核心业务\n\nAI 多媒体平台测试策略：\n- 每次提交：TypeScript + ESLint + 单元测试\n- PR 检查：组件测试（字幕编辑器、上传表单）+ 集成测试\n- 发布前：E2E（上传→AI 识别→标注→搜索）\n- 不测：第三方库内部逻辑、纯样式调整、非关键边缘场景\n\n--- 深度补充：测试策略 ---\nVitest 零配置支持 TS/JSX，冷启动比 Jest 快 10 倍。Playwright 多浏览器+Locator API 强于 Cypress。覆盖率不是 KPI——重点测核心路径+关键逻辑+复杂交互，>80% 即可。',
    codeExample: `// 组件测试最佳实践
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('抽奖按钮点击后禁用并显示结果', async () => {
  render(<DrawButton />)
  const btn = screen.getByRole('button', { name: '抽奖' })
  await userEvent.click(btn)
  expect(btn).toBeDisabled()
  expect(await screen.findByText(/恭喜获得/)).toBeVisible()
})`,
    tags: ['测试', 'Vitest', 'Playwright', 'Testing Library', '测试策略'],
  },

  // AI 前端集成 深度版 (26-28)
  {
    id: 'res-26',
    title: '深度 AI Chat 前端架构（10 道追问版）',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 3,
    question: '设计通用 AI Chat 前端框架，含流式渲染、会话管理、上下文窗口、插件系统。面试官 10 道追问预判。',
    answer: '深度版：通用 AI Chat 前端架构（含面试官 10 道追问）\n\n--- 一、流式响应渲染 ---\n后端 ReadableStream + fetch getReader 逐 chunk 读取 SSE。textBuffer 累积 + rAF 16ms 批量更新 UI。\nAbortController 中止。断线重连指数退避 1s-2s-4s-max 15s。\n\n追问 1 SSE vs WebSocket？SSE 更适合 LLM 流式：天然单向、HTTP 无需心跳、自动重连。WebSocket 适合双向频繁交互。\n追问 2 避免 UI 闪烁？rAF 批量更新 + 虚拟化长消息 + 代码块延迟高亮（闭合前 pre，闭合后一次性高亮）。\n追问 3 思考过程？识别 reasoning_content 字段，折叠面板展示（默认折叠），不计入 token 估算。\n追问 4 Token 计数？js-tiktoken 3.5MB，动态 import 懒加载。轻量 fallback：中文 1 字约 1.5 tokens。后端返回 usage 前端缓存。\n追问 5 流断了？中断标记 + 继续生成按钮 + 超时 15 秒重连。\n\n--- 二、会话管理 ---\nZustand store + IndexedDB（Dexie.js）缓存 50 会话。BroadcastChannel 多 Tab 同步。\n\n--- 三、上下文窗口 ---\nsystem prompt > 最新 N 轮 > 摘要压缩 > 智能截断。推荐后端截断，前端用量指示器。\n\n--- 四、插件系统 ---\ndefinePlugin 注册。Function Calling 卡片 UI（pending/success/error）。确认模式。iframe/Worker 隔离。\n追问 9 工具失败：区分可重试/不可重试，可重试提供按钮。\n追问 10 流式 tool_calls：累积 index 拼接 JSON，try JSON.parse 判断完整，不完整显示 skeleton。\n\n--- 深度补充：Chat 追问 ---\nEventSource 不支持 POST 和自定义 Header，生产必须 fetch+ReadableStream。BroadcastChannel 限同源——跨域同步需 localStorage storage 事件（Safari 隐私模式不可靠）。截断边界必须在完整消息之间，不能截断单条消息中间。',
    tags: ['AI Chat', 'SSE', '流式渲染', '架构设计', 'Function Calling'],
  },
  {
    id: 'res-27',
    title: '深度 Whisper 字幕系统（8 道追问版）',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 3,
    question: 'Whisper 字幕实时渲染与时间轴同步，含数据模型、编辑器、实时字幕。面试官 8 道追问预判。',
    answer: '深度版：完整字幕系统前端方案（含面试官 8 道追问）\n\n--- 一、数据模型 ---\nSubtitle { id, start(毫秒), end, text, speaker?, confidence? }，Whisper 按语句切分。全量 <200KB JSON。直播 WebSocket 增量。\n\n追问 1 word vs sentence-level？逐词高亮（<10 词）+ 逐句（大多数）。confidence <0.6 浅红。\n追问 2 Diarization？hash 映射色板 + 编辑器可重命名 + Canvas 不同色块。\n\n--- 二、时间轴同步 ---\n二分 O(log n) + rAF 节流 + 预渲染 ±3 DOM + opacity 过渡。Seek 立即更新。暂停持续显示。\n\n--- 三、编辑器 ---\nCanvas 时间轴 + 拖拽吸附 + 双击编辑 + 合并拆分 + Command Pattern 撤销。\nCanvas 性能：虚拟化 + 分层 + 缩略图 + rAF。导出 SRT/VTT/ASS 纯前端。双语：原文+译文双行。\n\n--- 四、实时字幕 ---\n2-5 秒延迟标注 + 3-5 秒 buffer + 句子修正（id 匹配覆盖）。低延迟模式：tiny/base + faster-whisper。\n\n--- 深度补充：字幕追问 ---\nCanvas 三层叠放（网格/字幕块/指示线）按层隔离重绘成本。SRT 导出用 BOM \\uFEFF 前缀。双语翻译用 GPT-4 优于 Google Translate，结果缓存 IndexedDB。',
    tags: ['Whisper', '字幕', '时间轴', 'Canvas', '双语字幕', '实时转写'],
  },
  {
    id: 'res-28',
    title: '深度 AI 辅助开发流程（7 道追问版）',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 2,
    question: 'AI 辅助前端开发完整流程：需求拆解、代码生成、Diff Review、测试、文档。面试官 7 道追问预判。',
    answer: '深度版：AI 辅助前端开发全流程（含面试官 7 道追问）\n\n--- 一、五阶段 ---\n需求拆解 ★★★：AI 拆 PRD，人工确认优先级\n代码生成 ★★★★：AI 脚手架/样式/测试，人工交互/动画/安全\nDiff Review ★★：AI 检测命名/类型，人工架构+业务。硬规则：逐 Diff 人工审查\n测试生成 ★★★★：AI 用例+Mock，人工 E2E 路径\n文档生成 ★★★★：AI README/文档，人工 ADR/选型\n\n--- 二、追问 7 题 ---\n1. .cursorrules：技术栈+目录+规范+示例+命令+禁止\n2. 防幻觉：类型文件+锁版本+先读文档+分层生成+TS+ESLint\n3. 效率：CRUD 60%、组件库 75%、测试 80%，整体 30-50%\n4. 安全：审查 innerHTML/eval，CI security plugin，高危不交 AI\n5. 大项目：分治+接口契约+Codex 上下文+ARCHITECTURE.md\n6. 禁用：安全敏感、性能关键、原创交互、复杂调试、法务合规\n7. 推广：不强制、分享案例、降低门槛、强调 Review、PR 标注\n\n--- 深度补充：AI 开发追问 ---\n效率量化：用 WakaTime 记录编码时间对比同类任务 3 个月 50+ PR。AI 安全实例：生成的 fetch 缺 Authorization Header。ARCHITECTURE.md 模板：概述+技术栈+目录树+数据流图+模块说明+部署拓扑（2-3 页）。',
    tags: ['AI辅助开发', 'Codex', 'Claude Code', 'Code Review', 'cursorrules'],
  },
]
