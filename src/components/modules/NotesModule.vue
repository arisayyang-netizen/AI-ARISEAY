<template>
  <div class="notes-module">
    <!-- 笔记清单头部 -->
    <div class="notes-header">
      <div class="header-left">
        <h2 class="module-title">
          <el-icon class="title-icon"><Document /></el-icon>
          我的笔记
        </h2>
        <div class="notes-stats">
          <span class="stat-item">共 {{ notes.length }} 篇</span>
          <span class="stat-item">今日 {{ todayNotes }} 篇</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="createNote" class="create-btn">
          <el-icon><Plus /></el-icon>
          新建笔记
        </el-button>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="filters-section">
      <div class="filter-tabs">
        <div class="tab-group">
          <div 
            class="filter-tab" 
            :class="{ active: selectedCategory === 'all' }"
            @click="setCategory('all')"
          >
            <span class="tab-icon">📄</span>
            <span class="tab-text">全部</span>
            <span class="tab-count">({{ notes.length }})</span>
          </div>
          <div 
            v-for="category in categories" 
            :key="category.name"
            class="filter-tab"
            :class="{ active: selectedCategory === category.name }"
            @click="setCategory(category.name)"
          >
            <span class="tab-icon">📁</span>
            <span class="tab-text">{{ category.name }}</span>
            <span class="tab-count">({{ category.count }})</span>
          </div>
        </div>
      </div>
      
      <div class="popular-tags">
        <span class="tags-label">热门标签：</span>
        <el-tag
          v-for="tag in popularTags.slice(0, 8)"
          :key="tag.name"
          :type="selectedTags.includes(tag.name) ? 'primary' : ''"
          class="tag-filter"
          @click="toggleTag(tag.name)"
          size="small"
        >
          {{ tag.name }} ({{ tag.count }})
        </el-tag>
      </div>
    </div>

    <!-- 笔记网格列表 -->
    <div class="notes-grid">
      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        class="note-card"
        :class="{ expanded: expandedNotes.includes(note.id) }"
        @click="openNoteEditor(note)"
      >
        <div class="note-card-header">
          <h3 class="note-card-title">{{ note.title || '无标题' }}</h3>
          <div class="note-actions">
            <el-button 
              type="text" 
              :icon="expandedNotes.includes(note.id) ? ArrowUp : ArrowDown" 
              class="expand-btn"
              @click.stop="toggleNoteExpansion(note.id)"
              size="small"
            />
            <el-dropdown @command="(cmd) => handleNoteAction(cmd, note)" trigger="click">
              <el-button :icon="More" text circle size="small" class="note-menu-btn" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="duplicate">复制</el-dropdown-item>
                  <el-dropdown-item command="export">导出</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        
        <div class="note-card-content">
          <div class="note-preview" :class="{ expanded: expandedNotes.includes(note.id) }">
            {{ expandedNotes.includes(note.id) ? note.content.replace(/<[^>]*>/g, '') : getPreview(note.content) }}
          </div>
        </div>
        
        <!-- 展开的详细信息 -->
        <div v-if="expandedNotes.includes(note.id)" class="note-expanded">
          <div class="expanded-section">
            <h4>创建信息</h4>
            <p class="expanded-info">创建时间：{{ formatDate(note.createdAt) }}</p>
            <p class="expanded-info">最后修改：{{ formatDate(note.updatedAt) }}</p>
            <p class="expanded-info">字数统计：{{ getWordCount(note.content) }} 字</p>
          </div>
          
          <div class="expanded-section" v-if="note.tags.length > 0">
            <h4>所有标签</h4>
            <div class="all-tags">
              <el-tag 
                v-for="tag in note.tags" 
                :key="tag" 
                size="small"
                class="expanded-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          
          <div class="expanded-actions">
            <el-button size="small" @click.stop="openNoteEditor(note)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" @click.stop="duplicateNote(note.id)">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
            <el-button size="small" @click.stop="exportNote(note)">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>
        </div>
        
        <div class="note-card-footer" v-if="!expandedNotes.includes(note.id)">
          <div class="note-meta">
            <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
            <span class="note-category" v-if="note.category">{{ note.category }}</span>
          </div>
          <div class="note-tags">
            <el-tag 
              v-for="tag in note.tags.slice(0, 3)" 
              :key="tag" 
              size="small"
              class="note-tag"
            >
              {{ tag }}
            </el-tag>
            <el-tag 
              v-if="note.tags.length > 3" 
              size="small"
              class="more-tags-indicator"
              @click.stop="toggleNoteExpansion(note.id)"
            >
              +{{ note.tags.length - 3 }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <div v-if="filteredNotes.length === 0" class="empty-state">
        <el-empty description="暂无笔记">
          <el-button type="primary" @click="createNote">
            <el-icon><Plus /></el-icon>
            创建第一篇笔记
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 笔记编辑器弹窗 -->
    <el-dialog 
      v-model="showEditor" 
      :title="editingNote?.title || '新建笔记'"
      width="80%"
      top="5vh"
      class="note-editor-dialog"
      :before-close="handleEditorClose"
    >
      <div class="editor-container" v-if="editingNote">
        <!-- 编辑器工具栏 -->
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <el-input 
              v-model="editingNote.title" 
              placeholder="输入标题..."
              class="title-input"
              @input="handleTitleChange"
            />
          </div>
          
          <div class="toolbar-right">
            <el-button-group>
              <el-button 
                :icon="AIPolish" 
                @click="polishContent"
                :loading="isPolishing"
                title="AI润色"
              >
                润色
              </el-button>
              <el-button 
                :icon="Tag" 
                @click="generateTags"
                :loading="isGeneratingTags"
                title="生成标签"
              >
                标签
              </el-button>
              <el-button 
                :icon="Check" 
                @click="saveNote"
                title="保存"
              >
                保存
              </el-button>
            </el-button-group>
          </div>
        </div>
        
        <!-- 富文本编辑器 -->
        <div class="editor-content">
          <div ref="editorRef" class="quill-editor"></div>
        </div>
        
        <!-- 标签编辑 -->
        <div class="tags-editor">
          <div class="tags-section">
            <span class="tags-label">标签：</span>
            <div class="tags-container">
              <el-tag
                v-for="tag in editingNote.tags"
                :key="tag"
                closable
                @close="removeTag(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="showTagInput"
                ref="tagInputRef"
                v-model="newTag"
                size="small"
                class="tag-input"
                @keyup.enter="addTag"
                @blur="addTag"
              />
              <el-button
                v-else
                size="small"
                @click="showAddTag"
              >
                + 添加标签
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleEditorClose">取消</el-button>
          <el-button type="primary" @click="saveAndCloseEditor">保存并关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, CollectionTag, Check, More, Close, Star, Document, List,
  ArrowUp, ArrowDown, Edit, CopyDocument, Download
} from '@element-plus/icons-vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import type { Note } from '@/types'
import { useNotesStore } from '@/stores/notes'
import { useAIStore } from '@/stores/ai'
// 移除date-fns依赖，使用原生Date方法

