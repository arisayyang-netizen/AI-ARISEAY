import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { DatabaseManager } from './utils/database'

// Element Plus 导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 样式导入
import './styles/index.css'

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 初始化数据库
DatabaseManager.initialize().then(() => {
  console.log('数据库初始化完成')
}).catch(error => {
  console.error('数据库初始化失败:', error)
})

// 挂载应用
app.mount('#app')