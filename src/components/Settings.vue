<template>
  <el-dialog 
    v-model="visible" 
    title="设置" 
    width="600px"
    @close="handleClose"
  >
    <el-tabs v-model="activeTab" type="border-card">
      <!-- AI配置 -->
      <el-tab-pane label="AI配置" name="ai">
        <div class="settings-section">
          <h3>AI服务配置</h3>
          <p class="section-desc">配置AI服务提供商和API密钥</p>
          
          <el-form :model="aiConfig" label-width="120px">
            <el-form-item label="服务提供商">
              <el-select v-model="aiConfig.provider" placeholder="选择AI服务提供商" @change="onProviderChange">
                <el-option 
                  v-for="provider in aiProviders" 
                  :key="provider.id"
                  :label="provider.name" 
                  :value="provider.id"
                >
                  <div>
                    <div>{{ provider.name }}</div>
                    <div class="provider-desc">{{ provider.description }}</div>
                  </div>
                </el-option>
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
            
            <!-- 自定义服务商名称 -->
            <el-form-item v-if="aiConfig.provider === 'custom'" label="服务商名称">
              <el-input 
                v-model="aiConfig.customName" 
                placeholder="请输入自定义服务商名称"
              />
            </el-form-item>
            
            <el-form-item label="API密钥">
              <el-input 
                v-model="aiConfig.apiKey" 
                type="password" 
                placeholder="请输入API密钥"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="API地址">
              <el-input 
                v-model="aiConfig.baseUrl" 
                placeholder="API基础地址（可选）"
              />
            </el-form-item>
            
            <el-form-item label="模型">
              <el-select 
                v-model="aiConfig.model" 
                placeholder="选择模型"
                filterable
                allow-create
              >
                <el-option 
                  v-for="model in availableModels" 
                  :key="model"
                  :label="model" 
                  :value="model"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="最大Token">
              <el-input-number 
                v-model="aiConfig.maxTokens" 
                :min="100" 
                :max="8000" 
                :step="100"
              />
            </el-form-item>
            
            <el-form-item label="温度">
              <el-slider 
                v-model="aiConfig.temperature" 
                :min="0" 
                :max="2" 
                :step="0.1" 
                show-input
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                @click="testConnection" 
                :loading="testing"
              >
                测试连接
              </el-button>
              <el-button @click="resetAIConfig">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      
      <!-- 应用设置 -->
      <el-tab-pane label="应用设置" name="app">
        <div class="settings-section">
          <h3>界面设置</h3>
          <p class="section-desc">自定义应用界面和行为</p>
          
          <el-form :model="appSettings" label-width="120px">
            <el-form-item label="主题">
              <el-radio-group v-model="appSettings.theme">
                <el-radio label="light">浅色</el-radio>
                <el-radio label="dark">深色</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="语言">
              <el-select v-model="appSettings.language" placeholder="选择语言">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="自动保存">
              <el-switch v-model="appSettings.autoSave" />
            </el-form-item>
            
            <el-form-item label="保存间隔">
              <el-input-number 
                v-model="appSettings.saveInterval" 
                :min="5" 
                :max="300" 
                :step="5"
                :disabled="!appSettings.autoSave"
              />
              <span class="form-help">秒</span>
            </el-form-item>
            
            <el-form-item label="启用通知">
              <el-switch v-model="appSettings.enableNotifications" />
            </el-form-item>
            
            <el-form-item label="启用快捷键">
              <el-switch v-model="appSettings.enableShortcuts" />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      
      <!-- 数据管理 -->
      <el-tab-pane label="数据管理" name="data">
        <div class="settings-section">
          <h3>数据备份与恢复</h3>
          <p class="section-desc">管理你的应用数据</p>
          
          <div class="data-actions">
            <div class="action-group">
              <h4>导出数据</h4>
              <p>将所有数据导出为JSON文件</p>
              <el-button type="primary" @click="exportData">
                <i class="icon-export"></i>
                导出全部数据
              </el-button>
            </div>
            
            <div class="action-group">
              <h4>导入数据</h4>
              <p>从JSON文件导入数据</p>
              <el-upload
                :before-upload="importData"
                :show-file-list="false"
                accept=".json"
              >
                <el-button type="success">
                  <i class="icon-import"></i>
                  选择文件导入
                </el-button>
              </el-upload>
            </div>
            
            <div class="action-group danger">
              <h4>清空数据</h4>
              <p>删除所有应用数据，此操作不可恢复</p>
              <el-button type="danger" @click="clearAllData">
                <i class="icon-trash"></i>
                清空所有数据
              </el-button>
            </div>
          </div>
          
          <div class="storage-info">
            <h4>存储信息</h4>
            <div class="storage-stats">
              <div class="stat-item">
                <span class="stat-label">笔记数据:</span>
                <span class="stat-value">{{ formatSize(storageStats.notes) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">对话数据:</span>
                <span class="stat-value">{{ formatSize(storageStats.chats) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">任务数据:</span>
                <span class="stat-value">{{ formatSize(storageStats.tasks) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">总计:</span>
                <span class="stat-value">{{ formatSize(storageStats.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 统计信息 -->
      <el-tab-pane label="统计信息" name="stats">
        <div class="settings-section">
          <h3>使用统计</h3>
          <p class="section-desc">查看你的应用使用情况</p>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalNotes }}</div>
                <div class="stat-label">笔记数量</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🤖</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalChats }}</div>
                <div class="stat-label">对话会话</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalTasks }}</div>
                <div class="stat-label">待办事项</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚡</div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.aiCalls || 0 }}</div>
                <div class="stat-label">AI调用次数</div>
              </div>
            </div>
          </div>
          
          <div class="usage-chart">
            <h4>使用趋势</h4>
            <p class="chart-desc">最近7天的使用情况</p>
            <!-- 这里可以添加图表组件 -->
            <div class="chart-placeholder">
              <el-empty description="图表功能开发中" />
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 关于 -->
      <el-tab-pane label="关于" name="about">
        <div class="settings-section">
          <div class="about-content">
            <div class="app-info">
              <div class="app-icon">🚀</div>
              <h2>AI智能工作台</h2>
              <p class="version">版本 1.0.0</p>
              <p class="description">
                一个集成AI功能的智能工作台，包含记事本、对话助手和待办清单三大核心模块。
              </p>
            </div>
            
            <div class="features-list">
              <h4>主要功能</h4>
              <ul>
                <li>📝 AI智能记事本 - 富文本编辑、智能标签、内容总结</li>
                <li>🤖 智能对话助手 - 多轮对话、上下文理解、知识问答</li>
                <li>✅ AI待办清单 - 智能提醒、任务分析、时间管理</li>
                <li>🔧 灵活配置 - 支持多种AI服务、个性化设置</li>
                <li>💾 本地存储 - 数据安全、离线可用、快速响应</li>
              </ul>
            </div>
            
            <div class="tech-stack">
              <h4>技术栈</h4>
              <div class="tech-tags">
                <span class="tech-tag">Vue 3</span>
                <span class="tech-tag">TypeScript</span>
                <span class="tech-tag">Vite</span>
                <span class="tech-tag">Element Plus</span>
                <span class="tech-tag">Pinia</span>
                <span class="tech-tag">IndexedDB</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useAIStore } from '@/stores/ai'
