<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-navigation">
      <div class="nav-left">
        <div class="app-logo">🌿 运营效率助手</div>
      </div>
      <div class="nav-center">
        <div class="quick-search">
          <input 
            v-model="searchQuery"
            placeholder="搜索任务、项目、笔记..." 
            class="search-input"
            @keyup.enter="performSearch"
          />
          <button class="search-btn" @click="performSearch">🔍</button>
        </div>
      </div>
      <div class="nav-right">
        <button class="notification-btn" @click="showNotifications = !showNotifications">
          🔔
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </button>
        <button class="theme-toggle" @click="toggleTheme">🌙</button>
      </div>
    </header>

    <!-- 侧边导航栏 -->
    <aside class="side-navigation">
      <nav class="nav-menu">
        <div 
          class="nav-item" 
          :class="{ active: activeModule === 'dashboard' }"
          @click="setActiveModule('dashboard')"
        >
          <div class="nav-icon">📊</div>
          <span class="nav-label">工作概览</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeModule === 'worklog' }"
          @click="setActiveModule('worklog')"
        >
          <div class="nav-icon">✍️</div>
          <span class="nav-label">工作记录</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeModule === 'tasks' }"
          @click="setActiveModule('tasks')"
        >
          <div class="nav-icon">📋</div>
          <span class="nav-label">任务管理</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeModule === 'framework' }"
          @click="setActiveModule('framework')"
        >
          <div class="nav-icon">🎯</div>
          <span class="nav-label">项目框架</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeModule === 'learning' }"
          @click="setActiveModule('learning')"
        >
          <div class="nav-icon">📚</div>
          <span class="nav-label">每日学习</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeModule === 'settings' }"
          @click="setActiveModule('settings')"
        >
          <div class="nav-icon">⚙️</div>
          <span class="nav-label">个人设置</span>
        </div>
      </nav>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 工作概览模块 -->
      <Dashboard v-if="activeModule === 'dashboard'" />

      <!-- 任务管理模块 -->
      <TaskManagement v-else-if="activeModule === 'tasks'" />

      <!-- 工作记录模块 -->
      <WorkLog v-else-if="activeModule === 'worklog'" />

      <!-- 项目框架模块 -->
      <ProjectFramework v-else-if="activeModule === 'framework'" />

      <!-- 每日学习模块 -->
      <DailyLearning v-else-if="activeModule === 'learning'" />

      <!-- 个人设置模块 -->
      <PersonalSettings v-else-if="activeModule === 'settings'" />
    </main>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Dashboard from '@/components/Dashboard.vue'
import WorkLog from '@/components/WorkLog.vue'
import TaskManagement from '@/components/TaskManagement.vue'
import ProjectFramework from '@/components/ProjectFramework.vue'
import DailyLearning from '@/components/DailyLearning.vue'
import PersonalSettings from '@/components/PersonalSettings.vue'

