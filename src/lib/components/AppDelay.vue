<template>
  <v-row v-if="isLoading" class="overlay" no-gutters>
    <v-progress-linear color="primary" indeterminate />
  </v-row>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useLoadingStore } from '../state/loading/loading'
  const { isLoading } = storeToRefs(useLoadingStore())
</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 5000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
