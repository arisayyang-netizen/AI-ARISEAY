<template>
  <div class="task-management">
    <!-- 顶部操作栏 -->
    <div class="task-header">
      <div class="header-left">
        <h2>任务管理</h2>
        <div class="task-stats">
          <span class="stat-item">总计 {{ totalTasks }}</span>
          <span class="stat-item">进行中 {{ activeTasks }}</span>
          <span class="stat-item">已完成 {{ completedTasksCount }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: currentView === 'list' }"
            @click="currentView = 'list'"
          >
            <i class="icon-list"></i>
            列表视图
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: currentView === 'board' }"
            @click="currentView = 'board'"
          >
            <i class="icon-board"></i>
            看板视图
          </button>
        </div>
        <button class="create-task-btn" @click="showCreateModal = true">
          <i class="icon-plus"></i>
          新建任务
        </button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="task-filters">
      <div class="search-box">
        <i class="icon-search"></i>
        <input 
          type="text" 
          placeholder="搜索任务..." 
          v-model="searchQuery"
          @input="filterTasks"
        >
      </div>
      <div class="filter-buttons">
        <select v-model="selectedPriority" @change="filterTasks">
          <option value="">所有优先级</option>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
        <select v-model="selectedStatus" @change="filterTasks">
          <option value="">所有状态</option>
          <option value="pending">待开始</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
        <select v-model="selectedCategory" @change="filterTasks">
          <option value="">所有分类</option>
          <option value="work">工作</option>
          <option value="personal">个人</option>
          <option value="learning">学习</option>
          <option value="project">项目</option>
        </select>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-if="currentView === 'list'" class="list-view">
      <div class="task-list">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="task-item"
          :class="{ completed: task.status === 'completed' }"
        >
          <div class="task-checkbox" @click="toggleTaskStatus(task)">
            <i v-if="task.status === 'completed'" class="icon-check"></i>
          </div>
          
          <div class="task-main">
            <div class="task-title-row">
              <h3 class="task-title">{{ task.title }}</h3>
              <div class="task-badges">
                <span class="priority-badge" :class="task.priority">
                  {{ getPriorityText(task.priority) }}
                </span>
                <span class="category-badge" :class="task.category">
                  {{ getCategoryText(task.category) }}
                </span>
              </div>
            </div>
            
            <p class="task-description">{{ task.description }}</p>
            
            <div class="task-meta">
              <div class="meta-left">
                <span class="due-date">
                  <i class="icon-calendar"></i>
                  {{ formatDate(task.dueDate) }}
                </span>
                <span class="estimated-time">
                  <i class="icon-clock"></i>
                  {{ task.estimatedTime }}分钟
                </span>
                <span v-if="task.assignee" class="assignee">
                  <i class="icon-user"></i>
                  {{ task.assignee }}
                </span>
              </div>
              <div class="meta-right">
                <div class="task-progress" v-if="task.subtasks && task.subtasks.length > 0">
                  <span class="progress-text">
                    {{ getCompletedSubtasks(task) }}/{{ task.subtasks.length }}
                  </span>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: getSubtaskProgress(task) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 子任务 -->
            <div v-if="task.subtasks && task.subtasks.length > 0" class="subtasks">
              <div 
                v-for="subtask in task.subtasks" 
                :key="subtask.id"
                class="subtask-item"
                :class="{ completed: subtask.completed }"
              >
                <div class="subtask-checkbox" @click="toggleSubtask(task, subtask)">
                  <i v-if="subtask.completed" class="icon-check"></i>
                </div>
                <span class="subtask-title">{{ subtask.title }}</span>
              </div>
            </div>
          </div>
          
          <div class="task-actions">
            <button class="action-btn" @click="editTask(task)" title="编辑">
              <i class="icon-edit"></i>
            </button>
            <button class="action-btn" @click="duplicateTask(task)" title="复制">
              <i class="icon-copy"></i>
            </button>
            <button class="action-btn delete" @click="deleteTask(task)" title="删除">
              <i class="icon-delete"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 看板视图 -->
    <div v-if="currentView === 'board'" class="board-view">
      <div class="board-columns">
        <div class="board-column" v-for="status in taskStatuses" :key="status.key">
          <div class="column-header">
            <h3>{{ status.label }}</h3>
            <span class="task-count">{{ getTasksByStatus(status.key).length }}</span>
          </div>
          <div class="column-content">
            <div 
              v-for="task in getTasksByStatus(status.key)" 
              :key="task.id"
              class="board-task-card"
              draggable="true"
              @dragstart="onDragStart(task)"
              @dragover.prevent
              @drop="onDrop(status.key, $event)"
            >
              <div class="card-header">
                <h4>{{ task.title }}</h4>
                <span class="priority-dot" :class="task.priority"></span>
              </div>
              <p class="card-description">{{ task.description }}</p>
              <div class="card-footer">
                <div class="card-meta">
                  <span class="due-date">
                    <i class="icon-calendar"></i>
                    {{ formatDate(task.dueDate) }}
                  </span>
                  <span class="estimated-time">
                    <i class="icon-clock"></i>
                    {{ task.estimatedTime }}min
                  </span>
                </div>
                <div class="card-progress" v-if="task.subtasks && task.subtasks.length > 0">
                  <div class="progress-circle">
                    <span>{{ getSubtaskProgress(task) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建任务模态框 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingTask ? '编辑任务' : '新建任务' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>任务标题</label>
            <input 
              type="text" 
              v-model="taskForm.title" 
              placeholder="输入任务标题..."
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>任务描述</label>
            <textarea 
              v-model="taskForm.description" 
              placeholder="描述任务详情，支持AI智能解析..."
              class="form-textarea"
              rows="4"
            ></textarea>
            <button class="ai-parse-btn" @click="parseWithAI">
              <i class="icon-ai"></i>
              AI智能解析
            </button>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>优先级</label>
              <select v-model="taskForm.priority" class="form-select">
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>分类</label>
              <select v-model="taskForm.category" class="form-select">
                <option value="work">工作</option>
                <option value="personal">个人</option>
                <option value="learning">学习</option>
                <option value="project">项目</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>截止日期</label>
              <input 
                type="date" 
                v-model="taskForm.dueDate" 
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>预估时间（分钟）</label>
              <input 
                type="number" 
                v-model="taskForm.estimatedTime" 
                placeholder="60"
                class="form-input"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>负责人</label>
            <input 
              type="text" 
              v-model="taskForm.assignee" 
              placeholder="指定负责人..."
              class="form-input"
            >
          </div>
          
          <!-- 子任务 -->
          <div class="form-group">
            <label>子任务</label>
            <div class="subtask-creator">
              <div 
                v-for="(subtask, index) in taskForm.subtasks" 
                :key="index"
                class="subtask-input-row"
              >
                <input 
                  type="text" 
                  v-model="subtask.title" 
                  placeholder="子任务标题..."
                  class="form-input"
                >
                <button class="remove-subtask-btn" @click="removeSubtask(index)">
                  <i class="icon-minus"></i>
                </button>
              </div>
              <button class="add-subtask-btn" @click="addSubtask">
                <i class="icon-plus"></i>
                添加子任务
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveTask">
            {{ editingTask ? '更新任务' : '创建任务' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskManagement',
  data() {
    return {
      currentView: 'list',
      showCreateModal: false,
      editingTask: null,
      searchQuery: '',
      selectedPriority: '',
      selectedStatus: '',
      selectedCategory: '',
      draggedTask: null,
      taskStatuses: [
        { key: 'pending', label: '待开始' },
        { key: 'in_progress', label: '进行中' },
        { key: 'completed', label: '已完成' }
      ],
      tasks: [],
      filteredTasks: [],
      taskForm: {
        title: '',
        description: '',
        priority: 'medium',
        category: 'work',
        dueDate: '',
        estimatedTime: 60,
        assignee: '',
        subtasks: []
      }
    }
  },
  computed: {
    totalTasks() {
      return this.tasks.length;
    },
    activeTasks() {
      return this.tasks.filter(task => task.status !== 'completed').length;
    },
    completedTasksCount() {
      return this.tasks.filter(task => task.status === 'completed').length;
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      // 从本地存储加载任务
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          this.tasks = JSON.parse(savedTasks);
        } catch (error) {
          console.error('加载任务失败:', error);
          this.tasks = this.getDefaultTasks();
        }
      } else {
        this.tasks = this.getDefaultTasks();
      }
      this.filteredTasks = [...this.tasks];
    },

    saveTasks() {
      // 保存任务到本地存储
      try {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        console.log('任务已保存到本地存储');
      } catch (error) {
        console.error('保存任务失败:', error);
      }
    },

    getDefaultTasks() {
      // 返回默认任务数据
      return [
        {
          id: 1,
          title: '完成项目需求分析',
          description: '整理客户需求，制定项目计划和时间表',
          priority: 'high',
          category: 'work',
          status: 'in_progress',
          dueDate: '2024-01-20',
          estimatedTime: 120,
          assignee: '张三',
          subtasks: [
            { id: 1, title: '收集需求文档', completed: true },
            { id: 2, title: '分析技术可行性', completed: false },
            { id: 3, title: '制定项目计划', completed: false }
          ]
        },
        {
          id: 2,
          title: '优化数据库性能',
          description: '分析慢查询并进行优化',
          priority: 'high',
          category: 'project',
          status: 'in_progress',
          dueDate: '2024-01-22',
          estimatedTime: 90,
          assignee: '王五',
          subtasks: []
        }
      ];
    },
    filterTasks() {
      let filtered = [...this.tasks];
      
      // 搜索过滤
      if (this.searchQuery) {
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      // 优先级过滤
      if (this.selectedPriority) {
        filtered = filtered.filter(task => task.priority === this.selectedPriority);
      }
      
      // 状态过滤
      if (this.selectedStatus) {
        filtered = filtered.filter(task => task.status === this.selectedStatus);
      }
      
      // 分类过滤
      if (this.selectedCategory) {
        filtered = filtered.filter(task => task.category === this.selectedCategory);
      }
      
      this.filteredTasks = filtered;
    },
    
    getTasksByStatus(status) {
      return this.filteredTasks.filter(task => task.status === status);
    },
    
    toggleTaskStatus(task) {
      if (task.status === 'completed') {
        task.status = 'pending';
      } else {
        task.status = 'completed';
      }
      // 保存到本地存储
      this.saveTasks();
      this.filterTasks();
    },

    toggleSubtask(task, subtask) {
      subtask.completed = !subtask.completed;
      
      // 检查是否所有子任务都完成了
      const allCompleted = task.subtasks.every(st => st.completed);
      if (allCompleted && task.subtasks.length > 0) {
        task.status = 'completed';
      } else if (task.status === 'completed') {
        task.status = 'in_progress';
      }
      
      // 保存到本地存储
      this.saveTasks();
    },
    
    getCompletedSubtasks(task) {
      if (!task.subtasks) return 0;
      return task.subtasks.filter(st => st.completed).length;
    },
    
    getSubtaskProgress(task) {
      if (!task.subtasks || task.subtasks.length === 0) return 0;
      const completed = this.getCompletedSubtasks(task);
      return Math.round((completed / task.subtasks.length) * 100);
    },
    
    editTask(task) {
      this.editingTask = task;
      this.taskForm = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        estimatedTime: task.estimatedTime,
        assignee: task.assignee,
        subtasks: [...task.subtasks]
      };
      this.showCreateModal = true;
    },
    
    duplicateTask(task) {
      const newTask = {
        ...task,
        id: Date.now(),
        title: task.title + ' (副本)',
        status: 'pending',
        subtasks: task.subtasks.map(st => ({ ...st, completed: false }))
      };
      this.tasks.push(newTask);
      this.filterTasks();
    },
    
    deleteTask(task) {
      if (confirm('确定要删除这个任务吗？')) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index > -1) {
          this.tasks.splice(index, 1);
          this.filterTasks();
        }
      }
    },
    
    closeModal() {
      this.showCreateModal = false;
      this.editingTask = null;
      this.resetForm();
    },
    
    resetForm() {
      this.taskForm = {
        title: '',
        description: '',
        priority: 'medium',
        category: 'work',
        dueDate: '',
        estimatedTime: 60,
        assignee: '',
        subtasks: []
      };
    },
    
    addSubtask() {
      this.taskForm.subtasks.push({
        id: Date.now(),
        title: '',
        completed: false
      });
    },
    
    removeSubtask(index) {
      this.taskForm.subtasks.splice(index, 1);
    },
    
    parseWithAI() {
      // AI智能解析功能
      const description = this.taskForm.description;
      if (!description) {
        alert('请先输入任务描述');
        return;
      }
      
      console.log('AI正在解析任务描述...');
      
      // 1. 自动提取任务标题（如果标题为空）
      if (!this.taskForm.title.trim()) {
        const firstLine = description.split('\n')[0];
        const titleMatch = firstLine.match(/^(.{1,30})/);
        if (titleMatch) {
          this.taskForm.title = titleMatch[1].replace(/[：:。，,]$/, '').trim();
        }
      }
      
      // 2. 智能分析优先级
      const highPriorityKeywords = ['紧急', '重要', '急需', '立即', '马上', '尽快', '优先', '关键', '核心'];
      const lowPriorityKeywords = ['有空', '闲时', '可选', '建议', '考虑', '尝试'];
      
      if (highPriorityKeywords.some(keyword => description.includes(keyword))) {
        this.taskForm.priority = 'high';
      } else if (lowPriorityKeywords.some(keyword => description.includes(keyword))) {
        this.taskForm.priority = 'low';
      } else {
        this.taskForm.priority = 'medium';
      }
      
      // 3. 自动设置分类
      const categoryKeywords = {
        'work': ['工作', '项目', '会议', '报告', '客户', '业务', '销售', '市场', '运营'],
        'learning': ['学习', '研究', '阅读', '课程', '培训', '技能', '知识', '教程', '文档'],
        'personal': ['个人', '生活', '健康', '锻炼', '购物', '家庭', '朋友', '娱乐', '休息'],
        'project': ['开发', '设计', '编程', '代码', '测试', '部署', '功能', '需求', '架构']
      };
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => description.includes(keyword))) {
          this.taskForm.category = category;
          break;
        }
      }
      
      // 4. 提取截止日期
      const datePatterns = [
        /(\d{1,2})月(\d{1,2})日/,
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\d{1,2})\/(\d{1,2})/,
        /(今天|明天|后天)/,
        /(\d+)天(内|后)/,
        /(本周|下周|这周|下个月)/
      ];
      
      for (const pattern of datePatterns) {
        const match = description.match(pattern);
        if (match) {
          let dueDate = new Date();
          
          if (match[0].includes('月') && match[0].includes('日')) {
            const month = parseInt(match[1]) - 1;
            const day = parseInt(match[2]);
            dueDate = new Date(dueDate.getFullYear(), month, day);
          } else if (match[0].includes('-')) {
            dueDate = new Date(match[0]);
          } else if (match[0] === '今天') {
            // 保持当前日期
          } else if (match[0] === '明天') {
            dueDate.setDate(dueDate.getDate() + 1);
          } else if (match[0] === '后天') {
            dueDate.setDate(dueDate.getDate() + 2);
          } else if (match[0].includes('天内') || match[0].includes('天后')) {
            const days = parseInt(match[1]);
            dueDate.setDate(dueDate.getDate() + days);
          } else if (match[0].includes('本周') || match[0].includes('这周')) {
            dueDate.setDate(dueDate.getDate() + (7 - dueDate.getDay()));
          } else if (match[0].includes('下周')) {
            dueDate.setDate(dueDate.getDate() + (14 - dueDate.getDay()));
          } else if (match[0].includes('下个月')) {
            dueDate.setMonth(dueDate.getMonth() + 1);
          }
          
          this.taskForm.dueDate = dueDate.toISOString().split('T')[0];
          break;
        }
      }
      
      // 5. 估算完成时间
      const timeKeywords = {
        15: ['快速', '简单', '5分钟', '10分钟'],
        30: ['简短', '快', '半小时'],
        60: ['1小时', '一小时', '中等'],
        120: ['2小时', '两小时', '复杂'],
        240: ['半天', '4小时'],
        480: ['一天', '全天', '8小时']
      };
      
      for (const [time, keywords] of Object.entries(timeKeywords)) {
        if (keywords.some(keyword => description.includes(keyword))) {
          this.taskForm.estimatedTime = parseInt(time);
          break;
        }
      }
      
      // 根据描述长度和复杂度估算时间
      if (!this.taskForm.estimatedTime || this.taskForm.estimatedTime === 60) {
        const wordCount = description.length;
        const complexityKeywords = ['分析', '设计', '开发', '研究', '规划', '策略'];
        const isComplex = complexityKeywords.some(keyword => description.includes(keyword));
        
        if (wordCount < 50) {
          this.taskForm.estimatedTime = isComplex ? 60 : 30;
        } else if (wordCount < 150) {
          this.taskForm.estimatedTime = isComplex ? 120 : 60;
        } else {
          this.taskForm.estimatedTime = isComplex ? 240 : 120;
        }
      }
      
      // 6. 自动生成子任务
      const subtaskPatterns = [
        /\d+[\.、]\s*([^。\n]+)/g,
        /[①②③④⑤⑥⑦⑧⑨⑩]\s*([^。\n]+)/g,
        /[-*]\s*([^。\n]+)/g,
        /(第[一二三四五六七八九十]+步|步骤\d+)[：:]\s*([^。\n]+)/g
      ];
      
      let extractedSubtasks = [];
      
      for (const pattern of subtaskPatterns) {
        const matches = [...description.matchAll(pattern)];
        if (matches.length > 0) {
          extractedSubtasks = matches.map((match, index) => ({
            id: Date.now() + index,
            title: match[1] || match[2] || match[0],
            completed: false
          }));
          break;
        }
      }
      
      // 如果没有明确的步骤，尝试按句子分割生成子任务
      if (extractedSubtasks.length === 0) {
        const sentences = description.split(/[。！？\n]/).filter(s => s.trim().length > 5);
        if (sentences.length > 1 && sentences.length <= 6) {
          extractedSubtasks = sentences.map((sentence, index) => ({
            id: Date.now() + index,
            title: sentence.trim(),
            completed: false
          }));
        }
      }
      
      // 智能生成通用子任务
      if (extractedSubtasks.length === 0) {
        const taskType = this.taskForm.category;
        const commonSubtasks = {
          'work': ['需求分析', '制定计划', '执行任务', '质量检查', '总结汇报'],
          'learning': ['收集资料', '理论学习', '实践练习', '总结笔记', '知识应用'],
          'project': ['需求梳理', '技术调研', '方案设计', '开发实现', '测试验证'],
          'personal': ['准备工作', '开始执行', '过程监控', '完成确认']
        };
        
        const templates = commonSubtasks[taskType] || commonSubtasks['personal'];
        extractedSubtasks = templates.slice(0, 3).map((task, index) => ({
          id: Date.now() + index,
          title: task,
          completed: false
        }));
      }
      
      this.taskForm.subtasks = extractedSubtasks;
      
      // 7. 自动设置负责人（如果描述中提到）
      const assigneePattern = /(负责人|指派给|分配给|@)([^\s，,。]+)/;
      const assigneeMatch = description.match(assigneePattern);
      if (assigneeMatch) {
        this.taskForm.assignee = assigneeMatch[2];
      }
      
      // 显示解析结果提示
      this.$nextTick(() => {
        alert(`AI解析完成！\n已自动填充：\n- 任务标题\n- 优先级：${this.getPriorityText(this.taskForm.priority)}\n- 分类：${this.getCategoryText(this.taskForm.category)}\n- 预估时间：${this.taskForm.estimatedTime}分钟\n- 子任务：${this.taskForm.subtasks.length}个`);
      });
    },
    
    saveTask() {
      if (!this.taskForm.title.trim()) {
        alert('请输入任务标题');
        return;
      }
      
      if (this.editingTask) {
        // 更新现有任务
        Object.assign(this.editingTask, this.taskForm);
      } else {
        // 创建新任务
        const newTask = {
          ...this.taskForm,
          id: Date.now(),
          status: 'pending'
        };
        this.tasks.push(newTask);
      }
      
      // 保存到本地存储
      this.saveTasks();
      
      this.filterTasks();
      this.closeModal();
    },
    
    onDragStart(task) {
      this.draggedTask = task;
    },
    
    onDrop(status, event) {
      event.preventDefault();
      if (this.draggedTask) {
        this.draggedTask.status = status;
        this.draggedTask = null;
        this.filterTasks();
      }
    },
    
    getPriorityText(priority) {
      const map = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
      };
      return map[priority] || '普通';
    },
    
    getCategoryText(category) {
      const map = {
        work: '工作',
        personal: '个人',
        learning: '学习',
        project: '项目'
      };
      return map[category] || '其他';
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '明天';
      if (diffDays === -1) return '昨天';
      if (diffDays > 0) return `${diffDays}天后`;
      if (diffDays < 0) return `${Math.abs(diffDays)}天前`;
      
      return date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.task-management {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 顶部操作栏 */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-left h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.task-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 14px;
  color: #666;
  padding: 4px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.view-toggle {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: white;
  color: #32CD32;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.create-task-btn {
  display: flex;
  align-items: center;
  gap: 8px;
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

.create-task-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

/* 筛选和搜索 */
.task-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-buttons select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

/* 列表视图 */
.list-view {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-list {
  padding: 20px;
}

.task-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.task-item:hover {
  border-color: #90EE90;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.task-item.completed {
  opacity: 0.7;
  background: #f8f9fa;
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
  flex-shrink: 0;
  margin-top: 2px;
}

.task-checkbox:hover {
  border-color: #32CD32;
}

.task-item.completed .task-checkbox {
  background: #32CD32;
  border-color: #32CD32;
  color: white;
}

.task-main {
  flex: 1;
}

.task-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-badges {
  display: flex;
  gap: 8px;
}

.priority-badge, .category-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.priority-badge.high {
  background: #ffe6e6;
  color: #d63384;
}

.priority-badge.medium {
  background: #fff3cd;
  color: #f57c00;
}

.priority-badge.low {
  background: #e2e3e5;
  color: #6c757d;
}

.category-badge {
  background: #e8f5e8;
  color: #32CD32;
}

.task-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meta-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.meta-left span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #90EE90, #32CD32);
  transition: width 0.3s ease;
}

/* 子任务 */
.subtasks {
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid #e9ecef;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.subtask-item.completed .subtask-title {
  text-decoration: line-through;
  color: #666;
}

.subtask-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
}

.subtask-item.completed .subtask-checkbox {
  background: #32CD32;
  border-color: #32CD32;
  color: white;
}

.subtask-title {
  font-size: 13px;
  color: #495057;
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
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

/* 看板视图 */
.board-view {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.board-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.board-column {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.column-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.task-count {
  background: #32CD32;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.board-task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  cursor: grab;
  transition: all 0.2s ease;
}

.board-task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.board-task-card:active {
  cursor: grabbing;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.4;
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.priority-dot.high {
  background: #d63384;
}

.priority-dot.medium {
  background: #f57c00;
}

.priority-dot.low {
  background: #6c757d;
}

.card-description {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;
}

.progress-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #32CD32;
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
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ai-parse-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-parse-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.subtask-creator {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
}

.subtask-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.subtask-input-row .form-input {
  margin-bottom: 0;
}

.remove-subtask-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #ffe6e6;
  color: #d63384;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.add-subtask-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px dashed #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
}

.add-subtask-btn:hover {
  background: #e9ecef;
  border-color: #32CD32;
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
  .task-management {
    padding: 16px;
  }
  
  .task-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-right {
    justify-content: space-between;
  }
  
  .task-filters {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .board-columns {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .task-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .task-title-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 图标样式 */
.icon-list::before { content: "📋"; }
.icon-board::before { content: "📊"; }
.icon-plus::before { content: "➕"; }
.icon-search::before { content: "🔍"; }
.icon-check::before { content: "✓"; }
.icon-calendar::before { content: "📅"; }
.icon-clock::before { content: "🕐"; }
.icon-user::before { content: "👤"; }
.icon-edit::before { content: "✏️"; }
.icon-copy::before { content: "📋"; }
.icon-delete::before { content: "🗑️"; }
.icon-close::before { content: "✕"; }
.icon-ai::before { content: "🤖"; }
.icon-minus::before { content: "➖"; }
</style>