import type { KnowledgePoint } from '../types'

export const microFrontendData: KnowledgePoint[] = [
  {
    id: "mf-01",
    title: "微前端架构解决的问题与核心价值",
    category: "micro-frontend",
    difficulty: 2,
    question: "微前端架构解决什么问题？与传统单体前端相比有什么价值？",
    answer: '微前端是把一个大的前端应用拆成多个独立的小应用，各自独立开发、独立部署、独立技术栈，但在用户看来是一个完整的应用。适合场景：多个团队并行开发、老系统渐进式升级（新功能用新技术栈，老功能保持不动）、大型后台系统功能模块间确实独立。方案：qiankun（基于 single-spa，阿里出品）、Module Federation（Webpack 5 原生支持）。',
    tags: ["微前端", "架构", "qiankun"],
  },
  {
    id: "mf-02",
    title: "qiankun 核心原理",
    category: "micro-frontend",
    difficulty: 3,
    question: "qiankun 是如何实现子应用加载和沙箱隔离的？",
    answer: '微前端的核心挑战：CSS 隔离（不同子应用的样式互相污染——用 CSS Modules 或 Shadow DOM 解决）、JS 隔离（全局变量冲突——用沙箱机制）、应用间通信（通过自定义事件或共享状态库）、公共依赖（react、vue 这种大库多个子应用都引用，白增加体积——external 共享）、路由协同（多个子应用的 routing 怎么拼成完整路由）。',
    codeExample: "// qiankun 注册子应用\nimport { registerMicroApps, start } from 'qiankun'\n\nregisterMicroApps([{\n  name: 'app1',\n  entry: '//localhost:7101',\n  container: '#sub-viewport',\n  activeRule: '/app1',\n  props: { data: sharedData }\n}])\n\nstart({ sandbox: { experimentalStyleIsolation: true } })",
    tags: ["qiankun", "微前端", "沙箱", "Single-SPA"],
  }
]
