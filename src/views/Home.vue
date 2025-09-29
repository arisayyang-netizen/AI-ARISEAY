<template>
  <div class="home-container">
    <!-- 隐藏式模块选择器 -->
    <div class="module-selector-container" @mouseenter="showModuleSelector = true" @mouseleave="showModuleSelector = false">
      <div class="module-selector-trigger"></div>
      <div class="module-selector" :class="{ expanded: showModuleSelector }">
        <div class="module-tabs-compact">
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'welcome' }"
            @click="setActiveModule('welcome')"
          >
            <div class="tab-icon">🏠</div>
            <span class="tab-text">首页</span>
          </div>
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'consultation' }"
            @click="setActiveModule('consultation')"
          >
            <div class="tab-icon">🧠</div>
            <span class="tab-text">AI大爆炸</span>
          </div>
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'notes' }"
            @click="setActiveModule('notes')"
          >
            <div class="tab-icon">📝</div>
            <span class="tab-text">AI记事本</span>
          </div>
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'chat' }"
            @click="setActiveModule('chat')"
          >
            <div class="tab-icon">🤖</div>
            <span class="tab-text">智能对话</span>
          </div>
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'todos' }"
            @click="setActiveModule('todos')"
          >
            <div class="tab-icon">✅</div>
            <span class="tab-text">待办清单</span>
          </div>
          
          <!-- 番茄钟模块 -->
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'pomodoro' }"
            @click="setActiveModule('pomodoro')"
          >
            <div class="tab-icon">🍅</div>
            <span class="tab-text">番茄钟</span>
          </div>
          
          <!-- 项目管理模块 -->
          <div 
            class="tab-item-compact" 
            :class="{ active: activeModule === 'project' }"
            @click="setActiveModule('project')"
          >
            <div class="tab-icon">📊</div>
            <span class="tab-text">项目管理</span>
          </div>
          
          <!-- 分隔线 -->
          <div class="tab-divider"></div>
          
          <div class="right-controls">
            <!-- 主题切换 -->
            <div class="control-button" @click="toggleTheme" :title="theme === 'light' ? '深色模式' : '浅色模式'">
              <div class="control-icon">{{ theme === 'light' ? '🌙' : '☀️' }}</div>
            </div>
            
            <!-- 设置 -->
            <div class="control-button" @click="showSettings = true" title="设置">
              <div class="control-icon">⚙️</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 简化的顶部导航栏 -->
    <header class="top-nav-compact">
      <div class="nav-left">
        <div class="logo-section-compact">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" class="logo-svg">
              <!-- AI 大脑图标 -->
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#6c5ce7;stop-opacity:1" />
                </linearGradient>
              </defs>
              <!-- 大脑轮廓 -->
              <path d="M20 5C15 5 11 9 11 14C11 16 12 18 13 19C12 20 11 22 11 24C11 28 14 31 18 31H22C26 31 29 28 29 24C29 22 28 20 27 19C28 18 29 16 29 14C29 9 25 5 20 5Z" fill="url(#logoGradient)" opacity="0.9"/>
              <!-- 神经网络节点 -->
              <circle cx="16" cy="12" r="1.5" fill="#ffffff" opacity="0.8"/>
              <circle cx="24" cy="12" r="1.5" fill="#ffffff" opacity="0.8"/>
              <circle cx="20" cy="16" r="1.5" fill="#ffffff" opacity="0.8"/>
              <circle cx="18" cy="22" r="1.5" fill="#ffffff" opacity="0.8"/>
              <circle cx="22" cy="22" r="1.5" fill="#ffffff" opacity="0.8"/>
              <!-- 连接线 -->
              <line x1="16" y1="12" x2="20" y2="16" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
              <line x1="24" y1="12" x2="20" y2="16" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
              <line x1="20" y1="16" x2="18" y2="22" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
              <line x1="20" y1="16" x2="22" y2="22" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
            </svg>
          </div>
          <h1 class="app-title glow-text">AI智能工作台</h1>
        </div>
      </div>
      
      <div class="nav-right">
        <!-- 缩小的主题和设置按钮 -->
        <div class="compact-controls">
          <el-button 
            class="theme-btn" 
            circle 
            size="small" 
            @click="toggleTheme"
          >
            <el-icon><component :is="theme === 'light' ? 'Moon' : 'Sunny'" /></el-icon>
          </el-button>
          <el-button 
            class="settings-btn" 
            circle 
            size="small" 
            @click="showSettings = true"
          >
            <el-icon><Setting /></el-icon>
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="content-area">
      <!-- 欢迎页面 -->
      <div v-if="activeModule === 'welcome'" class="welcome-screen animate-fade-in">
        <div class="welcome-hero">
          <div class="hero-background"></div>
          <div class="hero-content">

            
            <!-- 智能搜索（简化版，仅保留搜索与快捷入口） -->
            <div class="enhanced-search-section">
              <div class="search-header">
                <h3 class="search-title">
                  <el-icon class="search-title-icon"><Search /></el-icon>
                  智能搜索
                </h3>
                <p class="search-subtitle">快速找到您需要的功能和内容</p>
              </div>
              
              <div class="enhanced-search-container glass-card search-with-iching">
                <!-- 卦象小区域（左侧美化） -->
                <div class="iching-mini" aria-label="卦象预览">
                  <div class="hex-line yin"></div>
                  <div class="hex-line yang"></div>
                  <div class="hex-line yin"></div>
                  <div class="hex-line yang"></div>
                  <div class="hex-line yang"></div>
                  <div class="hex-line yin"></div>
                </div>
                
                <!-- 搜索输入框 -->
                <el-input
                  v-model="searchQuery"
                  placeholder="输入关键词，智能识别您的需求..."
                  class="enhanced-search-input"
                  @keyup.enter="handleSmartSearch"
                  @input="handleSearchInput"
                  size="large"
                >
                  <template #prefix>
                    <el-icon class="search-prefix-icon"><Search /></el-icon>
                  </template>
                  <template #suffix>
                    <el-button 
                      type="primary" 
                      @click="handleSmartSearch"
                      class="search-button"
                      :disabled="!searchQuery.trim()"
                    >
                      搜索
                    </el-button>
                  </template>
                </el-input>
              </div>

              <!-- 快捷跳转链接 -->
              <div class="quick-links">
                <router-link to="/ai-consultation"><el-button text>AI 咨询</el-button></router-link>
                <router-link to="/chat"><el-button text>智能对话</el-button></router-link>
                <router-link to="/notes"><el-button text>记事本</el-button></router-link>
                <router-link to="/todos"><el-button text>待办清单</el-button></router-link>
                <router-link to="/aurora-test"><el-button text>Aurora 测试</el-button></router-link>
              </div>
            </div>
            
            <!-- 整合的日期运势卡片（已隐藏） -->
            <div class="integrated-date-fortune-card glass-card" v-if="false">
              <div class="card-header">
                <div class="date-display">
                  <div class="date-number">{{ currentDate.day }}</div>
                  <div class="date-details">
                    <div class="month-year">{{ currentDate.monthYear }}</div>
                    <div class="weekday">{{ currentDate.weekday }}</div>
                    <div class="lunar-date">{{ currentDate.lunar }}</div>
                  </div>
                </div>
                <div class="fortune-summary">
                  <div class="fortune-icon-large">{{ todayFortune.icon }}</div>
                  <div class="fortune-info">
                    <div class="fortune-text" :class="`fortune-${todayFortune.level}`">{{ todayFortune.text }}</div>
                    <div class="fortune-desc">{{ todayFortune.description }}</div>
                  </div>
                </div>
              </div>
              
              <div class="card-content" v-if="todayFortune.huangliInfo">
                <div class="fortune-grid">
                  <div class="fortune-column">
                    <h4 class="fortune-title suitable">✅ 今日宜</h4>
                    <div class="fortune-tags">
                      <span v-for="item in todayFortune.huangliInfo.suitable" :key="item" class="fortune-tag suitable">{{ item }}</span>
                    </div>
                  </div>
                  <div class="fortune-column">
                    <h4 class="fortune-title avoid">❌ 今日忌</h4>
                    <div class="fortune-tags">
                      <span v-for="item in todayFortune.huangliInfo.avoid" :key="item" class="fortune-tag avoid">{{ item }}</span>
                    </div>
                  </div>
                </div>
                <div class="fortune-tips-integrated">
                  <h4 class="tips-title">💡 今日建议</h4>
                  <p class="tips-content">{{ todayFortune.huangliInfo.tips }}</p>
                </div>
              </div>
            </div>

            <!-- 番茄钟功能已移至隐藏栏 -->

            <!-- 占卜算卦功能（独立区域，已隐藏） -->
            <div class="divination-main-section glass-card" v-if="false">
              <div class="section-header">
                <h3 class="section-title">🔮 占卜算卦</h3>
                <div class="divination-controls">
                  <el-button type="primary" @click="performDivination" :loading="divinationLoading">
                    {{ divinationLoading ? '占卜中...' : '开始占卜' }}
                  </el-button>
                  <el-button text @click="showDivinationHistory = !showDivinationHistory">
                    历史记录
                  </el-button>
                </div>
              </div>
              
              <div class="divination-content">
                <div class="divination-input" v-if="!currentDivination && !divinationLoading">
                  <div class="divination-prompt">
                    <p>请在心中默念您想要占卜的问题，然后点击"开始占卜"</p>
                    <div class="divination-types">
                      <div 
                        v-for="type in divinationTypes" 
                        :key="type.id"
                        class="divination-type"
                        :class="{ active: selectedDivinationType === type.id }"
                        @click="selectedDivinationType = type.id"
                      >
                        <div class="type-icon">{{ type.icon }}</div>
                        <div class="type-name">{{ type.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 摇铜钱动画 -->
                <div class="coin-animation" v-if="divinationLoading">
                  <div class="animation-container">
                    <div class="coins-wrapper">
                      <div class="coin" v-for="n in 3" :key="n" :style="{ animationDelay: (n-1) * 0.2 + 's' }">
                        <div class="coin-face coin-front">乾</div>
                        <div class="coin-face coin-back">坤</div>
                      </div>
                    </div>
                    <div class="divination-text">
                      <div class="text-line">🔮 正在进行六爻占卜...</div>
                      <div class="text-line">🪙 投掷铜钱，生成爻象</div>
                      <div class="progress-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="divination-result-enhanced" v-if="currentDivination">
                   <!-- 投掷铜钱结果展示 -->
                   <div class="coin-results-section" v-if="currentDivination.liuyao">
                     <div class="section-title">🪙 投掷铜钱结果</div>
                     <div class="coin-results-grid">
                       <div 
                         v-for="(coinResult, index) in currentDivination.liuyao.coinResults" 
                         :key="index"
                         class="coin-result-item"
                       >
                         <div class="yao-position-label">{{ ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻'][index] }}</div>
                         <div class="coins-display">
                           <div 
                             v-for="(coin, coinIndex) in coinResult.coins" 
                             :key="coinIndex"
                             class="coin-mini"
                             :class="{ 'coin-front': coin === '正', 'coin-back': coin === '反' }"
                           >
                             {{ coin === '正' ? '乾' : '坤' }}
                           </div>
                         </div>
                         <div class="coin-sum">{{ coinResult.sum }}分</div>
                       </div>
                     </div>
                   </div>
                   
                   <!-- 六爻卦象详细显示 -->
                   <div class="liuyao-detailed" v-if="currentDivination.liuyao">
                     <div class="hexagram-header">
                       <div class="hexagram-title">{{ currentDivination.originalHexagram.name }}</div>
                       <div class="hexagram-nature">{{ currentDivination.originalHexagram.nature }}卦 · {{ currentDivination.originalHexagram.element }}</div>
                     </div>
                     
                     <!-- 六爻排列（详细版） -->
                     <div class="yao-lines-detailed">
                       <div 
                         v-for="(yao, index) in currentDivination.liuyao.yaoLines" 
                         :key="index"
                         class="yao-line-detailed"
                         :class="{ 'changing': yao.isChanging }"
                       >
                         <div class="yao-position">{{ ['上', '五', '四', '三', '二', '初'][index] }}</div>
                         <div class="yao-symbol-large">{{ yao.symbol }}</div>
                         <div class="yao-info">
                           <div class="yao-type">{{ yao.type }}</div>
                           <div class="yao-coins">{{ yao.coins }} ({{ yao.sum }}分)</div>
                           <div class="yao-change" v-if="yao.isChanging">变爻</div>
                         </div>
                       </div>
                     </div>
                     
                     <!-- 变卦显示（如果有变爻） -->
                     <div class="changed-hexagram-detailed" v-if="currentDivination.changedHexagram && currentDivination.liuyao.hasChangingLines">
                       <div class="change-arrow">⬇️ 变卦 ⬇️</div>
                       <div class="changed-hexagram-info">
                         <div class="changed-hexagram-title">{{ currentDivination.changedHexagram.name }}</div>
                         <div class="changed-hexagram-nature">{{ currentDivination.changedHexagram.nature }}卦 · {{ currentDivination.changedHexagram.element }}</div>
                       </div>
                     </div>
                     
                     <!-- 卦象解释 -->
                     <div class="hexagram-explanation">
                       <div class="explanation-title">📖 卦象解释</div>
                       <div class="explanation-content">
                         <div class="original-meaning">
                           <strong>{{ currentDivination.originalHexagram.name }}：</strong>
                           {{ currentDivination.originalHexagram.meaning }}
                         </div>
                         <div class="changed-meaning" v-if="currentDivination.changedHexagram && currentDivination.liuyao.hasChangingLines">
                           <strong>{{ currentDivination.changedHexagram.name }}：</strong>
                           {{ currentDivination.changedHexagram.meaning }}
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <!-- 传统卦象显示（向后兼容） -->
                   <div class="hexagram-display" v-else>
                     <div class="hexagram-glow"></div>
                     <div class="hexagram-symbol">{{ currentDivination.hexagram.symbol }}</div>
                     <div class="hexagram-name">{{ currentDivination.hexagram.name }}</div>
                     <div class="hexagram-meaning">{{ currentDivination.hexagram.meaning }}</div>
                     <div class="result-coins">
                       <div class="result-coin" v-for="n in 3" :key="n">
                         <div class="coin-face">{{ n % 2 === 0 ? '乾' : '坤' }}</div>
                       </div>
                     </div>
                   </div>
                   <div class="divination-interpretation-compact">
                     <div class="interpretation-content-compact">
                       <div class="content-section">
                         <span class="section-icon">📜</span>
                         <span class="section-text">{{ currentDivination.interpretation }}</span>
                       </div>
                       <div class="advice-section">
                         <span class="section-icon">💡</span>
                         <span class="section-text">{{ currentDivination.advice }}</span>
                       </div>
                     </div>
                     <div class="divination-meta-compact">
                       <span class="meta-compact">{{ getDivinationTypeName(currentDivination.type) }} · {{ formatTime(currentDivination.timestamp) }}</span>
                     </div>
                   </div>
                 </div>
                
                <div class="divination-history" v-if="showDivinationHistory && divinationHistory.length > 0">
                  <div class="history-title">占卜历史</div>
                  <div class="history-list">
                    <div 
                      v-for="record in divinationHistory.slice(0, 3)" 
                      :key="record.id"
                      class="history-item"
                      @click="viewDivinationRecord(record)"
                    >
                      <div class="history-hexagram">{{ record.hexagram.symbol }}</div>
                      <div class="history-info">
                        <div class="history-name">{{ record.hexagram.name }}</div>
                        <div class="history-time">{{ formatTime(record.timestamp) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 统一信息流 -->
            <div class="unified-info-stream glass-card">
              <div class="section-header">
                <h3 class="section-title">重要信息</h3>
                <div class="stream-controls">
                  <el-button text type="primary" @click="setActiveModule('todos')" class="view-more-btn">
                    待办 <el-icon><ArrowRight /></el-icon>
                  </el-button>
                  <el-button text type="primary" @click="router.push('/ai-consultation')" class="view-more-btn">
                    AI大爆炸 <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="info-stream-container">
                <div class="stream-item" v-if="currentStreamItem">
                  <div class="stream-icon">{{ currentStreamItem?.icon || '📋' }}</div>
                  <div class="stream-content">
                    <div class="stream-type">{{ currentStreamItem?.type || '信息' }}</div>
                    <div class="stream-title">{{ currentStreamItem?.title || '无标题' }}</div>
                    <div class="stream-description">{{ currentStreamItem?.description || '暂无描述' }}</div>
                    <div class="stream-meta">
                      <span class="stream-priority" v-if="currentStreamItem?.priority" :class="`priority-${currentStreamItem.priority}`">
                        {{ getPriorityText(currentStreamItem.priority) }}
                      </span>
                      <span class="stream-time" v-if="currentStreamItem?.time">
                        {{ currentStreamItem.time }}
                      </span>
                    </div>
                  </div>
                  <div class="stream-action">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click="handleStreamItemClick(currentStreamItem)"
                      v-if="currentStreamItem"
                    >
                      {{ currentStreamItem?.actionText || '查看详情' }}
                    </el-button>
                  </div>
                </div>
                <div v-if="!currentStreamItem" class="empty-stream">
                  <el-icon><List /></el-icon>
                  <p>暂无重要信息</p>
                </div>
              </div>
              <div class="stream-indicators" v-if="streamItems.length > 1">
                <div 
                  v-for="(item, index) in streamItems" 
                  :key="index"
                  class="indicator" 
                  :class="{ active: index === currentStreamIndex }"
                  @click="setCurrentStreamIndex(index)"
                ></div>
              </div>
            </div>
          </div>
        </div>
        

      </div>

      <!-- AI大爆炸模块 -->
      <AIConsultation v-if="activeModule === 'consultation'" />
      
      <!-- 记事本模块 -->
      <NotesModule v-if="activeModule === 'notes'" />
      
      <!-- 智能体对话模块 -->
      <ChatModule v-if="activeModule === 'chat'" />
      
      <!-- 待办清单模块 -->
      <TodosModule v-if="activeModule === 'todos'" />
      
      <!-- 番茄钟模块 -->
      <div v-if="activeModule === 'pomodoro'" class="module-container">
        <PomodoroModule />
      </div>
      
      <!-- 项目管理模块 -->
      <div v-if="activeModule === 'project'" class="module-container">
        <ProjectManagement />
      </div>
    </main>

    <!-- 设置对话框 -->
    <Settings v-model="showSettings" />
    
    <!-- 教程组件 -->
    <Tutorial v-if="showTutorial" @close="showTutorial = false" />
    

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Search, Document, ChatDotRound, List, Moon, Sunny, Setting, ArrowRight } from '@element-plus/icons-vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import AIConsultation from '@/views/AIConsultation.vue'
import NotesModule from '@/components/modules/NotesModule.vue'
import ChatModule from '@/components/modules/ChatModule.vue'
import TodosModule from '@/components/modules/TodosModule.vue'
import PomodoroModule from '@/components/PomodoroModule.vue'
import ProjectManagement from '@/components/ProjectManagement.vue'
import Settings from '@/components/Settings.vue'
import Tutorial from '@/components/Tutorial.vue'
import DatabaseManager from '@/utils/database'

const appStore = useAppStore()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const activeModule = ref<'welcome' | 'consultation' | 'notes' | 'chat' | 'todos' | 'pomodoro' | 'project'>('welcome')
const showSettings = ref(false)
const logoClickCount = ref(0)
const showTutorial = ref(false)
const searchSuggestions = ref([])
const importantTodos = ref([])
const aiNews = ref([])
const aiConsultations = ref([])
const showModuleSelector = ref(false)
const streamItems = ref([])
    const currentStreamIndex = ref(0)
    const streamTimer = ref(null)
    
    // 占卜功能数据
    const divinationLoading = ref(false)
    const currentDivination = ref(null)
    const showDivinationHistory = ref(false)
    const selectedDivinationType = ref('general')
    const divinationHistory = ref([])
    const divinationTypes = ref([
      { id: 'general', name: '综合运势', icon: '🌟' },
      { id: 'love', name: '感情姻缘', icon: '💕' },
      { id: 'career', name: '事业财运', icon: '💼' },
      { id: 'health', name: '健康平安', icon: '🍃' },
      { id: 'study', name: '学业考试', icon: '📚' },
      { id: 'travel', name: '出行旅游', icon: '✈️' }
    ])
const currentDate = ref({})
const todayFortune = ref({})

// 番茄钟功能数据
const timerStatus = ref('idle') // 'idle', 'running', 'paused'
const workDuration = ref(25) // 工作时长（分钟）
const breakDuration = ref(5) // 休息时长（分钟）
const currentTime = ref(0) // 当前剩余时间（秒）
const totalTime = ref(0) // 总时间（秒）
const isWorkMode = ref(true) // 是否为工作模式
const completedCycles = ref(0) // 已完成轮数
const targetCycles = ref(4) // 目标轮数
const timerInterval = ref(null) // 定时器引用

// 计算属性
const theme = computed(() => appStore.theme)
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const currentStreamItem = computed(() => {
  if (streamItems.value.length === 0) return null
  const index = currentStreamIndex.value
  if (index < 0 || index >= streamItems.value.length) return null
  return streamItems.value[index] || null
})

// 番茄钟计算属性
const formattedTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60)
  const seconds = currentTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const currentMode = computed(() => {
  return isWorkMode.value ? '工作时间' : '休息时间'
})

const circumference = computed(() => {
  return 2 * Math.PI * 90 // 半径为90的圆周长
})

const strokeDashoffset = computed(() => {
  if (totalTime.value === 0) return circumference.value
  const progress = (totalTime.value - currentTime.value) / totalTime.value
  return circumference.value * (1 - progress)
})

// 模拟统计数据
const stats = ref({
  totalNotes: 0,
  totalTasks: 0,
  totalChats: 0,
  aiCalls: 0
})

// 方法
const toggleTheme = () => {
  appStore.toggleTheme()
}

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const setActiveModule = (module: 'welcome' | 'consultation' | 'notes' | 'chat' | 'todos') => {
  activeModule.value = module
}

const handleSearch = (query: string) => {
  // TODO: 实现全局搜索功能
  console.log('搜索:', query)
}

// 番茄钟相关方法
const toggleTimer = () => {
  if (timerStatus.value === 'idle') {
    startTimer()
  } else if (timerStatus.value === 'running') {
    pauseTimer()
  } else if (timerStatus.value === 'paused') {
    resumeTimer()
  }
}

const startTimer = () => {
  const duration = isWorkMode.value ? workDuration.value : breakDuration.value
  currentTime.value = duration * 60
  totalTime.value = duration * 60
  timerStatus.value = 'running'
  
  timerInterval.value = setInterval(() => {
    if (currentTime.value > 0) {
      currentTime.value--
    } else {
      completeTimer()
    }
  }, 1000)
}

const pauseTimer = () => {
  timerStatus.value = 'paused'
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const resumeTimer = () => {
  timerStatus.value = 'running'
  timerInterval.value = setInterval(() => {
    if (currentTime.value > 0) {
      currentTime.value--
    } else {
      completeTimer()
    }
  }, 1000)
}

const resetTimer = () => {
  timerStatus.value = 'idle'
  currentTime.value = 0
  totalTime.value = 0
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const completeTimer = () => {
  timerStatus.value = 'idle'
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  
  // 播放提示音（可选）
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    audio.play().catch(() => {})
  } catch (e) {}
  
  // 显示完成通知
  ElMessage({
    message: isWorkMode.value ? '工作时间结束，开始休息！' : '休息时间结束，开始工作！',
    type: 'success',
    duration: 3000
  })
  
  if (isWorkMode.value) {
    completedCycles.value++
  }
  
  // 切换模式
  isWorkMode.value = !isWorkMode.value
  
  // 自动开始下一个周期（可选）
  // startTimer()
}

// 智能搜索相关方法
const handleSearchInput = (value: string) => {
  const query = value.toLowerCase().trim()
  searchSuggestions.value = []
  
  if (!query) return
  
  // 笔记相关关键词检测
  const noteKeywords = ['笔记', '记事', 'note', '记录', '备忘', '文档']
  if (noteKeywords.some(keyword => query.includes(keyword))) {
    const content = query.replace(new RegExp(noteKeywords.join('|'), 'gi'), '').trim()
    searchSuggestions.value.push({
      type: 'notes',
      icon: '📝',
      text: content ? `创建笔记: ${content}` : '打开笔记模块',
      action: content ? 'create' : 'open'
    })
  }
  
  // AI对话相关关键词检测
  const aiKeywords = ['ai', '对话', '聊天', 'chat', '问答', '助手', 'gpt']
  if (aiKeywords.some(keyword => query.includes(keyword))) {
    const content = query.replace(new RegExp(aiKeywords.join('|'), 'gi'), '').trim()
    searchSuggestions.value.push({
      type: 'chat',
      icon: '🤖',
      text: content ? `AI对话: ${content}` : '开始AI对话',
      action: content ? 'chat' : 'open'
    })
  }
  
  // 待办事项相关关键词检测
  const todoKeywords = ['待办', '任务', 'todo', '清单', '计划', '提醒']
  if (todoKeywords.some(keyword => query.includes(keyword))) {
    const content = query.replace(new RegExp(todoKeywords.join('|'), 'gi'), '').trim()
    searchSuggestions.value.push({
      type: 'todos',
      icon: '✅',
      text: content ? `创建任务: ${content}` : '管理待办事项',
      action: content ? 'create' : 'open'
    })
  }
  
  // 设置相关关键词检测
  const settingsKeywords = ['设置', '配置', 'settings', '偏好', '选项']
  if (settingsKeywords.some(keyword => query.includes(keyword))) {
    searchSuggestions.value.push({
      type: 'settings',
      icon: '⚙️',
      text: '打开设置',
      action: 'open'
    })
  }
  
  // 搜索相关关键词检测
  const searchKeywords = ['搜索', 'search', '查找', '寻找']
  if (searchKeywords.some(keyword => query.includes(keyword))) {
    const content = query.replace(new RegExp(searchKeywords.join('|'), 'gi'), '').trim()
    if (content) {
      searchSuggestions.value.push({
        type: 'search',
        icon: '🔍',
        text: `全局搜索: ${content}`,
        action: 'search'
      })
    }
  }
  
  // 如果没有匹配到特定关键词，提供通用搜索建议
  if (searchSuggestions.value.length === 0 && query.length > 1) {
    searchSuggestions.value.push(
      {
        type: 'search',
        icon: '🔍',
        text: `搜索 "${query}"`,
        action: 'search'
      },
      {
        type: 'notes',
        icon: '📝',
        text: `创建笔记 "${query}"`,
        action: 'create'
      },
      {
        type: 'chat',
        icon: '🤖',
        text: `询问AI "${query}"`,
        action: 'chat'
      }
    )
  }
}

const handleSmartSearch = async () => {
  const query = searchQuery.value.trim()
  const lowerQuery = query.toLowerCase()
  
  if (!query) return
  
  // 智能识别和处理不同类型的输入
  const result = await processSmartQuery(query)
  
  if (result.success) {
    searchQuery.value = ''
    searchSuggestions.value = []
  }
}

// 智能查询处理函数
const processSmartQuery = async (query: string) => {
  const lowerQuery = query.toLowerCase()
  
  // 笔记相关处理
  const noteKeywords = ['笔记', '记事', 'note', '记录', '备忘', '文档']
  if (noteKeywords.some(keyword => lowerQuery.includes(keyword))) {
    const content = query.replace(new RegExp(noteKeywords.join('|'), 'gi'), '').trim()
    
    if (content) {
      return await createNote(content)
    } else {
      setActiveModule('notes')
      return { success: true, message: '已打开笔记模块' }
    }
  }
  
  // AI对话相关处理
  const aiKeywords = ['ai', '对话', '聊天', 'chat', '问答', '助手', 'gpt']
  if (aiKeywords.some(keyword => lowerQuery.includes(keyword))) {
    const content = query.replace(new RegExp(aiKeywords.join('|'), 'gi'), '').trim()
    
    setActiveModule('chat')
    if (content) {
      // TODO: 传递初始消息到聊天模块
      ElMessage.success(`正在为您准备AI对话: ${content}`)
    }
    return { success: true, message: '已打开AI对话' }
  }
  
  // AI大爆炸相关处理
  const consultationKeywords = ['咨询', '顾问', '专家', '建议', '方案', '策略', '分析', '指导', '新闻', '动态']
  if (consultationKeywords.some(keyword => lowerQuery.includes(keyword))) {
    setActiveModule('consultation')
    ElMessage.success('已打开AI大爆炸服务')
    return { success: true, message: '已打开AI大爆炸' }
  }
  
  // 待办事项相关处理
  const todoKeywords = ['待办', '任务', 'todo', '清单', '计划', '提醒']
  if (todoKeywords.some(keyword => lowerQuery.includes(keyword))) {
    const content = query.replace(new RegExp(todoKeywords.join('|'), 'gi'), '').trim()
    
    if (content) {
      return await createTodo(content)
    } else {
      setActiveModule('todos')
      return { success: true, message: '已打开待办事项' }
    }
  }
  
  // 设置相关处理
  const settingsKeywords = ['设置', '配置', 'settings', '偏好', '选项']
  if (settingsKeywords.some(keyword => lowerQuery.includes(keyword))) {
    showSettings.value = true
    return { success: true, message: '已打开设置' }
  }
  
  // 搜索相关处理
  const searchKeywords = ['搜索', 'search', '查找', '寻找']
  if (searchKeywords.some(keyword => lowerQuery.includes(keyword))) {
    const content = query.replace(new RegExp(searchKeywords.join('|'), 'gi'), '').trim()
    if (content) {
      handleSearch(content)
      return { success: true, message: `正在搜索: ${content}` }
    }
  }
  
  // 默认处理：全局搜索
  handleSearch(query)
  return { success: true, message: `正在搜索: ${query}` }
}

// 创建笔记的辅助函数
const createNote = async (content: string) => {
  try {
    const newNote = {
      id: Date.now(),
      title: content.length > 20 ? content.substring(0, 20) + '...' : content,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    }
    
    await DatabaseManager.saveNote(newNote)
    ElMessage.success('笔记创建成功！')
    setActiveModule('notes')
    return { success: true, message: '笔记创建成功' }
  } catch (error) {
    console.error('创建笔记失败:', error)
    ElMessage.error('创建笔记失败，请重试')
    return { success: false, message: '创建笔记失败' }
  }
}

// 创建待办事项的辅助函数
const createTodo = async (content: string) => {
  try {
    const newTodo = {
      id: Date.now(),
      title: content,
      completed: false,
      priority: 'medium' as const,
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await DatabaseManager.saveTask(newTodo)
    ElMessage.success('待办事项创建成功！')
    setActiveModule('todos')
    return { success: true, message: '待办事项创建成功' }
  } catch (error) {
    console.error('创建待办事项失败:', error)
    ElMessage.error('创建待办事项失败，请重试')
    return { success: false, message: '创建待办事项失败' }
  }
}

const applySuggestion = async (suggestion: any) => {
  const query = searchQuery.value.trim()
  
  switch (suggestion.type) {
    case 'notes':
      if (suggestion.action === 'create' && query) {
        const content = query.replace(/笔记|记事|note|创建笔记/gi, '').trim() || query
        await createNote(content)
      } else {
        setActiveModule('notes')
      }
      break
    case 'chat':
      setActiveModule('chat')
      if (suggestion.action === 'chat' && query) {
        const content = query.replace(/ai|对话|聊天|chat|询问AI/gi, '').trim()
        if (content) {
          ElMessage.success(`正在为您准备AI对话: ${content}`)
        }
      }
      break
    case 'todos':
      if (suggestion.action === 'create' && query) {
        const content = query.replace(/待办|任务|todo|创建任务/gi, '').trim() || query
        await createTodo(content)
      } else {
        setActiveModule('todos')
      }
      break
    case 'settings':
      showSettings.value = true
      break
    case 'search':
      const searchContent = query.replace(/搜索|search|查找|寻找/gi, '').trim() || query
      handleSearch(searchContent)
      break
  }
  
  searchQuery.value = ''
  searchSuggestions.value = []
}

// 开始AI大爆炸
const startConsultation = (consultation: any) => {
  // 跳转到AI大爆炸页面
  router.push({
    path: '/ai-consultation',
    query: {
      service: consultation.service || 'writing'
    }
  })
  console.log('开始AI大爆炸:', consultation.title)
}

// 统一信息流相关方法
const getPriorityText = (priority: string) => {
  const priorityMap = {
    urgent: '紧急',
    high: '重要',
    medium: '普通',
    low: '低优先级'
  }
  return priorityMap[priority] || priority
}

const handleStreamItemClick = (item: any) => {
  if (!item) {
    console.warn('点击的项目为空')
    return
  }
  
  try {
    if (item.originalType === 'todo') {
      setActiveModule('todos')
    } else if (item.originalType === 'consultation') {
      startAIConsultation(item.originalData)
    } else if (item.originalType === 'ai-news') {
      // 处理AI动态信息点击，显示详细内容
      if (item.originalData && item.originalData.fullContent) {
        showAINewsDetail(item)
      } else {
        ElMessage.warning('暂无详细内容')
      }
    } else {
      console.warn('未知的项目类型:', item)
    }
  } catch (error) {
    console.error('处理项目点击失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 显示AI动态详情
const showAINewsDetail = (item: any) => {
  ElMessageBox({
    title: item.title,
    message: h('div', {
      style: {
        maxHeight: '60vh',
        overflow: 'auto',
        padding: '10px 0',
        lineHeight: '1.6',
        fontSize: '14px'
      }
    }, [
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px',
          paddingBottom: '10px',
          borderBottom: '1px solid #eee'
        }
      }, [
        h('span', { style: { fontSize: '20px', marginRight: '8px' } }, item.icon),
        h('span', { style: { color: '#409eff', fontSize: '12px', fontWeight: 'bold' } }, item.type),
        h('span', { style: { marginLeft: 'auto', color: '#999', fontSize: '12px' } }, item.time)
      ]),
      h('div', {
        style: {
          whiteSpace: 'pre-line',
          color: '#333'
        }
      }, item.originalData.fullContent),
      h('div', {
        style: {
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #eee',
          textAlign: 'center'
        }
      }, [
        h('a', {
          href: item.originalData.url,
          target: '_blank',
          style: {
            color: '#409eff',
            textDecoration: 'none',
            fontSize: '12px'
          }
        }, '查看原文链接 →')
      ])
    ]),
    showCancelButton: false,
    confirmButtonText: '关闭',
    customClass: 'ai-news-detail-dialog',
    dangerouslyUseHTMLString: false
  }).catch(() => {})
}

// 启动AI咨询
const startAIConsultation = (consultationData: any) => {
  try {
    // 切换到AI咨询模块
    setActiveModule('ai-consultation')
    
    // 如果有咨询数据，可以在这里处理
    if (consultationData) {
      console.log('启动AI咨询，数据:', consultationData)
      // 这里可以添加更多的咨询数据处理逻辑
      // 比如设置初始问题、历史记录等
    }
    
    ElMessage.success('已切换到AI咨询')
  } catch (error) {
    console.error('启动AI咨询失败:', error)
    ElMessage.error('启动AI咨询失败，请重试')
  }
}

const setCurrentStreamIndex = (index: number) => {
  currentStreamIndex.value = index
  resetStreamTimer()
}

const startStreamRotation = () => {
  if (streamItems.value.length <= 1) return
  
  streamTimer.value = setInterval(() => {
    currentStreamIndex.value = (currentStreamIndex.value + 1) % streamItems.value.length
  }, 5000) // 每5秒切换一次
}

const resetStreamTimer = () => {
  if (streamTimer.value) {
    clearInterval(streamTimer.value)
    streamTimer.value = null
  }
  startStreamRotation()
}

const buildStreamItems = () => {
  const items = []
  
  // 先添加AI最新动态信息（优先显示，丰富内容）
  const aiUpdates = [
    {
      icon: '🚀',
      type: 'AI动态',
      title: 'OpenAI GPT-4o 重大更新',
      description: 'OpenAI发布GPT-4o最新版本，在多模态理解、代码生成和创意写作方面实现重大突破。新版本支持更长的上下文窗口，处理复杂任务的准确性提升40%，同时推理速度提升2倍。特别在图像分析、文档理解和编程辅助方面表现卓越，为开发者和创作者带来全新体验。',
      priority: 'high',
      time: '2小时前',
      actionText: '了解详情',
      originalType: 'ai-news',
      originalData: { 
        url: 'https://openai.com/gpt-4o',
        fullContent: 'OpenAI今日正式发布GPT-4o的重大更新版本，这是继GPT-4发布以来最重要的技术突破。新版本在多个核心能力上实现了显著提升：\n\n**多模态理解能力**：支持同时处理文本、图像、音频和视频内容，能够理解复杂的多媒体信息并生成相应的回应。在图像分析任务中，准确率提升了35%，特别是在医学影像、工程图纸和艺术作品分析方面表现突出。\n\n**代码生成优化**：编程能力大幅提升，支持50+编程语言，代码质量和执行效率显著改善。新增了代码审查、性能优化建议和安全漏洞检测功能，帮助开发者写出更高质量的代码。\n\n**创意写作增强**：在文学创作、营销文案、学术写作等领域表现更加出色，能够根据用户需求调整写作风格和语调，生成更具个性化的内容。\n\n**上下文窗口扩展**：支持处理更长的文档和对话历史，最大上下文长度提升至128K tokens，能够处理完整的技术文档、学术论文和长篇小说。\n\n**推理速度优化**：通过算法优化和硬件升级，响应速度提升2倍，同时保持高质量输出。这使得实时对话和大规模应用成为可能。\n\n这次更新标志着AI技术在实用性和可靠性方面的重要进步，为各行各业的数字化转型提供了强有力的技术支撑。'
      }
    },
    {
      icon: '⚡',
      type: 'AI动态',
      title: 'Claude 3.5 编程能力突破',
      description: 'Anthropic发布Claude 3.5 Sonnet最新版本，在复杂编程任务中表现超越GPT-4。新版本在代码理解、调试和重构方面实现重大突破，支持全栈开发辅助，能够处理大型项目架构设计。特别在Python、JavaScript、Go等主流语言的代码质量评估和优化建议方面表现卓越。',
      priority: 'high',
      time: '6小时前',
      actionText: '查看更新',
      originalType: 'ai-news',
      originalData: { 
        url: 'https://anthropic.com/claude-3-5',
        fullContent: 'Anthropic今日宣布Claude 3.5 Sonnet的重大更新，这是该公司在AI编程辅助领域的重要里程碑。新版本在多个技术维度实现了突破性进展：\n\n**代码理解能力**：能够深度理解复杂的代码逻辑和架构设计，准确识别代码中的设计模式、算法实现和潜在问题。在代码审查任务中，准确率达到95%以上，超越了人类高级工程师的平均水平。\n\n**调试和错误修复**：具备强大的调试能力，能够快速定位bug的根本原因，并提供多种修复方案。支持静态代码分析、运行时错误诊断和性能瓶颈识别。\n\n**代码重构优化**：能够分析现有代码的结构和性能，提供重构建议以提高代码的可维护性、可读性和执行效率。支持大规模代码库的重构规划和实施指导。\n\n**全栈开发支持**：从前端UI设计到后端API开发，从数据库设计到部署配置，提供全方位的开发辅助。特别在微服务架构、云原生应用和DevOps实践方面表现突出。\n\n**多语言精通**：深度支持Python、JavaScript、TypeScript、Go、Rust、Java、C++等主流编程语言，能够进行跨语言的代码转换和最佳实践建议。\n\n**项目架构设计**：能够根据需求分析，设计合理的系统架构，包括技术选型、模块划分、接口设计等，为大型项目提供技术决策支持。\n\n这次更新使Claude 3.5成为开发者的得力助手，不仅能够提高编程效率，还能帮助团队提升代码质量和项目成功率。'
      }
    },
    {
      icon: '🧠',
      type: 'AI动态',
      title: 'Gemini Ultra 多模态升级',
      description: 'Google最新发布的Gemini Ultra在图像理解和视频分析能力方面实现大幅提升。新版本支持实时视频流分析，能够识别复杂场景中的多个对象和动作，准确率提升50%。在医疗影像诊断、自动驾驶视觉系统和智能监控等领域展现出巨大潜力，为AI在垂直行业的应用开辟了新的可能性。',
      priority: 'medium',
      time: '12小时前',
      actionText: '探索功能',
      originalType: 'ai-news',
      originalData: { 
        url: 'https://deepmind.google/gemini-ultra',
        fullContent: 'Google DeepMind团队今日发布Gemini Ultra的重大更新，专注于多模态AI能力的全面提升。这次更新在视觉理解和分析方面实现了革命性突破：\n\n**图像理解增强**：新版本能够理解复杂的视觉场景，包括艺术作品分析、技术图表解读、医学影像诊断等。在图像描述任务中，准确性和详细程度都有显著提升，能够识别细微的视觉元素和上下文关系。\n\n**实时视频分析**：支持实时视频流处理，能够跟踪多个对象的运动轨迹，理解动作序列和行为模式。这项技术在体育分析、安全监控和自动驾驶等领域具有重要应用价值。\n\n**3D空间理解**：具备三维空间感知能力，能够理解物体的空间关系、深度信息和几何结构。这为AR/VR应用、机器人导航和建筑设计等领域提供了强大的技术支撑。\n\n**跨模态推理**：能够结合文本、图像、音频等多种信息源进行综合推理，提供更准确和全面的分析结果。在复杂决策任务中表现出色。\n\n**行业应用突破**：\n- 医疗领域：辅助医生进行影像诊断，提高诊断准确率和效率\n- 自动驾驶：增强车辆的环境感知和决策能力\n- 智能制造：实现生产线的智能监控和质量控制\n- 教育科研：为科学研究提供强大的数据分析工具\n\n这次更新标志着AI技术在多模态理解方面的重要进步，为各行各业的智能化转型提供了新的技术路径。'
      }
    },
    {
      icon: '🔬',
      type: 'AI动态',
      title: 'Meta发布Code Llama 2.0',
      description: 'Meta AI团队发布Code Llama 2.0，这是专门针对代码生成和理解优化的大语言模型。新版本在代码补全、bug修复和代码解释方面表现卓越，支持100+编程语言。模型采用全新的训练架构，在保持高质量输出的同时，推理速度提升3倍，为开发者提供更高效的编程辅助体验。',
      priority: 'medium',
      time: '1天前',
      actionText: '了解详情',
      originalType: 'ai-news',
      originalData: { 
        url: 'https://ai.meta.com/code-llama',
        fullContent: 'Meta AI团队正式发布Code Llama 2.0，这是继第一代Code Llama之后的重大升级版本。新版本专注于提升代码相关任务的处理能力：\n\n**代码生成优化**：支持100+编程语言的代码生成，包括主流语言如Python、JavaScript、Java、C++，以及新兴语言如Rust、Go、Swift等。生成的代码质量更高，语法错误率降低80%。\n\n**智能代码补全**：提供上下文感知的代码补全功能，能够理解项目结构和编码风格，生成符合项目规范的代码片段。支持函数、类、模块等不同粒度的代码补全。\n\n**Bug检测与修复**：具备强大的代码分析能力，能够识别常见的编程错误、性能问题和安全漏洞，并提供具体的修复建议和代码示例。\n\n**代码解释与文档**：能够为复杂的代码逻辑生成清晰的注释和文档，帮助开发者理解和维护代码。支持多种文档格式和注释风格。\n\n**性能优化**：\n- 推理速度提升3倍，响应更加迅速\n- 内存使用优化，支持在资源受限的环境中运行\n- 支持批量处理，提高大规模代码分析的效率\n\n**集成友好**：提供丰富的API接口和SDK，方便集成到各种开发工具和IDE中。支持VS Code、IntelliJ IDEA、Vim等主流编辑器的插件开发。\n\nCode Llama 2.0的发布为开发者社区带来了更强大的AI编程助手，有望显著提升软件开发的效率和质量。'
      }
    },
    {
      icon: '🎨',
      type: 'AI动态',
      title: 'Midjourney V6 艺术创作革新',
      description: 'Midjourney发布V6版本，在艺术创作和图像生成方面实现重大突破。新版本支持更精确的提示词理解，图像质量和细节表现力显著提升。增加了风格一致性控制、人物面部优化和建筑设计等专业功能，为设计师、艺术家和创意工作者提供更强大的创作工具，开启AI辅助创意设计的新时代。',
      priority: 'medium',
      time: '2天前',
      actionText: '查看作品',
      originalType: 'ai-news',
      originalData: { 
        url: 'https://midjourney.com/v6',
        fullContent: 'Midjourney团队发布了备受期待的V6版本，这是该平台在AI艺术生成领域的又一重大突破。新版本在多个方面实现了显著改进：\n\n**提示词理解升级**：V6版本对自然语言提示词的理解能力大幅提升，能够更准确地捕捉用户的创意意图。支持复杂的场景描述、情感表达和艺术风格指定。\n\n**图像质量提升**：生成图像的分辨率、细节表现和色彩还原度都有显著改善。特别在人物肖像、自然风景和建筑设计方面，达到了接近专业摄影的质量水准。\n\n**风格一致性控制**：新增风格参考功能，用户可以上传参考图像来指导生成风格，确保系列作品的视觉一致性。这对品牌设计和项目创作具有重要意义。\n\n**专业功能增强**：\n- 人物面部优化：改善人物面部特征的生成质量，减少变形和不自然的表现\n- 建筑设计支持：增强对建筑结构、空间关系的理解和表现能力\n- 产品设计辅助：支持工业设计、包装设计等商业应用场景\n\n**创作工作流优化**：\n- 批量生成功能，提高创作效率\n- 版本对比工具，方便选择最佳方案\n- 协作功能增强，支持团队创作项目\n\n**应用领域拓展**：\n- 广告设计：为营销活动提供创意视觉素材\n- 游戏开发：辅助概念设计和场景创作\n- 影视制作：提供分镜头和概念图支持\n- 教育培训：为设计教学提供丰富的案例素材\n\nMidjourney V6的发布标志着AI艺术创作工具的成熟化，为创意产业带来了新的可能性和机遇。'
      }
    }
  ]
  
  // 添加AI大爆炸服务（丰富内容）
  const consultations = [
    {
      icon: '✍️',
      type: 'AI大爆炸',
      title: '智能写作助手',
      description: '专业的AI写作助手，支持多种文体创作包括商务邮件、学术论文、创意文案、技术文档等。具备语言润色、结构优化、风格调整功能，能够根据目标受众和使用场景生成高质量内容。支持中英文写作，提供实时语法检查和改进建议，让您的文字表达更加专业和有说服力。',
      priority: 'high',
      time: '随时可用',
      actionText: '开始写作',
      originalType: 'consultation',
      originalData: { 
        id: '1', 
        service: 'writing',
        fullContent: '智能写作助手是一款专业的AI写作工具，为用户提供全方位的写作支持和优化服务：\n\n**多文体支持**：\n- 商务写作：邮件、报告、提案、合同等商务文档\n- 学术写作：论文、研究报告、文献综述、学术摘要\n- 创意写作：小说、诗歌、剧本、广告文案\n- 技术写作：用户手册、API文档、技术规范\n- 日常写作：日记、博客、社交媒体内容\n\n**核心功能**：\n- 内容生成：根据主题和要求生成原创内容\n- 语言润色：改善语法、用词和表达方式\n- 结构优化：调整文章逻辑结构和段落组织\n- 风格调整：适应不同的写作风格和语调\n- 多语言支持：中文、英文等多种语言写作\n\n**智能特性**：\n- 上下文理解：理解写作背景和目标受众\n- 实时建议：提供即时的改进建议和优化方案\n- 版本对比：展示修改前后的对比效果\n- 模板库：提供丰富的写作模板和范例\n\n**应用场景**：\n- 职场办公：提升商务沟通效率\n- 学术研究：辅助学术写作和发表\n- 内容创作：支持自媒体和内容营销\n- 教育培训：帮助学生提高写作能力\n\n让AI成为您的专业写作伙伴，提升写作效率和质量。'
      }
    },
    {
      icon: '💻',
      type: 'AI大爆炸',
      title: '编程开发顾问',
      description: '专业的AI编程助手，提供全栈开发支持包括前端、后端、移动端和桌面应用开发。支持50+编程语言，具备代码生成、调试、重构、性能优化等功能。能够进行架构设计咨询、技术选型建议、代码审查和最佳实践指导，帮助开发者提升编程技能和项目质量。',
      priority: 'high',
      time: '随时可用',
      actionText: '开始编程',
      originalType: 'consultation',
      originalData: { 
        id: '2', 
        service: 'coding',
        fullContent: '编程开发顾问是专业的AI编程助手，为开发者提供全方位的技术支持和开发指导：\n\n**技术栈支持**：\n- 前端开发：React、Vue、Angular、HTML/CSS/JavaScript\n- 后端开发：Node.js、Python、Java、Go、C#、PHP\n- 移动开发：React Native、Flutter、iOS、Android\n- 桌面应用：Electron、Qt、WPF、Swing\n- 数据库：MySQL、PostgreSQL、MongoDB、Redis\n- 云服务：AWS、Azure、Google Cloud、阿里云\n\n**核心服务**：\n- 代码生成：根据需求生成高质量代码\n- 代码审查：识别潜在问题和改进机会\n- 调试支持：快速定位和解决bug\n- 性能优化：提升应用性能和用户体验\n- 重构指导：改善代码结构和可维护性\n\n**架构咨询**：\n- 系统设计：微服务、分布式系统架构\n- 技术选型：根据项目需求推荐最佳技术栈\n- 数据库设计：优化数据模型和查询性能\n- 安全咨询：代码安全和系统安全最佳实践\n\n**学习支持**：\n- 技术教学：从基础到高级的编程概念讲解\n- 项目指导：端到端项目开发指导\n- 面试准备：技术面试题目和解答技巧\n- 职业规划：技术发展路径建议\n\n**特色功能**：\n- 多语言支持：精通50+编程语言\n- 实时协作：支持结对编程和代码讨论\n- 文档生成：自动生成技术文档和注释\n- 测试支持：单元测试、集成测试指导\n\n让AI成为您的编程伙伴，加速开发进程，提升代码质量。'
      }
    },
    {
      icon: '📚',
      type: 'AI大爆炸',
      title: '学习成长导师',
      description: '个性化的AI学习助手，提供定制化学习方案和知识辅导。涵盖语言学习、专业技能提升、考试备考、职业发展等多个领域。具备智能评估、学习路径规划、进度跟踪、知识点解析等功能。能够根据学习者的基础水平和目标制定最适合的学习计划，提供高效的学习体验。',
      priority: 'medium',
      time: '随时可用',
      actionText: '开始学习',
      originalType: 'consultation',
      originalData: { 
        id: '3', 
        service: 'learning',
        fullContent: '学习成长导师是专业的AI学习助手，为学习者提供个性化的学习支持和成长指导：\n\n**学习领域**：\n- 语言学习：英语、日语、韩语、法语等多种语言\n- 专业技能：编程、设计、营销、财务、管理等\n- 学科教育：数学、物理、化学、历史、文学等\n- 考试备考：托福、雅思、GRE、公务员、职业资格考试\n- 职业发展：职场技能、领导力、沟通能力提升\n\n**核心功能**：\n- 水平评估：准确评估当前知识水平和能力\n- 学习规划：制定个性化的学习路径和时间安排\n- 内容推荐：推荐最适合的学习资源和材料\n- 进度跟踪：实时监控学习进度和效果\n- 智能答疑：解答学习过程中的疑问和难点\n\n**学习方法**：\n- 互动教学：通过对话式教学提高学习效果\n- 案例分析：结合实际案例加深理解\n- 练习测试：提供针对性的练习和测试\n- 记忆技巧：教授高效的记忆和学习方法\n- 思维导图：帮助构建知识体系和逻辑框架\n\n**个性化服务**：\n- 学习风格适配：根据个人学习偏好调整教学方式\n- 难度调节：动态调整学习内容的难度级别\n- 时间管理：帮助制定合理的学习时间安排\n- 动机激励：提供学习动力和成就感\n\n**特色功能**：\n- 多模态学习：支持文字、图像、音频等多种学习方式\n- 社交学习：连接学习伙伴，促进交流和讨论\n- 成果展示：记录和展示学习成果和进步\n- 持续优化：根据学习效果不断优化学习方案\n\n让AI成为您的学习伙伴，开启高效学习之旅，实现个人成长目标。'
      }
    },
    {
      icon: '💼',
      type: 'AI大爆炸',
      title: '商业策略分析师',
      description: '专业的AI商业顾问，提供市场分析、商业模式设计、竞争策略制定等服务。具备数据分析、趋势预测、风险评估、投资建议等能力。能够帮助企业和创业者进行商业决策、市场定位、产品规划和运营优化，提供基于数据驱动的商业洞察和战略建议。',
      priority: 'medium',
      time: '随时可用',
      actionText: '商业咨询',
      originalType: 'consultation',
      originalData: { 
        id: '4', 
        service: 'business',
        fullContent: '商业策略分析师是专业的AI商业顾问，为企业和创业者提供全方位的商业咨询和战略指导：\n\n**核心服务**：\n- 市场分析：深入分析目标市场规模、增长趋势和机会\n- 竞争分析：评估竞争对手策略和市场定位\n- 商业模式设计：构建可持续的商业模式和盈利模式\n- 战略规划：制定短期和长期的发展战略\n- 风险评估：识别和评估商业风险及应对策略\n\n**专业能力**：\n- 数据分析：处理和分析大量商业数据\n- 趋势预测：基于历史数据预测市场趋势\n- 财务建模：构建财务模型和投资回报分析\n- 用户研究：分析用户需求和行为模式\n- 产品策略：制定产品开发和迭代策略\n\n**咨询领域**：\n- 创业指导：从创意到商业计划的全程指导\n- 企业转型：帮助传统企业进行数字化转型\n- 投资分析：评估投资项目的可行性和回报\n- 营销策略：制定品牌推广和市场营销方案\n- 运营优化：提升运营效率和成本控制\n\n**行业专长**：\n- 科技互联网：SaaS、电商、移动应用等\n- 传统制造：工业4.0、智能制造转型\n- 服务行业：餐饮、零售、教育、医疗等\n- 金融科技：数字支付、区块链、保险科技\n- 新兴产业：新能源、生物技术、人工智能\n\n**决策支持**：\n- 数据驱动：基于客观数据提供决策建议\n- 多维分析：从多个角度全面分析商业问题\n- 场景模拟：模拟不同策略的可能结果\n- 实施指导：提供具体的执行方案和时间表\n\n**特色服务**：\n- 实时咨询：随时提供商业问题的专业建议\n- 报告生成：自动生成专业的分析报告\n- 持续跟踪：跟踪策略执行效果并及时调整\n- 行业洞察：提供最新的行业动态和趋势分析\n\n让AI成为您的商业智囊，助力商业成功和企业发展。'
      }
    }
  ]
  
  // 添加重要待办事项
  const todos = []
  importantTodos.value.forEach(todo => {
    todos.push({
      icon: '📋',
      type: '重要待办',
      title: todo.title,
      description: `截止时间：${formatTime(todo.dueDate)} | 优先级：${getPriorityText(todo.priority)}`,
      priority: todo.priority,
      time: formatTime(todo.dueDate),
      actionText: '查看详情',
      originalType: 'todo',
      originalData: todo
    })
  })
  
  // 按优先级排序并穿插显示：AI动态 -> AI大爆炸 -> 重要待办
  items.push(...aiUpdates)
  items.push(...consultations)
  items.push(...todos)
  
  // 重新排序：AI内容优先，然后穿插显示
  const sortedItems = []
  const aiItems = items.filter(item => item.type.includes('AI'))
  const todoItems = items.filter(item => item.type === '重要待办')
  
  // 穿插显示：每2个AI相关内容后插入1个待办
  let aiIndex = 0
  let todoIndex = 0
  
  while (aiIndex < aiItems.length || todoIndex < todoItems.length) {
    // 添加2个AI相关内容
    for (let i = 0; i < 2 && aiIndex < aiItems.length; i++) {
      sortedItems.push(aiItems[aiIndex++])
    }
    // 添加1个待办事项
    if (todoIndex < todoItems.length) {
      sortedItems.push(todoItems[todoIndex++])
    }
  }
  
  streamItems.value = sortedItems
  if (sortedItems.length > 0) {
    currentStreamIndex.value = 0
    resetStreamTimer()
  }
}

// 六爻占卜功能方法
const performDivination = async () => {
  divinationLoading.value = true
  currentDivination.value = null
  
  // 模拟六爻占卜过程
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // 生成六爻卦象
  const liuyaoResult = generateLiuyaoHexagram()
  
  // 64卦完整数据
  const hexagrams64 = {
    '111111': { name: '乾为天', symbol: '☰☰', meaning: '元亨利贞，刚健中正', nature: '天', element: '金' },
    '000000': { name: '坤为地', symbol: '☷☷', meaning: '厚德载物，柔顺包容', nature: '地', element: '土' },
    '100010': { name: '水雷屯', symbol: '☵☳', meaning: '万物始生，艰难创业', nature: '雷水', element: '木水' },
    '010001': { name: '山水蒙', symbol: '☶☵', meaning: '启蒙教育，循序渐进', nature: '山水', element: '土水' },
    '111010': { name: '水天需', symbol: '☵☰', meaning: '等待时机，蓄势待发', nature: '水天', element: '水金' },
    '010111': { name: '天水讼', symbol: '☰☵', meaning: '争讼纠纷，慎重处理', nature: '天水', element: '金水' },
    '010000': { name: '地水师', symbol: '☷☵', meaning: '统帅军队，纪律严明', nature: '地水', element: '土水' },
    '000010': { name: '水地比', symbol: '☵☷', meaning: '亲密合作，和谐相处', nature: '水地', element: '水土' }
    // 这里只列出部分卦象，实际应包含全部64卦
  }
  
  const interpretations = {
    general: [
      '运势平稳上升，宜积极进取，但需谨慎行事，避免冒进。',
      '近期运势较为波动，需要保持耐心，等待时机成熟。',
      '运势渐入佳境，是展现才华的好时机，把握机会。',
      '运势稍有阻滞，宜以静制动，修身养性为上策。'
    ],
    love: [
      '感情运势良好，单身者有望遇到心仪对象，有伴者感情稳定。',
      '感情方面需要更多沟通理解，避免因小事产生误会。',
      '桃花运旺盛，但需要慎重选择，避免陷入复杂关系。',
      '感情需要时间沉淀，不宜急于求成，顺其自然为佳。'
    ],
    career: [
      '事业运势上升，工作中会有新的机遇出现，宜积极把握。',
      '职场竞争激烈，需要提升自身能力，保持竞争优势。',
      '财运亨通，投资理财方面会有不错的收益，但需谨慎。',
      '事业发展需要贵人相助，多与他人合作，互利共赢。'
    ],
    health: [
      '身体健康状况良好，但需注意劳逸结合，避免过度疲劳。',
      '需要关注肠胃健康，饮食宜清淡，作息要规律。',
      '精神状态佳，但要注意情绪管理，保持心态平和。',
      '适合进行体育锻炼，增强体质，提高免疫力。'
    ],
    study: [
      '学习运势良好，思维敏捷，是提升自己的好时机。',
      '学习中会遇到一些困难，需要坚持不懈，寻求帮助。',
      '考试运势不错，但需要充分准备，不可掉以轻心。',
      '适合学习新技能，拓展知识面，为未来发展做准备。'
    ],
    travel: [
      '出行运势佳，旅途愉快，会有意外收获和美好回忆。',
      '出行需要注意安全，做好充分准备，避免意外情况。',
      '适合短途旅行，放松身心，但不宜远行。',
      '旅行中会遇到贵人，可能带来新的机遇和合作。'
    ]
  }
  
  const advices = {
    general: [
      '保持积极心态，相信自己的能力，勇敢面对挑战。',
      '多与智者交流，听取他人建议，完善自己的计划。',
      '注重细节，做事要有始有终，不可半途而废。',
      '适当休息调整，保持身心健康，为未来蓄力。'
    ],
    love: [
      '真诚待人，用心经营感情，珍惜身边的人。',
      '学会包容理解，多站在对方角度思考问题。',
      '不要过于急躁，感情需要时间培养和沉淀。',
      '保持自己的独立性，不要完全依赖他人。'
    ],
    career: [
      '持续学习提升，跟上时代发展的步伐。',
      '建立良好的人际关系，扩大自己的社交圈。',
      '制定明确的目标，并为之努力奋斗。',
      '保持诚信原则，以德服人，赢得他人信任。'
    ],
    health: [
      '规律作息，早睡早起，养成良好的生活习惯。',
      '适量运动，增强体质，提高身体抵抗力。',
      '保持心情愉悦，学会释放压力和负面情绪。',
      '定期体检，关注身体变化，预防疾病发生。'
    ],
    study: [
      '制定合理的学习计划，循序渐进地提升自己。',
      '多实践应用，将理论知识转化为实际能力。',
      '保持好奇心，主动探索新的知识领域。',
      '与同学老师多交流，共同进步成长。'
    ],
    travel: [
      '提前做好行程规划，了解目的地的风土人情。',
      '保持开放心态，体验不同的文化和生活方式。',
      '注意安全第一，随时与家人朋友保持联系。',
      '记录旅行点滴，留下美好的回忆和感悟。'
    ]
  }
  
  // 根据卦象二进制查找对应的卦
  const originalHexagram = hexagrams64[liuyaoResult.originalBinary] || {
    name: '未知卦象',
    symbol: '？？',
    meaning: '卦象解析中...',
    nature: '未知',
    element: '未知'
  }
  
  const changedHexagram = liuyaoResult.hasChangingLines ? 
    (hexagrams64[liuyaoResult.changedBinary] || originalHexagram) : null
  
  const typeInterpretations = interpretations[selectedDivinationType.value] || interpretations.general
  const typeAdvices = advices[selectedDivinationType.value] || advices.general
  
  const divination = {
    id: Date.now(),
    type: selectedDivinationType.value,
    timestamp: new Date(),
    liuyao: liuyaoResult,
    originalHexagram,
    changedHexagram,
    interpretation: typeInterpretations[Math.floor(Math.random() * typeInterpretations.length)],
    advice: typeAdvices[Math.floor(Math.random() * typeAdvices.length)],
    // 保持向后兼容
    hexagram: {
      symbol: originalHexagram.symbol,
      name: originalHexagram.name,
      meaning: originalHexagram.meaning
    }
  }
  
  currentDivination.value = divination
  divinationHistory.value.unshift(divination)
  
  // 保持历史记录不超过10条
  if (divinationHistory.value.length > 10) {
    divinationHistory.value = divinationHistory.value.slice(0, 10)
  }
  
  divinationLoading.value = false
}

// 生成六爻卦象的核心函数
const generateLiuyaoHexagram = () => {
  // 生成六个爻位，每个爻位通过投掷三枚铜钱决定
  const yaoLines = []
  const coinResults = []
  
  for (let i = 0; i < 6; i++) {
    // 模拟投掷三枚铜钱，正面为3，反面为2
    const coins = []
    let sum = 0
    for (let j = 0; j < 3; j++) {
      const coin = Math.random() > 0.5 ? 3 : 2 // 正面3分，反面2分
      coins.push(coin === 3 ? '正' : '反')
      sum += coin
    }
    coinResults.push({ coins, sum })
    
    // 根据总分确定爻的性质
    // 6分：老阴（变爻）- - X
    // 7分：少阳（不变）—
    // 8分：少阴（不变）- -
    // 9分：老阳（变爻）— O
    let yaoType, yaoSymbol, isChanging
    switch (sum) {
      case 6:
        yaoType = '老阴'
        yaoSymbol = '- - X'
        isChanging = true
        break
      case 7:
        yaoType = '少阳'
        yaoSymbol = '—'
        isChanging = false
        break
      case 8:
        yaoType = '少阴'
        yaoSymbol = '- -'
        isChanging = false
        break
      case 9:
        yaoType = '老阳'
        yaoSymbol = '— O'
        isChanging = true
        break
    }
    
    yaoLines.push({
      position: i + 1,
      type: yaoType,
      symbol: yaoSymbol,
      isChanging,
      coins: coins.join(''),
      sum
    })
  }
  
  // 生成本卦和变卦的二进制表示
  const originalBinary = yaoLines.map(yao => 
    (yao.type === '少阳' || yao.type === '老阳') ? '1' : '0'
  ).reverse().join('') // 从下往上排列
  
  const changedBinary = yaoLines.map(yao => {
    if (yao.isChanging) {
      return (yao.type === '老阳') ? '0' : '1' // 老阳变少阴，老阴变少阳
    }
    return (yao.type === '少阳' || yao.type === '老阳') ? '1' : '0'
  }).reverse().join('')
  
  return {
    yaoLines: yaoLines.reverse(), // 从上到下显示（第六爻到第一爻）
    coinResults: coinResults.reverse(),
    originalBinary,
    changedBinary,
    hasChangingLines: yaoLines.some(yao => yao.isChanging)
  }
}

const viewDivinationRecord = (record) => {
  currentDivination.value = record
  showDivinationHistory.value = false
}

const getDivinationTypeName = (typeId) => {
  const type = divinationTypes.value.find(t => t.id === typeId)
  return type ? type.name : '未知'
}

// 初始化日期信息
const initDateInfo = () => {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  
  currentDate.value = {
    day: now.getDate(),
    monthYear: `${now.getFullYear()}年${months[now.getMonth()]}`,
    weekday: weekdays[now.getDay()],
    lunar: getLunarDate(now)
  }
}

// 获取农历日期（简化版）
const getLunarDate = (date: Date | null | undefined) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '农历未知'
  }
  
  // 这里使用简化的农历计算，实际项目中可以使用专门的农历库
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                     '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                     '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
  
  try {
    // 简化计算，实际应该使用准确的农历转换算法
    const yearStart = new Date(date.getFullYear(), 0, 1)
    const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
    const lunarMonth = Math.floor(dayOfYear / 30) % 12
    const lunarDay = (dayOfYear % 30)
    
    return `${lunarMonths[lunarMonth]}${lunarDays[lunarDay]}`
  } catch (error) {
    console.warn('农历日期计算错误:', error)
    return '农历未知'
  }
}

// 初始化今日运势
const initTodayFortune = () => {
  const fortunes = [
    { 
      level: 'excellent', 
      text: '大吉', 
      icon: '🌟', 
      description: '今日运势极佳，诸事顺利，适合重要决策',
      huangliInfo: {
        title: '黄历大吉日',
        explanation: '黄历是中国传统历法，记录每日宜忌。今日为黄道吉日，天时地利人和，五行相生，气场和谐。',
        suitable: ['开业', '签约', '投资', '求婚', '搬家', '出行'],
        avoid: ['争吵', '借贷', '手术'],
        reason: '今日天干地支相合，五行流通顺畅，贵人运旺盛，是难得的吉祥之日。星象显示紫微星高照，利于一切正面积极的行动。',
        tips: '把握良机，积极行动，但也要保持谦逊，感恩当下的好运势。'
      }
    },
    { 
      level: 'good', 
      text: '吉', 
      icon: '✨', 
      description: '运势良好，工作顺心，人际关系和谐',
      huangliInfo: {
        title: '黄历吉日',
        explanation: '今日为小吉之日，整体运势向好。虽非大吉，但各方面都比较顺利，适合稳步推进各项计划。',
        suitable: ['工作', '学习', '社交', '理财', '健身'],
        avoid: ['冒险', '投机', '大额消费'],
        reason: '日柱与月柱相生，形成良好的能量场。虽有小的阻碍，但整体趋势向上，贵人相助明显。',
        tips: '保持积极心态，稳中求进，多与他人合作，会有意想不到的收获。'
      }
    },
    { 
      level: 'normal', 
      text: '平', 
      icon: '🌤️', 
      description: '运势平稳，保持平常心，稳中求进',
      huangliInfo: {
        title: '黄历平日',
        explanation: '今日为平常之日，无大吉大凶。运势如平静的湖水，适合日常事务的处理和内心的修养。',
        suitable: ['日常工作', '读书', '整理', '休息', '思考'],
        avoid: ['重大决策', '冒险行为', '情绪化行动'],
        reason: '五行平衡，阴阳调和，虽无特别的助力，但也无明显的阻碍。适合积蓄力量，为未来做准备。',
        tips: '保持平常心，专注于基础工作，为将来的机遇做好准备。平淡中见真章。'
      }
    },
    { 
      level: 'caution', 
      text: '小心', 
      icon: '⚠️', 
      description: '需谨慎行事，避免冲动决定，多听他人建议',
      huangliInfo: {
        title: '黄历忌日',
        explanation: '今日为小凶之日，需要格外谨慎。黄历显示今日煞气较重，容易出现意外或阻碍，宜静不宜动。',
        suitable: ['反思', '学习', '养生', '祈福', '整理'],
        avoid: ['签约', '开业', '投资', '争执', '远行'],
        reason: '日柱与流年相冲，形成不利的磁场。小人运较旺，容易遇到阻碍和误解，需要低调行事。',
        tips: '谨言慎行，多听少说，避免与人发生冲突。困难是暂时的，保持耐心等待转机。'
      }
    },
    { 
      level: 'poor', 
      text: '凶', 
      icon: '🌧️', 
      description: '运势较差，宜静不宜动，适合反思总结',
      huangliInfo: {
        title: '黄历凶日',
        explanation: '今日为大凶之日，诸事不宜。黄历记载今日为破日或绝日，五行相克严重，易生灾祸，应当避凶趋吉。',
        suitable: ['休息', '反省', '念经', '清理', '静修'],
        avoid: ['重要决策', '签约', '开业', '搬家', '手术', '投资'],
        reason: '天克地冲，五行失衡，负能量聚集。此日易遇小人，事业受阻，感情不顺，健康需要关注。',
        tips: '以静制动，多做善事积德。困境是成长的机会，保持信心，等待乌云散去见彩虹。'
      }
    }
  ]
  
  // 基于日期生成固定的运势（确保同一天的运势相同）
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const fortuneIndex = seed % fortunes.length
  
  todayFortune.value = fortunes[fortuneIndex]
}

// 格式化时间
const formatTime = (date: string | Date | null | undefined) => {
  if (!date) return ''
  
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '时间未知'
    
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
    if (days === 0) {
      return '今天'
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return d.toLocaleDateString()
    }
  } catch (error) {
    console.warn('时间格式化错误:', error)
    return '时间未知'
  }
 }

// 打开新闻链接
const openNewsLink = (url: string) => {
  window.open(url, '_blank')
}

// 显示详细运势信息
const showFortuneDetail = () => {
  const fortune = todayFortune.value
  if (!fortune || !fortune.huangliInfo) return
  
  const info = fortune.huangliInfo
  
  ElMessageBox({
    title: info.title,
    message: h('div', { class: 'fortune-detail-content' }, [
      h('div', { class: 'fortune-explanation' }, [
        h('h4', '📜 黄历说明'),
        h('p', info.explanation)
      ]),
      h('div', { class: 'fortune-suitable' }, [
        h('h4', '✅ 今日宜'),
        h('div', { class: 'fortune-tags' }, info.suitable.map(item => 
          h('span', { class: 'fortune-tag suitable' }, item)
        ))
      ]),
      h('div', { class: 'fortune-avoid' }, [
        h('h4', '❌ 今日忌'),
        h('div', { class: 'fortune-tags' }, info.avoid.map(item => 
          h('span', { class: 'fortune-tag avoid' }, item)
        ))
      ]),
      h('div', { class: 'fortune-reason' }, [
        h('h4', '🔍 运势原因'),
        h('p', info.reason)
      ]),
      h('div', { class: 'fortune-tips' }, [
        h('h4', '💡 建议'),
        h('p', info.tips)
      ])
    ]),
    showCancelButton: false,
    confirmButtonText: '知道了',
    customClass: 'fortune-detail-dialog'
  })
}



const handleLogoClick = () => {
  logoClickCount.value++
  
  // 连续点击5次显示设置
  if (logoClickCount.value >= 5) {
    showSettings.value = true
    logoClickCount.value = 0
  }
  
  // 2秒后重置计数
  setTimeout(() => {
    logoClickCount.value = 0
  }, 2000)
}

// 生命周期
onMounted(async () => {
  // 初始化日期和运势
  initDateInfo()
  initTodayFortune()
  // 加载统计数据
  await loadStats()
  // 加载重要待办事项
  await loadImportantTodos()
  // 加载AI新闻
  loadAINews()
  // 加载AI大爆炸
  loadAIConsultations()
  // 构建统一信息流
  buildStreamItems()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (streamTimer.value) {
    clearInterval(streamTimer.value)
  }
  // 清理番茄钟定时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

const loadStats = async () => {
  try {
    const notes = await DatabaseManager.getNotes()
    const chatSessions = await DatabaseManager.getChatSessions()
    const tasks = await DatabaseManager.getTasks()
    
    stats.value = {
      totalNotes: notes.length,
      totalTasks: tasks.length,
      totalChats: chatSessions.length,
      aiCalls: 156
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 使用默认数据
    stats.value = {
      totalNotes: 12,
      totalTasks: 8,
      totalChats: 5,
      aiCalls: 156
    }
  }
}

// 加载重要待办事项
const loadImportantTodos = async () => {
  try {
    const tasks = await DatabaseManager.getTasks()
    // 筛选重要且未完成的任务，按优先级和截止时间排序
    importantTodos.value = tasks
      .filter(task => !task.completed && (task.priority === 'high' || task.priority === 'urgent'))
      .sort((a, b) => {
        // 优先级排序：urgent > high
        if (a.priority !== b.priority) {
          return a.priority === 'urgent' ? -1 : 1
        }
        // 截止时间排序
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(0)
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(0)
        
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0 // 如果日期无效，保持原顺序
        }
        
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 5) // 只显示前5个
  } catch (error) {
    console.error('加载重要待办事项失败:', error)
    // 使用模拟数据
    importantTodos.value = [
      {
        id: '1',
        title: '完成项目报告',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: '准备会议材料',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
}

// 加载AI新闻
const loadAINews = () => {
  // 模拟AI新闻数据
  aiNews.value = [
    {
      id: '1',
      title: 'OpenAI发布GPT-4 Turbo新版本',
      summary: '新版本在推理能力和上下文长度方面有显著提升，支持更复杂的任务处理。',
      source: 'OpenAI官方',
      publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://openai.com'
    },
    {
      id: '2',
      title: 'Google Gemini Ultra在多项基准测试中超越GPT-4',
      summary: 'Gemini Ultra在数学、推理和代码生成等多个领域展现出卓越性能。',
      source: 'Google DeepMind',
      publishTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      url: 'https://deepmind.google'
    },
    {
      id: '3',
      title: 'Claude 3.5 Sonnet发布，编程能力大幅提升',
      summary: 'Anthropic最新发布的Claude 3.5 Sonnet在代码理解和生成方面表现优异。',
      source: 'Anthropic',
      publishTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      url: 'https://anthropic.com'
    }
  ]
}

// 加载AI大爆炸
const loadAIConsultations = () => {
  // AI大爆炸数据
  aiConsultations.value = [
    {
      id: '1',
      title: '智能写作助手',
      icon: '✍️',
      description: '帮助您撰写各类文档和报告'
    },
    {
      id: '2',
      title: '代码分析优化',
      icon: '🔧',
      description: '分析代码质量并提供优化建议'
    },
    {
      id: '3',
      title: '学习规划师',
      icon: '🎯',
      description: '制定个性化学习计划和目标'
    },
    {
      id: '4',
      title: '数据洞察分析',
      icon: '📈',
      description: '深度分析数据并提供见解'
    }
  ]
}


</script>

<style scoped>
/* CSS变量定义 */
:root {
  --bg-gradient: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  --gradient-primary: linear-gradient(45deg, #00d4ff, #a29bfe);
  --gradient-secondary: linear-gradient(45deg, #fd79a8, #fdcb6e);
  --gradient-neon: linear-gradient(45deg, #00d4ff, #4ecdc4, #00d4ff);
  --gradient-cyber: linear-gradient(135deg, #00d4ff 0%, #0099cc 25%, #4ecdc4 50%, #00d4ff 100%);
  --text-inverse: #ffffff;
  --text-tertiary: rgba(255, 255, 255, 0.7);
  --text-glow: rgba(0, 212, 255, 0.8);
  --bg-glass: rgba(255, 255, 255, 0.1);
  --bg-dark-glass: rgba(255, 255, 255, 0.15);
  --bg-cyber: rgba(0, 212, 255, 0.05);
  --border-color: rgba(255, 255, 255, 0.2);
  --border-neon: rgba(0, 212, 255, 0.6);
  --primary-color: #00d4ff;
  --secondary-color: #4ecdc4;
  --accent-color: #a29bfe;
  --shadow-glow: 0 8px 32px rgba(0, 212, 255, 0.3);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-neon: 0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1);
  --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 0.75rem;
  --spacing-lg: 1rem;
  --spacing-xl: 2rem;
  --radius-md: 12px;
  --radius-lg: 16px;
}

.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-gradient);
  color: var(--text-inverse);
  overflow: hidden;
  position: relative;
}

.home-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(108, 92, 231, 0.1) 0%, transparent 50%);
  pointer-events: none;
  animation: backgroundPulse 8s ease-in-out infinite;
}

.home-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 48%, rgba(0, 212, 255, 0.03) 49%, rgba(0, 212, 255, 0.03) 51%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(76, 205, 196, 0.03) 49%, rgba(76, 205, 196, 0.03) 51%, transparent 52%);
  background-size: 60px 60px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
  opacity: 0.5;
}

@keyframes backgroundPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

/* 玻璃态效果 */
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition-base);
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  transition: left 0.6s ease;
  z-index: 1;
}

.glass-card:hover::before {
  left: 100%;
}

.glass-card:hover {
  border-color: var(--border-neon);
  box-shadow: var(--shadow-neon);
  transform: translateY(-2px);
  background: var(--bg-cyber);
}

.glass-card > * {
  position: relative;
  z-index: 2;
}

/* 科技感按钮 */
.cyber-btn {
  position: relative;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-inverse);
  cursor: pointer;
  transition: var(--transition-base);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  overflow: hidden;
}

.cyber-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: var(--transition-base);
}

.cyber-btn:hover::before {
  left: 100%;
}

.cyber-btn:hover {
  background: var(--bg-dark-glass);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
  border-color: var(--primary-color);
}

.cyber-btn-primary {
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: var(--shadow-glow);
}

.cyber-btn-secondary {
  background: var(--gradient-secondary);
  border-color: transparent;
}

/* 发光文字效果 */
.glow-text {
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5),
               0 0 40px rgba(0, 212, 255, 0.3),
               0 0 60px rgba(0, 212, 255, 0.2);
  animation: textGlow 2s ease-in-out infinite alternate;
}

@keyframes textGlow {
  from {
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.5),
                 0 0 40px rgba(0, 212, 255, 0.3),
                 0 0 60px rgba(0, 212, 255, 0.2);
  }
  to {
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.8),
                 0 0 60px rgba(0, 212, 255, 0.5),
                 0 0 90px rgba(0, 212, 255, 0.3);
  }
}

