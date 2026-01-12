<script setup lang="ts">
import { eventsRoutes } from '~/composables/useRoutes'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const routeConfig = computed(() => eventsRoutes[slug.value])
</script>

<template>
  <ProductPage
    v-if="routeConfig"
    :content-slug="routeConfig.contentSlug"
    :product-name="routeConfig.productName"
  />
  <div v-else class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p class="text-gray-500 mb-8">頁面不存在</p>
      <NuxtLink to="/" class="text-primary-500 hover:underline">
        返回首頁
      </NuxtLink>
    </div>
  </div>
</template>
