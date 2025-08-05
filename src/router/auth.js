export default [
  {
    path: '/login/school',
    name: 'LoginSchool',
    meta: { isLogin: true, auth: true },
    component: () => import('@/pages/school/LoginPage.vue'),
  },
  {
    path: '/login/property',
    name: 'LoginProperty',
    meta: { isLogin: true, auth: true },
    component: () => import('@/pages/property/LoginPage.vue'),
  },
]