/* 脉冲发光效果 */
.pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.6), 0 0 80px rgba(0, 212, 255, 0.3);
  }
}

/* 悬浮发光效果 */
.glow-hover {
  transition: var(--transition-base);
}

.glow-hover:hover {
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.4),
              0 0 60px rgba(0, 212, 255, 0.2);
  transform: translateY(-4px);
}

/* 科技感图标 */
.cyber-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--gradient-primary);
  border-radius: 50%;
  font-size: 1.25rem;
  box-shadow: var(--shadow-glow);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* 隐藏式模块选择器 */
.module-selector-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
}

.module-selector-trigger {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  opacity: 0.3;
  transition: var(--transition-base);
}

.module-selector-container:hover .module-selector-trigger {
  opacity: 0.8;
  height: 12px;
}

.module-selector {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  transform: translateY(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-glow);
}

.module-selector.expanded {
  transform: translateY(0);
}

.module-tabs-compact {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  gap: var(--spacing-lg);
}

.tab-item-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-base);
  color: var(--text-secondary);
}

.tab-item-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-color);
  color: var(--text-inverse);
}

/* 右侧控制按钮 */
.right-controls {
  display: flex;
  margin-left: auto;
  gap: var(--spacing-sm);
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-base);
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.control-icon {
  font-size: 18px;
}

