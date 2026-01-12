<script setup lang="ts">
import { useContent } from '~/composables/useContent'

interface Section {
  type: 'text' | 'image'
  content?: string
  title?: string
  image_id?: string
}

interface PageContent {
  slug: string
  module: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  url_mapping: {
    current_url: string
    new_url?: string
  }
  layout: {
    hero?: {
      image?: {
        id: string
        desktop: string
        mobile?: string
        alt: string
      }
    }
    sections: Section[]
  }
}

const props = defineProps<{
  contentSlug: string
  productName: string
}>()

const { pageContent, findAssetById, loading, error } = useContent<PageContent>(props.contentSlug)

// SEO Meta
useSeoMeta({
  title: () => pageContent.value?.seo.title || props.productName,
  description: () => pageContent.value?.seo.description || '',
  ogTitle: () => pageContent.value?.seo.title || props.productName,
  ogDescription: () => pageContent.value?.seo.description || '',
})

// Get image path from asset manifest
const getImagePath = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.normalized_path || ''
}

const getImageAlt = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.alt || ''
}

// Parse markdown-like title (### Title)
const parseTitle = (content: string) => {
  const lines = content.split('\n')
  const titles: string[] = []
  const bodyLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('####')) {
      titles.push(line.replace(/^####\s*/, ''))
    } else if (line.startsWith('###')) {
      titles.push(line.replace(/^###\s*/, ''))
    } else if (line.trim()) {
      bodyLines.push(line)
    }
  }

  return {
    subtitle: titles.length > 1 ? titles[0] : null,
    title: titles.length > 1 ? titles[1] : titles[0] || null,
    body: bodyLines.join('\n')
  }
}

// Check if image is mobile version
const isMobileImage = (imageId: string) => {
  return imageId.includes('_m') || imageId.endsWith('_m') || imageId.includes('_m_')
}

// Group sections, pairing desktop/mobile images
const processedSections = computed(() => {
  if (!pageContent.value?.layout.sections) return []

  const result: Array<{
    type: 'text' | 'image'
    content?: string
    title?: string
    desktopImage?: string
    desktopAlt?: string
    mobileImage?: string
    mobileAlt?: string
  }> = []

  const sections = pageContent.value.layout.sections
  let i = 0

  while (i < sections.length) {
    const section = sections[i]

    if (section.type === 'text') {
      result.push({
        type: 'text',
        content: section.content,
        title: section.title
      })
      i++
    } else if (section.type === 'image' && section.image_id) {
      const imageId = section.image_id
      const isMobile = isMobileImage(imageId)

      // Check if next section is the corresponding desktop/mobile pair
      const nextSection = sections[i + 1]
      const hasNextImage = nextSection?.type === 'image' && nextSection.image_id

      if (!isMobile && hasNextImage && isMobileImage(nextSection.image_id!)) {
        // Desktop image followed by mobile image
        result.push({
          type: 'image',
          desktopImage: getImagePath(imageId),
          desktopAlt: getImageAlt(imageId),
          mobileImage: getImagePath(nextSection.image_id!),
          mobileAlt: getImageAlt(nextSection.image_id!)
        })
        i += 2
      } else if (isMobile && hasNextImage && !isMobileImage(nextSection.image_id!)) {
        // Mobile image followed by desktop (reverse order)
        result.push({
          type: 'image',
          desktopImage: getImagePath(nextSection.image_id!),
          desktopAlt: getImageAlt(nextSection.image_id!),
          mobileImage: getImagePath(imageId),
          mobileAlt: getImageAlt(imageId)
        })
        i += 2
      } else if (!isMobile) {
        // Single desktop image
        result.push({
          type: 'image',
          desktopImage: getImagePath(imageId),
          desktopAlt: getImageAlt(imageId)
        })
        i++
      } else {
        // Single mobile image (use for both)
        result.push({
          type: 'image',
          desktopImage: getImagePath(imageId),
          desktopAlt: getImageAlt(imageId)
        })
        i++
      }
    } else {
      i++
    }
  }

  return result
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p class="text-gray-500">載入中...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <p class="text-red-500 text-xl mb-4">載入失敗</p>
        <p class="text-gray-500">請稍後再試</p>
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
            :alt="pageContent.layout.hero.image.alt || productName"
            class="w-full h-auto"
          />
        </picture>
      </section>

      <!-- Main Content -->
      <main class="py-16 md:py-24">
        <div class="container mx-auto px-4 md:px-6">
          <div class="max-w-4xl mx-auto">
            <!-- Sections -->
            <template v-for="(section, index) in processedSections" :key="index">
              <!-- Text Section -->
              <section
                v-if="section.type === 'text'"
                class="mb-12 md:mb-16"
              >
                <template v-if="section.content">
                  <!-- Parse markdown-like content -->
                  <template v-if="parseTitle(section.content).subtitle">
                    <p class="text-lg text-primary-400 mb-2">
                      {{ parseTitle(section.content).subtitle }}
                    </p>
                  </template>

                  <h2
                    v-if="parseTitle(section.content).title || section.title"
                    class="text-2xl md:text-3xl font-bold text-primary-500 mb-4"
                  >
                    {{ parseTitle(section.content).title || section.title }}
                  </h2>

                  <p class="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                    {{ parseTitle(section.content).body }}
                  </p>
                </template>

                <template v-else-if="section.title">
                  <h2 class="text-2xl md:text-3xl font-bold text-primary-500 mb-4">
                    {{ section.title }}
                  </h2>
                </template>
              </section>

              <!-- Image Section with Responsive Support -->
              <div
                v-else-if="section.type === 'image' && section.desktopImage"
                class="mb-12 md:mb-16"
              >
                <picture>
                  <source
                    v-if="section.mobileImage"
                    :srcset="section.mobileImage"
                    media="(max-width: 768px)"
                  />
                  <img
                    :src="section.desktopImage"
                    :alt="section.desktopAlt || productName"
                    class="w-full h-auto rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </picture>
              </div>
            </template>
          </div>
        </div>
      </main>

      <!-- CTA Section -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-500 py-16 md:py-20">
        <div class="container mx-auto px-4 md:px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            想了解更多{{ productName }}解決方案？
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            讓鎰威科技協助您建立完整的資安防護系統。
          </p>
          <NuxtLink
            to="/contact/"
            class="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            立即諮詢
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
