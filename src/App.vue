<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNav from './components/AppNav.vue'
import Sidebar from './components/Sidebar.vue'
import { getCategoriesWithCount } from './data'

const sidebarOpen = ref(false)
const route = useRoute()

const categories = computed(() => getCategoriesWithCount())

watch(() => route.path, () => {
  sidebarOpen.value = false
})

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="app-layout">
    <AppNav @toggle-sidebar="toggleSidebar" />
    <div class="app-body">
      <Sidebar
        :categories="categories"
        :is-open="sidebarOpen"
        @close="sidebarOpen = false"
      />
      <div class="sidebar-overlay" :class="{ show: sidebarOpen }" @click="sidebarOpen = false" />
      <main class="main-content">
        <router-view :key="$route.fullPath" />
      </main>
    </div>
  </div>
</template>
