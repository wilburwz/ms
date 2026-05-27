import type { KnowledgePoint } from '../types'

export const nodejsData: KnowledgePoint[] = [
  {
    id: "node-01",
    title: "Node.js 事件循环与浏览器事件循环的区别",
    category: "nodejs",
    difficulty: 2,
    question: "Node.js 的事件循环和浏览器的事件循环有什么不同？",
    answer: 'Node.js 事件循环分六个阶段：timers（执行 setTimeout/setInterval 回调）、pending callbacks（执行延迟到下一轮的 I/O 回调）、idle/prepare（内部使用）、poll（获取新的 I/O 事件，主要停留阶段）、check（执行 setImmediate 回调）、close callbacks（关闭连接的回调）。process.nextTick 不在任何阶段——它在每个阶段结束时插队执行，优先级比 Promise 还高。',
    codeExample: "setTimeout(() => console.log('timeout'), 0)\nsetImmediate(() => console.log('immediate'))\nprocess.nextTick(() => console.log('nextTick'))\nPromise.resolve().then(() => console.log('promise'))\nconsole.log('sync')\n\n// 输出：sync → nextTick → promise → timeout/immediate",
    tags: ["Node.js", "事件循环", "libuv", "nextTick"],
  },
  {
    id: "node-02",
    title: "Koa2 洋葱模型与中间件原理",
    category: "nodejs",
    difficulty: 2,
    question: "请解释 Koa2 的洋葱模型和中间件机制。",
    answer: 'Express/Koa/NestJS 是 Node 生态的三个梯队。Express 最老最稳定——中间件式开发，生态最丰富但架构自由度高（容易写出烂代码）。Koa 是 Express 团队重写的——用 async/await 代替回调，更现代但没有内置路由。NestJS 是企业级框架——用 TypeScript + 装饰器 + 依赖注入，结构清晰适合大型项目。选型：小项目 Express，中项目 Koa，企业级或需要强架构约束的用 NestJS。',
    codeExample: "// Koa 中间件洋葱模型\napp.use(async (ctx, next) => {\n  console.log('1. 进入中间件1')\n  await next()  // 洋葱芯\n  console.log('4. 离开中间件1')\n})\n\napp.use(async (ctx, next) => {\n  console.log('2. 进入中间件2')\n  await next()\n  console.log('3. 离开中间件2')\n  ctx.body = 'Hello'\n})\n\n// 请求输出：\n// 1. 进入中间件1\n// 2. 进入中间件2\n// 3. 离开中间件2\n// 4. 离开中间件1",
    tags: ["Koa2", "中间件", "洋葱模型"],
  }
]
