/**
 * AI服务工具类
 * 处理AI配置、API调用等功能
 */

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class AIService {
  private config: AIConfig | null = null

  constructor() {
    this.loadConfig()
  }

  /**
   * 加载AI配置
   */
  loadConfig(): void {
    const savedConfig = localStorage.getItem('ai-workbench-api-config')
    if (savedConfig) {
      try {
        // 尝试解密配置（与app.ts保持一致）
        const decrypted = atob(savedConfig)
        this.config = JSON.parse(decrypted)
      } catch (error) {
        console.error('解析AI配置失败:', error)
        // 如果解密失败，尝试直接解析（兼容旧格式）
        try {
          this.config = JSON.parse(savedConfig)
        } catch (fallbackError) {
          console.error('配置解析完全失败:', fallbackError)
        }
      }
    }
  }

  /**
   * 保存AI配置
   */
  saveConfig(config: AIConfig): void {
    this.config = config
    // 加密保存配置（与app.ts保持一致）
    const encrypted = btoa(JSON.stringify(config))
    localStorage.setItem('ai-workbench-api-config', encrypted)
  }

  /**
   * 获取当前配置
   */
  getConfig(): AIConfig | null {
    return this.config
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    return this.config !== null && !!this.config.apiKey
  }

  /**
   * 测试AI连接
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置')
    }

    try {
      const response = await this.chat([{
        role: 'user',
        content: 'Hello, this is a connection test.'
      }])
      return !!response.message
    } catch (error) {
      console.error('AI连接测试失败:', error)
      return false
    }
  }

  /**
   * 发送聊天消息
   */
  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置，请先配置API密钥')
    }

    const { apiKey, baseUrl, model } = this.config!

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorData.error?.message || '未知错误'}`)
      }

      const data = await response.json()
      
      return {
        message: data.choices[0]?.message?.content || '无响应内容',
        usage: data.usage
      }
    } catch (error) {
      console.error('AI聊天请求失败:', error)
      throw error
    }
  }

  /**
   * 生成文本摘要
   */
  async summarize(text: string): Promise<string> {
    const response = await this.chat([{
      role: 'system',
      content: '你是一个专业的文本摘要助手，请为用户提供的文本生成简洁准确的摘要。'
    }, {
      role: 'user',
      content: `请为以下文本生成摘要：\n\n${text}`
    }])
    
    return response.message
  }

  /**
   * 智能写作辅助
   */
  async assistWriting(prompt: string, context?: string): Promise<string> {
    const messages: ChatMessage[] = [{
      role: 'system',
      content: '你是一个专业的写作助手，帮助用户改进和完善文本内容。'
    }]

    if (context) {
      messages.push({
        role: 'user',
        content: `上下文：${context}`
      })
    }

    messages.push({
      role: 'user',
      content: prompt
    })

    const response = await this.chat(messages)
    return response.message
  }

  /**
   * 任务建议生成
   */
  async generateTaskSuggestions(description: string): Promise<string[]> {
    const response = await this.chat([{
      role: 'system',
      content: '你是一个任务管理专家，根据用户描述生成具体可执行的任务建议。请以JSON数组格式返回建议，每个建议都是一个字符串。'
    }, {
      role: 'user',
      content: `请为以下描述生成任务建议：${description}`
    }])

    try {
      const suggestions = JSON.parse(response.message)
      return Array.isArray(suggestions) ? suggestions : [response.message]
    } catch {
      // 如果解析失败，将整个响应作为单个建议返回
      return [response.message]
    }
  }
}

// 导出单例实例
export const aiService = new AIService()
export default aiService