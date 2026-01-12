<script setup lang="ts">
defineProps<{
  label?: string
  title?: string
  centered?: boolean
}>()
</script>

<template>
  <section class="py-16 md:py-24">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Section Header -->
      <div v-if="label || title" class="mb-12" :class="{ 'text-center': centered }">
        <p v-if="label" class="text-primary-400 text-lg font-medium mb-2">
          {{ label }}
        </p>
        <h2 v-if="title" class="text-3xl md:text-4xl font-bold text-gray-800">
          {{ title }}
        </h2>
      </div>

      <!-- Content Slot -->
      <slot />
    </div>
  </section>
</template>
