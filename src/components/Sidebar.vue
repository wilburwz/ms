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

watch(() => route.params.id, (catId) => {
  if (catId && typeof catId === 'string') {
    expandedGroups.value[catId] = true
  }
}, { immediate: true })

function toggleGroup(catId: string) {
  expandedGroups.value[catId] = !expandedGroups.value[catId]
  router.push(`/category/${catId}`)
}

function goToQuestion(pointId: string, catId: string) {
  router.push(`/category/${catId}?q=${pointId}`)
}

const groupedItems = computed(() => {
  const map: Record<string, { subCategory: string; items: ReturnType<typeof getPointsByCategory> }[]> = {}
  categories.value.forEach(cat => {
    const points = getPointsByCategory(cat.id)
    const groupMap = new Map<string, ReturnType<typeof getPointsByCategory>>()
    const noSubItems: typeof points = []

    points.forEach(p => {
      if (p.subCategory) {
        if (!groupMap.has(p.subCategory)) groupMap.set(p.subCategory, [])
        groupMap.get(p.subCategory)!.push(p)
      } else {
        noSubItems.push(p)
      }
    })

    const groups: { subCategory: string; items: typeof points }[] = []
    groupMap.forEach((items, sub) => groups.push({ subCategory: sub, items }))
    if (noSubItems.length > 0) groups.push({ subCategory: '', items: noSubItems })

    map[cat.id] = groups
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
        <template v-for="group in (groupedItems[cat.id] || [])" :key="group.subCategory || 'no-sub'">
          <div v-if="group.subCategory" class="sub-category-label">
            {{ group.subCategory }}
            <span class="sub-count">{{ group.items.length }}</span>
          </div>
          <div :style="{ paddingLeft: group.subCategory ? '2px' : '0' }">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="category-group-item"
              :class="{ 'active-item': currentQId === item.id && currentCatId === cat.id }"
              @click="goToQuestion(item.id, cat.id)"
            >
              <span class="item-dot">•</span>
              <span class="item-title-text">{{ item.title }}</span>
              <span :class="['difficulty-badge', 'diff-' + item.difficulty]">
                {{ ['初','中','高'][item.difficulty - 1] }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>
