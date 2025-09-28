<template>
  <div class="project-management">
    <div class="project-header">
      <h3 class="module-title">📊 项目管理</h3>
      <div class="view-controls">
        <el-radio-group v-model="currentView" size="small">
          <el-radio-button label="table">表格视图</el-radio-button>
          <el-radio-button label="gantt">甘特图</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    
    <!-- 项目选择器 -->
    <div class="project-selector">
      <el-select v-model="currentProject" placeholder="选择项目" size="small">
        <el-option 
          v-for="project in projects" 
          :key="project.id" 
          :label="project.name" 
          :value="project.id" 
        />
      </el-select>
      <el-button type="primary" size="small" @click="showNewProjectDialog = true">新建项目</el-button>
    </div>
    
    <!-- 表格视图 -->
    <div v-if="currentView === 'table'" class="table-view">
      <el-table :data="currentTasks" style="width: 100%" size="small">
        <el-table-column prop="name" label="任务名称" min-width="120">
          <template #default="{ row }">
            <el-input 
              v-if="row.editing" 
              v-model="row.name" 
              size="small" 
              @blur="saveTask(row)"
            />
            <span v-else @dblclick="startEditing(row)">{{ row.name }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-select 
              v-model="row.status" 
              size="small" 
              @change="saveTask(row)"
            >
              <el-option label="未开始" value="not_started" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="completed" />
              <el-option label="已延期" value="delayed" />
            </el-select>
          </template>
        </el-table-column>
        
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-select 
              v-model="row.priority" 
              size="small" 
              @change="saveTask(row)"
            >
              <el-option label="低" value="low" />
              <el-option label="中" value="medium" />
              <el-option label="高" value="high" />
            </el-select>
          </template>
        </el-table-column>
        
        <el-table-column label="开始日期" width="120">
          <template #default="{ row }">
            <el-date-picker
              v-model="row.startDate"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              size="small"
              @change="saveTask(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="结束日期" width="120">
          <template #default="{ row }">
            <el-date-picker
              v-model="row.endDate"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              size="small"
              @change="saveTask(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="进度" width="120">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.progress" 
              :status="getProgressStatus(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small" 
                @click="editTaskProgress(row)"
                title="更新进度"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click="deleteTask(row)"
                title="删除任务"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="add-task-row">
        <el-button type="primary" @click="showNewTaskDialog = true" size="small">
          <el-icon><Plus /></el-icon> 添加任务
        </el-button>
      </div>
    </div>
    
    <!-- 甘特图视图 -->
<div v-else-if="currentView === 'gantt'" class="gantt-view">
  <!-- 项目信息 -->
  <div class="project-info">
    <div class="project-name">
      {{ currentProjectName }}
    </div>
    <div class="project-date-range">
      {{ formatDateRange() }}
    </div>
  </div>
  
  <div class="gantt-container">
    <!-- 甘特图头部 -->
    <div class="gantt-header">
      <div class="gantt-task-info">
        <span class="task-header-text">任务</span>
      </div>
      <div class="gantt-timeline-header">
        <div 
          v-for="(day, index) in timelineDays" 
          :key="index" 
          class="gantt-day"
          :class="{ 'weekend': isWeekend(day) }"
        >
          <div class="day-number">{{ formatDayNumber(day) }}</div>
          <div class="day-name">{{ formatDayName(day) }}</div>
        </div>
      </div>
    </div>
    
    <!-- 甘特图内容 -->
    <div class="gantt-body">
      <div 
        v-for="task in currentTasks" 
        :key="task.id" 
        class="gantt-row"
      >
        <div class="gantt-task-info">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-dates">
            <span class="task-date start">{{ formatFullDate(task.startDate) }}</span>
            <span class="task-date-separator">-</span>
            <span class="task-date end">{{ formatFullDate(task.endDate) }}</span>
          </div>
        </div>
        <div class="gantt-timeline">
          <div 
            class="gantt-bar"
            :class="getTaskStatusClass(task)"
            :style="getTaskBarStyle(task)"
            @click="editTaskProgress(task)"
          >
            <div class="bar-content">
              <span class="bar-title">{{ task.name }}</span>
              <span class="bar-progress">{{ task.progress }}%</span>
            </div>
            <div class="progress-indicator" :style="{ width: `${task.progress}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    
    <!-- 新建项目对话框 -->
    <el-dialog
      v-model="showNewProjectDialog"
      title="新建项目"
      width="30%"
    >
      <el-form :model="newProject" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="newProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="newProject.description" 
            type="textarea" 
            placeholder="请输入项目描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNewProjectDialog = false">取消</el-button>
          <el-button type="primary" @click="createProject">创建</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新建任务对话框 -->
    <el-dialog
      v-model="showNewTaskDialog"
      title="新建任务"
      width="40%"
    >
      <el-form :model="newTask" label-width="80px">
        <el-form-item label="任务名称">
          <el-input v-model="newTask.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newTask.status" placeholder="选择状态">
            <el-option label="未开始" value="not_started" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
            <el-option label="已延期" value="delayed" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="newTask.priority" placeholder="选择优先级">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="newTask.startDate"
            type="date"
            placeholder="选择开始日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="newTask.endDate"
            type="date"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="进度">
          <el-slider v-model="newTask.progress" :step="5" show-stops />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNewTaskDialog = false">取消</el-button>
          <el-button type="primary" @click="createTask">创建</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 编辑任务进度对话框 -->
    <el-dialog
      v-model="showEditProgressDialog"
      title="更新任务进度"
      width="30%"
    >
      <template v-if="editingTask">
        <h4>{{ editingTask.name }}</h4>
        <el-form label-width="80px">
          <el-form-item label="进度">
            <el-slider v-model="editingTask.progress" :step="5" show-stops />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="editingTask.status" placeholder="选择状态">
              <el-option label="未开始" value="not_started" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="completed" />
              <el-option label="已延期" value="delayed" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditProgressDialog = false">取消</el-button>
          <el-button type="primary" @click="updateTaskProgress">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'

// 视图切换
const currentView = ref('table')

// 项目数据
const projects = ref([
  { id: '1', name: '网站重构项目', description: '对公司官网进行全面重构和优化' },
  { id: '2', name: '移动应用开发', description: '开发iOS和Android版本的移动应用' }
])
const currentProject = ref('1')

// 任务数据
const tasks = ref([
  {
    id: '101',
    projectId: '1',
    name: '需求分析',
    status: 'completed',
    priority: 'high',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-10'),
    progress: 100,
    editing: false
  },
  {
    id: '102',
    projectId: '1',
    name: 'UI设计',
    status: 'completed',
    priority: 'medium',
    startDate: new Date('2023-10-11'),
    endDate: new Date('2023-10-25'),
    progress: 100,
    editing: false
  },
  {
    id: '103',
    projectId: '1',
    name: '前端开发',
    status: 'in_progress',
    priority: 'high',
    startDate: new Date('2023-10-26'),
    endDate: new Date('2023-11-15'),
    progress: 60,
    editing: false
  },
  {
    id: '104',
    projectId: '1',
    name: '后端开发',
    status: 'in_progress',
    priority: 'high',
    startDate: new Date('2023-10-26'),
    endDate: new Date('2023-11-20'),
    progress: 45,
    editing: false
  },
  {
    id: '105',
    projectId: '1',
    name: '测试',
    status: 'not_started',
    priority: 'medium',
    startDate: new Date('2023-11-21'),
    endDate: new Date('2023-11-30'),
    progress: 0,
    editing: false
  },
  {
    id: '201',
    projectId: '2',
    name: '需求收集',
    status: 'completed',
    priority: 'high',
    startDate: new Date('2023-09-15'),
    endDate: new Date('2023-09-30'),
    progress: 100,
    editing: false
  },
  {
    id: '202',
    projectId: '2',
    name: '原型设计',
    status: 'completed',
    priority: 'medium',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-10-15'),
    progress: 100,
    editing: false
  },
  {
    id: '203',
    projectId: '2',
    name: 'iOS开发',
    status: 'in_progress',
    priority: 'high',
    startDate: new Date('2023-10-16'),
    endDate: new Date('2023-11-30'),
    progress: 35,
    editing: false
  },
  {
    id: '204',
    projectId: '2',
    name: 'Android开发',
    status: 'in_progress',
    priority: 'high',
    startDate: new Date('2023-10-16'),
    endDate: new Date('2023-11-30'),
    progress: 30,
    editing: false
  }
])

// 当前项目的任务
const currentTasks = computed(() => {
  return tasks.value.filter(task => task.projectId === currentProject.value)
})

// 当前项目名称
const currentProjectName = computed(() => {
  const project = projects.value.find(p => p.id === currentProject.value)
  return project ? project.name : ''
})

// 对话框控制
const showNewProjectDialog = ref(false)
const showNewTaskDialog = ref(false)
const showEditProgressDialog = ref(false)

// 新项目表单
const newProject = ref({
  name: '',
  description: ''
})

// 新任务表单
const newTask = ref({
  name: '',
  status: 'not_started',
  priority: 'medium',
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  progress: 0
})

// 编辑中的任务
const editingTask = ref(null)

// 甘特图时间轴
const timelineDays = computed(() => {
  if (currentTasks.value.length === 0) return []
  
  // 找出最早的开始日期和最晚的结束日期
  let minDate = new Date()
  let maxDate = new Date()
  
  currentTasks.value.forEach(task => {
    if (task.startDate && task.startDate < minDate) {
      minDate = new Date(task.startDate)
    }
    if (task.endDate && task.endDate > maxDate) {
      maxDate = new Date(task.endDate)
    }
  })
  
  // 确保至少显示14天
  const diffDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24))
  if (diffDays < 14) {
    maxDate = new Date(minDate.getTime() + 14 * 24 * 60 * 60 * 1000)
  }
  
  // 生成日期数组
  const days = []
  const currentDate = new Date(minDate)
  while (currentDate <= maxDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
})

