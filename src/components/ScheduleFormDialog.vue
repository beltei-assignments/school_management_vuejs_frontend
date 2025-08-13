<template>
  <v-dialog max-width="900" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="4">
              <v-select
                v-model="form.class_id"
                clearable
                density="comfortable"
                item-title="name"
                item-value="id"
                :items="classes"
                label="Class *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="4">
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
            <v-col cols="4">
              <v-select
                v-model="form.teacher_id"
                clearable
                density="comfortable"
                :item-title="({ user })=> `${user?.first_name || 'Unknown'} ${user?.last_name || 'user'}`"
                item-value="user.id"
                :items="users"
                label="Teacher *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="form.day_of_week"
                clearable
                density="comfortable"
                :items="daysOfWeek"
                label="Day *"
                :rules="[FORM_RULES.required]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                append-inner-icon="mdi-clock-time-four-outline"
                clearable
                density="comfortable"
                label="Start time *"
                :model-value="form.start_time"
                readonly
                :rules="[FORM_RULES.required]"
                variant="outlined"
              >
                <v-menu
                  v-model="showStartTime"
                  activator="parent"
                  :close-on-content-click="false"
                  min-width="0"
                >
                  <v-time-picker v-model="form.start_time" />
                </v-menu>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                append-inner-icon="mdi-clock-time-four-outline"
                clearable
                density="comfortable"
                label="End time *"
                :model-value="form.end_time"
                readonly
                :rules="[FORM_RULES.required]"
                variant="outlined"
              >
                <v-menu
                  v-model="showEndTime"
                  activator="parent"
                  :close-on-content-click="false"
                  min-width="0"
                >
                  <v-time-picker v-model="form.end_time" />
                </v-menu>
              </v-text-field>
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
  import { useClassStore, useScheduleStore, useSubjectStore, useUserStore } from '@/stores'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const { createSchedule, updateSchedule, checkSchedule } = useScheduleStore()
  const { fetchClasses } = useClassStore()
  const { fetchSubjects } = useSubjectStore()
  const { fetchUsers } = useUserStore()

  const { daysOfWeek } = storeToRefs(useScheduleStore())
  const { classes } = storeToRefs(useClassStore())
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
    class_id: props.form?.class_id || null,
    subject_id: props.form?.subject_id || null,
    teacher_id: props.form?.teacher_id || null,
    day_of_week: props.form?.day_of_week || null,
    start_time: props.form?.start_time || null,
    end_time: props.form?.end_time || null,
  })
  const isCreated = ref(props.form ? false : true)
  const title = ref(isCreated.value ? 'Create new schedule' : 'Edit schedule')
  const showStartTime = ref(false)
  const showEndTime = ref(false)

  // method
  onMounted(async () => {
    await fetchClasses({ limit: 100 })
    await fetchSubjects({ limit: 100 })
    await fetchUsers({ role_id: 2, limit: 100 })
  })
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    const { day_of_week, start_time, end_time, teacher_id, ...data } = form.value

    // Create Date objects for today
    const startDate = new Date()
    const endDate = new Date()

    // Parse hours and minutes
    const [startHours, startMinutes] = start_time.split(':').map(Number)
    const [endHours, endMinutes] = end_time.split(':').map(Number)

    // Set time
    startDate.setUTCHours(startHours, startMinutes, 0, 0)
    endDate.setUTCHours(endHours, endMinutes, 0, 0)

    const payload = {
      teacher_id,
      schedules: [
        {
          day_of_week,
          start_time: startDate,
          end_time: endDate,
        },
      ],
      ...data,
    }

    const { data: { is_found } } = await checkSchedule({
      teacher_id,
      day_of_week,
      ...(props?.form?.id && { not_schedule_id: props.form.id }),
    })

    if (is_found) {
      instance.root.$confirm({
        title: 'Confirm schedule',
        msg: 'Do you want to assign teacher in the same day?',
        options: { type: 'warning' },
        agree: async () => {
          await submit(payload)
        },
      })
    } else {
      await submit(payload)
    }
  }
  const submit = async payload => {
    try {
      await (isCreated.value ? createSchedule(payload) : updateSchedule(props.form.id, payload))
      instance.root.$notif('Successful saved', { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || 'Occurred error', { type: 'error' })
    }
  }
</script>
