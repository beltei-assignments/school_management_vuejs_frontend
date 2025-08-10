import axios from 'axios'
import { useLoadingStore } from '@/lib/state/loading/loading'
import { useAppStore } from '@/stores'

const BASE_SCHOOL_URL = import.meta.env.VUE_APP_API_SCHOOL_URL || 'http://localhost:8000/api/'
const BASE_PROPERTY_URL = import.meta.env.VUE_APP_API_PROPERTY_URL || 'http://localhost:8080/api/'

const http = axios.create({
  baseURL: BASE_SCHOOL_URL,
})

http.interceptors.request.use(config => {
  const { isLoading } = storeToRefs(useLoadingStore())
  const { isSchoolApp } = storeToRefs(useAppStore())

  if (!isSchoolApp.value) {
    config.baseURL = BASE_PROPERTY_URL
  }

  isLoading.value = true
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-access-token'] = token
  }
  // config.headers['Content-Type'] = 'application/json'
  return config
})

http.interceptors.response.use(
  response => {
    const { isLoading } = storeToRefs(useLoadingStore())
    isLoading.value = false
    return response
  },
  async error => {
    const { isLoading } = storeToRefs(useLoadingStore())
    isLoading.value = false

    // if ([401, 403].includes(error.request.status)) {
    // disconnect()

    // DEV: hard reload to redirct to login
    // window.location.href = '/login'
    // }

    throw error
  },
)

export default http
