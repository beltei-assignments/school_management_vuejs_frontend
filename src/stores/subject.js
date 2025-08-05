import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useSubjectStore = defineStore('subject', {
  state: () => ({
    subjects: [],
  }),
  actions: {
    async fetchSubjects (params) {
      const { data } = await http.get('/subjects', { params })

      this.subjects = data.rows

      return data
    },
    async createSubject (payload) {
      await http.post('/subjects', payload)
    },
    async updateSubject (id, payload) {
      await http.put(`/subjects/${id}`, payload)
    },
    async deleteSubject (id) {
      await http.delete(`/subjects/${id}`)
    },
  },
})
