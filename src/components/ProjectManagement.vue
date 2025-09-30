<template>
  <div class="project-management">
    <!-- 顶部导航栏 -->
    <div class="project-header">
      <div class="header-left">
        <div class="module-icon">📊</div>
        <h3 class="module-title">项目管理</h3>
        <div class="project-stats">
          <span class="stat-item">
            <span class="stat-number">{{ projects.length }}</span>
            <span class="stat-label">项目</span>
          </span>
          <span class="stat-item">
            <span class="stat-number">{{ totalTasks }}</span>
            <span class="stat-label">任务</span>
          </span>
          <span class="stat-item">
            <span class="stat-number">{{ completedTasks }}</span>
            <span class="stat-label">已完成</span>
          </span>
        </div>
      </div>
      <div class="header-right">
        <div class="view-controls">
          <el-radio-group v-model="currentView" size="default" class="modern-radio-group">
            <el-radio-button label="table">
              <el-icon><Grid /></el-icon>
              <span>表格视图</span>
            </el-radio-button>
            <el-radio-button label="gantt">
              <el-icon><TrendCharts /></el-icon>
              <span>甘特图</span>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    
    <!-- 项目选择器和操作栏 -->
    <div class="project-toolbar">
      <div class="toolbar-left">
        <el-select 
          v-model="currentProject" 
          placeholder="选择项目" 
          size="default"
          class="project-selector-modern"
          clearable
          filterable
        >
          <template #prefix>
            <el-icon><Folder /></el-icon>
          </template>
          <el-option 
            v-for="project in projects" 
            :key="project.id" 
            :label="project.name" 
            :value="project.id"
          >
            <div class="project-option">
              <span class="project-name">{{ project.name }}</span>
              <span class="project-task-count">{{ getProjectTaskCount(project.id) }} 任务</span>
            </div>
          </el-option>
        </el-select>
        
        <div class="quick-filters">
          <el-button-group class="filter-group">
            <el-button 
              :type="statusFilter === 'all' ? 'primary' : ''" 
              @click="statusFilter = 'all'"
              size="default"
            >
              全部
            </el-button>
            <el-button 
              :type="statusFilter === 'in_progress' ? 'primary' : ''" 
              @click="statusFilter = 'in_progress'"
              size="default"
            >
              进行中
            </el-button>
            <el-button 
              :type="statusFilter === 'delayed' ? 'primary' : ''" 
              @click="statusFilter = 'delayed'"
              size="default"
            >
              延期
            </el-button>
          </el-button-group>
        </div>
      </div>
      
      <div class="toolbar-right">
        <el-button type="primary" @click="showNewProjectDialog = true" size="default" class="create-btn">
          <el-icon><Plus /></el-icon>
          新建项目
        </el-button>
      </div>
    </div>
    
    <!-- 表格视图 -->
    <div v-if="currentView === 'table'" class="table-view">
      <div class="table-container">
        <el-table 
          :data="filteredTasks" 
          style="width: 100%" 
          size="default"
          class="modern-table"
          :header-cell-style="{ background: 'var(--el-fill-color-lighter)', fontWeight: '600' }"
          stripe
        >
          <el-table-column prop="name" label="任务名称" min-width="180">
            <template #default="{ row }">
              <div class="task-cell">
                <div class="task-priority-indicator" :class="`priority-${row.priority}`"></div>
                <el-input 
                  v-if="row.editing" 
                  v-model="row.name" 
                  size="default" 
                  @blur="saveTask(row)"
                  @keyup.enter="saveTask(row)"
                />
                <div v-else @dblclick="startEditing(row)" class="task-name-display">
                  <span class="task-title">{{ row.name }}</span>
                  <el-icon class="edit-hint"><Edit /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="140">
            <template #default="{ row }">
              <el-select 
                v-model="row.status" 
                size="default" 
                @change="saveTask(row)"
                class="status-select"
              >
                <el-option label="未开始" value="not_started">
                  <div class="status-option">
                    <div class="status-dot status-not-started"></div>
                    <span>未开始</span>
                  </div>
                </el-option>
                <el-option label="进行中" value="in_progress">
                  <div class="status-option">
                    <div class="status-dot status-in-progress"></div>
                    <span>进行中</span>
                  </div>
                </el-option>
                <el-option label="已完成" value="completed">
                  <div class="status-option">
                    <div class="status-dot status-completed"></div>
                    <span>已完成</span>
                  </div>
                </el-option>
                <el-option label="已延期" value="delayed">
                  <div class="status-option">
                    <div class="status-dot status-delayed"></div>
                    <span>已延期</span>
                  </div>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column prop="priority" label="优先级" width="120">
            <template #default="{ row }">
              <el-select 
                v-model="row.priority" 
                size="default" 
                @change="saveTask(row)"
                class="priority-select"
              >
                <el-option label="低" value="low">
                  <div class="priority-option">
                    <div class="priority-indicator low"></div>
                    <span>低</span>
                  </div>
                </el-option>
                <el-option label="中" value="medium">
                  <div class="priority-option">
                    <div class="priority-indicator medium"></div>
                    <span>中</span>
                  </div>
                </el-option>
                <el-option label="高" value="high">
                  <div class="priority-option">
                    <div class="priority-indicator high"></div>
                    <span>高</span>
                  </div>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column label="开始日期" width="140">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.startDate"
                type="date"
                placeholder="选择日期"
                format="MM-DD"
                value-format="YYYY-MM-DD"
                size="default"
                @change="saveTask(row)"
                class="date-picker-compact"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="结束日期" width="140">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.endDate"
                type="date"
                placeholder="选择日期"
                format="MM-DD"
                value-format="YYYY-MM-DD"
                size="default"
                @change="saveTask(row)"
                class="date-picker-compact"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="进度" width="160">
            <template #default="{ row }">
              <div class="progress-cell">
                <el-progress 
                  :percentage="row.progress" 
                  :status="getProgressStatus(row)"
                  :stroke-width="8"
                  class="task-progress"
                />
                <span class="progress-text">{{ row.progress }}%</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-tooltip content="更新进度" placement="top">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="editTaskProgress(row)"
                    circle
                    class="action-btn"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除任务" placement="top">
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="deleteTask(row)"
                    circle
                    class="action-btn"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div class="add-task-section">
        <el-button 
          type="primary" 
          @click="showNewTaskDialog = true" 
          size="large"
          class="add-task-btn"
        >
          <el-icon><Plus /></el-icon> 
          添加新任务
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

