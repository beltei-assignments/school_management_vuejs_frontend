<template>
  <div class="app-wrapper">
    <div>
      <BaseHeader title="Property management">
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
          <v-col cols="12" sm="2">
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
          <v-col cols="12" sm="2">
            <v-select
              v-model="filter.type"
              class="text-capitalize"
              clearable
              density="compact"
              hide-details="auto"
              :items="types"
              label="Type"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="filter.search"
              clearable
              density="compact"
              hide-details="auto"
              label="Search"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="filter.price_from"
              clearable
              density="compact"
              hide-details="auto"
              label="Price from ($)"
              type="number"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="filter.price_to"
              clearable
              density="compact"
              hide-details="auto"
              label="Price to ($)"
              type="number"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-select
              v-model="filter.status"
              class="text-capitalize"
              clearable
              density="compact"
              hide-details="auto"
              :items="statuses"
              label="Status"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="filter.location"
              clearable
              density="compact"
              hide-details="auto"
              label="Location"
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
        :items="properties"
        :items-length="totalCount"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
        <template #[`item.photo`]="{ item }">
          <v-img
            aspect-ratio="16/9"
            class="my-2"
            :height="150"
            :src="item.image ? getImageURL(item.image) : realEstateLogo"
            :width="150"
          />
        </template>
        <template #[`item.typeProperty`]="{ item }">
          <v-chip class="text-capitalize" color="warning" variant="flat">
            {{ item.type }}
          </v-chip>
        </template>
        <template #[`item.propertyPrice`]="{ item }">
          <span class="font-weight-bold">$ {{ Number(item.price).toFixed(2) }}</span>
        </template>
        <template #[`item.statusProperty`]="{ item }">
          <v-chip class="text-capitalize" color="primary" variant="flat">
            {{ item.status }}
          </v-chip>
        </template>
        <template #[`item.managerName`]="{ item }">
          {{ item.manager.first_name }} {{ item.manager.last_name }}
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
            @click="onDelete(item.id)"
          />
        </template>
      </DataTable>
    </div>
  </div>

  <PropertyFormDialog
    v-if="isShowDialog"
    v-model="isShowDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import realEstateLogo from '@/assets/images/real-estate-logo.jpg'
  import PropertyFormDialog from '@/components/PropertyFormDialog.vue'
  import { usePropertyStore, useUserStore } from '@/stores'
  const { fetchProperties, deleteProperty } = usePropertyStore()
  const { fetchUsers } = useUserStore()
  const PROPERTY_BASE_URL = import.meta.env.VUE_APP_PROPERTY_BASE_URL || 'http://localhost:8080'

  const instance = getCurrentInstance()
  const { properties, types, statuses } = storeToRefs(usePropertyStore())
  const headers = ref([
    {
      title: '',
      key: 'photo',
      sortable: false,
    },
    {
      title: 'Identifier',
      key: 'id',
      sortable: false,
    },
    { title: 'Type', key: 'typeProperty', sortable: false },
    { title: 'Title', key: 'title', sortable: false },
    { title: 'Price', key: 'propertyPrice', sortable: false },
    { title: 'Status', key: 'statusProperty', sortable: false },
    { title: 'Location', key: 'location', sortable: false },
    { title: 'Manager', key: 'managerName', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const filter = ref({
    id: null,
    type: '',
    status: '',
    search: '',
    location: '',
    price_from: null,
    price_to: null,
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
    await fetchUsers({ role_id: 2, limit: 100 })
  })

  const getImageURL = url => {
    return PROPERTY_BASE_URL + url
  }
  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { price_from, price_to, ...filters } = filter.value
    const { count } = await fetchProperties({ page, limit, ...(price_from && { price_from }), ...(price_to && { price_to }), ...filters })

    totalCount.value = count
  }
  const clearFilter = async () => {
    filter.value = {
      id: null,
      type: '',
      status: '',
      search: '',
      location: '',
      price_from: null,
      price_to: null,
    }
    await search()
  }
  const onCreate = () => {
    editItem.value = null
    isShowDialog.value = true
  }
  const onEdit = item => {
    const { manager, ...data } = item
    editItem.value = {
      ...data,
      manager_id: manager.id,
    }
    isShowDialog.value = true
  }
  const onDelete = id => {
    instance.root.$confirm({
      title: 'Confirm delete',
      msg: 'Are you sure to delete?',
      agree: async () => {
        await deleteProperty(id)
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
