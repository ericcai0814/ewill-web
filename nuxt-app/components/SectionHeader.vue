<script setup lang="ts">
interface Props {
  label?: string      // 斜體英文小標
  title: string       // 中文大標
  align?: 'left' | 'center' | 'right'
  titleColor?: 'primary' | 'white'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  titleColor: 'primary'
})

const alignmentClasses = computed(() => {
  switch (props.align) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    default:
      return 'text-center'
  }
})

const titleColorClass = computed(() => {
  return props.titleColor === 'white' ? 'text-white' : 'text-primary-500'
})

const labelColorClass = computed(() => {
  return props.titleColor === 'white' ? 'text-white/80' : 'text-primary-500'
})
</script>

<template>
  <div :class="alignmentClasses" class="mb-8 md:mb-12">
    <!-- 斜體英文小標 -->
    <p
      v-if="label"
      class="font-display text-lg italic mb-2"
      :class="labelColorClass"
    >
      {{ label }}
    </p>
    <!-- 中文大標 -->
    <h2
      class="text-3xl md:text-4xl font-bold"
      :class="titleColorClass"
    >
      {{ title }}
    </h2>
  </div>
</template>
