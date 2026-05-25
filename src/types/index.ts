export interface KnowledgePoint {
  id: string
  title: string
  category: string
  subCategory?: string
  difficulty: 1 | 2 | 3 // 1=初级 2=中级 3=高级
  question: string
  answer: string
  codeExample?: string
  tags: string[]
  relatedIds?: string[]
}

export interface CategoryItem {
  id: string
  name: string
  icon: string
  count: number
}

export interface QuizRecord {
  pointId: string
  correct: boolean
  timestamp: number
}

export const DIFFICULTY_MAP: Record<number, string> = {
  1: '初级',
  2: '中级',
  3: '高级'
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'html-css', name: 'HTML5 / CSS3', icon: '🎨', count: 0 },
  { id: 'javascript', name: 'JavaScript 核心', icon: '📜', count: 0 },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', count: 0 },
  { id: 'vue', name: 'Vue 生态', icon: '💚', count: 0 },
  { id: 'react', name: 'React 生态', icon: '⚛️', count: 0 },
  { id: 'engineering', name: '前端工程化', icon: '🏗️', count: 0 },
  { id: 'micro-frontend', name: '微前端', icon: '🧩', count: 0 },
  { id: 'visualization', name: '数据可视化', icon: '📊', count: 0 },
  { id: 'network', name: '网络与通信', icon: '🌐', count: 0 },
  { id: 'performance', name: '性能优化', icon: '⚡', count: 0 },
  { id: 'ai-frontend', name: 'AI 前端应用', icon: '🤖', count: 0 },
  { id: 'ai-engineering', name: 'AI 工程 / LLM', icon: '🧠', count: 0 },
  { id: 'live-streaming', name: '直播技术', icon: '📡', count: 0 },
  { id: 'nodejs', name: 'Node.js 服务端', icon: '🟢', count: 0 },
  { id: 'security', name: '安全', icon: '🔒', count: 0 },
  { id: 'design-patterns', name: '设计模式', icon: '📐', count: 0 },
  { id: 'algorithm', name: '算法与数据结构', icon: '🧮', count: 0 },
  { id: 'mobile', name: '移动端 / 跨端', icon: '📱', count: 0 },
  { id: 'browser', name: '浏览器原理', icon: '🧠', count: 0 },
  { id: 'integration', name: '三方集成', icon: '🔌', count: 0 },
  { id: 'soft-skills', name: '通用软技能', icon: '💡', count: 0 }
]