// 状态过滤器
const statusFilter = ref('all')

// 过滤后的任务
const filteredTasks = computed(() => {
  let filtered = currentTasks.value
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(task => task.status === statusFilter.value)
  }
  
  return filtered
})

// 统计数据
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed').length)

// 获取项目任务数量
function getProjectTaskCount(projectId) {
  return tasks.value.filter(task => task.projectId === projectId).length
}
</script>

<style scoped>
/* 现代化样式优化 */
.project-management {
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  height: 100%;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.module-icon {
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.module-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.project-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
  font-weight: 500;
}

.modern-radio-group {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.modern-radio-group .el-radio-button__inner {
  border: none;
  background: transparent;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modern-radio-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.project-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.project-selector-modern {
  min-width: 200px;
}

.project-selector-modern .el-input__wrapper {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.project-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.project-name {
  font-weight: 500;
}

.project-task-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.filter-group {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-group .el-button {
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-group .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.create-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.table-container {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
}

.modern-table .el-table__header-wrapper {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.modern-table .el-table__row:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.task-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-priority-indicator {
  width: 4px;
  height: 24px;
  border-radius: 2px;
  flex-shrink: 0;
}

.task-priority-indicator.priority-high {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.task-priority-indicator.priority-medium {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
}

.task-priority-indicator.priority-low {
  background: linear-gradient(135deg, #48dbfb, #0abde3);
}

.task-name-display {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.task-name-display:hover {
  background: rgba(102, 126, 234, 0.1);
}

.task-title {
  font-weight: 500;
}

.edit-hint {
  opacity: 0;
  transition: opacity 0.2s ease;
  color: var(--el-text-color-secondary);
}

.task-name-display:hover .edit-hint {
  opacity: 1;
}

.status-select, .priority-select {
  width: 100%;
}

.status-option, .priority-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.status-not-started {
  background: #909399;
}

.status-dot.status-in-progress {
  background: #409eff;
}

.status-dot.status-completed {
  background: #67c23a;
}

.status-dot.status-delayed {
  background: #f56c6c;
}

.priority-indicator {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.priority-indicator.low {
  background: linear-gradient(135deg, #48dbfb, #0abde3);
}

.priority-indicator.medium {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
}

.priority-indicator.high {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.date-picker-compact .el-input__wrapper {
  border-radius: 8px;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-progress {
  flex: 1;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  min-width: 35px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.add-task-section {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.add-task-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.add-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 深色模式适配 */
.dark .project-management {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .stat-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .project-toolbar {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .table-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .modern-table .el-table__header-wrapper {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
}

.dark .task-name-display:hover {
  background: rgba(102, 126, 234, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .project-stats {
    gap: 12px;
  }
  
  .project-toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-left {
    flex-direction: column;
    gap: 12px;
  }
}
</style>