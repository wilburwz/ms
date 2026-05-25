<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategoriesWithCount, getPointsByCategory } from '../data'

defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const expandedGroups = ref<Record<string, boolean>>({})

const categories = computed(() => getCategoriesWithCount())

// Auto-expand group matching current route
watch(() => route.params.id, (catId) => {
  if (catId && typeof catId === 'string') {
    expandedGroups.value[catId] = true
  }
}, { immediate: true })

function toggleGroup(catId: string) {
  expandedGroups.value[catId] = !expandedGroups.value[catId]
  // Navigate to category
  router.push(`/category/${catId}`)
}

function goToQuestion(pointId: string, catId: string) {
  router.push(`/category/${catId}?q=${pointId}`)
}

// Get items for a category (cached)
const categoryItems = computed(() => {
  const map: Record<string, ReturnType<typeof getPointsByCategory>> = {}
  categories.value.forEach(cat => {
    map[cat.id] = getPointsByCategory(cat.id)
  })
  return map
})

const currentCatId = computed(() => route.params.id as string || '')
const currentQId = computed(() => route.query.q as string || '')
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-hidden': !isOpen }">
    <div class="sidebar-title">知识分类</div>
    <div v-for="cat in categories" :key="cat.id" class="category-group">
      <div
        class="category-group-header"
        :class="{ active: currentCatId === cat.id && !currentQId }"
        @click="toggleGroup(cat.id)"
      >
        <span class="group-label">
          <span class="group-icon">{{ cat.icon }}</span>
          {{ cat.name }}
        </span>
        <span class="group-arrow" :class="{ expanded: expandedGroups[cat.id] }">▶</span>
      </div>
      <div
        class="category-group-items"
        v-show="expandedGroups[cat.id]"
      >
        <div
          v-for="item in categoryItems[cat.id]"
          :key="item.id"
          class="category-group-item"
          :class="{ 'active-item': currentQId === item.id && currentCatId === cat.id }"
          @click="goToQuestion(item.id, cat.id)"
        >
          <span class="item-dot">•</span>
          {{ item.title }}
        </div>
      </div>
    </div>
  </aside>
</template>
