import { defineStore } from 'pinia'
import http from '@/utils/http'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    properties: [],
    owners: [],
    statuses: ['available', 'sold', 'rented'],
    types: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'land', 'commercial', 'office', 'retail', 'industrial'],
  }),
  actions: {
    setOwners (owners) {
      this.owners = owners
    },
    async fetchProperties (params) {
      const { data } = await http.get('/properties', { params })

      this.properties = data.rows

      return data
    },
    async createProperty (payload) {
      await http.post('/properties', payload)
    },
    async updateProperty (id, payload) {
      await http.put(`/properties/${id}`, payload)
    },
    async deleteProperty (id) {
      await http.delete(`/properties/${id}`)
    },
    async fetchOwners (params) {
      const { data } = await http.get('/properties-owners', { params })

      this.owners = data.rows

      return data
    },
    async createOwner (payload) {
      await http.post('/properties-owners', payload)
    },
    async updateOwner (id, payload) {
      await http.put(`/properties-owners/${id}`, payload)
    },
    async deleteOwner (id) {
      await http.delete(`/properties-owners/${id}`)
    },
  },
})
