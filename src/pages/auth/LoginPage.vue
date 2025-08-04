<template>
  <div class="h-screen text-white w-100 d-flex">
    <div class="bg-img" />

    <div class="login-form d-flex justify-center align-center bg-white">
      <v-form ref="form" class="form w-100 px-16 py-10">
        <div class="d-flex justify-center mb-12">
          <v-img :height="160" src="@/assets/images/logo.png" />
        </div>
        <div class="mt-4">
          <v-text-field
            v-model="credentials.email"
            autocomplete="username"
            class="text-black placeholer-capitalize"
            density="comportable"
            name="username"
            placeholder="Email"
            prepend-inner-icon="mdi-email-outline"
            :rules="rules.email"
            type="email"
            variant="outlined"
          />
        </div>

        <div>
          <!-- <div class="text-medium-emphasis d-flex align-center justify-end">
            <span
              class="cursor text-primary"
              @click="$router.push({ name: 'ForgotPasswordView' })"
            >
              {{ $t('app.auth.forgot.forgot') }}</span>
          </div> -->
          <v-text-field
            v-model="credentials.password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            autocomplete="current-password"
            class="text-black"
            density="comportable"
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
  // import { storeToRefs } from 'pinia'
  import { computed, getCurrentInstance, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  // import { ROLE_NAME } from '@/constants/index.js'
  // import { useCookieStore } from '@/stores/cookie'
  // import { useUserStore } from '@/stores/user'
  import http from '@/utils/http.js'

  const instance = getCurrentInstance()
  // const { user } = storeToRefs(useUserStore())
  // const cookieStore = useCookieStore()
  const router = useRouter()
  const form = ref(null)
  const showPassword = ref(false)
  const loading = ref(false)
  const credentials = reactive({
    email: '',
    password: '',
  })
  // const defaultRoute = reactive({
  //   [ROLE_NAME.SUPER_ADMIN]: 'HomeView',
  //   [ROLE_NAME.ADMIN]: 'HomeView',
  //   [ROLE_NAME.CASHIER]: 'OrdersView',
  //   [ROLE_NAME.CHEF]: 'ChefView',
  //   [ROLE_NAME.WAITER]: 'WaiterView',
  // })
  const rules = computed(() => {
    return {
      email: [v => !!v || 'Please enter your email'],
      password: [v => !!v || 'Please enter your password'],
    }
  })

  const connect = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    try {
      loading.value = true
      const res = await http.post('auth/login', credentials)
      console.log(res)
      // const { token, data } = res.data
      // const { user: userData, role, permissions } = data

      // cookieStore.setCookie('token', token, 30)
      // cookieStore.setCookie('user', userData, 30)
      // cookieStore.setCookie('role', role, 30)
      // cookieStore.setCookie('permissions', permissions, 30)
      // user.value.data = userData
      // user.value.token = token
      // user.value.role = role
      // user.value.permissions = permissions
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
    background-image: url('@/assets/images/login_bg.jpg');
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
