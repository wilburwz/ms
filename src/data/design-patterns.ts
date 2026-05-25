import type { KnowledgePoint } from '../types'

export const designPatternsData: KnowledgePoint[] = [
  {
    id: "dp-01",
    title: "观察者模式与发布订阅模式",
    category: "design-patterns",
    difficulty: 2,
    question: "观察者模式和发布订阅模式的区别？各自的应用场景？",
    answer: "观察者模式：\n- Subject 直接通知 Observer\n- 两者直接关联\n- Vue 响应式系统（dep.notify → watcher.update）\n\n发布订阅模式：\n- 通过 Event Channel (调度中心) 解耦\n- 发布者和订阅者互不知道对方\n- EventEmitter, mitt, Vue 全局事件\n\n区别核心：\n- 观察者：Subject ↔ Observer（双向）\n- 发布订阅：Publisher ↔ Channel ↔ Subscriber（完全解耦）\n\n前端应用：\n- Vue 响应式：观察者模式\n- EventEmitter/mitt：发布订阅\n- Redux：发布订阅（subscribe + dispatch）\n- DOM 事件：发布订阅",
    codeExample: "// 发布订阅模式\nclass EventBus {\n  private events: Record<string, Function[]> = {}\n  on(event: string, fn: Function) {\n    (this.events[event] ??= []).push(fn)\n  }\n  emit(event: string, ...args: any[]) {\n    this.events[event]?.forEach(fn => fn(...args))\n  }\n  off(event: string, fn: Function) {\n    this.events[event] = this.events[event]?.filter(f => f !== fn) ?? []\n  }\n}",
    tags: ["设计模式", "观察者", "发布订阅", "EventEmitter"],
  },
  {
    id: "dp-02",
    title: "单例模式",
    category: "design-patterns",
    difficulty: 1,
    question: "单例模式的实现方式？前端有哪些应用？",
    answer: "定义：保证一个类只有一个实例，并提供全局访问点。\n\nJS 实现方式：\n1. 闭包 + 立即执行\n2. ES6 class + static\n3. 模块单例（ES Module 本身就是单例）\n\n前端应用：\n- 全局状态管理（Vuex/Pinia Store）\n- 全局弹窗管理\n- WebSocket 连接\n- 缓存管理\n- 日志记录器\n\n注意事项：\n- 线程安全（JS 单线程不需要考虑）\n- 测试时需要能重置实例\n- 滥用会导致全局状态混乱",
    codeExample: "// ES6 class 单例\nclass Singleton {\n  private static instance: Singleton\n  private constructor() {}\n\n  static getInstance() {\n    if (!Singleton.instance) {\n      Singleton.instance = new Singleton()\n    }\n    return Singleton.instance\n  }\n}\n\n// ES Module 单例（天然单例）\n// store.ts\nexport const store = reactive({ count: 0 }) // 全局唯一",
    tags: ["设计模式", "单例", "全局状态"],
  },
  {
    id: "dp-03",
    title: "策略模式与状态模式",
    category: "design-patterns",
    difficulty: 2,
    question: "策略模式和状态模式的区别？前端应用场景？",
    answer: "策略模式：\n- 定义一系列算法，封装起来，可互换\n- 消除大量 if-else/switch\n- 算法独立变化\n\n状态模式：\n- 对象行为随状态变化\n- 状态切换改变行为\n- 状态之间可以转换\n\n区别：\n- 策略模式：客户端选择策略\n- 状态模式：状态自动转换\n\n前端应用：\n- 策略模式：表单验证规则、权限校验、排序策略\n- 状态模式：订单状态、有限状态机（XState）、红绿灯",
    codeExample: "// 策略模式 - 表单验证\nconst validators = {\n  required: (v: string) => !!v || '必填',\n  email: (v: string) => /\\S+@\\S+\\.\\S+/.test(v) || '邮箱格式错误',\n  min: (v: string, len: number) => v.length >= len || `最少${len}字符`,\n}\n\nfunction validate(value: string, rules: Array<[string, ...any[]]>) {\n  for (const [name, ...args] of rules) {\n    const result = validators[name](value, ...args)\n    if (result !== true) return result\n  }\n  return true\n}",
    tags: ["设计模式", "策略模式", "状态模式"],
  },
  {
    id: "dp-04",
    title: "代理模式",
    category: "design-patterns",
    difficulty: 2,
    question: "代理模式在前端有哪些应用？",
    answer: "代理模式：为对象提供替代品/占位符，控制对原对象的访问。\n\n前端应用：\n1. Vue 3 响应式：Proxy 拦截 get/set\n2. 图片懒加载：虚拟图片代理真实图片\n3. 请求缓存代理：缓存接口结果\n4. 防抖/节流：函数代理控制调用频率\n5. 虚拟代理：延迟加载大对象\n6. 保护代理：权限控制\n\nProxy vs Object.defineProperty：\n- Proxy 更强大（13 种拦截）\n- Proxy 可以代理整个对象\n- Object.defineProperty 需要逐属性劫持",
    codeExample: "// 缓存代理\nfunction createCacheProxy<T extends (...args: any[]) => any>(fn: T) {\n  const cache = new Map<string, ReturnType<T>>()\n  return function(...args: Parameters<T>): ReturnType<T> {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) return cache.get(key)!\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}",
    tags: ["设计模式", "代理模式", "Proxy"],
  },
  {
    id: "dp-05",
    title: "装饰器模式",
    category: "design-patterns",
    difficulty: 2,
    question: "装饰器模式与代理模式的区别？前端应用场景？",
    answer: "装饰器模式：动态给对象添加额外职责，而不改变其结构。\n\n与代理模式区别：\n- 代理模式：控制访问，和原对象实现同一接口\n- 装饰器模式：增强功能，可层层叠加\n- 代理模式注重控制，装饰器注重扩展\n\n前端应用：\n1. TypeScript 装饰器（@log, @timer）\n2. React HOC（@withRouter）\n3. AOP（面向切面编程）：before/after 增强\n4. 中间件模式（Koa, Express）\n5. 拦截器（Axios interceptors）",
    codeExample: "// AOP 装饰器\nFunction.prototype.before = function(beforeFn) {\n  const self = this\n  return function(...args) {\n    beforeFn.apply(this, args)\n    return self.apply(this, args)\n  }\n}\n\n// 使用\nconst submit = function(data) { fetch('/api', data) }\nconst submitWithLog = submit.before(() => console.log('submitting'))",
    tags: ["设计模式", "装饰器", "AOP", "HOC"],
  }
]
