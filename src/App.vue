<template>
  <Notif ref="notif" />
  <AppConfirm ref="confirm" />
  <AppDelay />
  <RouterView />
</template>

<script setup>
  import { useAppStore } from '@/stores'
  import AppConfirm from './lib/components/AppConfirm.vue'
  import AppDelay from './lib/components/AppDelay.vue'
  import Notif from './lib/components/AppNotification.vue'

  const { setIsSchoolApp } = useAppStore()

  // Variables
  const notif = ref('')
  const confirm = ref('')
  const rootInstance = getCurrentInstance()

  onMounted(() => {
    rootInstance.root.$notif = notif.value.pushNotif
    rootInstance.root.$confirm = confirm.value.open

    const isSchoolApp = JSON.parse(localStorage.getItem('isSchoolApp')) || false
    setIsSchoolApp(isSchoolApp)
  })
</script>

<style lang="scss" src="./sass/app.scss"></style>
