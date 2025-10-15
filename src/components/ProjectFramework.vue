<template>
  <div class="project-framework">
    <!-- 顶部操作栏 -->
    <div class="framework-header">
      <div class="header-left">
        <h2>项目框架</h2>
        <div class="framework-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'projects' }"
            @click="activeTab = 'projects'"
          >
            我的项目
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'templates' }"
            @click="activeTab = 'templates'"
          >
            模板库
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'generator' }"
            @click="activeTab = 'generator'"
          >
            代码生成
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'stacks' }"
            @click="activeTab = 'stacks'"
          >
            技术栈
          </button>
        </div>
      </div>
      <div class="header-right">
        <button class="import-btn" @click="importProject">
          <i class="icon-import"></i>
          导入项目
        </button>
        <button class="create-btn" @click="showCreateModal = true">
          <i class="icon-plus"></i>
          新建项目
        </button>
      </div>
    </div>

    <!-- 我的项目 -->
    <div v-if="activeTab === 'projects'" class="projects-section">
      <div class="projects-filters">
        <div class="filter-group">
          <select v-model="projectFilter.status" class="filter-select">
            <option value="">全部状态</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
            <option value="paused">已暂停</option>
            <option value="archived">已归档</option>
          </select>
          
          <select v-model="projectFilter.tech" class="filter-select">
            <option value="">全部技术栈</option>
            <option value="vue">Vue.js</option>
            <option value="react">React</option>
            <option value="angular">Angular</option>
            <option value="node">Node.js</option>
            <option value="python">Python</option>
          </select>
          
          <input 
            type="text" 
            v-model="projectFilter.search" 
            placeholder="搜索项目..."
            class="search-input"
          >
        </div>
        
        <div class="view-options">
          <button 
            class="view-btn" 
            :class="{ active: projectView === 'grid' }"
            @click="projectView = 'grid'"
            title="网格视图"
          >
            <i class="icon-grid"></i>
          </button>
          <button 
            class="view-btn" 
            :class="{ active: projectView === 'list' }"
            @click="projectView = 'list'"
            title="列表视图"
          >
            <i class="icon-list"></i>
          </button>
        </div>
      </div>

      <!-- 项目网格视图 -->
      <div v-if="projectView === 'grid'" class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          :class="project.status"
          @click="openProject(project)"
        >
          <div class="project-header">
            <div class="project-icon" :style="{ background: project.color }">
              <i :class="project.icon"></i>
            </div>
            <div class="project-actions">
              <button class="action-btn" @click.stop="favoriteProject(project)" title="收藏">
                <i :class="project.favorite ? 'icon-star-filled' : 'icon-star'"></i>
              </button>
              <button class="action-btn" @click.stop="showProjectMenu(project)" title="更多">
                <i class="icon-more"></i>
              </button>
            </div>
          </div>
          
          <div class="project-content">
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
            
            <div class="project-meta">
              <div class="tech-stack">
                <span 
                  v-for="tech in project.techStack" 
                  :key="tech"
                  class="tech-tag"
                  :class="tech"
                >
                  {{ getTechName(tech) }}
                </span>
              </div>
              
              <div class="project-stats">
                <span class="stat">
                  <i class="icon-files"></i>
                  {{ project.fileCount }} 文件
                </span>
                <span class="stat">
                  <i class="icon-commits"></i>
                  {{ project.commits }} 提交
                </span>
              </div>
            </div>
          </div>
          
          <div class="project-footer">
            <div class="project-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: project.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ project.progress }}%</span>
            </div>
            
            <div class="project-date">
              <span>{{ formatDate(project.lastModified) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目列表视图 -->
      <div v-if="projectView === 'list'" class="projects-list">
        <div class="list-header">
          <div class="col-name">项目名称</div>
          <div class="col-status">状态</div>
          <div class="col-tech">技术栈</div>
          <div class="col-progress">进度</div>
          <div class="col-date">最后修改</div>
          <div class="col-actions">操作</div>
        </div>
        
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="list-item"
          @click="openProject(project)"
        >
          <div class="col-name">
            <div class="project-info">
              <div class="project-icon small" :style="{ background: project.color }">
                <i :class="project.icon"></i>
              </div>
              <div>
                <h4>{{ project.name }}</h4>
                <p>{{ project.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="col-status">
            <span class="status-badge" :class="project.status">
              {{ getStatusText(project.status) }}
            </span>
          </div>
          
          <div class="col-tech">
            <div class="tech-list">
              <span 
                v-for="tech in project.techStack.slice(0, 3)" 
                :key="tech"
                class="tech-tag small"
                :class="tech"
              >
                {{ getTechName(tech) }}
              </span>
              <span v-if="project.techStack.length > 3" class="tech-more">
                +{{ project.techStack.length - 3 }}
              </span>
            </div>
          </div>
          
          <div class="col-progress">
            <div class="progress-container">
              <div class="progress-bar small">
                <div 
                  class="progress-fill" 
                  :style="{ width: project.progress + '%' }"
                ></div>
              </div>
              <span>{{ project.progress }}%</span>
            </div>
          </div>
          
          <div class="col-date">
            {{ formatDate(project.lastModified) }}
          </div>
          
          <div class="col-actions">
            <button class="action-btn" @click.stop="favoriteProject(project)">
              <i :class="project.favorite ? 'icon-star-filled' : 'icon-star'"></i>
            </button>
            <button class="action-btn" @click.stop="showProjectMenu(project)">
              <i class="icon-more"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板库 -->
    <div v-if="activeTab === 'templates'" class="templates-section">
      <div class="templates-categories">
        <button 
          v-for="category in templateCategories" 
          :key="category.id"
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="selectedCategory = category.id"
        >
          <i :class="category.icon"></i>
          {{ category.name }}
          <span class="count">{{ category.count }}</span>
        </button>
      </div>

      <div class="templates-grid">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          @click="useTemplate(template)"
        >
          <div class="template-preview">
            <img :src="template.preview" :alt="template.name" />
            <div class="template-overlay">
              <button class="preview-btn">
                <i class="icon-eye"></i>
                预览
              </button>
              <button class="use-btn">
                <i class="icon-download"></i>
                使用模板
              </button>
            </div>
          </div>
          
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            
            <div class="template-meta">
              <div class="template-tags">
                <span 
                  v-for="tag in template.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              
              <div class="template-stats">
                <span class="stat">
                  <i class="icon-download"></i>
                  {{ template.downloads }}
                </span>
                <span class="stat">
                  <i class="icon-star"></i>
                  {{ template.rating }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 代码生成器 -->
    <div v-if="activeTab === 'generator'" class="generator-section">
      <div class="generator-steps">
        <div class="step" :class="{ active: generatorStep === 1, completed: generatorStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>选择类型</h3>
            <p>选择要生成的代码类型</p>
          </div>
        </div>
        
        <div class="step" :class="{ active: generatorStep === 2, completed: generatorStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>配置参数</h3>
            <p>设置生成参数和选项</p>
          </div>
        </div>
        
        <div class="step" :class="{ active: generatorStep === 3, completed: generatorStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>生成代码</h3>
            <p>预览和下载生成的代码</p>
          </div>
        </div>
      </div>

      <!-- 步骤1: 选择类型 -->
      <div v-if="generatorStep === 1" class="generator-types">
        <div 
          v-for="type in generatorTypes" 
          :key="type.id"
          class="generator-type"
          :class="{ selected: selectedGeneratorType === type.id }"
          @click="selectGeneratorType(type.id)"
        >
          <div class="type-icon">
            <i :class="type.icon"></i>
          </div>
          <h3>{{ type.name }}</h3>
          <p>{{ type.description }}</p>
          <div class="type-features">
            <span 
              v-for="feature in type.features" 
              :key="feature"
              class="feature"
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>

      <!-- 步骤2: 配置参数 -->
      <div v-if="generatorStep === 2" class="generator-config">
        <div class="config-form">
          <div class="form-section">
            <h3>基本配置</h3>
            <div class="form-group">
              <label>项目名称</label>
              <input 
                type="text" 
                v-model="generatorConfig.projectName" 
                placeholder="输入项目名称..."
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>包名/命名空间</label>
              <input 
                type="text" 
                v-model="generatorConfig.packageName" 
                placeholder="com.example.project"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>描述</label>
              <textarea 
                v-model="generatorConfig.description" 
                placeholder="项目描述..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="form-section">
            <h3>技术选项</h3>
            <div class="options-grid">
              <div 
                v-for="option in currentTypeOptions" 
                :key="option.id"
                class="option-item"
              >
                <label class="option-label">
                  <input 
                    type="checkbox" 
                    v-model="generatorConfig.options"
                    :value="option.id"
                  >
                  <span class="checkmark"></span>
                  <div class="option-content">
                    <h4>{{ option.name }}</h4>
                    <p>{{ option.description }}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="config-preview">
          <h3>配置预览</h3>
          <div class="preview-content">
            <pre>{{ JSON.stringify(generatorConfig, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- 步骤3: 生成代码 -->
      <div v-if="generatorStep === 3" class="generator-result">
        <div class="result-header">
          <h3>生成结果</h3>
          <div class="result-actions">
            <button class="download-btn" @click="downloadCode">
              <i class="icon-download"></i>
              下载代码
            </button>
            <button class="copy-btn" @click="copyCode">
              <i class="icon-copy"></i>
              复制代码
            </button>
          </div>
        </div>
        
        <div class="code-preview">
          <div class="file-tabs">
            <button 
              v-for="file in generatedFiles" 
              :key="file.name"
              class="file-tab"
              :class="{ active: activeFile === file.name }"
              @click="activeFile = file.name"
            >
              {{ file.name }}
            </button>
          </div>
          
          <div class="code-content">
            <pre><code>{{ getCurrentFileContent() }}</code></pre>
          </div>
        </div>
      </div>

      <!-- 生成器导航 -->
      <div class="generator-nav">
        <button 
          v-if="generatorStep > 1" 
          class="nav-btn prev"
          @click="generatorStep--"
        >
          <i class="icon-prev"></i>
          上一步
        </button>
        
        <button 
          v-if="generatorStep < 3" 
          class="nav-btn next"
          @click="nextGeneratorStep"
          :disabled="!canProceed"
        >
          下一步
          <i class="icon-next"></i>
        </button>
        
        <button 
          v-if="generatorStep === 3" 
          class="nav-btn generate"
          @click="generateCode"
        >
          <i class="icon-magic"></i>
          重新生成
        </button>
      </div>
    </div>

    <!-- 技术栈管理 -->
    <div v-if="activeTab === 'stacks'" class="stacks-section">
      <div class="stacks-header">
        <h3>技术栈管理</h3>
        <button class="add-stack-btn" @click="showAddStackModal = true">
          <i class="icon-plus"></i>
          添加技术栈
        </button>
      </div>

      <div class="stacks-grid">
        <div 
          v-for="stack in techStacks" 
          :key="stack.id"
          class="stack-card"
        >
          <div class="stack-header">
            <div class="stack-icon">
              <i :class="stack.icon"></i>
            </div>
            <div class="stack-info">
              <h3>{{ stack.name }}</h3>
              <p>{{ stack.description }}</p>
            </div>
            <div class="stack-actions">
              <button class="action-btn" @click="editStack(stack)">
                <i class="icon-edit"></i>
              </button>
              <button class="action-btn" @click="deleteStack(stack)">
                <i class="icon-delete"></i>
              </button>
            </div>
          </div>
          
          <div class="stack-technologies">
            <h4>包含技术</h4>
            <div class="tech-list">
              <span 
                v-for="tech in stack.technologies" 
                :key="tech.name"
                class="tech-item"
              >
                <img :src="tech.icon" :alt="tech.name" />
                {{ tech.name }}
                <span class="version">{{ tech.version }}</span>
              </span>
            </div>
          </div>
          
          <div class="stack-stats">
            <div class="stat">
              <span class="label">项目数量</span>
              <span class="value">{{ stack.projectCount }}</span>
            </div>
            <div class="stat">
              <span class="label">最后使用</span>
              <span class="value">{{ formatDate(stack.lastUsed) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建项目模态框 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>新建项目</h3>
          <button class="close-btn" @click="closeCreateModal">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="create-tabs">
            <button 
              class="create-tab" 
              :class="{ active: createMode === 'blank' }"
              @click="createMode = 'blank'"
            >
              空白项目
            </button>
            <button 
              class="create-tab" 
              :class="{ active: createMode === 'template' }"
              @click="createMode = 'template'"
            >
              从模板创建
            </button>
            <button 
              class="create-tab" 
              :class="{ active: createMode === 'import' }"
              @click="createMode = 'import'"
            >
              导入现有项目
            </button>
          </div>
          
          <div class="create-content">
            <!-- 空白项目 -->
            <div v-if="createMode === 'blank'" class="blank-project">
              <div class="form-group">
                <label>项目名称</label>
                <input 
                  type="text" 
                  v-model="newProject.name" 
                  placeholder="输入项目名称..."
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>项目描述</label>
                <textarea 
                  v-model="newProject.description" 
                  placeholder="描述项目的目标和功能..."
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>技术栈</label>
                <div class="tech-selector">
                  <div 
                    v-for="tech in availableTechs" 
                    :key="tech.id"
                    class="tech-option"
                    :class="{ selected: newProject.techStack.includes(tech.id) }"
                    @click="toggleTech(tech.id)"
                  >
                    <i :class="tech.icon"></i>
                    <span>{{ tech.name }}</span>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>项目路径</label>
                <div class="path-input">
                  <input 
                    type="text" 
                    v-model="newProject.path" 
                    placeholder="选择项目保存路径..."
                    class="form-input"
                    readonly
                  >
                  <button class="browse-btn" @click="browsePath">
                    <i class="icon-folder"></i>
                    浏览
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeCreateModal">取消</button>
          <button class="create-project-btn" @click="createProject">
            <i class="icon-plus"></i>
            创建项目
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectFramework',
  data() {
    return {
      activeTab: 'projects',
      projectView: 'grid',
      projectFilter: {
        status: '',
        tech: '',
        search: ''
      },
      selectedCategory: 'all',
      generatorStep: 1,
      selectedGeneratorType: null,
      activeFile: '',
      showCreateModal: false,
      showAddStackModal: false,
      createMode: 'blank',
      
      projects: [],
      
      templateCategories: [
        { id: 'all', name: '全部', icon: 'icon-all', count: 24 },
        { id: 'web', name: 'Web应用', icon: 'icon-web', count: 12 },
        { id: 'mobile', name: '移动应用', icon: 'icon-mobile', count: 6 },
        { id: 'desktop', name: '桌面应用', icon: 'icon-desktop', count: 4 },
        { id: 'api', name: 'API服务', icon: 'icon-api', count: 2 }
      ],
      
      templates: [
        {
          id: 1,
          name: 'Vue Admin Dashboard',
          description: '现代化的Vue.js管理后台模板',
          category: 'web',
          preview: '/templates/vue-admin.jpg',
          tags: ['Vue.js', 'Element UI', 'TypeScript'],
          downloads: 1234,
          rating: 4.8
        },
        {
          id: 2,
          name: 'React E-commerce',
          description: 'React电商网站完整模板',
          category: 'web',
          preview: '/templates/react-ecommerce.jpg',
          tags: ['React', 'Redux', 'Styled Components'],
          downloads: 856,
          rating: 4.6
        }
      ],
      
      generatorTypes: [
        {
          id: 'crud',
          name: 'CRUD生成器',
          description: '快速生成增删改查功能代码',
          icon: 'icon-crud',
          features: ['数据模型', 'API接口', '前端页面', '表单验证']
        },
        {
          id: 'api',
          name: 'API生成器',
          description: '生成RESTful API服务代码',
          icon: 'icon-api',
          features: ['路由定义', '控制器', '中间件', 'API文档']
        },
        {
          id: 'component',
          name: '组件生成器',
          description: '生成可复用的UI组件',
          icon: 'icon-component',
          features: ['组件模板', '样式文件', '测试用例', '文档说明']
        }
      ],
      
      generatorConfig: {
        projectName: '',
        packageName: '',
        description: '',
        options: []
      },
      
      generatedFiles: [
        { name: 'App.vue', content: '<template>\n  <div id="app">\n    <!-- 应用内容 -->\n  </div>\n</template>' },
        { name: 'main.js', content: 'import { createApp } from "vue"\nimport App from "./App.vue"\n\ncreateApp(App).mount("#app")' }
      ],
      
      techStacks: [
        {
          id: 1,
          name: 'Vue.js 全栈',
          description: '基于Vue.js的现代化Web开发技术栈',
          icon: 'icon-vue',
          technologies: [
            { name: 'Vue.js', version: '3.x', icon: '/icons/vue.svg' },
            { name: 'Vite', version: '4.x', icon: '/icons/vite.svg' },
            { name: 'TypeScript', version: '5.x', icon: '/icons/typescript.svg' },
            { name: 'Node.js', version: '18.x', icon: '/icons/nodejs.svg' }
          ],
          projectCount: 5,
          lastUsed: '2024-01-15'
        }
      ],
      
      newProject: {
        name: '',
        description: '',
        techStack: [],
        path: ''
      },
      
      availableTechs: [
        { id: 'vue', name: 'Vue.js', icon: 'icon-vue' },
        { id: 'react', name: 'React', icon: 'icon-react' },
        { id: 'angular', name: 'Angular', icon: 'icon-angular' },
        { id: 'node', name: 'Node.js', icon: 'icon-node' },
        { id: 'python', name: 'Python', icon: 'icon-python' },
        { id: 'java', name: 'Java', icon: 'icon-java' }
      ]
    }
  },
  
  computed: {
    filteredProjects() {
      return this.projects.filter(project => {
        const matchesStatus = !this.projectFilter.status || project.status === this.projectFilter.status;
        const matchesTech = !this.projectFilter.tech || project.techStack.includes(this.projectFilter.tech);
        const matchesSearch = !this.projectFilter.search || 
          project.name.toLowerCase().includes(this.projectFilter.search.toLowerCase()) ||
          project.description.toLowerCase().includes(this.projectFilter.search.toLowerCase());
        
        return matchesStatus && matchesTech && matchesSearch;
      });
    },
    
    filteredTemplates() {
      if (this.selectedCategory === 'all') {
        return this.templates;
      }
      return this.templates.filter(template => template.category === this.selectedCategory);
    },
    
    currentTypeOptions() {
      const optionsMap = {
        crud: [
          { id: 'auth', name: '用户认证', description: '包含登录注册功能' },
          { id: 'validation', name: '数据验证', description: '表单数据验证' },
          { id: 'pagination', name: '分页功能', description: '数据分页显示' },
          { id: 'search', name: '搜索功能', description: '数据搜索过滤' }
        ],
        api: [
          { id: 'swagger', name: 'Swagger文档', description: '自动生成API文档' },
          { id: 'auth', name: 'JWT认证', description: 'JWT身份验证' },
          { id: 'cors', name: 'CORS支持', description: '跨域资源共享' },
          { id: 'rate-limit', name: '限流控制', description: 'API访问限流' }
        ],
        component: [
          { id: 'typescript', name: 'TypeScript', description: '使用TypeScript' },
          { id: 'tests', name: '单元测试', description: '包含测试用例' },
          { id: 'storybook', name: 'Storybook', description: '组件文档' },
          { id: 'props', name: '属性验证', description: 'Props类型验证' }
        ]
      };
      
      return optionsMap[this.selectedGeneratorType] || [];
    },
    
    canProceed() {
      if (this.generatorStep === 1) {
        return this.selectedGeneratorType !== null;
      }
      if (this.generatorStep === 2) {
        return this.generatorConfig.projectName.trim() !== '';
      }
      return true;
    }
  },
  
  mounted() {
    this.loadProjects();
  },
  
  methods: {
    loadProjects() {
      // 从本地存储加载项目
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          this.projects = JSON.parse(savedProjects);
        } catch (error) {
          console.error('加载项目失败:', error);
          this.projects = this.getDefaultProjects();
        }
      } else {
        this.projects = this.getDefaultProjects();
      }
    },

    saveProjects() {
      // 保存项目到本地存储
      try {
        localStorage.setItem('projects', JSON.stringify(this.projects));
        console.log('项目已保存到本地存储');
      } catch (error) {
        console.error('保存项目失败:', error);
      }
    },

    getDefaultProjects() {
      // 返回默认项目数据
      return [
        {
          id: 1,
          name: '运营效率管家',
          description: 'Vue.js个人效率管理系统',
          status: 'active',
          color: '#667eea',
          icon: 'icon-vue',
          techStack: ['vue', 'node', 'mysql'],
          progress: 75,
          fileCount: 156,
          commits: 89,
          lastModified: '2024-01-15',
          favorite: true
        },
        {
          id: 2,
          name: '移动端App',
          description: 'React Native跨平台移动应用',
          status: 'active',
          color: '#f093fb',
          icon: 'icon-react',
          techStack: ['react', 'node', 'mongodb'],
          progress: 45,
          fileCount: 89,
          commits: 34,
          lastModified: '2024-01-14',
          favorite: false
        },
        {
          id: 3,
          name: '数据分析平台',
          description: 'Python数据分析和可视化平台',
          status: 'completed',
          color: '#4facfe',
          icon: 'icon-python',
          techStack: ['python', 'django', 'postgresql'],
          progress: 100,
          fileCount: 234,
          commits: 156,
          lastModified: '2024-01-10',
          favorite: true
        }
      ];
    },

    openProject(project) {
      console.log('打开项目:', project.name);
      // 这里可以实现项目打开逻辑
    },
    
    favoriteProject(project) {
      project.favorite = !project.favorite;
    },
    
    showProjectMenu(project) {
      console.log('显示项目菜单:', project.name);
      // 这里可以实现项目菜单逻辑
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
      return date.toLocaleDateString('zh-CN');
    },
    
    getTechName(techId) {
      const techMap = {
        vue: 'Vue.js',
        react: 'React',
        angular: 'Angular',
        node: 'Node.js',
        python: 'Python',
        mysql: 'MySQL',
        mongodb: 'MongoDB',
        postgresql: 'PostgreSQL',
        django: 'Django'
      };
      return techMap[techId] || techId;
    },
    
    getStatusText(status) {
      const statusMap = {
        active: '进行中',
        completed: '已完成',
        paused: '已暂停',
        archived: '已归档'
      };
      return statusMap[status] || status;
    },
    
    useTemplate(template) {
      console.log('使用模板:', template.name);
      // 这里可以实现模板使用逻辑
    },
    
    selectGeneratorType(typeId) {
      this.selectedGeneratorType = typeId;
    },
    
    nextGeneratorStep() {
      if (this.canProceed && this.generatorStep < 3) {
        this.generatorStep++;
        if (this.generatorStep === 3) {
          this.generateCode();
        }
      }
    },
    
    generateCode() {
      console.log('生成代码:', this.generatorConfig);
      // 这里可以实现代码生成逻辑
      this.activeFile = this.generatedFiles[0].name;
    },
    
    getCurrentFileContent() {
      const file = this.generatedFiles.find(f => f.name === this.activeFile);
      return file ? file.content : '';
    },
    
    downloadCode() {
      console.log('下载代码');
      // 这里可以实现代码下载逻辑
    },
    
    copyCode() {
      const content = this.getCurrentFileContent();
      navigator.clipboard.writeText(content).then(() => {
        console.log('代码已复制到剪贴板');
      });
    },
    
    editStack(stack) {
      console.log('编辑技术栈:', stack.name);
      // 这里可以实现技术栈编辑逻辑
    },
    
    deleteStack(stack) {
      if (confirm(`确定要删除技术栈"${stack.name}"吗？`)) {
        const index = this.techStacks.findIndex(s => s.id === stack.id);
        if (index > -1) {
          this.techStacks.splice(index, 1);
        }
      }
    },
    
    importProject() {
      console.log('导入项目');
      // 这里可以实现项目导入逻辑
    },
    
    closeCreateModal() {
      this.showCreateModal = false;
      this.resetNewProject();
    },
    
    resetNewProject() {
      this.newProject = {
        name: '',
        description: '',
        techStack: [],
        path: ''
      };
      this.createMode = 'blank';
    },
    
    toggleTech(techId) {
      const index = this.newProject.techStack.indexOf(techId);
      if (index > -1) {
        this.newProject.techStack.splice(index, 1);
      } else {
        this.newProject.techStack.push(techId);
      }
    },
    
    browsePath() {
      console.log('浏览路径');
      // 这里可以实现路径选择逻辑
    },
    
    createProject() {
      if (!this.newProject.name.trim()) {
        alert('请输入项目名称');
        return;
      }
      
      // 创建新项目对象
      const project = {
        id: Date.now(),
        name: this.newProject.name,
        description: this.newProject.description,
        status: 'active',
        color: '#667eea',
        icon: 'icon-vue',
        techStack: this.newProject.techStack,
        progress: 0,
        fileCount: 0,
        commits: 0,
        lastModified: new Date().toISOString().split('T')[0],
        favorite: false
      };
      
      // 添加到项目列表
      this.projects.unshift(project);
      
      // 保存到本地存储
      this.saveProjects();
      
      console.log('项目创建成功:', project);
      
      this.closeCreateModal();
    },
  }
}
</script>

<style scoped>
.project-framework {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 顶部操作栏 */
.framework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.framework-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.tab-btn.active {
  background: white;
  color: #32CD32;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  gap: 12px;
}

.import-btn, .create-btn {
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

.import-btn {
  background: #f8f9fa;
  color: #495057;
}

.import-btn:hover {
  background: #e9ecef;
}

.create-btn {
  background: linear-gradient(135deg, #90EE90, #32CD32);
  color: white;
}

.create-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

/* 项目部分 */
.projects-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.projects-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select, .search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-input {
  width: 200px;
}

.view-options {
  display: flex;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 2px;
}

.view-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: white;
  color: #32CD32;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 项目网格 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: #90EE90;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-card.active {
  border-left: 4px solid #32CD32;
}

.project-card.completed {
  border-left: 4px solid #28a745;
}

.project-card.paused {
  border-left: 4px solid #ffc107;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.project-icon.small {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.project-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.project-card:hover .action-btn {
  opacity: 1;
}

.action-btn:hover {
  background: #e9ecef;
}

.project-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.project-content p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.project-meta {
  margin-bottom: 16px;
}

.tech-stack {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tech-tag {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.tech-tag.small {
  font-size: 11px;
  padding: 1px 4px;
}

.tech-tag.vue {
  background: #e8f5e8;
  color: #4caf50;
}

.tech-tag.react {
  background: #e3f2fd;
  color: #2196f3;
}

.tech-tag.node {
  background: #f3e5f5;
  color: #9c27b0;
}

.tech-tag.python {
  background: #fff3e0;
  color: #ff9800;
}

.project-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar.small {
  height: 4px;
  max-width: 60px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #90EE90, #32CD32);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.project-date {
  font-size: 12px;
  color: #999;
}

/* 项目列表 */
.projects-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 0.5fr;
  gap: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 0.5fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.list-item:hover {
  background: #f8fff8;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.project-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status-badge.active {
  background: #e8f5e8;
  color: #4caf50;
}

.status-badge.completed {
  background: #e3f2fd;
  color: #2196f3;
}

.status-badge.paused {
  background: #fff3e0;
  color: #ff9800;
}

.tech-list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tech-more {
  font-size: 11px;
  color: #666;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 模板库 */
.templates-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.templates-categories {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn.active {
  border-color: #32CD32;
  background: #f0f8f0;
  color: #32CD32;
}

.count {
  background: #e9ecef;
  color: #666;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}

.category-btn.active .count {
  background: #32CD32;
  color: white;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.template-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #90EE90;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.template-preview {
  position: relative;
  height: 160px;
  background: #f8f9fa;
  overflow: hidden;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.preview-btn, .use-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.use-btn {
  background: #32CD32;
  color: white;
}

.template-info {
  padding: 16px;
}

.template-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.template-info p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.template-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  padding: 2px 6px;
  background: #f0f8f0;
  color: #32CD32;
  border-radius: 4px;
}

.template-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

/* 代码生成器 */
.generator-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.generator-steps {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 2px;
  background: #e9ecef;
}

.step.completed::after {
  background: #32CD32;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.2s ease;
}

.step.active .step-number {
  background: #32CD32;
  color: white;
}

.step.completed .step-number {
  background: #28a745;
  color: white;
}

.step-content h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.step-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.generator-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.generator-type {
  padding: 24px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generator-type.selected {
  border-color: #32CD32;
  background: #f0f8f0;
}

.generator-type:hover {
  border-color: #90EE90;
}

.type-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #90EE90, #32CD32);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-bottom: 16px;
}

.generator-type h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.generator-type p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.type-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature {
  font-size: 12px;
  padding: 4px 8px;
  background: #e9ecef;
  color: #495057;
  border-radius: 4px;
}

.generator-type.selected .feature {
  background: #32CD32;
  color: white;
}

/* 配置表单 */
.generator-config {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  margin-bottom: 32px;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #32CD32;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.option-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.option-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-label:hover {
  background: #f8f9fa;
}

.option-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.option-label input[type="checkbox"]:checked + .checkmark {
  background: #32CD32;
  border-color: #32CD32;
}

.option-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.option-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.option-content p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.config-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
}

.config-preview h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.preview-content {
  background: white;
  border-radius: 6px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.preview-content pre {
  margin: 0;
  font-size: 12px;
  color: #495057;
  white-space: pre-wrap;
}

/* 生成结果 */
.generator-result {
  margin-bottom: 32px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.copy-btn, .download-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover, .download-btn:hover {
  border-color: #32CD32;
  color: #32CD32;
}
</style>