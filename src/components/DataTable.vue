<template>
  <v-card height="100%" rounded="4">
    <v-data-table-server
      v-bind="$attrs"
      :headers="props.headers"
      :items="$attrs.items"
    >
      <template #[`item.actions`]="{ item }">
        <slot :item="item" name="item.actions" />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
  import { defineProps } from 'vue'
  const props = defineProps({
    headers: {
      type: Array,
      required: true,
    },
  })
</script>

<style scoped>
  ::v-deep(.v-table) {
    height: 100% !important;
  }
  ::v-deep(.v-data-table__thead) {
    background-color: rgb(var(--v-theme-primary), 0.7);
    color: white;
  }
  ::v-deep(.v-data-table-footer) {
    padding-top: 0;
  }
  ::v-deep(.v-table .v-divider) {
    margin: 0;
  }
</style>
