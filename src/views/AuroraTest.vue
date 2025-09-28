<template>
  <AuroraBackground>
    <div class="test-content">
      <div class="text-3xl md:text-7xl font-bold dark:text-white text-center mb-4">
        Aurora Background 效果
      </div>
      <div class="text-base md:text-2xl text-gray-600 dark:text-gray-300 text-center mb-8">
        现代化的渐变背景效果
      </div>
      <div class="flex gap-4 justify-center">
        <el-button type="primary" round @click="showMessage">主要按钮</el-button>
        <el-button round @click="toggleTheme">切换主题</el-button>
      </div>
    </div>
  </AuroraBackground>
</template>

<script setup lang="ts">
import AuroraBackground from '@/components/AuroraBackground.vue'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const showMessage = () => {
  ElMessage.success('Aurora Background 集成成功！')
}

const toggleTheme = () => {
  appStore.toggleTheme()
}
</script>

<style scoped>
.test-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}
</style>