.tab-item-compact.active {
  background: var(--gradient-primary);
  border-color: var(--primary-color);
  color: var(--text-inverse);
  box-shadow: var(--shadow-glow);
}

.tab-item-compact .tab-icon {
  font-size: 1.2rem;
}

.tab-item-compact .tab-text {
  font-weight: 500;
  white-space: nowrap;
}

.tab-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 var(--spacing-md);
  flex-shrink: 0;
}

/* 简化的顶部导航栏 */
.top-nav-compact {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  margin-top: 4px;
}

.nav-left {
  flex: 0 0 auto;
}

.logo-section-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 8px;
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.logo-svg {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.3));
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
}

.brand-subtitle {
  font-size: 1rem;
  opacity: 0.8;
  margin: var(--spacing-xs) 0 0 0;
  color: var(--text-tertiary);
}

/* 模块标签 */
.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.module-tabs {
  display: flex;
  gap: var(--spacing-sm);
}

.tab-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: var(--transition-base);
}

.tab-item:hover::before {
  left: 100%;
}

.tab-item:hover {
  background: var(--bg-dark-glass);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
  border-color: var(--primary-color);
}

.tab-item.active {
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: var(--shadow-glow);
  color: var(--text-inverse);
}

.tab-icon {
  font-size: 1.125rem;
}

