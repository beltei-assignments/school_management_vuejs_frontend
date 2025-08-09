<template>
  <v-dialog max-width="900" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.first_name"
                clearable
                density="comfortable"
                label="First name *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.last_name"
                clearable
                density="comfortable"
                label="Last name *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.email"
                clearable
                density="comfortable"
                label="Email *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                autocomplete="current-password"
                class="text-black"
                clearable
                density="comfortable"
                :label="isCreated ? 'Password *' : 'Password'"
                :rules="[isCreated ? FORM_RULES.required: true]"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.phone_number"
                clearable
                density="comfortable"
                label="Phone number *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.role_id"
                clearable
                density="comfortable"
                hide-details="auto"
                item-title="name"
                item-value="id"
                :items="roles"
                label="Role"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn color="error" text="Close" variant="tonal" @click="close" />

        <v-btn
          class="text-none"
          color="primary"
          text="Save"
          variant="flat"
          @click="save"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useRoleStore, useUserStore } from '@/stores/index.js'

  import { FORM_RULES } from '@/validators/form-rules.js'

  const { createUser, updateUser } = useUserStore()
  const { roles } = storeToRefs(useRoleStore())

  const emit = defineEmits(['update:modelValue', 'load'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object,
      required: false,
      default: () => ({
        name: '',
      }),
    },
  })
  const instance = getCurrentInstance()
  const formRef = ref(null)
  const form = ref({
    first_name: props.form?.first_name || '',
    last_name: props.form?.last_name || '',
    email: props.form?.email || '',
    phone_number: props.form?.phone_number || '',
    role_id: props.form?.role_id || null,
    password: '',
  })
  const showPassword = ref(false)
  const isCreated = ref(props.form ? false : true)
  const title = ref(isCreated.value ? 'Create new user' : 'Edit user')

  // method
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      const { role_id, ...data } = form.value
      const payload = {
        ...data,
        roles_ids: [
          role_id,
        ],
      }
      await (isCreated.value ? createUser(payload) : updateUser(props.form.id, payload))
      instance.root.$notif('Successful saved', { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || 'Occurred error', { type: 'error' })
    }
  }
</script>
