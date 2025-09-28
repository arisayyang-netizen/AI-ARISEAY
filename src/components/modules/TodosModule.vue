<template>
  <div class="todos-module">
    <!-- 侧边栏 -->
    <div class="todos-sidebar">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">总任务</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">待完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.completionRate }}%</div>
          <div class="stat-label">完成率</div>
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
            <i class="icon-list"></i>
            <span>全部任务</span>
            <span class="count">{{ stats.total }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'pending' }"
            @click="setFilter('pending')"
          >
            <i class="icon-clock"></i>
            <span>待完成</span>
            <span class="count">{{ stats.pending }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'completed' }"
            @click="setFilter('completed')"
          >
            <i class="icon-check"></i>
            <span>已完成</span>
            <span class="count">{{ stats.completed }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'today' }"
            @click="setFilter('today')"
          >
            <i class="icon-calendar"></i>
            <span>今日任务</span>
            <span class="count">{{ todayTasks.length }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'overdue' }"
            @click="setFilter('overdue')"
          >
            <i class="icon-alert"></i>
            <span>已逾期</span>
            <span class="count">{{ overdueTasks.length }}</span>
          </div>
          <div 
            class="filter-option" 
            :class="{ active: currentFilter === 'high' }"
            @click="setFilter('high')"
          >
            <i class="icon-flag"></i>
            <span>高优先级</span>
            <span class="count">{{ highPriorityTasks.length }}</span>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <h3>快速操作</h3>
        <el-button 
          type="primary" 
          size="small" 
          @click="showCreateDialog = true"
          class="action-btn"
        >
          <i class="icon-plus"></i>
          新建任务
        </el-button>
        <el-button 
          size="small" 
          @click="clearCompleted"
          :disabled="stats.completed === 0"
          class="action-btn"
        >
          <i class="icon-trash"></i>
          清理已完成
        </el-button>
        <el-button 
          size="small" 
          @click="markAllCompleted"
          :disabled="stats.pending === 0"
          class="action-btn"
        >
          <i class="icon-check-all"></i>
          全部完成
        </el-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="todos-main">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索任务..."
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </div>
        <div class="toolbar-actions">
          <el-select v-model="sortBy" placeholder="排序" size="small">
            <el-option label="创建时间" value="createdAt" />
            <el-option label="更新时间" value="updatedAt" />
            <el-option label="截止时间" value="dueDate" />
            <el-option label="优先级" value="priority" />
            <el-option label="标题" value="title" />
          </el-select>
          <el-button 
            :icon="sortOrder === 'asc' ? 'SortUp' : 'SortDown'"
            size="small"
            @click="toggleSortOrder"
          />
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="tasks-container" v-loading="isLoading">
        <div v-if="filteredTasks.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <div class="empty-text">
            <template v-if="searchQuery">
              未找到匹配的任务
            </template>
            <template v-else>
              暂无任务，点击"新建任务"开始吧！
            </template>
          </div>
        </div>
        
        <div v-else class="tasks-list">
          <div 
            v-for="task in filteredTasks" 
            :key="task.id"
            class="task-item"
            :class="{ 
              completed: task.completed,
              overdue: isOverdue(task),
              'high-priority': task.priority === 'high'
            }"
          >
            <div class="task-checkbox">
              <el-checkbox 
                :model-value="task.completed"
                @change="toggleComplete(task.id)"
              />
            </div>
            
            <div class="task-content" @click="editTask(task)">
              <div class="task-title">{{ task.title }}</div>
              <div v-if="task.description" class="task-description">
                {{ task.description }}
              </div>
              <div class="task-meta">
                <span class="priority-badge" :class="task.priority">
                  {{ getPriorityText(task.priority) }}
                </span>
                <span v-if="task.dueDate" class="due-date">
                  <i class="icon-calendar"></i>
                  {{ formatDate(task.dueDate) }}
                </span>
                <span v-if="task.source === 'extracted'" class="source-badge">
                  <i class="icon-robot"></i>
                  AI提取
                </span>
              </div>
            </div>
            
            <div class="task-actions">
              <el-dropdown trigger="click">
                <el-button size="small" text>
                  <i class="icon-more"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editTask(task)">
                      <i class="icon-edit"></i> 编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="duplicateTask(task.id)">
                      <i class="icon-copy"></i> 复制
                    </el-dropdown-item>
                    <el-dropdown-item 
                      @click="deleteTask(task.id)"
                      class="danger"
                    >
                      <i class="icon-trash"></i> 删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑任务对话框 -->
    <el-dialog 
      v-model="showCreateDialog" 
      :title="editingTask ? '编辑任务' : '新建任务'"
      width="500px"
    >
      <el-form :model="taskForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input 
            v-model="taskForm.title" 
            placeholder="请输入任务标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="taskForm.description" 
            type="textarea" 
            placeholder="请输入任务描述"
            :rows="3"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-select v-model="taskForm.priority" placeholder="选择优先级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="taskForm.dueDate"
            type="datetime"
            placeholder="选择截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="cancelEdit">取消</el-button>
        <el-button 
          type="primary" 
          @click="saveTask"
          :disabled="!taskForm.title.trim()"
        >
          {{ editingTask ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTodosStore } from '@/stores/todos'
import { aiService } from '@/utils/ai-service'
import type { Task } from '@/types'
import dayjs from 'dayjs'

const todosStore = useTodosStore()

// 响应式数据
const searchQuery = ref('')
const currentFilter = ref('all')
const sortBy = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const showCreateDialog = ref(false)
const editingTask = ref<Task | null>(null)

// 任务表单
const taskForm = ref({
  title: '',
  description: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  dueDate: ''
})

// 计算属性
const { 
  tasks, 
  isLoading, 
  todayTasks, 
  overdueTasks, 
  highPriorityTasks 
} = todosStore

const stats = computed(() => todosStore.getTaskStats())

const filteredTasks = computed(() => {
  let result = tasks
  
  // 应用筛选
  switch (currentFilter.value) {
    case 'pending':
      result = todosStore.getTasksByStatus(false)
      break
    case 'completed':
      result = todosStore.getTasksByStatus(true)
      break
    case 'today':
      result = todayTasks
      break
    case 'overdue':
      result = overdueTasks
      break
    case 'high':
      result = todosStore.getTasksByPriority('high')
      break
    default:
      result = tasks
  }
  
  // 应用搜索
  if (searchQuery.value.trim()) {
    result = todosStore.searchTasks(searchQuery.value)
  }
  
  // 应用排序
  return [...result].sort((a, b) => {
    let aValue: any
    let bValue: any
    
    switch (sortBy.value) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
        break
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
        break
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime()
        bValue = new Date(b.updatedAt).getTime()
        break
      default: // createdAt
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
})

// 方法
const setFilter = (filter: string) => {
  currentFilter.value = filter
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const toggleComplete = async (taskId: string) => {
  try {
    await todosStore.toggleTaskComplete(taskId)
    ElMessage.success('任务状态已更新')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const editTask = (task: Task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD HH:mm:ss') : ''
  }
  showCreateDialog.value = true
}

const cancelEdit = () => {
  showCreateDialog.value = false
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  }
}

const saveTask = async () => {
  if (!taskForm.value.title.trim()) {
    ElMessage.warning('请输入任务标题')
    return
  }
  
  try {
    const dueDate = taskForm.value.dueDate ? new Date(taskForm.value.dueDate) : undefined
    
    if (editingTask.value) {
      // 更新任务
      const updatedTask: Task = {
        ...editingTask.value,
        title: taskForm.value.title.trim(),
        description: taskForm.value.description.trim() || undefined,
        priority: taskForm.value.priority,
        dueDate
      }
      await todosStore.updateTask(updatedTask)
      ElMessage.success('任务已更新')
    } else {
      // 创建任务
      await todosStore.createTask(
        taskForm.value.title.trim(),
        taskForm.value.description.trim() || undefined,
        taskForm.value.priority,
        dueDate
      )
      ElMessage.success('任务已创建')
    }
    
    cancelEdit()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const deleteTask = async (taskId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '确认删除', {
      type: 'warning'
    })
    
    await todosStore.deleteTask(taskId)
    ElMessage.success('任务已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const duplicateTask = async (taskId: string) => {
  try {
    await todosStore.duplicateTask(taskId)
    ElMessage.success('任务已复制')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const clearCompleted = async () => {
  try {
    await ElMessageBox.confirm('确定要清理所有已完成的任务吗？', '确认清理', {
      type: 'warning'
    })
    
    await todosStore.clearCompletedTasks()
    ElMessage.success('已清理完成的任务')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败')
    }
  }
}

const markAllCompleted = async () => {
  try {
    await ElMessageBox.confirm('确定要将所有任务标记为已完成吗？', '确认操作', {
      type: 'warning'
    })
    
    await todosStore.markAllAsCompleted()
    ElMessage.success('所有任务已标记为完成')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false
  return new Date(task.dueDate) < new Date()
}

const getPriorityText = (priority: string): string => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[priority as keyof typeof map] || '中'
}

const formatDate = (date: Date): string => {
  return dayjs(date).format('MM-DD HH:mm')
}

// 生命周期
onMounted(async () => {
  await todosStore.loadTasks()
})

// 监听器
watch(showCreateDialog, (newVal) => {
  if (!newVal) {
    cancelEdit()
  }
})
</script>

<style scoped>
.todos-module {
  display: flex;
  height: 100%;
  background: var(--bg-color);
}

.todos-sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 20px;
  overflow-y: auto;
}

.stats-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-color);
  padding: 16px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-option:hover {
  background: var(--bg-hover);
}

.filter-option.active {
  background: var(--primary-color);
  color: white;
}

.filter-option i {
  margin-right: 8px;
  width: 16px;
}

.filter-option .count {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.8;
}

.quick-actions {
  margin-bottom: 24px;
}

.quick-actions h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.action-btn {
  width: 100%;
  margin-bottom: 8px;
  justify-content: flex-start;
}

.action-btn i {
  margin-right: 8px;
}

.todos-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
}

.search-bar {
  flex: 1;
  max-width: 400px;
  margin-right: 16px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tasks-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all 0.2s;
}

.task-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-item.overdue {
  border-left: 4px solid var(--danger-color);
}

.task-item.high-priority {
  border-left: 4px solid var(--warning-color);
}

.task-checkbox {
  margin-right: 12px;
  margin-top: 2px;
}

.task-content {
  flex: 1;
  cursor: pointer;
}

.task-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.task-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.priority-badge.high {
  background: var(--danger-color);
  color: white;
}

.priority-badge.medium {
  background: var(--warning-color);
  color: white;
}

.priority-badge.low {
  background: var(--success-color);
  color: white;
}

.due-date {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.due-date i {
  margin-right: 4px;
}

.source-badge {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  background: var(--primary-color-light);
  padding: 2px 6px;
  border-radius: 4px;
}

.source-badge i {
  margin-right: 4px;
}

.task-actions {
  margin-left: 12px;
}

.danger {
  color: var(--danger-color) !important;
}

/* 图标样式 */
.icon-list::before { content: '📋'; }
.icon-clock::before { content: '⏰'; }
.icon-check::before { content: '✅'; }
.icon-calendar::before { content: '📅'; }
.icon-alert::before { content: '⚠️'; }
.icon-flag::before { content: '🚩'; }
.icon-plus::before { content: '➕'; }
.icon-trash::before { content: '🗑️'; }
.icon-check-all::before { content: '✔️'; }
.icon-more::before { content: '⋯'; }
.icon-edit::before { content: '✏️'; }
.icon-copy::before { content: '📋'; }
.icon-robot::before { content: '🤖'; }
</style>