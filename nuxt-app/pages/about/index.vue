<script setup lang="ts">
import { useContent } from '~/composables/useContent'

interface AboutPageContent {
  seo: {
    title: string
    description: string
  }
  layout: {
    hero?: {
      image?: {
        desktop: string
        mobile?: string
        alt: string
      }
    }
    sections: Array<{
      type: string
      content?: string
      label?: string
      title?: string
      image_id?: string
    }>
  }
}

const { pageContent, findAssetById, loading, error } = useContent<AboutPageContent>('about_us')

useSeoMeta({
  title: () => pageContent.value?.seo.title || '關於鎰威 - 鎰威科技',
  description: () => pageContent.value?.seo.description || '',
})

const getImagePath = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.normalized_path || ''
}

const getImageAlt = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.alt || ''
}

// Parse sections into structured blocks
const parsedSections = computed(() => {
  if (!pageContent.value?.layout.sections) return []

  const blocks: Array<{
    type: 'intro' | 'milestones' | 'certificates'
    label?: string
    title?: string
    content?: string
    images: Array<{ src: string; alt: string; isMobile?: boolean }>
  }> = []

  let currentBlock: typeof blocks[0] | null = null

  for (const section of pageContent.value.layout.sections) {
    if (section.type === 'text' && section.label) {
      // Start a new block
      if (currentBlock) {
        blocks.push(currentBlock)
      }

      let blockType: 'intro' | 'milestones' | 'certificates' = 'intro'
      if (section.label?.toLowerCase().includes('milestone')) {
        blockType = 'milestones'
      } else if (section.label?.toLowerCase().includes('certification')) {
        blockType = 'certificates'
      }

      currentBlock = {
        type: blockType,
        label: section.label,
        title: section.title,
        content: section.content,
        images: []
      }
    } else if (section.type === 'image' && section.image_id && currentBlock) {
      const isMobile = section.image_id.includes('_m') || section.image_id.endsWith('_m')
      currentBlock.images.push({
        src: getImagePath(section.image_id),
        alt: getImageAlt(section.image_id),
        isMobile
      })
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock)
  }

  return blocks
})

// Get desktop-only images for a block
const getDesktopImages = (images: Array<{ src: string; alt: string; isMobile?: boolean }>) => {
  return images.filter(img => !img.isMobile)
}

// Get mobile-only images for a block
const getMobileImages = (images: Array<{ src: string; alt: string; isMobile?: boolean }>) => {
  return images.filter(img => img.isMobile)
}
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p class="text-gray-500">載入中...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <p class="text-red-500 text-xl mb-4">載入失敗</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="pageContent">
      <!-- Hero Banner -->
      <section v-if="pageContent.layout.hero?.image" class="relative">
        <picture>
          <source
            v-if="pageContent.layout.hero.image.mobile"
            :srcset="pageContent.layout.hero.image.mobile"
            media="(max-width: 768px)"
          />
          <img
            :src="pageContent.layout.hero.image.desktop"
            :alt="pageContent.layout.hero.image.alt || '關於鎰威'"
            class="w-full h-auto"
          />
        </picture>
      </section>

      <!-- Dynamic Sections -->
      <template v-for="(block, index) in parsedSections" :key="index">
        <!-- Company Intro Section -->
        <SectionBlock
          v-if="block.type === 'intro'"
          :label="block.label"
          :title="block.title"
          centered
        >
          <div class="max-w-4xl mx-auto">
            <p v-if="block.content" class="text-gray-600 text-lg leading-relaxed text-center mb-12">
              {{ block.content }}
            </p>

            <!-- Desktop Images -->
            <div class="hidden md:block space-y-8">
              <img
                v-for="(img, imgIndex) in getDesktopImages(block.images)"
                :key="imgIndex"
                :src="img.src"
                :alt="img.alt"
                class="w-full h-auto rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>

            <!-- Mobile Images -->
            <div class="md:hidden space-y-6">
              <img
                v-for="(img, imgIndex) in getMobileImages(block.images)"
                :key="imgIndex"
                :src="img.src"
                :alt="img.alt"
                class="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </SectionBlock>

        <!-- Milestones Section -->
        <SectionBlock
          v-else-if="block.type === 'milestones'"
          :label="block.label"
          :title="block.title"
          centered
          class="bg-gray-50"
        >
          <div class="max-w-5xl mx-auto">
            <!-- Desktop Timeline -->
            <div class="hidden md:block space-y-8">
              <img
                v-for="(img, imgIndex) in getDesktopImages(block.images)"
                :key="imgIndex"
                :src="img.src"
                :alt="img.alt"
                class="w-full h-auto"
                loading="lazy"
              />
            </div>

            <!-- Mobile Timeline -->
            <div class="md:hidden space-y-4">
              <img
                v-for="(img, imgIndex) in getMobileImages(block.images)"
                :key="imgIndex"
                :src="img.src"
                :alt="img.alt"
                class="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </SectionBlock>

        <!-- Certificates Carousel Section -->
        <SectionBlock
          v-else-if="block.type === 'certificates'"
          :label="block.label"
          :title="block.title"
          centered
        >
          <div class="max-w-3xl mx-auto">
            <ImageCarousel
              v-if="getDesktopImages(block.images).length > 0"
              :images="getDesktopImages(block.images)"
              :auto-play="true"
              :interval="5000"
              class="hidden md:block"
            />
            <ImageCarousel
              v-if="getMobileImages(block.images).length > 0"
              :images="getMobileImages(block.images)"
              :auto-play="true"
              :interval="5000"
              class="md:hidden"
            />
            <!-- Fallback if no mobile images -->
            <ImageCarousel
              v-else-if="getDesktopImages(block.images).length > 0"
              :images="getDesktopImages(block.images)"
              :auto-play="true"
              :interval="5000"
              class="md:hidden"
            />
          </div>
        </SectionBlock>
      </template>

      <!-- CTA Section -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-500 py-16 md:py-20">
        <div class="container mx-auto px-4 md:px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            想了解更多關於鎰威科技？
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            歡迎與我們聯繫，讓專業團隊為您服務。
          </p>
          <NuxtLink
            to="/contact/"
            class="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            聯絡我們
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
