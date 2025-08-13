import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [],
    daysOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  }),
  actions: {
    async fetchSchedules (params) {
      const { data } = await http.get('/schedules', { params })

      this.schedules = data.rows

      return data
    },
    async checkSchedule (params) {
      return http.get('/schedules/check_schedule/', { params })
    },
    async createSchedule (payload) {
      await http.post('/schedules', payload)
    },
    async updateSchedule (id, payload) {
      await http.put(`/schedules/${id}`, payload)
    },
    async deleteSchedule (id) {
      await http.delete(`/schedules/${id}`)
    },
  },
})
