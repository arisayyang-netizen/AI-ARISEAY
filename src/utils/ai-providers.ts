import type { AIProvider } from '@/types'

// 预定义的AI服务供应商
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
    requiresApiKey: true,
    description: 'OpenAI官方API服务，包含最新的GPT-4o模型'
  },
  {
    id: 'kimi',
    name: 'Kimi (月之暗面)',
    baseURL: 'https://api.moonshot.cn/v1',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    requiresApiKey: true,
    description: '月之暗面Kimi智能助手'
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    baseURL: 'https://api.anthropic.com/v1',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620', 
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229', 
      'claude-3-sonnet-20240229', 
      'claude-3-haiku-20240307'
    ],
    requiresApiKey: true,
    description: 'Anthropic Claude AI助手，包含最新的Claude 3.5 Sonnet模型'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    models: [
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'openai/gpt-4-turbo',
      'openai/gpt-4',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'google/gemini-pro-1.5',
      'google/gemini-pro',
      'meta-llama/llama-3.1-405b-instruct',
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mixtral-8x22b-instruct',
      'mistralai/mixtral-8x7b-instruct',
      'qwen/qwen-2.5-72b-instruct'
    ],
    requiresApiKey: true,
    description: '统一的AI模型API网关，支持最新的多种AI模型'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'gemini-pro-vision'],
    requiresApiKey: true,
    description: 'Google Gemini AI模型，包含最新的Gemini 1.5系列'
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    baseURL: 'https://api.siliconflow.cn/v1',
    models: [
      'deepseek-ai/deepseek-llm-67b-chat',
      'THUDM/chatglm3-6b',
      'baichuan-inc/Baichuan2-13B-Chat',
      'Qwen/Qwen-72B-Chat',
      'internlm/internlm2-chat-7b'
    ],
    requiresApiKey: true,
    description: '硅基流动AI推理平台，支持多种开源模型'
  }
]

// 获取供应商信息
export const getProviderById = (id: string): AIProvider | undefined => {
  return AI_PROVIDERS.find(provider => provider.id === id)
}

// 获取供应商的默认模型
export const getDefaultModel = (providerId: string): string => {
  const provider = getProviderById(providerId)
  return provider?.models[0] || ''
}

// 验证API配置
export const validateAPIConfig = (providerId: string, config: any): boolean => {
  const provider = getProviderById(providerId)
  if (!provider) return false
  
  if (provider.requiresApiKey && !config.apiKey) {
    return false
  }
  
  if (!config.baseURL || !config.model) {
    return false
  }
  
  return true
}