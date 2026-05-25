<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPointById, CATEGORIES } from '../data'
import { DIFFICULTY_MAP } from '../types'

const route = useRoute()
const router = useRouter()

const copied = ref(false)
const contentPanel = ref<HTMLElement | null>(null)

const categoryId = computed(() => route.params.id as string)
const queryQId = computed(() => route.query.q as string | undefined)
const category = computed(() => CATEGORIES.find(c => c.id === categoryId.value))

const selectedPoint = computed(() => {
  if (!queryQId.value) return null
  return getPointById(queryQId.value) ?? null
})

const relatedPoints = computed(() => {
  if (!selectedPoint.value?.relatedIds) return []
  return selectedPoint.value.relatedIds.map(id => getPointById(id)!).filter(Boolean)
})

watch(selectedPoint, () => {
  nextTick(() => {
    contentPanel.value?.scrollTo(0, 0)
  })
})

function copyCode(code: string) {
  navigator.clipboard.writeText(code).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

function goToRelated(id: string) {
  router.replace({ query: { q: id } })
}

function renderAnswer(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <div v-if="category" ref="contentPanel" class="page-panel">
    <div v-if="selectedPoint" class="detail-content">
      <div class="detail-header">
        <span class="breadcrumb">{{ category.name }}</span>
      </div>

      <h1 style="border-bottom: 1px solid var(--border); padding-bottom: 12px; font-size: 1.375rem;">
        {{ selectedPoint.title }}
      </h1>
      <div class="meta-bar">
        <span :class="['badge', `badge-${['easy', 'medium', 'hard'][selectedPoint.difficulty - 1]}`]">
          {{ DIFFICULTY_MAP[selectedPoint.difficulty] }}
        </span>
        <span v-if="selectedPoint.subCategory">· {{ selectedPoint.subCategory }}</span>
      </div>
      <div class="section">
        <h3>题目</h3>
        <div class="answer-block" style="font-size: 1rem;">{{ selectedPoint.question }}</div>
      </div>
      <div class="section">
        <h3>答案</h3>
        <div class="answer-block" v-html="renderAnswer(selectedPoint.answer)" />
      </div>
      <div v-if="selectedPoint.codeExample" class="section">
        <h3>代码示例</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Code</span>
            <button type="button" class="copy-btn" @click="copyCode(selectedPoint.codeExample)">
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <pre><code>{{ selectedPoint.codeExample }}</code></pre>
        </div>
      </div>
      <div class="section">
        <h3>标签</h3>
        <div class="tags">
          <span v-for="tag in selectedPoint.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <div v-if="relatedPoints.length > 0" class="section">
        <h3>关联题目</h3>
        <div class="related-list">
          <div
            v-for="rp in relatedPoints"
            :key="rp.id"
            class="related-item"
            @click="goToRelated(rp.id)"
          >
            {{ rp.title }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="welcome-card">
      <div class="welcome-mark">题</div>
      <h2>{{ category.name }}</h2>
      <p>从侧栏展开分类，点击题目查看详情</p>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>分类未找到</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>
