<template>
  <div class="ai-consultation-page">
    <!-- 页面头部 -->
    <div class="consultation-header">
      <div class="header-content">
        <div class="header-left">
          <el-button 
            type="text" 
            @click="goBack" 
            class="back-btn"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <h1 class="page-title">AI大爆炸</h1>
        </div>
        <div class="header-right">
          <el-tag v-if="currentService" type="primary" size="large">
            {{ currentService.title }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="consultation-content">
      <!-- 服务选择区域 -->
      <div v-if="!currentService" class="service-selection">
        <div class="selection-header">
          <h2>AI大爆炸 - 智能服务中心</h2>
          <p>选择您需要的AI服务，开启智能对话体验</p>
        </div>
        
        <div class="services-grid">
          <div 
            v-for="service in consultationServices" 
            :key="service.id"
            class="service-card"
            @click="selectService(service)"
          >
            <div class="service-icon">{{ service.icon }}</div>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            
            <div class="service-features">
              <div class="features-preview">
                <span 
                  v-for="(feature, index) in service.features.slice(0, 3)" 
                  :key="index"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天界面 -->
      <div v-else class="chat-interface">
        <!-- 服务信息区域 -->
        <div class="service-info">
          <div class="service-header">
            <div class="service-meta">
              <div class="service-icon-large">{{ currentService.icon }}</div>
              <div class="service-details">
                <h3>{{ currentService.title }}</h3>
                <div class="service-actions">
                  <el-button 
                    size="small" 
                    type="text" 
                    @click="showServiceSelection"
                    class="switch-service-btn"
                  >
                    切换服务
                  </el-button>
                  <el-button 
                    size="small" 
                    type="text" 
                    @click="showEditAgentDialog = true"
                    class="edit-agent-btn"
                  >
                    编辑智能体
                  </el-button>
                </div>
              </div>
            </div>
            <p class="service-desc">{{ currentService.description }}</p>
            <div v-if="chatStore.currentSession.agentDescription" class="agent-description">
              <p>{{ chatStore.currentSession.agentDescription }}</p>
            </div>
          </div>

          <div class="quick-actions">
            <h4>快捷操作</h4>
            <div class="action-buttons">
              <el-button 
                v-for="action in currentService.quickActions" 
                :key="action"
                size="small"
                type="text"
                @click="insertQuickAction(action)"
              >
                {{ action }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="chatStore.currentSession.messages.length === 0" class="empty-state">
            <div class="empty-icon">💬</div>
            <h3>开始对话</h3>
            <p>向AI助手提问，获得专业的回答和建议</p>
          </div>
          
          <div 
            v-for="message in chatStore.currentSession.messages" 
            :key="message.id"
            class="message-item"
            :class="{ 'user-message': message.role === 'user', 'assistant-message': message.role === 'assistant' }"
          >
            <div class="message-avatar">
              <div v-if="message.role === 'user'" class="user-avatar">
                <el-icon><User /></el-icon>
              </div>
              <div v-else class="assistant-avatar">
                {{ currentService.icon }}
              </div>
            </div>
            
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-time">{{ formatTimeAgo(message.timestamp) }}</div>
            </div>
          </div>
          
          <div v-if="isLoading" class="message-item assistant-message loading">
            <div class="message-avatar">
              <div class="assistant-avatar">{{ currentService.icon }}</div>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <div class="input-container">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="1"
              placeholder="输入您的问题..."
              class="message-input"
              @keydown.enter.prevent="handleEnterKey"
              @input="adjustTextareaHeight"
              ref="messageInput"
            />
            <div class="input-actions">
              <el-button 
                type="text" 
                @click="clearChat"
                class="clear-btn"
                :disabled="chatStore.currentSession.messages.length === 0"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button 
                type="primary" 
                @click="sendMessage"
                :loading="isLoading"
                :disabled="!inputMessage.trim()"
                class="send-btn"
              >
                <el-icon><Promotion /></el-icon>
                发送
              </el-button>
            </div>
          </div>
        </div>

        <!-- 编辑智能体描述对话框 -->
        <el-dialog
          v-model="showEditAgentDialog"
          title="编辑智能体描述"
          width="500px"
        >
          <el-input
            v-model="tempAgentDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入智能体描述..."
          />
          <template #footer>
            <el-button @click="showEditAgentDialog = false">取消</el-button>
            <el-button type="primary" @click="saveAgentDescription">保存</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, User, Delete, Promotion } from '@element-plus/icons-vue'
import { useChatStore } from '@/stores/chat'
import { consultationServices } from '@/config/consultationServices'

const router = useRouter()
const chatStore = useChatStore()

// 响应式数据
const currentService = ref(null)
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)
const showEditAgentDialog = ref(false)
const tempAgentDescription = ref('')

// 返回上一页
const goBack = () => {
  router.back()
}

// 选择服务
const selectService = (service) => {
  currentService.value = service
  chatStore.setCurrentService(service)
  
  // 创建新的聊天会话
  const sessionId = Date.now().toString()
  chatStore.createSession(sessionId, service.title)
  
  nextTick(() => {
    scrollToBottom()
  })
}

