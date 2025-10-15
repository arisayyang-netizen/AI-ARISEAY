<template>
  <div class="personal-settings">
    <!-- 设置导航 -->
    <div class="settings-nav">
      <div class="nav-item" 
           v-for="section in settingSections" 
           :key="section.id"
           :class="{ active: activeSection === section.id }"
           @click="activeSection = section.id">
        <i :class="section.icon"></i>
        <span>{{ section.name }}</span>
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 个人信息 -->
      <div v-if="activeSection === 'profile'" class="settings-section">
        <div class="section-header">
          <h3>个人信息</h3>
          <p>管理您的个人资料和账户信息</p>
        </div>
        
        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="userProfile.avatar" :alt="userProfile.name" v-if="userProfile.avatar">
            <div v-else class="avatar-placeholder">{{ userProfile.name.charAt(0) }}</div>
            <button class="change-avatar-btn" @click="changeAvatar">
              <i class="icon-camera"></i>
            </button>
          </div>
          <div class="profile-info">
            <h4>{{ userProfile.name }}</h4>
            <p>{{ userProfile.email }}</p>
            <span class="profile-role">{{ userProfile.role }}</span>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label>姓名</label>
            <input type="text" v-model="userProfile.name" class="form-input">
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" v-model="userProfile.email" class="form-input">
          </div>
          <div class="form-group">
            <label>职位</label>
            <input type="text" v-model="userProfile.position" class="form-input">
          </div>
          <div class="form-group">
            <label>公司</label>
            <input type="text" v-model="userProfile.company" class="form-input">
          </div>
          <div class="form-group">
            <label>个人简介</label>
            <textarea v-model="userProfile.bio" class="form-textarea" rows="4"></textarea>
          </div>
          <button class="save-btn" @click="saveProfile">保存更改</button>
        </div>
      </div>

      <!-- 外观设置 -->
      <div v-if="activeSection === 'appearance'" class="settings-section">
        <div class="section-header">
          <h3>外观设置</h3>
          <p>自定义界面外观和主题</p>
        </div>

        <div class="appearance-options">
          <div class="option-group">
            <h4>主题模式</h4>
            <div class="theme-options">
              <div class="theme-option" 
                   :class="{ active: settings.theme === 'light' }"
                   @click="settings.theme = 'light'">
                <div class="theme-preview light"></div>
                <span>浅色模式</span>
              </div>
              <div class="theme-option" 
                   :class="{ active: settings.theme === 'dark' }"
                   @click="settings.theme = 'dark'">
                <div class="theme-preview dark"></div>
                <span>深色模式</span>
              </div>
              <div class="theme-option" 
                   :class="{ active: settings.theme === 'auto' }"
                   @click="settings.theme = 'auto'">
                <div class="theme-preview auto"></div>
                <span>跟随系统</span>
              </div>
            </div>
          </div>

          <div class="option-group">
            <h4>主色调</h4>
            <div class="color-options">
              <div class="color-option" 
                   v-for="color in colorOptions" 
                   :key="color.name"
                   :class="{ active: settings.primaryColor === color.value }"
                   @click="settings.primaryColor = color.value">
                <div class="color-preview" :style="{ background: color.value }"></div>
                <span>{{ color.name }}</span>
              </div>
            </div>
          </div>

          <div class="option-group">
            <h4>字体大小</h4>
            <div class="font-size-slider">
              <span>小</span>
              <input type="range" 
                     v-model="settings.fontSize" 
                     min="12" 
                     max="18" 
                     step="1"
                     class="slider">
              <span>大</span>
            </div>
            <p class="font-preview" :style="{ fontSize: settings.fontSize + 'px' }">
              预览文字效果
            </p>
          </div>

          <div class="option-group">
            <h4>界面密度</h4>
            <div class="density-options">
              <label class="radio-option">
                <input type="radio" v-model="settings.density" value="compact">
                <span>紧凑</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="settings.density" value="normal">
                <span>标准</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="settings.density" value="comfortable">
                <span>宽松</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div v-if="activeSection === 'notifications'" class="settings-section">
        <div class="section-header">
          <h3>通知设置</h3>
          <p>管理您的通知偏好</p>
        </div>

        <div class="notification-options">
          <div class="notification-group">
            <h4>桌面通知</h4>
            <div class="notification-item">
              <div class="notification-info">
                <span>任务提醒</span>
                <p>任务截止日期和重要事项提醒</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="notifications.taskReminder">
                <span class="slider"></span>
              </label>
            </div>
            <div class="notification-item">
              <div class="notification-info">
                <span>学习提醒</span>
                <p>每日学习计划和打卡提醒</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="notifications.learningReminder">
                <span class="slider"></span>
              </label>
            </div>
            <div class="notification-item">
              <div class="notification-info">
                <span>工作记录</span>
                <p>工作时间记录和统计提醒</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="notifications.workLogReminder">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-group">
            <h4>邮件通知</h4>
            <div class="notification-item">
              <div class="notification-info">
                <span>每日摘要</span>
                <p>每日工作和学习情况摘要</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="notifications.dailySummary">
                <span class="slider"></span>
              </label>
            </div>
            <div class="notification-item">
              <div class="notification-info">
                <span>周报告</span>
                <p>每周工作效率和学习进度报告</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="notifications.weeklyReport">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-group">
            <h4>提醒时间</h4>
            <div class="time-settings">
              <div class="time-item">
                <label>工作开始提醒</label>
                <input type="time" v-model="notifications.workStartTime" class="time-input">
              </div>
              <div class="time-item">
                <label>学习时间提醒</label>
                <input type="time" v-model="notifications.learningTime" class="time-input">
              </div>
              <div class="time-item">
                <label>休息提醒间隔</label>
                <select v-model="notifications.breakInterval" class="form-select">
                  <option value="30">30分钟</option>
                  <option value="45">45分钟</option>
                  <option value="60">1小时</option>
                  <option value="90">1.5小时</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div v-if="activeSection === 'data'" class="settings-section">
        <div class="section-header">
          <h3>数据管理</h3>
          <p>管理您的数据备份和导入导出</p>
        </div>

        <div class="data-options">
          <div class="data-group">
            <h4>数据备份</h4>
            <div class="backup-info">
              <div class="backup-status">
                <i class="icon-cloud"></i>
                <div>
                  <span>上次备份：{{ lastBackupTime }}</span>
                  <p>自动备份已启用</p>
                </div>
              </div>
              <button class="backup-btn" @click="createBackup">立即备份</button>
            </div>
            <div class="backup-settings">
              <label class="checkbox-option">
                <input type="checkbox" v-model="dataSettings.autoBackup">
                <span>启用自动备份</span>
              </label>
              <div class="backup-frequency">
                <label>备份频率</label>
                <select v-model="dataSettings.backupFrequency" class="form-select">
                  <option value="daily">每日</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
            </div>
          </div>

          <div class="data-group">
            <h4>数据导出</h4>
            <div class="export-options">
              <button class="export-btn" @click="exportData('tasks')">
                <i class="icon-download"></i>
                导出任务数据
              </button>
              <button class="export-btn" @click="exportData('worklog')">
                <i class="icon-download"></i>
                导出工作记录
              </button>
              <button class="export-btn" @click="exportData('learning')">
                <i class="icon-download"></i>
                导出学习数据
              </button>
              <button class="export-btn" @click="exportData('all')">
                <i class="icon-download"></i>
                导出全部数据
              </button>
            </div>
          </div>

          <div class="data-group">
            <h4>数据导入</h4>
            <div class="import-section">
              <div class="import-area" @click="$refs.fileInput.click()">
                <i class="icon-upload"></i>
                <p>点击选择文件或拖拽文件到此处</p>
                <span>支持 JSON、CSV 格式</span>
              </div>
              <input ref="fileInput" type="file" @change="importData" accept=".json,.csv" style="display: none;">
            </div>
          </div>

          <div class="data-group danger">
            <h4>危险操作</h4>
            <div class="danger-actions">
              <button class="danger-btn" @click="clearAllData">
                <i class="icon-trash"></i>
                清空所有数据
              </button>
              <p class="danger-warning">此操作不可恢复，请谨慎操作</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷键设置 -->
      <div v-if="activeSection === 'shortcuts'" class="settings-section">
        <div class="section-header">
          <h3>快捷键设置</h3>
          <p>自定义键盘快捷键</p>
        </div>

        <div class="shortcuts-list">
          <div class="shortcut-category">
            <h4>全局快捷键</h4>
            <div class="shortcut-item" v-for="shortcut in globalShortcuts" :key="shortcut.id">
              <div class="shortcut-info">
                <span>{{ shortcut.name }}</span>
                <p>{{ shortcut.description }}</p>
              </div>
              <div class="shortcut-key" @click="editShortcut(shortcut)">
                {{ shortcut.key }}
              </div>
            </div>
          </div>

          <div class="shortcut-category">
            <h4>任务管理</h4>
            <div class="shortcut-item" v-for="shortcut in taskShortcuts" :key="shortcut.id">
              <div class="shortcut-info">
                <span>{{ shortcut.name }}</span>
                <p>{{ shortcut.description }}</p>
              </div>
              <div class="shortcut-key" @click="editShortcut(shortcut)">
                {{ shortcut.key }}
              </div>
            </div>
          </div>

          <div class="shortcut-category">
            <h4>学习模块</h4>
            <div class="shortcut-item" v-for="shortcut in learningShortcuts" :key="shortcut.id">
              <div class="shortcut-info">
                <span>{{ shortcut.name }}</span>
                <p>{{ shortcut.description }}</p>
              </div>
              <div class="shortcut-key" @click="editShortcut(shortcut)">
                {{ shortcut.key }}
              </div>
            </div>
          </div>
        </div>

        <div class="shortcuts-actions">
          <button class="reset-btn" @click="resetShortcuts">恢复默认</button>
        </div>
      </div>

      <!-- 关于 -->
      <div v-if="activeSection === 'about'" class="settings-section">
        <div class="section-header">
          <h3>关于</h3>
          <p>应用信息和版本详情</p>
        </div>

        <div class="about-content">
          <div class="app-info">
            <div class="app-icon">🧠</div>
            <div class="app-details">
              <h4>运营效率管家</h4>
              <p>版本 {{ appVersion }}</p>
              <span>智能工作效率提升平台</span>
            </div>
          </div>

          <div class="feature-list">
            <h4>核心功能</h4>
            <ul>
              <li>智能工作概览与数据分析</li>
              <li>高效任务管理与协作</li>
              <li>详细工作记录与时间追踪</li>
              <li>项目框架与代码生成</li>
              <li>个性化学习计划与知识管理</li>
              <li>AI 驱动的智能建议</li>
            </ul>
          </div>

          <div class="system-info">
            <h4>系统信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span>操作系统</span>
                <span>{{ systemInfo.os }}</span>
              </div>
              <div class="info-item">
                <span>浏览器</span>
                <span>{{ systemInfo.browser }}</span>
              </div>
              <div class="info-item">
                <span>屏幕分辨率</span>
                <span>{{ systemInfo.resolution }}</span>
              </div>
              <div class="info-item">
                <span>本地存储</span>
                <span>{{ systemInfo.storage }}</span>
              </div>
            </div>
          </div>

          <div class="update-section">
            <button class="update-btn" @click="checkUpdate">检查更新</button>
            <p class="update-info">{{ updateInfo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷键编辑模态框 -->
    <div v-if="showShortcutModal" class="modal-overlay" @click="closeShortcutModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑快捷键</h3>
          <button class="close-btn" @click="closeShortcutModal">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="shortcut-editor">
            <h4>{{ editingShortcut.name }}</h4>
            <p>{{ editingShortcut.description }}</p>
            <div class="key-input">
              <input 
                type="text" 
                v-model="newShortcutKey" 
                @keydown="captureKey"
                placeholder="按下新的快捷键组合"
                class="form-input"
                readonly
              >
            </div>
            <p class="key-hint">按下您想要设置的快捷键组合</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeShortcutModal">取消</button>
          <button class="save-btn" @click="saveShortcut">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalSettings',
  data() {
    return {
      activeSection: 'profile',
      settingSections: [
        { id: 'profile', name: '个人信息', icon: 'icon-user' },
        { id: 'appearance', name: '外观设置', icon: 'icon-palette' },
        { id: 'notifications', name: '通知设置', icon: 'icon-bell' },
        { id: 'data', name: '数据管理', icon: 'icon-database' },
        { id: 'shortcuts', name: '快捷键', icon: 'icon-keyboard' },
        { id: 'about', name: '关于', icon: 'icon-info' }
      ],

      // 用户资料
      userProfile: {
        name: '张三',
        email: 'zhangsan@example.com',
        position: '前端开发工程师',
        company: '科技有限公司',
        role: '管理员',
        bio: '热爱技术，专注于前端开发和用户体验设计。',
        avatar: null
      },

      // 外观设置
      settings: {
        theme: 'light',
        primaryColor: '#32CD32',
        fontSize: 14,
        density: 'normal'
      },
      colorOptions: [
        { name: '浅绿色', value: '#32CD32' },
        { name: '蓝色', value: '#1976d2' },
        { name: '紫色', value: '#7b1fa2' },
        { name: '橙色', value: '#f57c00' },
        { name: '红色', value: '#d32f2f' },
        { name: '青色', value: '#00796b' }
      ],

      // 通知设置
      notifications: {
        taskReminder: true,
        learningReminder: true,
        workLogReminder: false,
        dailySummary: true,
        weeklyReport: true,
        workStartTime: '09:00',
        learningTime: '20:00',
        breakInterval: '60'
      },

      // 数据设置
      dataSettings: {
        autoBackup: true,
        backupFrequency: 'weekly'
      },
      lastBackupTime: '2024-01-15 10:30',

      // 快捷键设置
      globalShortcuts: [
        { id: 1, name: '快速搜索', description: '打开全局搜索', key: 'Ctrl+K' },
        { id: 2, name: '新建任务', description: '快速创建新任务', key: 'Ctrl+N' },
        { id: 3, name: '切换主题', description: '切换明暗主题', key: 'Ctrl+Shift+T' }
      ],
      taskShortcuts: [
        { id: 4, name: '标记完成', description: '标记当前任务为完成', key: 'Ctrl+Enter' },
        { id: 5, name: '设置优先级', description: '快速设置任务优先级', key: 'Ctrl+P' }
      ],
      learningShortcuts: [
        { id: 6, name: '开始学习', description: '开始学习计时', key: 'Ctrl+S' },
        { id: 7, name: '添加笔记', description: '快速添加学习笔记', key: 'Ctrl+M' }
      ],

      // 应用信息
      appVersion: '1.0.0',
      systemInfo: {
        os: 'Windows 11',
        browser: 'Chrome 120.0',
        resolution: '1920x1080',
        storage: '85% 可用'
      },
      updateInfo: '当前已是最新版本',

      // 模态框状态
      showShortcutModal: false,
      editingShortcut: null,
      newShortcutKey: ''
    }
  },
  methods: {
    // 个人信息
    changeAvatar() {
      // 更换头像逻辑
      console.log('更换头像')
    },
    saveProfile() {
      // 保存个人信息
      console.log('保存个人信息', this.userProfile)
      this.$message.success('个人信息已保存')
    },

    // 数据管理
    createBackup() {
      // 创建备份
      console.log('创建数据备份')
      this.lastBackupTime = new Date().toLocaleString('zh-CN')
      this.$message.success('数据备份已创建')
    },
    exportData(type) {
      // 导出数据
      console.log('导出数据类型:', type)
      this.$message.success(`${type === 'all' ? '全部' : type}数据导出成功`)
    },
    importData(event) {
      // 导入数据
      const file = event.target.files[0]
      if (file) {
        console.log('导入文件:', file.name)
        this.$message.success('数据导入成功')
      }
    },
    clearAllData() {
      // 清空所有数据
      if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        console.log('清空所有数据')
        this.$message.success('所有数据已清空')
      }
    },

    // 快捷键设置
    editShortcut(shortcut) {
      this.editingShortcut = shortcut
      this.newShortcutKey = shortcut.key
      this.showShortcutModal = true
    },
    captureKey(event) {
      event.preventDefault()
      const keys = []
      
      if (event.ctrlKey) keys.push('Ctrl')
      if (event.shiftKey) keys.push('Shift')
      if (event.altKey) keys.push('Alt')
      if (event.metaKey) keys.push('Meta')
      
      if (event.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
        keys.push(event.key.length === 1 ? event.key.toUpperCase() : event.key)
      }
      
      this.newShortcutKey = keys.join('+')
    },
    saveShortcut() {
      if (this.editingShortcut && this.newShortcutKey) {
        this.editingShortcut.key = this.newShortcutKey
        this.closeShortcutModal()
        this.$message.success('快捷键已更新')
      }
    },
    closeShortcutModal() {
      this.showShortcutModal = false
      this.editingShortcut = null
      this.newShortcutKey = ''
    },
    resetShortcuts() {
      if (confirm('确定要恢复所有快捷键到默认设置吗？')) {
        // 恢复默认快捷键
        console.log('恢复默认快捷键')
        this.$message.success('快捷键已恢复默认')
      }
    },

    // 关于
    checkUpdate() {
      // 检查更新
      this.updateInfo = '正在检查更新...'
      setTimeout(() => {
        this.updateInfo = '当前已是最新版本'
      }, 2000)
    }
  }
}
</script>

