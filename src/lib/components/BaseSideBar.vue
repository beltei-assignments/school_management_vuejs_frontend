<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    :rail="props.rail"
  >
    <v-list>
      <v-list-item
        :title="appTitile"
      >
        <template #prepend>
          <v-img class="mr-3" :src="logoPath" :width="26" />
        </template>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="menu in menus"
        :key="menu.title"
        color="primary"
        :prepend-icon="menu.icon"
        :title="menu.title"
        :to="menu.link"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import propertyLogo from '@/assets/images/real-estate-logo.jpg'
  import schoolLogo from '@/assets/images/school-logo.png'
  import { useAppStore } from '@/stores'

  const { isSchoolApp, appTitile } = storeToRefs(useAppStore())

  const props = defineProps({
    menus: {
      type: Array,
      required: false,
      default: () => [],
    },
    rail: {
      type: Boolean,
      required: true,
    },
  })
  const drawer = ref(true)
  const logoPath = computed(() => {
    if (isSchoolApp.value) {
      return schoolLogo
    }

    return propertyLogo
  })
</script>
