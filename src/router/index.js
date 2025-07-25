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
    // 後端機台管理
    {
      path: '/machine/adminmachine',
      name: 'machine-admin',
      component: () => import('../views/ch/machine/MachineAdmin.vue'),
    },
    // 前端機台管理
    {
      path: '/machine/usermachine',
      name: 'machine-user',
      component: () => import('../views/ch/machine/MachineUser.vue'),
    },
    // 維修表單
    {
      path: '/repair/repairform',
      name: 'repair-form',
      component: () => import('../views/ch/repair/RepairForm.vue'),
    },
    // 維修列表
    {
      path: '/repair/repairuserlist',
      name: 'repair-list',
      component: () => import('../views/ch/repair/RepairUserList.vue'),
    },
  ],
})

export default router