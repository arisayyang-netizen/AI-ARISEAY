import Dexie, { Table } from 'dexie'
import type { Note, ChatSession, Task } from '@/types'

// 定义数据库接口
export interface AIWorkbenchDB extends Dexie {
  notes: Table<Note>
  chatSessions: Table<ChatSession>
  tasks: Table<Task>
}

// 创建数据库实例
export const db = new Dexie('AIWorkbenchDB') as AIWorkbenchDB

// 定义数据库结构
db.version(1).stores({
  notes: '++id, title, content, category, tags, createdAt, updatedAt, isDeleted',
  chatSessions: '++id, title, messages, createdAt, updatedAt, isDeleted',
  tasks: '++id, title, description, completed, priority, dueDate, createdAt, updatedAt, isDeleted'
})

// 添加agentDescription字段
db.version(2).stores({
  chatSessions: '++id, title, messages, createdAt, updatedAt, isDeleted, agentDescription'
})

// 确保数据库正确打开
const ensureDbOpen = async (retries = 3): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      if (!db.isOpen()) {
        await db.open()
        console.log('数据库打开成功')
      }
      return
    } catch (err: any) {
      console.error(`数据库打开失败 (尝试 ${i + 1}/${retries}):`, err)
      
      // 如果是版本冲突或数据库损坏，尝试删除并重新创建
      if (err.name === 'VersionError' || err.name === 'DatabaseClosedError' || err.name === 'InvalidStateError') {
        try {
          await db.delete()
          console.log('删除损坏的数据库，准备重新创建')
        } catch (deleteErr) {
          console.error('删除数据库失败:', deleteErr)
        }
      }
      
      if (i === retries - 1) {
        throw new Error(`数据库打开失败，已重试${retries}次: ${err.message}`)
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
    }
  }
}

// 数据库操作类
export class DatabaseManager {
  // 笔记操作
  static async getNotes(): Promise<Note[]> {
    try {
      await ensureDbOpen()
      const notes = await db.notes.toArray()
      // 过滤未删除的笔记
      const activeNotes = notes.filter(note => !note.isDeleted)
      return activeNotes.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    } catch (error) {
      console.error('获取笔记失败:', error)
      return []
    }
  }

  static async saveNote(note: Omit<Note, 'id'>): Promise<number> {
    try {
      await ensureDbOpen()
      return await db.notes.add(note as Note)
    } catch (error) {
      console.error('保存笔记失败:', error)
      throw error
    }
  }

