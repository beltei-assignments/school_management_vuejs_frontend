import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],
  }),
  actions: {
    async fetchReports (params) {
      const { data } = await http.get('/reports', { params })

      this.reports = data.rows

      return data
    },
    async createReport (payload) {
      await http.post('/reports', payload)
    },
    async updateReport (id, payload) {
      await http.put(`/reports/${id}`, payload)
    },
    async deleteReport (id) {
      await http.delete(`/reports/${id}`)
    },
  },
})