export default {
  name: 'Home',
  components: {
    Dashboard,
    WorkLog,
    TaskManagement,
    ProjectFramework,
    DailyLearning,
    PersonalSettings
  },
  setup() {
    // 响应式数据
    const activeModule = ref('dashboard')
    const searchQuery = ref('')
    const showNotifications = ref(false)
    const unreadCount = ref(3)
    const theme = ref('light')
    
    // 工作概览数据
    const todayTasks = reactive({
      completed: 8,
      total: 12
    })
    
    const todayWorkTime = ref(6.5 * 60 * 60) // 6.5小时，以秒为单位
    const avgDailyTime = ref(7 * 60 * 60) // 7小时平均
    const efficiencyScore = ref(85)
    const efficiencyTrend = ref('up')
    const efficiencyChange = ref(5)
    const streakDays = ref(15)
    
    // 智能洞察数据
    const dailyInsights = ref([
      {
        id: 1,
        icon: '⚡',
        title: '效率提升建议',
        description: '您在上午10-12点的工作效率最高，建议将重要任务安排在这个时间段。',
        action: 'optimizeSchedule',
        actionText: '优化日程'
      },
      {
        id: 2,
        icon: '📊',
        title: '任务完成分析',
        description: '本周任务完成率比上周提升了12%，保持这个节奏！',
        action: null,
        actionText: null
      },
      {
        id: 3,
        icon: '🎯',
        title: '专注时间建议',
        description: '今日还需要2小时专注时间来完成核心任务，建议使用番茄工作法。',
        action: 'startPomodoro',
        actionText: '开始专注'
      }
    ])

    // 计算属性
    const completionRate = computed(() => {
      if (todayTasks.total === 0) return 0
      return Math.round((todayTasks.completed / todayTasks.total) * 100)
    })

    // 方法
    const setActiveModule = (module) => {
      console.log('切换到模块:', module)
      activeModule.value = module
    }

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme.value)
    }

    const performSearch = () => {
      const query = searchQuery.value.toLowerCase().trim()
      if (!query) return
      
      console.log(`搜索查询: "${query}"`)
      
      // 模块名称映射
      const moduleMap = {
        '工作概览': 'dashboard',
        '概览': 'dashboard',
        'dashboard': 'dashboard',
        '工作记录': 'worklog',
        '记录': 'worklog',
        'worklog': 'worklog',
        '任务管理': 'tasks',
        '任务': 'tasks',
        'tasks': 'tasks',
        '项目框架': 'framework',
        '项目': 'framework',
        '框架': 'framework',
        'framework': 'framework',
        '每日学习': 'learning',
        '学习': 'learning',
        '知识': 'learning',
        'learning': 'learning',
        '个人设置': 'settings',
        '设置': 'settings',
        'settings': 'settings'
      }
      
      // 直接匹配模块名称
      if (moduleMap[query]) {
        setActiveModule(moduleMap[query])
        searchQuery.value = ''
        return
      }
      
      // 模糊匹配
      for (const [key, module] of Object.entries(moduleMap)) {
        if (query.includes(key) || key.includes(query)) {
          setActiveModule(module)
          searchQuery.value = ''
          return
        }
      }
      
      // 如果没有匹配到模块，执行原有的搜索逻辑
      if (query.includes('任务') || query.includes('待办')) {
        setActiveModule('tasks')
      } else if (query.includes('工作') || query.includes('记录')) {
        setActiveModule('worklog')
      } else if (query.includes('项目') || query.includes('框架')) {
        setActiveModule('framework')
      } else if (query.includes('学习') || query.includes('知识')) {
        setActiveModule('learning')
      } else {
        console.log(`搜索 "${searchQuery.value}" 的结果`)
      }
      
      searchQuery.value = ''
    }

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }

    const executeInsightAction = (insight) => {
      switch (insight.action) {
        case 'optimizeSchedule':
          console.log('正在为您优化日程安排...')
          setActiveModule('tasks')
          break
        case 'startPomodoro':
          console.log('启动番茄工作法...')
          break
        default:
          console.log('功能开发中...')
      }
    }

    // 快速操作方法
    const createQuickTask = () => {
      setActiveModule('tasks')
      console.log('跳转到任务管理模块')
    }

    const startWorkLog = () => {
      setActiveModule('worklog')
      console.log('跳转到工作记录模块')
    }

    const viewTodayTasks = () => {
      setActiveModule('tasks')
      console.log('查看今日任务')
    }

    const openLearning = () => {
      setActiveModule('learning')
      console.log('跳转到学习模块')
    }

    // 生命周期
    onMounted(() => {
      console.log('运营效率管家已加载')
      document.documentElement.setAttribute('data-theme', theme.value)
      
      // 模拟数据更新
      setInterval(() => {
        // 模拟实时数据更新
        if (Math.random() > 0.8) {
          unreadCount.value = Math.floor(Math.random() * 5)
        }
      }, 30000)
    })

    return {
      // 响应式数据
      activeModule,
      searchQuery,
      showNotifications,
      unreadCount,
      theme,
      
      // 工作概览数据
      todayTasks,
      todayWorkTime,
      avgDailyTime,
      efficiencyScore,
      efficiencyTrend,
      efficiencyChange,
      streakDays,
      dailyInsights,
      
      // 计算属性
      completionRate,
      
      // 方法
      setActiveModule,
      toggleTheme,
      performSearch,
      formatTime,
      executeInsightAction,
      createQuickTask,
      startWorkLog,
      viewTodayTasks,
      openLearning
    }
  }
}
</script>

