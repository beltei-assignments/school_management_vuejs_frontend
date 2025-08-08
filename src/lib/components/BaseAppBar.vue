<template>
  <v-card class="bg-white" height="8vh" rounded="4">
    <div
      :class="`h-100 w-100 pa-3 d-flex align-center justify-space-between ${props.class}`"
    >
      <v-icon-btn icon="mdi-menu" @click="clickMenu" />
      <div class="w-50">
        <slot />
      </div>
      <div>
        <v-menu min-width="200px" rounded>
          <template #activator="{ props: propsMenu }">
            <v-btn
              icon
              v-bind="propsMenu"
              size="small"
            >
              <v-avatar
                color="primary"
              >
                <span class="text-h6">{{ initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar
                  color="primary"
                >
                  <span class="text-h5">{{ initials }}</span>
                </v-avatar>
                <h3>{{ fullName }}</h3>
                <p class="text-caption mt-1">
                  {{ email }}
                </p>
                <v-divider class="my-3" />
                <v-btn
                  variant="text"
                  @click="disconnect"
                >
                  Disconnect
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-card>
</template>

<script setup>
  import { useAppStore } from '@/stores'

  const { isSchoolAppComputed } = storeToRefs(useAppStore())

  const router = useRouter()
  const props = defineProps(['title', 'class'])
  const emit = defineEmits(['click-menu'])
  const clickMenu = () => {
    emit('click-menu')
  }
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}

  const initials = computed(() => {
    return `${user.first_name[0]}${user.last_name[0]}`
  })
  const fullName = computed(() => {
    return `${user.first_name} ${user.last_name}`
  })
  const email = computed(() => {
    return user.email
  })
  const disconnect = () => {
    localStorage.clear()
    if (isSchoolAppComputed.value) {
      router.push({ name: 'LoginSchool' })
      return
    }

    router.push({ name: 'LoginProperty' })
  }
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