  static async updateNote(id: number, updates: Partial<Note>): Promise<void> {
    try {
      await ensureDbOpen()
      
      // 验证ID是否有效
      if (!id || isNaN(id)) {
        throw new Error(`无效的笔记ID: ${id}`)
      }
      
      // 确保更新数据的完整性，处理数组字段
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
        id: id // 确保ID正确
      }
      
      // 确保tags字段是数组格式
      if (updateData.tags && !Array.isArray(updateData.tags)) {
        updateData.tags = []
      }
      
      const result = await db.notes.update(id, updateData)
      if (result === 0) {
        throw new Error(`未找到ID为${id}的笔记`)
      }
      
      console.log(`笔记${id}更新成功`)
    } catch (error: any) {
      console.error('更新笔记失败:', error)
      throw new Error(`更新笔记失败: ${error.message}`)
    }
  }

  static async deleteNote(id: number): Promise<void> {
    try {
      await ensureDbOpen()
      await db.notes.update(id, {
        isDeleted: true,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('删除笔记失败:', error)
      throw error
    }
  }

  static async searchNotes(query: string): Promise<Note[]> {
    try {
      const notes = await db.notes
        .where('isDeleted')
        .equals(false)
        .toArray()
      
      return notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    } catch (error) {
      console.error('搜索笔记失败:', error)
      return []
    }
  }

  // 对话会话操作
  static async getChatSessions(): Promise<ChatSession[]> {
    try {
      await ensureDbOpen()
      const sessions = await db.chatSessions.toArray()
      // 过滤未删除的会话
      const activeSessions = sessions.filter(session => !session.isDeleted)
      return activeSessions.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    } catch (error) {
      console.error('获取对话会话失败:', error)
      return []
    }
  }

  static async saveChatSession(session: Omit<ChatSession, 'id'>): Promise<number> {
    try {
      return await db.chatSessions.add(session as ChatSession)
    } catch (error) {
      console.error('保存对话会话失败:', error)
      throw error
    }
  }

  static async updateChatSession(id: number, updates: Partial<ChatSession>): Promise<void> {
    try {
      await db.chatSessions.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('更新对话会话失败:', error)
      throw error
    }
  }

  static async deleteChatSession(id: number): Promise<void> {
    try {
      await db.chatSessions.update(id, {
        isDeleted: true,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('删除对话会话失败:', error)
      throw error
    }
  }

  static async searchChatSessions(query: string): Promise<ChatSession[]> {
    try {
      const sessions = await db.chatSessions
        .where('isDeleted')
        .equals(false)
        .toArray()
      
      return sessions.filter(session => 
        session.title.toLowerCase().includes(query.toLowerCase()) ||
        session.messages.some(msg => 
          msg.content.toLowerCase().includes(query.toLowerCase())
        )
      )
    } catch (error) {
      console.error('搜索对话会话失败:', error)
      return []
    }
  }

  // 任务操作
  static async getTasks(): Promise<Task[]> {
    try {
      await ensureDbOpen()
      const tasks = await db.tasks.toArray()
      // 过滤未删除的任务
      const activeTasks = tasks.filter(task => !task.isDeleted)
      return activeTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      console.error('获取任务失败:', error)
      return []
    }
  }

  static async saveTask(task: Omit<Task, 'id'>): Promise<number> {
    try {
      return await db.tasks.add(task as Task)
    } catch (error) {
      console.error('保存任务失败:', error)
      throw error
    }
  }

  static async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    try {
      await db.tasks.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('更新任务失败:', error)
      throw error
    }
  }

  static async deleteTask(id: number): Promise<void> {
    try {
      await db.tasks.update(id, {
        isDeleted: true,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('删除任务失败:', error)
      throw error
    }
  }

  static async searchTasks(query: string): Promise<Task[]> {
    try {
      const tasks = await db.tasks
        .where('isDeleted')
        .equals(false)
        .toArray()
      
      return tasks.filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
      )
    } catch (error) {
      console.error('搜索任务失败:', error)
      return []
    }
  }

  // 数据统计
  static async getStatistics() {
    try {
      const [notesCount, sessionsCount, tasksCount, completedTasksCount] = await Promise.all([
        db.notes.where('isDeleted').equals(false).count(),
        db.chatSessions.where('isDeleted').equals(false).count(),
        db.tasks.where('isDeleted').equals(false).count(),
        db.tasks.where('isDeleted').equals(false).and(task => task.completed).count()
      ])

      return {
        notes: notesCount,
        sessions: sessionsCount,
        tasks: tasksCount,
        completedTasks: completedTasksCount
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      return {
        notes: 0,
        sessions: 0,
        tasks: 0,
        completedTasks: 0
      }
    }
  }

  // 数据备份
  static async exportAllData() {
    try {
      const [notes, sessions, tasks] = await Promise.all([
        db.notes.where('isDeleted').equals(false).toArray(),
        db.chatSessions.where('isDeleted').equals(false).toArray(),
        db.tasks.where('isDeleted').equals(false).toArray()
      ])

      return {
        notes,
        sessions,
        tasks,
        exportTime: new Date().toISOString(),
        version: '1.0.0'
      }
    } catch (error) {
      console.error('导出数据失败:', error)
      throw error
    }
  }

  // 数据恢复
  static async importAllData(data: any) {
    try {
      await db.transaction('rw', [db.notes, db.chatSessions, db.tasks], async () => {
        // 清空现有数据
        await db.notes.clear()
        await db.chatSessions.clear()
        await db.tasks.clear()

        // 导入新数据
        if (data.notes && Array.isArray(data.notes)) {
          await db.notes.bulkAdd(data.notes)
        }
        
        if (data.sessions && Array.isArray(data.sessions)) {
          await db.chatSessions.bulkAdd(data.sessions)
        }
        
        if (data.tasks && Array.isArray(data.tasks)) {
          await db.tasks.bulkAdd(data.tasks)
        }
      })
    } catch (error) {
      console.error('导入数据失败:', error)
      throw error
    }
  }

  // 清空所有数据
  static async clearAllData() {
    try {
      await db.transaction('rw', [db.notes, db.chatSessions, db.tasks], async () => {
        await db.notes.clear()
        await db.chatSessions.clear()
        await db.tasks.clear()
      })
    } catch (error) {
      console.error('清空数据失败:', error)
      throw error
    }
  }

  // 数据库初始化
  static async initialize() {
    return ensureDbOpen()
  }

  // 获取数据库大小估算
  static async getDatabaseSize() {
    try {
      const data = await this.exportAllData()
      const size = new Blob([JSON.stringify(data)]).size
      return size
    } catch (error) {
      console.error('获取数据库大小失败:', error)
      return 0
    }
  }
}

// 初始化数据库
ensureDbOpen().catch(console.error)

export default DatabaseManager