/* 右侧导航 */
.nav-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-input {
  width: 300px;
}

.theme-btn,
.settings-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  color: var(--text-inverse);
  transition: var(--transition-base);
}

.theme-btn:hover,
.settings-btn:hover {
  background: var(--bg-dark-glass);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

/* 主内容区域 */
.content-area {
  flex: 1;
  overflow: hidden;
  padding: var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.content-area-new {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  background: var(--bg-primary);
  margin-top: 8px;
}

.dashboard-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.search-section {
  margin-bottom: var(--spacing-xl);
}

/* 欢迎页面 */
.welcome-screen {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-md) var(--spacing-xl) var(--spacing-xl);
}

.welcome-hero {
  position: relative;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  padding-top: var(--spacing-sm);
}

.hero-background {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: var(--spacing-md);
  color: var(--text-tertiary);
}

/* 智能搜索区域 */
.smart-search-section {
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
  padding: var(--spacing-xl);
}

/* 日期运势和占卜一行布局 */
.date-divination-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-4);
  align-items: start;
}

/* 日期和运势显示 */
.date-fortune-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.date-display {
  padding: var(--space-4);
  text-align: center;
}

.date-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.date-number {
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.date-info {
  text-align: left;
}

.date-month-year {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--space-1);
}

.date-weekday {
  font-size: 1rem;
  color: var(--text-tertiary);
}

