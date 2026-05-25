import type { KnowledgePoint } from '../types'

export const softSkillsData: KnowledgePoint[] = [
  {
    id: "sw-01",
    title: "如何推动前端架构升级？",
    category: "soft-skills",
    difficulty: 2,
    question: "如果你要推动团队从 Vue 2 升级到 Vue 3 + TypeScript，你会怎么做？",
    answer: "架构升级策略：\n\n1. 技术调研：评估收益、风险、工作量\n2. POC 验证：选一个非核心模块试点\n3. 方案设计：\n   - 渐进式升级 vs 重写\n   - 兼容策略（Vue 2/3 共存方案）\n   - 组件库、工具链的对应升级方案\n4. 文档规范：编写升级指南、迁移文档\n5. 培训赋能：团队分享、结对编程\n6. 分步实施：\n   - 第一阶段：环境准备（Vite、TS 配置）\n   - 第二阶段：非核心模块迁移\n   - 第三阶段：核心模块迁移\n7. 监控回滚：灰度发布、错误监控、快速回滚\n\n关键技术点：\n- 组件兼容层（@vue/compat）\n- Pinia 替代 Vuex\n- Element Plus 替代 Element UI\n- 渐进式迁移工具 (gogocode)",
    tags: ["架构升级", "迁移", "Vue3", "团队协作"],
  },
  {
    id: "sw-02",
    title: "Code Review 最佳实践",
    category: "soft-skills",
    difficulty: 1,
    question: "高效的 Code Review 应该关注哪些方面？",
    answer: "Review 关注点（按优先级）：\n\n1. 正确性：逻辑是否正确、边界情况是否处理\n2. 安全性：有无安全漏洞（XSS、注入、权限）\n3. 性能：是否有明显性能问题\n4. 可维护性：命名清晰、函数单一职责、耦合度\n5. 一致性：是否遵循项目规范、风格一致\n6. 测试：是否有足够的测试覆盖\n\n高效 Review 技巧：\n- 一次 Review 不超过 400 行（效率最佳）\n- 使用自动化工具（ESLint/Prettier）减少机械检查\n- 明确问题等级（阻断/P2/建议）\n- 提出问题同时给出建议方案\n- 正向反馈（不要只挑毛病）\n- 小步提交，频繁 Review\n\n自动化 Check：\n- ESLint + Prettier（代码风格）\n- TypeScript 类型检查\n- 单元测试 + 覆盖率门槛\n- Bundle Size 检查",
    tags: ["Code Review", "规范", "质量", "自动化"],
  },
  {
    id: "sw-03",
    title: "技术选型的考量维度",
    category: "soft-skills",
    difficulty: 2,
    question: "做技术选型时，你会从哪些维度考量？",
    answer: "技术选型维度：\n\n1. 业务适配：技术是否解决业务核心问题\n2. 团队能力：团队是否有相关经验，学习成本\n3. 社区生态：Star 数、Issue 响应、更新频率、插件生态\n4. 性能：Bundle Size、运行时性能\n5. 维护性：长期维护风险（大公司 vs 个人项目）\n6. 兼容性：目标浏览器/设备支持\n7. 许可证：开源协议是否商业友好\n8. 文档质量：官方文档是否完善\n\n决策框架：\n- 写技术方案（对比分析 + 推荐方案）\n- 团队讨论评审\n- POC 验证关键风险点\n- 记录决策（ADR - Architecture Decision Record）\n\n常见选型示例：\n- 状态管理：Pinia vs Vuex vs 自研\n- 构建工具：Vite vs Webpack vs Turbopack\n- UI 库：Element Plus vs Naive UI vs Ant Design",
    tags: ["技术选型", "架构决策", "ADR"],
  },
{
    id: "ss-04",
    title: "前端项目架构设计",
    category: "soft-skills",
    difficulty: 2,
    question: "大型前端项目如何组织目录结构和划分组件？",
    answer: "目录结构原则：\n- 按功能/领域划分（而非按文件类型）\n- 关注点分离\n- 就近原则（相关文件放一起）\n\n推荐结构：\n```\nsrc/\n├── pages/          # 页面组件\n├── components/     # 通用组件\n├── hooks/          # 自定义 Hooks\n├── stores/         # 状态管理\n├── api/            # 接口层\n├── utils/          # 工具函数\n├── types/          # 类型定义\n├── styles/         # 全局样式\n└── router/         # 路由配置\n```\n\n组件划分：\n- 原子组件：Button, Input, Icon\n- 复合组件：Form, Table, Dialog\n- 业务组件：UserCard, OrderList\n- 页面组件：UserPage, OrderPage\n\n分层架构：\n- 展示层（UI Components）\n- 业务逻辑层（Hooks/Services）\n- 数据层（Stores/API）\n- 基础设施层（Utils/Types）",
    tags: ["软技能", "架构", "目录结构", "组件"],
  },
  {
    id: "ss-05",
    title: "前端错误监控方案",
    category: "soft-skills",
    difficulty: 2,
    question: "如何在前端项目中实现错误监控和上报？",
    answer: "错误类型：\n- JS 运行时错误：window.onerror / addEventListener('error')\n- Promise 错误：unhandledrejection\n- 资源加载错误：addEventListener('error', cb, true)（捕获阶段）\n- 接口错误：Axios 响应拦截器\n- 框架错误：Vue errorHandler / React ErrorBoundary\n\n监控信息：\n- 错误信息（message, stack）\n- 用户行为（点击、输入、路由）\n- 环境信息（浏览器、OS、分辨率）\n- 错误级别（error, warning, info）\n\n上报策略：\n- 抽样上报（流量太大时）\n- 去重（相同错误合并）\n- 节流（避免密集上报）\n- 离线缓存（localStorage + Navigator.sendBeacon）\n\n常用工具：\n- Sentry（最流行）\n- Fundebug\n- Bad.js（轻量）\n- 自建：Elasticsearch + Kibana",
    codeExample: "// 全局错误捕获\nwindow.addEventListener('error', (e) => {\n  reportError({ type: 'js', message: e.message, stack: e.error?.stack })\n}, true)\n\nwindow.addEventListener('unhandledrejection', (e) => {\n  reportError({ type: 'promise', message: e.reason?.message })\n})\n\n// Vue 错误处理\napp.config.errorHandler = (err, vm, info) => {\n  reportError({ type: 'vue', message: err.message, info })\n}",
    tags: ["软技能", "错误监控", "Sentry", "上报"],
  },
  {
    id: "ss-06",
    title: "前端代码规范与最佳实践",
    category: "soft-skills",
    difficulty: 1,
    question: "前端项目中如何保证代码规范和代码质量？",
    answer: "代码规范：\n- ESLint：JS/TS 代码检查\n- Prettier：代码格式化\n- Stylelint：CSS/SCSS 检查\n- commitlint：commit 信息规范\n\n自动化：\n- Husky：Git hooks 管理\n- lint-staged：只检查暂存文件\n- CI 中运行 lint + test\n\nGit 规范：\n- Conventional Commits（feat/fix/docs等）\n- 分支策略（主干开发/feature 分支）\n- PR + Code Review\n\n命名规范：\n- 变量/函数：camelCase\n- 类/组件：PascalCase\n- 常量：UPPER_SNAKE_CASE\n- 文件：kebab-case 或 PascalCase\n- CSS：BEM 命名法\n\n质量保障：\n- TypeScript 严格模式\n- 单元测试（Vitest/Jest）\n- E2E 测试（Playwright/Cypress）\n- 代码覆盖率（80%+）",
    tags: ["软技能", "代码规范", "ESLint", "Prettier", "Git"],
  }
]
