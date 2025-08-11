<template>
  <div class="app-wrapper">
    <div>
      <BaseHeader title="Progress report management">
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
          <v-col cols="12" sm="4">
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
          <v-col cols="12" sm="4">
            <v-select
              v-model="filter.student_id"
              clearable
              density="compact"
              hide-details="auto"
              :item-title="({ user })=> `${user?.first_name || 'Unknown'} ${user?.last_name || 'user'}`"
              item-value="user.id"
              :items="users"
              label="Student"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="4">
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
        </v-row>
      </v-card>
    </div>

    <!-- Table -->
    <div class="bottom">
      <DataTable
        v-model:options="options"
        :headers="headers"
        :items="reports"
        :items-length="totalCount"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
        <template #[`item.studentName`]="{ item }">
          {{ item.student.first_name }} {{ item.student.last_name }}
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

  <ReportFormDialog
    v-if="isShowDialog"
    v-model="isShowDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import ReportFormDialog from '@/components/ReportFormDialog.vue'
  import { useReportStore, useSubjectStore, useUserStore } from '@/stores'

  const { fetchReports, deleteReport } = useReportStore()
  const { fetchSubjects } = useSubjectStore()
  const { fetchUsers } = useUserStore()

  const instance = getCurrentInstance()
  const { reports } = storeToRefs(useReportStore())
  const { subjects } = storeToRefs(useSubjectStore())
  const { users } = storeToRefs(useUserStore())
  const headers = ref([
    {
      title: 'Identifier',
      key: 'id',
      sortable: false,
    },
    { title: 'Student', key: 'studentName', sortable: false },
    { title: 'Subject', key: 'subject.name', sortable: false },
    { title: 'Term', key: 'term', sortable: false },
    { title: 'Score', key: 'score', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const filter = ref({
    id: null,
    subject_id: null,
    student_id: null,
    term: null,
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
    await fetchSubjects({ limit: 100 })
    await fetchUsers({ role_id: 4, limit: 100 })
  })
  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { id, ...filters } = filter.value
    const { count } = await fetchReports({ page, limit, ...(id && { id }), ...filters })

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
    editItem.value = { ...item }
    isShowDialog.value = true
  }
  const onDelete = item => {
    instance.root.$confirm({
      title: 'Confirm delete',
      msg: 'Are you sure to delete?',
      agree: async () => {
        await deleteReport(item.id)
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