.lunar-date {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  font-style: italic;
}

.fortune-display {
  padding: var(--space-5);
  text-align: center;
}

.fortune-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.fortune-icon {
  font-size: 2rem;
}

.fortune-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-inverse);
}

.fortune-level {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-3);
  text-shadow: 0 0 15px currentColor;
}

.fortune-excellent {
  color: #ffd700;
}

.fortune-good {
  color: #00ff88;
}

.fortune-normal {
  color: #00d4ff;
}

.fortune-caution {
  color: #ffa502;
}

.fortune-poor {
  color: #ff4757;
}

.fortune-desc {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  line-height: 1.5;
}

/* 占卜算卦功能 */
.divination-section {
  margin-top: var(--space-4);
  margin-bottom: var(--space-4);
  padding: var(--space-6);
}

.divination-controls {
  display: flex;
  gap: var(--space-2);
}

.divination-content {
  margin-top: var(--space-4);
}

/* 占卜结果增强显示样式 */
.divination-result-enhanced {
  margin-top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 投掷铜钱结果展示 */
.coin-results-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.coin-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.coin-result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.yao-position-label {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.coins-display {
  display: flex;
  gap: var(--spacing-xs);
}

.coin-mini {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  border: 2px solid;
  transition: var(--transition-base);
}

.coin-mini.coin-front {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #8b4513;
  border-color: #ffa500;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

.coin-mini.coin-back {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #2c3e50;
  border-color: #a0a0a0;
  box-shadow: 0 0 8px rgba(192, 192, 192, 0.4);
}

.coin-sum {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 600;
}

/* 六爻卦象详细显示 */
.liuyao-detailed {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hexagram-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hexagram-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
}

.hexagram-nature {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  font-style: italic;
}

/* 六爻排列详细版 */
.yao-lines-detailed {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.yao-line-detailed {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition-base);
}

.yao-line-detailed.changing {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.2);
}

.yao-line-detailed:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.yao-position {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-inverse);
  min-width: 30px;
  text-align: center;
}

.yao-symbol-large {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  min-width: 80px;
  text-align: center;
  text-shadow: 0 0 10px currentColor;
}

.yao-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.yao-type {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-inverse);
}

