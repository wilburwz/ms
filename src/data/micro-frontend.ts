import type { KnowledgePoint } from '../types'

export const microFrontendData: KnowledgePoint[] = [
  {
    id: "mf-01",
    title: "微前端架构解决的问题与核心价值",
    category: "micro-frontend",
    difficulty: 2,
    question: "微前端架构解决什么问题？与传统单体前端相比有什么价值？",
    answer: "解决的问题：\n- 多团队并行开发，技术栈不统一\n- 大型应用构建慢、部署耦合\n- 增量升级困难（如 Vue2→Vue3）\n- 团队规模膨胀导致的协作成本\n\n核心价值：\n1. 独立部署：子应用可独立发布\n2. 技术栈无关：不同子应用可用不同框架\n3. 增量升级：逐步替换旧模块\n4. 团队自治：各团队独立开发\n5. 隔离性：运行时互不影响\n\n代价：\n- 架构复杂度增加\n- 性能开销（资源加载）\n- 样式/JS 隔离挑战",
    tags: ["微前端", "架构", "qiankun"],
  },
  {
    id: "mf-02",
    title: "qiankun 核心原理",
    category: "micro-frontend",
    difficulty: 3,
    question: "qiankun 是如何实现子应用加载和沙箱隔离的？",
    answer: "qiankun 基于 Single-SPA，提供了开箱即用的能力。\n\n子应用加载流程：\n1. registerMicroApps 注册子应用\n2. 路由匹配 → 加载 HTML 入口\n3. 解析 HTML → 提取 JS/CSS\n4. 执行 JS（沙箱中）\n5. 挂载到容器 DOM\n\nJS 沙箱：\n- SnapshotSandbox：快照沙箱，激活时恢复快照，失活时记录变更（单实例）\n- ProxySandbox：多实例沙箱，每个子应用有独立 fakeWindow\n- LegacySandbox：单实例 Proxy 沙箱\n\nCSS 隔离：\n- Shadow DOM（strictStyleIsolation）\n- 添加命名空间前缀（experimentalStyleIsolation）",
    codeExample: "// qiankun 注册子应用\nimport { registerMicroApps, start } from 'qiankun'\n\nregisterMicroApps([{\n  name: 'app1',\n  entry: '//localhost:7101',\n  container: '#sub-viewport',\n  activeRule: '/app1',\n  props: { data: sharedData }\n}])\n\nstart({ sandbox: { experimentalStyleIsolation: true } })",
    tags: ["qiankun", "微前端", "沙箱", "Single-SPA"],
  }
]
