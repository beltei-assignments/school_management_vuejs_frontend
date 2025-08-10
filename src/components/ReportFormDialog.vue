<template>
  <v-dialog max-width="600" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="6">
              <v-select
                v-model="form.student_id"
                clearable
                density="comfortable"
                :item-title="({ user })=> `${user?.first_name || 'Unknown'} ${user?.last_name || 'user'}`"
                item-value="user.id"
                :items="users"
                label="Student *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="form.subject_id"
                clearable
                density="comfortable"
                item-title="name"
                item-value="id"
                :items="subjects"
                label="Subject *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.term"
                clearable
                density="comfortable"
                label="Term *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.score"
                clearable
                density="comfortable"
                label="Score *"
                :rules="[FORM_RULES.required, (v)=> FORM_RULES.minNumber(0, v), (v)=> FORM_RULES.maxNumber(100, v)]"
                type="number"
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
  import { useReportStore, useSubjectStore, useUserStore } from '@/stores'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const { createReport, updateReport } = useReportStore()
  const { fetchSubjects } = useSubjectStore()
  const { fetchUsers } = useUserStore()

  const { subjects } = storeToRefs(useSubjectStore())
  const { users } = storeToRefs(useUserStore())

  const emit = defineEmits(['update:modelValue', 'load'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
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
    student_id: props.form?.student_id || null,
    subject_id: props.form?.subject_id || null,
    term: props.form?.term || null,
    score: props.form?.score || null,
  })
  const isCreated = ref(props.form ? false : true)
  const title = ref(isCreated.value ? 'Create new progress report' : 'Edit progress report')

  // method
  onMounted(async () => {
    await fetchSubjects()
    await fetchUsers({ role_id: 4 })
  })
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      await (isCreated.value ? createReport(form.value) : updateReport(props.form.id, form.value))
      instance.root.$notif('Successful saved', { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || 'Occurred error', { type: 'error' })
    }
  }
</script>