.yao-coins {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-family: monospace;
}

.yao-change {
  font-size: 0.75rem;
  color: var(--primary-color);
  font-weight: 600;
  background: rgba(255, 107, 107, 0.2);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  align-self: flex-start;
}

/* 变卦显示 */
.changed-hexagram-detailed {
  text-align: center;
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md);
  background: rgba(255, 107, 107, 0.1);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.change-arrow {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.changed-hexagram-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.changed-hexagram-nature {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-style: italic;
}

/* 卦象解释 */
.hexagram-explanation {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.explanation-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.explanation-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.original-meaning,
.changed-meaning {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--primary-color);
}

.changed-meaning {
  border-left-color: #00d4ff;
}

/* 六爻卦盘样式 */
.liuyao-display {
  width: 100%;
  padding: 1rem;
}

.hexagram-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.hexagram-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.hexagram-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.hexagram-nature {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}

.hexagram-element {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.yao-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
}

.yao-line {
  display: grid;
  grid-template-columns: 60px 1fr 80px 80px;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.yao-line.changing {
  background: linear-gradient(45deg, var(--color-warning), var(--color-primary));
  color: white;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: changingGlow 2s infinite alternate;
}

.yao-position {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-secondary);
}

.yao-symbol {
  font-size: 1.2rem;
  font-family: monospace;
  text-align: center;
  font-weight: bold;
}

.yao-type {
  font-size: 0.8rem;
  text-align: center;
  color: var(--text-muted);
}

.yao-coins {
  font-size: 0.7rem;
  text-align: center;
  color: var(--text-muted);
}

.changed-hexagram {
  margin-top: 2rem;
  text-align: center;
}

.change-arrow {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-weight: bold;
}

.hexagram-meaning-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
}

