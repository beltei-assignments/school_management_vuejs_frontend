<template>
  <v-dialog max-width="1600" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="5">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.title"
                    clearable
                    density="comfortable"
                    label="Title *"
                    :rules="[FORM_RULES.required]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="form.type"
                    clearable
                    density="comfortable"
                    hide-details="auto"
                    :items="types"
                    label="Type *"
                    :rules="[FORM_RULES.required]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.price"
                    clearable
                    density="comfortable"
                    label="Price *"
                    :rules="[FORM_RULES.required, (v)=> FORM_RULES.minNumber(1, v)]"
                    type="number"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="form.status"
                    clearable
                    density="comfortable"
                    :items="statuses"
                    label="Status *"
                    :rules="[FORM_RULES.required]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="form.manager_id"
                    clearable
                    density="comfortable"
                    :item-title="({ user })=> `${user?.first_name || 'Unknown'} ${user?.last_name || 'user'}`"
                    item-value="user.id"
                    :items="users"
                    label="Manager *"
                    :rules="[FORM_RULES.required]"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.location"
                    label="Location"
                    row-height="25"
                    rows="2"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.description"
                    label="Desciption"
                    row-height="25"
                    rows="2"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="7">
              <v-row dense>
                <v-col class="d-flex justify-space-between align-center" cols="12">
                  <h4>Owner history</h4>
                  <v-btn
                    class="text-none"
                    color="primary"
                    :disabled="isCreated"
                    text="Add owner"
                    variant="flat"
                    @click="onCreateOwner"
                  />
                </v-col>
                <v-col cols="12">
                  <DataTable
                    v-model:options="options"
                    :headers="headers"
                    :items="owners"
                    :items-length="totalCount"
                    :items-per-page-options="[10, 20, 50, 100]"
                    @update:options="loadOwners"
                  >
                    <template #[`item.actions`]="{ item }">
                      <v-icon-btn
                        color="warning"
                        icon="mdi-pencil"
                        variant="text"
                        @click="onEditOwner(item)"
                      />
                      <v-icon-btn
                        color="error"
                        icon="mdi-delete"
                        variant="text"
                        @click="onDeleteOwner(item.id)"
                      />
                    </template>
                  </DataTable>
                </v-col>
              </v-row>
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

  <OwnerFormDialog
    v-if="isShowDialog"
    v-model="isShowDialog"
    :form="editItem"
    :property-id="props.form.id"
    @load="loadOwners"
  />
</template>

<script setup>
  import OwnerFormDialog from '@/components/property/OwnerFormDialog.vue'
  import { usePropertyStore, useUserStore } from '@/stores/index.js'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const { createProperty, updateProperty, fetchOwners, deleteOwner, setOwners } = usePropertyStore()
  const { statuses, types, owners } = storeToRefs(usePropertyStore())
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
      default: () => ({
        name: '',
      }),
    },
  })
  const instance = getCurrentInstance()
  const formRef = ref(null)
  const form = ref({
    title: props.form?.title || '',
    description: props.form?.description || '',
    price: props.form?.price || null,
    location: props.form?.location || '',
    status: props.form?.status || '',
    type: props.form?.type || '',
    manager_id: props.form?.manager_id || null,
  })
  const isCreated = ref(props.form ? false : true)
  const title = ref(isCreated.value ? 'Create new property' : 'Edit property')
  const headers = ref([
    {
      title: 'Identifier',
      key: 'owner.id',
      sortable: false,
    },
    { title: 'First name', key: 'owner.first_name', sortable: false },
    { title: 'Last name', key: 'owner.last_name', sortable: false },
    { title: 'Email', key: 'owner.email', sortable: false },
    { title: 'Ownership start', key: 'ownership_start', sortable: false },
    { title: 'Ownership end', key: 'ownership_end', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const totalCount = ref(0)
  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })
  const isShowDialog = ref(false)
  const editItem = ref(null)

  // method
  const loadOwners = async () => {
    if (isCreated.value) {
      return setOwners([])
    }

    const { page, itemsPerPage: limit } = options.value
    // const { price_from, price_to, ...filters } = filter.value
    const { count } = await fetchOwners({ page, limit, property_id: Number(props.form.id) })

    totalCount.value = count
  }
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      await (isCreated.value ? createProperty(form.value) : updateProperty(props.form.id, form.value))
      instance.root.$notif('Successful saved', { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || 'Occurred error', { type: 'error' })
    }
  }
  const onCreateOwner = () => {
    editItem.value = null
    isShowDialog.value = true
  }
  const onEditOwner = item => {
    editItem.value = {
      ...item,
    }
    isShowDialog.value = true
  }
  const onDeleteOwner = id => {
    instance.root.$confirm({
      title: 'Confirm delete',
      msg: 'Are you sure to delete?',
      agree: async () => {
        await deleteOwner(id)
        instance.root.$notif('Successful deleted', { type: 'success' })
        await loadOwners()
      },
    })
  }
</script>