<style scoped>
.personal-settings {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
}

/* 设置导航 */
.settings-nav {
  width: 240px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 24px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #32CD32;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(50, 205, 50, 0.1), transparent);
  color: #32CD32;
  border-right: 3px solid #32CD32;
}

.nav-item i {
  font-size: 18px;
}

.nav-item span {
  font-size: 14px;
  font-weight: 500;
}

/* 设置内容 */
.settings-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.settings-section {
  max-width: 800px;
}

.section-header {
  margin-bottom: 32px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.section-header p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

/* 个人信息 */
.profile-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.profile-avatar {
  position: relative;
}

.profile-avatar img, .avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #90EE90, #32CD32);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #32CD32;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-info h4 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.profile-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.profile-role {
  padding: 4px 12px;
  background: #e8f5e8;
  color: #32CD32;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #32CD32;
  box-shadow: 0 0 0 3px rgba(50, 205, 50, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.save-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #90EE90, #32CD32);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

/* 外观设置 */
.appearance-options {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.option-group {
  margin-bottom: 32px;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-group h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-option:hover {
  border-color: #32CD32;
}

.theme-option.active {
  border-color: #32CD32;
  background: #f0f8f0;
}

.theme-preview {
  width: 60px;
  height: 40px;
  border-radius: 8px;
  position: relative;
}

.theme-preview.light {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 1px solid #e9ecef;
}

.theme-preview.dark {
  background: linear-gradient(135deg, #2d3748, #1a202c);
}

.theme-preview.auto {
  background: linear-gradient(90deg, #ffffff 50%, #2d3748 50%);
}

.color-options {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-option:hover {
  border-color: #32CD32;
}

.color-option.active {
  border-color: #32CD32;
  background: #f0f8f0;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.font-size-slider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.slider {
  flex: 1;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #32CD32;
  border-radius: 50%;
  cursor: pointer;
}

.font-preview {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  color: #1a1a1a;
}

.density-options {
  display: flex;
  gap: 24px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-option input[type="radio"] {
  margin: 0;
}

/* 通知设置 */
.notification-options {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notification-group {
  margin-bottom: 32px;
}

.notification-group:last-child {
  margin-bottom: 0;
}

.notification-group h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-info span {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.notification-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.switch .slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #32CD32;
}

.switch input:checked + .slider:before {
  transform: translateX(24px);
}

.time-settings {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-item label {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.time-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

/* 数据管理 */
.data-options {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.data-group {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.data-group:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.data-group.danger {
  border-color: #ffebee;
  background: #fafafa;
  border-radius: 12px;
  padding: 24px;
}

.data-group h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.backup-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.backup-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.backup-status i {
  font-size: 24px;
  color: #32CD32;
}

.backup-status span {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.backup-status p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.backup-btn, .export-btn, .update-btn, .reset-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #90EE90, #32CD32);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.backup-btn:hover, .export-btn:hover, .update-btn:hover, .reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

.backup-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.backup-frequency {
  display: flex;
  align-items: center;
  gap: 12px;
}

.backup-frequency label {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.export-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.import-section {
  margin-top: 16px;
}

.import-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.import-area:hover {
  border-color: #32CD32;
  background: #f0f8f0;
}

.import-area i {
  font-size: 32px;
  color: #666;
  margin-bottom: 12px;
}

.import-area p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #1a1a1a;
}

.import-area span {
  font-size: 12px;
  color: #666;
}

.danger-actions {
  text-align: center;
}

.danger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto 12px auto;
}

.danger-btn:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

.danger-warning {
  margin: 0;
  font-size: 12px;
  color: #d32f2f;
}

/* 快捷键设置 */
.shortcuts-list {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.shortcut-category {
  margin-bottom: 32px;
}

.shortcut-category:last-child {
  margin-bottom: 0;
}

.shortcut-category h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-info span {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.shortcut-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.shortcut-key {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shortcut-key:hover {
  background: #e9ecef;
  border-color: #32CD32;
}

.shortcuts-actions {
  text-align: center;
}

/* 关于 */
.about-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.app-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.app-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #90EE90, #32CD32);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.app-details h4 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.app-details p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.app-details span {
  font-size: 13px;
  color: #999;
}

.feature-list {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.feature-list h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.feature-list ul {
  margin: 0;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.system-info {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.system-info h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item span:first-child {
  font-size: 14px;
  color: #666;
}

.info-item span:last-child {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.update-section {
  text-align: center;
}

.update-info {
  margin: 12px 0 0 0;
  font-size: 13px;
  color: #666;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
}

.modal-body {
  padding: 0 24px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px 24px 24px;
}

.shortcut-editor {
  text-align: center;
}

.shortcut-editor h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.shortcut-editor p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666;
}

.key-input {
  margin-bottom: 12px;
}

.key-hint {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.cancel-btn {
  padding: 10px 20px;
  background: #f8f9fa;
  color: #495057;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personal-settings {
    flex-direction: column;
  }
  
  .settings-nav {
    width: 100%;
    display: flex;
    overflow-x: auto;
    padding: 16px;
  }
  
  .nav-item {
    white-space: nowrap;
    padding: 8px 16px;
  }
  
  .settings-content {
    padding: 16px;
  }
  
  .profile-card {
    flex-direction: column;
    text-align: center;
  }
  
  .theme-options {
    grid-template-columns: 1fr;
  }
  
  .color-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .density-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .time-settings {
    grid-template-columns: 1fr;
  }
  
  .export-options {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* 图标样式 */
.icon-user::before { content: "👤"; }
.icon-palette::before { content: "🎨"; }
.icon-bell::before { content: "🔔"; }
.icon-database::before { content: "💾"; }
.icon-keyboard::before { content: "⌨️"; }
.icon-info::before { content: "ℹ️"; }
.icon-camera::before { content: "📷"; }
.icon-cloud::before { content: "☁️"; }
.icon-download::before { content: "⬇️"; }
.icon-upload::before { content: "⬆️"; }
.icon-trash::before { content: "🗑️"; }
.icon-close::before { content: "✕"; }
</style>