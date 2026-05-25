import type { KnowledgePoint } from '../types'

export const nodejsData: KnowledgePoint[] = [
  {
    id: "node-01",
    title: "Node.js 事件循环与浏览器事件循环的区别",
    category: "nodejs",
    difficulty: 2,
    question: "Node.js 的事件循环和浏览器的事件循环有什么不同？",
    answer: "相同点：都是基于 libuv 的单线程 + 事件循环模型。\n\n不同点：\nNode.js 事件循环有 6 个阶段：\n1. timers：执行 setTimeout/setInterval 回调\n2. pending callbacks：执行延迟到下一轮的 I/O 回调\n3. idle, prepare：内部使用\n4. poll：获取新的 I/O 事件（会阻塞等待）\n5. check：执行 setImmediate 回调\n6. close callbacks：socket.close 等\n\n微任务：\n- process.nextTick：每个阶段结束后优先执行（比 Promise 还快）\n- Promise.then\n\n关键差异：\n- 浏览器有 requestAnimationFrame（渲染帧相关）\n- Node 有 process.nextTick 和 setImmediate\n- Node 没有 UI 渲染步骤",
    codeExample: "setTimeout(() => console.log('timeout'), 0)\nsetImmediate(() => console.log('immediate'))\nprocess.nextTick(() => console.log('nextTick'))\nPromise.resolve().then(() => console.log('promise'))\nconsole.log('sync')\n\n// 输出：sync → nextTick → promise → timeout/immediate",
    tags: ["Node.js", "事件循环", "libuv", "nextTick"],
  },
  {
    id: "node-02",
    title: "Koa2 洋葱模型与中间件原理",
    category: "nodejs",
    difficulty: 2,
    question: "请解释 Koa2 的洋葱模型和中间件机制。",
    answer: "洋葱模型：请求从外层中间件进入，逐层向内，到达核心后再逐层向外返回。\n\n中间件1 → 中间件2 → 中间件3\n  ↓                      ↓\n中间件1 ← 中间件2 ← 中间件3\n\n实现原理：\n- koa-compose 将中间件数组组合成一个大函数\n- 利用 async/await，next() 调用下一个中间件\n- next() 前后的代码分别对应请求和响应阶段\n\n应用：\n- 日志记录（外层，包裹请求/响应）\n- 错误处理（最外层 try/catch）\n- 权限校验（内层，next 前拦截）\n- 响应处理（next 后处理）",
    codeExample: "// Koa 中间件洋葱模型\napp.use(async (ctx, next) => {\n  console.log('1. 进入中间件1')\n  await next()  // 洋葱芯\n  console.log('4. 离开中间件1')\n})\n\napp.use(async (ctx, next) => {\n  console.log('2. 进入中间件2')\n  await next()\n  console.log('3. 离开中间件2')\n  ctx.body = 'Hello'\n})\n\n// 请求输出：\n// 1. 进入中间件1\n// 2. 进入中间件2\n// 3. 离开中间件2\n// 4. 离开中间件1",
    tags: ["Koa2", "中间件", "洋葱模型"],
  }
]