.meaning-title {
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.meaning-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-primary);
}

@keyframes changingGlow {
  0% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.3);
  }
}

.divination-prompt {
  text-align: center;
  margin-bottom: var(--space-4);
}

.divination-prompt p {
  color: var(--text-tertiary);
  margin-bottom: var(--space-4);
  font-size: 0.95rem;
}

.divination-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.divination-type {
  padding: var(--space-3);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-md);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-bounce);
  background: var(--bg-cyber);
  position: relative;
  overflow: hidden;
}

.divination-type::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-neon);
  opacity: 0;
  transition: all 0.3s ease;
}

.divination-type:hover {
  border-color: var(--border-neon);
  background: rgba(0, 212, 255, 0.1);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-glow);
}

.divination-type:hover::before {
  left: 0;
  opacity: 0.1;
}

.divination-type.active {
  border-color: var(--primary-color);
  background: rgba(0, 212, 255, 0.15);
  box-shadow: var(--shadow-neon);
  animation: activeGlow 2s ease-in-out infinite alternate;
}

@keyframes activeGlow {
  from {
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  }
  to {
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.6), 0 0 50px rgba(0, 212, 255, 0.3);
  }
}

.type-icon {
  font-size: 1.5rem;
  margin-bottom: var(--space-1);
}

.type-name {
  font-size: 0.85rem;
  color: var(--text-inverse);
  font-weight: 500;
}

.divination-result-compact {
  margin-top: var(--spacing-lg);
}

.liuyao-compact {
  background: var(--bg-glass);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.hexagram-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.hexagram-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.hexagram-nature {
  font-size: 1rem;
  color: var(--text-tertiary);
}

.yao-lines-compact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin: var(--spacing-md) 0;
}

.yao-line-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  transition: var(--transition-base);
}

.yao-line-compact.changing {
  background: linear-gradient(45deg, var(--warning-color), var(--primary-color));
  color: white;
  box-shadow: 0 0 10px rgba(255, 167, 38, 0.5);
  animation: changingGlow 2s infinite alternate;
}

.yao-line-compact .yao-position {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 20px;
}

.yao-line-compact .yao-symbol {
  font-size: 1.2rem;
  font-family: monospace;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.yao-line-compact .yao-type {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  min-width: 40px;
  text-align: right;
}

.changed-hexagram-compact {
  text-align: center;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.change-indicator {
  font-size: 1rem;
  color: var(--secondary-color);
  font-weight: 600;
}

.divination-interpretation-compact {
  margin-top: var(--spacing-md);
  background: var(--bg-glass);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.interpretation-content-compact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.content-section,
.advice-section {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.advice-section {
  border-left-color: var(--secondary-color);
}

.section-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.section-text {
  flex: 1;
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.divination-meta-compact {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
  text-align: center;
}

.meta-compact {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.divination-result {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-6);
  align-items: start;
}

.hexagram-display {
  text-align: center;
  padding: var(--space-4);
  border: 2px solid var(--border-neon);
  border-radius: var(--radius-lg);
  background: var(--bg-cyber);
  position: relative;
  overflow: hidden;
  animation: hexagramPulse 4s ease-in-out infinite;
}

.hexagram-display::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  animation: rotate 8s linear infinite;
}

.hexagram-display > * {
  position: relative;
  z-index: 2;
}

.hexagram-symbol {
  font-size: 4rem;
  line-height: 1;
  margin-bottom: var(--space-2);
  text-shadow: var(--shadow-neon);
  animation: symbolGlow 3s ease-in-out infinite alternate;
}

.hexagram-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

@keyframes hexagramPulse {
  0%, 100% {
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  }
  50% {
    border-color: rgba(0, 212, 255, 0.6);
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.4);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes symbolGlow {
  from {
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4);
  }
}

.hexagram-meaning {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: var(--space-2);
  font-style: italic;
}

.hexagram-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: hexagramGlow 3s ease-in-out infinite;
  z-index: -1;
}

@keyframes hexagramGlow {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
}

.result-coins {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.result-coin {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  animation: resultCoinSpin 2s ease-in-out;
}

.result-coin:nth-child(odd) {
  background: radial-gradient(circle, #ffd700 0%, #b8860b 100%);
  color: #8b4513;
  border: 2px solid #b8860b;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

.result-coin:nth-child(even) {
  background: radial-gradient(circle, #c0c0c0 0%, #808080 100%);
  color: #2f2f2f;
  border: 2px solid #808080;
  box-shadow: 0 0 10px rgba(192, 192, 192, 0.4);
}

@keyframes resultCoinSpin {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}

/* 铜钱动画样式 */
.coin-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 20px;
}

.animation-container {
  text-align: center;
}

.coins-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  perspective: 1000px;
}

.coin {
  width: 60px;
  height: 60px;
  position: relative;
  transform-style: preserve-3d;
  animation: coinFlip 0.8s infinite ease-in-out;
}

@keyframes coinFlip {
  0% { transform: rotateY(0deg) rotateX(0deg) translateY(0px); }
  25% { transform: rotateY(90deg) rotateX(45deg) translateY(-10px); }
  50% { transform: rotateY(180deg) rotateX(90deg) translateY(-20px); }
  75% { transform: rotateY(270deg) rotateX(135deg) translateY(-10px); }
  100% { transform: rotateY(360deg) rotateX(180deg) translateY(0px); }
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  backface-visibility: hidden;
}

.coin-front {
  background: radial-gradient(circle, #ffd700 0%, #ffed4e 50%, #b8860b 100%);
  border: 3px solid #b8860b;
  color: #8b4513;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3);
}

.coin-back {
  background: radial-gradient(circle, #c0c0c0 0%, #e6e6e6 50%, #808080 100%);
  border: 3px solid #808080;
  color: #2f2f2f;
  transform: rotateY(180deg);
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3);
}

.divination-text {
  color: var(--text-inverse);
}

.text-line {
  font-size: 18px;
  margin-bottom: 10px;
  opacity: 0;
  animation: textFadeIn 1s ease-in-out forwards;
}

.text-line:nth-child(1) { animation-delay: 0.5s; }
.text-line:nth-child(2) { animation-delay: 1s; }

@keyframes textFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: dotPulse 1.5s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.3s; }
.dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes dotPulse {
  0%, 60%, 100% { transform: scale(1); opacity: 0.7; }
  30% { transform: scale(1.3); opacity: 1; }
}

.divination-interpretation {
  padding: var(--space-4);
}

.interpretation-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;
}

.title-icon {
  font-size: 1.2rem;
}

.title-decoration {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  margin-left: var(--space-2);
}

.interpretation-content {
  color: var(--text-inverse);
  line-height: 1.6;
  margin-bottom: var(--space-4);
  font-size: 1rem;
  background: rgba(0, 212, 255, 0.05);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border-left: 3px solid rgba(0, 212, 255, 0.3);
}

.divination-advice {
  padding: var(--space-3);
  background: rgba(255, 193, 7, 0.1);
  border-radius: var(--radius-md);
  border-left: 3px solid #ffc107;
  margin-bottom: var(--space-4);
}

.advice-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffc107;
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.advice-icon {
  font-size: 1rem;
}

.advice-content {
  color: var(--text-inverse);
  line-height: 1.5;
  font-size: 0.95rem;
}

.divination-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.meta-label {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.meta-value {
  font-size: 0.9rem;
  color: var(--text-inverse);
  font-weight: 600;
}

.divination-history {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
}

.history-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.history-title::before {
  content: '📚';
  font-size: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(0, 212, 255, 0.05);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(0, 212, 255, 0.1);
  transform: translateX(5px);
}

.history-hexagram {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.history-info {
  flex: 1;
}

.history-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-inverse);
  margin-bottom: var(--space-1);
}

.history-time {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .divination-result {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .hexagram-display {
    margin: 0 auto;
    max-width: 200px;
  }
  
  .divination-types {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 统一信息流 */
.unified-info-stream {
  margin-top: var(--space-4);
  padding: var(--space-6);
}

.stream-controls {
  display: flex;
  gap: var(--space-3);
}

.info-stream-container {
  margin-top: var(--space-4);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stream-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-4);
  background: var(--bg-dark-glass);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  transition: var(--transition-base);
}

.stream-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.stream-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.stream-content {
  flex: 1;
  min-width: 0;
}

.stream-type {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-1);
}

.stream-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--space-2);
  line-height: 1.3;
}

.stream-description {
  font-size: 14px;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.stream-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 12px;
}

.stream-priority {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-transform: uppercase;
}

.stream-priority.priority-urgent {
  background: #ff4757;
  color: white;
}

.stream-priority.priority-high {
  background: #ffa502;
  color: white;
}

.stream-priority.priority-medium {
  background: #3742fa;
  color: white;
}

.stream-time {
  color: var(--text-tertiary);
}

.stream-action {
  flex-shrink: 0;
}

.empty-stream {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--space-6);
}

.empty-stream .el-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
  opacity: 0.5;
}

.stream-indicators {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-tertiary);
  opacity: 0.3;
  cursor: pointer;
  transition: var(--transition-base);
}

