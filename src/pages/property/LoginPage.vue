<template>
  <div class="h-screen text-white w-100 d-flex">
    <div class="bg-img" />

    <div class="login-form d-flex justify-center align-center bg-white">
      <v-form ref="form" class="form w-100 px-16 py-10">
        <div class="d-flex justify-center mb-4">
          <v-img :height="160" src="@/assets/images/real-estate-logo.jpg" />
        </div>
        <div class="d-flex justify-center mb-12">
          <p>Welcome to Real Estate Property</p>
        </div>
        <div class="mt-4">
          <v-text-field
            v-model="credentials.email"
            autocomplete="username"
            class="text-black placeholer-capitalize"
            clearable
            density="comfortable"
            name="username"
            placeholder="Email"
            prepend-inner-icon="mdi-email-outline"
            :rules="rules.email"
            type="email"
            variant="outlined"
          />
        </div>

        <div>
          <v-text-field
            v-model="credentials.password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            autocomplete="current-password"
            class="text-black"
            clearable
            density="comfortable"
            name="password"
            placeholder="Password"
            prepend-inner-icon="mdi-lock-outline"
            :rules="rules.password"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="showPassword = !showPassword"
          />
        </div>

        <v-btn
          block
          class="mt-2"
          color="primary text-none"
          :loading="loading"
          rounded="3"
          size="large"
          @click="connect"
        >
          <v-icon class="mr-2" icon="mdi-login-variant" />
          Login
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup>
  import { useAppStore, useAuthStore } from '@/stores'

  const { login } = useAuthStore()
  const { setIsSchoolApp } = useAppStore()

  const instance = getCurrentInstance()
  const router = useRouter()
  const form = ref(null)
  const showPassword = ref(false)
  const loading = ref(false)
  const credentials = reactive({
    email: '',
    password: '',
  })
  const rules = computed(() => {
    return {
      email: [v => !!v || 'Please enter your email'],
      password: [v => !!v || 'Please enter your password'],
    }
  })

  const connect = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    localStorage.setItem('isSchoolApp', false)
    setIsSchoolApp(false)

    try {
      loading.value = true
      const { data } = await login(credentials)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('isSchoolApp', false)
      setIsSchoolApp(false)

      instance.root.$notif('Login successful', { type: 'success' })
      router.push({ name: 'Home' })
    } catch (error) {
      let message = 'Something went wrong'
      if (error.response.data.detail) {
        message = error.response.data.detail
      }

      instance.root.$notif(message, { type: 'error' })
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .login-form {
    width: 40%;
  }

  .bg-img {
    width: 60%;
    background-image: url('@/assets/images/real-estate-bg.jpeg');
    background-size: cover;
    filter: brightness(80%);
    background-position: center;
  }

  .cursor {
    cursor: pointer;
  }

  @media screen and (max-width: 900px) {
    .bg-img {
      display: none;
    }

    .login-form {
      width: 100%;
    }

    .form {
      width: 60% !important;
    }
  }

  @media screen and (max-width: 430px) {
    .form {
      width: 100% !important;
    }
  }
</style>
