// Utilities
import { createPinia } from 'pinia'

export default createPinia()

export { useAppStore } from './app'
export { useAuthStore } from './auth'
export { useClassStore } from './class'
export { usePropertyStore } from './property'
export { useReportStore } from './report'
export { useRoleStore } from './role'
export { useScheduleStore } from './schedule'
export { useSubjectStore } from './subject'
export { useUserStore } from './user'