const notesStore = useNotesStore()
const aiStore = useAIStore()

// 响应式数据
const selectedCategory = ref('all')
const selectedTags = ref<string[]>([])
const showTagInput = ref(false)
const newTag = ref('')
const isPolishing = ref(false)
const isGeneratingTags = ref(false)
const expandedNotes = ref<string[]>([])

// 编辑器弹窗相关
const showEditor = ref(false)
const editingNote = ref<Note | null>(null)
const editorRef = ref<HTMLElement>()
const tagInputRef = ref()
let quillEditor: Quill | null = null

// 计算属性
const notes = computed(() => notesStore.notes)
const categories = computed(() => notesStore.categories)
const popularTags = computed(() => notesStore.popularTags)
const todayNotes = computed(() => notesStore.todayNotes)

const filteredNotes = computed(() => {
  let filtered = notes.value
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(note => note.category === selectedCategory.value)
  }
  
  // 按标签筛选
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(note => 
      selectedTags.value.some(tag => note.tags.includes(tag))
    )
  }
  
  // 按更新时间排序
  return filtered.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
})

// 方法
const createNote = async () => {
  const note = await notesStore.createNote()
  openNoteEditor(note)
}

const openNoteEditor = async (note: Note) => {
  editingNote.value = { ...note }
  showEditor.value = true
  await nextTick()
  initEditor()
}

