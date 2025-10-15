<template>
  <div class="dashboard">
    <!-- 数据统计卡片区域 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="icon-tasks"></i>
        </div>
        <div class="stat-content">
          <h3>{{ todayTasks }}</h3>
          <p>今日任务</p>
          <span class="stat-change positive">+{{ taskIncrease }}%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="icon-completed"></i>
        </div>
        <div class="stat-content">
          <h3>{{ completedTasks }}</h3>
          <p>已完成</p>
          <span class="stat-change positive">+{{ completionRate }}%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="icon-time"></i>
        </div>
        <div class="stat-content">
          <h3>{{ workHours }}h</h3>
          <p>工作时长</p>
          <span class="stat-change">{{ workTimeChange }}%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="icon-efficiency"></i>
        </div>
        <div class="stat-content">
          <h3>{{ efficiency }}%</h3>
          <p>工作效率</p>
          <span class="stat-change positive">+{{ efficiencyChange }}%</span>
        </div>
      </div>
    </div>

    <!-- 今日任务概览 -->
    <div class="today-tasks">
      <div class="section-header">
        <h3>今日任务</h3>
        <button class="view-all-btn" @click="viewAllTasks">查看全部</button>
      </div>
      <div class="task-list">
        <div 
          v-for="task in todayTaskList" 
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <div class="task-checkbox" @click="toggleTask(task)">
            <i v-if="task.completed" class="icon-check"></i>
          </div>
          <div class="task-content">
            <h4>{{ task.title }}</h4>
            <p>{{ task.description }}</p>
            <div class="task-meta">
              <span class="task-priority" :class="task.priority">{{ getPriorityText(task.priority) }}</span>
              <span class="task-time">{{ task.estimatedTime }}分钟</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="task-action-btn" @click="editTask(task)">
              <i class="icon-edit"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 工作进度图表 -->
    <div class="progress-charts">
      <div class="chart-container">
        <h3>本周工作进度</h3>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: weekProgress + '%' }"></div>
        </div>
        <p>{{ weekProgress }}% 完成</p>
      </div>
      
      <div class="chart-container">
        <h3>任务分布</h3>
        <div class="task-distribution">
          <div class="distribution-item">
            <span class="color-indicator high"></span>
            <span>高优先级 {{ highPriorityCount }}</span>
          </div>
          <div class="distribution-item">
            <span class="color-indicator medium"></span>
            <span>中优先级 {{ mediumPriorityCount }}</span>
          </div>
          <div class="distribution-item">
            <span class="color-indicator low"></span>
            <span>低优先级 {{ lowPriorityCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activities">
      <h3>最近活动</h3>
      <div class="activity-list">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-content">
            <p>{{ activity.description }}</p>
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      todayTasks: 12,
      completedTasks: 8,
      workHours: 6.5,
      efficiency: 85,
      taskIncrease: 15,
      completionRate: 67,
      workTimeChange: -5,
      efficiencyChange: 12,
      weekProgress: 72,
      highPriorityCount: 3,
      mediumPriorityCount: 5,
      lowPriorityCount: 4,
      todayTaskList: [
        {
          id: 1,
          title: '完成项目需求分析',
          description: '整理客户需求，制定开发计划',
          priority: 'high',
          estimatedTime: 120,
          completed: false
        },
        {
          id: 2,
          title: '代码审查',
          description: '审查团队成员提交的代码',
          priority: 'medium',
          estimatedTime: 60,
          completed: true
        },
        {
          id: 3,
          title: '会议准备',
          description: '准备下午的项目讨论会议',
          priority: 'high',
          estimatedTime: 30,
          completed: false
        },
        {
          id: 4,
          title: '文档更新',
          description: '更新API文档',
          priority: 'low',
          estimatedTime: 45,
          completed: false
        }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'task',
          description: '完成了"数据库设计"任务',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 2,
          type: 'record',
          description: '添加了工作记录"前端开发"',
          timestamp: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          id: 3,
          type: 'project',
          description: '创建了新项目"移动端应用"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]
    }
  },
  methods: {
    viewAllTasks() {
      this.$emit('navigate', 'tasks');
    },
    toggleTask(task) {
      task.completed = !task.completed;
      // 更新统计数据
      if (task.completed) {
        this.completedTasks++;
      } else {
        this.completedTasks--;
      }
    },
    editTask(task) {
      console.log('编辑任务:', task);
    },
    getPriorityText(priority) {
      const priorityMap = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
      };
      return priorityMap[priority] || '普通';
    },
    getActivityIcon(type) {
      const iconMap = {
        task: 'icon-check',
        record: 'icon-record',
        project: 'icon-project'
      };
      return iconMap[type] || 'icon-activity';
    },
    formatTime(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        return timestamp.toLocaleDateString();
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 数据统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #90EE90, #32CD32);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.stat-content p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.stat-change {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f5f5f5;
  color: #666;
}

.stat-change.positive {
  background: #e8f5e8;
  color: #32CD32;
}

/* 今日任务 */
.today-tasks {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.view-all-btn {
  background: none;
  border: none;
  color: #32CD32;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.view-all-btn:hover {
  background: #f0f8f0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.task-item:hover {
  border-color: #90EE90;
  background: #f8fff8;
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.completed .task-content h4 {
  text-decoration: line-through;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-checkbox:hover {
  border-color: #32CD32;
}

.task-item.completed .task-checkbox {
  background: #32CD32;
  border-color: #32CD32;
  color: white;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
}

.task-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.task-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.task-priority {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.task-priority.high {
  background: #ffe6e6;
  color: #d63384;
}

.task-priority.medium {
  background: #fff3cd;
  color: #f57c00;
}

.task-priority.low {
  background: #e2e3e5;
  color: #6c757d;
}

.task-time {
  font-size: 12px;
  color: #666;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-action-btn {
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

.task-action-btn:hover {
  background: #e9ecef;
}

/* 工作进度图表 */
.progress-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.chart-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-container h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #90EE90, #32CD32);
  transition: width 0.3s ease;
}

.task-distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.color-indicator.high {
  background: #d63384;
}

.color-indicator.medium {
  background: #f57c00;
}

.color-indicator.low {
  background: #6c757d;
}

/* 最近活动 */
.recent-activities {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.recent-activities h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
}

.activity-icon.task {
  background: #32CD32;
}

.activity-icon.record {
  background: #17a2b8;
}

.activity-icon.project {
  background: #6f42c1;
}

.activity-content p {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #1a1a1a;
}

.activity-time {
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .progress-charts {
    grid-template-columns: 1fr;
  }
}

/* 图标样式 */
.icon-tasks::before { content: "📋"; }
.icon-completed::before { content: "✅"; }
.icon-time::before { content: "⏰"; }
.icon-efficiency::before { content: "📈"; }
.icon-plus::before { content: "➕"; }
.icon-timer::before { content: "⏲️"; }
.icon-record::before { content: "📝"; }
.icon-project::before { content: "📁"; }
.icon-check::before { content: "✓"; }
.icon-edit::before { content: "✏️"; }
.icon-activity::before { content: "🔔"; }
</style>