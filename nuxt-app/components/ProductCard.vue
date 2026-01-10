<script setup lang="ts">
interface Props {
  title: string
  description?: string
  image?: string
  imageAlt?: string
  url?: string
  tags?: string[]
}

const props = defineProps<Props>()

// 預設圖片
const imageSrc = computed(() => props.image || '/assets/placeholder.png')
const altText = computed(() => props.imageAlt || props.title)
</script>

<template>
  <component
    :is="url ? 'NuxtLink' : 'div'"
    :to="url"
    class="card group block"
  >
    <!-- 圖片 -->
    <div class="relative overflow-hidden rounded-lg mb-4">
      <img
        :src="imageSrc"
        :alt="altText"
        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <!-- 標籤 -->
      <div v-if="tags && tags.length > 0" class="absolute top-3 left-3 flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2 py-1 text-xs font-medium bg-primary-500/90 text-white rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 內容 -->
    <div>
      <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
        {{ title }}
      </h3>
      <p v-if="description" class="text-gray-600 text-sm line-clamp-2">
        {{ description }}
      </p>
    </div>

    <!-- 連結箭頭 -->
    <div v-if="url" class="mt-4 flex items-center text-primary-500 text-sm font-medium">
      <span>了解更多</span>
      <svg
        class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </component>
</template>
