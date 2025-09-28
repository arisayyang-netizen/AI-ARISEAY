import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { APIConfig } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const isLoading = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const sidebarCollapsed = ref(false)
  const apiConfig = ref<APIConfig | null>(null)

  // 初始化应用
  const initApp = async () => {
    try {
      isLoading.value = true
      
      // 加载用户设置
      await loadSettings()
      
      // 加载API配置
      await loadAPIConfig()
      
      console.log('🚀 AI智能工作台初始化完成')
    } catch (error) {
      console.error('应用初始化失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 加载用户设置
  const loadSettings = async () => {
    const savedTheme = localStorage.getItem('ai-workbench-theme')
    if (savedTheme) {
      theme.value = savedTheme as 'light' | 'dark'
      applyTheme(theme.value)
    }

    const savedSidebar = localStorage.getItem('ai-workbench-sidebar')
    if (savedSidebar) {
      sidebarCollapsed.value = JSON.parse(savedSidebar)
    }
  }

  // 加载API配置
  const loadAPIConfig = async () => {
    const saved = localStorage.getItem('ai-workbench-api-config')
    if (saved) {
      try {
        const encrypted = saved
        const decrypted = atob(encrypted)
        apiConfig.value = JSON.parse(decrypted)
      } catch (error) {
        console.warn('API配置解析失败:', error)
      }
    }
  }

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
    localStorage.setItem('ai-workbench-theme', theme.value)
  }

  // 应用主题
  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('ai-workbench-sidebar', JSON.stringify(sidebarCollapsed.value))
  }

  // 保存API配置
  const saveAPIConfig = (config: APIConfig) => {
    apiConfig.value = config
    const encrypted = btoa(JSON.stringify(config))
    localStorage.setItem('ai-workbench-api-config', encrypted)
  }

  return {
    // 状态
    isLoading,
    theme,
    sidebarCollapsed,
    apiConfig,
    
    // 方法
    initApp,
    toggleTheme,
    toggleSidebar,
    saveAPIConfig
  }
})