<template>
  <div class="d-flex justify-space-between align-center mb-2">
    <p class="font-weight-medium">{{ props.title }}</p>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
  })
</script>
