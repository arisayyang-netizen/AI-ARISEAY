<template>
  <div class="chat-module">
    <!-- 侧边栏 -->
    <div class="chat-sidebar">
      <!-- 统计信息 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-number">{{ stats.totalSessions }}</div>
          <div class="stat-label">对话数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats.totalMessages }}</div>
          <div class="stat-label">消息数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ stats.todayMessages }}</div>
          <div class="stat-label">今日消息</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions-section">
        <el-button 
          type="primary" 
          @click="createNewSession"
          class="new-chat-btn"
        >
          <i class="icon-plus"></i>
          新建对话
        </el-button>
        
        <div class="action-buttons">
          <el-button 
            size="small" 
            @click="showSearchDialog = true"
          >
            <i class="icon-search"></i>
            搜索
          </el-button>
          <el-button 
            size="small" 
            @click="showImportDialog = true"
          >
            <i class="icon-import"></i>
            导入
          </el-button>
        </div>
      </div>

      <!-- 会话列表 -->
      <div class="sessions-section">
        <div class="section-header">
          <h3>对话历史</h3>
          <el-dropdown trigger="click">
            <el-button size="small" text>
              <i class="icon-more"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="cleanupSessions">
                  <i class="icon-clean"></i> 清理旧对话
                </el-dropdown-item>
                <el-dropdown-item @click="exportAllSessions">
                  <i class="icon-export"></i> 导出全部
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        
        <div class="sessions-list" v-loading="isLoading">
          <div v-if="recentSessions.length === 0" class="empty-sessions">
            <div class="empty-icon">💬</div>
            <div class="empty-text">暂无对话记录</div>
          </div>
          
          <div 
            v-for="session in recentSessions" 
            :key="session.id"
            class="session-item"
            :class="{ active: session.id === currentSessionId }"
            @click="setCurrentSession(session.id)"
          >
            <div class="session-content">
              <div class="session-title">{{ session.title }}</div>
              <div class="session-meta">
                <span class="message-count">{{ session.messages.length }} 条消息</span>
                <span class="update-time">{{ formatTime(session.updatedAt) }}</span>
              </div>
            </div>
            
            <el-dropdown trigger="click" @click.stop>
              <el-button size="small" text class="session-menu">
                <i class="icon-more"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editSessionTitle(session)">
                    <i class="icon-edit"></i> 重命名
                  </el-dropdown-item>
                  <el-dropdown-item @click="editAgentDescription(session)">
                    <i class="icon-robot"></i> 编辑智能体描述
                  </el-dropdown-item>
                  <el-dropdown-item @click="duplicateSession(session.id)">
                    <i class="icon-copy"></i> 复制
                  </el-dropdown-item>
                  <el-dropdown-item @click="exportSession(session.id)">
                    <i class="icon-export"></i> 导出
                  </el-dropdown-item>
                  <el-dropdown-item @click="clearSession(session.id)">
                    <i class="icon-clear"></i> 清空消息
                  </el-dropdown-item>
                  <el-dropdown-item 
                    @click="deleteSession(session.id)"
                    class="danger"
                  >
                    <i class="icon-trash"></i> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="chat-main">
      <div v-if="!currentSession" class="welcome-screen">
        <div class="welcome-content">
          <div class="welcome-icon">🤖</div>
          <h2>AI 智能助手</h2>
          <p>选择一个对话或创建新对话开始聊天</p>
          <el-button type="primary" @click="createNewSession">
            开始新对话
          </el-button>
        </div>
      </div>
      
      <div v-else class="chat-container">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="chat-title">
            <h3>{{ currentSession.title }}</h3>
            <div class="chat-info">
              <span class="message-count">{{ currentMessages.length }} 条消息</span>
              <span v-if="currentSession.agentDescription" class="agent-description">
                <i class="icon-robot"></i> {{ currentSession.agentDescription }}
              </span>
            </div>
          </div>
          <div class="chat-actions">
            <el-button size="small" @click="exportCurrentSession">
              <i class="icon-export"></i>
              导出
            </el-button>
            <el-button size="small" @click="clearCurrentSession">
              <i class="icon-clear"></i>
              清空
            </el-button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
          <div v-if="currentMessages.length === 0" class="empty-messages">
            <div class="empty-icon">💭</div>
            <div class="empty-text">开始你的第一条消息吧！</div>
          </div>
          
          <div v-else class="messages-list">
            <div 
              v-for="message in currentMessages" 
              :key="message.id"
              class="message-item"
              :class="message.role"
            >
              <div class="message-avatar">
                <div v-if="message.role === 'user'" class="user-avatar">👤</div>
                <div v-else class="assistant-avatar">🤖</div>
              </div>
              
              <div class="message-content">
                <div class="message-header">
                  <span class="message-role">
                    {{ message.role === 'user' ? '你' : 'AI助手' }}
                  </span>
                  <span class="message-time">
                    {{ formatTime(message.timestamp) }}
                  </span>
                </div>
                
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                
                <div class="message-actions">
                  <el-button size="small" text @click="copyMessage(message.content)">
                    <i class="icon-copy"></i>
                  </el-button>
                  <el-button size="small" text @click="editMessage(message)">
                    <i class="icon-edit"></i>
                  </el-button>
                  <el-button 
                    size="small" 
                    text 
                    @click="deleteMessage(message.id)"
                    class="danger"
                  >
                    <i class="icon-trash"></i>
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 正在输入指示器 -->
            <div v-if="isTyping" class="typing-indicator">
              <div class="message-avatar">
                <div class="assistant-avatar">🤖</div>
              </div>
              <div class="typing-content">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-container">
          <div class="input-wrapper">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="输入你的消息... (Ctrl+Enter 发送)"
              @keydown="handleKeydown"
              :disabled="isTyping"
              resize="none"
            />
            
            <div class="input-actions">
              <div class="input-tools">
                <el-button size="small" text @click="clearInput">
                  <i class="icon-clear"></i>
                  清空
                </el-button>
                <el-button size="small" text @click="insertTemplate">
                  <i class="icon-template"></i>
                  模板
                </el-button>
              </div>
              
              <el-button 
                type="primary" 
                @click="sendMessage"
                :disabled="!inputMessage.trim() || isTyping"
                :loading="isTyping"
              >
                <i class="icon-send"></i>
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索对话框 -->
    <el-dialog v-model="showSearchDialog" title="搜索对话" width="600px">
      <el-input
        v-model="searchQuery"
        placeholder="搜索对话或消息内容..."
        @input="handleSearch"
        clearable
      />
      
      <div class="search-results" v-if="searchResults.length > 0">
        <div 
          v-for="result in searchResults" 
          :key="result.id"
          class="search-result-item"
          @click="selectSearchResult(result)"
        >
          <div class="result-title">{{ result.title }}</div>
          <div class="result-meta">
            {{ result.messages.length }} 条消息 · {{ formatTime(result.updatedAt) }}
          </div>
        </div>
      </div>
      
      <div v-else-if="searchQuery" class="no-results">
        未找到匹配的对话
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="showImportDialog" title="导入对话" width="500px">
      <el-input
        v-model="importData"
        type="textarea"
        :rows="10"
        placeholder="粘贴对话数据 (JSON格式)..."
      />
      
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleImport"
          :disabled="!importData.trim()"
        >
          导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑标题对话框 -->
    <el-dialog v-model="showTitleDialog" title="重命名对话" width="400px">
      <el-input
        v-model="editingTitle"
        placeholder="请输入新的对话标题"
        maxlength="50"
        show-word-limit
      />
      
      <template #footer>
        <el-button @click="showTitleDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="saveTitle"
          :disabled="!editingTitle.trim()"
        >
          保存
        </el-button>
      </template>
    </el-dialog>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAIStore } from '@/stores/ai'