const handleEditorClose = () => {
  if (quillEditor) {
    quillEditor.off('text-change')
    quillEditor = null
  }
  showEditor.value = false
  editingNote.value = null
}

const saveAndCloseEditor = async () => {
  if (editingNote.value) {
    await saveNote()
    handleEditorClose()
  }
}

const handleNoteAction = async (command: string, note: Note) => {
  switch (command) {
    case 'edit':
      openNoteEditor(note)
      break
    case 'duplicate':
      await duplicateNote(note.id)
      break
    case 'export':
      exportNote(note)
      break
    case 'delete':
      await deleteNoteWithConfirm(note.id)
      break
  }
}

const initEditor = () => {
  if (!editorRef.value) return
  
  // 完全清理编辑器容器
  if (quillEditor) {
    quillEditor.off('text-change')
    quillEditor = null
  }
  
  // 清空容器内容
  editorRef.value.innerHTML = ''
  
  // 创建新编辑器
  quillEditor = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: '开始写作...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'code-block'],
        ['clean']
      ]
    }
  })
  
  // 设置内容
  if (editingNote.value?.content) {
    try {
      quillEditor.root.innerHTML = editingNote.value.content
    } catch (error) {
      console.error('设置编辑器内容失败:', error)
      quillEditor.setText(editingNote.value.content || '')
    }
  } else {
    quillEditor.setText('')
  }
  
  // 监听内容变化
  quillEditor.on('text-change', () => {
    if (editingNote.value && quillEditor) {
      editingNote.value.content = quillEditor.root.innerHTML
      editingNote.value.updatedAt = new Date()
      // 自动保存
      debounceAutoSave()
    }
  })
}

// 防抖自动保存
let autoSaveTimer: NodeJS.Timeout
const debounceAutoSave = () => {
  clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => {
    if (editingNote.value) {
      notesStore.updateNote(editingNote.value)
    }
  }, 1000)
}

const handleTitleChange = () => {
  if (editingNote.value) {
    editingNote.value.updatedAt = new Date()
    debounceAutoSave()
  }
}

