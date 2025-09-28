import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, Tag } from '@/types'
import { nanoid } from 'nanoid'
import { DatabaseManager } from '@/utils/database'

export const useNotesStore = defineStore('notes', () => {
  // 状态
  const notes = ref<Note[]>([])
  const isLoading = ref(false)

  // 计算属性
  const categories = computed(() => {
    const categoryMap = new Map<string, number>()
    
    notes.value.forEach(note => {
      if (note.category) {
        categoryMap.set(note.category, (categoryMap.get(note.category) || 0) + 1)
      }
    })
    
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }))
  })

  const popularTags = computed(() => {
    const tagMap = new Map<string, number>()
    
    notes.value.forEach(note => {
      note.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })
    
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  })

  const totalNotes = computed(() => notes.value.length)
  
  const todayNotes = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return notes.value.filter(note => {
      const noteDate = new Date(note.createdAt)
      noteDate.setHours(0, 0, 0, 0)
      return noteDate.getTime() === today.getTime()
    }).length
  })

  // 方法
  const loadNotes = async () => {
    isLoading.value = true
    try {
      const dbNotes = await DatabaseManager.getNotes()
      
      if (dbNotes.length > 0) {
        notes.value = dbNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
      } else {
        // 尝试从localStorage迁移数据
        const savedNotes = localStorage.getItem('ai-workbench-notes')
        if (savedNotes) {
          const parsed = JSON.parse(savedNotes)
          notes.value = parsed.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          }))
          // 迁移到数据库
          await saveNotes()
          localStorage.removeItem('ai-workbench-notes')
        } else {
          // 创建示例笔记
          await createSampleNotes()
        }
      }
    } catch (error) {
      console.error('加载笔记失败:', error)
      await createSampleNotes()
    } finally {
      isLoading.value = false
    }
  }

  const saveNotes = async () => {
    try {
      // 批量保存到数据库
      for (const note of notes.value) {
        if (!note.id) {
          const id = await DatabaseManager.saveNote(note)
          note.id = id
        } else {
          // 确保ID是数字类型
          const noteId = typeof note.id === 'string' ? parseInt(note.id) : note.id
          await DatabaseManager.updateNote(noteId, note)
        }
      }
    } catch (error) {
      console.error('保存笔记失败:', error)
      throw error
    }
  }

  const createNote = async (title = '', content = '', category?: string): Promise<Note> => {
    const noteData = {
      title: title || '新建笔记',
      content: content,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: category
    }
    
    try {
      const id = await DatabaseManager.saveNote(noteData)
      const note: Note = { ...noteData, id }
      notes.value.unshift(note)
      return note
    } catch (error) {
      console.error('创建笔记失败:', error)
      throw error
    }
  }

  const updateNote = async (updatedNote: Note) => {
    try {
      updatedNote.updatedAt = new Date().toISOString()
      // 确保ID是数字类型
      const noteId = typeof updatedNote.id === 'string' ? parseInt(updatedNote.id) : updatedNote.id
      await DatabaseManager.updateNote(noteId, updatedNote)
      
      const index = notes.value.findIndex(note => note.id === updatedNote.id)
      if (index !== -1) {
        notes.value[index] = { ...updatedNote }
      }
    } catch (error) {
      console.error('更新笔记失败:', error)
      throw error
    }
  }

  const deleteNote = async (noteId: string | number) => {
    try {
      // 确保ID是数字类型
      const id = typeof noteId === 'string' ? parseInt(noteId) : noteId
      await DatabaseManager.deleteNote(id)
      
      const index = notes.value.findIndex(note => note.id === noteId)
      if (index !== -1) {
        notes.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除笔记失败:', error)
      throw error
    }
  }

  const duplicateNote = async (noteId: string) => {
    const originalNote = notes.value.find(note => note.id === noteId)
    if (originalNote) {
      const duplicatedNote: Note = {
        ...originalNote,
        id: nanoid(),
        title: `${originalNote.title} - 副本`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      notes.value.unshift(duplicatedNote)
      await saveNotes()
      return duplicatedNote
    }
  }

  const searchNotes = async (query: string): Promise<Note[]> => {
    if (!query.trim()) return notes.value
    
    try {
      return await DatabaseManager.searchNotes(query)
    } catch (error) {
      console.error('搜索笔记失败:', error)
      // 降级到本地搜索
      const searchTerm = query.toLowerCase()
      return notes.value.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
  }

  const getNotesByTag = (tag: string): Note[] => {
    return notes.value.filter(note => note.tags.includes(tag))
  }

  const getNotesByCategory = (category: string): Note[] => {
    return notes.value.filter(note => note.category === category)
  }

  const addTagToNote = async (noteId: string, tag: string) => {
    const note = notes.value.find(n => n.id === noteId)
    if (note && !note.tags.includes(tag)) {
      note.tags.push(tag)
      note.updatedAt = new Date()
      await saveNotes()
    }
  }

  const removeTagFromNote = async (noteId: string, tag: string) => {
    const note = notes.value.find(n => n.id === noteId)
    if (note) {
      const index = note.tags.indexOf(tag)
      if (index > -1) {
        note.tags.splice(index, 1)
        note.updatedAt = new Date()
        await saveNotes()
      }
    }
  }

  const updateNoteCategory = async (noteId: string, category: string) => {
    const note = notes.value.find(n => n.id === noteId)
    if (note) {
      note.category = category
      note.updatedAt = new Date()
      await saveNotes()
    }
  }

  // 创建示例笔记
  const createSampleNotes = async () => {
    const sampleNotes = [
      {
        title: '欢迎使用AI智能工作台',
        content: `<h2>🎉 欢迎使用AI智能工作台！</h2>
        <p>这是一个集成了<strong>记事本</strong>、<strong>智能体对话</strong>和<strong>待办清单</strong>的AI原生工作台。</p>
        
        <h3>✨ 主要功能</h3>
        <ul>
          <li><strong>AI记事本</strong>：支持富文本编辑、AI润色、自动标签生成</li>
          <li><strong>智能体对话</strong>：多轮对话、创意助手、问题解决</li>
          <li><strong>待办清单</strong>：智能任务识别、时间管理、进度跟踪</li>
        </ul>
        
        <h3>🚀 快速开始</h3>
        <p>1. 点击右上角设置按钮配置AI API</p>
        <p>2. 开始创建你的第一个笔记</p>
        <p>3. 尝试使用AI功能提升效率</p>
        
        <blockquote>
          <p>💡 提示：你可以使用AI功能来润色这段文字，或者自动生成标签！</p>
        </blockquote>`,
        tags: ['欢迎', '教程', '开始'],
        createdAt: new Date(),
        updatedAt: new Date(),
        category: '教程'
      },
      {
        title: '项目规划思路',
        content: `<h2>📋 新项目规划</h2>
        <p>今天需要整理一下新项目的规划思路：</p>
        
        <h3>核心目标</h3>
        <ul>
          <li>提升用户体验</li>
          <li>优化性能表现</li>
          <li>增强AI能力</li>
        </ul>
        
        <h3>技术选型</h3>
        <p>前端：Vue 3 + TypeScript + Vite</p>
        <p>AI集成：OpenAI API / Kimi API</p>
        <p>数据存储：IndexedDB</p>
        
        <h3>时间安排</h3>
        <p>第一阶段：基础功能开发（2周）</p>
        <p>第二阶段：AI功能集成（1周）</p>
        <p>第三阶段：测试优化（1周）</p>`,
        tags: ['项目', '规划', '技术'],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        category: '工作'
      },
      {
        title: '学习笔记：AI应用开发',
        content: `<h2>🤖 AI应用开发学习笔记</h2>
        
        <h3>关键概念</h3>
        <ul>
          <li><strong>Prompt Engineering</strong>：提示词工程的重要性</li>
          <li><strong>Context Window</strong>：上下文窗口管理</li>
          <li><strong>Token优化</strong>：成本控制策略</li>
        </ul>
        
        <h3>最佳实践</h3>
        <ol>
          <li>明确的指令和角色设定</li>
          <li>提供具体的示例</li>
          <li>合理的输出格式要求</li>
          <li>错误处理和重试机制</li>
        </ol>
        
        <p><em>明天需要深入研究RAG（检索增强生成）技术。</em></p>`,
        tags: ['学习', 'AI', '开发', '笔记'],
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        category: '学习'
      }
    ]
    
    try {
      for (const noteData of sampleNotes) {
        const id = await DatabaseManager.saveNote(noteData)
        const note: Note = { ...noteData, id }
        notes.value.push(note)
      }
    } catch (error) {
      console.error('创建示例笔记失败:', error)
    }
  }

  return {
    // 状态
    notes,
    isLoading,
    
    // 计算属性
    categories,
    popularTags,
    totalNotes,
    todayNotes,
    
    // 方法
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    searchNotes,
    getNotesByTag,
    getNotesByCategory,
    addTagToNote,
    removeTagFromNote,
    updateNoteCategory
  }
})