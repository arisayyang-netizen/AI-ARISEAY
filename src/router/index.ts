import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'AI智能工作台'
      }
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Home,
      meta: {
        title: '记事本'
      }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Home,
      meta: {
        title: '智能对话'
      }
    },
    {
      path: '/todos',
      name: 'Todos',
      component: Home,
      meta: {
        title: '待办清单'
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Home,
      meta: {
        title: '设置'
      }
    },
    {
      path: '/ai-consultation',
      name: 'AIConsultation',
      component: () => import('@/views/AIConsultation.vue'),
      meta: {
        title: 'AI咨询服务'
      }
    },
    {
      path: '/aurora-test',
      name: 'AuroraTest',
      component: () => import('@/views/AuroraTest.vue'),
      meta: {
        title: 'Aurora背景测试'
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - AI智能工作台`
  }
  next()
})

export default router