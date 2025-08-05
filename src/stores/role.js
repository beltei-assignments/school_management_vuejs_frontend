import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [],
  }),
  actions: {
    async fetchRoles (params) {
      const { data } = await http.get('/roles', { params })

      this.roles = data

      return data
    },
  },
})
