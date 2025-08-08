// Utilities
import { createPinia } from 'pinia'

export default createPinia()

export { useAppStore } from './app'
export { useAuthStore } from './auth'
export { useClassStore } from './class'
export { usePropertyStore } from './property'
export { useRoleStore } from './role'
export { useSubjectStore } from './subject'
export { useUserStore } from './user'