<style scoped>
/* 运营效率管家样式 - 浅绿色主题 + Apple风格 */
:root {
  --primary-color: #34C759;
  --primary-light: #4CD964;
  --primary-dark: #28A745;
  --secondary-color: #007AFF;
  --accent-color: #FF9500;
  --success-color: #34C759;
  --warning-color: #FF9500;
  --error-color: #FF3B30;
  
  --bg-primary: #F2F2F7;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F8F9FA;
  --bg-glass: rgba(255, 255, 255, 0.8);
  
  --text-primary: #1D1D1F;
  --text-secondary: #6D6D80;
  --text-tertiary: #8E8E93;
  --text-inverse: #FFFFFF;
  
  --border-color: #E5E5EA;
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.15);
  --shadow-heavy: 0 8px 30px rgba(0, 0, 0, 0.2);
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
  --transition-slow: 0.5s ease;
}

[data-theme="dark"] {
  --bg-primary: #000000;
  --bg-secondary: #1C1C1E;
  --bg-tertiary: #2C2C2E;
  --bg-glass: rgba(28, 28, 30, 0.8);
  
  --text-primary: #FFFFFF;
  --text-secondary: #EBEBF5;
  --text-tertiary: #8E8E93;
  --text-inverse: #1D1D1F;
  
  --border-color: #38383A;
}

.app-container {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main";
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  background: var(--bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部导航栏 */
.top-navigation {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(20px);
}

.nav-left .app-logo {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-center {
  flex: 1;
  max-width: 400px;
  margin: 0 var(--spacing-xl);
}

.quick-search {
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: var(--spacing-sm);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-btn {
  background: var(--primary-color);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  color: white;
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-btn:hover {
  background: var(--primary-dark);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.notification-btn,
.theme-toggle {
  position: relative;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.notification-btn:hover,
.theme-toggle:hover {
  background: var(--bg-glass);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--error-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 侧边导航栏 */
.side-navigation {
  grid-area: sidebar;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-lg);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  color: var(--text-secondary);
}

.nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-weight: 500;
  font-size: 14px;
}

/* 主内容区域 */
.main-content {
  grid-area: main;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background: var(--bg-primary);
}

/* 工作概览模块 */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.metric-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: var(--transition-medium);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.metric-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.metric-content h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.metric-progress {
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width var(--transition-medium);
}

.metric-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--text-tertiary);
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.up {
  color: var(--success-color);
}

.metric-trend.down {
  color: var(--error-color);
}

/* 智能洞察 */
.insights-section,
.quick-actions-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-light);
}

.section-header {
  margin-bottom: var(--spacing-lg);
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.insight-card {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  display: flex;
  gap: var(--spacing-md);
}

.insight-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.insight-content h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.insight-content p {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.insight-action {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.insight-action:hover {
  background: var(--primary-dark);
}

/* 快速操作 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.quick-action-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
}

.quick-action-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.action-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
}

.quick-action-btn:hover .action-icon {
  background: white;
  color: var(--primary-color);
}

.quick-action-btn span {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.quick-action-btn:hover span {
  color: white;
}

/* 模块占位符 */
.module-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  text-align: center;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.module-placeholder h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.module-placeholder p {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    grid-template-areas: 
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }
  
  .side-navigation {
    display: none;
  }
  
  .nav-center {
    margin: 0 var(--spacing-md);
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: var(--spacing-md);
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>