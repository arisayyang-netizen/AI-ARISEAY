<template>
  <div class="calendar-module">
    <!-- 侧边栏 -->
    <div class="calendar-sidebar">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalEvents }}</div>
          <div class="stat-label">总事件</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.todayEvents }}</div>
          <div class="stat-label">今日事件</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.upcomingEvents }}</div>
          <div class="stat-label">即将到来</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.completedEvents }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>

      <!-- 快速筛选 -->
      <div class="filter-section">
        <h3>筛选</h3>
        <div class="filter-options">
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'all' }"
            @click="setFilter('all')"
          >
            <i class="icon-calendar"></i>
            <span>全部事件</span>
            <span class="count">{{ stats.totalEvents }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'today' }"
            @click="setFilter('today')"
          >
            <i class="icon-today"></i>
            <span>今日事件</span>
            <span class="count">{{ stats.todayEvents }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'upcoming' }"
            @click="setFilter('upcoming')"
          >
            <i class="icon-clock"></i>
            <span>即将到来</span>
            <span class="count">{{ stats.upcomingEvents }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'completed' }"
            @click="setFilter('completed')"
          >
            <i class="icon-check"></i>
            <span>已完成</span>
            <span class="count">{{ stats.completedEvents }}</span>
          </div>
        </div>
      </div>

      <!-- 日历导航 -->
      <div class="calendar-nav">
        <h3>日历导航</h3>
        <div class="nav-controls">
          <button @click="previousMonth" class="nav-btn">
            <i class="icon-chevron-left"></i>
          </button>
          <span class="current-month">{{ currentMonthYear }}</span>
          <button @click="nextMonth" class="nav-btn">
            <i class="icon-chevron-right"></i>
          </button>
        </div>
        <button @click="goToToday" class="today-btn">回到今天</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="calendar-main">
      <!-- 工具栏 -->
      <div class="calendar-toolbar">
        <div class="toolbar-left">
          <h2>日历</h2>
          <div class="view-switcher">
            <button 
              v-for="view in viewOptions" 
              :key="view.value"
              :class="['view-btn', { active: currentView === view.value }]"
              @click="setView(view.value)"
            >
              {{ view.label }}
            </button>
          </div>
        </div>
        <div class="toolbar-right">
          <button @click="showAddEventDialog = true" class="add-event-btn">
            <i class="icon-plus"></i>
            添加事件
          </button>
        </div>
      </div>

      <!-- 日历视图 -->
      <div class="calendar-view">
        <!-- 月视图 -->
        <div v-if="currentView === 'month'" class="month-view">
          <div class="calendar-header">
            <div v-for="day in weekDays" :key="day" class="day-header">
              {{ day }}
            </div>
          </div>
          <div class="calendar-grid">
            <div 
              v-for="date in calendarDates" 
              :key="date.key"
              :class="['calendar-cell', {
                'other-month': !date.isCurrentMonth,
                'today': date.isToday,
                'selected': date.isSelected,
                'has-events': date.events.length > 0
              }]"
              @click="selectDate(date)"
            >
              <div class="date-number">{{ date.day }}</div>
              <div class="events-preview">
                <div 
                  v-for="event in date.events.slice(0, 3)" 
                  :key="event.id"
                  :class="['event-dot', `priority-${event.priority}`]"
                  :title="event.title"
                ></div>
                <div v-if="date.events.length > 3" class="more-events">
                  +{{ date.events.length - 3 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 周视图 -->
        <div v-else-if="currentView === 'week'" class="week-view">
          <div class="week-header">
            <div class="time-column"></div>
            <div v-for="date in weekDates" :key="date.key" class="day-column">
              <div class="day-label">{{ date.dayName }}</div>
              <div class="date-label" :class="{ today: date.isToday }">{{ date.day }}</div>
            </div>
          </div>
          <div class="week-grid">
            <div class="time-slots">
              <div v-for="hour in 24" :key="hour" class="time-slot">
                {{ String(hour - 1).padStart(2, '0') }}:00
              </div>
            </div>
            <div class="days-grid">
              <div v-for="date in weekDates" :key="date.key" class="day-column">
                <div 
                  v-for="hour in 24" 
                  :key="hour" 
                  class="hour-slot"
                  @click="addEventAtTime(date, hour - 1)"
                >
                  <div 
                    v-for="event in getEventsForHour(date, hour - 1)" 
                    :key="event.id"
                    :class="['event-block', `priority-${event.priority}`]"
                    @click.stop="editEvent(event)"
                  >
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">{{ formatEventTime(event) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 日视图 -->
        <div v-else-if="currentView === 'day'" class="day-view">
          <div class="day-header">
            <h3>{{ selectedDate.format('YYYY年MM月DD日 dddd') }}</h3>
          </div>
          <div class="day-schedule">
            <div class="time-slots">
              <div v-for="hour in 24" :key="hour" class="time-slot">
                {{ String(hour - 1).padStart(2, '0') }}:00
              </div>
            </div>
            <div class="events-column">
              <div 
                v-for="hour in 24" 
                :key="hour" 
                class="hour-slot"
                @click="addEventAtTime(selectedDate, hour - 1)"
              >
                <div 
                  v-for="event in getEventsForHour(selectedDate, hour - 1)" 
                  :key="event.id"
                  :class="['event-block', `priority-${event.priority}`]"
                  @click.stop="editEvent(event)"
                >
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-time">{{ formatEventTime(event) }}</div>
                  <div class="event-description">{{ event.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑事件对话框 -->
    <el-dialog 
      v-model="showAddEventDialog" 
      :title="editingEvent ? '编辑事件' : '添加事件'"
      width="500px"
    >
      <el-form :model="eventForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="eventForm.title" placeholder="请输入事件标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="eventForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入事件描述"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="eventForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="eventForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="eventForm.priority" placeholder="选择优先级">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="提醒">
          <el-checkbox v-model="eventForm.reminder">设置提醒</el-checkbox>
        </el-form-item>
        <el-form-item v-if="eventForm.reminder" label="提醒时间">
          <el-select v-model="eventForm.reminderTime" placeholder="选择提醒时间">
            <el-option label="事件开始时" value="0" />
            <el-option label="提前5分钟" value="5" />
            <el-option label="提前15分钟" value="15" />
            <el-option label="提前30分钟" value="30" />
            <el-option label="提前1小时" value="60" />
            <el-option label="提前1天" value="1440" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddEventDialog = false">取消</el-button>
          <el-button v-if="editingEvent" type="danger" @click="deleteEvent">删除</el-button>
          <el-button type="primary" @click="saveEvent">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'

// 简化dayjs配置，避免插件导入问题
dayjs.locale('zh-cn')

// 响应式数据
const currentDate = ref(dayjs())
const selectedDate = ref(dayjs())
const currentView = ref('month')
const currentFilter = ref('all')
const showAddEventDialog = ref(false)
const editingEvent = ref(null)

// 事件表单
const eventForm = ref({
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  priority: 'medium',
  reminder: false,
  reminderTime: '15'
})

// 模拟事件数据
const events = ref([
  {
    id: 1,
    title: '团队会议',
    description: '讨论项目进度',
    startTime: dayjs().format('YYYY-MM-DD 09:00:00'),
    endTime: dayjs().format('YYYY-MM-DD 10:00:00'),
    priority: 'high',
    completed: false
  },
  {
    id: 2,
    title: '客户拜访',
    description: '拜访重要客户',
    startTime: dayjs().add(1, 'day').format('YYYY-MM-DD 14:00:00'),
    endTime: dayjs().add(1, 'day').format('YYYY-MM-DD 16:00:00'),
    priority: 'medium',
    completed: false
  }
])

// 视图选项
const viewOptions = [
  { label: '月', value: 'month' },
  { label: '周', value: 'week' },
  { label: '日', value: 'day' }
]

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 计算属性
const currentMonthYear = computed(() => {
  return currentDate.value.format('YYYY年MM月')
})

const stats = computed(() => {
  const total = events.value.length
  const today = dayjs().format('YYYY-MM-DD')
  const todayEvents = events.value.filter(event => 
    dayjs(event.startTime).format('YYYY-MM-DD') === today
  ).length
  const upcomingEvents = events.value.filter(event => 
    dayjs(event.startTime).isAfter(dayjs()) && !event.completed
  ).length
  const completedEvents = events.value.filter(event => event.completed).length

  return {
    totalEvents: total,
    todayEvents,
    upcomingEvents,
    completedEvents
  }
})

const calendarDates = computed(() => {
  const startOfMonth = currentDate.value.startOf('month')
  const endOfMonth = currentDate.value.endOf('month')
  const startOfCalendar = startOfMonth.startOf('week')
  const endOfCalendar = endOfMonth.endOf('week')
  
  const dates = []
  let current = startOfCalendar
  
  while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
    const dateEvents = events.value.filter(event => 
      dayjs(event.startTime).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
    )
    
    dates.push({
      key: current.format('YYYY-MM-DD'),
      day: current.date(),
      date: current,
      isCurrentMonth: current.month() === currentDate.value.month(),
      isToday: current.isSame(dayjs(), 'day'),
      isSelected: current.isSame(selectedDate.value, 'day'),
      events: dateEvents
    })
    
    current = current.add(1, 'day')
  }
  
  return dates
})

const weekDates = computed(() => {
  const startOfWeek = selectedDate.value.startOf('week')
  const dates = []
  
  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.add(i, 'day')
    dates.push({
      key: date.format('YYYY-MM-DD'),
      day: date.date(),
      dayName: weekDays[i],
      date: date,
      isToday: date.isSame(dayjs(), 'day')
    })
  }
  
  return dates
})

// 方法
const setFilter = (filter: string) => {
  currentFilter.value = filter
}

const setView = (view: string) => {
  currentView.value = view
}

const previousMonth = () => {
  currentDate.value = currentDate.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, 'month')
}

const goToToday = () => {
  currentDate.value = dayjs()
  selectedDate.value = dayjs()
}

const selectDate = (date: any) => {
  selectedDate.value = date.date
}

const getEventsForHour = (date: any, hour: number) => {
  return events.value.filter(event => {
    const eventStart = dayjs(event.startTime)
    return eventStart.format('YYYY-MM-DD') === date.format('YYYY-MM-DD') &&
           eventStart.hour() === hour
  })
}

const formatEventTime = (event: any) => {
  const start = dayjs(event.startTime)
  const end = dayjs(event.endTime)
  return `${start.format('HH:mm')} - ${end.format('HH:mm')}`
}

const addEventAtTime = (date: any, hour: number) => {
  const startTime = date.hour(hour).minute(0).second(0)
  const endTime = startTime.add(1, 'hour')
  
  eventForm.value = {
    title: '',
    description: '',
    startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
    endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    priority: 'medium',
    reminder: false,
    reminderTime: '15'
  }
  
  editingEvent.value = null
  showAddEventDialog.value = true
}

const editEvent = (event: any) => {
  eventForm.value = { ...event }
  editingEvent.value = event
  showAddEventDialog.value = true
}

const saveEvent = () => {
  if (editingEvent.value) {
    // 编辑现有事件
    const index = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (index !== -1) {
      events.value[index] = { ...eventForm.value, id: editingEvent.value.id }
    }
  } else {
    // 添加新事件
    const newEvent = {
      ...eventForm.value,
      id: Date.now(),
      completed: false
    }
    events.value.push(newEvent)
  }
  
  showAddEventDialog.value = false
  editingEvent.value = null
}

const deleteEvent = () => {
  if (editingEvent.value) {
    const index = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }
  showAddEventDialog.value = false
  editingEvent.value = null
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.calendar-module {
  display: flex;
  height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
}

.calendar-sidebar {
  width: 300px;
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  padding: 20px;
  overflow-y: auto;
}

.stats-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--gradient-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.filter-section, .calendar-nav {
  margin-bottom: 30px;
}

.filter-section h3, .calendar-nav h3 {
  margin-bottom: 15px;
  color: var(--text-color);
  font-size: 16px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
}

.filter-option:hover {
  background: var(--primary-light);
}

.filter-option.active {
  background: var(--primary-color);
  color: white;
}

.filter-option i {
  margin-right: 10px;
  width: 16px;
}

.filter-option span {
  flex: 1;
}

.count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.nav-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.nav-btn {
  background: var(--primary-color);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-month {
  font-weight: bold;
  color: var(--text-color);
}

.today-btn {
  width: 100%;
  background: var(--accent-color);
  border: none;
  color: white;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.calendar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-bg);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toolbar-left h2 {
  margin: 0;
  color: var(--text-color);
}

.view-switcher {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 2px;
}

.view-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
}

.add-event-btn {
  background: var(--primary-color);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-view {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.month-view {
  height: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1px;
}

.day-header {
  background: var(--card-bg);
  padding: 15px;
  text-align: center;
  font-weight: bold;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  height: calc(100% - 60px);
}

.calendar-cell {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

.calendar-cell:hover {
  background: var(--primary-light);
}

.calendar-cell.other-month {
  opacity: 0.5;
}

.calendar-cell.today {
  background: var(--primary-color);
  color: white;
}

.calendar-cell.selected {
  border-color: var(--accent-color);
  border-width: 2px;
}

.date-number {
  font-weight: bold;
  margin-bottom: 5px;
}

.events-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-dot {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--primary-color);
}

.event-dot.priority-high {
  background: #ff4757;
}

.event-dot.priority-medium {
  background: #ffa502;
}

.event-dot.priority-low {
  background: #2ed573;
}

.more-events {
  font-size: 10px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 2px;
}

.week-view, .day-view {
  height: 100%;
}

.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1px;
}

.time-column {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.day-column {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 10px;
  text-align: center;
}

.day-label {
  font-weight: bold;
  color: var(--text-secondary);
}

.date-label {
  font-size: 18px;
  margin-top: 5px;
}

.date-label.today {
  color: var(--primary-color);
  font-weight: bold;
}

.week-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  height: calc(100% - 80px);
}

.time-slots {
  display: flex;
  flex-direction: column;
}

.time-slot {
  height: 60px;
  padding: 5px;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: flex-start;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.hour-slot {
  height: 60px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  cursor: pointer;
}

.hour-slot:hover {
  background: var(--primary-light);
}

.event-block {
  position: absolute;
  left: 2px;
  right: 2px;
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  z-index: 1;
}

.event-block.priority-high {
  background: #ff4757;
}

.event-block.priority-medium {
  background: #ffa502;
}

.event-block.priority-low {
  background: #2ed573;
}

.event-title {
  font-weight: bold;
  margin-bottom: 2px;
}

.event-time {
  font-size: 10px;
  opacity: 0.8;
}

.event-description {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
}

.day-header h3 {
  margin: 0 0 20px 0;
  color: var(--text-color);
}

.day-schedule {
  display: grid;
  grid-template-columns: 80px 1fr;
  height: calc(100% - 60px);
}

.events-column {
  display: flex;
  flex-direction: column;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-module {
    flex-direction: column;
  }
  
  .calendar-sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .toolbar-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>