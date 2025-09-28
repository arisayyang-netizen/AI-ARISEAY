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
          <p>集成AI咨询、新闻动态等多种智能服务，为您提供全方位的AI体验</p>
        </div>
        
        <div class="services-grid">
          <div 
            v-for="service in consultationServices" 
            :key="service.id"
            class="service-card"
            :class="{ expanded: expandedServices.includes(service.id) }"
          >
            <div class="service-icon">{{ service.icon }}</div>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            
            <!-- 基础功能标签 -->
            <div class="service-features">
              <el-tag 
                v-for="feature in service.features.slice(0, 3)" 
                :key="feature"
                size="small"
                class="feature-tag"
              >
                {{ feature }}
              </el-tag>
              <el-tag 
                v-if="service.features.length > 3"
                size="small"
                class="feature-tag more-tag"
                @click.stop="toggleServiceExpansion(service.id)"
              >
                +{{ service.features.length - 3 }}更多
              </el-tag>
            </div>
            
            <!-- 展开的详细内容 -->
            <div v-if="expandedServices.includes(service.id)" class="service-expanded">
              <div class="expanded-features">
                <h4>完整功能列表：</h4>
                <div class="all-features">
                  <el-tag 
                    v-for="feature in service.features" 
                    :key="feature"
                    size="small"
                    class="feature-tag"
                  >
                    {{ feature }}
                  </el-tag>
                </div>
              </div>
              
              <div class="quick-actions" v-if="service.quickActions">
                <h4>快速操作：</h4>
                <div class="action-buttons">
                  <el-button 
                    v-for="action in service.quickActions" 
                    :key="action"
                    size="small"
                    type="info"
                    plain
                    @click.stop="handleQuickAction(service, action)"
                  >
                    {{ action }}
                  </el-button>
                </div>
              </div>
              
              <div class="service-prompt" v-if="service.systemPrompt">
                <h4>服务说明：</h4>
                <p class="prompt-text">{{ service.systemPrompt.substring(0, 200) }}...</p>
              </div>
            </div>
            
            <div class="service-actions">
              <el-button 
                type="primary" 
                size="large"
                @click="selectService(service)"
              >
                开始咨询
                <el-icon><ArrowRight /></el-icon>
              </el-button>
              <el-button 
                size="large"
                @click.stop="toggleServiceExpansion(service.id)"
                class="expand-btn"
              >
                {{ expandedServices.includes(service.id) ? '收起' : '详情' }}
                <el-icon><ArrowRight v-if="!expandedServices.includes(service.id)" /><ArrowLeft v-else /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 咨询对话区域 -->
      <div v-else class="consultation-chat">
        <div class="chat-container">
          <!-- 对话历史 -->
          <div class="chat-messages" ref="messagesContainer">
            <div 
              v-for="message in currentMessages" 
              :key="message.id"
              :class="['message', message.role]"
            >
              <div class="message-avatar">
                <span v-if="message.role === 'user'">👤</span>
                <span v-else>{{ currentService.icon }}</span>
              </div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>
            
            <!-- AI正在输入提示 -->
            <div v-if="isAITyping" class="message assistant typing">
              <div class="message-avatar">
                <span>{{ currentService.icon }}</span>
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
                v-model="userInput"
                type="textarea"
                :rows="3"
                placeholder="请输入您的问题或需求..."
                @keydown.ctrl.enter="sendMessage"
                :disabled="isAITyping"
                class="message-input"
              />
              <div class="input-actions">
                <div class="input-tips">
                  <span>Ctrl + Enter 发送</span>
                </div>
                <el-button 
                  type="primary" 
                  @click="sendMessage"
                  :loading="isAITyping"
                  :disabled="!userInput.trim()"
                >
                  发送
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="chat-sidebar">
          <div class="service-info">
            <div class="service-header">
              <div class="service-icon-large">{{ currentService.icon }}</div>
              <h3>{{ currentService.title }}</h3>
            </div>
            <p class="service-desc">{{ currentService.description }}</p>
            <div v-if="chatStore.currentSession && chatStore.currentSession.agentDescription" class="agent-description">
              <h4>智能体描述</h4>
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
                @click="insertQuickAction(action)"
              >
                {{ action }}
              </el-button>
            </div>
          </div>

          <div class="session-actions">
            <el-button @click="clearChat" type="danger" plain>
              清空对话
            </el-button>
            <el-button @click="exportChat" plain>
              导出对话
            </el-button>
            <el-button @click="editAgentDescription" plain>
              编辑智能体描述
            </el-button>
            <el-button @click="switchService" plain>
              切换服务
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 编辑智能体描述对话框 -->
  <el-dialog v-model="showDescriptionDialog" title="编辑智能体描述" width="500px">
    <el-input
      v-model="editingDescription"
      type="textarea"
      :rows="5"
      placeholder="请输入智能体描述..."
      maxlength="200"
      show-word-limit
    />
    
    <template #footer>
      <el-button @click="showDescriptionDialog = false">取消</el-button>
      <el-button 
        type="primary" 
        @click="saveDescription"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useAIStore } from '@/stores/ai'
