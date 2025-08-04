<template>
  <v-container
    class="d-flex flex-column justify-center align-center text-center"
    style="height: 100vh"
  >
    <v-icon color="primary" size="120">mdi-alert-circle-outline</v-icon>
    <h1 class="text-h2 font-weight-bold mt-4">404</h1>
    <p class="text-subtitle-1 mb-4">Oops! The page you’re looking for doesn’t exist.</p>
    <v-btn color="primary" @click="goToHome"> Go to Home </v-btn>
  </v-container>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { getAllRoutes } from '@/helpers/route.js'
  import { useUserStore } from '@/stores/user.js'

  const { user } = storeToRefs(useUserStore())
  const router = useRouter()
  const routes = getAllRoutes(router.options.routes)

  const goToHome = () => {
    const permissions = new Set(user.value.permissions.map(
      ({ permission }) => permission.name,
    ))

    const firstRoute = routes.find(
      r =>
        r.meta && r.meta.permission && permissions.has(r.meta.permission),
    )

    router.push({ name: firstRoute ? firstRoute.name : 'Login' })
  }
</script>
