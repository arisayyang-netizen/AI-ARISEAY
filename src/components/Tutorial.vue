<template>
  <div class="tutorial-overlay" @click="closeTutorial">
    <div class="tutorial-modal glass-card" @click.stop>
      <div class="tutorial-header">
        <h2 class="tutorial-title glow-text">AI智能工作台使用指南</h2>
        <button class="close-btn cyber-btn" @click="closeTutorial">
          <el-icon><Close /></el-icon>
        </button>
      </div>
      
      <div class="tutorial-content">
        <div class="tutorial-steps">
          <div 
            v-for="(step, index) in tutorialSteps" 
            :key="index"
            :class="['tutorial-step', { active: currentStep === index }]"
            @click="currentStep = index"
          >
            <div class="step-number cyber-icon">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
              
              <div v-if="step.features" class="step-features">
                <div 
                  v-for="feature in step.features" 
                  :key="feature.name"
                  class="feature-item glass-card"
                >
                  <div class="feature-icon">{{ feature.icon }}</div>
                  <div class="feature-info">
                    <h4>{{ feature.name }}</h4>
                    <p>{{ feature.description }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="step.tips" class="step-tips">
                <h4 class="tips-title">💡 使用技巧</h4>
                <ul class="tips-list">
                  <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tutorial-navigation">
          <button 
            class="cyber-btn cyber-btn-secondary"
            :disabled="currentStep === 0"
            @click="currentStep--"
          >
            上一步
          </button>
          
          <div class="step-indicators">
            <div 
              v-for="(_, index) in tutorialSteps" 
              :key="index"
              :class="['step-indicator', { active: currentStep === index }]"
              @click="currentStep = index"
            ></div>
          </div>
          
          <button 
            class="cyber-btn cyber-btn-primary"
            @click="nextStep"
          >
            {{ currentStep === tutorialSteps.length - 1 ? '开始使用' : '下一步' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

const emit = defineEmits<{
  close: []
}>()

const currentStep = ref(0)

const tutorialSteps = [
  {
    title: '欢迎使用AI智能工作台',
    description: '这是一个集成了多种AI功能的现代化工作平台，帮助您提高工作效率。',
    features: [
      {
        icon: '🤖',
        name: 'AI助手',
        description: '智能对话助手，支持多种AI模型'
      },
      {
        icon: '📝',
        name: '智能笔记',
        description: 'AI辅助的笔记编写和管理系统'
      },
      {
        icon: '✅',
        name: '任务管理',
        description: 'AI生成任务建议的待办清单'
      }
    ]
  },
  {
    title: 'AI服务配置',
    description: '首先需要配置AI服务才能使用智能功能。',
    tips: [
      '点击右上角的设置按钮或欢迎页面的配置按钮',
      '输入您的OpenAI API密钥',
      '可以自定义API地址和模型',
      '建议先测试连接确保配置正确'
    ]
  },
  {
    title: 'AI笔记功能',
    description: '使用AI辅助创建和管理您的笔记。',
    features: [
      {
        icon: '✍️',
        name: '智能写作',
        description: 'AI帮助您改进文本内容'
      },
      {
        icon: '📋',
        name: '自动摘要',
        description: '为长文本生成简洁摘要'
      },
      {
        icon: '🏷️',
        name: '智能分类',
        description: '自动为笔记添加标签和分类'
      }
    ],
    tips: [
      '使用富文本编辑器创建格式丰富的笔记',
      '点击AI按钮获取写作建议',
      '支持Markdown格式',
      '笔记会自动保存到本地数据库'
    ]
  },
  {
    title: 'AI对话功能',
    description: '与AI助手进行智能对话，获取各种帮助。',
    tips: [
      '支持多轮对话，AI会记住上下文',
      '可以询问各种问题，获取专业建议',
      '对话历史会自动保存',
      '支持复制和分享对话内容'
    ]
  },
  {
    title: '任务管理功能',
    description: '使用AI生成和管理您的待办事项。',
    features: [
      {
        icon: '🎯',
        name: 'AI任务生成',
        description: '根据描述自动生成具体任务'
      },
      {
        icon: '📊',
        name: '进度跟踪',
        description: '可视化任务完成进度'
      },
      {
        icon: '⏰',
        name: '优先级管理',
        description: '设置任务优先级和截止时间'
      }
    ],
    tips: [
      '描述您的目标，AI会生成具体的执行步骤',
      '可以设置任务的优先级和截止时间',
      '完成任务后记得标记为已完成',
      '支持搜索和筛选任务'
    ]
  },
  {
    title: '开始您的智能办公之旅',
    description: '现在您已经了解了所有功能，可以开始使用AI智能工作台了！',
    tips: [
      '建议先配置AI服务',
      '从创建第一个笔记开始',
      '尝试与AI助手对话',
      '使用AI生成您的第一个任务清单'
    ]
  }
]

const nextStep = () => {
  if (currentStep.value === tutorialSteps.length - 1) {
    closeTutorial()
  } else {
    currentStep.value++
  }
}

const closeTutorial = () => {
  emit('close')
}
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.tutorial-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideInUp 0.4s ease;
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.tutorial-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tutorial-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
}

.tutorial-steps {
  margin-bottom: var(--spacing-xl);
}

.tutorial-step {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tutorial-step.active {
  display: flex;
  gap: var(--spacing-lg);
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-inverse);
}

.step-description {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.step-features {
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.feature-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.feature-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-inverse);
}

.feature-info p {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  line-height: 1.5;
}

.step-tips {
  background: var(--bg-dark-glass);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.tips-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-inverse);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: var(--spacing-xs) 0;
  color: var(--text-tertiary);
  line-height: 1.5;
  position: relative;
  padding-left: var(--spacing-lg);
}

.tips-list li::before {
  content: '•';
  color: var(--primary-color);
  position: absolute;
  left: 0;
  font-weight: bold;
}

.tutorial-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.step-indicators {
  display: flex;
  gap: var(--spacing-sm);
}

.step-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bg-dark-glass);
  cursor: pointer;
  transition: var(--transition-base);
}

.step-indicator.active {
  background: var(--primary-color);
  box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tutorial-modal {
    width: 95%;
    max-height: 95vh;
  }
  
  .tutorial-header,
  .tutorial-content {
    padding: var(--spacing-lg);
  }
  
  .tutorial-step.active {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .step-features {
    grid-template-columns: 1fr;
  }
}
</style>