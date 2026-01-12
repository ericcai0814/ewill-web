<script setup lang="ts">
import { useContent } from '~/composables/useContent'

interface SolutionsContent {
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

const { pageContent, findAssetById, loading, error } = useContent<SolutionsContent>('solutions')

useSeoMeta({
  title: () => pageContent.value?.seo.title || '產品解決方案 - 鎰威科技',
  description: () => pageContent.value?.seo.description || '',
})

const getImagePath = (imageId: string) => {
  const asset = findAssetById(imageId)
  return asset?.normalized_path || ''
}

// Security service categories with their products
const serviceCategories = [
  {
    id: 'assessment',
    title: '資安評估',
    description: '針對企業資訊環境進行全盤盤點，發掘潛在風險與漏洞',
    icon: '🔍',
    color: 'from-blue-500 to-blue-600',
    products: [
      {
        name: 'SecurityScorecard',
        description: '以非侵入方式持續監控企業資安狀態，提供清晰的資安評級',
        url: '/security-solutions/security-scorecard/',
        image: '/content/assets/securityscorecard_card.jpg'
      }
    ]
  },
  {
    id: 'detection',
    title: '資安檢測',
    description: '模擬真實攻擊情境，揭露資安防線的薄弱處',
    icon: '🛡️',
    color: 'from-green-500 to-green-600',
    products: [
      {
        name: 'Acunetix',
        description: '網站安全掃描工具，偵測 SQL Injection、XSS 等弱點',
        url: '/security-solutions/acunetix/',
        image: '/content/assets/acunetix_card.jpg'
      }
    ]
  },
  {
    id: 'defense',
    title: '資安防禦',
    description: '建立多層次資安防線，有效阻擋外部威脅',
    icon: '🔒',
    color: 'from-red-500 to-red-600',
    products: [
      {
        name: 'Palo Alto Networks',
        description: '次世代防火牆，整合 ZTNA 2.0 與 SD-WAN',
        url: '/security-solutions/palo-alto-networks/',
        image: '/content/assets/paloalto_card.jpg'
      },
      {
        name: 'Fortinet',
        description: '整合資安平台，提供全方位網路安全防護',
        url: '/security-solutions/fortinet/',
        image: '/content/assets/fortinet_card.jpg'
      }
    ]
  },
  {
    id: 'enhancement',
    title: '資安強化',
    description: '持續優化資安架構，提升整體防護能力',
    icon: '⚡',
    color: 'from-purple-500 to-purple-600',
    products: [
      {
        name: 'LOGSEC',
        description: '資安預警解決方案，集中式日誌管理與即時告警',
        url: '/security-solutions/logsec/',
        image: '/content/assets/logsec_card.jpg'
      },
      {
        name: 'IST 端點安全',
        description: '端點安全管理，全面保護企業端點設備',
        url: '/security-solutions/endpoint-security/',
        image: '/content/assets/ist_card.jpg'
      },
      {
        name: 'Array Networks',
        description: 'SSL VPN 解決方案，安全的遠端存取',
        url: '/security-solutions/array-networks/',
        image: '/content/assets/array_card.jpg'
      },
      {
        name: 'Vicarius vRX',
        description: '漏洞風險管理平台，自動化弱點修補',
        url: '/security-solutions/vicarius-vrx/',
        image: '/content/assets/vicarius_card.jpg'
      }
    ]
  }
]
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
            :alt="pageContent.layout.hero.image.alt || '產品解決方案'"
            class="w-full h-auto"
          />
        </picture>
      </section>

      <!-- Intro Section -->
      <SectionBlock label="Security Services" title="資訊安全服務" centered>
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-gray-600 text-lg leading-relaxed">
            鎰威科技提供完整的企業資訊安全服務，涵蓋「資安評估」、「資安檢測」、「資安防禦」和「資安強化」四大服務領域，
            透過專業的技術團隊與國際領先的資安產品，為企業建構全方位的資安防護體系。
          </p>
        </div>
      </SectionBlock>

      <!-- Service Categories -->
      <template v-for="(category, index) in serviceCategories" :key="category.id">
        <section
          class="py-16 md:py-20"
          :class="index % 2 === 1 ? 'bg-gray-50' : 'bg-white'"
        >
          <div class="container mx-auto px-4 md:px-6">
            <!-- Category Header -->
            <div class="flex items-center gap-4 mb-8">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br text-white shadow-lg"
                :class="category.color"
              >
                {{ category.icon }}
              </div>
              <div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
                  {{ category.title }}
                </h2>
                <p class="text-gray-600">{{ category.description }}</p>
              </div>
            </div>

            <!-- Product Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProductCard
                v-for="product in category.products"
                :key="product.name"
                :title="product.name"
                :description="product.description"
                :image="product.image"
                :url="product.url"
              />
            </div>
          </div>
        </section>
      </template>

      <!-- CTA Section -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-500 py-16 md:py-20">
        <div class="container mx-auto px-4 md:px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            需要資安解決方案諮詢？
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            鎰威科技提供完整的資安產品與服務，協助企業建立全方位防護。
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
