import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    classes: [],
  }),
  actions: {
    async login (payload) {
      return http.post('auth/login', payload)
    },
  },
})
