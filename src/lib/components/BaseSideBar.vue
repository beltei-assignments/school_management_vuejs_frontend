<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    :rail="props.rail"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        title="John Leider"
      >
        <!-- <template #append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          />
        </template> -->
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="menu in menus"
        :key="menu.title"
        color="primary"
        :prepend-icon="menu.icon"
        :title="menu.title"
        :to="menu.link"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { defineProps, ref } from 'vue'

  const props = defineProps({
    menus: {
      type: Array,
      required: false,
      default: () => [],
    },
    rail: {
      type: Boolean,
      required: true,
    },
  })
  const drawer = ref(true)
  // const menus = ref(true)
  // const rail = ref(true)

</script>

<!-- <script setup>
  import { defineProps } from 'vue'
  defineProps(['menus'])
</script>

<style scoped>
  .label {
    font-size: 12px;
  }
</style> -->
