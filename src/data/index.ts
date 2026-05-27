import type { KnowledgePoint, CategoryItem } from '../types'
import { CATEGORIES } from '../types'
import { htmlCssData } from './html-css'
import { javascriptData } from './javascript'
import { typescriptData } from './typescript'
import { vueData } from './vue'
import { reactData } from './react'
import { engineeringData } from './engineering'
import { microFrontendData } from './micro-frontend'
import { visualizationData } from './visualization'
import { networkData } from './network'
import { performanceData } from './performance'
import { aiFrontendData } from './ai-frontend'
import { aiEngineeringData } from './ai-engineering'
import { liveStreamingData } from './live-streaming'
import { nodejsData } from './nodejs'
import { securityData } from './security'
import { designPatternsData } from './design-patterns'
import { algorithmData } from './algorithm'
import { mobileData } from './mobile'
import { browserData } from './browser'
import { integrationData } from './integration'
import { softSkillsData } from './soft-skills'
import { interviewBibleData } from './interview-bible'
import { resumeData } from './resume'

const allData: KnowledgePoint[] = [
  ...htmlCssData,
  ...javascriptData,
  ...typescriptData,
  ...vueData,
  ...reactData,
  ...engineeringData,
  ...microFrontendData,
  ...visualizationData,
  ...networkData,
  ...performanceData,
  ...aiFrontendData,
  ...aiEngineeringData,
  ...liveStreamingData,
  ...nodejsData,
  ...securityData,
  ...designPatternsData,
  ...algorithmData,
  ...mobileData,
  ...browserData,
  ...integrationData,
  ...softSkillsData,
  ...interviewBibleData,
  ...resumeData
]

export function getAllPoints(): KnowledgePoint[] {
  return allData
}

export function getPointById(id: string): KnowledgePoint | undefined {
  return allData.find(p => p.id === id)
}

export function getPointsByCategory(categoryId: string): KnowledgePoint[] {
  return allData.filter(p => p.category === categoryId)
}

export function searchPoints(keyword: string): KnowledgePoint[] {
  const kw = keyword.toLowerCase()
  return allData.filter(p =>
    p.title.toLowerCase().includes(kw) ||
    p.question.toLowerCase().includes(kw) ||
    p.answer.toLowerCase().includes(kw) ||
    p.tags.some(t => t.toLowerCase().includes(kw)) ||
    p.category.includes(kw)
  )
}

export function getCategoriesWithCount(): CategoryItem[] {
  return CATEGORIES.map(cat => {
    const matches = allData.filter(p => p.category === cat.id)
    return { ...cat, count: matches.length }
  })
}

export { CATEGORIES }
