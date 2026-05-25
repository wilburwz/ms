<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllPoints, getPointsByCategory } from '../data'
import { CATEGORIES, DIFFICULTY_MAP } from '../types'
import type { QuizRecord } from '../types'

type QuizPhase = 'setup' | 'playing' | 'finished'

const phase = ref<QuizPhase>('setup')
const selectedCategories = ref<string[]>([])
const questions = ref<any[]>([])
const currentIndex = ref(0)
const userAnswer = ref('')
const showResult = ref(false)
const lastCorrect = ref(false)
const records = ref<QuizRecord[]>([])
const questionCount = ref(10)

function toggleCategory(id: string) {
  const idx = selectedCategories.value.indexOf(id)
  if (idx >= 0) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(id)
  }
}

function startQuiz() {
  let pool: typeof questions.value = []
  if (selectedCategories.value.length > 0) {
    for (const catId of selectedCategories.value) {
      pool.push(...getPointsByCategory(catId))
    }
  } else {
    pool = getAllPoints()
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  questions.value = shuffled.slice(0, Math.min(questionCount.value, shuffled.length))
  currentIndex.value = 0
  userAnswer.value = ''
  showResult.value = false
  records.value = []
  phase.value = 'playing'
}

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const progress = computed(() =>
  questions.value.length > 0 ? ((currentIndex.value) / questions.value.length) * 100 : 0
)
const correctCount = computed(() => records.value.filter(r => r.correct).length)

function submitAnswer() {
  if (!currentQuestion.value) return
  const answerText = currentQuestion.value.answer
  const userText = userAnswer.value.trim().toLowerCase()
  const correct = userText.length > 0 && answerText.toLowerCase().includes(userText)

  lastCorrect.value = correct
  records.value.push({
    pointId: currentQuestion.value.id,
    correct,
    timestamp: Date.now()
  })
  showResult.value = true
}

function nextQuestion() {
  if (currentIndex.value >= questions.value.length - 1) {
    phase.value = 'finished'
    return
  }
  currentIndex.value++
  userAnswer.value = ''
  showResult.value = false
}

function reset() {
  phase.value = 'setup'
  questions.value = []
  currentIndex.value = 0
  userAnswer.value = ''
  showResult.value = false
  records.value = []
  selectedCategories.value = []
}

function renderAnswer(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <div class="quiz-container">
    <h1 style="margin-bottom: 24px; border: none; padding: 0;">答题</h1>

    <!-- Setup -->
    <div v-if="phase === 'setup'" class="quiz-setup">
      <h3>选择考察范围（不选则从全部题目中随机出题）</h3>
      <div class="category-chips">
        <span
          v-for="cat in CATEGORIES"
          :key="cat.id"
          :class="['chip', { selected: selectedCategories.includes(cat.id) }]"
          @click="toggleCategory(cat.id)"
        >
          {{ cat.icon }} {{ cat.name }}
        </span>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="margin-right: 8px; font-size: 0.9rem;">题目数量：</label>
        <select v-model="questionCount" style="padding: 6px 12px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); color: var(--text);">
          <option :value="5">5 题</option>
          <option :value="10">10 题</option>
          <option :value="20">20 题</option>
          <option :value="30">30 题</option>
        </select>
      </div>

      <button class="btn btn-primary" @click="startQuiz">
        开始答题
      </button>
    </div>

    <!-- Playing -->
    <div v-if="phase === 'playing' && currentQuestion">
      <div class="quiz-progress">
        <span style="font-size: 0.85rem; white-space: nowrap;">
          {{ currentIndex + 1 }} / {{ questions.length }}
        </span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>
        <span class="quiz-score" v-if="records.length > 0">
          正确 {{ correctCount }}
        </span>
      </div>

      <div class="quiz-question">
        <span :class="['badge', `badge-${['easy', 'medium', 'hard'][currentQuestion.difficulty - 1]}`]" style="margin-bottom: 8px; display: inline-block;">
          {{ DIFFICULTY_MAP[currentQuestion.difficulty] }}
        </span>
        <div style="margin-top: 8px;">{{ currentQuestion.question }}</div>
      </div>

      <div class="quiz-answer-area">
        <textarea
          v-model="userAnswer"
          placeholder="输入你的答案要点..."
          :disabled="showResult"
        />
      </div>

      <div class="quiz-actions">
        <button v-if="!showResult" class="btn btn-primary" @click="submitAnswer" :disabled="!userAnswer.trim()">
          提交答案
        </button>
        <button v-if="showResult" class="btn btn-primary" @click="nextQuestion">
          {{ currentIndex >= questions.length - 1 ? '查看结果' : '下一题' }}
        </button>
      </div>

      <div v-if="showResult" :class="['quiz-result', lastCorrect ? 'correct' : 'wrong']">
        <strong>{{ lastCorrect ? '回答正确' : '不完全正确' }}</strong>
        <div style="margin-top: 8px;" v-html="renderAnswer(currentQuestion.answer)" />
      </div>
    </div>

    <!-- Finished -->
    <div v-if="phase === 'finished'" class="quiz-setup">
      <h2 style="border: none; padding: 0; margin-bottom: 8px;">答题结束</h2>
      <div style="font-size: 1.2rem; margin: 16px 0;">
        正确率：<strong>{{ records.length > 0 ? Math.round((correctCount / records.length) * 100) : 0 }}%</strong>
        （{{ correctCount }} / {{ records.length }}）
      </div>

      <div style="margin-bottom: 20px; max-width: 500px; margin-left: auto; margin-right: auto;">
        <div
          v-for="(record, idx) in records"
          :key="record.pointId"
          style="padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; display: flex; align-items: center; gap: 10px;"
        >
          <span :style="{ color: record.correct ? 'var(--accent-green)' : 'var(--accent-red)', fontVariantNumeric: 'tabular-nums' }">
            {{ record.correct ? '✓' : '×' }}
          </span>
          <span style="flex: 1; text-align: left;">第 {{ idx + 1 }} 题</span>
        </div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-primary" @click="startQuiz">再来一轮</button>
        <button class="btn" @click="reset">重新选择</button>
      </div>
    </div>
  </div>
</template>
