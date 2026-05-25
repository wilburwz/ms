<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCategoriesWithCount, getAllPoints } from '../data'

const router = useRouter()

const categories = computed(() => getCategoriesWithCount().filter(c => c.count > 0))
const totalCount = computed(() => getAllPoints().length)

function randomQuestion() {
  const all = getAllPoints()
  const p = all[Math.floor(Math.random() * all.length)]
  router.push(`/category/${p.category}?q=${p.id}`)
}
</script>

<template>
  <div class="page-panel">
    <div class="welcome-card">
      <div class="welcome-mark">面</div>
      <h2>前端面试宝典</h2>
      <p>共 {{ totalCount }} 道高频面试题，分 {{ categories.length }} 大类</p>
      <p style="margin-top: 8px;">从侧栏展开分类，点击题目开始学习</p>
      <div class="welcome-actions">
        <button type="button" class="btn btn-primary" @click="randomQuestion">随机一题</button>
        <RouterLink to="/quiz">
          <button type="button" class="btn">开始答题</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