// 创建新项目
function createProject() {
  if (!newProject.value.name) {
    ElNotification({
      title: '错误',
      message: '项目名称不能为空',
      type: 'error'
    })
    return
  }
  
  const projectId = uuidv4()
  projects.value.push({
    id: projectId,
    name: newProject.value.name,
    description: newProject.value.description
  })
  
  currentProject.value = projectId
  showNewProjectDialog.value = false
  newProject.value = { name: '', description: '' }
  
  ElNotification({
    title: '成功',
    message: '项目创建成功',
    type: 'success'
  })
}

// 创建新任务
function createTask() {
  if (!newTask.value.name) {
    ElNotification({
      title: '错误',
      message: '任务名称不能为空',
      type: 'error'
    })
    return
  }
  
  if (!newTask.value.startDate || !newTask.value.endDate) {
    ElNotification({
      title: '错误',
      message: '请选择开始和结束日期',
      type: 'error'
    })
    return
  }
  
  if (newTask.value.endDate < newTask.value.startDate) {
    ElNotification({
      title: '错误',
      message: '结束日期不能早于开始日期',
      type: 'error'
    })
    return
  }
  
  tasks.value.push({
    id: uuidv4(),
    projectId: currentProject.value,
    name: newTask.value.name,
    status: newTask.value.status,
    priority: newTask.value.priority,
    startDate: newTask.value.startDate,
    endDate: newTask.value.endDate,
    progress: newTask.value.progress,
    editing: false
  })
  
  showNewTaskDialog.value = false
  newTask.value = {
    name: '',
    status: 'not_started',
    priority: 'medium',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    progress: 0
  }
  
  ElNotification({
    title: '成功',
    message: '任务创建成功',
    type: 'success'
  })
}