import { useChatStore } from '@/stores/chat'
import { marked } from 'marked'

const router = useRouter()
const aiStore = useAIStore()
const chatStore = useChatStore()

// 响应式数据
const currentService = ref(null)
const currentMessages = ref([])
const userInput = ref('')
const isAITyping = ref(false)
const messagesContainer = ref(null)
const expandedServices = ref([]) // 展开的服务ID列表
const showDescriptionDialog = ref(false)
const editingDescription = ref('')

// 咨询服务配置
const consultationServices = ref([
  {
    id: 'writing',
    title: '智能写作助手',
    icon: '✍️',
    description: '基于最新GPT-4模型，提供专业文档撰写和内容优化服务',
    features: ['文档撰写', '内容优化', '语法检查', '风格调整'],
    quickActions: ['帮我写一份报告', '优化这段文字', '检查语法错误', '调整写作风格'],
    systemPrompt: '你是一个专业的写作助手，擅长各类文档撰写、内容优化和语言润色。请用专业、友好的语调帮助用户解决写作相关问题。'
  },
  {
    id: 'coding',
    title: '代码分析优化',
    icon: '🔧',
    description: '利用Claude 3.5先进算法，深度分析代码质量并提供优化方案',
    features: ['代码审查', '性能优化', '架构建议', '最佳实践'],
    quickActions: ['分析这段代码', '优化性能', '重构建议', '修复bug'],
    systemPrompt: '你是一个资深的软件工程师和代码审查专家，擅长代码分析、性能优化和架构设计。请提供专业的技术建议和解决方案。'
  },
  {
    id: 'learning',
    title: '学习规划师',
    icon: '📚',
    description: '个性化学习路径规划，提供高效的学习方法和资源推荐',
    features: ['学习规划', '资源推荐', '进度跟踪', '方法指导'],
    quickActions: ['制定学习计划', '推荐学习资源', '学习方法建议', '进度评估'],
    systemPrompt: '你是一个专业的学习顾问和教育专家，擅长制定个性化学习计划和提供学习方法指导。请根据用户需求提供实用的学习建议。'
  },
  {
    id: 'business',
    title: '商业分析师',
    icon: '📊',
    description: '商业策略分析，市场研究和商业计划制定支持',
    features: ['市场分析', '策略规划', '数据分析', '商业建议'],
    quickActions: ['市场分析', '竞品研究', '商业计划', '数据解读'],
    systemPrompt: '你是一个经验丰富的商业分析师和战略顾问，擅长市场分析、商业策略制定和数据解读。请提供专业的商业建议和分析。'
  },
  {
    id: 'news',
    title: 'AI新闻动态',
    icon: '📰',
    description: '获取最新的AI行业动态、技术趋势和重要新闻资讯',
    features: ['行业动态', '技术趋势', '产品发布', '政策解读'],
    quickActions: ['最新AI新闻', '技术趋势分析', '行业报告', '政策动态'],
    systemPrompt: '你是一个专业的AI行业分析师和新闻解读专家，擅长分析AI行业动态、技术趋势和政策变化。请提供准确、及时的行业资讯和深度分析。'
  }
])

