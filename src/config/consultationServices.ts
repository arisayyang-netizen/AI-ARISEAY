/**
 * AI咨询服务配置
 * 定义各种AI服务的配置信息
 */

export interface ConsultationService {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  systemPrompt: string
  quickActions?: string[]
}

export const consultationServices: ConsultationService[] = [
  {
    id: 'general-assistant',
    title: '通用AI助手',
    description: '智能对话助手，可以回答各种问题，提供建议和帮助',
    icon: '🤖',
    features: ['智能问答', '知识查询', '建议提供', '创意思考'],
    systemPrompt: '你是一个友善、专业的AI助手。请用简洁明了的语言回答用户的问题，提供有用的建议和信息。',
    quickActions: [
      '帮我解释一个概念',
      '给我一些建议',
      '帮我分析问题',
      '创意头脑风暴'
    ]
  },
  {
    id: 'writing-assistant',
    title: '写作助手',
    description: '专业的写作辅导，帮助改进文本质量和写作技巧',
    icon: '✍️',
    features: ['文本润色', '语法检查', '风格调整', '创意写作'],
    systemPrompt: '你是一个专业的写作助手。请帮助用户改进文本质量，提供写作建议，纠正语法错误，并根据需要调整写作风格。',
    quickActions: [
      '帮我润色这段文字',
      '检查语法错误',
      '改写为正式风格',
      '改写为口语化风格'
    ]
  },
  {
    id: 'code-assistant',
    title: '编程助手',
    description: '代码编写、调试和优化的专业助手',
    icon: '💻',
    features: ['代码生成', '错误调试', '性能优化', '技术咨询'],
    systemPrompt: '你是一个专业的编程助手。请帮助用户解决编程问题，提供代码示例，解释技术概念，并给出最佳实践建议。',
    quickActions: [
      '帮我写一段代码',
      '解释这个错误',
      '优化代码性能',
      '推荐技术方案'
    ]
  },
  {
    id: 'learning-tutor',
    title: '学习导师',
    description: '个性化学习指导，帮助制定学习计划和解答疑问',
    icon: '📚',
    features: ['学习规划', '知识讲解', '练习指导', '进度跟踪'],
    systemPrompt: '你是一个耐心的学习导师。请根据用户的学习需求，提供个性化的学习建议，详细解释概念，并帮助制定有效的学习计划。',
    quickActions: [
      '制定学习计划',
      '解释这个概念',
      '推荐学习资源',
      '检查学习进度'
    ]
  },
  {
    id: 'business-consultant',
    title: '商业顾问',
    description: '商业策略分析和决策支持，提供专业的商业建议',
    icon: '💼',
    features: ['市场分析', '策略规划', '风险评估', '决策支持'],
    systemPrompt: '你是一个经验丰富的商业顾问。请为用户提供专业的商业分析，帮助制定策略，评估风险，并给出实用的商业建议。',
    quickActions: [
      '分析市场趋势',
      '制定商业计划',
      '评估投资风险',
      '优化运营策略'
    ]
  },
  {
    id: 'creative-partner',
    title: '创意伙伴',
    description: '激发创意灵感，协助创意项目的构思和实现',
    icon: '🎨',
    features: ['创意生成', '头脑风暴', '设计建议', '内容创作'],
    systemPrompt: '你是一个富有创意的伙伴。请帮助用户激发创意灵感，提供独特的想法，协助创意项目的规划和实现。',
    quickActions: [
      '头脑风暴创意',
      '设计方案建议',
      '创作内容灵感',
      '项目创意规划'
    ]
  }
]

export default consultationServices