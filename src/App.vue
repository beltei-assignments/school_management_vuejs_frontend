<template>
  <Notif ref="notif" />
  <AppConfirm ref="confirm" />
  <AppDelay />
  <RouterView />
</template>

<script setup>
  import { getCurrentInstance, onMounted, ref } from 'vue'
  import { RouterView } from 'vue-router'
  import AppConfirm from './lib/components/AppConfirm.vue'
  import AppDelay from './lib/components/AppDelay.vue'
  import Notif from './lib/components/AppNotification.vue'

  // Variables
  const notif = ref('')
  const confirm = ref('')
  const rootInstance = getCurrentInstance()

  onMounted(() => {
    rootInstance.root.$notif = notif.value.pushNotif
    rootInstance.root.$confirm = confirm.value.open
  })
</script>

<style lang="scss" src="./sass/app.scss"></style>
