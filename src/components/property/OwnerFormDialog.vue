<template>
  <v-dialog max-width="600" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="form.owner_id"
                clearable
                density="comfortable"
                :item-title="({ user })=> `${user?.first_name || 'Unknown'} ${user?.last_name || 'user'}`"
                item-value="user.id"
                :items="userOwners"
                label="Owner *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-date-input
                v-model="form.ownership_start"
                append-inner-icon="mdi-calendar-range"
                clearable
                density="comfortable"
                label="Start date *"
                prepend-icon=""
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-date-input
                v-model="form.ownership_end"
                append-inner-icon="mdi-calendar-range"
                clearable
                density="comfortable"
                label="End date"
                prepend-icon=""
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
  import { format } from 'date-fns'
  import { usePropertyStore, useUserStore } from '@/stores/index.js'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const { createOwner, updateOwner } = usePropertyStore()
  const { fetchUserOwners } = useUserStore()
  const { userOwners } = storeToRefs(useUserStore())

  const emit = defineEmits(['update:modelValue', 'load'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    propertyId: {
      type: Number,
      required: true,
    },
    form: {
      type: Object,
      required: false,
    },
  })
  const instance = getCurrentInstance()
  const formRef = ref(null)
  const form = ref({
    property_id: props.propertyId,
    owner_id: props.form?.owner_id || null,
    ownership_start: props.form?.ownership_start || null,
    ownership_end: props.form?.ownership_end || null,
  })
  const isCreated = ref(props.form ? false : true)
  const title = ref(isCreated.value ? 'Create new owner' : 'Edit owner')

  // method
  onMounted(async () => {
    await fetchUserOwners()
  })
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    const payload = {
      ...form.value,
      ownership_start: format(new Date(form.value.ownership_start), 'yyyy-MM-dd'),
      ...(form.value.ownership_end && { ownership_end: format(new Date(form.value.ownership_end), 'yyyy-MM-dd') }),
    }

    try {
      await (isCreated.value ? createOwner(payload) : updateOwner(props.form.id, payload))
      instance.root.$notif('Successful saved', { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || 'Occurred error', { type: 'error' })
    }
  }
</script>
