export default [
  {
    path: '/login',
    name: 'Login',
    meta: { isLogin: true, auth: true },
    component: () => import('@/pages/auth/LoginPage.vue'),
  },
]
