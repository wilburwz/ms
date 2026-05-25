<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPointById, CATEGORIES } from '../data'
import { DIFFICULTY_MAP } from '../types'

const route = useRoute()
const router = useRouter()
const copied = ref(false)

const point = computed(() => getPointById(route.params.id as string))
const category = computed(() => point.value ? CATEGORIES.find(c => c.id === point.value!.category) : null)
const relatedPoints = computed(() => {
  if (!point.value?.relatedIds) return []
  return point.value.relatedIds.map(id => getPointById(id)!).filter(Boolean) as NonNullable<typeof point.value>[]
})

// Auto-redirect to category view with question selected
onMounted(() => {
  if (point.value) {
    router.replace(`/category/${point.value.category}?q=${point.value.id}`)
  }
})

function copyCode(code: string) {
  navigator.clipboard.writeText(code).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}

function goDetail(id: string) {
  router.push(`/category/${point.value?.category}?q=${id}`)
  window.scrollTo(0, 0)
}

function renderAnswer(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <div v-if="point" class="detail-content">
    <button class="btn back-link" @click="router.push(`/category/${point.category}`)">
      ← 返回列表
    </button>

    <h1>{{ point.title }}</h1>

    <div class="meta-bar">
      <span :class="['badge', `badge-${['easy', 'medium', 'hard'][point.difficulty - 1]}`]">
        {{ DIFFICULTY_MAP[point.difficulty] }}
      </span>
      <span v-if="category">{{ category.icon }} {{ category.name }}</span>
      <span v-if="point.subCategory">· {{ point.subCategory }}</span>
    </div>

    <div class="section">
      <h3>题目</h3>
      <div class="answer-block" style="font-size: 1rem;">{{ point.question }}</div>
    </div>

    <div class="section">
      <h3>答案</h3>
      <div class="answer-block" v-html="renderAnswer(point.answer)" />
    </div>

    <div v-if="point.codeExample" class="section">
      <h3>代码示例</h3>
      <div class="code-block">
        <div class="code-header">
          <span>Code</span>
          <button class="copy-btn" @click="copyCode(point.codeExample)">
            {{ copied ? '已复制 ✓' : '复制' }}
          </button>
        </div>
        <pre><code>{{ point.codeExample }}</code></pre>
      </div>
    </div>

    <div class="section">
      <h3>标签</h3>
      <div class="tags">
        <span v-for="tag in point.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <div v-if="relatedPoints.length > 0" class="section">
      <h3>关联题目</h3>
      <div class="related-list">
        <div
          v-for="rp in relatedPoints"
          :key="rp.id"
          class="related-item"
          @click="goDetail(rp.id)"
          style="cursor: pointer;"
        >
          {{ rp.title }}
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>题目未找到</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>