// 方法
const goBack = () => {
  router.push('/')
}

const selectService = async (service) => {
  currentService.value = service;
  
  // 查找是否有与该服务关联的会话
  let sessionFound = false;
  
  // 加载所有会话
  if (chatStore.sessions.length === 0) {
    await chatStore.loadSessions();
  }
  
  // 查找与该服务关联的会话
  for (const session of chatStore.sessions) {
    const serviceId = localStorage.getItem(`ai-consultation-service-${session.id}`);
    if (serviceId === service.id) {
      // 找到关联会话，设置为当前会话
      chatStore.currentSessionId = session.id;
      currentMessages.value = session.messages;
      sessionFound = true;
      ElMessage.success('已恢复之前的对话');
      break;
    }
  }
  
  // 如果没有找到关联会话，创建新会话
  if (!sessionFound) {
    await createNewSession(service);
  }
}

// 创建新会话
const createNewSession = async (service) => {
  try {
    // 使用chatStore创建新会话
    const session = await chatStore.createSession(`${service.title}会话`);
    
    // 添加初始消息
    const welcomeMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `您好！我是${service.title}，很高兴为您服务。${service.description}\n\n请告诉我您需要什么帮助？`,
      timestamp: new Date().toISOString()
    };
    
    // 更新会话消息
    session.messages = [welcomeMessage];
    await chatStore.saveSessions();
    
    // 设置当前会话
    chatStore.currentSessionId = session.id;
    currentMessages.value = session.messages;
    
    // 保存服务信息到localStorage，以便后续识别
    localStorage.setItem(`ai-consultation-service-${session.id}`, service.id);
  } catch (error) {
    console.error('创建会话失败:', error);
    ElMessage.error('创建会话失败，请稍后重试');
  }
}

const switchService = () => {
  currentService.value = null
  currentMessages.value = []
  userInput.value = ''
}

// 展开/收起服务详情
const toggleServiceExpansion = (serviceId) => {
  const index = expandedServices.value.indexOf(serviceId)
  if (index > -1) {
    expandedServices.value.splice(index, 1)
  } else {
    expandedServices.value.push(serviceId)
  }
}

// 处理快速操作
const handleQuickAction = (service, action) => {
  selectService(service)
  userInput.value = action
  sendMessage()
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isAITyping.value) return;

  const userMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: userInput.value.trim(),
    timestamp: new Date().toISOString()
  };

  // 添加用户消息到当前会话
  currentMessages.value.push(userMessage);
  const question = userInput.value.trim();
  userInput.value = '';
  
  // 更新chatStore中的会话
  if (chatStore.currentSession) {
    chatStore.currentSession.messages = currentMessages.value;
    await chatStore.saveSessions();
  }
  
  // 滚动到底部
  await nextTick();
  scrollToBottom();

  // 开始AI回复
  isAITyping.value = true;

  try {
    // 构建对话上下文
    const context = currentMessages.value
      .slice(-10) // 只取最近10条消息作为上下文
      .map(msg => `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}`);
    
    // 添加系统提示
    const prompt = `${currentService.value.systemPrompt}\n\n对话历史：\n${context.join('\n')}\n\n当前问题：${question}\n\n请基于你的专业角色和对话历史，为用户提供有帮助的回答。`;

    const response = await aiStore.chatWithAI(prompt);
    
    const aiMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };

    // 添加AI回复到当前会话
    currentMessages.value.push(aiMessage);
    
    // 更新chatStore中的会话
    if (chatStore.currentSession) {
      chatStore.currentSession.messages = currentMessages.value;
      await chatStore.saveSessions();
    }
    
    // 滚动到底部
    await nextTick();
    scrollToBottom();
    
  } catch (error) {
    console.error('AI大爆炸失败:', error);
    ElMessage.error('AI大爆炸失败，请稍后重试');
    
    const errorMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '抱歉，我暂时无法回答您的问题，请稍后重试。',
      timestamp: new Date().toISOString()
    };
    
    currentMessages.value.push(errorMessage);
    
    // 更新chatStore中的会话
    if (chatStore.currentSession) {
      chatStore.currentSession.messages = currentMessages.value;
      await chatStore.saveSessions();
    }
  } finally {
    isAITyping.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const insertQuickAction = (action) => {
  userInput.value = action
}

const clearChat = async () => {
  ElMessageBox.confirm('确定要清空当前对话吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 清空当前会话消息
    if (chatStore.currentSession) {
      // 保留第一条欢迎消息
      const welcomeMessage = currentMessages.value[0];
      chatStore.currentSession.messages = [welcomeMessage];
      currentMessages.value = [welcomeMessage];
      await chatStore.saveSessions();
      ElMessage.success('对话已清空');
    }
  }).catch(() => {
    // 用户取消操作
  });
};

