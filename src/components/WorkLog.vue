<template>
  <div class="work-log">
    <!-- 顶部操作栏 -->
    <div class="log-header">
      <div class="header-left">
        <h2>工作记录</h2>
        <div class="date-selector">
          <button class="date-nav-btn" @click="previousDay">
            <i class="icon-prev"></i>
          </button>
          <input 
            type="date" 
            v-model="selectedDate" 
            class="date-input"
            @change="loadWorkLogs"
          >
          <button class="date-nav-btn" @click="nextDay">
            <i class="icon-next"></i>
          </button>
          <button class="today-btn" @click="goToToday">今天</button>
        </div>
      </div>
      <div class="header-right">
        <button class="export-btn" @click="exportLogs">
          <i class="icon-export"></i>
          导出记录
        </button>
        <button class="add-log-btn" @click="showAddModal = true">
          <i class="icon-plus"></i>
          添加记录
        </button>
      </div>
    </div>

    <!-- 今日统计 -->
    <div class="daily-stats">
      <div class="stat-card">
        <div class="stat-icon work">
          <i class="icon-work"></i>
        </div>
        <div class="stat-content">
          <h3>{{ todayWorkTime }}</h3>
          <p>今日工作时长</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon tasks">
          <i class="icon-tasks"></i>
        </div>
        <div class="stat-content">
          <h3>{{ todayTaskCount }}</h3>
          <p>完成任务数</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon efficiency">
          <i class="icon-efficiency"></i>
        </div>
        <div class="stat-content">
          <h3>{{ todayEfficiency }}%</h3>
          <p>工作效率</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon focus">
          <i class="icon-focus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ focusTime }}</h3>
          <p>专注时长</p>
        </div>
      </div>
    </div>

    <!-- 时间轴视图 -->
    <div class="timeline-section">
      <div class="section-header">
        <h3>工作时间轴</h3>
        <div class="view-options">
          <button 
            class="view-btn" 
            :class="{ active: timelineView === 'timeline' }"
            @click="timelineView = 'timeline'"
          >
            时间轴
          </button>
          <button 
            class="view-btn" 
            :class="{ active: timelineView === 'list' }"
            @click="timelineView = 'list'"
          >
            列表
          </button>
        </div>
      </div>

      <!-- 时间轴视图 -->
      <div v-if="timelineView === 'timeline'" class="timeline-view">
        <div class="timeline-container">
          <div class="time-scale">
            <div 
              v-for="hour in 24" 
              :key="hour"
              class="hour-mark"
              :style="{ left: (hour - 1) * 4.167 + '%' }"
            >
              {{ String(hour - 1).padStart(2, '0') }}:00
            </div>
          </div>
          
          <div class="timeline-tracks">
            <div 
              v-for="log in todayLogs" 
              :key="log.id"
              class="timeline-item"
              :class="log.category"
              :style="getTimelineStyle(log)"
              @click="editLog(log)"
            >
              <div class="timeline-content">
                <h4>{{ log.title }}</h4>
                <p>{{ log.description }}</p>
                <span class="time-duration">{{ formatDuration(log.duration) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="timelineView === 'list'" class="list-view">
        <div class="log-list">
          <div 
            v-for="log in todayLogs" 
            :key="log.id"
            class="log-item"
            :class="log.category"
          >
            <div class="log-time">
              <span class="start-time">{{ formatTime(log.startTime) }}</span>
              <span class="duration">{{ formatDuration(log.duration) }}</span>
            </div>
            
            <div class="log-content">
              <div class="log-header-row">
                <h4>{{ log.title }}</h4>
                <div class="log-badges">
                  <span class="category-badge" :class="log.category">
                    {{ getCategoryText(log.category) }}
                  </span>
                  <span v-if="log.project" class="project-badge">
                    {{ log.project }}
                  </span>
                </div>
              </div>
              
              <p class="log-description">{{ log.description }}</p>
              
              <div class="log-meta">
                <div class="meta-tags">
                  <span 
                    v-for="tag in log.tags" 
                    :key="tag"
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>
                <div class="log-actions">
                  <button class="action-btn" @click="editLog(log)" title="编辑">
                    <i class="icon-edit"></i>
                  </button>
                  <button class="action-btn" @click="duplicateLog(log)" title="复制">
                    <i class="icon-copy"></i>
                  </button>
                  <button class="action-btn delete" @click="deleteLog(log)" title="删除">
                    <i class="icon-delete"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 周统计图表 -->
    <div class="weekly-stats">
      <h3>本周工作统计</h3>
      <div class="chart-container">
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color work"></span>
            <span>工作时间</span>
          </div>
          <div class="legend-item">
            <span class="legend-color break"></span>
            <span>休息时间</span>
          </div>
          <div class="legend-item">
            <span class="legend-color learning"></span>
            <span>学习时间</span>
          </div>
        </div>
        
        <div class="chart-bars">
          <div 
            v-for="(day, index) in weeklyData" 
            :key="index"
            class="day-bar"
          >
            <div class="bar-container">
              <div 
                class="bar-segment work"
                :style="{ height: (day.work / 8) * 100 + '%' }"
                :title="`工作: ${day.work}小时`"
              ></div>
              <div 
                class="bar-segment learning"
                :style="{ height: (day.learning / 8) * 100 + '%' }"
                :title="`学习: ${day.learning}小时`"
              ></div>
              <div 
                class="bar-segment break"
                :style="{ height: (day.break / 8) * 100 + '%' }"
                :title="`休息: ${day.break}小时`"
              ></div>
            </div>
            <span class="day-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑记录模态框 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingLog ? '编辑工作记录' : '添加工作记录' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>记录标题</label>
            <input 
              type="text" 
              v-model="logForm.title" 
              placeholder="输入工作内容..."
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>详细描述</label>
            <textarea 
              v-model="logForm.description" 
              placeholder="描述具体的工作内容和成果..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>分类</label>
              <select v-model="logForm.category" class="form-select">
                <option value="work">工作</option>
                <option value="meeting">会议</option>
                <option value="learning">学习</option>
                <option value="break">休息</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>项目</label>
              <input 
                type="text" 
                v-model="logForm.project" 
                placeholder="关联项目..."
                class="form-input"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>开始时间</label>
              <input 
                type="time" 
                v-model="logForm.startTime" 
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>结束时间</label>
              <input 
                type="time" 
                v-model="logForm.endTime" 
                class="form-input"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>标签</label>
            <div class="tag-input-container">
              <input 
                type="text" 
                v-model="newTag" 
                placeholder="添加标签..."
                class="tag-input"
                @keyup.enter="addTag"
              >
              <button class="add-tag-btn" @click="addTag">
                <i class="icon-plus"></i>
              </button>
            </div>
            <div class="selected-tags">
              <span 
                v-for="(tag, index) in logForm.tags" 
                :key="index"
                class="tag-item"
              >
                #{{ tag }}
                <button class="remove-tag-btn" @click="removeTag(index)">
                  <i class="icon-close"></i>
                </button>
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label>工作成果</label>
            <textarea 
              v-model="logForm.achievements" 
              placeholder="记录今天的工作成果和收获..."
              class="form-textarea"
              rows="2"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveLog">
            {{ editingLog ? '更新记录' : '保存记录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkLog',
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      timelineView: 'timeline',
      showAddModal: false,
      editingLog: null,
      newTag: '',
      todayLogs: [
        {
          id: 1,
          title: '项目需求分析',
          description: '与客户沟通项目需求，整理功能清单',
          category: 'work',
          project: '电商平台',
          startTime: '09:00',
          endTime: '11:30',
          duration: 150,
          tags: ['需求分析', '客户沟通'],
          achievements: '完成了核心功能需求梳理，确定了技术方案'
        },
        {
          id: 2,
          title: '团队会议',
          description: '讨论项目进度和技术难点',
          category: 'meeting',
          project: '电商平台',
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          tags: ['团队协作', '进度同步'],
          achievements: '明确了各成员的任务分工'
        },
        {
          id: 3,
          title: '代码开发',
          description: '实现用户认证模块',
          category: 'work',
          project: '电商平台',
          startTime: '15:30',
          endTime: '18:00',
          duration: 150,
          tags: ['前端开发', 'Vue.js'],
          achievements: '完成了登录注册功能的前端实现'
        },
        {
          id: 4,
          title: '技术学习',
          description: '学习Vue 3新特性',
          category: 'learning',
          project: '',
          startTime: '19:00',
          endTime: '20:30',
          duration: 90,
          tags: ['Vue3', '学习'],
          achievements: '掌握了Composition API的使用方法'
        }
      ],
      weeklyData: [
        { label: '周一', work: 6.5, learning: 1.5, break: 1 },
        { label: '周二', work: 7, learning: 1, break: 1.5 },
        { label: '周三', work: 6, learning: 2, break: 1 },
        { label: '周四', work: 7.5, learning: 0.5, break: 1 },
        { label: '周五', work: 6, learning: 1, break: 2 },
        { label: '周六', work: 2, learning: 3, break: 2 },
        { label: '周日', work: 0, learning: 1, break: 4 }
      ],
      logForm: {
        title: '',
        description: '',
        category: 'work',
        project: '',
        startTime: '',
        endTime: '',
        tags: [],
        achievements: ''
      }
    }
  },
  computed: {
    todayWorkTime() {
      const workLogs = this.todayLogs.filter(log => log.category === 'work');
      const totalMinutes = workLogs.reduce((sum, log) => sum + log.duration, 0);
      return this.formatDuration(totalMinutes);
    },
    
    todayTaskCount() {
      return this.todayLogs.filter(log => log.category === 'work').length;
    },
    
    todayEfficiency() {
      const totalWork = this.todayLogs
        .filter(log => log.category === 'work')
        .reduce((sum, log) => sum + log.duration, 0);
      const totalTime = this.todayLogs.reduce((sum, log) => sum + log.duration, 0);
      return totalTime > 0 ? Math.round((totalWork / totalTime) * 100) : 0;
    },
    
    focusTime() {
      const focusLogs = this.todayLogs.filter(log => 
        log.category === 'work' || log.category === 'learning'
      );
      const totalMinutes = focusLogs.reduce((sum, log) => sum + log.duration, 0);
      return this.formatDuration(totalMinutes);
    }
  },
  methods: {
    previousDay() {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() - 1);
      this.selectedDate = date.toISOString().split('T')[0];
      this.loadWorkLogs();
    },
    
    nextDay() {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      this.selectedDate = date.toISOString().split('T')[0];
      this.loadWorkLogs();
    },
    
    goToToday() {
      this.selectedDate = new Date().toISOString().split('T')[0];
      this.loadWorkLogs();
    },
    
    loadWorkLogs() {
      // 根据选择的日期加载工作记录
      const storageKey = `workLogs_${this.selectedDate}`;
      const savedLogs = localStorage.getItem(storageKey);
      
      if (savedLogs) {
        try {
          this.todayLogs = JSON.parse(savedLogs);
          this.updateDailyStats();
        } catch (error) {
          console.error('加载工作记录失败:', error);
          this.todayLogs = [];
        }
      } else {
        this.todayLogs = [];
        this.updateDailyStats();
      }
      
      console.log('加载日期:', this.selectedDate, '记录数量:', this.todayLogs.length);
    },

    saveWorkLogsToStorage() {
      // 保存工作记录到本地存储
      const storageKey = `workLogs_${this.selectedDate}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(this.todayLogs));
        console.log('工作记录已保存到本地存储');
      } catch (error) {
        console.error('保存工作记录失败:', error);
      }
    },

    updateDailyStats() {
      // 更新今日统计数据
      if (this.todayLogs.length === 0) {
        this.todayWorkTime = '0h 0m';
        this.todayTaskCount = 0;
        this.todayEfficiency = 0;
        this.focusTime = '0h 0m';
        return;
      }

      // 计算总工作时长
      const totalMinutes = this.todayLogs.reduce((sum, log) => sum + log.duration, 0);
      this.todayWorkTime = this.formatDuration(totalMinutes);

      // 计算任务数量
      this.todayTaskCount = this.todayLogs.length;

      // 计算专注时长（工作和学习类别）
      const focusMinutes = this.todayLogs
        .filter(log => ['work', 'learning'].includes(log.category))
        .reduce((sum, log) => sum + log.duration, 0);
      this.focusTime = this.formatDuration(focusMinutes);

      // 计算工作效率（基于专注时长占比）
      this.todayEfficiency = totalMinutes > 0 ? Math.round((focusMinutes / totalMinutes) * 100) : 0;
    },
    
    getTimelineStyle(log) {
      const startHour = parseInt(log.startTime.split(':')[0]);
      const startMinute = parseInt(log.startTime.split(':')[1]);
      const startPercent = (startHour + startMinute / 60) / 24 * 100;
      const widthPercent = (log.duration / 60) / 24 * 100;
      
      return {
        left: startPercent + '%',
        width: widthPercent + '%'
      };
    },
    
    formatTime(timeString) {
      return timeString;
    },
    
    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    },
    
    getCategoryText(category) {
      const map = {
        work: '工作',
        meeting: '会议',
        learning: '学习',
        break: '休息',
        other: '其他'
      };
      return map[category] || '其他';
    },
    
    editLog(log) {
      this.editingLog = log;
      this.logForm = {
        title: log.title,
        description: log.description,
        category: log.category,
        project: log.project,
        startTime: log.startTime,
        endTime: log.endTime,
        tags: [...log.tags],
        achievements: log.achievements
      };
      this.showAddModal = true;
    },
    
    duplicateLog(log) {
      const newLog = {
        ...log,
        id: Date.now(),
        title: log.title + ' (副本)'
      };
      this.todayLogs.push(newLog);
    },
    
    deleteLog(log) {
      if (confirm('确定要删除这条工作记录吗？')) {
        const index = this.todayLogs.findIndex(l => l.id === log.id);
        if (index > -1) {
          this.todayLogs.splice(index, 1);
          // 保存到本地存储
          this.saveWorkLogsToStorage();
          // 更新统计数据
          this.updateDailyStats();
        }
      }
    },
    
    closeModal() {
      this.showAddModal = false;
      this.editingLog = null;
      this.resetForm();
    },
    
    resetForm() {
      this.logForm = {
        title: '',
        description: '',
        category: 'work',
        project: '',
        startTime: '',
        endTime: '',
        tags: [],
        achievements: ''
      };
      this.newTag = '';
    },
    
    addTag() {
      if (this.newTag.trim() && !this.logForm.tags.includes(this.newTag.trim())) {
        this.logForm.tags.push(this.newTag.trim());
        this.newTag = '';
      }
    },
    
    removeTag(index) {
      this.logForm.tags.splice(index, 1);
    },
    
    saveLog() {
      if (!this.logForm.title.trim()) {
        alert('请输入记录标题');
        return;
      }
      
      if (!this.logForm.startTime || !this.logForm.endTime) {
        alert('请设置开始和结束时间');
        return;
      }
      
      // 计算持续时间
      const start = new Date(`2000-01-01 ${this.logForm.startTime}`);
      const end = new Date(`2000-01-01 ${this.logForm.endTime}`);
      const duration = (end - start) / (1000 * 60);
      
      if (duration <= 0) {
        alert('结束时间必须晚于开始时间');
        return;
      }
      
      if (this.editingLog) {
        // 更新现有记录
        Object.assign(this.editingLog, {
          ...this.logForm,
          duration
        });
      } else {
        // 创建新记录
        const newLog = {
          ...this.logForm,
          id: Date.now(),
          duration
        };
        this.todayLogs.push(newLog);
      }
      
      // 按开始时间排序
      this.todayLogs.sort((a, b) => a.startTime.localeCompare(b.startTime));
      
      // 保存到本地存储
      this.saveWorkLogsToStorage();
      
      // 更新统计数据
      this.updateDailyStats();
      
      this.closeModal();
    },
    
    exportLogs() {
      // 导出工作记录功能
      const data = this.todayLogs.map(log => ({
        日期: this.selectedDate,
        标题: log.title,
        描述: log.description,
        分类: this.getCategoryText(log.category),
        项目: log.project,
        开始时间: log.startTime,
        结束时间: log.endTime,
        持续时间: this.formatDuration(log.duration),
        标签: log.tags.join(', '),
        成果: log.achievements
      }));
      
      console.log('导出数据:', data);
      // 这里可以实现CSV或Excel导出功能
    }
  },
  
  mounted() {
    // 设置默认的开始和结束时间
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    this.logForm.startTime = `${currentHour}:${currentMinute}`;
    
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endHour = endTime.getHours().toString().padStart(2, '0');
    const endMinute = endTime.getMinutes().toString().padStart(2, '0');
    this.logForm.endTime = `${endHour}:${endMinute}`;
    
    // 加载当前日期的工作记录
    this.loadWorkLogs();
  }
}
</script>

<style scoped>
.work-log {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 顶部操作栏 */
.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-nav-btn:hover {
  border-color: #32CD32;
  background: #f8fff8;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.today-btn {
  padding: 8px 16px;
  background: #32CD32;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.today-btn:hover {
  background: #28a745;
}

.header-right {
  display: flex;
  gap: 12px;
}

.export-btn, .add-log-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn {
  background: #f8f9fa;
  color: #495057;
}

.export-btn:hover {
  background: #e9ecef;
}

.add-log-btn {
  background: linear-gradient(135deg, #90EE90, #32CD32);
  color: white;
}

.add-log-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

/* 今日统计 */
.daily-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.work {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-icon.tasks {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-icon.efficiency {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.stat-icon.focus {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 时间轴部分 */
.timeline-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.view-options {
  display: flex;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 2px;
}

.view-btn {
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: white;
  color: #32CD32;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 时间轴视图 */
.timeline-view {
  position: relative;
}

.timeline-container {
  position: relative;
  height: 400px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.time-scale {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.hour-mark {
  position: absolute;
  top: 8px;
  font-size: 12px;
  color: #666;
  transform: translateX(-50%);
}

.timeline-tracks {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 0;
}

.timeline-item {
  position: absolute;
  height: 60px;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.timeline-item:nth-child(4n+1) { top: 16px; }
.timeline-item:nth-child(4n+2) { top: 84px; }
.timeline-item:nth-child(4n+3) { top: 152px; }
.timeline-item:nth-child(4n+4) { top: 220px; }

.timeline-item.work {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.timeline-item.meeting {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.timeline-item.learning {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.timeline-item.break {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.timeline-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.timeline-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.timeline-content p {
  margin: 0 0 4px 0;
  font-size: 12px;
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time-duration {
  font-size: 11px;
  opacity: 0.8;
}

/* 列表视图 */
.list-view {
  max-height: 600px;
  overflow-y: auto;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.log-item:hover {
  border-color: #90EE90;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.log-item.work {
  border-left: 4px solid #667eea;
}

.log-item.meeting {
  border-left: 4px solid #f093fb;
}

.log-item.learning {
  border-left: 4px solid #4facfe;
}

.log-item.break {
  border-left: 4px solid #43e97b;
}

.log-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
}

.start-time {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.duration {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.log-content {
  flex: 1;
}

.log-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.log-content h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
}

.log-badges {
  display: flex;
  gap: 8px;
}

.category-badge, .project-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.category-badge.work {
  background: #e8f0ff;
  color: #667eea;
}

.category-badge.meeting {
  background: #ffe8f5;
  color: #f093fb;
}

.category-badge.learning {
  background: #e8f8ff;
  color: #4facfe;
}

.category-badge.break {
  background: #e8fff5;
  color: #43e97b;
}

.project-badge {
  background: #f0f8f0;
  color: #32CD32;
}

.log-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.log-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  color: #32CD32;
  background: #f0f8f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.log-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e9ecef;
}

.action-btn.delete:hover {
  background: #ffe6e6;
  color: #d63384;
}

/* 周统计图表 */
.weekly-stats {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.weekly-stats h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-legend {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.work {
  background: #667eea;
}

.legend-color.learning {
  background: #4facfe;
}

.legend-color.break {
  background: #43e97b;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: end;
  height: 200px;
  padding: 0 20px;
}

.day-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  height: 160px;
  position: relative;
}

.bar-segment {
  width: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar-segment.work {
  background: #667eea;
}

.bar-segment.learning {
  background: #4facfe;
}

.bar-segment.break {
  background: #43e97b;
}

.bar-segment:hover {
  opacity: 0.8;
}

.day-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 模态框样式 */
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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
  font-size: 20px;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #32CD32;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.tag-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.tag-input {
  flex: 1;
}

.add-tag-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #32CD32;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-tag-btn:hover {
  background: #28a745;
}

.selected-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #32CD32;
  background: #f0f8f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.remove-tag-btn {
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.remove-tag-btn:hover {
  background: #e9ecef;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px 24px 24px;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #495057;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.save-btn {
  background: linear-gradient(135deg, #90EE90, #32CD32);
  color: white;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .work-log {
    padding: 16px;
  }
  
  .log-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-left {
    flex-direction: column;
    gap: 12px;
  }
  
  .daily-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline-container {
    height: 300px;
  }
  
  .log-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .log-time {
    align-self: flex-start;
  }
  
  .chart-bars {
    padding: 0 10px;
  }
  
  .bar-container {
    width: 30px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* 图标样式 */
.icon-prev::before { content: "◀"; }
.icon-next::before { content: "▶"; }
.icon-export::before { content: "📤"; }
.icon-plus::before { content: "➕"; }
.icon-work::before { content: "💼"; }
.icon-tasks::before { content: "✅"; }
.icon-efficiency::before { content: "📊"; }
.icon-focus::before { content: "🎯"; }
.icon-edit::before { content: "✏️"; }
.icon-copy::before { content: "📋"; }
.icon-delete::before { content: "🗑️"; }
.icon-close::before { content: "✕"; }
</style>