<template>
  <v-layout>
    <BaseSideBar :menus="appMenus" :rail="rail" />

    <v-main class="mx-2 mt-2">
      <BaseAppBar @click-menu=" rail = !rail" />
      <main class="d-flex flex-column mt-2">
        <RouterView />
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import BaseAppBar from '@/lib/components/BaseAppBar.vue'
  import BaseSideBar from '@/lib/components/BaseSideBar.vue'
  import { useAppStore } from '@/stores'

  const { appMenus } = storeToRefs(useAppStore())

  const rail = ref(true)
</script>