const saveNote = async () => {
  if (!editingNote.value) return
  
  try {
    await notesStore.updateNote(editingNote.value)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const setCategory = (category: string) => {
  selectedCategory.value = category
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const showAddTag = () => {
  showTagInput.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const addTag = () => {
  if (newTag.value.trim() && editingNote.value) {
    const tag = newTag.value.trim()
    if (!editingNote.value.tags.includes(tag)) {
      editingNote.value.tags.push(tag)
      editingNote.value.updatedAt = new Date()
      debounceAutoSave()
    }
  }
  newTag.value = ''
  showTagInput.value = false
}

const removeTag = (tag: string) => {
  if (editingNote.value) {
    const index = editingNote.value.tags.indexOf(tag)
    if (index > -1) {
      editingNote.value.tags.splice(index, 1)
      editingNote.value.updatedAt = new Date()
      debounceAutoSave()
    }
  }
}

// AI功能
const polishContent = async () => {
  if (!editingNote.value?.content || !quillEditor) return
  
  isPolishing.value = true
  try {
    const polished = await aiStore.polishText(quillEditor.getText())
    quillEditor.root.innerHTML = polished
    editingNote.value.content = polished
    editingNote.value.updatedAt = new Date()
    ElMessage.success('内容润色完成')
  } catch (error) {
    ElMessage.error('润色失败，请检查AI配置')
  } finally {
    isPolishing.value = false
  }
}

const generateTags = async () => {
  if (!editingNote.value?.content) return
  
  isGeneratingTags.value = true
  try {
    const tags = await aiStore.generateTags(editingNote.value.content)
    editingNote.value.tags = [...new Set([...editingNote.value.tags, ...tags])]
    editingNote.value.updatedAt = new Date()
    ElMessage.success('标签生成完成')
  } catch (error) {
    ElMessage.error('标签生成失败，请检查AI配置')
  } finally {
    isGeneratingTags.value = false
  }
}

const extractTasks = async () => {
  if (!editingNote.value?.content) return
  
  try {
    await aiStore.extractTasks(editingNote.value.content, editingNote.value.id)
    ElMessage.success('任务提取完成，请查看待办清单')
  } catch (error) {
    ElMessage.error('任务提取失败')
  }
}

const summarizeContent = async () => {
  if (!editingNote.value?.content) return
  
  try {
    const summary = await aiStore.summarizeContent(editingNote.value.content)
    ElMessage({
      message: `内容摘要：${summary}`,
      type: 'info',
      duration: 10000,
      showClose: true
    })
  } catch (error) {
    ElMessage.error('内容总结失败')
  }
}

const duplicateNote = async (noteId: string) => {
  try {
    await notesStore.duplicateNote(noteId)
    ElMessage.success('笔记已复制')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const exportNote = (note: Note) => {
  // 创建导出内容
  const content = `# ${note.title}\n\n${note.content.replace(/<[^>]*>/g, '')}\n\n---\n标签: ${note.tags.join(', ')}\n创建时间: ${formatDate(note.createdAt)}\n更新时间: ${formatDate(note.updatedAt)}`
  
  // 创建下载链接
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${note.title || '无标题'}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('笔记已导出')
}

const deleteNoteWithConfirm = async (noteId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个笔记吗？', '确认删除', {
      type: 'warning'
    })
    await notesStore.deleteNote(noteId)
    ElMessage.success('笔记已删除')
  } catch {
    // 用户取消删除
  }
}

// 工具函数
const getPreview = (content: string): string => {
  const text = content.replace(/<[^>]*>/g, '')
  return text.slice(0, 100) + (text.length > 100 ? '...' : '')
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '时间未知'
  
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '时间未知'
    
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    
    return d.toLocaleDateString('zh-CN')
  } catch (error) {
    console.warn('时间格式化错误:', error)
    return '时间未知'
  }
}

const getWordCount = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, '')
  return text.length
}

const toggleNoteExpansion = (noteId: string) => {
  const index = expandedNotes.value.indexOf(noteId)
  if (index > -1) {
    expandedNotes.value.splice(index, 1)
  } else {
    expandedNotes.value.push(noteId)
  }
}

// 生命周期
onMounted(async () => {
  await notesStore.loadNotes()
})
</script>

<style scoped>
.notes-module {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  background: var(--bg-primary);
  padding: var(--space-6);
}

/* 笔记清单头部 */
.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid var(--border-color);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.module-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 32px;
  color: var(--primary-color);
}

.notes-stats {
  display: flex;
  gap: var(--space-4);
}

.stat-item {
  font-size: 14px;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.header-right .create-btn {
  padding: var(--space-3) var(--space-5);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
  transition: all var(--transition-normal);
}

.header-right .create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4);
}

/* 筛选和搜索区域 */
.filters-section {
  margin-bottom: var(--space-6);
  padding: var(--space-5);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-tabs {
  margin-bottom: var(--space-4);
}

.tab-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.filter-tab:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.15);
}

.filter-tab.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: var(--primary-color);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

.tab-icon {
  font-size: 16px;
}

.tab-text {
  font-weight: inherit;
}

