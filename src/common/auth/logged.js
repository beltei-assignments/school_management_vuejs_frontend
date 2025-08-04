import { storeToRefs } from 'pinia'
import { useCookieStore } from '@/stores/cookie'
import { useUserStore } from '@/stores/user'

export async function isUserLogin () {
  const { user } = storeToRefs(useUserStore())
  let isLogin = false
  let isRefresh = false
  const { getCookie } = useCookieStore()
  const token = getCookie('token')
  if (!token) {
    return { login: isLogin }
  }
  if (token && !user.value.token) {
    user.value.token = token
    isRefresh = true
  }
  isLogin = true
  return { login: isLogin, isRefresh }
}

export const loggedIn = async (to, next) => {
  const { getUser } = useUserStore()
  const { login, isRefresh } = await isUserLogin()

  if (!login && to.matched[0].meta.isSecure) {
    next({ name: 'Login' })

    return { redirectLogin: true }
  } else if (login && to.meta.auth) {
    next({ name: 'HomeView' })

    return { redirectLogin: true }
  } else {
    if (login && isRefresh) {
      await getUser()
    }

    return { redirectLogin: false }
  }
}
