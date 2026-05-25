<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineEmits(['toggleSidebar'])

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  const q = searchQuery.value.trim()
  if (q) {
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') handleSearch()
}
</script>

<template>
  <nav class="app-nav">
    <button type="button" class="menu-toggle" aria-label="打开菜单" @click="$emit('toggleSidebar')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
      </svg>
    </button>
    <RouterLink to="/" class="logo">前端面试宝典</RouterLink>
    <div class="nav-links">
      <RouterLink to="/quiz">答题</RouterLink>
    </div>
    <div class="nav-search">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3-3" stroke-linecap="round" />
      </svg>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="搜索面试题…"
        aria-label="搜索面试题"
        @keydown="onKeydown"
      />
    </div>
  </nav>
</template>
