import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // 👇 新增你的機台管理路由
    {
      path: '/machine/adminmachine',
      name: 'machine-admin',
      component: () => import('../views/ch/machine/MachineAdmin.vue'),
    },
    {
      path: '/machine/usermachine',
      name: 'machine-user',
      component: () => import('../views/ch/machine/MachineUser.vue'),
    },
  ],
})

export default router