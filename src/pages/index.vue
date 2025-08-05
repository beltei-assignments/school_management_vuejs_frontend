<template>
  <v-container class="fill-height d-flex justify-center">
    <div>
      <v-img
        class="mb-4"
        height="150"
        :src="logoPath"
      />

      <div class="mb-8 text-center">
        <p class="font-weight-light mb-2">Welcome to</p>
        <h1 class="text-h4 font-weight-bold">{{ appTitile }}</h1>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import propertyLogo from '@/assets/images/real-estate-logo.jpg'
  import schoolLogo from '@/assets/images/school-logo.png'
  import { useAppStore } from '@/stores'

  const { isSchoolApp, appTitile } = storeToRefs(useAppStore())

  const logoPath = computed(() => {
    if (isSchoolApp.value) {
      return schoolLogo
    }

    return propertyLogo
  })
</script>
