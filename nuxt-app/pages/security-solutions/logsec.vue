<script setup lang="ts">
import { useContent } from '~/composables/useContent'

interface LogsecPageContent {
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  layout: {
    hero: {
      image: {
        id: string
        desktop: string
        mobile: string
        alt: string
      }
    }
  }
}

const { pageContent, findAssetById, loading, error } = useContent<LogsecPageContent>('logsec')

// SEO Meta
useSeoMeta({
  title: () => pageContent.value?.seo.title || 'LOGSEC',
  description: () => pageContent.value?.seo.description || '',
  ogTitle: () => pageContent.value?.seo.title || 'LOGSEC',
  ogDescription: () => pageContent.value?.seo.description || '',
})

// Sections 結構（根據 index.yml 定義）
const sections = [
  {
    type: 'text',
    label: 'LOGSEC',
    subtitle: '資安預警解決方案',
    title: 'LOGSEC 平台功能概覽',
    content: 'LOGSEC 平台透過行為記錄整合與即時告警機制，協助企業建置完整的操作流程監控與資安事件應對能力。涵蓋系統日誌集中管理、操作軌跡可視化、異常行為即時通報、模組化擴充部署與顧問支援服務，強化企業對內部操作與異常風險的掌握力。',
  },
  { type: 'image', imageId: 'logsec_1_fix' },
  {
    type: 'text',
    title: '整合日誌，安全更清晰',
    content: '客戶設備產生日誌繁多且分散，難以有效追蹤分析。LOGSEC 可將日誌統一整合並圖形化呈現，快速揭露威脅與異常。原本需耗時數小時的檢視，如今僅需數分鐘即可完成，大幅提升資安效率。',
  },
  { type: 'image', imageId: 'logsec_2_fix2' },
  {
    type: 'text',
    title: '全方位登入活動與告警監控',
    content: '即時掌握登入嘗試、失敗與告警異常，提升帳號安全防護。',
  },
  { type: 'image', imageId: 'graylog_7_fix_20250822' },
  {
    type: 'text',
    title: 'LOGSEC 集中式日誌管理方法',
    content: 'LOGSEC 解決方案將 IT 環境中各個部分的日誌數據集中到一個平台，便於組織、豐富和分析。透過整合日誌，您可以真正發揮數據的潛力。',
  },
  { type: 'image', imageId: 'graylog_3' },
  {
    type: 'text',
    title: '快速查詢與視覺化日誌資料',
    content: '支援即時查詢，快速追蹤事件來源與詳情，提高排查效率。',
  },
  { type: 'image', imageId: 'graylog_4_fix_20250822' },
  {
    type: 'text',
    title: '智能異常行為偵測分析',
    content: '精準辨識可疑行為與異常使用者，強化安全監控能力。',
  },
  { type: 'image', imageId: 'graylog_6_fix_20250822' },
  {
    type: 'text',
    title: '封鎖 IP 統計與全球分布圖',
    content: '即時呈現來源國統計與全球封鎖 IP 分佈，強化防禦佈局。',
  },
  { type: 'image', imageId: 'graylog_5_fix_20250822' },
  {
    type: 'text',
    title: '簡化管理，強化防護，一次到位',
    content: '複雜日誌不再困擾，我們以集中化與即時告警，打造防護網，全面守護您的企業安全。',
  },
]

// 取得圖片路徑
const getImagePath = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.normalized_path || ''
}

const getImageAlt = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.alt || ''
}
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
      <section class="relative">
        <picture>
          <source
            v-if="pageContent.layout.hero?.image?.mobile"
            :srcset="pageContent.layout.hero.image.mobile"
            media="(max-width: 768px)"
          />
          <img
            :src="pageContent.layout.hero?.image?.desktop"
            :alt="pageContent.layout.hero?.image?.alt || 'LOGSEC'"
            class="w-full h-auto"
          />
        </picture>
      </section>

      <!-- Main Content -->
      <main class="py-16 md:py-24">
        <div class="container mx-auto px-4 md:px-6">
          <div class="max-w-4xl mx-auto">
            <!-- Sections -->
            <template v-for="(section, index) in sections" :key="index">
              <!-- Text Section -->
              <section
                v-if="section.type === 'text'"
                class="mb-12 md:mb-16"
              >
                <!-- 主標題區塊（第一個 section） -->
                <template v-if="section.label">
                  <div class="text-center mb-8">
                    <h1 class="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                      {{ section.label }}
                    </h1>
                    <p v-if="section.subtitle" class="text-xl text-gray-600 mb-6">
                      {{ section.subtitle }}
                    </p>
                  </div>
                </template>

                <!-- 一般區塊標題 -->
                <h2
                  v-if="section.title && !section.label"
                  class="text-2xl md:text-3xl font-bold text-primary-500 mb-4"
                >
                  {{ section.title }}
                </h2>
                <h3
                  v-else-if="section.title && section.label"
                  class="text-2xl md:text-3xl font-bold text-primary-500 text-center mb-4"
                >
                  {{ section.title }}
                </h3>

                <!-- 內容 -->
                <p class="text-gray-600 text-lg leading-relaxed" :class="{ 'text-center': section.label }">
                  {{ section.content }}
                </p>
              </section>

              <!-- Image Section -->
              <div
                v-else-if="section.type === 'image' && section.imageId"
                class="mb-12 md:mb-16"
              >
                <img
                  :src="getImagePath(section.imageId)"
                  :alt="getImageAlt(section.imageId)"
                  class="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </template>
          </div>
        </div>
      </main>

      <!-- CTA Section -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-500 py-16 md:py-20">
        <div class="container mx-auto px-4 md:px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            想了解更多 LOGSEC 解決方案？
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            讓鎰威科技協助您建立完整的日誌管理與資安預警系統。
          </p>
          <a
            href="mailto:service@ewilltech.com"
            class="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            立即諮詢
          </a>
        </div>
      </section>
    </div>
  </div>
</template>
