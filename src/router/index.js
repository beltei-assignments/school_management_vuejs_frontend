import { createRouter, createWebHistory } from 'vue-router/auto'
import { guard } from '@/common/auth/guard'
import authRoutes from './auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: () => import('@/common/views/AppLayout.vue'),
      meta: { isSecure: true },
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/pages/index.vue'),
        },
        {
          path: '/user',
          name: 'UserHome',
          component: () => import('@/pages/UserPage.vue'),
        },
        // School
        {
          path: '/class',
          name: 'ClassHome',
          component: () => import('@/pages/school/ClassPage.vue'),
        },
        {
          path: '/subject',
          name: 'SubjectHome',
          component: () => import('@/pages/school/SubjectPage.vue'),
        },
        {
          path: '/schedule',
          name: 'ScheduleHome',
          component: () => import('@/pages/school/SchedulePage.vue'),
        },
        {
          path: '/report',
          name: 'ReportHome',
          component: () => import('@/pages/school/ReportPage.vue'),
        },
        // Property
        {
          path: '/property',
          name: 'PropertyHome',
          component: () => import('@/pages/property/PropertyPage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(guard)

export default router
