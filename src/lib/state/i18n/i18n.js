import { defineStore } from 'pinia'
const lng = localStorage.getItem('lng')
export const useI18nStore = defineStore('i18n', {
  state: () => {
    return {
      lng: lng === 'kh' ? lng : 'en',
    }
  },
  actions: {
    change (newLng) {
      this.lng = newLng
      localStorage.setItem('lg', newLng)
    },
  },
})
