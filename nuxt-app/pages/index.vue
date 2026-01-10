<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: '鎰威科技 | 企業資安與智慧製造數位轉型專家',
  description:
    '鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。提供從規劃到導入的一站式解決方案。',
  ogTitle: '鎰威科技 | 企業資安與智慧製造數位轉型專家',
  ogDescription:
    '鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。',
  ogImage: '/assets/home-banner-1209.png',
})

// Services Data
const services = [
  {
    id: 'software',
    title: '軟體開發服務',
    description:
      '結合 SSDLC 和 V-model 流程，從需求到部署貫穿安全測試，確保系統高穩定性和可靠性，實現高效、安全的數位轉型。',
    image: '/assets/whatweoffer_card_1.png',
    link: '/services/#software_development',
  },
  {
    id: 'security',
    title: '資訊安全服務',
    description:
      '透過多項資安工具進行評級檢測、弱點掃描和日誌管理，提供端點安全、網路防護，確保企業系統穩定與數據安全。',
    image: '/assets/whatweoffer_card_2.png',
    link: '/services/#security_services',
  },
  {
    id: 'system',
    title: '系統規劃服務',
    description:
      '提供 Ubuntu、VMware 和 Proxmox VE 三大虛擬化方案，具備靈活性、安全性與高效資源管理，滿足企業多樣需求。',
    image: '/assets/whatweoffer_card_3.png',
    link: '/services/#system_planning',
  },
]

// Solutions Data
const solutions = [
  {
    id: 'smart',
    title: '智慧管理',
    description:
      '提供 3D 數位戰情儀表板、承商管理系統及環境監測系統，實現數據集中、視覺化管理，提升管理效率與安全性。',
    image: '/assets/solutions_card_1.png',
    link: '/solutions/#smart_management',
  },
  {
    id: 'assess',
    title: '資安評估',
    description:
      '全面盤點企業資訊環境，找出潛在風險與漏洞，掌握現有防護狀況，量化資安成熟度，作為後續強化與改善的依據。',
    image: '/assets/solutions_card_2.png',
    link: '/solutions/#security_assessment',
  },
  {
    id: 'detect',
    title: '資安檢測',
    description:
      '模擬真實攻擊情境，針對系統與應用進行滲透測試與弱點掃描，揭露防線弱點，協助企業主動修補風險。',
    image: '/assets/whatweoffer_card_1.png',
    link: '/solutions/#security_testing',
  },
  {
    id: 'protect',
    title: '資安防護',
    description:
      '導入先進防禦技術，整合端點防護、行為分析、威脅偵測與即時防禦機制，強化資安韌性，快速攔截各類攻擊行為。',
    image: '/assets/whatweoffer_card_2.png',
    link: '/solutions/#security_defense',
  },
  {
    id: 'enhance',
    title: '資安強化',
    description:
      '依評估與檢測結果，制定資安強化計畫，推動弱點修補、教育訓練與自動化防護，強化防禦深度。',
    image: '/assets/whatweoffer_card_3.png',
    link: '/solutions/#security_enhancement',
  },
]

// Popup State
const showPopup = ref(false)

onMounted(() => {
  // First visit popup
  const hasShown = localStorage.getItem('ewill_logsec_popup_shown')
  if (!hasShown) {
    setTimeout(() => {
      showPopup.value = true
    }, 2000)
  }
})

const closePopup = () => {
  showPopup.value = false
  localStorage.setItem('ewill_logsec_popup_shown', 'true')
}
</script>

<template>
  <NuxtLayout>
    <!-- Hero Section -->
    <section class="relative">
      <picture>
        <source media="(max-width: 768px)" srcset="/assets/bn-home-m.jpg" />
        <img
          src="/assets/home-banner-1209.png"
          alt="鎰威科技 - 專業 專注 專精"
          class="w-full h-auto"
        />
      </picture>
    </section>

    <!-- About Section -->
    <section id="about" class="bg-[rgb(248,250,252)] py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6 text-center">
        <p class="section-label">About Us</p>
        <h2 class="section-title">關於我們</h2>
        <p class="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          鎰威科技專注於推動企業數位轉型，結合資訊安全、AI 科技與大數據應用。從架構規劃到服務導入，提供專業高效的一站式安全服務。秉持專業、效率、信任、創新的精神與持續提供優質服務的態度，攜手客戶共同邁向成長與成功。
        </p>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="bg-white py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <p class="section-label">What We Offer</p>
        <h2 class="section-title">服務項目</h2>
        <p class="text-center text-gray-600 max-w-4xl mx-auto mb-12">
          服務項目包含「軟體開發服務」、「資訊安全服務」和「系統規劃服務」，我們以 SSDLC 和 V-model 流程開發安全可靠的應用系統，透過 SecurityScorecard、IST、Acunetix 等工具加強資安防護，並以 Ubuntu、VMware 和 Proxmox VE 提供穩定、高效的系統規劃方案。
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article v-for="service in services" :key="service.id" class="card">
            <img
              :src="service.image"
              :alt="service.title"
              class="card-image"
            />
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ service.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ service.description }}
            </p>
            <NuxtLink :to="service.link" class="text-primary-500 font-medium hover:text-primary-600 transition-colors">
              了解更多 →
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- Solutions Section -->
    <section
      id="solutions"
      class="bg-[rgb(248,250,252)] py-16 md:py-24 relative overflow-hidden"
    >
      <!-- Background Decoration -->
      <div
        class="absolute right-0 bottom-0 w-72 h-72 opacity-20 pointer-events-none"
        style="background: url('/assets/home-bg.png') no-repeat right bottom; background-size: contain;"
      />

      <div class="container mx-auto px-4 md:px-6 relative z-10">
        <p class="section-label">Solutions</p>
        <h2 class="section-title">產品解決方案</h2>
        <p class="text-center text-gray-600 max-w-4xl mx-auto mb-12">
          鎰威科技提供五大解決方案，全面強化企業營運與資安防護。「智慧管理」導入 3D 儀表板、承攬商與環境監控系統，提升管理效率與即時應變能力。
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="solution in solutions" :key="solution.id" class="card">
            <img
              :src="solution.image"
              :alt="solution.title"
              class="card-image"
            />
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ solution.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ solution.description }}
            </p>
            <NuxtLink :to="solution.link" class="text-primary-500 font-medium hover:text-primary-600 transition-colors">
              了解更多 →
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-500 py-16 md:py-20">
      <div class="container mx-auto px-4 md:px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          準備好開始數位轉型了嗎？
        </h2>
        <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          讓鎰威科技成為您的數位轉型夥伴，共同打造安全、高效的企業未來。
        </p>
        <button class="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
          立即諮詢
        </button>
      </div>
    </section>

    <!-- Popup Banner -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showPopup"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          @click.self="closePopup"
        >
          <div class="relative max-w-lg mx-4 animate-scale-in">
            <button
              class="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              @click="closePopup"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <NuxtLink to="/security-solutions/logsec/" @click="closePopup">
              <img
                src="/assets/logsec-popup-829.png"
                alt="LOGSEC 日誌管理解決方案"
                class="rounded-xl shadow-2xl"
              />
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </NuxtLayout>
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

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