.tab-count {
  font-size: 12px;
  opacity: 0.8;
}

.popular-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tags-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-right: var(--space-2);
}

.tag-filter {
  cursor: pointer;
  transition: all var(--transition-normal);
}

.tag-filter:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(var(--primary-rgb), 0.2);
}

/* 笔记网格布局 */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-5);
  padding: var(--space-2);
}

.note-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: var(--space-5);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.note-card:hover::before {
  opacity: 1;
}

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.note-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.expand-btn {
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.note-card:hover .expand-btn {
  opacity: 1;
}

.note-card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: var(--space-3);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.note-menu-btn {
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.note-card:hover .note-menu-btn {
  opacity: 1;
}

.note-card.expanded {
  grid-column: span 2;
  max-width: none;
}

@media (max-width: 768px) {
  .note-card.expanded {
    grid-column: span 1;
  }
}

.note-preview.expanded {
  -webkit-line-clamp: unset;
  max-height: 300px;
  overflow-y: auto;
}

.note-expanded {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.expanded-section {
  margin-bottom: var(--space-4);
}

.expanded-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.expanded-info {
  font-size: 12px;
  color: var(--text-secondary);
  margin: var(--space-1) 0;
}

.all-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.expanded-tag {
  font-size: 12px;
  padding: var(--space-1) var(--space-2);
}

.expanded-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.more-tags-indicator {
  cursor: pointer;
  background: var(--primary-color);
  color: white;
  font-weight: 500;
}

.more-tags-indicator:hover {
  background: var(--primary-color-dark);
}

.note-card-content {
  margin-bottom: var(--space-4);
}

.note-preview {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.note-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.note-date {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.note-category {
  font-size: 12px;
  color: var(--primary-color);
  background: var(--bg-secondary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  flex: 1;
  justify-content: flex-end;
}

.note-tag {
  font-size: 12px;
  padding: var(--space-1) var(--space-2);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  transition: var(--transition-normal);
}

.note-tag:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* 编辑器对话框样式 */
.note-editor-dialog {
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.note-editor-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: var(--space-5);
  border-bottom: none;
}

.note-editor-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
}

.note-editor-dialog :deep(.el-dialog__headerbtn) {
  color: white;
  font-size: 20px;
}

.note-editor-dialog :deep(.el-dialog__headerbtn:hover) {
  color: rgba(255, 255, 255, 0.8);
}

.note-editor-dialog :deep(.el-dialog__body) {
  padding: var(--space-6);
  background: var(--bg-primary);
}

.note-editor-dialog :deep(.el-dialog__footer) {
  background: var(--bg-secondary);
  padding: var(--space-5);
  border-top: 1px solid var(--border-color);
}

.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.title-input {
  font-size: 18px;
  font-weight: 600;
}

.title-input :deep(.el-input__inner) {
  border: none;
  font-size: 18px;
  font-weight: 600;
  padding: 0;
}

.toolbar-right {
  display: flex;
  gap: var(--space-2);
}

.editor-content {
  flex: 1;
  padding: var(--space-4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quill-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.quill-editor :deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--space-2);
  flex-shrink: 0;
}

.quill-editor :deep(.ql-container) {
  border: none;
  font-size: 16px;
  line-height: 1.6;
  flex: 1;
  overflow-y: auto;
}

.quill-editor :deep(.ql-editor) {
  padding: var(--space-3);
  min-height: 200px;
}

.quill-editor :deep(.ql-editor h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
  color: var(--text-primary);
}

.quill-editor :deep(.ql-editor h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.8rem 0;
  color: var(--text-primary);
}

.quill-editor :deep(.ql-editor h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.6rem 0;
  color: var(--text-primary);
}

.tags-editor {
  padding: var(--space-4);
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.tags-section {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.tags-label {
  font-size: 14px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.tag-input {
  width: 100px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-8);
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  color: var(--text-tertiary);
  margin-bottom: var(--space-4);
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}
</style>