// 开始编辑任务
function startEditing(task) {
  task.editing = true
}

// 保存任务
function saveTask(task) {
  task.editing = false
  
  // 如果进度为100%，自动将状态设为已完成
  if (task.progress === 100 && task.status !== 'completed') {
    task.status = 'completed'
  }
  
  // 如果状态为已完成，自动将进度设为100%
  if (task.status === 'completed' && task.progress !== 100) {
    task.progress = 100
  }
  
  ElNotification({
    title: '成功',
    message: '任务已更新',
    type: 'success',
    duration: 2000
  })
}

// 编辑任务进度
function editTaskProgress(task) {
  editingTask.value = JSON.parse(JSON.stringify(task))
  showEditProgressDialog.value = true
}

// 更新任务进度
function updateTaskProgress() {
  if (!editingTask.value) return
  
  const taskIndex = tasks.value.findIndex(t => t.id === editingTask.value.id)
  if (taskIndex !== -1) {
    tasks.value[taskIndex].progress = editingTask.value.progress
    tasks.value[taskIndex].status = editingTask.value.status
    
    // 如果进度为100%，自动将状态设为已完成
    if (editingTask.value.progress === 100 && editingTask.value.status !== 'completed') {
      tasks.value[taskIndex].status = 'completed'
    }
    
    // 如果状态为已完成，自动将进度设为100%
    if (editingTask.value.status === 'completed' && editingTask.value.progress !== 100) {
      tasks.value[taskIndex].progress = 100
    }
  }
  
  showEditProgressDialog.value = false
  editingTask.value = null
  
  ElNotification({
    title: '成功',
    message: '任务进度已更新',
    type: 'success',
    duration: 2000
  })
}

// 删除任务
function deleteTask(task) {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    
    ElNotification({
      title: '成功',
      message: '任务已删除',
      type: 'success',
      duration: 2000
    })
  }
}

// 获取进度状态
function getProgressStatus(task) {
  if (task.status === 'completed') return 'success'
  if (task.status === 'delayed') return 'exception'
  if (task.progress > 0) return ''
  return 'info'
}

// 格式化日期（简短格式，月/日）
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// 格式化日期（只显示日期数字）
function formatDayNumber(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.getDate()
}

// 格式化日期（只显示星期几）
function formatDayName(date) {
  if (!date) return ''
  const d = new Date(date)
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return '周' + days[d.getDay()]
}

