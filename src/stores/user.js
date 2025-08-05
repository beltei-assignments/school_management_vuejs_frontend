import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
  }),
  actions: {
    async fetchUsers (params) {
      const { data } = await http.get('/users', { params })

      this.users = data.rows

      return data
    },
    async createUser (payload) {
      await http.post('/users', payload)
    },
    async updateUser (id, payload) {
      await http.put(`/users/${id}`, payload)
    },
    async deleteUser (id) {
      await http.delete(`/users/${id}`)
    },
  },
})
