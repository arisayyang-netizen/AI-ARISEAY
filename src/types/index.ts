// AI服务供应商类型
export interface AIProvider {
  id: string
  name: string
  baseURL: string
  models: string[]
  requiresApiKey: boolean
  description?: string
}

// API配置类型
export interface APIConfig {
  openai?: {
    apiKey: string
    baseURL: string
    model: string
  }
  kimi?: {
    apiKey: string
    baseURL: string
    model: string
  }
  claude?: {
    apiKey: string
    baseURL: string
    model: string
  }
  openrouter?: {
    apiKey: string
    baseURL: string
    model: string
  }
  gemini?: {
    apiKey: string
    baseURL: string
    model: string
  }
  siliconflow?: {
    apiKey: string
    baseURL: string
    model: string
  }
  custom?: {
    name: string
    apiKey: string
    baseURL: string
    model: string
  }[]
}

// 笔记类型
export interface Note {
  id?: number
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  category?: string
  isDeleted?: boolean
}

// 对话类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatSession {
  id?: number
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
  agentDescription?: string // 智能体描述
}

// 任务类型
export interface Task {
  id?: number
  title: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
  source?: 'manual' | 'extracted' // 任务来源
  sourceNoteId?: string // 来源笔记ID
}

// 标签类型
export interface Tag {
  id: string
  name: string
  color: string
  count: number
}

// AI服务响应类型
export interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

// 搜索结果类型
export interface SearchResult {
  type: 'note' | 'chat' | 'task'
  id: string
  title: string
  content: string
  relevance: number
  highlights?: string[]
}

// 应用设置类型
export interface AppSettings {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  autoSave: boolean
  notifications: boolean
  aiProvider: 'openai' | 'kimi' | 'claude' | 'openrouter' | 'gemini' | 'siliconflow' | 'custom'
}

// 统计数据类型
export interface Statistics {
  totalNotes: number
  totalTasks: number
  completedTasks: number
  totalChats: number
  todayNotes: number
  todayTasks: number
}