import { useNotesStore } from '@/stores/notes'
import { useChatStore } from '@/stores/chat'
import { useTodosStore } from '@/stores/todos'
import type { APIConfig, AppSettings } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AI_PROVIDERS, getProviderById, getDefaultModel } from '@/utils/ai-providers'
import { aiService } from '@/utils/ai-service'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const appStore = useAppStore()
const aiStore = useAIStore()
const notesStore = useNotesStore()
const chatStore = useChatStore()
const todosStore = useTodosStore()

// 响应式数据
const activeTab = ref('ai')
const testing = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// AI服务商列表
const aiProviders = ref(AI_PROVIDERS)

// 配置数据
const aiConfig = ref<any>({
  provider: 'openai',
  apiKey: '',
  baseUrl: '',
  model: '',
  customName: '',
  maxTokens: 2000,
  temperature: 0.7
})

// 可用模型列表
const availableModels = computed(() => {
  if (aiConfig.value.provider === 'custom') {
    return []
  }
  const provider = getProviderById(aiConfig.value.provider)
  return provider?.models || []
})

// 服务商变更处理
const onProviderChange = (providerId: string) => {
  const provider = getProviderById(providerId)
  if (provider) {
    aiConfig.value.baseUrl = provider.baseURL
    aiConfig.value.model = getDefaultModel(providerId)
  } else if (providerId === 'custom') {
    aiConfig.value.baseUrl = ''
    aiConfig.value.model = ''
    aiConfig.value.customName = ''
  }
}

const appSettings = ref<AppSettings>({
  theme: 'light',
  language: 'zh-CN',
  autoSave: true,
  saveInterval: 30,
  enableNotifications: true,
  enableShortcuts: true
})

// 存储统计
const storageStats = computed(() => {
  const getSize = (data: any) => {
    return new Blob([JSON.stringify(data)]).size
  }
  
  const notesSize = getSize(notesStore.notes)
  const chatsSize = getSize(chatStore.sessions)
  const tasksSize = getSize(todosStore.tasks)
  
  return {
    notes: notesSize,
    chats: chatsSize,
    tasks: tasksSize,
    total: notesSize + chatsSize + tasksSize
  }
})

// 使用统计
const stats = ref({
  totalNotes: 0,
  totalTasks: 0,
  totalChats: 0,
  aiCalls: 0
})

// 方法
const loadSettings = () => {
  // 加载AI配置（优先从AI服务加载）
  const aiServiceConfig = aiService.getConfig()
  if (aiServiceConfig) {
    aiConfig.value = { ...aiServiceConfig }
  } else {
    // 回退到appStore配置
    const savedAIConfig = appStore.apiConfig
    if (savedAIConfig) {
      aiConfig.value = { ...savedAIConfig }
    }
  }
  
  // 加载应用设置
  const savedAppSettings = appStore.settings
  if (savedAppSettings) {
    appSettings.value = { ...savedAppSettings }
  }
}

