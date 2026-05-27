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
    answer: '我刚接触 Fiber 的时候也觉得这个概念挺抽象的，后来自己写 demo、读源码才慢慢理解它到底解决什么问题。\n\n说白了 React 15 以前的渲染有一个致命问题：它是"一口气"做完的。你页面有 1000 个组件，它就得一次性递归把 1000 个全部算完，中间浏览器想响应用户点击都不行，因为 JS 线程被 React 占着。如果你的组件树特别大，用户就会感觉页面卡了一下。\n\nFiber 解决这个问题的思路其实就两个：第一，把"一口气"变成"可以随时暂停、随时恢复"；第二，给不同的更新分配优先级。\n\n怎么做到暂停呢？React 把每个组件变成一个 Fiber 节点，节点之间不用递归函数调用栈来串联（那个没法暂停），而是用链表。每个节点有三个指针：child 指向第一个子节点，sibling 指向下一个兄弟节点，return 指向父节点。这样遍历到一半停掉，下次从停的地方接着走就行。\n\n然后怎么区分优先级？React 用了 Lane 模型，31 种优先级通道。用户输入（比如打字）的 lane 值是 1，最高优先；普通的 setState 是 lane=4；用 useTransition 标记的更新是 lane=16，优先最低。Scheduler 每 5ms 检查一次有没有更高优先的任务插进来，有就暂停当前渲染去处理紧急的事。\n\n我举个我做过的项目例子你就懂了。我们后台有个数据表格，支持搜索筛选。没做优化之前，用户在搜索框打字，每敲一个字符就触发全量列表重新筛选和渲染，输入框直接卡成狗。原因就是搜索更新和输入框更新的优先级一样，它们互相抢主线程。后来用 useTransition 把搜索结果更新标记为低优先级，startTransition 包一下，输入框就不卡了——因为 Scheduler 发现用户在打字，高优先级的输入更新会打断低优先级的列表渲染。\n\n面试官可能会追问：那为什么不直接用 debounce？debounce 也能缓解，但它是"延迟执行"，用户还是会感觉到延迟，而且没法真正区分优先级。Fiber 的时间切片是在浏览器空闲时插入执行，更加精准。\n\n还有一个追问点：双缓冲机制。简单理解就是 React 同时维护两棵 Fiber 树——一棵是屏幕上正在显示的（current），一棵是在内存里构建的新树（workInProgress）。建完后通过 alternate 指针原子交换，这样用户看到的是完整的一帧，不会出现"渲染到一半"的撕裂感。',
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
    answer: 'RSC 这个特性我是在 Next.js 13 App Router 出来以后才开始在实际项目里用的，用了一年多下来感觉确实改变了挺多之前的开发习惯。\n\n本质其实不复杂：Server Component 就是在服务端渲染的组件，但它输出的不是 HTML，也不是 JSON，而是一种叫 RSC Payload 的专有格式——是一个包含组件树结构的流式数据。客户端收到后 React 的 reconciler 能根据这个 payload 重建组件树，但服务端组件的代码和它的依赖永远不会被打包进客户端的 JS bundle。所以"零 JS 体积"这是 RSC 最大的卖点。\n\n那你可能会问：什么时候用服务端组件，什么时候用客户端组件？我说说我实际项目里的判断逻辑。\n\n首先，默认全是服务端组件，只有当你真的需要浏览器能力的时候才加 "use client"。这个和以前"默认客户端"的思路是反过来的。什么时候需要浏览器能力呢？交互事件（onClick、onChange）、状态管理（useState、useReducer）、浏览器 API（useEffect、localStorage、WebSocket）、还有第三方客户端库（图表库、富文本编辑器这些）。\n\n我拿简历里的几个项目举例吧。比如 AI 多媒体互动平台，用户上传视频后有个媒体列表页和详情页。列表页我是用 RSC 在服务端直查 PostgreSQL，前端零 JS 就能看到内容列表，首屏极快。但详情页里的字幕编辑器和标注工具就必须是客户端组件——因为涉及 Canvas 拖拽、实时编辑这些重度交互。\n\n然后是游戏官网，新闻列表、游戏介绍这些偏静态的内容用 RSC 配合 ISR（增量静态生成），既有静态页面的速度，又能定时刷新内容。但活动互动的部分（抽奖、分享等）很明显得用客户端组件。\n\n但要注意有个坑：服务端组件和客户端组件不能随意嵌套。Server Component 不能 import Client Component 然后直接渲染——你得把 Client Component 通过 children 或 props 传给 Server Component。如果你需要客户端交互能力，就抽一个 Client Component 出来，然后在 Server Component 里通过 children 传进去。\n\n面试官可能还会追问 RSC Payload 和 SSR 的 HTML 有什么区别。简单来说：SSR 是把组件渲染成 HTML 字符串发给浏览器，浏览器 hydrate 后变成可交互的。RSC Payload 不是 HTML，它是 React 内部的序列化格式，客户端必须通过 React 才能消费。而且 RSC 的组件代码永远不发送到客户端，SSR 的组件代码还是会打包进客户端的。',
    tags: ['React', 'RSC', 'Server Components', 'Next.js', '客户端组件'],
  },
  {
    id: 'res-03',
    title: 'React 状态管理架构分层设计',
    category: 'resume',
    subCategory: 'React 架构深度',
    difficulty: 3,
    question: '你在简历中提到用 Zustand、Context+useReducer 做状态管理。请详细阐述复杂前端项目中如何分层设计状态管理架构。Server State / UI State / Form State / URL State 的最佳管理方案是什么？',
    answer: '状态管理这个事，我觉得很多前端团队容易走两个极端：要么全部丢 Redux 里，要么什么都不用全靠 props 透传。做了这么多年，我现在的原则是分层：不同层级的状态用不同的工具。\n\n第一层是服务端状态。这是最容易被滥用的——很多人把 API 返回的数据存到 Redux 里，然后自己手写 loading、error、refetch 逻辑，代码又臭又长。现在我项目里基本全部用 TanStack Query（以前叫 React Query），它自带缓存、自动重取、乐观更新、后台刷新这些能力。我统计过一个后台项目迁移后，相关的状态代码减少了大概 60%。而且它还有个很实用的特性是 select——你可以在拿数据的时候就做一次转换，比如只取需要的字段，避免把整个 API 响应存到组件里。\n\n第二层是 UI 状态。像 modal 开关、表单输入、Tab 切换这些，我习惯用 Zustand。为什么不用 Redux？因为太啰嗦了，一个简单的开关要写 action type + action creator + reducer，Zustand 几行就搞定。而且 Zustand 的 selector 默认是浅比较，不会引起不必要的重渲染。我之前用 Redux 的时候经常遇到一个组件的无关状态变化导致整个列表重渲染的问题，换了 Zustand 后基本没出现过。\n\n第三层是 URL 状态。比如搜索条件、分页、筛选、排序这些，我全部存 URL 参数里。好处是有几个：用户可以分享链接给别人看到同样的视图、浏览器的前进后退天然可用、刷新页面条件不丢。这个其实很多人不重视，但我做过一个后台系统，用户抱怨最多的就是"我刷新了一下筛选条件全没了"。\n\n还有状态更新的粒度问题。比如一个表单有 20 个字段，如果你用一个大的 useState 对象，改了其中一个字段整个 form 都会重渲染。我的方案是用 useReducer + 细粒度 context 分割，或者直接用 React Hook Form——它本身就是非受控的，只在你 submit 的时候才读取值，不会触发中间状态的渲染。\n\n面试官可能追问：那 Zustand 和 Jotai 怎么选？我的经验是：团队规模小、需求偏全局状态（用户信息、主题、权限）用 Zustand；如果有大量原子化状态需要组合派生，用 Jotai 会更灵活。但不要两个都上，选一个就够了。',
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
    answer: '组件库建设这个事我是从零到一做过的，从最早只是抽几个公共组件，到后来建立完整的组件库体系，中间踩了不少坑。我分享一下我的思路。\n\n首先说架构分层。我把组件库分成三层：基础组件、业务组件、模板组件。\n\n基础组件是最底层的，像 Button、Input、Dialog、Table 这些。这层的要求是通用、无业务逻辑、高度可配置。我是基于 Radix UI（无样式的可访问组件）+ Tailwind CSS 来搭的。选 Radix 而不是直接用 Ant Design 的原因是：Ant Design 虽然开箱即用，但改样式太痛苦了，我们要支持多个品牌的主题，Radix 只提供行为和可访问性，样式我们自己控制，灵活度很高。\n\n业务组件是第二层，它调基础组件来实现具体业务场景。比如 UserPicker（用户选择器）、FileUploader（文件上传组件）、ChartWidget（图表小组件）。这层有业务逻辑但可以跨项目复用。\n\n模板组件是最上层，基本是一个完整的页面区块。比如 DashboardLayout、SearchPageTemplate，换一下数据就能用在不同项目里。\n\n然后说说 API 设计。我们定了几个硬规矩：第一，用组合式 Props 而不做无限配置——一个组件最多 10 个 props，超过就说明该拆组件了。第二，用 render props 或插槽来处理自定义区域，不要搞那种庞大的配置对象。第三，每个组件必须有完整的 TypeScript 类型导出，key 命名统一（比如都用 onChange 不用 onInput）。\n\n还有文档。我们强制要求每个组件写 Storybook，而且 Storybook 必须覆盖所有 props 组合。这个规则看起来严格，但实际救了团队很多次——因为组件的使用者在 Storybook 里就能看到所有可能的用法和边界情况，不用翻源码。\n\n版本管理和发布也有讲究。我们用 Changesets 做版本管理，每个 PR 如果改了组件库，必须带一个 changeset 文件说明是 patch/minor/major。CI 里跑 visual regression test（用 Chromatic），确保改了一个组件不会让另一个页面崩掉。\n\n面试官要是追问技术选型——为什么不用 Web Components？我也考虑过，但 Web Components 的 SSR 支持不行，而且和 React 的生态（比如 Context、Hooks）结合起来比较别扭。如果你的项目是纯多框架共用的场景，那 Web Components 更合适；但我们主要是 React 生态，没必要为了"可能以后换框架"这个概率极低的事情增加复杂度。',
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
    answer: 'React 性能优化我有一套很系统的方法论，不是什么"用 useMemo 包一下"这种碎片技巧，而是从三个维度来思考和排查。\n\n第一个维度是渲染优化。React 默认的渲染机制是：父组件重渲染，所有子组件也跟着重渲染，不管子组件的 props 有没有变。所以性能问题大部分来自于不必要的渲染。\n\n我的排查手法是：先用 React DevTools 的 Profiler 录制一段用户操作，看哪些组件渲染了，渲染了多久。然后再看这些渲染是不是必要的。如果不必要，怎么修？手段很多但有三招是最常用的：\n\nReact.memo 是基础，给纯展示组件包上，只有 props 变化才渲染。但很多人不知道 React.memo 默认是浅比较，如果你每次传给子组件的对象引用都在变（比如 onClick={() => ...} 或者 style={{...}}），那 memo 等于没包。所以配合 useCallback 和 useMemo 才有意义。\n\nuseMemo 和 useCallback 不要滥用。我都见过有人把每个函数都包 useCallback，把每个变量都包 useMemo——这不但不提升性能，反而增加了内存开销和代码复杂度。我的原则是：只在传给 memo 组件的 props 上使用，或者计算成本确实很高（比如 filter 一个 10000 条的数组）。\n\n虚拟列表是处理长列表的正确解法。我们后台有个日志查看器，后台可能返回几万条记录，不用虚拟列表直接把浏览器干崩。我后来用了 @tanstack/react-virtual，动态高度模式，只渲染可视区 + 上下各 10 条 buffer，内存和 CPU 都下来了。\n\n第二个维度是计算优化。如果是纯 CPU 密集的计算（比如复杂的数据转换、正则匹配大量文本），把它丢给 Web Worker。我做过一个埋点数据分析页面，前端要对几万条事件做聚合计算，主线程跑要卡 3 秒，丢到 Worker 里完全不阻塞 UI。\n\n第三个维度是网络优化。这个更多是架构层面的。比如我们游戏官网是 SSR + ISR，CDN 缓存到边缘节点，减少了源站压力和用户首屏时间。再比如把不紧急的数据请求用 Suspense 包裹，让页面先出来再渐进加载。\n\n面试官追问：那你怎么量化优化效果？我用两个指标：一个是 React DevTools Profiler 里的渲染耗时，优化前后对比；另一个是 Lighthouse 的 Performance 分数，这个能反映真实用户体验。还有就是 Chrome Performance 面板录一段操作，看长任务（Long Task，超过 50ms）的数量有没有减少。',
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
    answer: 'Vue 3 的响应式系统确实比 Vue 2 绕了一个大弯。我刚从 Vue 2 升级到 Vue 3 的时候也很不习惯，但用久了才发现这个改动背后的逻辑是很清晰的。\n\n先说 Vue 2 的问题。它用的是 Object.defineProperty，这个 API 有两个硬伤：第一，它只能劫持对象已有的属性，你后加一个属性它感知不到，得用 Vue.set；第二，数组的索引赋值和长度变化它监测不了，得用特殊的数组方法（push、splice 这些）。这两个限制在复杂场景下特别烦人，比如我们项目里有一个动态表单，字段是根据配置动态生成的，Vue 2 里面新加字段就得 Vue.set，代码非常别扭。\n\nVue 3 换成了 Proxy。Proxy 可以代理整个对象，不管你是已有属性还是后加的，它都能拦截到。数组也是原生就支持，不用再记哪些方法能用哪些不能用。而且 Proxy 有 13 种拦截器（get、set、deleteProperty、has 等），defineProperty 只能拦截 get 和 set，这给了 Vue 3 更多优化的空间。\n\n再说说响应式的内部流程，这个面试经常被问到。Vue 3 的核心是三个角色：reactive/ref（数据源）、effect（副作用函数）、track/trigger（依赖追踪和触发）。\n\n当你用 reactive 包一个对象时，Vue 会创建一个 Proxy。当你在组件里读取这个对象（比如 template 里 {{ user.name }}），JS 引擎会触发 Proxy 的 get 拦截。get 里面做了两件事：第一，记录"当前这个 effect 依赖了 user.name 这个属性"（这就是 track）；第二，返回实际的值。\n\n当你修改这个值，触发 Proxy 的 set 拦截。set 里面也做了两件事：第一，更新实际的值；第二，通知所有依赖了这个属性的 effect 重新执行（这就是 trigger）。\n\n你不用像 React 那样手动声明依赖数组——Vue 在运行时自动追踪。这也是为什么 Vue 不会有 stale closure 的问题：因为你修改变量后，依赖这个变量的 effect 自动就被重新调度了。\n\n再提一个经常被忽略但很重要的点：scheduler（调度器）。Vue 3 的响应式更新不是同步的——你在同一个事件循环里改了 10 个 ref，Vue 不会触发 10 次渲染。它会把这些更新收集起来，等当前同步代码执行完后，在 microtask 里统一触发一次。所以你不会看到中间状态。这个和 React 18 的自动批处理思路是类似的。',
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
    answer: 'Vue 3 的编译优化是被低估的一个话题。大多数前端只知道 Vue 3 用 Proxy 替代了 defineProperty，但其实编译器层面的优化才是 Vue 3 性能大幅提升的核心原因。\n\n先说静态提升。Vue 的模板编译器会在编译阶段把完全静态的节点提升到 render 函数外面。什么意思呢？比如你的模板里有一个 <div class="header"><h1>欢迎</h1></div>，这里面没有任何动态绑定（没有 {{}}、没有 v-if、没有 v-for），Vue 编译器识别出来后就把它提到 render 函数之外作为一个常量。这样每次组件重渲染的时候，这个静态节点就不会重新创建虚拟 DOM，直接复用。\n\n然后是 Patch Flags。这个我觉得设计得特别聪明。编译器会在动态绑定的元素上打一个标记（flag），比如 TEXT=1 表示只有文本是动态的，CLASS=2 表示只有 class 是动态的，PROPS=8 表示只有 props 是动态的。运行时 diff 的时候，Vue 跳过所有没有 patch flag 的节点，只对有 flag 的节点做对比。这比 React 的"全量 diff 再优化"的思路更激进——Vue 是在编译阶段就把"哪些东西会变"精确标注好了。\n\nBlock Tree 也是基于 patch flag 的一个优化。传统虚拟 DOM diff 是一棵树一棵树地对比，但 Vue 3 把动态节点单独收集到一个数组里（叫 dynamic children），diff 的时候只比这个数组，静态节点直接跳过。大模板里这个提升特别明显。\n\n再说说 Vapor Mode，这是 Vue 正在开发的无虚拟 DOM 模式。传统 Vue 的流程是 template → vdom → 真实 DOM。Vapor Mode 的思路是把 template 直接编译成命令式的 DOM 操作代码，跳过 vdom 这一层。因为编译器知道哪些部分是动态的，它可以在编译期生成对应的更新代码，运行时不需要构建和 diff 虚拟 DOM 树。\n\n这个模式有什么好处？第一，运行时体积更小（不需要虚拟 DOM 的代码）。第二，更新性能接近原生 JS 操作 DOM（因为没有 diff 开销）。第三，内存占用更低（不需要维护虚拟 DOM 树）。\n\n但 Vapor Mode 也不是万能。它牺牲了虚拟 DOM 带来的灵活度——你不能在运行时动态改变组件树的结构。所以 Vapor Mode 更适合性能敏感的场景（比如活动页、H5 落地页），复杂交互的管理后台可能还是需要虚拟 DOM。\n\n面试官可能会追问 Vue vs React 选型。我的个人经验：5 人以下的小团队偏 Vue，模板语法统一团队风格，上手快；大团队或者有复杂的服务端渲染需求偏 React，RSC + Next.js 的生态更成熟。但说实话，两个框架现在都很优秀，选哪个更多是团队偏好和项目需求的问题。',
    tags: ['Vue', 'Compiler', 'Patch Flags', 'Vapor Mode', '选型'],
  },
  {
    id: 'res-08',
    title: 'Vue Composables 与 React Hooks 对比',
    category: 'resume',
    subCategory: 'Vue 深入',
    difficulty: 2,
    question: '结合项目经验，阐述 Vue 3 Composables 的最佳实践。与 React Hooks 相比有何异同？常见反模式有哪些？',
    answer: '如果你同时写过 Vue 3 和 React，你会发现 Composables 和 Hooks 在"逻辑复用"这个目标上想法是一致的，但实现细节差别很大。\n\n最大的区别是什么？Vue 不需要依赖数组。\n\nReact 的 useEffect/useMemo/useCallback 都要求你手动声明一个依赖数组，告诉 React "这些值变了你就重新执行"。忘记加依赖会导致读取到过期值（stale closure），多加一个依赖可能导致死循环。说实话，我见过的 React bug 里至少 30% 和依赖数组有关。\n\nVue 没有这个问题。因为它的响应式系统会自动追踪——你在一个 computed 或者 watchEffect 里用了哪些 ref/reactive，Vue 心里有数，只在它们真正变化的时候才重新执行。不需要你手动声明，也就没有"漏写依赖"或"多写依赖"的 bug。\n\n第二个大区别是执行次数。React 的组件函数每次渲染都会重新执行，所以 hooks 也会重新运行。这就导致了 stale closure 问题：你在 useEffect 里引用的变量可能是上一次渲染的值而不是最新值。用 useRef 能绕过去，但代码会变丑。\n\nVue 的 setup() 只执行一次，之后全靠响应式驱动。你定义了一个 computed，它内部引用的值变了，computed 自动重新算。不会出现"读取到旧值"的问题。\n\n我举个具体的例子。我们做过一个多人协作文档编辑器，需要 WebSocket 实时同步。用 React 写的时候，WebSocket 的回调里读取 documentState 总是旧的，得用 useRef 包一下才能拿到最新值。同样的场景用 Vue 的 Composable，ref 的值变了回调里自动就是最新的，完全不用操心。\n\n说到 Composable 的最佳实践，我有几个总结：\n\n第一，单一职责。不要写一个巨大的 useXXX 把所有东西都塞进去。我们项目的习惯是：一个 Composable 管一件事，比如 useAuth 只管登录状态，useMediaQuery 只管响应式断点，useWebSocket 只管连接管理。然后你可以组合它们。\n\n第二，清理副作用。onUnmounted 里一定要清理定时器、事件监听、WebSocket 连接。这个在 React 和 Vue 都一样重要，忘关 WebSocket 导致服务器积累僵尸连接的事情我见过不止一次。\n\n第三，别在 Composable 里改 props。props 是父组件传给你的，你改它等于在变更数据结构的所有者，这是典型的反模式。\n\n面试官追问 Composable vs Mixin 有什么区别？Mixin 的问题是命名冲突和来源不透明——组件里用了一个变量你不知道是从哪个 mixin 来的。Composable 是显式 import + 显式解构，来源一眼就能看出来，调试体验好太多了。',
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
    answer: 'Vite 这个东西我刚上手的时候很好奇它为什么这么快，后来看了源码才理解它的设计思路确实巧妙。\n\n开发模式下，Vite 快的关键是"按需编译"。传统的 bundler 比如 Webpack，启动的时候要把你整个项目打包一遍，项目越大启动越慢。Vite 不这么做——它利用浏览器原生支持的 ESM import，你写的每一个 import 语句浏览器自己会去请求。Vite 的 dev server 只是在你请求 .vue、.ts、.jsx 文件的时候按需转换一下再返回。\n\n但这有个问题：node_modules 里的包如果也用 ESM，有些包可能有几百个碎片模块，浏览器会发几百个请求，照样慢。Vite 的解决方案是用 esbuild 预构建依赖——把 CommonJS 转成 ESM，把碎片模块合并成几个大的包，结果缓存在 node_modules/.vite 里。esbuild 是 Go 写的，比 JS 写的打包器快几十倍。\n\n生产构建为什么不能用 esbuild？因为 esbuild 的代码分割能力很弱，CSS 处理基本为零，Tree-shaking 也不够好。所以 Vite 生产构建用的是 Rollup——Rollup 天然支持 Tree-shaking，代码分割灵活，插件生态成熟。而且 Vite 统一了 dev 和 build 的配置和插件接口，你写一个插件两边都能用。\n\nHMR 这块 Vite 也做得不错。它维护了一个模块依赖图，当你改了一个文件，Vite 精确知道哪些模块受了影响，只失效那些模块，不会整个页面都刷新。比起 Webpack 的 HMR（有时改了深层组件也全量刷新），Vite 的 HMR 精准度高很多，大型项目里体验差异很明显。\n\n说到自定义插件，我给团队写过几个。比如有个构建信息注入插件——每次构建时把构建时间、Git commit hash 注入到 HTML meta 标签里，出问题的时候能快速定位是哪个版本。还有一个 SVG Sprite 插件，开发阶段自动扫描 icons 目录生成 symbol 列表，生产构建时内联到 HTML 里减少请求。\n\n面试官可能追问 esbuild 和 SWC 哪个好？esbuild 侧重打包和转换，SWC 侧重转译（TS→JS），两个其实可以互补。Vite 用 esbuild 做预构建和 TS 转译，如果想进一步提升生产构建速度可以换成 SWC。',
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
    answer: 'CI/CD 这事我经历过从无到有搭建的过程。最早我们团队没有 CI，代码合到 main 然后手工 npm run build 部署，出过几次线上事故以后痛定思痛搭了一套流水线。\n\n我按阶段来介绍我们当前的方案。\n\nPre-commit 阶段，用 Husky + lint-staged。只检查 git staged 的文件，不会扫全量。跑三件事：ESLint 自动 fix、Prettier 格式化、commitlint 校验 commit message 格式（我们用的 conventional commits，feat/fix/chore 这些前缀）。这一层的目的就是让开发者在本地就拦住低级错误，别等到 CI 才报。\n\nPR 提交后，GitHub Actions 自动触发。我们分了几个并行 job：第一个是类型检查，tsc --noEmit，TypeScript strict 模式，公司内部严禁 any 除非有充分理由且加注释。第二个是 lint，ESLint + Prettier 全量。第三个是测试，Vitest 跑单元测试和组件测试。第四个是构建验证，确保能 build 得出来。还有一个 Bundle 体积分析，用 vite-bundle-visualizer 生成报告，设置了大小的阈值，超过就 CI 报红。\n\n这里面有个优化点：PR 检查不需要跑全量。我们用 --since=origin/main 只检查变更的文件和受影响的测试，一个 PR 改了两行代码根本不用跑几百个测试。\n\n合并到 main 之后，自动部署到 staging 环境，然后跑 E2E 测试（Playwright）。E2E 我们只覆盖关键用户路径，比如登录 → 创建订单 → 支付 → 查看详情，大概 20 个场景。全路径跑 E2E 时间太长也维护不起。\n\n生产部署我们用了灰度发布策略。先部署到 10% 的服务器，观察 Sentry 有没有新的报错，Web Vitals 指标有没有恶化。没问题再全量。\n\n有几个血泪教训：第一，缓存策略很重要。pnpm store 和 node_modules 要缓存好，不然后每次 npm ci 跑 3 分钟谁都受不了。第二，Husky 版本升级要测试，v5 到 v9 之间有 breaking changes。第三，CI 配置本身也要版本管理，我们 CI 的 yml 文件经常被人乱改导致构建失败。',
    tags: ['CI/CD', 'Husky', 'ESLint', 'GitHub Actions', '质量保障'],
  },
  {
    id: 'res-11',
    title: 'Monorepo 架构与 Turborepo',
    category: 'resume',
    subCategory: '前端工程化',
    difficulty: 3,
    question: '如果你要为公司搭建 Monorepo 管理多个前端项目（官网、后台、H5、组件库），如何设计？Turborepo 的核心机制是什么？如何处理依赖管理和版本发布？',
    answer: 'Monorepo 这件事，我是在公司项目变多以后被迫学的。原来只有两个项目的时候还好，后来发展成官网、后台管理、H5 活动页、组件库四个 repo，每个都有一套 ESLint 配置、TS 配置、工具函数——完全重复。改一个 ESLint 规则要改四个地方，实在受不了了。\n\n所以我把它们合并到了一个 Monorepo，用 pnpm workspace + Turborepo。\n\n先说目录结构。apps 下面放各个应用，packages 下面放共享的代码包，比如 ui（组件库）、utils（工具函数）、config-eslint、config-ts、hooks。每个 package 都有独立的 package.json 和构建配置。\n\nTurborepo 的核心价值是缓存和并行。你跑 turbo build，它会先算每个 package 的构建哈希——依赖的包版本、源码文件的变化都参与哈希计算。如果上次构建的哈希和这次一样，直接复用缓存的产物，跳过构建。大型项目这个缓存节省的时间是惊人的。另外无依赖关系的任务可以并行跑，有依赖关系的任务按拓扑顺序执行。\n\n远程缓存是个进阶用法。团队里第一个人构建后产物缓存到远程（我们用 Vercel 的远程缓存），第二个人拉代码后 turbo 发现远程已经有相同的哈希了，直接下载缓存，省掉了整个构建过程。冷启动构建时间缩短 60-80% 不是夸张。\n\nturbo.json 的 pipeline 配置我讲一个要点：build 要配置 dependsOn: ["^build"]，意思是先构建依赖的包，再构建自己。test 配置 dependsOn: ["build"]，意思是构建完才跑测试。lint 没有依赖，可以并行。dev 要配置 cache: false，因为开发模式不需要缓存。\n\n版本发布我们用 Changesets。流程很简单：开发者改了某个 package 后，运行 changeset add，选择是 patch/minor/major，写一句话描述改了什么。CI 里 changeset version 会自动更新包的版本号和 CHANGELOG。changeset publish 发布到 npm。changeset 的 description 文件要提交到 Git，方便追溯。\n\n面试官追问：为什么用 pnpm 不用 yarn 或 npm？pnpm 的核心优势是硬链接节省磁盘（同一个包的相同版本在磁盘上只有一份），还有更严格的依赖隔离——你的代码 import 了一个没在 package.json 里声明的包，pnpm 会报错，npm 和 yarn 不会。这避免了"幽灵依赖"，让你的包在不同环境表现一致。',
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
    answer: 'TypeScript 这件事我可以用一句话总结：你越深入用，越发现它的类型系统比很多静态语言还灵活。\n\n我分享几个我实际项目里用过的"高级"类型，每个都是真实需求驱动的，不是炫技。\n\n第一个是条件类型 + infer。我们项目用 TanStack Query 做数据请求，它有个 select 回调可以转换 API 返回的数据。但 select 回调的参数类型 TS 推导不出来，需要手动声明。我用 infer 写了个 ExtractData 类型，自动提取 QueryFn 返回的 Promise 内部的类型，整个链条类型就通了。写起来确实有点绕，但写完以后团队所有人在用 query 的时候都是类型安全的。\n\n第二个是模板字面量类型。我们自研的组件库有一套事件命名规范，所有事件必须 onCamelCase 这种格式。如果事件名随便写字符串，很容易后面拼错。我用模板字面量类型写了 type EventName = `on${Capitalize<Name>}`，这样写错一个字母 TS 就直接报错。类似地，Tailwind 风格的原子 CSS（比如 mt-4、pt-8）用模板字面量来约束，非法值直接红线。\n\n第三个是映射类型。后台系统有个常见的需求：服务端的某些字段前端只读展示不能编辑，但类型是同一个。我写了 type ReadonlyFields<T, K extends keyof T> = Omit<T, K> & { readonly [P in K]: T[P] }，从后端数据类型 T 自动生成前端只读版本。不用手动维护两套类型。\n\n还有泛型约束的层层传递。表单校验库里，FieldConfig<T> 从数据模型 T 自动推导每个字段的类型和校验规则。你改了 T 的某个字段类型，校验规则会自动适配，不用逐个手动更新。\n\n但说实话，高级类型也会有代价。太复杂的类型推导会让 IDE 的类型提示变慢，而且别的同事可能看不太懂。我的平衡策略是：公共工具类型可以写复杂一些（因为它被很多人用、回报大），业务代码里的类型尽量直观。另外有个实用技巧是 Branded Type——给基本类型打个标签防止混淆，比如 type UserId = string & { __brand: \'UserId\' }，这样你不会把 UserId 当成普通 string 传给不期望它的函数。',
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
    answer: '我先整体介绍一下我简历里这个 AI 多媒体互动平台，后面几个问题会深入讲具体模块。\n\n这个平台的核心定位是一个面向内容创作者和媒体团队的 AI 工具，帮助他们做视频的转写、翻译、字幕生成和内容分析。用户上传一个视频或者直播流，平台通过 Whisper 做语音转文字，GPT 做翻译和摘要，然后把字幕叠加到视频上。用户可以编辑、校正字幕，导出成 SRT/VTT 格式，或者直接分享带字幕的视频链接。\n\n面向的用户群体主要是：做海外内容搬运的字幕组、做课程翻译的教育机构、做直播实时字幕的媒体公司。他们原来的工作流程大概是：手动听写 → 翻译 → 用 Aegisub 打时间轴 → 导出字幕 → 压制视频。整个过程一个 30 分钟的视频可能要花一天。我们这个平台把时间缩短到了分钟级。\n\n前端这边我负责了整个平台的架构设计和主要功能开发。技术栈是 React 18 + TypeScript + Zustand + TanStack Query，UI 层基于 Radix UI + Tailwind CSS，构建用 Vite。\n\n前端用到的主要能力有几个方面：\n\n第一个是文件上传与处理流程。支持大文件（视频动辄几个 G）的分片上传，做了断点续传和进度展示。上传完成后前端轮询后端的转码和转写状态，用 SSE 实时推送处理进度。\n\n第二个是字幕编辑器。这个可能是前端最复杂的模块。我们用了 Canvas 来渲染字幕时间轴，支持拖拽调整字幕块的时间范围、双击编辑字幕文本、合并和拆分字幕块。而且做了完整的撤销/重做（Command Pattern），导出支持 SRT、VTT、ASS 三种格式，全是纯前端实现的，不依赖后端。\n\n第三个是 AI Chat 交互模块。用户可以在看视频的时候和 AI 对话，比如"帮我总结这 5 分钟的内容"或者"把这段翻译成日文"。这里用到了 SSE 流式传输，支持 Function Calling（工具调用），比如 AI 回复里说"我把视频跳到 3 分 15 秒"，前端会识别并执行这个动作。\n\n第四个是实时字幕叠加。用户播放视频的时候，字幕要同步高亮显示。这里有个挺有意思的问题：如何在视频播放时精确同步字幕时间轴？我们用了 requestAnimationFrame 循环 + 二分查找定位当前字幕，做了预渲染 ±3 条字幕的 DOM 元素避免闪烁。\n\n这个项目的技术挑战后面几个问题会展开讲。',
    tags: ['AI项目', '多媒体平台', 'OCR', 'Whisper', '流式处理', 'Canvas', 'WebSocket', '前端架构'],
  },

  {
    id: 'res-13',
    title: 'AI Chat 前端架构设计',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 3,
    question: '你在简历中提到 AI 能力的前端集成。如果要设计一个通用 AI Chat 前端框架（类似 ChatGPT），请从流式响应渲染、会话管理、上下文窗口、插件系统四个维度详细阐述架构设计。',
    answer: 'AI Chat 前端的搭建看着简单，实际里面坑很多。我从消息流架构说起。\n\n流式传输我们用的是 SSE（Server-Sent Events），不是 WebSocket。为什么？因为 LLM 是单向的——服务端生成 token，客户端接收，客户端不发东西。SSE 天然单向、走 HTTP 不需要额外的心跳协议、浏览器 EventSource 自动重连。WebSocket 更适合双向频繁交互的场景，比如实时聊天室。\n\n不过 EventSource 有个限制：不支持 POST 请求和自定义 Header。我们的 Chat API 需要传 Authorization token，所以不能用原生 EventSource。实际用的是 fetch + ReadableStream，手动处理数据流。\n\n流式渲染的挑战在于 UI 不能闪烁。AI 一个字一个字地吐，你如果每收到一个 token 就重新渲染整个消息区，那页面会抖得像地震。我们的做法是：用 rAF 批量更新——在一个动画帧内收集到的所有 token 合并渲染一次。另外消息体用了一个简单的 diff 算法，只有新增的文本才重新排版，已有的部分不动。长消息还要配合虚拟化，不用把所有历史消息都挂在 DOM 里。\n\n代码块是个特别烦人的细节。AI 经常输出代码，但 token 是逐字来的——```javascript 到 ``` 之间可能有几千个 token。如果在渲染过程中就想对代码做语法高亮，你要么等它全部接收完再高亮（但用户看到的过程是纯文本没有高亮的），要么每来一个 token 就重新高亮（性能爆炸）。我们的折中方案是：在代码块闭合之前显示 plain text，闭合后（即收到结束的 ```）一次性高亮。\n\n会话管理用的是 Zustand + IndexedDB（Dexie.js）。最多缓存 50 个会话在本地，支持跨 Tab。多 Tab 同步用 BroadcastChannel，同一时间只有一个 tab 可以发消息，避免了多 tab 同时请求的 token 浪费。\n\n上下文窗口是一个有意思的问题。GPT-4 的上下文窗口有 128K，但你不可能把整个对话历史都塞进去——token 是要钱的，而且输入越长响应越慢。我们的策略是：system prompt 永远在最前面，然后保留最近 N 轮完整对话，更早的历史做摘要压缩（调 GPT 自己总结），再早就截断丢弃。前端会显示一个用量指示器，告诉用户还剩多少上下文。\n\n插件系统这块，我们支持开发者注册自定义插件。插件可以定义 Function Calling 的 schema，AI 决定调用哪个工具时，前端渲染对应的 UI 卡片。工具调用有三种状态：pending（等待执行）、success（成功）、error（失败）。我们还加了确认机制——涉及敏感操作（如删除、支付）的工具调用需要用户手动确认后才执行。\n\n面试官可能会追问很多细节。比如流断了怎么办？我们做了中断标记 + 继续生成按钮，15 秒超时自动重连，重连时把最后一条消息的 ID 传给后端继续。Token 计数用 js-tiktoken，但因为那个包有 3.5MB，我们动态 import 懒加载，同时做了个轻量 fallback：中文估算 1 字约 1.5 token。最关键的是截断必须在完整的消息边界上，不能把一条消息截成两半。',
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
    answer: '字幕系统是我在这个项目里投入最多时间的一个模块。它本身就是一个完整的前端应用，我分几个部分来讲。\n\n先说数据模型。每条字幕是一个对象：{ id, start, end, text, speaker?, confidence? }，start 和 end 是毫秒级的时间戳。后端 Whisper 转写出来的结果是按语句切分的，一个 30 分钟的视频大概几百到上千条字幕。全量数据不到 200KB，前端可以一次性加载。直播场景下字幕是增量的，走 WebSocket 推送。\n\n时间轴同步是这个系统的核心。视频在播放的时候，你需要实时知道"当前时间点应该显示哪条字幕"。最简单的做法是遍历数组匹配时间范围——但是如果有一千条字幕，每 16ms（60fps）遍历一次一千条，这太浪费了。我们的做法是：字幕数据按 start 排序后，用二分查找 O(log n) 定位到当前时间点的字幕索引。然后预渲染当前位置 ±3 条字幕的 DOM 节点，切换显示靠 opacity 过渡。这样实际渲染的 DOM 始终只有 7 个字幕块，性能开销极小。\n\n字幕编辑器是前端复杂度最高的模块，我们选了 Canvas 而不是 DOM 来渲染时间轴。原因是时间轴可能有几百上千个字幕块，用 DOM 的话每个块都要一个 div，节点数量爆炸，拖拽交互性能也会崩。\n\nCanvas 的渲染做了分层：底层是网格和时间刻度、中层是字幕块（按音轨分不同颜色）、顶层是拖拽指示线条。分层的好处是重绘的时候可以按层隔离——字幕块变化的时候只重绘中层，网格和刻度不动。\n\n编辑器支持的交互有：拖拽移动字幕块（有吸附对齐）、拖拽边界调整时间范围、双击编辑字幕文本、选中后合并/拆分。撤销和重做用 Command Pattern 实现的——每个操作封装成 command 对象（包含 do 和 undo 方法），压栈执行，Ctrl+Z 就弹出并 undo。\n\n导出功能全部在前端完成，不依赖后端。SRT 格式很简单，就是序号 + 时间范围 + 文本；VTT 多了头部元数据；ASS 最复杂，有样式定义块和事件块。注意 SRT 导出时要加 BOM 前缀，不然某些播放器会乱码。\n\n还有双语字幕。我们有 AI 翻译模块，调用 GPT-4 逐条翻译。翻译结果缓存在 IndexedDB 里，下次打开不用重新翻。对比下来，GPT-4 的翻译质量明显比 Google Translate 好，特别是长句和对上下文的把握。当然成本也高。\n\n面试官追问实时字幕的延迟怎么处理？Whisper 本身有 2-5 秒的处理延迟，这是没法消除的。我们在前端标注了"字幕有约 3 秒延迟"，并且维护了一个 3-5 秒的 buffer——因为后端可能会修正已经发过的字幕（重新识别后 confidence 更高的结果会覆盖之前的）。匹配方式是按 subtitle id，新的覆盖旧的，用户看到的就是平滑修正的体验。',
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
    answer: 'AI 辅助开发这个话题，我作为一个每天都在用 AI 写代码的人，有很多真实感受。不是那种"AI 会替代程序员"的营销话术，而是实际怎么用、什么好用、什么坑。\n\n我先说一下我目前的 AI 辅助开发流程，大概分五个阶段：\n\n第一阶段，需求拆解。我拿到 PRD 或需求文档后，先丢给 AI（Codex 或 Claude），让它帮我拆成可实现的功能点和任务列表，评估每个任务的工作量。但我不全信它的——AI 经常把一个复杂功能低估成"简单"，或者反过来把一个简单 CRUD 想复杂了。所以人工确认优先级这个步骤不能跳过。\n\n第二阶段，代码生成。这是 AI 最擅长的。脚手架代码、表单 CRUD、样式排版、单元测试用例——这些重复性高、模式固定的工作，AI 真的能做到 60-80% 的效率提升。但交互逻辑（比如拖拽、手势、复杂动画）和涉及安全逻辑的代码（认证、鉴权、数据脱敏），我不会交给 AI，或者至少不让它直接输出最终代码。\n\n第三阶段，Diff Review。AI 生成代码后，我逐行看 diff。AI 可以帮我做第一遍检查——变量命名是否规范、类型是否完整、有没有潜在的空值问题。但架构层面的决策（比如这个组件该不该拆、这个 API 设计合不合理）需要人脑判断。我们团队有个硬规则：任何 AI 生成的代码必须经过人工 diff 审查才能合并。\n\n第四阶段，测试生成。这个 AI 真的帮了大忙。你给它一个函数或组件，它能自动生成覆盖各种边界情况的测试用例，包括 mock 数据。但 E2E 测试的关键路径需要人工设计，AI 不知道哪些用户路径是核心的。\n\n第五阶段，文档生成。README、API 文档、组件使用说明这些，AI 生成后我 review 一遍微调就行，效率提升非常明显。\n\n然后说几个追问我经常被问到的问题：\n\nAI 会不会生成幻觉代码？会的，而且比你想象的多。我的防幻觉策略是：项目里放完整的类型定义文件（这样 AI 知道数据结构长什么样）、锁死依赖版本（不让 AI 随意引入不存在的 API）、让 AI 先读相关文档再生成代码、分层生成不要一次生成太多（一次一个模块，生成后立即验证）。\n\nAI 生成代码的安全问题？我最担心的是 AI 生成的代码忘记加认证检查或者使用危险的 API。现在我的做法是：CI 里专门加了一个 security lint 环节，检查是否有 innerHTML、eval、未授权的 API 调用。涉及认证、支付、数据脱敏的逻辑不交给 AI。\n\n推广团队使用 AI 工具？我不强制，强制大家会反感。我的做法是：每次周会分享一个"AI 帮我省了多少时间的真实案例"，让大家看到实际收益。强调 AI 是"加速器"不是"替代品"，同时要求所有 AI 生成的代码在 PR 里标注。',
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
    answer: 'Core Web Vitals 这三个指标我做过系统性的优化实战，不是纸上谈兵。\n\nLCP 就是用户看到主要内容花了多久。Google 的标准是 2.5 秒以内算优秀。我做过一个电商落地页的优化，LCP 从 4.2s 降到了 1.8s，方法其实就几招：把 Hero 大图换成 WebP 格式，配合响应式 srcset 按屏幕宽度加载不同尺寸；给 Hero 图片加 fetchpriority="high" 让浏览器优先加载；关键 CSS 内联到 head 里，避免等待外部 CSS 加载；首屏不需要的第三方脚本全部加 async 或 defer。这四个改动按顺序做完，效果立竿见影。\n\n面试官可能追问：LCP 和 load 事件有什么区别？load 是页面所有资源加载完成，包括你可能不关心的第三方统计脚本。用户可能早在 1-2 秒就看到核心内容了。所以 LCP 比 load 更能反映真实体验。\n\nINP 是去年新出的指标，替换了旧的 FID。为什么换？因为 FID 只测"第一次交互"的延迟，太片面了。想象一下：用户进来第一次点击很流畅，但翻了 3 页后点个按钮卡了 3 秒——FID 完全测不出来。INP 取的是所有页面交互的第 98 百分位值，能把那些偶发但极慢的坏体验抓出来。目标 < 200ms。\n\n我做过一个 AI 媒体平台的 INP 优化：搜索功能里用户输入触发全量数据过滤和渲染，INP 高达 350ms。解决方案是用 useDeferredValue 延迟列表渲染（让输入保持高优先级、列表更新降级），再配合虚拟列表只渲染 20 条可见项，INP 降到了 120ms。\n\nCLS 衡量的是"页面跳不跳"。有种经典场景：你正准备点一个按钮，突然上面加载了个广告图片把按钮挤走了，你点到了广告上。CLS 就是量化这种体验的。最有效的预防手段是给图片和广告位预留尺寸（width/height 或者 CSS 的 aspect-ratio），让浏览器在加载前就知道这个元素占多大空间。Web 字体加载也是 CLS 的重灾区——font-display: swap 配合一个尺寸接近的 fallback 字体可以大幅减少跳动。\n\n面试官还会问：transform 动画会触发 CLS 吗？不会。CLS 只计算"意外的"布局偏移。你用 transform 是主动做的视觉变化，浏览器知道这是有意的。所以动画请用 transform 而不是改 top/left。',
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
    answer: '资源加载策略这个东西，不同类型的页面策略完全不一样，不能一视同仁。我按简历里的项目类型来说。\n\n游戏活动页这种，核心诉求是首屏要快。首屏 CSS 我直接内联到 HTML 的 head 里，不用外链——少一个请求就少一次网络往返。Hero 大图用 link rel="preload" 告诉浏览器"这个东西马上要用、先加载"。非首屏的路由组件全部 lazy load（React.lazy），第三方脚本延迟到 window.onload 之后再加载——比如统计 SDK、客服组件这些，用户第一眼根本不需要。还做了 preconnect 预连接第三方域名（比如 CDN、API 网关），把 DNS 和 TLS 的时间省掉。\n\n管理后台则是相反的策略——首屏没那么急（用户进来后有预期的等待），但整个使用过程的流畅度很重要。我强调两个点：路由级代码分割，每个页面独立一个 chunk；预加载可能访问的页面——当前在"订单列表"，那"订单详情"可以 prefetch。还有 Service Worker 缓存静态资源，第二次打开几乎是秒开。\n\n内容型网站（比如 SEO 要求的官网）用的是 SSR + 渐进式加载。首屏服务端直出 HTML，搜索引擎能爬；页面里的交互模块做到 Islands Architecture——静态内容零 JS，只有评论框、点赞按钮这些小模块才按需加载 JS。\n\nBundle 分割我有一套固定的原则。vendor chunk：react、react-dom、antd 这些大依赖单独分开，因为它们基本不变，分开打包后缓存命中率极高，用户第二次访问不用重新下载。common chunk：多个入口共享的代码抽出来。route chunk：每个路由独立，首次只加载当前页面的代码。大型组件独立 chunk——比如富文本编辑器、图表库这些几百 KB 的东西，单独打包、lazy load。\n\nVite 里配置起来也很简单，build.rollupOptions.output.manualChunks 手动指定分包策略。代码分割做好以后，首屏 JS 从 800KB 降到 150KB 是很正常的效果。\n\n面试官追问：四种 pre 开头的加载指令有什么区别？preload 是强制立即加载、浏览器不允许你浪费（当前页面肯定用）。prefetch 是提示浏览器空闲时可以加载一下、未来页面可能用。modulepreload 是 Vite 自动为动态 import 生成的。preconnect 是只做 DNS + TLS 握手、不下载内容——用在第三方域名，比如 CDN。',
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
    answer: '大规模 WebSocket 这个消息量上来以后，前端如果不做设计真的会卡崩。我说说我在社群 Web App 项目里的架构经验。\n\n第一条，消息分级。不是所有消息都一样重要。系统消息（比如"管理员开启了全员禁言"）必须可靠送达，走可靠通道；普通聊天消息可以允许偶尔丢一条（用户感觉不到）；弹幕和点赞这些高频消息，500ms 合并一次再渲染，不然一秒几百条你渲染不过来。分级的本质是：不要把鸡蛋放在一个篮子里，不同优先级的消息用不同的处理和保障策略。\n\n第二条，虚拟列表。消息列表用 @tanstack/react-virtual 的动态高度模式。不管你历史消息有一千条还是一万条，DOM 里始终只渲染可视区 + 上下各 buffer 几条。新消息来的时候自动滚到底部，但如果用户在翻看历史记录，不会强制滚动——检测 scrollTop 判断用户意图。\n\n第三条，连接管理。WebSocket 不是连上就不管了。做了心跳保活：客户端每 30 秒发 ping，90 秒没收到 pong 就判定断连。重连用指数退避——1 秒 → 2 秒 → 4 秒 → 8 秒，最大 30 秒。这样既保证快速恢复，又不会在服务器挂了的时候疯狂重连把服务器打得更死。重连后同步离线消息：客户端传 lastMessageId，服务端返回这之后的所有消息。\n\n第四条，消息可靠性。客户端发消息时先乐观插入——生成临时 ID，消息状态标"发送中"。服务端收到后 ACK 确认回来，状态变成"已发送"。如果超时没有 ACK（一般设 5 秒），标记"发送失败"并提供重试按钮。去重逻辑靠两样：客户端生成 clientMsgId，服务端按此幂等处理；客户端收到重复 ID 的消息直接忽略。\n\n有个容易被忽略的坑：企业网络环境里有些代理会阻断 WebSocket。Socket.io 可以自动降级到长轮询（HTTP 长连接），这个最好测一下，不然用户可能在你本地开发环境一切正常，到了公司内网就连不上。',
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
    answer: '数据埋点这个事，我是在游戏官网和活动页项目里真正做起来的。之前觉得埋点就是"在按钮上挂个 click 事件然后发个请求"——真做起来发现完全不是这么简单。\n\n先说架构。我搭的是 GA4 + GTM 的组合。GTM（Google Tag Manager）负责触发规则管理，什么事件在什么条件下触发、往哪里发，全在 GTM 后台配置，不用改代码。GA4 是数据接收和分析端。中间通过 Data Layer 来通信——前端代码只负责往 dataLayer.push 塞数据，GTM 从 dataLayer 读数据，这样前端代码不需要关心具体发到哪里。\n\nData Layer 的设计我花了不少心思。每条事件一个标准的 push 对象：{ event, page_category, page_title, user_id, ...自定义维度 }。自定义维度我们定义了一套统一的事件命名规范：page_view、video_play、button_click、form_submit、purchase 等。所有事件走同一个 dataLayer.push 通道，GTM 里面配规则做过滤和路由。\n\n再说事件分类。交互事件是最常见的——按钮点击、表单提交、视频播放。这些不需要前端写额外代码，GTM 里直接配 trigger 就能自动捕获。但业务事件（如"用户完成了注册流程"、"订单支付成功"）必须手动 push。页面浏览事件 GA4 默认就有，但自定义参数（比如 page_category = "游戏活动"）得通过 dataLayer 传。\n\n有个容易踩的坑：GTM 的 trigger 配错了会导致事件重复上报或者漏报。我们团队的做法是：每次改 GTM 配置都在 Preview 模式下验证，看哪些事件确实触发了、数据对不对，确认无误再发布。不要直接在线上环境改 GTM 配置。\n\n隐私合规这块现在越来越重要。GDPR 和国内的个人信息保护法都要求用户同意后才能采集数据。我们做了：用户首次访问时弹 consent banner，只有用户点了"同意"，GTM 才启用 analytics cookie。不同意的用户只做匿名的基本统计，不存任何个人标识。\n\n性能方面也要注意。GA4 + GTM 的 JS SDK 不小，但这个是异步加载的，不会阻塞页面渲染。不过如果在 dataLayer.push 里传大量数据（比如整个 DOM 的快照），会影响性能。只传必要字段，event 级别的数据尽量精简。\n\n面试官追问：怎么验证埋点数据准不准？三个方法：GTM Preview 实时验证单条事件、GA4 的 Realtime 报表看事件有没有进来、数据端做交叉校验（比如数据库里的注册人数和 GA4 的注册事件数对比）。',
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
    answer: 'A/B Testing 我在游戏活动页项目里搞过几次，效果很明显——一个按钮颜色的改动能让活动转化率提升 15%。但这套基础设施搭起来不容易。\n\n先说整体架构。我选的是 Google Optimize（后来迁移到了第三方 A/B 平台）+ GA4 做效果衡量。核心流程是：前端在页面加载时从 A/B 平台拉取实验配置（用户被分到哪个分组、每个分组看到什么变体），然后根据分组渲染不同的 UI。\n\n实验配置的加载有一个关键问题：不能等拉取完配置再渲染页面，否则会有明显的闪烁。我们的做法是：在 HTML 的 head 里放一个很小的内联脚本（<1KB），同步请求实验配置。拿到分组的瞬间就上 body class（比如 data-variant="B"），然后 CSS 根据这个 class 展示不同的样式。用户完全感觉不到闪烁。\n\n流量分割有几种方式。随机分配最简单，常用于 UI 类的实验。按用户 ID hash 分配，适合需要用户一致性的场景——同一个用户多次访问应该看到同一个变体，否则体验会割裂。分层实验是更高级的玩法：同一个用户同时参与多个互不干扰的实验。\n\n实验结果的衡量靠 GA4 的自定义维度和事件。每个分组上报事件时带上实验 ID 和分组 ID 的自定义维度。GA4 报表里按分组维度对比核心指标（点击率、转化率、跳出率），就能判断哪个变体赢了。\n\n我踩过一个坑：实验期间改了代码导致实验数据污染。后来定了个规则——实验期间除了修 bug，不能改实验相关的代码和配置。还有就是实验需要足够的样本量才能有统计显著性，不能跑两天看到趋势就下结论。我们一般至少跑 1-2 周，收集足够的样本。\n\n面试官追问：前端 A/B 和服务器端 A/B 有什么区别？前端 A/B 是客户端分流，优点是不依赖后端、迭代快，缺点是有闪烁风险（我们已经用内联脚本解决了），而且前端代码里两个版本的代码都会打包进去增加体积。服务器端 A/B 是服务端分流，无闪烁、性能好，但每次改实验要后端配合，迭代慢。我们主要是前端 A/B，只有大改动才走服务端。',
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
    answer: 'SEO 这件事，我们游戏官网从零到有做了一遍，从 Google 收录几百页到几千页，自然流量翻了 3 倍。聊聊我实际做了什么。\n\n第一步也是最关键的一步：技术选型用 SSR。SPA 对 SEO 是灾难——搜索引擎爬虫看到的是空壳 HTML 里面一个 <div id="root"></div>，什么内容都没有。我们用的 Next.js App Router，关键页面服务端渲染，Googlebot 爬到的 HTML 里内容都是完整的。配合 ISR（增量静态生成），首页 10 分钟刷新一次，文章页按需生成。\n\n第二步：结构化数据。用 JSON-LD 格式给搜索引擎标注页面内容。游戏详情页标注了 Game schema（类型、平台、评分），文章页标注了 Article schema（标题、作者、发布日期、封面图），首页标注了 Organization schema。加上以后搜索结果出现了富文本摘要（星级评分、面包屑、封面缩略图），点击率明显提升。\n\n第三步：Meta 标签优化。每个页面必须有唯一的 title 和 description，而且不能千篇一律。title 格式是"页面主题 - 分类 - 网站名"，description 是 120-160 字的自然段落，不是关键词堆砌。Open Graph 标签用于社交分享，Twitter Card 标签用于 Twitter。\n\n第四步：技术性能。Core Web Vitals 直接影响 SEO 排名，特别是移动端。图片做了响应式 + WebP + lazy loading，JS 做了代码分割，非首屏样式异步加载。robots.txt 和 sitemap.xml 不能忘——sitemap 告诉搜索引擎有哪些页面，robots.txt 告诉它哪些不能爬。\n\n第五步：URL 结构。所有 URL 必须语义化且稳定。/games/{slug} 而不是 /page?id=123，slug 用英文小写 + 连字符，不包含特殊字符和参数。\n\n面试官追问：SPA 真的没法做 SEO 吗？可以，用 prerender 服务（预渲染成静态 HTML 给爬虫），或者用 Google 的动态渲染。但这些都是 workaround，有延迟和复杂度。有条件的话还是建议 SSR/SSG，一劳永逸。',
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
    answer: '高并发场景下的防重复提交和状态一致性，这是我在游戏活动页里吃过大亏后来才搞明白的。\n\n最惨的一次是抽奖活动——用户狂点抽奖按钮，前端没做任何拦截，一瞬间发了十几个请求。后端虽然有幂等处理，但用户看到的是按钮疯狂闪烁，体验极差，而且有些请求因为并发问题导致用户扣了积分但没拿到奖品。\n\n从那以后我做了一套完整的防重复体系。第一层是 UI 层——按钮点击后立即 disabled，加上 loading 状态。这个看起来简单，但 React 里有个陷阱：异步操作中如果组件重渲染了，disabled 状态可能丢失。我的处理是用 ref 而不是 state 来控制防重复标记——ref 不会因渲染丢失。\n\n第二层是请求层。封装了一个 useLockFn hook，函数执行期间自动忽略后续调用，直到第一次执行完成。内部用 useRef 存一个 lock 标记，执行前检查 lock、执行完成后释放 lock。\n\n第三层是接口层的幂等 key。每次操作前生成一个唯一的 idempotency key（UUID），和服务端约定同一个 key 只会处理一次。即使同一秒收到了两个请求，服务端查一下这个 key 有没有处理过，已经处理过了直接返回缓存结果。\n\n乐观更新是个双刃剑。点赞这种操作用乐观更新体验很好——用户点了立刻显示已点赞，后端慢慢处理。但如果后端失败了要回滚，UI 就会"闪"一下。我的处理是：乐观更新后给用户一个 200ms 的窗口——这个时间内的撤回操作可以直接取消请求；超过窗口后如果后端失败，用 toast 提示但不强制回滚 UI（让用户手动解决）。\n\n面试官追问：那库存扣减这种强一致性场景怎么处理？库存不能乐观更新——你让用户看到"还剩下 1 个"，点下去发现已经没了，比直接显示"已售罄"的体验更差。这种场景前端不要冒险，同步等后端返回结果。',
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
    answer: '排行榜这种功能看起来简单——就是一个排序的列表——但做到实时、公平、有体验，需要处理很多细节。\n\n我做过游戏活动的实时排行榜，支撑几千并发用户。先说数据结构：排行榜用 Redis 的 Sorted Set（ZADD），分数作为 score，用户 ID 作为 member，O(log n) 的插入和查询。前端拿到的是一个排好序的数组：[{ rank, userId, nickname, avatar, score }]。\n\n实时更新这块，排行榜用了 WebSocket 推送。但不是每秒全量推（一秒几千个用户，全量推带宽受不了）。我们用了增量推送——只推变化：某个用户的分数变了，推一条 { userId, newScore, newRank }，前端根据这条消息局部更新列表中对应行的分数和排名动画。对于非活跃用户来说，推送频率降低了 90% 以上。\n\n排名动画是个细节但有亮点的功能。用户排名变化的时候，条目的背景色和排名数字不是瞬间跳的，而是用 CSS transition 平滑过渡。排名上升的背景闪绿色、下降闪红色、维持不变不动。这个动画很简单但用户感知很强烈——感觉排行榜是"活的"。\n\n性能优化：排行榜只展示 Top 100，不管你后台有几万用户，前端只渲染 100 条。用户自己的排名如果不在 Top 100 内，就单独显示一行"你的排名：1,234 名"。虚拟列表在这种场景不太合适——因为排行榜不需要滚动加载更多，用户想看的就是 Top N。\n\n面试官追问：如果排名在同一秒内被多个人同时更新怎么保证公平？这是后端的问题，Redis Sorted Set 的 ZADD 本身是原子操作，服务端收到请求的顺序决定最终排名。前端只需要忠实地展示服务端返回的结果。不过有一个前端可以做的：在排名列表顶端加一个"榜单更新时间：X 秒前"的提示，让用户知道这不是实时的到毫秒级的排名——避免用户截图来说"我明明 100 分为什么显示 80 分"。',
    tags: ['排行榜', '虚拟列表', '实时更新', '动画', 'Redis'],
  },
  {
    id: 'res-24',
    title: '复杂数据表格与交互设计',
    category: 'resume',
    subCategory: '游戏 / 高互动',
    difficulty: 3,
    question: '你在企业后台中处理过「订单管理、权限控制、工单流转」等复杂交互。请以订单管理系统为例，阐述如何设计包含筛选、批量操作、行内编辑、导出等功能的复杂数据表格前端架构。',
    answer: '复杂数据表格我做过不少，AI 媒体平台的后台有个日志查询表格，支持排序、筛选、多选、批量操作、自定义列、行内编辑、固定列、导出。这些功能全堆在一个组件里，怎么保持性能和可维护性？我分享一下我的思路。\n\n架构上选择了 Headless 方案。不用成品表格组件（比如 Ant Design Table），因为它太"重"了，改样式、加自定义功能经常要翻源码。我选的是 TanStack Table（以前叫 React Table），它只处理表格的数据逻辑——排序、筛选、分页、选择——不渲染任何 UI。UI 层完全自己控制。数据和 UI 彻底解耦，要换样式只改 UI 层，要改排序逻辑只动 TanStack Table 的配置。\n\n性能方面的关键是虚拟化。表格可能有几千行几十列，全渲染浏览器扛不住。我用 @tanstack/react-virtual 做了行列双虚拟化，只渲染可视区域的行和列。渲染开销从 O(rows×cols) 降到了 O(visibleRows×visibleCols)，内存和 CPU 都下来了。\n\n列管理也做了不少功夫。用户可以从 30+ 个可用列中自定义勾选要显示哪些、拖拽调整列顺序、调整列宽。配置存在 localStorage 里，下次打开表单的时候列配置自动恢复——这个细节用户反馈特别好，"我昨天调的列今天还在"。\n\n批量操作是另一个重点。比如"删除选中的 50 条记录"，不能发 50 个请求。前端收集选中的 ID 列表，一次请求发给后端，后端批量处理。进度展示我用了一个简单的进度条轮询（因为批量操作通常很快，不需要 WebSocket），处理完成后刷新表格。\n\n导出功能要支持筛选后的数据导出，不只是当前页。用户筛选后的数据可能 500 条，前端当前页只显示 20 条——导出要导出全部 500 条。我的做法是告诉后端"导出当前筛选条件下全部数据"，后端直接生成 CSV 返回，不经过前端数据中转。\n\n面试官追问：行内编辑要做验证和回滚怎么处理？用 Optimistic Update 但保留 rollback 能力。用户编辑一个单元格后立即显示新值（乐观更新），同时发请求到后端。后端校验通过 → 更新本地缓存，后端校验失败 → 回滚到旧值 + toast 提示原因。这样既保证了操作的流畅感，又有数据安全。',
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
    answer: '前端测试这个话题，我觉得大多数团队做得不够好，要么不写测试，要么写一堆没有价值的测试。我分享一下我目前的测试策略。\n\n测试金字塔这个原则前端同样适用：底层大量单元测试，中间适量组件测试，顶层少量 E2E 测试。\n\n单元测试我主要测工具函数和自定义 Hooks。工具函数测试很简单，纯输入输出，写起来快跑起来也快。Hooks 测试稍微绕一点——得用 renderHook 来跑。比如 useWebSocket 这个 hook，我用 mock-socket 来模拟 WebSocket 连接，测它能不能正确连接、接收消息、重连、清理。Hooks 测试的问题是有些副作用（比如定时器）不好 mock，不过大部分场景 vitest 的 fake timers 能搞定。\n\n组件测试用 Vitest + @testing-library/react。我只测用户交互，不测组件内部实现细节。比如一个搜索框组件，我不会测"搜索框有没有调用 setSearchQuery"，我会测"用户输入关键词后，列表是否显示了筛选后的结果"。后者更贴近真实使用，而且内部实现改了测试不用改。\n\n快照测试我比较谨慎。它容易产生大量"更新快照就行"的提交，团队会慢慢忽略测试失败的信号。我只对图标、排版这类视觉要求极其稳定的组件用快照测试。\n\nE2E 测试用 Playwright，只覆盖核心用户路径。大概 10-20 个场景：登录 → 创建内容 → 编辑 → 发布；或者注册 → 首次引导 → 完成新手任务。E2E 不能太多，每条跑 30 秒，30 条就 15 分钟了，团队等不起。\n\n测试覆盖率是个双刃剑。公司要求 80% 覆盖率，但这个数字有时候会驱动错误行为——写一堆废测试只为覆盖率数字好看。我的原则是：80% 是底线但"有意义的覆盖"比"覆盖率数字"更值得追求。核心业务逻辑必须有测试，纯模板展示代码可以不强求。\n\n面试官追问：怎么保证测试不变成负担？三个经验：第一，CI 里测试必须跑得快，单测 30 秒内、组件测 2 分钟内、E2E 5 分钟内，慢了就会有人跳过；第二，测试失败信息必须清晰，不能搞一个 "expected true but got false"，要写清楚的 assertion message；第三，测试文件放在被测试代码旁边（colocated），不是独立的 tests 目录——离得近才会记得更新。',
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
    answer: '流式 AI Chat 这块我算是一线踩坑过来的，我直接把面试官通常追问的 10 个问题一次性讲清楚。\n\n第一个追问：为什么用 SSE 不用 WebSocket？我们项目最初确实考虑过 WebSocket，但实际跑下来发现对于 LLM 流式输出，SSE 更合适。LLM 是单向的——服务端生成 token，客户端接收。SSE 天然单向、走 HTTP 不需要额外的心跳协议、浏览器 EventSource 自动重连。WebSocket 更适合双向频繁交互，比如实时聊天室、协同编辑。不过 EventSource 有个坑：不支持 POST 和自定义 Header，所以生产环境我们是 fetch + ReadableStream 自己处理流。\n\n第二个追问：如何避免 UI 闪烁？AI 逐字吐 token，如果每接收一个 token 就重新渲染整个消息区，页面会抖得厉害。我们的做法用 rAF 做批量更新——一个动画帧内收集到的所有 token 合并渲染一次。长消息配合虚拟化。代码块的处理比较特殊：在代码块闭合之前显示普通文本（没有语法高亮），闭合后才一次性高亮。\n\n第三个追问：AI 的"思考过程"怎么展示？如果用的是支持 reasoning 的模型（比如 DeepSeek-R1），响应里会有一个 reasoning_content 字段。我们用一个折叠面板展示这个内容，默认折叠，不计入消息的 token 估算——因为思考内容不占上下文窗口。\n\n第四个追问：前端怎么估算 token 数？用的 js-tiktoken，但这包有 3.5MB，首屏加载白增加这么大体积不合理。我们做了动态 import 懒加载，同时搞了一个轻量 fallback：中文大概 1 个字 ≈ 1.5 token。后端每次响应也返回 usage 信息，前端缓存做用量显示。\n\n第五个追问：流断了怎么办？做了中断标记位，如果流断了 15 秒没收到新数据，显示"连接中断"，旁边放一个"继续生成"按钮。重连时把最后一条消息的 ID 传给后端，后端接着生成。超时时间是 15 秒，因为有些模型在处理复杂问题的时候确实会有几秒的静默期，太短了会误判。\n\n第六个追问：会话怎么存储和管理？用的 Zustand 做内存状态 + IndexedDB（Dexie.js 库）做持久化，最多缓存 50 个会话。多 Tab 之间用 BroadcastChannel 同步状态——但要注意 BroadcastChannel 只限同源，跨域同步得用 localStorage storage 事件（Safari 隐私模式还不可靠）。\n\n第七个追问：上下文窗口怎么管理？优先级是：system prompt > 最新 N 轮对话 > 摘要压缩 > 智能截断。截断必须在完整消息的边界上，不能截在半路。前端显示用量指示器。\n\n第八个追问：插件系统怎么设计？每个插件用 definePlugin 注册，定义 Function Calling 的 schema。AI 决定调用工具时，前端渲染对应 UI 卡片，有三种状态：pending、success、error。涉及敏感操作的调用需要用户手动确认。\n\n第九个追问：工具调用失败怎么办？我们区分为可重试和不可重试。可重试提供"重试"按钮，不可重试显示错误信息和建议。\n\n第十个追问：流式 tool_calls 怎么处理？AI 可能在一个流式响应中同时返回文本和工具调用，而且工具调用的 JSON 是分 chunk 来的。我们累积同一个 index 的 chunk 拼接 JSON，不断 try JSON.parse 判断是否完整——不完整就显示一个骨架 loading 状态，完整了就渲染工具卡片。',
    tags: ['AI Chat', 'SSE', '流式渲染', '架构设计', 'Function Calling'],
  },
  {
    id: 'res-27',
    title: '深度 Whisper 字幕系统（8 道追问版）',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 3,
    question: 'Whisper 字幕实时渲染与时间轴同步，含数据模型、编辑器、实时字幕。面试官 8 道追问预判。',
    answer: '字幕系统在这个项目里是我负责的最核心模块，写了几千行 Canvas 代码。面试官通常会追问这 8 个方向，我一次性讲清楚。\n\n第一个追问：word-level 还是 sentence-level？我们两样都支持。大部分场景用句子级，一个字幕块显示一句话就够了。但有些用户在学语言、需要看到"当前正在读哪个词"的高亮效果，所以我们针对短字幕（10 词以内）提供了逐词高亮模式。低 confidence 的词（<0.6）会用浅红色标注，提醒用户这个地方可能识别错了。\n\n第二个追问：多人说话怎么区分（Diarization）？Whisper 可以输出说话人标签。我们用 hash 算法把 speaker ID 映射到一个色板的颜色上，不同人说话的字幕用不同颜色标识。编辑器里用户可以重命名说话人（"Speaker 1" → "张三"），Canvas 上不同说话人的字幕块颜色不一样，一目了然。\n\n第三个追问：时间轴同步怎么做到不卡顿？视频播放每秒 60 帧，每帧都要找当前字幕。我们用二分查找 O(log n)——字幕数据按 start 时间排序后，二分定位到当前时间位置。rAF 回调里只做索引查找，不触发任何 DOM 变更。DOM 更新是预渲染 ±3 条——当用户播放到某位置时，周围 3 条字幕已经提前渲染好了，实际切换只改个 opacity。\n\n第四个追问：编辑器为什么用 Canvas 不用 DOM？一个 30 分钟视频可能有一千条字幕，DOM 的话每个字幕块一个 div，layout 开销扛不住。Canvas 可以精确控制渲染，还能做分层：底层网格、中层字幕块、顶层拖拽指示线，每层独立重绘。性能优化上做了虚拟化（只渲染可见区域）、分层重绘、缩略图导航。\n\n第五个追问：编辑器的交互功能有哪些？拖拽移动字幕块有吸附对齐，拖拽边界可调整时间范围，双击可编辑文本，选中后可合并或拆分。撤销/重做用 Command Pattern——不是为了炫技，是因为字幕编辑器操作类型很多（移动、调整边界、编辑文本、拆分合并），每种操作的 undo 逻辑都不一样，用 Command Pattern 最干净。\n\n第六个追问：导出格式支持哪些？纯前端导出，不依赖后端。SRT（最简单的字幕格式）、VTT（Web 标准，有头部元数据）、ASS（最复杂，有样式定义）。SRT 导出注意要加 BOM 前缀，很多播放器没有 BOM 会乱码。\n\n第七个追问：双语字幕怎么做的？原文和译文双行显示。翻译调用 GPT-4，逐条请求翻译，因为上下文字幕连起来翻译质量更高。翻译结果缓存到 IndexedDB——同一段视频不会重复翻译。GPT-4 的翻译质量确实比 Google Translate 好，特别是口语化内容和需要结合语境的翻译。\n\n第八个追问：实时字幕的延迟和修正机制？Whisper 处理延迟 2-5 秒是硬限制，无解。我们前端会标注"字幕有延迟约 3 秒"，并且维护 3-5 秒的 buffer 用于修正——因为后端的识别结果可能会更新（重新识别后 confidence 提高）。匹配靠 subtitle id，新的覆盖旧的。要追求更低延迟的话，可以用 tiny/base 模型 + faster-whisper 后端，延迟能降到 1 秒左右，但准确率会下降。',
    tags: ['Whisper', '字幕', '时间轴', 'Canvas', '双语字幕', '实时转写'],
  },
  {
    id: 'res-28',
    title: '深度 AI 辅助开发流程（7 道追问版）',
    category: 'resume',
    subCategory: 'AI 前端集成',
    difficulty: 2,
    question: 'AI 辅助前端开发完整流程：需求拆解、代码生成、Diff Review、测试、文档。面试官 7 道追问预判。',
    answer: 'AI 辅助开发这件事，我经过了大半年的实际使用，踩过不少坑，也总结了一套比较成熟的流程。\n\n整个流程我分成五个阶段，每个阶段 AI 参与程度不同：\n\n需求拆解阶段，AI 参与度大概三颗星。我把 PRD 丢给 AI，让它帮我拆成可执行的任务列表和估时。但它的估时经常离谱——把一个需要对接三个系统的功能估成"半天"，或者把一个纯 CRUD 估成"三天"。所以拆出来的结果必须人工确认优先级和工时。\n\n代码生成阶段，四颗星。这是 AI 最擅长的领域。脚手架代码、表单增删改查、样式排版、测试用例——有效率提升 60-80% 不夸张。但我现在很明确地知道哪些代码不让 AI 动：交互逻辑（拖拽、手势、动画）、安全逻辑（认证、鉴权）、性能关键路径（大量数据的渲染），这些交给人或者至少人做最终决策。\n\nDiff Review 阶段，两颗星。AI 能帮你检查命名规范、类型完整性、潜在空值，但它不懂业务逻辑和架构决策。我们团队的硬规则是：逐行人工 diff 审查，AI 生成的代码不能直接 approve。\n\n测试生成阶段，四颗星。给 AI 一个函数，它能自动生成覆盖常见边界情况的测试，连 mock 都帮你写好。但 E2E 测试的用户核心路径需要人设计，AI 不知道什么路径最重要。\n\n文档生成阶段，四颗星。README、组件文档、API 说明，AI 出初稿后我微调，效率真的高。\n\n然后是面试官常追问的 7 个问题：\n\n第一问：.cursorrules 怎么配？我的规则文件包含：技术栈声明、目录结构约定、代码规范、正确/错误示例对照、常用命令、禁止事项。关键是示例——抽象规则 AI 可能理解偏，给一个正确的和一个错误的例子它就能精准对齐。\n\n第二问：怎么防 AI 幻觉？五招：提供完整类型定义文件、锁死 package 版本不让它引用不存在的 API、要求先读文档再写代码、分层生成一次只生成一个模块立即验证、TypeScript + ESLint 自动检测。类型文件是最有效的——AI 知道数据结构长什么样，就不太可能捏造字段名。\n\n第三问：效率提升数据？我记录过：CRUD 类提升约 60%、组件库类约 75%、测试类约 80%。整体大概在 30-50% 之间。但我得说这个数据是同类任务对比的，不同复杂度差异很大。\n\n第四问：安全问题怎么防范？CI 加了 security lint 专项检查——innerHTML、eval、未授权 API 调用的模式匹配。认证鉴权、支付、数据脱敏相关的逻辑严禁 AI 直接输出，人工审查后再用。\n\n第五问：大项目怎么拆分给 AI？分治策略：按模块拆、定义好模块间的接口契约、每个模块提供 ARCHITECTURE.md 给 AI 当上下文。ARCHITECTURE.md 保持 2-3 页：概述 + 技术栈 + 目录树 + 数据流 + 模块说明 + 部署拓扑。\n\n第六问：什么场景禁止用 AI 生成代码？安全敏感的代码、性能关键路径、原创交互设计、复杂 Debug、法务合规相关。这些要么是 AI 能力不够，要么是风险不可控。\n\n第七问：怎么推广团队使用？不强制、靠案例说话。每周分享一个"这周 AI 帮我省了 X 小时"的真实故事。强调 AI 是加速器不是替代品。要求所有 AI 生成的代码在 PR 里加标注，方便追踪哪些是 AI 写的、质量如何。',
    tags: ['AI辅助开发', 'Codex', 'Claude Code', 'Code Review', 'cursorrules'],
  },
]
