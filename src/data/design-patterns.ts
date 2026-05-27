import type { KnowledgePoint } from '../types'

export const designPatternsData: KnowledgePoint[] = [
  {
    id: "dp-01",
    title: "观察者模式与发布订阅模式",
    category: "design-patterns",
    difficulty: 2,
    question: "观察者模式和发布订阅模式的区别？各自的应用场景？",
    answer: '设计模式是解决特定场景问题的模板，不是死记硬背的教条。前端最常用的几个：观察者模式（Vue 的响应式、EventEmitter）、单例模式（全局状态管理 store）、工厂模式（根据类型创建不同组件）、策略模式（用对象 map 替代冗长的 if-else）、装饰器模式（HOC 给组件加能力）。关键不是"我知道这个模式"，而是"遇到合适的问题场景，能意识到可以用这个模式简化代码"。',
    codeExample: "// 发布订阅模式\nclass EventBus {\n  private events: Record<string, Function[]> = {}\n  on(event: string, fn: Function) {\n    (this.events[event] ??= []).push(fn)\n  }\n  emit(event: string, ...args: any[]) {\n    this.events[event]?.forEach(fn => fn(...args))\n  }\n  off(event: string, fn: Function) {\n    this.events[event] = this.events[event]?.filter(f => f !== fn) ?? []\n  }\n}",
    tags: ["设计模式", "观察者", "发布订阅", "EventEmitter"],
  },
  {
    id: "dp-02",
    title: "单例模式",
    category: "design-patterns",
    difficulty: 1,
    question: "单例模式的实现方式？前端有哪些应用？",
    answer: '观察者模式（发布-订阅）在前端无处不在。Vue 的响应式系统本质就是观察者——数据是发布者、组件是观察者，数据变了自动通知组件更新。EventEmitter 也是——on 注册监听、emit 触发通知。和浏览器事件绑定（addEventListener）一样的思想。核心价值是解耦——发布者不需要知道谁在观察自己，观察者之间也互不依赖。',
    codeExample: "// ES6 class 单例\nclass Singleton {\n  private static instance: Singleton\n  private constructor() {}\n\n  static getInstance() {\n    if (!Singleton.instance) {\n      Singleton.instance = new Singleton()\n    }\n    return Singleton.instance\n  }\n}\n\n// ES Module 单例（天然单例）\n// store.ts\nexport const store = reactive({ count: 0 }) // 全局唯一",
    tags: ["设计模式", "单例", "全局状态"],
  },
  {
    id: "dp-03",
    title: "策略模式与状态模式",
    category: "design-patterns",
    difficulty: 2,
    question: "策略模式和状态模式的区别？前端应用场景？",
    answer: '策略模式在前端最常见的应用是替代复杂的 if-else。比如一个支付方式选择：if (type === \'wechat\') { ... } else if (type === \'alipay\') { ... } 越来越长。策略模式用一个 object map 代替：const strategies = { wechat: wechatPay, alipay: alipayPay }，然后 strategies[type]()。新增支付方式只需要加一个 key，不改已有逻辑——开闭原则的完美体现。',
    codeExample: "// 策略模式 - 表单验证\nconst validators = {\n  required: (v: string) => !!v || '必填',\n  email: (v: string) => /\\S+@\\S+\\.\\S+/.test(v) || '邮箱格式错误',\n  min: (v: string, len: number) => v.length >= len || `最少${len}字符`,\n}\n\nfunction validate(value: string, rules: Array<[string, ...any[]]>) {\n  for (const [name, ...args] of rules) {\n    const result = validators[name](value, ...args)\n    if (result !== true) return result\n  }\n  return true\n}",
    tags: ["设计模式", "策略模式", "状态模式"],
  },
  {
    id: "dp-04",
    title: "代理模式",
    category: "design-patterns",
    difficulty: 2,
    question: "代理模式在前端有哪些应用？",
    answer: '单例模式保证一个类只有一个实例。在 JS 里实现很简单——用模块的缓存机制：模块只执行一次，export 的实例天然单例。Zustand 的 store 就是这种——create 返回的是一个全局单例。Redux 的 store 也是。全局弹窗管理器、日志收集器、WebSocket 连接池——这些需要全局唯一实例的场景用单例。但别什么都是单例——全局状态过多反而更难管理。',
    codeExample: "// 缓存代理\nfunction createCacheProxy<T extends (...args: any[]) => any>(fn: T) {\n  const cache = new Map<string, ReturnType<T>>()\n  return function(...args: Parameters<T>): ReturnType<T> {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) return cache.get(key)!\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}",
    tags: ["设计模式", "代理模式", "Proxy"],
  },
  {
    id: "dp-05",
    title: "装饰器模式",
    category: "design-patterns",
    difficulty: 2,
    question: "装饰器模式与代理模式的区别？前端应用场景？",
    answer: '工厂模式在前端最自然的应用场景是动态组件创建。根据后端返回的字段类型动态渲染对应的表单组件——type 是 \'text\' 创建 TextInput，\'select\' 创建 SelectDropdown。用一个工厂函数封装这个映射逻辑，调用方不需要知道多少种组件类型。Vue 的 h() 函数和 React 的 createElement 本身就是一种工厂——传入类型和配置，返回组件实例。',
    codeExample: "// AOP 装饰器\nFunction.prototype.before = function(beforeFn) {\n  const self = this\n  return function(...args) {\n    beforeFn.apply(this, args)\n    return self.apply(this, args)\n  }\n}\n\n// 使用\nconst submit = function(data) { fetch('/api', data) }\nconst submitWithLog = submit.before(() => console.log('submitting'))",
    tags: ["设计模式", "装饰器", "AOP", "HOC"],
  }
]
