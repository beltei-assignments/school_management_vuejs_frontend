<template>
  <v-card class="bg-white" height="8vh" rounded="4">
    <div
      :class="`h-100 w-100 pa-3 d-flex align-center justify-space-between ${props.class}`"
    >
      <!-- <span>{{ props.title }}</span> -->
      <v-icon-btn icon="mdi-menu" @click="clickMenu" />
      <div class="w-50">
        <slot />
      </div>
      <div>
        <v-menu rounded>
          <template #activator="{ props: propsProfle }">
            <v-btn v-bind="propsProfle" color="primary" icon size="small">
              CH
              <!-- <v-avatar class="profile" color="primary">
                <v-img
                  v-if="userData.image"
                  :alt="userData.first_name"
                  cover
                  :src="userData.image"
                />
                <span v-else class="text-white">{{ initials }}</span>
              </v-avatar> -->
            </v-btn>
          </template>
          <v-card class="bg-grey-darken-2 rounded-lg mt-3 px-5 py-2">
            <v-card-text>
              dasd
              <!-- <div class="mx-auto text-center">
                <v-avatar class="profile" size="72">
                  <v-img
                    v-if="userData.image"
                    :src="userData.image"
                    :alt="userData.first_name"
                    cover
                  ></v-img>
                  <span v-else class="text-h4 text-white">{{ initials }}</span>
                </v-avatar>
                <h3>{{ userData.first_name }} {{ userData.last_name }}</h3>
                <p class="font-inter text-subtitle-1 mt-1">
                  {{ userData.email }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1 mt-1"
                  @click="$router.push('/manage_account')"
                >
                  <v-icon icon="mdi-cog" color="white" size="small"></v-icon>
                  {{ $t('app.header.sitting.manageAcc') }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1"
                  @click="$router.push('/store')"
                >
                  <v-icon
                    icon="mdi-store-cog"
                    color="white"
                    size="small"
                  ></v-icon>
                  {{ $t('app.header.sitting.manageStore') }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1"
                  @click="$router.push('/change_password')"
                >
                  <v-icon
                    icon="mdi-shield-lock-outline"
                    color="white"
                    size="small"
                  ></v-icon>
                  {{ $t('app.header.sitting.password') }}
                </p>
                <v-divider class="my-3"></v-divider>
                <div class="d-flex justify-center">
                  <danger-button @click="isLogout = true">
                    <v-icon
                      icon="mdi-logout"
                      color="white"
                      size="large"
                    ></v-icon>
                    {{ $t('app.auth.logout') }}
                  </danger-button>
                </div>
              </div> -->
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-card>
</template>

<script setup>
  // import { storeToRefs } from 'pinia'
  import { defineEmits, defineProps } from 'vue'
  // import { useRouter } from 'vue-router'
  // import { useCookieStore } from '@/stores/cookie'
  // import { useUserStore } from '@/stores/user'

  // Variables
  const props = defineProps(['title', 'class'])
  const emit = defineEmits(['click-menu'])
  // const isLogout = ref(false)
  // const router = useRouter()
  // const { userData } = storeToRefs(useUserStore())
  // const initials = computed(() => {
  //   const { first_name, last_name } = userData.value
  //   return (
  //     first_name.slice(0, 1).toUpperCase() + last_name.slice(0, 1).toUpperCase()
  //   )
  // })

  // Method
  const clickMenu = () => {
    emit('click-menu')
  }
  // const logout = async () => {
  //   try {
  //     // await http.post("logout");
  //     router.push('/login')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
</script>

<style scoped>
  .font-inter {
    font-family: 'Inter', 'Noto Serif Khmer', sans-serif, serif !important;
  }
  .profile {
    background: #2c2c2c;
  }
  .cursor {
    cursor: pointer;
  }
</style>
