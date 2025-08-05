// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isSchoolApp: true,
  }),
  getters: {
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
          icon: 'mdi-home-city',
        },
        {
          link: '/user',
          title: 'User',
          icon: 'mdi-account-group-outline',
        },
      ]
    },
  },
})
