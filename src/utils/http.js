import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/lib/state/loading/loading'

const BASE_URL = import.meta.env.VUE_APP_API_URL || 'http://localhost:8000/api/'

const http = axios.create({
  baseURL: BASE_URL,
})

http.interceptors.request.use(config => {
  const { isLoading } = storeToRefs(useLoadingStore())
  isLoading.value = true
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-access-token'] = token
  }
  config.headers['Content-Type'] = 'application/json'
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
