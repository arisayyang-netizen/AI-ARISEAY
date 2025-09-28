import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { DatabaseManager } from './utils/database'

// 样式导入
import 'element-plus/dist/index.css'
import './styles/index.css'

// 创建应用实例
const app = createApp(App)

// 使用插件
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