.indicator.active {
  background: var(--primary-color);
  opacity: 1;
  transform: scale(1.2);
}

.indicator:hover {
  opacity: 0.7;
}

.content-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-glow);
  transition: var(--transition-base);
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin: 0;
}

.todos-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.todo-item.urgent {
  border-left: 3px solid #ff4757;
}

.todo-item.overdue {
  border-left: 3px solid #ff3838;
  background: rgba(255, 56, 56, 0.1);
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-weight: 500;
  color: var(--text-inverse);
  margin-bottom: var(--spacing-xs);
  font-size: 0.95rem;
}

.todo-time {
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.consultations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.news-item {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.news-category {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 500;
}

.news-title {
  font-weight: 500;
  color: var(--text-inverse);
  font-size: 0.95rem;
  line-height: 1.4;
}

.news-time {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

/* AI大爆炸区域 - 缩小面积 */
.ai-consultations {
  padding: var(--spacing-md); /* 从 xl 改为 md，减少内边距 */
}

.consultations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm); /* 从 md 改为 sm，减少间距 */
}

.consultation-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm); /* 从 md 改为 sm，减少间距 */
  padding: var(--spacing-sm); /* 从 md 改为 sm，减少内边距 */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.consultation-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.consultation-icon {
  font-size: 1.2rem; /* 从 1.5rem 改为 1.2rem，缩小图标 */
  width: 32px; /* 从 40px 改为 32px，缩小尺寸 */
  height: 32px; /* 从 40px 改为 32px，缩小尺寸 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: 50%;
  flex-shrink: 0;
}

.consultation-content {
  flex: 1;
}

.consultation-title {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-inverse);
  font-size: 0.95rem; /* 缩小标题字体 */
}

.consultation-desc {
  font-size: 0.85rem; /* 从 0.9rem 改为 0.85rem，缩小描述字体 */
  color: var(--text-tertiary);
  line-height: 1.4;
}

.smart-search-input {
  margin-bottom: var(--spacing-md);
}

.smart-search-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
}

.smart-search-input :deep(.el-input__inner) {
  color: var(--text-inverse);
  font-size: 1.1rem;
}

.smart-search-input :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
}

.search-suggestions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 0.9rem;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

/* 重要待办事项 */
.important-todos {
  padding: var(--spacing-xl);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.todo-priority {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.priority-urgent {
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
}

.priority-high {
  background: linear-gradient(45deg, #ffa726, #ff9800);
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-inverse);
}

.todo-time {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-tertiary);
}

.empty-state .el-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state p {
  margin-bottom: var(--spacing-lg);
  font-size: 1.1rem;
}

/* AI新闻 */
.ai-news {
  padding: var(--spacing-xl);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.news-item {
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.news-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-inverse);
  line-height: 1.4;
}

.news-summary {
  color: var(--text-tertiary);
  line-height: 1.5;
  font-size: 0.95rem;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.news-source {
  font-weight: 500;
  color: var(--primary-color);
}

.news-time {
  opacity: 0.7;
}

/* 通用样式 */
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--text-inverse);
  text-align: center;
}

/* AI状态卡片 */
.ai-status {
  max-width: 600px;
  margin: 0 auto var(--spacing-xl);
  padding: var(--spacing-xl);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.status-icon {
  flex-shrink: 0;
}

.status-text {
  flex: 1;
  text-align: left;
}

.status-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.status-desc {
  opacity: 0.8;
}

.text-success {
  color: #00d4aa;
}

.text-warning {
  color: #fdcb6e;
}

/* 快速开始 */
.quick-start {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.start-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.start-card {
  padding: var(--spacing-xl);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-base);
}

.card-icon {
  margin: 0 auto var(--spacing-lg);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.card-desc {
  opacity: 0.8;
  font-size: 0.875rem;
}

/* 统计信息 */
.stats-section {
  margin-top: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  opacity: 0.8;
  font-size: 0.875rem;
}

/* AI配置对话框 */
.ai-config-dialog {
  padding: var(--spacing-lg);
}

.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.quick-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }
  
  .nav-center {
    order: 3;
  }
  
  .module-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .start-cards {
    grid-template-columns: 1fr;
  }
  
  .horizontal-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  /* 整合的日期运势卡片样式 */
.integrated-date-fortune-card {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-xl);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.date-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.date-number {
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.date-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.month-year {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-inverse);
}

.weekday {
  font-size: 1rem;
  color: var(--text-secondary);
}

.lunar-date {
  font-size: 0.9rem;
  color: var(--accent-color);
  font-style: italic;
}

.fortune-summary {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.fortune-icon-large {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.fortune-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.fortune-text {
  font-size: 1.3rem;
  font-weight: 600;
}

.fortune-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.fortune-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.fortune-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.fortune-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.fortune-title.suitable {
  color: var(--success-color);
}

.fortune-title.avoid {
  color: var(--error-color);
}

.fortune-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.fortune-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid;
}

.fortune-tag.suitable {
  background: rgba(34, 197, 94, 0.2);
  border-color: var(--success-color);
  color: var(--success-color);
}

.fortune-tag.avoid {
  background: rgba(239, 68, 68, 0.2);
  border-color: var(--error-color);
  color: var(--error-color);
}

.fortune-tips-integrated {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tips-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--warning-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tips-content {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
}
/* 增强版智能搜索样式 */
.enhanced-search-section {
  width: 100%;
  max-width: 800px;
  margin: 0 auto var(--spacing-xl) auto;
  padding: 0 var(--spacing-lg);
}

.search-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.search-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin: 0 0 var(--spacing-sm) 0;
}

.search-title-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.search-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
}

.enhanced-search-container {
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.enhanced-search-input {
  width: 100%;
  margin-bottom: var(--spacing-lg);
}

.enhanced-search-input .el-input__wrapper {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.enhanced-search-input .el-input__wrapper:hover {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.15);
}

.enhanced-search-input .el-input__wrapper.is-focus {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
}

.search-prefix-icon {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.search-button {
  margin-right: var(--spacing-sm);
  border-radius: var(--radius-md);
  font-weight: 500;
}

.search-suggestions-enhanced {
  margin-top: var(--spacing-lg);
}

.suggestions-header {
  margin-bottom: var(--spacing-md);
}

.suggestions-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-inverse);
  opacity: 0.9;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-sm);
}

.suggestion-item-enhanced {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.suggestion-item-enhanced:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.2);
}

.suggestion-icon-enhanced {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.suggestion-text-enhanced {
  flex: 1;
  color: var(--text-inverse);
  font-weight: 500;
}



.left-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 300px;
}

.compact-search {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.compact-search-input {
  width: 100%;
}

.search-suggestions-compact {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.suggestion-item-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 0.85rem;
}

.suggestion-item-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.suggestion-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.suggestion-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-secondary);
}

.compact-date-display {
  padding: var(--spacing-md);
  text-align: center;
}

.compact-date-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.compact-date-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.compact-date-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.compact-month-year {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-inverse);
}

.compact-weekday {
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.compact-lunar {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
  font-style: italic;
}

.compact-fortune {
  padding: var(--spacing-md);
  text-align: center;
  transition: var(--transition-base);
}

.compact-fortune:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.compact-fortune-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.fortune-icon {
  font-size: 1.5rem;
}

.fortune-text {
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 10px currentColor;
}

.fortune-detail-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  opacity: 0.7;
  transition: var(--transition-base);
}

.compact-fortune:hover .fortune-detail-hint {
  opacity: 1;
  color: var(--primary-color);
}

/* 运势详情弹窗样式 */
.fortune-detail-dialog {
  --el-messagebox-width: 500px;
}

.fortune-detail-content {
  text-align: left;
  line-height: 1.6;
}

.fortune-detail-content h4 {
  margin: var(--spacing-md) 0 var(--spacing-sm) 0;
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: 600;
}

.fortune-detail-content h4:first-child {
  margin-top: 0;
}

.fortune-detail-content p {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.fortune-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.fortune-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.fortune-tag.suitable {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.fortune-tag.avoid {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

/* 日期运势融合模块样式 */
/* 日期日历卡片 */
.date-calendar-card {
  padding: var(--spacing-lg);
  transition: var(--transition-base);
  min-height: 120px;
}

.date-calendar-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

/* 详细运势卡片 */
.fortune-detail-card {
  padding: var(--spacing-lg);
  transition: var(--transition-base);
  min-height: 120px;
}

.fortune-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.date-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.date-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.date-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
  line-height: 1;
}

.date-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.month-year {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-inverse);
  margin-bottom: var(--spacing-xs);
}

.weekday {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.lunar-date {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  font-style: italic;
  opacity: 0.8;
}

.fortune-divider {
  width: 2px;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
  border-radius: 1px;
  opacity: 0.3;
}

/* 运势头部 */
.fortune-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.fortune-icon {
  font-size: 1.8rem;
}

.fortune-text {
  font-size: 1.4rem;
  font-weight: 600;
  text-shadow: 0 0 10px currentColor;
}

/* 运势详情 */
.fortune-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.fortune-suitable,
.fortune-avoid,
.fortune-tips {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.05);
}

.fortune-details h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-inverse);
}

.fortune-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.fortune-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  transition: var(--transition-base);
}

.fortune-tag.suitable {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.fortune-tag.avoid {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.fortune-tips p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.fortune-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

.fortune-detail-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  opacity: 0.7;
  transition: var(--transition-base);
  text-align: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.date-fortune-integrated:hover .fortune-detail-hint {
  opacity: 1;
  color: var(--primary-color);
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.compact-lunar {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

.compact-fortune {
  padding: var(--spacing-sm) var(--spacing-md);
}

.compact-fortune-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.fortune-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.divination-main-section {
  padding: var(--spacing-xl);
  min-height: 400px;
}

/* 移动端布局调整 */
  .compact-layout-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .left-section {
    order: 1;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .divination-main-section {
    order: 2;
  }
  
  .date-number {
    font-size: 3rem;
  }
  
  .divination-result {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .divination-meta {
    grid-template-columns: 1fr;
  }
}

/* 新增样式：滚动布局和更多按钮 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-header .section-title {
  margin-bottom: 0;
  text-align: left;
  font-size: 1.25rem;
}

.view-more-btn {
  font-size: 0.875rem;
  padding: 4px 8px;
  height: auto;
}

.view-more-btn .el-icon {
  margin-left: 4px;
  font-size: 12px;
}

.scrollable-content {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.scrollable-content::-webkit-scrollbar {
  width: 4px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* 番茄钟样式 */
.pomodoro-timer-section {
  margin-top: var(--spacing-lg);
}

.timer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-circle.active {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-background {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 8;
}

.progress-ring-progress {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.timer-text {
  position: absolute;
  text-align: center;
  color: var(--text-inverse);
}

.time-display {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  margin-bottom: var(--spacing-xs);
}

.timer-mode {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.timer-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 600px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.setting-item label {
  font-weight: 500;
  color: var(--text-inverse);
  white-space: nowrap;
}

.cycle-count {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.timer-controls {
  display: flex;
  gap: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timer-content {
    gap: var(--spacing-lg);
  }
  
  .timer-circle {
    transform: scale(0.8);
  }
  
  .time-display {
    font-size: 2rem;
  }
  
  .timer-settings {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}

/* 模块容器样式 */
.module-container {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

  .search-with-iching {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .iching-mini {
    width: 84px;
    min-width: 84px;
    height: 84px;
    padding: 8px;
    border-radius: var(--radius-md);
    background: var(--bg-glass);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-glow);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
  }

  .hex-line {
    height: 8px;
    border-radius: 6px;
    position: relative;
    background: var(--primary-light);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .hex-line.yin::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 28%;
    height: 100%;
    background: var(--bg-card);
    border-radius: 6px;
  }

  .hex-line.yang {
    background: var(--primary-color);
  }

  .quick-links {
    margin-top: var(--space-4);
    display: flex;
    gap: var(--space-3);
  }

  .quick-links .el-button {
    color: var(--text-secondary);
  }
</style>