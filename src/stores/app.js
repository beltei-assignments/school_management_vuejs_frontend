// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isSchoolApp: false,
  }),
  getters: {
    isSchoolAppComputed (state) {
      return state.isSchoolApp
    },
    appTitile (state) {
      if (state.isSchoolApp) {
        return 'BIU System'
      }

      return 'Real Estate Property'
    },
    appMenus (state) {
      if (state.isSchoolApp) {
        return [
          {
            link: '/class',
            title: 'Class',
            icon: 'mdi-home-city',
          },
          {
            link: '/subject',
            title: 'Subject',
            icon: 'mdi-book-open-variant-outline',
          },
          {
            link: '/schedule',
            title: 'Schedule',
            icon: 'mdi-clock-time-four-outline',
          },
          {
            link: '/report',
            title: 'Progress report',
            icon: 'mdi-account-school-outline',
          },
          {
            link: '/user',
            title: 'User',
            icon: 'mdi-account-group-outline',
          },
        ]
      }

      return [
        {
          link: '/property',
          title: 'Property',
          icon: 'mdi-office-building-marker-outline',
        },
        {
          link: '/user',
          title: 'User',
          icon: 'mdi-account-group-outline',
        },
      ]
    },
  },
  actions: {
    setIsSchoolApp (isSchoolApp) {
      this.isSchoolApp = isSchoolApp
    },
  },
})
