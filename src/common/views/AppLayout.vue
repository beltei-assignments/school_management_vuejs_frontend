<template>
  <v-layout>
    <BaseSideBar :menus="menus" :rail="rail" />

    <v-main class="mx-2 mt-2">
      <BaseAppBar @click-menu=" rail = !rail" />
      <main class="d-flex flex-column mt-2">
        <RouterView />
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { ref } from 'vue'
  import { RouterView } from 'vue-router'
  import BaseAppBar from '@/lib/components/BaseAppBar.vue'
  import BaseSideBar from '@/lib/components/BaseSideBar.vue'

  const rail = ref(true)
  const menus = [
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
</script>
