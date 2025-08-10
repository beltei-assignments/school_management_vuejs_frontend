import { useAppStore } from '@/stores'

export function isUserLogin () {
  const user = localStorage.getItem('user')
  if (!user) {
    return { login: false }
  }

  return { login: true }
}

export const guard = (to, from, next) => {
  const { isSchoolAppComputed } = storeToRefs(useAppStore())
  const { login } = isUserLogin()

  if (!login && to.matched[0].meta.isSecure) {
    next({ name: isSchoolAppComputed.value ? 'LoginSchool' : 'LoginProperty' })
  } else {
    next()
  }
}