// 显示服务选择
const showServiceSelection = () => {
  currentService.value = null
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 添加用户消息
  chatStore.addMessage({
    id: Date.now().toString(),
    role: 'user',
    content: message,
    timestamp: Date.now()
  })
  
  isLoading.value = true
  
  try {
    // 滚动到底部
    await nextTick()
    scrollToBottom()
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, currentService.value)
      chatStore.addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      })
      
      isLoading.value = false
      nextTick(() => {
        scrollToBottom()
      })
    }, 1000 + Math.random() * 2000)
    
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败，请重试')
    isLoading.value = false
  }
}

// 生成AI回复
const generateAIResponse = (message, service) => {
  const responses = {
    'code-review': [
      '我来帮您分析这段代码。首先，我注意到几个可以改进的地方...',
      '从代码结构来看，建议您考虑以下优化方案...',
      '这段代码的逻辑是正确的，但在性能和可维护性方面有一些建议...'
    ],
    'tech-consult': [
      '基于您的技术需求，我推荐以下解决方案...',
      '这个技术问题很有意思，让我为您详细分析一下...',
      '从技术架构的角度来看，您可以考虑这样的实现方式...'
    ],
    'career-guide': [
      '关于职业发展，我建议您从以下几个方面来规划...',
      '根据当前的行业趋势，您的职业路径可以这样规划...',
      '职业发展需要长期规划，让我为您分析一下当前的机会...'
    ]
  }
  
  const serviceResponses = responses[service?.id] || [
    '感谢您的问题，让我来为您详细解答...',
    '这是一个很好的问题，我来帮您分析一下...',
    '根据您的描述，我建议您考虑以下几个方面...'
  ]
  
  return serviceResponses[Math.floor(Math.random() * serviceResponses.length)]
}

// 处理回车键
const handleEnterKey = (event) => {
  if (event.shiftKey) {
    return // Shift+Enter 换行
  }
  sendMessage()
}

// 插入快捷操作
const insertQuickAction = (action) => {
  inputMessage.value = action
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

// 清空聊天
const clearChat = async () => {
  try {
    await ElMessageBox.confirm('确定要清空当前对话吗？', '确认清空', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    chatStore.clearCurrentSession()
    ElMessage.success('对话已清空')
  } catch {
    // 用户取消
  }
}

// 保存智能体描述
const saveAgentDescription = () => {
  chatStore.updateSessionAgentDescription(tempAgentDescription.value)
  showEditAgentDialog.value = false
  ElMessage.success('智能体描述已保存')
}

// 格式化消息
const formatMessage = (content) => {
  return content.replace(/\n/g, '<br>')
}

// 格式化时间
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 调整文本框高度
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (messageInput.value && messageInput.value.textarea) {
      const textarea = messageInput.value.textarea
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  })
}

// 组件挂载
onMounted(() => {
  // 如果有当前服务，恢复状态
  if (chatStore.currentService) {
    currentService.value = chatStore.currentService
  }
  
  // 如果有当前会话的智能体描述，设置临时描述
  if (chatStore.currentSession.agentDescription) {
    tempAgentDescription.value = chatStore.currentSession.agentDescription
  }
  
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.ai-consultation-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.consultation-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  color: #666;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.consultation-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 服务选择区域 */
.service-selection {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.selection-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.selection-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.selection-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 1);
}

.service-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1.5rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.service-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
}

.service-features {
  margin-top: 1.5rem;
}

.features-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.feature-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 聊天界面 */
.chat-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  margin: 1rem;
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.service-info {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
}

.service-header {
  margin-bottom: 1.5rem;
}

.service-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.service-icon-large {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
}

.service-details h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.service-actions {
  display: flex;
  gap: 1rem;
}

.switch-service-btn,
.edit-agent-btn {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.switch-service-btn:hover,
.edit-agent-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.service-desc {
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
}

.agent-description {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.agent-description p {
  margin: 0;
  font-style: italic;
  opacity: 0.9;
}

.quick-actions h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-buttons .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f8f9fa;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  opacity: 0.7;
  margin: 0;
}

.message-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.assistant-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.user-message .message-content {
  text-align: right;
}

.message-text {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  word-wrap: break-word;
}

.user-message .message-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.message-time {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
  padding: 0 1rem;
}

.loading .message-text {
  padding: 1rem 1.5rem;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.chat-input-area {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #eee;
}

.input-container {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  max-width: 100%;
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  border-radius: 20px;
  border: 2px solid #eee;
  padding: 12px 20px;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  transition: all 0.3s ease;
  min-height: 44px;
  max-height: 120px;
}

.message-input :deep(.el-textarea__inner):focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.clear-btn {
  color: #999;
  padding: 12px;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-btn:hover:not(:disabled) {
  background: #f5f5f5;
  color: #ff4757;
}

.send-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 22px;
  padding: 12px 24px;
  height: 44px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .consultation-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.2rem;
  }
  
  .service-selection {
    padding: 1rem;
  }
  
  .selection-header h2 {
    font-size: 2rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .service-card {
    padding: 1.5rem;
  }
  
  .chat-interface {
    margin: 0.5rem;
    border-radius: 15px;
  }
  
  .service-info {
    padding: 1rem;
  }
  
  .service-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .service-icon-large {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
  
  .chat-messages {
    padding: 1rem;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .chat-input-area {
    padding: 1rem;
  }
  
  .input-container {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .input-actions {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .selection-header h2 {
    font-size: 1.8rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .service-card {
    padding: 1rem;
  }
  
  .service-icon {
    font-size: 2.5rem;
    height: 60px;
  }
  
  .service-title {
    font-size: 1.3rem;
  }
}
</style>