// 格式化完整日期（年-月-日）
function formatFullDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 判断是否为周末
function isWeekend(date) {
  if (!date) return false
  const d = new Date(date)
  const day = d.getDay()
  return day === 0 || day === 6 // 0是周日，6是周六
}

// 格式化项目日期范围
function formatDateRange() {
  if (currentTasks.value.length === 0) return ''
  
  let minDate = new Date()
  let maxDate = new Date()
  
  currentTasks.value.forEach(task => {
    if (task.startDate && task.startDate < minDate) {
      minDate = new Date(task.startDate)
    }
    if (task.endDate && task.endDate > maxDate) {
      maxDate = new Date(task.endDate)
    }
  })
  
  return `${formatFullDate(minDate)} 至 ${formatFullDate(maxDate)}`
}

// 获取任务状态类名
function getTaskStatusClass(task) {
  return {
    'status-not-started': task.status === 'not_started',
    'status-in-progress': task.status === 'in_progress',
    'status-completed': task.status === 'completed',
    'status-delayed': task.status === 'delayed',
    'priority-high': task.priority === 'high',
    'priority-medium': task.priority === 'medium',
    'priority-low': task.priority === 'low'
  }
}

// 获取任务条样式
function getTaskBarStyle(task) {
  if (!task.startDate || !task.endDate || timelineDays.value.length === 0) {
    return { display: 'none' }
  }
  
  const startDate = new Date(task.startDate)
  const endDate = new Date(task.endDate)
  
  // 计算开始位置（相对于时间轴第一天）
  const firstDay = timelineDays.value[0]
  let startDiff = Math.floor((startDate - firstDay) / (1000 * 60 * 60 * 24))
  if (startDiff < 0) startDiff = 0
  
  // 计算持续天数
  let duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
  if (duration < 1) duration = 1
  
  // 确保不超出时间轴
  if (startDiff + duration > timelineDays.value.length) {
    duration = timelineDays.value.length - startDiff
  }
  
  return {
    left: `${startDiff * 80}px`,
    width: `${duration * 80 - 10}px`
  }
}
</script>

<style scoped>
.project-management {
  padding: 15px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.module-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.project-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.project-selector .el-select {
  flex: 1;
}

.add-task-row {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

/* 甘特图样式 */
.gantt-view {
  margin-top: 20px;
  overflow-x: auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* 项目信息样式 */
.project-info {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.project-date-range {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 12px;
  border-radius: 20px;
}

.gantt-container {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: var(--el-bg-color);
}

.gantt-header {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.01));
}

.gantt-task-info {
  width: 200px;
  min-width: 200px;
  padding: 12px 16px;
  font-weight: bold;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.task-header-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.gantt-timeline-header {
  display: flex;
  flex: 1;
}

.gantt-day {
  width: 80px;
  min-width: 80px;
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background-color 0.3s;
}

.gantt-day.weekend {
  background-color: rgba(0, 0, 0, 0.02);
}

.day-number {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.day-name {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.gantt-body {
  display: flex;
  flex-direction: column;
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  height: 60px;
  transition: background-color 0.2s;
}

.gantt-row:hover {
  background-color: rgba(0, 0, 0, 0.01);
}

.gantt-task-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 16px;
}

.task-name {
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.task-dates {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.task-date {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.task-date-separator {
  margin: 0 4px;
  opacity: 0.5;
}

.gantt-timeline {
  position: relative;
  flex: 1;
  display: flex;
}

.gantt-bar {
  position: absolute;
  height: 32px;
  top: 14px;
  border-radius: 16px;
  padding: 0;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bar-content {
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.bar-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.bar-progress {
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
}

.progress-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: width 0.3s;
}

.gantt-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 任务状态样式 */
.status-not-started {
  background: linear-gradient(135deg, #e6e6e6, #d0d0d0);
  color: #606266;
}

.status-in-progress {
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: white;
}

.status-completed {
  background: linear-gradient(135deg, #67c23a, #529b2e);
  color: white;
}

.status-delayed {
  background: linear-gradient(135deg, #f56c6c, #c45656);
  color: white;
}

/* 深色模式适配 */
.dark .gantt-view {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.4), rgba(20, 20, 20, 0.2));
}

.dark .project-date-range {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .gantt-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark .gantt-header {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
}

.dark .gantt-day.weekend {
  background-color: rgba(255, 255, 255, 0.02);
}

.dark .gantt-row:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* 优先级样式 */
.priority-high.status-not-started {
  border-left: 4px solid #f56c6c;
}

.priority-medium.status-not-started {
  border-left: 4px solid #e6a23c;
}

.priority-low.status-not-started {
  border-left: 4px solid #909399;
}
</style>