const loadStats = async () => {
  try {
    stats.value = {
      totalNotes: notesStore.notes.length,
      totalTasks: todosStore.tasks.length,
      totalChats: chatStore.sessions.length,
      aiCalls: 156 // 这里可以从localStorage或其他地方获取实际的AI调用次数
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    stats.value = {
      totalNotes: 0,
      totalTasks: 0,
      totalChats: 0,
      aiCalls: 0
    }
  }
}

const saveSettings = async () => {
  try {
    // 保存AI配置（使用AI服务保存）
    aiService.saveConfig(aiConfig.value)
    await appStore.saveAPIConfig(aiConfig.value)
    
    // 保存应用设置
    await appStore.saveSettings(appSettings.value)
    
    // 应用主题
    if (appSettings.value.theme !== appStore.theme) {
      appStore.toggleTheme()
    }
    
    ElMessage.success('设置已保存')
    handleClose()
  } catch (error) {
    ElMessage.error('保存设置失败')
  }
}

const testConnection = async () => {
  if (!aiConfig.value.apiKey) {
    ElMessage.warning('请先输入API密钥')
    return
  }
  
  testing.value = true
  try {
    const result = await aiStore.testConnection(aiConfig.value)
    if (result.success) {
      ElMessage.success('连接测试成功')
    } else {
      ElMessage.error(`连接测试失败: ${result.error}`)
    }
  } catch (error) {
    ElMessage.error('连接测试失败')
  } finally {
    testing.value = false
  }
}

const resetAIConfig = () => {
  aiConfig.value = {
    provider: 'openai',
    apiKey: '',
    baseUrl: '',
    model: '',
    maxTokens: 2000,
    temperature: 0.7
  }
}

const exportData = () => {
  const data = {
    notes: notesStore.notes,
    chats: chatStore.sessions,
    tasks: todosStore.tasks,
    settings: appSettings.value,
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-workbench-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('数据导出成功')
}

const importData = (file: File) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      
      await ElMessageBox.confirm(
        '导入数据将覆盖现有数据，确定要继续吗？',
        '确认导入',
        { type: 'warning' }
      )
      
      // 导入数据
      if (data.notes) {
        notesStore.notes = data.notes
        await notesStore.saveNotes()
      }
      
      if (data.chats) {
        chatStore.sessions = data.chats
        await chatStore.saveSessions()
      }
      
      if (data.tasks) {
        todosStore.tasks = data.tasks
        await todosStore.saveTasks()
      }
      
      if (data.settings) {
        appSettings.value = { ...data.settings }
      }
      
      ElMessage.success('数据导入成功')
    } catch (error) {
      ElMessage.error('导入失败，请检查文件格式')
    }
  }
  
  reader.readAsText(file)
  return false // 阻止默认上传行为
}

const clearAllData = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有数据吗？此操作不可恢复！',
      '危险操作',
      { 
        type: 'error',
        confirmButtonText: '确定清空',
        cancelButtonText: '取消'
      }
    )
    
    // 清空所有数据
    localStorage.clear()
    
    // 重新初始化stores
    await notesStore.loadNotes()
    await chatStore.loadSessions()
    await todosStore.loadTasks()
    
    ElMessage.success('所有数据已清空')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空数据失败')
    }
  }
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleClose = () => {
  visible.value = false
}

// 生命周期
onMounted(() => {
  loadSettings()
  loadStats()
})

// 监听器
watch(visible, (newVal) => {
  if (newVal) {
    loadSettings()
    loadStats()
  }
})
</script>

<style scoped>
.provider-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}
.settings-section {
  padding: 20px 0;
}

.settings-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.section-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.form-help {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.action-group {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-secondary);
}

.action-group.danger {
  border-color: var(--danger-color);
  background: rgba(245, 108, 108, 0.05);
}

.action-group h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.action-group p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.storage-info {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.storage-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.storage-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.stat-item:last-child {
  border-bottom: none;
  font-weight: 600;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 14px;
  color: var(--text-primary);
}

.about-content {
  text-align: center;
}

.app-info {
  margin-bottom: 32px;
}

.app-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.app-info h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.version {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

.features-list {
  text-align: left;
  margin-bottom: 32px;
}

.features-list h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.features-list ul {
  list-style: none;
  padding: 0;
}

.features-list li {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.5;
}

.tech-stack {
  text-align: left;
}

.tech-stack h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 4px 12px;
  background: var(--primary-color);
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

/* 统计信息样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition-normal);
}

.stat-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.usage-chart {
  margin-top: 32px;
}

.usage-chart h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.chart-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius);
}

/* 图标样式 */
.icon-export::before { content: '📤'; }
.icon-import::before { content: '📥'; }
.icon-trash::before { content: '🗑️'; }
</style>