const exportChat = () => {
  if (!currentMessages.value.length) return
  
  const chatData = {
    service: currentService.value.title,
    messages: currentMessages.value
  }
  
  const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentService.value.title}-对话-${new Date().toLocaleDateString()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 编辑智能体描述
const editAgentDescription = () => {
  if (!chatStore.currentSession) return
  
  editingDescription.value = chatStore.currentSession.agentDescription || ''
  showDescriptionDialog.value = true
}

// 保存智能体描述
const saveDescription = async () => {
  if (!chatStore.currentSession) return
  
  try {
    await chatStore.updateSessionAgentDescription(chatStore.currentSession.id, editingDescription.value)
    showDescriptionDialog.value = false
    ElMessage.success('智能体描述已更新')
  } catch (error) {
    console.error('更新智能体描述失败:', error)
    ElMessage.error('更新智能体描述失败')
  }
}

const formatMessage = (content) => {
  return marked(content)
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleDateString()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 生命周期
onMounted(() => {
  // 检查是否有传入的服务ID
  const serviceId = router.currentRoute.value.query.service
  if (serviceId) {
    const service = consultationServices.value.find(s => s.id === serviceId)
    if (service) {
      selectService(service)
    }
  }
})
</script>

<style scoped>
.ai-consultation-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.consultation-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  color: white;
  font-size: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.consultation-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  max-height: calc(100vh - 80px);
}

/* 服务选择区域 */
.service-selection {
  max-width: 1200px;
  margin: 0 auto;
}

.selection-header {
  text-align: center;
  margin-bottom: 3rem;
}

.selection-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.selection-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.service-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.service-description {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.service-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
}

.more-tag {
  background: rgba(255, 107, 107, 0.3) !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.more-tag:hover {
  background: rgba(255, 107, 107, 0.5) !important;
  transform: scale(1.05);
}

/* 展开的服务详情 */
.service-expanded {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  animation: expandIn 0.3s ease-out;
}

@keyframes expandIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}

.service-card.expanded {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
}

.expanded-features h4,
.quick-actions h4,
.service-prompt h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.8rem 0;
  color: rgba(255, 255, 255, 0.9);
}

.all-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.prompt-text {
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
  margin: 0;
}

.service-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.expand-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.expand-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.service-action {
  margin-top: auto;
}

/* 咨询对话区域 */
.consultation-chat {
  display: flex;
  height: 100%;
  gap: 2rem;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.message-content {
  flex: 1;
}

.message-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  line-height: 1.6;
}

.message.user .message-text {
  background: rgba(255, 255, 255, 0.2);
}

.message-time {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  text-align: right;
}

.message.assistant .message-time {
  text-align: left;
}

/* 输入提示动画 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 1rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-area {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
}

.message-input :deep(.el-textarea__inner) {
  background: transparent;
  border: none;
  color: white;
  resize: none;
}

.message-input :deep(.el-textarea__inner)::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-tips {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 侧边栏 */
.chat-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.service-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  text-align: center;
}

.service-header {
  margin-bottom: 1rem;
}

.service-icon-large {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.service-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.service-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.agent-description {
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.agent-description h4 {
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #fff;
}

.agent-description p {
  font-size: 0.85rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.quick-actions {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.service-actions {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-buttons .el-button {
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.session-actions {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .consultation-chat {
    flex-direction: column;
  }
  
  .chat-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>