<template>
  <div class="app-wrapper">
    <div>
      <BaseHeader title="Schedule management">
        <v-btn
          v-if="isFilter"
          class="text-none mr-2"
          color="error"
          prepend-icon="mdi-filter-remove-outline"
          variant="outlined"
          @click="clearFilter"
        >
          Clear
        </v-btn>

        <v-btn
          class="text-none mr-2"
          color="warning"
          prepend-icon="mdi-filter-outline"
          :variant="isFilter ? 'flat' : 'outlined'"
          @click="isFilter = !isFilter"
        >
          Filter
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          prepend-icon="mdi-plus"
          @click="onCreate"
        >
          Create
        </v-btn>
      </BaseHeader>

      <!-- Filter -->
      <v-card v-if="isFilter" class="mb-2 pa-3" rounded="3">
        <v-row dense>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="filter.id"
              clearable
              density="compact"
              hide-details="auto"
              label="Identifier"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filter.class_id"
              clearable
              density="compact"
              hide-details="auto"
              item-title="name"
              item-value="id"
              :items="classes"
              label="Class"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filter.subject_id"
              clearable
              density="compact"
              hide-details="auto"
              item-title="name"
              item-value="id"
              :items="subjects"
              label="Subject"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filter.teacher_id"
              clearable
              density="compact"
              hide-details="auto"
              :item-title="({ user })=> `${user?.first_name || 'Unknown'} ${user?.last_name || 'user'}`"
              item-value="user.id"
              :items="users"
              label="Teacher"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- Table -->
    <div class="bottom">
      <DataTable
        v-model:options="options"
        :headers="headers"
        :items="schedules"
        :items-length="totalCount"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
        <template #[`item.scheduleId`]="{ item }">
          {{ getId(item) }}
        </template>
        <template #[`item.teacherName`]="{ item }">
          {{ item.teacher.first_name }} {{ item.teacher.last_name }}
        </template>
        <template #[`item.day`]="{ item }">
          {{ getDay(item) }}
        </template>
        <template #[`item.time`]="{ item }">
          {{ getTime(item) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon-btn
            color="warning"
            icon="mdi-pencil"
            variant="text"
            @click="onEdit(item)"
          />
          <v-icon-btn
            color="error"
            icon="mdi-delete"
            variant="text"
            @click="onDelete(item)"
          />
        </template>
      </DataTable>
    </div>
  </div>

  <ScheduleFormDialog
    v-if="isShowDialog"
    v-model="isShowDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import ScheduleFormDialog from '@/components/ScheduleFormDialog.vue'
  import { useClassStore, useScheduleStore, useSubjectStore, useUserStore } from '@/stores'

  const { fetchSchedules, deleteSchedule } = useScheduleStore()
  const { fetchClasses } = useClassStore()
  const { fetchSubjects } = useSubjectStore()
  const { fetchUsers } = useUserStore()

  const instance = getCurrentInstance()
  const { schedules } = storeToRefs(useScheduleStore())
  const { classes } = storeToRefs(useClassStore())
  const { subjects } = storeToRefs(useSubjectStore())
  const { users } = storeToRefs(useUserStore())
  const headers = ref([
    {
      title: 'Identifier',
      key: 'scheduleId',
      sortable: false,
    },
    { title: 'Class', key: 'class_.name', sortable: false },
    { title: 'Subject', key: 'subject.name', sortable: false },
    { title: 'Teacher', key: 'teacherName', sortable: false },
    { title: 'Day', key: 'day', sortable: false },
    { title: 'Time', key: 'time', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const filter = ref({
    id: null,
    class_id: null,
    subject_id: null,
    teacher_id: null,
  })
  const isFilter = ref(false)
  const totalCount = ref(0)
  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })
  const isShowDialog = ref(false)
  const editItem = ref(null)
  onMounted(async () => {
    await fetchClasses({ limit: 100 })
    await fetchSubjects({ limit: 100 })
    await fetchUsers({ role_id: 2, limit: 100 })
  })
  const getId = item => {
    return item.schedules[0]?.id || ''
  }
  const getDay = item => {
    return item.schedules[0]?.day_of_week
  }
  const getTime = item => {
    const { start_time, end_time } = item.schedules[0]

    const startDate = new Date(start_time.replace(' ', 'T')) // make it ISO format
    const startTime = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const endDate = new Date(end_time.replace(' ', 'T')) // make it ISO format
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    return `${startTime} to ${endTime}`
  }
  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { count } = await fetchSchedules({ page, limit, ...filter.value })

    totalCount.value = count
  }
  const clearFilter = async () => {
    filter.value = {
      id: null,
      class_id: null,
      subject_id: null,
      teacher_id: null,
    }
    await search()
  }
  const onCreate = () => {
    editItem.value = null
    isShowDialog.value = true
  }
  const onEdit = item => {
    const { class_id, subject_id, teacher_id, schedules } = item
    const id = schedules[0].id

    editItem.value = {
      id, class_id, subject_id, teacher_id,
      day_of_week: schedules[0]?.day_of_week || null,
      start_time: schedules[0]?.start_time ? new Date(schedules[0].start_time).toTimeString().slice(0, 5) : null,
      end_time: schedules[0]?.end_time ? new Date(schedules[0].end_time).toTimeString().slice(0, 5) : null,
    }
    isShowDialog.value = true
  }
  const onDelete = item => {
    const id = item.schedules[0].id
    instance.root.$confirm({
      title: 'Confirm delete',
      msg: 'Are you sure to delete?',
      agree: async () => {
        await deleteSchedule(id)
        instance.root.$notif('Successful deleted', { type: 'success' })
        await search()
      },
    })
  }
</script>

<style scoped>
  .app-wrapper {
    height: 88.5vh;
    display: flex;
    flex-direction: column;
  }
  .bottom {
    flex: 1;
    overflow: auto;
  }
</style>
