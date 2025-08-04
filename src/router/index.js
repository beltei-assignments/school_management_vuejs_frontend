import { createRouter, createWebHistory } from 'vue-router/auto'
import authRoutes from './auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: () => import('@/common/views/AppLayout.vue'),
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/pages/index.vue'),
        },
        {
          path: '/class',
          name: 'ClassHome',
          component: () => import('@/pages/school/ClassPage.vue'),
        },
        {
          path: '/user',
          name: 'UserHome',
          component: () => import('@/pages/school/UserPage.vue'),
        },
      ],
    },
  ],
})

export default router
