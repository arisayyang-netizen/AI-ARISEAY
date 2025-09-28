import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { nanoid } from 'nanoid'
import { DatabaseManager } from '@/utils/database'

export const useTodosStore = defineStore('todos', () => {
  // 状态
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)

  // 计算属性
  const totalTasks = computed(() => tasks.value.length)
  
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.completed).length
  )
  
  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )
  
  const todayTasks = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return tasks.value.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate < tomorrow
    })
  })
  
  const overdueTasks = computed(() => {
    const now = new Date()
    return tasks.value.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      !task.completed
    )
  })
  
  const highPriorityTasks = computed(() => 
    tasks.value.filter(task => task.priority === 'high' && !task.completed)
  )
  
  const tasksByPriority = computed(() => {
    const groups = {
      high: tasks.value.filter(t => t.priority === 'high' && !t.completed),
      medium: tasks.value.filter(t => t.priority === 'medium' && !t.completed),
      low: tasks.value.filter(t => t.priority === 'low' && !t.completed)
    }
    return groups
  })

  // 方法
  const loadTasks = async () => {
    isLoading.value = true
    try {
      const dbTasks = await DatabaseManager.getTasks()
      
      if (dbTasks.length > 0) {
        tasks.value = dbTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }))
      } else {
        // 尝试从localStorage迁移数据
        const savedTasks = localStorage.getItem('ai-workbench-tasks')
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks)
          tasks.value = parsed.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined
          }))
          // 迁移到数据库
          await saveTasks()
          localStorage.removeItem('ai-workbench-tasks')
        } else {
          // 创建示例任务
          await createSampleTasks()
        }
      }
    } catch (error) {
      console.error('加载任务失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const saveTasks = async () => {
    try {
      // 批量保存到数据库
      for (const task of tasks.value) {
        if (!task.id) {
          const id = await DatabaseManager.saveTask(task)
          task.id = id
        } else {
          await DatabaseManager.updateTask(task.id, task)
        }
      }
    } catch (error) {
      console.error('保存任务失败:', error)
      throw error
    }
  }

  const createTask = async (
    title: string,
    description?: string,
    priority: 'high' | 'medium' | 'low' = 'medium',
    dueDate?: Date,
    source: 'manual' | 'extracted' = 'manual',
    sourceNoteId?: string
  ): Promise<Task> => {
    const taskData = {
      title,
      description,
      completed: false,
      priority,
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      source,
      sourceNoteId
    }
    
    try {
      const id = await DatabaseManager.saveTask(taskData)
      const task: Task = { ...taskData, id }
      tasks.value.unshift(task)
      return task
    } catch (error) {
      console.error('创建任务失败:', error)
      throw error
    }
  }

  const updateTask = async (updatedTask: Task) => {
    try {
      updatedTask.updatedAt = new Date()
      await DatabaseManager.updateTask(updatedTask.id, updatedTask)
      
      const index = tasks.value.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = { ...updatedTask }
      }
    } catch (error) {
      console.error('更新任务失败:', error)
      throw error
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await DatabaseManager.deleteTask(taskId)
      
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除任务失败:', error)
      throw error
    }
  }

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = new Date()
      await saveTasks()
    }
  }

  const updateTaskPriority = async (taskId: string, priority: 'high' | 'medium' | 'low') => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.priority = priority
      task.updatedAt = new Date()
      await saveTasks()
    }
  }

  const updateTaskDueDate = async (taskId: string, dueDate: Date | undefined) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.dueDate = dueDate
      task.updatedAt = new Date()
      await saveTasks()
    }
  }

  const duplicateTask = async (taskId: string) => {
    const originalTask = tasks.value.find(task => task.id === taskId)
    if (originalTask) {
      const duplicatedTask: Task = {
        ...originalTask,
        id: nanoid(),
        title: `${originalTask.title} - 副本`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      tasks.value.unshift(duplicatedTask)
      await saveTasks()
      return duplicatedTask
    }
  }

  const searchTasks = async (query: string): Promise<Task[]> => {
    if (!query.trim()) return tasks.value
    
    try {
      return await DatabaseManager.searchTasks(query)
    } catch (error) {
      console.error('搜索任务失败:', error)
      // 降级到本地搜索
      const searchTerm = query.toLowerCase()
      return tasks.value.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      )
    }
  }

  const getTasksByPriority = (priority: 'high' | 'medium' | 'low'): Task[] => {
    return tasks.value.filter(task => task.priority === priority)
  }

  const getTasksByStatus = (completed: boolean): Task[] => {
    return tasks.value.filter(task => task.completed === completed)
  }

  const getTasksByDateRange = (startDate: Date, endDate: Date): Task[] => {
    return tasks.value.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= startDate && dueDate <= endDate
    })
  }

  const clearCompletedTasks = async () => {
    tasks.value = tasks.value.filter(task => !task.completed)
    await saveTasks()
  }

  const markAllAsCompleted = async () => {
    tasks.value.forEach(task => {
      if (!task.completed) {
        task.completed = true
        task.updatedAt = new Date()
      }
    })
    await saveTasks()
  }

  // 获取任务统计信息
  const getTaskStats = () => {
    const total = tasks.value.length
    const completed = completedTasks.value
    const pending = total - completed
    const overdue = overdueTasks.value.length
    const today = todayTasks.value.length
    const highPriority = highPriorityTasks.value.length
    
    return {
      total,
      completed,
      pending,
      overdue,
      today,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  // 创建示例任务
  const createSampleTasks = async () => {
    const sampleTasks = [
      {
        title: '完成AI工作台开发',
        description: '实现记事本、智能体对话和待办清单三个核心模块',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 86400000 * 3), // 3天后
        source: 'manual' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '学习Vue 3新特性',
        description: '深入了解Composition API和响应式系统',
        priority: 'medium' as const,
        dueDate: new Date(Date.now() + 86400000 * 7), // 1周后
        source: 'manual' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '整理项目文档',
        description: '更新README和API文档',
        priority: 'low' as const,
        dueDate: new Date(Date.now() + 86400000 * 14), // 2周后
        source: 'manual' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '准备周会汇报',
        description: '整理本周工作进展和下周计划',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 86400000), // 明天
        source: 'manual' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '优化应用性能',
        description: '分析性能瓶颈，优化加载速度',
        priority: 'medium' as const,
        source: 'manual' as const,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    try {
      for (const taskData of sampleTasks) {
        const id = await DatabaseManager.saveTask(taskData)
        const task: Task = { ...taskData, id }
        tasks.value.push(task)
      }
    } catch (error) {
      console.error('创建示例任务失败:', error)
    }
  }

  // 任务提醒检查
  const checkReminders = (): Task[] => {
    const now = new Date()
    const reminderTasks: Task[] = []
    
    tasks.value.forEach(task => {
      if (task.completed || !task.dueDate) return
      
      const dueDate = new Date(task.dueDate)
      const timeDiff = dueDate.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      // 提前1小时、1天提醒
      if (hoursDiff <= 1 && hoursDiff > 0) {
        reminderTasks.push(task)
      } else if (hoursDiff <= 24 && hoursDiff > 23) {
        reminderTasks.push(task)
      }
    })
    
    return reminderTasks
  }

  return {
    // 状态
    tasks,
    isLoading,
    
    // 计算属性
    totalTasks,
    completedTasks,
    pendingTasks,
    todayTasks,
    overdueTasks,
    highPriorityTasks,
    tasksByPriority,
    
    // 方法
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskPriority,
    updateTaskDueDate,
    duplicateTask,
    searchTasks,
    getTasksByPriority,
    getTasksByStatus,
    getTasksByDateRange,
    clearCompletedTasks,
    markAllAsCompleted,
    getTaskStats,
    checkReminders
  }
})