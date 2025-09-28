<template>
  <div class="pomodoro-module">
    <div class="pomodoro-container">
      <!-- 番茄图标 -->
      <div class="tomato-icon">
        <img src="/tomato.png" alt="番茄" class="tomato-image" />
      </div>
      
      <!-- 时间显示 -->
      <div class="timer-display">
        <div class="time-display">{{ formattedTime }}</div>
      </div>
      
      <!-- 控制按钮 -->
      <div class="timer-controls">
        <el-button 
          class="control-button start-button"
          :class="{ 'pause-button': timerStatus === 'running' }"
          @click="toggleTimer"
          round
        >
          <el-icon v-if="timerStatus !== 'running'"><VideoPlay /></el-icon>
          <el-icon v-else><VideoPause /></el-icon>
          {{ timerStatus === 'running' ? '暂停' : (timerStatus === 'paused' ? '继续' : '开始') }}
        </el-button>
        <el-button 
          class="control-button reset-button"
          @click="resetTimer"
          :disabled="timerStatus === 'idle'"
          round
        >
          <el-icon><RefreshRight /></el-icon>
          重置
        </el-button>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      
      <!-- 设置区域 -->
      <div class="timer-settings">
        <div class="setting-item">
          <label>工作时长</label>
          <el-input-number 
            v-model="workDuration" 
            :min="1" 
            :max="60" 
            :disabled="timerStatus !== 'idle'"
            size="small"
            class="duration-input"
          /> 分钟
        </div>
        <div class="setting-item">
          <label>休息时长</label>
          <el-input-number 
            v-model="breakDuration" 
            :min="1" 
            :max="30" 
            :disabled="timerStatus !== 'idle'"
            size="small"
            class="duration-input"
          /> 分钟
        </div>
        <div class="setting-item mode-display">
          <span class="mode-label">当前模式:</span>
          <span class="mode-value">{{ currentMode }}</span>
        </div>
        <div class="setting-item">
          <span class="cycle-label">完成轮数:</span>
          <span class="cycle-count">{{ completedCycles }} / {{ targetCycles }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElNotification } from 'element-plus'
import { VideoPlay, VideoPause, RefreshRight } from '@element-plus/icons-vue'

// 番茄钟状态
const timerStatus = ref<'idle' | 'running' | 'paused'>('idle') // idle, running, paused
const currentMode = ref<'工作' | '休息'>('工作')
const remainingTime = ref(0)
const workDuration = ref(25)
const breakDuration = ref(5)
const completedCycles = ref(0)
const targetCycles = ref(4)
let timerInterval: number | null = null

// 计算进度条百分比
const progressPercentage = computed(() => {
  const totalTime = currentMode.value === '工作' ? workDuration.value * 60 : breakDuration.value * 60
  if (totalTime === 0 || remainingTime.value === 0) return 0
  const progress = remainingTime.value / totalTime
  return progress * 100
})

// 格式化时间显示
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 开始/暂停计时器
function toggleTimer() {
  if (timerStatus.value === 'idle') {
    // 开始新的计时
    remainingTime.value = workDuration.value * 60
    currentMode.value = '工作'
    timerStatus.value = 'running'
    startTimer()
  } else if (timerStatus.value === 'running') {
    // 暂停计时
    timerStatus.value = 'paused'
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  } else if (timerStatus.value === 'paused') {
    // 继续计时
    timerStatus.value = 'running'
    startTimer()
  }
}

// 重置计时器
function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerStatus.value = 'idle'
  currentMode.value = '工作'
  remainingTime.value = 0
}

// 启动计时器
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      // 时间结束，切换模式
      if (currentMode.value === '工作') {
        // 工作时间结束，切换到休息
        currentMode.value = '休息'
        remainingTime.value = breakDuration.value * 60
        notifyUser('工作时间结束', '休息一下吧！')
      } else {
        // 休息时间结束，切换到工作
        currentMode.value = '工作'
        remainingTime.value = workDuration.value * 60
        completedCycles.value++
        notifyUser('休息时间结束', '开始新的工作循环！')
        
        // 如果达到目标循环次数，重置计时器
        if (completedCycles.value >= targetCycles.value) {
          notifyUser('番茄钟完成', `恭喜您完成了 ${targetCycles.value} 个工作循环！`)
          resetTimer()
          return
        }
      }
    }
  }, 1000)
}

// 通知用户
function notifyUser(title: string, message: string) {
  ElNotification({
    title,
    message,
    type: 'success',
    duration: 3000
  })
  
  // 尝试播放提示音
  try {
    const audio = new Audio('/sounds/notification.mp3')
    audio.play()
  } catch (error) {
    console.error('无法播放提示音', error)
  }
}

// 组件卸载时清理计时器
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
})
</script>

<style scoped>
.pomodoro-module {
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.pomodoro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

/* 番茄图标 */
.tomato-icon {
  margin-bottom: 16px;
}

.tomato-image {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 4px 8px rgba(255, 99, 71, 0.4));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* 时间显示 */
.timer-display {
  margin-bottom: 24px;
  text-align: center;
}

.time-display {
  font-size: 64px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: 2px;
}

/* 控制按钮 */
.timer-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.control-button {
  min-width: 100px;
  height: 40px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.start-button {
  background: linear-gradient(135deg, #34c759, #30d158);
  color: white;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 199, 89, 0.4);
}

.pause-button {
  background: linear-gradient(135deg, #ff3b30, #ff453a);
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
}

.pause-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 59, 48, 0.4);
}

.reset-button {
  background: linear-gradient(135deg, #5e5ce6, #0a84ff);
  color: white;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(10, 132, 255, 0.4);
}

/* 进度条 */
.progress-bar-container {
  width: 100%;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 24px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff9500, #ff2d55);
  border-radius: 3px;
  transition: width 1s linear;
}
/* 设置区域 */
.timer-settings {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.duration-input {
  width: 80px;
}

.mode-display {
  grid-column: 1 / -1;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 8px;
}

.mode-label, .cycle-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.mode-value {
  font-weight: 600;
  color: #ff9500;
  background-color: rgba(255, 149, 0, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.cycle-count {
  font-weight: 600;
  color: #5e5ce6;
}

/* 深色模式适配 */
.dark .pomodoro-container {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8), rgba(20, 20, 20, 0.6));
}

.dark .progress-bar-container {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark .timer-settings {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .mode-display {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>