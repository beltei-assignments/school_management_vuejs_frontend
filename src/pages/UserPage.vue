<template>
  <div class="app-wrapper">
    <div>
      <BaseHeader title="User management">
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
          <v-col cols="12" sm="3">
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
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="filter.email"
              clearable
              density="compact"
              hide-details="auto"
              label="Email"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filter.role_id"
              clearable
              density="compact"
              hide-details="auto"
              item-title="name"
              item-value="id"
              :items="roles"
              label="Role"
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
        :items="users"
        :items-length="totalCount"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
        <template #[`item.role`]="{ item }">
          <v-chip color="primary" variant="flat">
            {{ item.roles[0].name }}
          </v-chip>
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
            :disabled="item.user.id == user?.id"
            icon="mdi-delete"
            variant="text"
            @click="onDelete(item.user.id)"
          />
        </template>
      </DataTable>
    </div>
  </div>

  <UserFormDialog
    v-if="isShowDialog"
    v-model="isShowDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import UserFormDialog from '@/components/UserFormDialog.vue'
  import { useRoleStore, useUserStore } from '@/stores'
  const { fetchUsers, deleteUser } = useUserStore()
  const { fetchRoles } = useRoleStore()

  const instance = getCurrentInstance()
  const { users } = storeToRefs(useUserStore())
  const { roles } = storeToRefs(useRoleStore())
  const headers = ref([
    {
      title: 'Identifier',
      key: 'user.id',
      sortable: false,
    },
    { title: 'First name', key: 'user.first_name', sortable: false },
    { title: 'Last name', key: 'user.last_name', sortable: false },
    { title: 'Email', key: 'user.email', sortable: false },
    { title: 'Phone number', key: 'user.phone_number', sortable: false },
    { title: 'Role', key: 'role', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const filter = ref({
    id: null,
    name: '',
    email: '',
    role_id: null,
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
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}

  onMounted(async () => {
    await fetchRoles({ limit: 100 })
  })

  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { count } = await fetchUsers({ page, limit, ...filter.value })

    totalCount.value = count
  }
  const clearFilter = async () => {
    filter.value = {
      id: null,
      name: '',
      email: '',
    }
    await search()
  }
  const onCreate = () => {
    editItem.value = null
    isShowDialog.value = true
  }
  const onEdit = item => {
    const { user } = item
    editItem.value = {
      ...editItem.value,
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role_id: item.roles[0].id,
    }
    isShowDialog.value = true
  }
  const onDelete = id => {
    instance.root.$confirm({
      title: 'Confirm delete',
      msg: 'Are you sure to delete?',
      agree: async () => {
        await deleteUser(id)
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
