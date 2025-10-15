import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase配置缺失，请检查环境变量')
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// 数据库表名常量
export const TABLES = {
  TASKS: 'tasks',
  WORK_LOGS: 'work_logs',
  PROJECTS: 'projects',
  LEARNING_PROGRESS: 'learning_progress',
  USER_SETTINGS: 'user_settings'
} as const

// 数据库操作工具类
export class SupabaseService {
  // 任务相关操作
  static async getTasks(userId?: string) {
    try {
      let query = supabase.from(TABLES.TASKS).select('*')
      if (userId) {
        query = query.eq('user_id', userId)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取任务失败:', error)
      return []
    }
  }

  static async createTask(task: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .insert([task])
        .select()
      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('创建任务失败:', error)
      throw error
    }
  }

  static async updateTask(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('更新任务失败:', error)
      throw error
    }
  }

  static async deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from(TABLES.TASKS)
        .delete()
        .eq('id', id)
      if (error) throw error
      return true
    } catch (error) {
      console.error('删除任务失败:', error)
      throw error
    }
  }

  // 工作记录相关操作
  static async getWorkLogs(userId?: string) {
    try {
      let query = supabase.from(TABLES.WORK_LOGS).select('*')
      if (userId) {
        query = query.eq('user_id', userId)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取工作记录失败:', error)
      return []
    }
  }

  static async createWorkLog(workLog: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.WORK_LOGS)
        .insert([workLog])
        .select()
      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('创建工作记录失败:', error)
      throw error
    }
  }

  // 项目相关操作
  static async getProjects(userId?: string) {
    try {
      let query = supabase.from(TABLES.PROJECTS).select('*')
      if (userId) {
        query = query.eq('user_id', userId)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取项目失败:', error)
      return []
    }
  }

  static async createProject(project: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert([project])
        .select()
      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('创建项目失败:', error)
      throw error
    }
  }

  // 学习进度相关操作
  static async getLearningProgress(userId?: string) {
    try {
      let query = supabase.from(TABLES.LEARNING_PROGRESS).select('*')
      if (userId) {
        query = query.eq('user_id', userId)
      }
      const { data, error } = await query.order('updated_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取学习进度失败:', error)
      return []
    }
  }

  static async updateLearningProgress(userId: string, progress: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.LEARNING_PROGRESS)
        .upsert([{ user_id: userId, ...progress }])
        .select()
      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('更新学习进度失败:', error)
      throw error
    }
  }

  // 用户设置相关操作
  static async getUserSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_SETTINGS)
        .select('*')
        .eq('user_id', userId)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('获取用户设置失败:', error)
      return null
    }
  }

  static async updateUserSettings(userId: string, settings: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_SETTINGS)
        .upsert([{ user_id: userId, ...settings }])
        .select()
      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('更新用户设置失败:', error)
      throw error
    }
  }

  // 实时订阅
  static subscribeToTasks(callback: (payload: any) => void, userId?: string) {
    let channel = supabase
      .channel('tasks_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.TASKS,
          filter: userId ? `user_id=eq.${userId}` : undefined
        }, 
        callback
      )
    
    channel.subscribe()
    return channel
  }

  static subscribeToWorkLogs(callback: (payload: any) => void, userId?: string) {
    let channel = supabase
      .channel('work_logs_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.WORK_LOGS,
          filter: userId ? `user_id=eq.${userId}` : undefined
        }, 
        callback
      )
    
    channel.subscribe()
    return channel
  }
}

// 认证相关工具
export class AuthService {
  // 获取当前用户
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('获取当前用户失败:', error)
      return null
    }
  }

  // 匿名登录
  static async signInAnonymously() {
    try {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('匿名登录失败:', error)
      throw error
    }
  }

  // 邮箱登录
  static async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('邮箱登录失败:', error)
      throw error
    }
  }

  // 注册
  static async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }

  // 登出
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return true
    } catch (error) {
      console.error('登出失败:', error)
      throw error
    }
  }

  // 监听认证状态变化
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default supabase