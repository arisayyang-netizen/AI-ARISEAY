<template>
  <div class="daily-learning">
    <div class="learning-header">
      <h2>每日学习</h2>
      <p class="header-desc">记录学习进度，积累知识财富</p>
    </div>
    
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 学习计划 -->
      <el-tab-pane label="学习计划" name="plan">
        <div class="plan-section">
          <div class="plan-header">
            <h3>今日学习计划</h3>
            <el-button type="primary" @click="showAddPlan = true">
              添加计划
            </el-button>
          </div>
          
          <div class="plan-list">
            <div 
              v-for="plan in todayPlans" 
              :key="plan.id"
              class="plan-item"
              :class="{ completed: plan.completed }"
            >
              <el-checkbox 
                v-model="plan.completed" 
                @change="updatePlan(plan)"
              />
              <div class="plan-content">
                <h4>{{ plan.title }}</h4>
                <p>{{ plan.description }}</p>
                <div class="plan-meta">
                  <span class="duration">预计时长: {{ plan.duration }}分钟</span>
                  <span class="category">{{ plan.category }}</span>
                </div>
              </div>
              <div class="plan-actions">
                <el-button size="small" @click="editPlan(plan)">编辑</el-button>
                <el-button size="small" type="danger" @click="deletePlan(plan.id)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 学习记录 -->
      <el-tab-pane label="学习记录" name="record">
        <div class="record-section">
          <div class="record-header">
            <h3>学习记录</h3>
            <el-button type="primary" @click="showAddRecord = true">
              添加记录
            </el-button>
          </div>
          
          <div class="record-list">
            <div 
              v-for="record in learningRecords" 
              :key="record.id"
              class="record-item"
            >
              <div class="record-content">
                <h4>{{ record.title }}</h4>
                <p>{{ record.content }}</p>
                <div class="record-meta">
                  <span class="duration">学习时长: {{ record.duration }}分钟</span>
                  <span class="date">{{ formatDate(record.date) }}</span>
                </div>
                <div class="record-tags">
                  <el-tag 
                    v-for="tag in record.tags" 
                    :key="tag"
                    size="small"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 运营题目练习 -->
      <el-tab-pane label="运营题目练习" name="quiz">
        <div class="quiz-section">
          <div class="quiz-header">
            <h3>每日运营题目</h3>
            <div class="quiz-stats">
              <span>今日已答题: {{ todayAnswered }}/{{ dailyQuizLimit }}</span>
              <span>正确率: {{ Math.round(correctRate * 100) }}%</span>
            </div>
          </div>
          
          <!-- 当前题目 -->
          <div v-if="currentQuestion" class="question-card">
            <div class="question-header">
              <span class="question-number">第 {{ currentQuestionIndex + 1 }} 题</span>
              <span class="question-category">{{ currentQuestion.category }}</span>
            </div>
            
            <div class="question-content">
              <h4>{{ currentQuestion.question }}</h4>
              
              <div class="options-list">
                <div 
                  v-for="(option, index) in currentQuestion.options" 
                  :key="index"
                  class="option-item"
                  :class="{ 
                    selected: selectedAnswer === index,
                    correct: showAnswer && index === currentQuestion.correctAnswer,
                    wrong: showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer
                  }"
                  @click="selectAnswer(index)"
                >
                  <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
                  <span class="option-text">{{ option }}</span>
                </div>
              </div>
              
              <div v-if="showAnswer" class="answer-explanation">
                <h5>解析：</h5>
                <p>{{ currentQuestion.explanation }}</p>
                
                <div class="knowledge-share">
                  <h5>相关知识：</h5>
                  <div class="knowledge-content">
                    <p>{{ currentQuestion.knowledgeShare }}</p>
                    <div v-if="currentQuestion.relatedLinks" class="related-links">
                      <h6>延伸阅读：</h6>
                      <ul>
                        <li v-for="link in currentQuestion.relatedLinks" :key="link.title">
                          <a :href="link.url" target="_blank">{{ link.title }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="question-actions">
              <el-button 
                v-if="!showAnswer" 
                type="primary" 
                @click="submitAnswer"
                :disabled="selectedAnswer === null"
              >
                提交答案
              </el-button>
              <el-button 
                v-if="showAnswer" 
                type="primary" 
                @click="nextQuestion"
              >
                下一题
              </el-button>
              <el-button @click="skipQuestion">跳过</el-button>
            </div>
          </div>
          
          <!-- 题目完成状态 -->
          <div v-else class="quiz-complete">
            <div class="complete-icon">🎉</div>
            <h3>今日题目已完成！</h3>
            <p>您今天已经完成了所有运营题目练习</p>
            <div class="today-stats">
              <div class="stat-item">
                <span class="stat-value">{{ todayAnswered }}</span>
                <span class="stat-label">已答题数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ Math.round(correctRate * 100) }}%</span>
                <span class="stat-label">正确率</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ todayCorrect }}</span>
                <span class="stat-label">答对题数</span>
              </div>
            </div>
            <el-button type="primary" @click="reviewWrongAnswers">复习错题</el-button>
          </div>
          
          <!-- 错题本 -->
          <div v-if="showWrongAnswers" class="wrong-answers-section">
            <h4>错题本</h4>
            <div class="wrong-answers-list">
              <div 
                v-for="question in wrongAnswers" 
                :key="question.id"
                class="wrong-answer-item"
              >
                <h5>{{ question.question }}</h5>
                <p><strong>正确答案：</strong>{{ question.options[question.correctAnswer] }}</p>
                <p><strong>您的答案：</strong>{{ question.options[question.userAnswer] }}</p>
                <p><strong>解析：</strong>{{ question.explanation }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- 知识库 -->
      <el-tab-pane label="知识库" name="knowledge">
        <div class="knowledge-section">
          <div class="knowledge-header">
            <h3>知识库</h3>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索知识点..."
              style="width: 300px;"
            />
          </div>
          
          <div class="knowledge-grid">
            <div 
              v-for="item in filteredKnowledge" 
              :key="item.id"
              class="knowledge-card"
            >
              <div class="knowledge-header">
                <h4>{{ item.title }}</h4>
              </div>
              <div class="knowledge-content">
                <p>{{ item.summary }}</p>
              </div>
              <div class="knowledge-footer">
                <span class="create-date">{{ formatDate(item.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加计划对话框 -->
    <el-dialog v-model="showAddPlan" title="添加学习计划" width="600px">
      <el-form :model="planForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="planForm.title" placeholder="请输入计划标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="planForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入计划描述"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="planForm.category" placeholder="请选择分类">
            <el-option label="编程" value="编程" />
            <el-option label="设计" value="设计" />
            <el-option label="语言" value="语言" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="时长">
          <el-input-number v-model="planForm.duration" :min="15" :max="240" />
          <span style="margin-left: 8px;">分钟</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddPlan = false">取消</el-button>
        <el-button type="primary" @click="savePlan">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 添加记录对话框 -->
    <el-dialog v-model="showAddRecord" title="添加学习记录" width="600px">
      <el-form :model="recordForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="recordForm.title" placeholder="请输入记录标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input 
            v-model="recordForm.content" 
            type="textarea" 
            :rows="4"
            placeholder="请输入学习内容和心得"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="recordForm.tagsInput" placeholder="请输入标签，用逗号分隔" />
        </el-form-item>
        <el-form-item label="时长">
          <el-input-number v-model="recordForm.duration" :min="5" :max="480" />
          <span style="margin-left: 8px;">分钟</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddRecord = false">取消</el-button>
        <el-button type="primary" @click="saveRecord">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const activeTab = ref('plan')
const showAddPlan = ref(false)
const showAddRecord = ref(false)
const searchKeyword = ref('')

// 运营题目练习数据
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showAnswer = ref(false)
const todayAnswered = ref(0)
const todayCorrect = ref(0)
const dailyQuizLimit = ref(10)
const showWrongAnswers = ref(false)
const wrongAnswers = ref<any[]>([])

// 运营题目库
const operationQuestions = ref([
  {
    id: 1,
    category: '用户运营',
    question: '在用户生命周期管理中，哪个阶段的用户价值最高？',
    options: [
      '新用户获取阶段',
      '用户活跃阶段', 
      '用户留存阶段',
      '用户流失阶段'
    ],
    correctAnswer: 2,
    explanation: '用户留存阶段的用户价值最高，因为这些用户已经对产品产生了依赖和忠诚度，转化成本最低，生命周期价值最大。',
    knowledgeShare: '用户生命周期管理是运营的核心工作之一。通过精细化运营不同阶段的用户，可以最大化用户价值。留存用户的获客成本为零，且更容易产生复购和推荐行为。',
    relatedLinks: [
      { title: '用户生命周期价值计算方法', url: 'https://example.com/clv' },
      { title: '用户留存策略实战指南', url: 'https://example.com/retention' }
    ]
  },
  {
    id: 2,
    category: '内容运营',
    question: '内容运营中，什么是"内容矩阵"？',
    options: [
      '多个内容创作者组成的团队',
      '不同平台上的内容分发策略',
      '围绕核心主题的多维度内容体系',
      '内容发布的时间安排表'
    ],
    correctAnswer: 2,
    explanation: '内容矩阵是指围绕核心主题，从不同角度、不同形式、不同深度创建的完整内容体系，形成内容间的相互关联和支撑。',
    knowledgeShare: '内容矩阵能够提高内容的系统性和专业度，增强用户粘性。通过主题内容、衍生内容、互动内容等多层次布局，可以更好地满足用户需求，提升内容价值。',
    relatedLinks: [
      { title: '如何构建内容矩阵', url: 'https://example.com/content-matrix' },
      { title: '内容运营策略大全', url: 'https://example.com/content-strategy' }
    ]
  },
  {
    id: 3,
    category: '活动运营',
    question: '活动运营中的"AARRR模型"代表什么？',
    options: [
      'Acquire, Activate, Retain, Revenue, Refer',
      'Analyze, Apply, Review, Report, Recommend', 
      'Attention, Action, Result, Return, Repeat',
      'Audience, Activity, Resource, Risk, Result'
    ],
    correctAnswer: 0,
    explanation: 'AARRR模型代表获取(Acquire)、激活(Activate)、留存(Retain)、收入(Revenue)、推荐(Refer)，是衡量产品和运营效果的重要指标体系。',
    knowledgeShare: 'AARRR模型也被称为海盗指标，是增长黑客理论的核心。每个环节都有对应的关键指标和优化策略，通过数据驱动的方式实现用户增长和商业价值最大化。',
    relatedLinks: [
      { title: 'AARRR模型详解与应用', url: 'https://example.com/aarrr' },
      { title: '增长黑客实战手册', url: 'https://example.com/growth-hacking' }
    ]
  },
  {
    id: 4,
    category: '数据运营',
    question: '在数据分析中，什么是"漏斗分析"？',
    options: [
      '分析用户在各个转化环节的流失情况',
      '分析数据的层级结构关系',
      '分析数据的时间趋势变化',
      '分析不同用户群体的行为差异'
    ],
    correctAnswer: 0,
    explanation: '漏斗分析是分析用户在产品使用过程中各个关键节点的转化率，识别流失环节，优化用户体验和转化效果。',
    knowledgeShare: '漏斗分析是数据运营的基础工具，通过可视化展示用户行为路径，帮助运营人员快速定位问题环节。常见的漏斗包括注册漏斗、购买漏斗、活跃漏斗等。',
    relatedLinks: [
      { title: '漏斗分析实战案例', url: 'https://example.com/funnel-analysis' },
      { title: '数据驱动的运营决策', url: 'https://example.com/data-driven' }
    ]
  },
  {
    id: 5,
    category: '社群运营',
    question: '社群运营中，什么是"种子用户"？',
    options: [
      '最早注册的用户群体',
      '付费金额最高的用户',
      '具有影响力且愿意传播的核心用户',
      '使用频率最高的活跃用户'
    ],
    correctAnswer: 2,
    explanation: '种子用户是指在产品早期阶段，具有一定影响力、对产品认同度高、愿意主动传播和反馈的核心用户群体。',
    knowledgeShare: '种子用户是社群冷启动的关键。他们不仅是产品的早期体验者，更是品牌传播的放大器。培养好种子用户，可以形成良性的口碑传播和用户增长循环。',
    relatedLinks: [
      { title: '如何找到和培养种子用户', url: 'https://example.com/seed-users' },
      { title: '社群运营完整指南', url: 'https://example.com/community-operation' }
    ]
  }
])

// 计算属性
const currentQuestion = computed(() => {
  if (todayAnswered.value >= dailyQuizLimit.value) return null
  return operationQuestions.value[currentQuestionIndex.value % operationQuestions.value.length]
})

const correctRate = computed(() => {
  if (todayAnswered.value === 0) return 0
  return todayCorrect.value / todayAnswered.value
})

// 学习计划数据
const learningPlans = ref<any[]>([])
const planForm = ref({
  title: '',
  description: '',
  category: '',
  duration: 60
})

// 学习记录数据
const learningRecords = ref<any[]>([])
const recordForm = ref({
  title: '',
  content: '',
  tagsInput: '',
  duration: 30
})

// 知识库数据
const knowledgeBase = ref<any[]>([])

// 计算属性
const todayPlans = computed(() => {
  const today = new Date().toDateString()
  return learningPlans.value.filter(plan => 
    new Date(plan.date).toDateString() === today
  )
})

const filteredKnowledge = computed(() => {
  if (!searchKeyword.value) return knowledgeBase.value
  return knowledgeBase.value.filter(item =>
    item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 方法
const loadData = () => {
  try {
    const savedPlans = localStorage.getItem('learning-plans')
    if (savedPlans) {
      learningPlans.value = JSON.parse(savedPlans)
    }
    
    const savedRecords = localStorage.getItem('learning-records')
    if (savedRecords) {
      learningRecords.value = JSON.parse(savedRecords)
    }
    
    const savedKnowledge = localStorage.getItem('knowledge-base')
    if (savedKnowledge) {
      knowledgeBase.value = JSON.parse(savedKnowledge)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

const saveData = () => {
  try {
    localStorage.setItem('learning-plans', JSON.stringify(learningPlans.value))
    localStorage.setItem('learning-records', JSON.stringify(learningRecords.value))
    localStorage.setItem('knowledge-base', JSON.stringify(knowledgeBase.value))
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

const savePlan = () => {
  if (!planForm.value.title) {
    ElMessage.warning('请输入计划标题')
    return
  }
  
  const newPlan = {
    id: Date.now(),
    ...planForm.value,
    date: new Date().toISOString(),
    completed: false
  }
  
  learningPlans.value.push(newPlan)
  saveData()
  
  // 重置表单
  planForm.value = {
    title: '',
    description: '',
    category: '',
    duration: 60
  }
  
  showAddPlan.value = false
  ElMessage.success('学习计划添加成功')
}

const saveRecord = () => {
  if (!recordForm.value.title) {
    ElMessage.warning('请输入记录标题')
    return
  }
  
  const tags = recordForm.value.tagsInput 
    ? recordForm.value.tagsInput.split(',').map(tag => tag.trim())
    : []
  
  const newRecord = {
    id: Date.now(),
    title: recordForm.value.title,
    content: recordForm.value.content,
    tags,
    duration: recordForm.value.duration,
    date: new Date().toISOString()
  }
  
  learningRecords.value.unshift(newRecord)
  saveData()
  
  // 重置表单
  recordForm.value = {
    title: '',
    content: '',
    tagsInput: '',
    duration: 30
  }
  
  showAddRecord.value = false
  ElMessage.success('学习记录添加成功')
}

const updatePlan = (plan: any) => {
  saveData()
  ElMessage.success(plan.completed ? '计划已完成' : '计划已更新')
}

const editPlan = (plan: any) => {
  planForm.value = { ...plan }
  showAddPlan.value = true
}

const deletePlan = (id: number) => {
  const index = learningPlans.value.findIndex(plan => plan.id === id)
  if (index > -1) {
    learningPlans.value.splice(index, 1)
    saveData()
    ElMessage.success('计划已删除')
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 运营题目练习方法
const selectAnswer = (index: number) => {
  if (showAnswer.value) return
  selectedAnswer.value = index
}

const submitAnswer = () => {
  if (selectedAnswer.value === null) return
  
  showAnswer.value = true
  todayAnswered.value++
  
  const isCorrect = selectedAnswer.value === currentQuestion.value?.correctAnswer
  if (isCorrect) {
    todayCorrect.value++
    ElMessage.success('回答正确！')
  } else {
    ElMessage.error('回答错误，请查看解析')
    // 添加到错题本
    if (currentQuestion.value) {
      wrongAnswers.value.push({
        ...currentQuestion.value,
        userAnswer: selectedAnswer.value
      })
    }
  }
  
  // 保存答题记录
  saveQuizProgress()
}

const nextQuestion = () => {
  currentQuestionIndex.value++
  selectedAnswer.value = null
  showAnswer.value = false
  
  // 如果达到每日限制，显示完成状态
  if (todayAnswered.value >= dailyQuizLimit.value) {
    ElMessage.success(`今日题目已完成！正确率：${Math.round(correctRate.value * 100)}%`)
  }
}

const skipQuestion = () => {
  currentQuestionIndex.value++
  selectedAnswer.value = null
  showAnswer.value = false
}

const reviewWrongAnswers = () => {
  showWrongAnswers.value = !showWrongAnswers.value
}

const saveQuizProgress = () => {
  const today = new Date().toDateString()
  const quizData = {
    date: today,
    answered: todayAnswered.value,
    correct: todayCorrect.value,
    wrongAnswers: wrongAnswers.value
  }
  localStorage.setItem('daily-quiz-progress', JSON.stringify(quizData))
}

const loadQuizProgress = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem('daily-quiz-progress')
  
  if (saved) {
    const data = JSON.parse(saved)
    if (data.date === today) {
      todayAnswered.value = data.answered || 0
      todayCorrect.value = data.correct || 0
      wrongAnswers.value = data.wrongAnswers || []
    } else {
      // 新的一天，重置数据
      todayAnswered.value = 0
      todayCorrect.value = 0
      wrongAnswers.value = []
    }
  }
}

// 生命周期
onMounted(() => {
  loadData()
  loadQuizProgress()
})
</script>

<style scoped>
.daily-learning {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.learning-header {
  text-align: center;
  margin-bottom: 30px;
}

.learning-header h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.header-desc {
  color: #7f8c8d;
  font-size: 16px;
}

.plan-section,
.record-section,
.knowledge-section {
  padding: 20px;
}

.plan-header,
.record-header,
.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.plan-header h3,
.record-header h3,
.knowledge-header h3 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.plan-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.plan-item.completed {
  opacity: 0.7;
}

.plan-content {
  flex: 1;
}

.plan-content h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.plan-content p {
  color: #7f8c8d;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.plan-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.duration {
  color: #3498db;
}

.category {
  color: #e74c3c;
}

.plan-actions {
  display: flex;
  gap: 8px;
}

/* 运营题目练习样式 */
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

.question-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.question-number {
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
}

.question-category {
  color: #e74c3c;
  font-size: 14px;
  font-weight: 500;
}

.question-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.6;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.option-item {
  margin-bottom: 12px;
  padding: 12px 16px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.option-item:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.option-item.selected {
  border-color: #3498db;
  background: #e3f2fd;
}

.option-item.correct {
  border-color: #27ae60;
  background: #d5f4e6;
}

.option-item.wrong {
  border-color: #e74c3c;
  background: #fdeaea;
}

.option-item.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.quiz-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.answer-section {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.answer-title {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
}

.answer-explanation {
  color: #555;
  line-height: 1.6;
  margin-bottom: 12px;
}

.knowledge-share {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 12px;
}

.knowledge-title {
  font-weight: bold;
  color: #856404;
  margin-bottom: 6px;
}

.knowledge-content {
  color: #856404;
  font-size: 14px;
  line-height: 1.5;
}

.wrong-answers-section {
  margin-top: 20px;
}

.wrong-answer-item {
  background: white;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.wrong-question {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
}

.wrong-details {
  font-size: 14px;
  color: #7f8c8d;
}

.quiz-complete {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.complete-icon {
  font-size: 48px;
  color: #27ae60;
  margin-bottom: 16px;
}

.complete-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.complete-stats {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-item {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.record-content h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.record-content p {
  color: #34495e;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.record-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #7f8c8d;
}

.record-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.knowledge-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.knowledge-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.knowledge-card h4 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.knowledge-content p {
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.knowledge-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-date {
  font-size: 12px;
  color: #bdc3c7;
}
</style>