import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { APIConfig, Task } from '@/types'
import { useAppStore } from './app'
import { useTodosStore } from './todos'
import axios from 'axios'

export const useAIStore = defineStore('ai', () => {
  const appStore = useAppStore()
  const todosStore = useTodosStore()
  
  // 状态
  const isProcessing = ref(false)
  const lastError = ref<string | null>(null)

  // AI API调用基础方法
  const callAI = async (prompt: string, options: any = {}): Promise<string> => {
    const config = appStore.apiConfig
    if (!config) {
      throw new Error('请先配置AI API密钥')
    }

    isProcessing.value = true
    lastError.value = null

    try {
      // 优先使用OpenRouter
      if (config.openrouter?.apiKey) {
        return await callOpenRouter(prompt, config.openrouter, options)
      }
      // 其次使用OpenAI
      else if (config.openai?.apiKey) {
        return await callOpenAI(prompt, config.openai, options)
      }
      // 然后使用Kimi
      else if (config.kimi?.apiKey) {
        return await callKimi(prompt, config.kimi, options)
      }
      // 最后使用Claude
      else if (config.claude?.apiKey) {
        return await callClaude(prompt, config.claude, options)
      }
      else {
        throw new Error('未找到可用的AI API配置')
      }
    } catch (error: any) {
      lastError.value = error.message || 'AI调用失败'
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  // OpenAI API调用
  const callOpenAI = async (prompt: string, config: any, options: any = {}): Promise<string> => {
    const response = await axios.post(
      `${config.baseURL || 'https://api.openai.com'}/v1/chat/completions`,
      {
        model: config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    return response.data.choices[0].message.content
  }

  // Kimi API调用
  const callKimi = async (prompt: string, config: any, options: any = {}): Promise<string> => {
    const response = await axios.post(
      `${config.baseURL || 'https://api.moonshot.cn'}/v1/chat/completions`,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    return response.data.choices[0].message.content
  }

  // Claude API调用
  const callClaude = async (prompt: string, config: any, options: any = {}): Promise<string> => {
    const response = await axios.post(
      `${config.baseURL || 'https://api.anthropic.com'}/v1/messages`,
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: options.maxTokens || 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': config.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: 30000
      }
    )

    return response.data.content[0].text
  }

  // OpenRouter API调用
  const callOpenRouter = async (prompt: string, config: any, options: any = {}): Promise<string> => {
    const response = await axios.post(
      `${config.baseURL || 'https://openrouter.ai/api/v1'}/chat/completions`,
      {
        model: config.model || 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI-Workbench'
        },
        timeout: 30000
      }
    )

    return response.data.choices[0].message.content
  }

  // AI功能方法
  
  // 内容润色
  const polishText = async (text: string): Promise<string> => {
    const prompt = `请润色以下内容，保持原意的同时提升表达质量、逻辑清晰度和可读性。要求：
1. 保持原文的核心观点和信息
2. 优化语言表达，使其更加流畅自然
3. 改善段落结构和逻辑关系
4. 纠正语法错误和表达不当之处
5. 保持原文的语言风格（正式/非正式）

原文内容：
${text}

请直接返回润色后的内容，不要添加额外说明。`

    return await callAI(prompt)
  }

  // 生成标签
  const generateTags = async (content: string): Promise<string[]> => {
    const prompt = `请为以下内容生成3-5个相关标签，标签应该：
1. 准确反映内容主题
2. 简洁明了（1-3个字）
3. 便于分类和检索
4. 避免过于宽泛或具体

内容：
${content}

请以JSON数组格式返回标签，例如：["标签1", "标签2", "标签3"]`

    const response = await callAI(prompt)
    try {
      const tags = JSON.parse(response)
      return Array.isArray(tags) ? tags : []
    } catch {
      // 如果JSON解析失败，尝试从文本中提取标签
      const matches = response.match(/"([^"]+)"/g)
      return matches ? matches.map(m => m.replace(/"/g, '')) : []
    }
  }

  // 提取任务
  const extractTasks = async (content: string, sourceNoteId?: string): Promise<Task[]> => {
    const prompt = `请从以下内容中识别和提取待办任务，要求：
1. 识别明确的行动项和任务
2. 判断任务的优先级（high/medium/low）
3. 尝试识别截止时间（如果有明确时间表述）
4. 提取任务的简洁标题和描述

内容：
${content}

请以JSON数组格式返回任务，格式如下：
[
  {
    "title": "任务标题",
    "description": "任务描述（可选）",
    "priority": "high|medium|low",
    "dueDate": "YYYY-MM-DD（如果能识别出时间）"
  }
]

如果没有识别到明确的任务，请返回空数组 []`

    const response = await callAI(prompt)
    try {
      const tasks = JSON.parse(response)
      if (Array.isArray(tasks)) {
        // 创建任务并添加到待办清单
        const createdTasks: Task[] = []
        for (const taskData of tasks) {
          const task = await todosStore.createTask(
            taskData.title,
            taskData.description,
            taskData.priority || 'medium',
            taskData.dueDate ? new Date(taskData.dueDate) : undefined,
            'extracted',
            sourceNoteId
          )
          createdTasks.push(task)
        }
        return createdTasks
      }
    } catch (error) {
      console.warn('任务提取JSON解析失败:', error)
    }
    return []
  }

  // 内容总结
  const summarizeContent = async (content: string): Promise<string> => {
    const prompt = `请为以下内容生成一个简洁的摘要，要求：
1. 提取核心要点和关键信息
2. 保持逻辑清晰，结构完整
3. 控制在100字以内
4. 使用简洁明了的语言

内容：
${content}

请直接返回摘要内容：`

    return await callAI(prompt)
  }

  // 智能问答
  const chatWithAI = async (message: string, context: string[] = []): Promise<string> => {
    let prompt = message
    
    if (context.length > 0) {
      prompt = `对话历史：
${context.join('\n\n')}

当前问题：${message}

请基于对话历史回答当前问题。`
    }

    return await callAI(prompt, { maxTokens: 2000 })
  }

  // 创意助手
  const brainstorm = async (topic: string, type: 'ideas' | 'solutions' | 'improvements' = 'ideas'): Promise<string> => {
    const prompts = {
      ideas: `请为"${topic}"这个主题进行创意头脑风暴，生成5-8个创新想法。要求：
1. 想法要有创新性和可行性
2. 从不同角度思考问题
3. 提供简要的实现思路
4. 按优先级排序`,
      
      solutions: `请为"${topic}"这个问题提供多种解决方案，要求：
1. 分析问题的根本原因
2. 提供3-5种不同的解决思路
3. 评估每种方案的优缺点
4. 推荐最佳方案`,
      
      improvements: `请为"${topic}"提供改进建议，要求：
1. 识别当前存在的问题和不足
2. 提供具体的改进措施
3. 说明改进后的预期效果
4. 给出实施的优先级`
    }

    return await callAI(prompts[type])
  }

  // 语法检查
  const checkGrammar = async (text: string): Promise<string> => {
    const prompt = `请检查以下文本的语法错误、拼写错误和表达问题，并提供修正建议：

${text}

请以以下格式返回：
1. 如果没有错误，返回"文本语法正确，无需修改。"
2. 如果有错误，列出具体的错误和修正建议
3. 提供修正后的完整文本`

    return await callAI(prompt)
  }

  // 风格转换
  const convertStyle = async (text: string, targetStyle: 'formal' | 'casual' | 'academic' | 'business'): Promise<string> => {
    const styleDescriptions = {
      formal: '正式、严谨的书面语言风格',
      casual: '轻松、自然的口语化风格',
      academic: '学术性、专业的研究论文风格',
      business: '商务、专业的商业沟通风格'
    }

    const prompt = `请将以下文本转换为${styleDescriptions[targetStyle]}，要求：
1. 保持原文的核心信息和观点
2. 调整语言风格和表达方式
3. 使用适合目标风格的词汇和句式
4. 保持内容的完整性和逻辑性

原文：
${text}

请直接返回转换后的文本：`

    return await callAI(prompt)
  }

  // 长度调整
  const adjustLength = async (text: string, action: 'expand' | 'compress' | 'summarize'): Promise<string> => {
    const prompts = {
      expand: `请扩展以下内容，要求：
1. 保持原有观点和信息
2. 增加更多细节、例子和解释
3. 丰富内容的深度和广度
4. 保持逻辑清晰和结构完整

原文：${text}`,
      
      compress: `请压缩以下内容，要求：
1. 保留核心信息和关键观点
2. 删除冗余和次要信息
3. 使表达更加简洁明了
4. 保持逻辑完整性

原文：${text}`,
      
      summarize: `请总结以下内容，要求：
1. 提取最重要的信息和观点
2. 用简洁的语言概括主要内容
3. 保持逻辑清晰
4. 控制在原文1/3长度以内

原文：${text}`
    }

    return await callAI(prompts[action])
  }

  // 测试API连接
  const testConnection = async (config?: any): Promise<{ success: boolean; error?: string }> => {
    try {
      if (config) {
        // 使用传入的配置进行测试
        await testSpecificProvider(config)
      } else {
        // 使用默认配置进行测试
        await callAI('请回复"连接成功"', { maxTokens: 10 })
      }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || '连接测试失败' }
    }
  }

  // 测试特定供应商的连接
  const testSpecificProvider = async (config: any): Promise<string> => {
    const { provider, apiKey, baseUrl, model } = config
    
    if (!apiKey) {
      throw new Error('API密钥不能为空')
    }

    const testPrompt = '请回复"连接成功"'
    const headers: any = {
      'Content-Type': 'application/json'
    }

    let requestBody: any
    let endpoint: string

    switch (provider) {
      case 'openrouter':
        headers['Authorization'] = `Bearer ${apiKey}`
        headers['HTTP-Referer'] = window.location.origin
        headers['X-Title'] = 'AI-Workbench'
        endpoint = `${baseUrl || 'https://openrouter.ai/api/v1'}/chat/completions`
        requestBody = {
          model: model || 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 10,
          temperature: 0.7
        }
        break
      case 'openai':
        headers['Authorization'] = `Bearer ${apiKey}`
        endpoint = `${baseUrl || 'https://api.openai.com/v1'}/chat/completions`
        requestBody = {
          model: model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 10,
          temperature: 0.7
        }
        break
      case 'claude':
        headers['Authorization'] = `Bearer ${apiKey}`
        headers['anthropic-version'] = '2023-06-01'
        endpoint = `${baseUrl || 'https://api.anthropic.com/v1'}/messages`
        requestBody = {
          model: model || 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: testPrompt }]
        }
        break
      case 'kimi':
        headers['Authorization'] = `Bearer ${apiKey}`
        endpoint = `${baseUrl || 'https://api.moonshot.cn/v1'}/chat/completions`
        requestBody = {
          model: model || 'moonshot-v1-8k',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 10,
          temperature: 0.7
        }
        break
      case 'gemini':
        endpoint = `${baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`
        requestBody = {
          contents: [{
            parts: [{ text: testPrompt }]
          }]
        }
        break
      default:
        throw new Error(`不支持的供应商: ${provider}`)
    }

    const response = await axios.post(endpoint, requestBody, {
      headers,
      timeout: 15000
    })

    if (!response.data) {
      throw new Error('API响应为空')
    }

    // 根据不同供应商解析响应
    let content: string
    switch (provider) {
      case 'openrouter':
      case 'openai':
      case 'kimi':
        content = response.data.choices?.[0]?.message?.content
        break
      case 'claude':
        content = response.data.content?.[0]?.text
        break
      case 'gemini':
        content = response.data.candidates?.[0]?.content?.parts?.[0]?.text
        break
      default:
        content = '连接成功'
    }

    if (!content) {
      throw new Error('API响应格式异常')
    }

    return content
  }

  return {
    // 状态
    isProcessing,
    lastError,
    
    // 基础方法
    callAI,
    testConnection,
    
    // AI功能
    polishText,
    generateTags,
    extractTasks,
    summarizeContent,
    chatWithAI,
    brainstorm,
    checkGrammar,
    convertStyle,
    adjustLength
  }
})