<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchPoints } from '../data'
import { DIFFICULTY_MAP } from '../types'

const router = useRouter()
const keyword = ref('')
const debounceTimer = ref<number | null>(null)
const debouncedKeyword = ref('')

function onInput() {
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  debounceTimer.value = window.setTimeout(() => {
    debouncedKeyword.value = keyword.value.trim()
  }, 200)
}

const results = computed(() => {
  if (!debouncedKeyword.value) return []
  return searchPoints(debouncedKeyword.value)
})

function highlight(text: string, kw: string): string {
  if (!kw) return text
  const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="search-highlight">$1</span>')
}

function goToQuestion(point: typeof results.value[number]) {
  router.push(`/category/${point.category}?q=${point.id}`)
}
</script>

<template>
  <div class="search-container">
    <h1 style="margin-bottom: 20px; border: none; padding: 0;">搜索</h1>

    <div class="search-input-wrapper">
      <input
        v-model="keyword"
        type="text"
        placeholder="输入关键词搜索... 如：闭包、WebSocket、响应式、Vite..."
        @input="onInput"
      />
    </div>

    <div v-if="debouncedKeyword && results.length === 0" class="empty-state" style="height: auto; padding: 48px 0;">
      <p>未找到与「{{ debouncedKeyword }}」相关的题目</p>
    </div>

    <p v-if="debouncedKeyword && results.length > 0" style="margin: 16px 0; color: var(--text-secondary);">
      找到 {{ results.length }} 个结果
    </p>

    <div v-if="debouncedKeyword">
      <div
        v-for="point in results"
        :key="point.id"
        class="search-result-item"
        @click="goToQuestion(point)"
      >
        <div class="sr-title" v-html="highlight(point.title, debouncedKeyword)" />
        <div class="sr-text" v-html="highlight(point.question.slice(0, 120), debouncedKeyword)" />
        <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
          <span :class="['badge', `badge-${['easy', 'medium', 'hard'][point.difficulty - 1]}`]">
            {{ DIFFICULTY_MAP[point.difficulty] }}
          </span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">{{ point.category }}</span>
        </div>
      </div>
    </div>

    <div v-if="!debouncedKeyword" class="welcome-card" style="height: auto; min-height: 320px;">
      <div class="welcome-mark">搜</div>
      <p>输入关键词开始搜索</p>
      <p style="margin-top: 8px; font-size: 0.8125rem;">支持标题、题目、答案、标签与分类</p>
    </div>
  </div>
</template>
