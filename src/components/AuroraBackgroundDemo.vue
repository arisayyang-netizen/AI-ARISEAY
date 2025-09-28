<template>
  <AuroraBackground className="demo-page">
    <div class="demo-content">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">
        AI 智能工作台
      </h1>
      <p class="text-lg md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
        智能化你的工作流程
      </p>
      <el-button type="primary" size="large" round @click="handleStart">
        开始体验
      </el-button>
    </div>
  </AuroraBackground>
</template>

<script setup lang="ts">
import AuroraBackground from './AuroraBackground.vue'
import { ElMessage } from 'element-plus'

const handleStart = () => {
  ElMessage.success('欢迎使用 AI 智能工作台！')
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
}

.demo-content {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark h1 {
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>