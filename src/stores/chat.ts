import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatSession, ChatMessage } from '@/types'
import { nanoid } from 'nanoid'
import { DatabaseManager } from '@/utils/database'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isLoading = ref(false)
  const isTyping = ref(false)

  // 计算属性
  const currentSession = computed(() => 
    sessions.value.find(session => session.id === currentSessionId.value)
  )
  
  const currentMessages = computed(() => 
    currentSession.value?.messages || []
  )
  
  const totalSessions = computed(() => sessions.value.length)
  
  const totalMessages = computed(() => 
    sessions.value.reduce((total, session) => total + session.messages.length, 0)
  )
  
  const recentSessions = computed(() => 
    [...sessions.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  )
  
  const sessionsByDate = computed(() => {
    const groups: { [key: string]: ChatSession[] } = {}
    
    sessions.value.forEach(session => {
      const date = new Date(session.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(session)
    })
    
    return groups
  })

  // 方法
  const loadSessions = async () => {
    isLoading.value = true
    try {
      const dbSessions = await DatabaseManager.getChatSessions()
      
      if (dbSessions.length > 0) {
        sessions.value = dbSessions.map((session: any) => ({
          ...session,
          id: String(session.id), // 确保ID为字符串类型
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
      } else {
        // 尝试从localStorage迁移数据
        const savedSessions = localStorage.getItem('ai-workbench-chat-sessions')
        if (savedSessions) {
          const parsed = JSON.parse(savedSessions)
          sessions.value = parsed.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }))
          // 迁移到数据库
          await saveSessions()
          localStorage.removeItem('ai-workbench-chat-sessions')
        } else {
          // 创建默认会话
          await createSession('新对话')
        }
      }
      
      // 设置当前会话为最近的会话
      if (sessions.value.length > 0 && !currentSessionId.value) {
        currentSessionId.value = recentSessions.value[0].id
      }
    } catch (error) {
      console.error('加载聊天会话失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const saveSessions = async () => {
    try {
      // 批量保存到数据库
      for (const session of sessions.value) {
        if (!session.id) {
          const id = await DatabaseManager.saveChatSession(session)
          session.id = String(id) // 确保ID为字符串类型
        } else {
          // 确保sessionId是有效的数字
          const numericId = Number(session.id)
          if (isNaN(numericId)) {
            console.error('无效的会话ID:', session.id)
            continue
          }
          await DatabaseManager.updateChatSession(numericId, session)
        }
      }
    } catch (error) {
      console.error('保存聊天会话失败:', error)
      throw error
    }
  }

  const createSession = async (title?: string): Promise<ChatSession> => {
    const sessionData = {
      title: title || `对话 ${sessions.value.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    try {
      const id = await DatabaseManager.saveChatSession(sessionData)
      const session: ChatSession = { ...sessionData, id: String(id) } // 确保ID为字符串类型
      sessions.value.unshift(session)
      currentSessionId.value = session.id
      return session
    } catch (error) {
      console.error('创建会话失败:', error)
      throw error
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      // 确保sessionId是有效的数字
      const numericId = Number(sessionId)
      if (isNaN(numericId)) {
        console.error('无效的会话ID:', sessionId)
        return
      }
      
      await DatabaseManager.deleteChatSession(numericId)
      
      const index = sessions.value.findIndex(session => session.id === sessionId)
      if (index !== -1) {
        sessions.value.splice(index, 1)
        
        // 如果删除的是当前会话，切换到其他会话
        if (currentSessionId.value === sessionId) {
          if (sessions.value.length > 0) {
            currentSessionId.value = sessions.value[0].id
          } else {
            // 如果没有会话了，创建一个新的
            await createSession()
          }
        }
      }
    } catch (error) {
      console.error('删除会话失败:', error)
      throw error
    }
  }

  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      const updatedData = {
        title,
        updatedAt: new Date()
      }
      
      // 确保将sessionId转换为数字类型并验证
      const numericId = Number(sessionId)
      if (isNaN(numericId)) {
        console.error('无效的会话ID:', sessionId)
        return
      }
      
      await DatabaseManager.updateChatSession(numericId, updatedData)
      
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        session.title = title
        session.updatedAt = new Date()
      }
    } catch (error) {
      console.error('更新会话标题失败:', error)
      throw error
    }
  }

  const updateSessionAgentDescription = async (sessionId: string, agentDescription: string) => {
    try {
      const updatedData = {
        agentDescription,
        updatedAt: new Date()
      }
      
      // 确保将sessionId转换为数字类型并验证
      const numericId = Number(sessionId)
      if (isNaN(numericId)) {
        console.error('无效的会话ID:', sessionId)
        return
      }
      
      await DatabaseManager.updateChatSession(numericId, updatedData)
      
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        session.agentDescription = agentDescription
        session.updatedAt = new Date()
      }
    } catch (error) {
      console.error('更新智能体描述失败:', error)
      throw error
    }
  }
  const setCurrentSession = (sessionId: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSessionId.value = sessionId
    }
  }

  const addMessage = async (
    content: string, 
    role: 'user' | 'assistant', 
    sessionId?: string
  ): Promise<ChatMessage> => {
    const targetSessionId = sessionId || currentSessionId.value
    if (!targetSessionId) {
      throw new Error('没有活动的聊天会话')
    }
    
    const session = sessions.value.find(s => s.id === targetSessionId)
    if (!session) {
      throw new Error('会话不存在')
    }
    
    const message: ChatMessage = {
      id: nanoid(),
      content,
      role,
      timestamp: new Date()
    }
    
    session.messages.push(message)
    session.updatedAt = new Date()
    
    // 如果是用户消息且会话标题是默认的，自动更新标题
    if (role === 'user' && session.messages.length === 1 && session.title.startsWith('对话')) {
      const newTitle = content.length > 20 ? content.substring(0, 20) + '...' : content
      session.title = newTitle
    }
    
    await saveSessions()
    return message
  }

  const updateMessage = async (messageId: string, content: string, sessionId?: string) => {
    const targetSessionId = sessionId || currentSessionId.value
    if (!targetSessionId) return
    
    const session = sessions.value.find(s => s.id === targetSessionId)
    if (!session) return
    
    const message = session.messages.find(m => m.id === messageId)
    if (message) {
      message.content = content
      session.updatedAt = new Date()
      await saveSessions()
    }
  }

  const deleteMessage = async (messageId: string, sessionId?: string) => {
    const targetSessionId = sessionId || currentSessionId.value
    if (!targetSessionId) return
    
    const session = sessions.value.find(s => s.id === targetSessionId)
    if (!session) return
    
    const index = session.messages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      session.messages.splice(index, 1)
      session.updatedAt = new Date()
      await saveSessions()
    }
  }

  const clearSession = async (sessionId?: string) => {
    const targetSessionId = sessionId || currentSessionId.value
    if (!targetSessionId) return
    
    const session = sessions.value.find(s => s.id === targetSessionId)
    if (session) {
      session.messages = []
      session.updatedAt = new Date()
      await saveSessions()
    }
  }

  const duplicateSession = async (sessionId: string): Promise<ChatSession | null> => {
    const originalSession = sessions.value.find(s => s.id === sessionId)
    if (!originalSession) return null
    
    const duplicatedSessionData = {
      title: `${originalSession.title} - 副本`,
      messages: originalSession.messages.map(msg => ({
        ...msg,
        id: nanoid(),
        timestamp: new Date()
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    try {
      const id = await DatabaseManager.saveChatSession(duplicatedSessionData)
      const duplicatedSession: ChatSession = { ...duplicatedSessionData, id: String(id) }
      sessions.value.unshift(duplicatedSession)
      return duplicatedSession
    } catch (error) {
      console.error('复制会话失败:', error)
      throw error
    }
  }

  const searchSessions = async (query: string): Promise<ChatSession[]> => {
    if (!query.trim()) return sessions.value
    
    try {
      return await DatabaseManager.searchChatSessions(query)
    } catch (error) {
      console.error('搜索会话失败:', error)
      // 降级到本地搜索
      const searchTerm = query.toLowerCase()
      return sessions.value.filter(session => 
        session.title.toLowerCase().includes(searchTerm) ||
        session.messages.some(msg => 
          msg.content.toLowerCase().includes(searchTerm)
        )
      )
    }
  }

  const searchMessages = (query: string, sessionId?: string): ChatMessage[] => {
    if (!query.trim()) return []
    
    const searchTerm = query.toLowerCase()
    const targetSessions = sessionId 
      ? sessions.value.filter(s => s.id === sessionId)
      : sessions.value
    
    const results: ChatMessage[] = []
    targetSessions.forEach(session => {
      session.messages.forEach(message => {
        if (message.content.toLowerCase().includes(searchTerm)) {
          results.push(message)
        }
      })
    })
    
    return results
  }

  const exportSession = (sessionId: string): string => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return ''
    
    let exportText = `# ${session.title}\n\n`
    exportText += `创建时间: ${session.createdAt.toLocaleString()}\n`
    exportText += `更新时间: ${session.updatedAt.toLocaleString()}\n\n`
    
    session.messages.forEach(message => {
      const roleText = message.role === 'user' ? '用户' : 'AI助手'
      exportText += `## ${roleText} (${message.timestamp.toLocaleString()})\n\n`
      exportText += `${message.content}\n\n`
    })
    
    return exportText
  }

  const importSession = async (sessionData: string): Promise<ChatSession | null> => {
    try {
      const parsed = JSON.parse(sessionData)
      const session: ChatSession = {
        id: nanoid(),
        title: parsed.title || '导入的对话',
        messages: parsed.messages.map((msg: any) => ({
          id: nanoid(),
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.timestamp || Date.now())
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      sessions.value.unshift(session)
      await saveSessions()
      return session
    } catch (error) {
      console.error('导入会话失败:', error)
      return null
    }
  }

  // 获取聊天统计信息
  const getChatStats = () => {
    const totalSessions = sessions.value.length
    const totalMessages = sessions.value.reduce((total, session) => total + session.messages.length, 0)
    const userMessages = sessions.value.reduce((total, session) => 
      total + session.messages.filter(msg => msg.role === 'user').length, 0
    )
    const assistantMessages = totalMessages - userMessages
    
    // 计算今日消息数
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayMessages = sessions.value.reduce((total, session) => 
      total + session.messages.filter(msg => 
        new Date(msg.timestamp) >= today
      ).length, 0
    )
    
    // 计算平均消息长度
    const avgMessageLength = totalMessages > 0 
      ? Math.round(sessions.value.reduce((total, session) => 
          total + session.messages.reduce((msgTotal, msg) => msgTotal + msg.content.length, 0)
        , 0) / totalMessages)
      : 0
    
    return {
      totalSessions,
      totalMessages,
      userMessages,
      assistantMessages,
      todayMessages,
      avgMessageLength
    }
  }

  // 清理旧会话（保留最近的N个）
  const cleanupOldSessions = async (keepCount: number = 50) => {
    if (sessions.value.length <= keepCount) return
    
    const sortedSessions = [...sessions.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    
    sessions.value = sortedSessions.slice(0, keepCount)
    await saveSessions()
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    currentMessages,
    recentSessions,
    isLoading,
    isTyping,
    loadSessions,
    createSession,
    setCurrentSession,
    addMessage,
    updateMessage,
    deleteMessage,
    updateSessionTitle,
    updateSessionAgentDescription,
    duplicateSession,
    deleteSession,
    clearSession,
    exportSession,
    importSession,
    searchSessions,
    cleanupOldSessions,
    getChatStats
  }
})