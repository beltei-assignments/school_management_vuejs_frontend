<template>
  <div class="app-wrapper">
    <div>
      <BaseHeader title="Class management">
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
          <v-col cols="12" sm="6">
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
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="filter.name"
              clearable
              density="compact"
              hide-details="auto"
              label="Name"
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
        :items="classes"
        :items-length="totalCount"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
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
          />
        </template>
      </DataTable>
    </div>
  </div>

  <ClassFormDialog
    v-if="isShowDialog"
    v-model="isShowDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import ClassFormDialog from '@/components/ClassFormDialog.vue'
  import { useClassStore } from '@/stores'
  const { fetchClasses } = useClassStore()

  const { classes } = storeToRefs(useClassStore())
  const headers = ref([
    {
      title: 'Identifier',
      key: 'id',
      sortable: false,
    },
    { title: 'Name', key: 'name', sortable: false },
    // {
    //   title: 'Date creation',
    //   key: 'createdAt',
    //   value: ({ createdAt }) => format(createdAt, 'dd-MM-yyyy HH:mm'),
    // },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const filter = ref({
    id: '',
    name: '',
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

  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { count } = await fetchClasses({ page, limit, ...filter.value })

    totalCount.value = count
  }
  const clearFilter = async () => {
    filter.value = {
      id: '',
      name: '',
    }
    await search()
  }
  const onCreate = () => {
    editItem.value = null
    isShowDialog.value = true
  }
  const onEdit = item => {
    editItem.value = item
    isShowDialog.value = true
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
