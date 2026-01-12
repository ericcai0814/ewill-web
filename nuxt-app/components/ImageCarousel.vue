<script setup lang="ts">
interface CarouselImage {
  src: string
  alt: string
}

const props = defineProps<{
  images: CarouselImage[]
  autoPlay?: boolean
  interval?: number
}>()

const currentIndex = ref(0)
const isTransitioning = ref(false)

// Auto play
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const startAutoPlay = () => {
  if (props.autoPlay && props.images.length > 1) {
    autoPlayTimer = setInterval(() => {
      next()
    }, props.interval || 4000)
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const next = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

const prev = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

const goTo = (index: number) => {
  if (isTransitioning.value || index === currentIndex.value) return
  isTransitioning.value = true
  currentIndex.value = index
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <!-- Slides -->
    <div class="relative aspect-[4/3] md:aspect-[16/9]">
      <TransitionGroup name="fade">
        <img
          v-for="(image, index) in images"
          v-show="index === currentIndex"
          :key="index"
          :src="image.src"
          :alt="image.alt"
          class="absolute inset-0 w-full h-full object-contain bg-gray-50"
        />
      </TransitionGroup>
    </div>

    <!-- Navigation Arrows -->
    <template v-if="images.length > 1">
      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all"
        @click="prev"
        aria-label="上一張"
      >
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all"
        @click="next"
        aria-label="下一張"
      >
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </template>

    <!-- Dots Indicator -->
    <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, index) in images"
        :key="index"
        class="w-2.5 h-2.5 rounded-full transition-all"
        :class="index === currentIndex ? 'bg-primary-500 w-6' : 'bg-white/60 hover:bg-white/80'"
        @click="goTo(index)"
        :aria-label="`前往第 ${index + 1} 張`"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
