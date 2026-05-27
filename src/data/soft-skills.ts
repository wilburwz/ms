import type { KnowledgePoint } from '../types'

export const softSkillsData: KnowledgePoint[] = [
  {
    id: "sw-01",
    title: "如何推动前端架构升级？",
    category: "soft-skills",
    difficulty: 2,
    question: "如果你要推动团队从 Vue 2 升级到 Vue 3 + TypeScript，你会怎么做？",
    answer: 'Code Review 我现在的习惯是分层次看。第一遍看逻辑——有没有明显的 bug、边界情况处理了没有。第二遍看设计——这个组件的职责划清楚了没有、和已有代码的风格一致不一致。第三遍看性能——有没有不必要的渲染、有没有可以并行的异步操作。Review 的语气上我尽量用提问而非指责——"这里如果传 null 会怎样？"比"你忘了处理 null"让人更愿意接受。Review 不是找茬，是团队共同保障质量。',
    tags: ["架构升级", "迁移", "Vue3", "团队协作"],
  },
  {
    id: "sw-02",
    title: "Code Review 最佳实践",
    category: "soft-skills",
    difficulty: 1,
    question: "高效的 Code Review 应该关注哪些方面？",
    answer: '技术方案评审我一般从几个角度切入：这个方案满足需求了吗？有更简单的方案吗？扩展性够不够——未来需求变化好改吗？性能瓶颈在哪里？团队能力覆盖吗——用的是大家能维护的技术吗？文档写清楚了没——新人能不能看着文档就上手？方案评审不是比谁技术更酷，是比谁的方案在当前约束下最优。',
    tags: ["Code Review", "规范", "质量", "自动化"],
  },
  {
    id: "sw-03",
    title: "技术选型的考量维度",
    category: "soft-skills",
    difficulty: 2,
    question: "做技术选型时，你会从哪些维度考量？",
    answer: '跨部门沟通我踩过最大的坑是"技术语言"和"业务语言"的鸿沟。跟产品经理说"这个接口延迟在 P99 超过 500ms"，他听不懂。改成"这个页面有时候会卡半秒，用户体验不好，我们用缓存优化保证流畅"，他理解了。核心是翻译——把技术指标翻译成业务影响。还有就是降低对方的认知成本——不要丢一个技术方案让他们选，而是给 2-3 个选项并附上各自的 trade-off 和我的推荐。',
    tags: ["技术选型", "架构决策", "ADR"],
  },
{
    id: "ss-04",
    title: "前端项目架构设计",
    category: "soft-skills",
    difficulty: 2,
    question: "大型前端项目如何组织目录结构和划分组件？",
    answer: '时间管理对前端工程师来说挺难——经常被各种插入需求打断。我的做法是：上午 2-3 小时深度工作时间（关掉通知），下午处理回复消息、Code Review、小需求。遇到紧急 bug 没办法只能打断，但紧急 bug 的定义是"线上事故影响用户"，不是"产品经理说很急"。任务管理用看板工具——所有任务可视化，自己和同事都能看到进度。',
    tags: ["软技能", "架构", "目录结构", "组件"],
  },
  {
    id: "ss-05",
    title: "前端错误监控方案",
    category: "soft-skills",
    difficulty: 2,
    question: "如何在前端项目中实现错误监控和上报？",
    answer: '带新人的经验：第一阶段让 ta 改 bug 和写测试用例——熟悉代码库的最快方式。第二阶段给独立的小功能——完整的从需求到上线的流程体验一遍。第三阶段让 ta 参与技术方案评审——从"怎么实现"到"为什么这么设计"的思维升级。最忌讳的做法是把新人丢到没人管的角落里自生自灭。定期 1-on-1 聊的不是进度而是困惑和成长方向。',
    codeExample: "// 全局错误捕获\nwindow.addEventListener('error', (e) => {\n  reportError({ type: 'js', message: e.message, stack: e.error?.stack })\n}, true)\n\nwindow.addEventListener('unhandledrejection', (e) => {\n  reportError({ type: 'promise', message: e.reason?.message })\n})\n\n// Vue 错误处理\napp.config.errorHandler = (err, vm, info) => {\n  reportError({ type: 'vue', message: err.message, info })\n}",
    tags: ["软技能", "错误监控", "Sentry", "上报"],
  },
  {
    id: "ss-06",
    title: "前端代码规范与最佳实践",
    category: "soft-skills",
    difficulty: 1,
    question: "前端项目中如何保证代码规范和代码质量？",
    answer: '技术债务管理最重要的是"承认它存在且把它可视化"。我们在 JIRA 里有一个专门的 tech debt backlog，每个季度会安排 20% 的时间专项清理。优先级排序：影响线上稳定性的优先、拖慢开发效率的其次、只是"不好看"的最后。还有就是遵循"童子军规则"——改过的代码应该比原来更干净。每次改一个老模块顺手修一个小 tech debt，积少成多。',
    tags: ["软技能", "代码规范", "ESLint", "Prettier", "Git"],
  }
]