import type { ChatSession, ChatMessage } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { marked } from 'marked'
import dayjs from 'dayjs'
import { aiService } from '@/utils/ai-service'

const chatStore = useChatStore()
const aiStore = useAIStore()

// 响应式数据
const inputMessage = ref('')
const searchQuery = ref('')
const searchResults = ref<ChatSession[]>([])
const showSearchDialog = ref(false)
const showImportDialog = ref(false)
const showTitleDialog = ref(false)
const showDescriptionDialog = ref(false)
const importData = ref('')
const editingTitle = ref('')
const editingDescription = ref('')
const editingSessionId = ref('')
const messagesContainer = ref<HTMLElement>()

// 计算属性
const {
  sessions,
  currentSessionId,
  currentSession,
  currentMessages,
  recentSessions,
  isLoading,
  isTyping
} = chatStore

const stats = computed(() => chatStore.getChatStats())
const isAIConfigured = computed(() => aiService.isConfigured())

// 方法
const createNewSession = async () => {
  try {
    await chatStore.createSession()
    ElMessage.success('新对话已创建')
  } catch (error) {
    ElMessage.error('创建对话失败')
  }
}

const setCurrentSession = (sessionId: string) => {
  chatStore.setCurrentSession(sessionId)
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return
  
  if (!isAIConfigured.value) {
    ElMessage.warning('请先配置AI服务')
    return
  }
  
  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  
  try {
    // 添加用户消息
    await chatStore.addMessage(userMessage, 'user')
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
    
    // 调用AI获取回复
    isTyping.value = true
    const response = await aiService.chat([{
      role: 'user',
      content: userMessage
    }])
    
    // 添加AI回复
    await chatStore.addMessage(response.message, 'assistant')
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
    
  } catch (error) {
    ElMessage.error(`AI服务错误：${error instanceof Error ? error.message : '未知错误'}`)
    console.error('Chat error:', error)
  } finally {
    isTyping.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
}

const clearInput = () => {
  inputMessage.value = ''
}

const insertTemplate = () => {
  const templates = [
    '请帮我分析一下...',
    '请解释一下...',
    '请总结一下...',
    '请给我一些建议...'
  ]
  
  ElMessageBox.prompt('选择或输入模板', '插入模板', {
    inputValue: templates[0],
    inputType: 'textarea'
  }).then(({ value }) => {
    if (value) {
      inputMessage.value = value
    }
  }).catch(() => {})
}

const formatMessage = (content: string): string => {
  return marked(content)
}

const formatTime = (date: Date): string => {
  return dayjs(date).format('MM-DD HH:mm')
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const editMessage = (message: ChatMessage) => {
  ElMessageBox.prompt('编辑消息', '编辑', {
    inputValue: message.content,
    inputType: 'textarea'
  }).then(async ({ value }) => {
    if (value && value !== message.content) {
      await chatStore.updateMessage(message.id, value)
      ElMessage.success('消息已更新')
    }
  }).catch(() => {})
}

const deleteMessage = async (messageId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条消息吗？', '确认删除', {
      type: 'warning'
    })
    
    await chatStore.deleteMessage(messageId)
    ElMessage.success('消息已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const editSessionTitle = (session: ChatSession) => {
  editingSessionId.value = session.id
  editingTitle.value = session.title
  showTitleDialog.value = true
}

const editAgentDescription = (session: ChatSession) => {
  editingSessionId.value = session.id
  editingDescription.value = session.agentDescription || ''
  showDescriptionDialog.value = true
}

const saveTitle = async () => {
  if (!editingTitle.value.trim()) return
  
  try {
    await chatStore.updateSessionTitle(editingSessionId.value, editingTitle.value.trim())
    showTitleDialog.value = false
    ElMessage.success('标题已更新')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const saveDescription = async () => {
  try {
    await chatStore.updateSessionAgentDescription(editingSessionId.value, editingDescription.value.trim())
    showDescriptionDialog.value = false
    ElMessage.success('智能体描述已更新')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}
const duplicateSession = async (sessionId: string) => {
  try {
    await chatStore.duplicateSession(sessionId)
    ElMessage.success('对话已复制')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const deleteSession = async (sessionId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个对话吗？', '确认删除', {
      type: 'warning'
    })
    
    await chatStore.deleteSession(sessionId)
    ElMessage.success('对话已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const clearSession = async (sessionId: string) => {
  try {
    await ElMessageBox.confirm('确定要清空这个对话的所有消息吗？', '确认清空', {
      type: 'warning'
    })
    
    await chatStore.clearSession(sessionId)
    ElMessage.success('对话已清空')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败')
    }
  }
}

const clearCurrentSession = () => {
  if (currentSessionId.value) {
    clearSession(currentSessionId.value)
  }
}

const exportSession = (sessionId: string) => {
  const exportText = chatStore.exportSession(sessionId)
  if (exportText) {
    const blob = new Blob([exportText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-session-${sessionId}.md`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('对话已导出')
  }
}

const exportCurrentSession = () => {
  if (currentSessionId.value) {
    exportSession(currentSessionId.value)
  }
}

const exportAllSessions = () => {
  const allData = JSON.stringify(sessions.value, null, 2)
  const blob = new Blob([allData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'all-chat-sessions.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('所有对话已导出')
}

const handleImport = async () => {
  if (!importData.value.trim()) return
  
  try {
    const session = await chatStore.importSession(importData.value)
    if (session) {
      showImportDialog.value = false
      importData.value = ''
      ElMessage.success('对话已导入')
    } else {
      ElMessage.error('导入失败，请检查数据格式')
    }
  } catch (error) {
    ElMessage.error('导入失败')
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    searchResults.value = chatStore.searchSessions(searchQuery.value)
  } else {
    searchResults.value = []
  }
}

const selectSearchResult = (session: ChatSession) => {
  setCurrentSession(session.id)
  showSearchDialog.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const cleanupSessions = async () => {
  try {
    await ElMessageBox.confirm('确定要清理旧对话吗？将保留最近50个对话。', '确认清理', {
      type: 'warning'
    })
    
    await chatStore.cleanupOldSessions(50)
    ElMessage.success('旧对话已清理')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败')
    }
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 生命周期
onMounted(async () => {
  await chatStore.loadSessions()
  nextTick(() => {
    scrollToBottom()
  })
})

// 监听器
watch(currentMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>

<style scoped>
.chat-module {
  display: flex;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.chat-module::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.chat-module > * {
  position: relative;
  z-index: 1;
}

.chat-sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stats-section {
  display: flex;
  padding: 20px;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.actions-section {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.new-chat-btn {
  width: 100%;
  margin-bottom: 12px;
}

.new-chat-btn i {
  margin-right: 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons .el-button {
  flex: 1;
}

.sessions-section {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;
}

.section-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.sessions-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.empty-sessions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.05);
}

.session-item:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.session-item.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.session-content {
  flex: 1;
  min-width: 0;
}

.session-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.session-menu {
  opacity: 0;
  transition: opacity 0.2s;
}

.session-item:hover .session-menu {
  opacity: 1;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}

.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--bg-color);
}

.welcome-content {
  text-align: center;
  max-width: 400px;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.welcome-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.welcome-content p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.chat-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 4px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.message-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: transparent;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.message-item.assistant {
  flex-direction: row;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.user-avatar {
  background: var(--primary-color);
  color: white;
}

.assistant-avatar {
  background: var(--success-color);
  color: white;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-item.user .message-content {
  text-align: right;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.message-item.user .message-header {
  justify-content: flex-end;
}

.message-role {
  font-weight: 500;
}

.message-text {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.message-item.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.message-actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-item:hover .message-actions {
  opacity: 1;
}

.message-item.user .message-actions {
  justify-content: flex-end;
}

.typing-indicator {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.typing-content {
  background: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
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

.input-container {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-tools {
  display: flex;
  gap: 8px;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 16px;
}

.search-result-item {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.search-result-item:hover {
  border-color: var(--primary-color);
  background: var(--bg-hover);
}

.result-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.result-meta {
  font-size: 12px;
  color: var(--text-secondary);
}

.no-results {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px;
}

.danger {
  color: var(--danger-color) !important;
}

/* 图标样式 */
.icon-plus::before { content: '➕'; }
.icon-search::before { content: '🔍'; }
.icon-import::before { content: '📥'; }
.icon-more::before { content: '⋯'; }
.icon-clean::before { content: '🧹'; }
.icon-export::before { content: '📤'; }
.icon-edit::before { content: '✏️'; }
.icon-copy::before { content: '📋'; }
.icon-clear::before { content: '🗑️'; }
.icon-trash::before { content: '🗑️'; }
.icon-send::before { content: '📤'; }
.icon-template::before { content: '📝'; }
.chat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agent-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-robot::before { content: '🤖'; }
</style>