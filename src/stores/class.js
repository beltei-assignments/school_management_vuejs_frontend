import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useClassStore = defineStore('class', {
  state: () => ({
    classes: [],
  }),
  actions: {
    async fetchClasses (params) {
      const { data } = await http.get('/classes', { params })

      this.classes = data.rows

      return data
    },
    async createClass (payload) {
      await http.post('/classes', payload)
    },
    async updateClass (id, payload) {
      await http.put(`/classes/${id}`, payload)
    },
    async deleteClass (id) {
      await http.delete(`/classes/${id}`)
    },
  },
})
