<script setup lang="ts">
// Footer 連結資料
const footerLinks = {
  services: [
    { text: '軟體開發服務', url: '/services/#software_development' },
    { text: '資訊安全服務', url: '/services/#security_services' },
    { text: '系統規劃服務', url: '/services/#system_planning' }
  ],
  solutions: [
    { text: '智慧管理', url: '/solutions/#smart_management' },
    { text: '資安評估', url: '/solutions/#security_assessment' },
    { text: '資安檢測', url: '/solutions/#security_testing' },
    { text: '資安防護', url: '/solutions/#security_defense' },
    { text: '資安強化', url: '/solutions/#security_enhancement' }
  ],
  products: [
    { text: 'Palo Alto Networks', url: '/palo_alto/' },
    { text: 'Fortinet', url: '/fortinet/' },
    { text: 'LOGSEC', url: '/logsec/' },
    { text: 'Acunetix', url: '/acunetix/' }
  ],
  smartMfg: [
    { text: 'MES 製造系統', url: '/mes/' },
    { text: 'WMS 智慧倉儲', url: '/wms/' },
    { text: 'SCM 智慧供應鏈', url: '/scm/' },
    { text: '數據中台', url: '/data_middleware/' }
  ],
  company: [
    { text: '關於鎰威', url: '/about_us/' },
    { text: 'ESG 永續發展', url: '/esg/' },
    { text: '活動訊息', url: '/event_information/' },
    { text: '聯絡我們', url: '/contact/' }
  ]
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gradient-to-b from-primary-700 to-primary-700/90 text-white">
    <div class="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-3 lg:col-span-1">
          <NuxtLink to="/" class="inline-block mb-4">
            <img
              src="/assets/logo.png"
              alt="鎰威科技"
              class="h-10 w-auto brightness-0 invert"
            />
          </NuxtLink>
          <p class="text-white/80 text-sm leading-relaxed mb-4">
            專業 · 專注 · 專精<br />
            企業數位轉型與資安整合專家
          </p>
          <p class="text-white/60 text-xs">
            PROFESSION · FOCUS · SPECIALIZATION
          </p>
        </div>

        <!-- Services -->
        <div>
          <h4 class="font-semibold text-sm mb-4">服務項目</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.services" :key="link.text">
              <NuxtLink
                :to="link.url"
                class="text-white/70 text-sm hover:text-white transition-colors"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Solutions -->
        <div>
          <h4 class="font-semibold text-sm mb-4">解決方案</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.solutions" :key="link.text">
              <NuxtLink
                :to="link.url"
                class="text-white/70 text-sm hover:text-white transition-colors"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Products -->
        <div>
          <h4 class="font-semibold text-sm mb-4">資安產品</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.products" :key="link.text">
              <NuxtLink
                :to="link.url"
                class="text-white/70 text-sm hover:text-white transition-colors"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Smart Manufacturing -->
        <div>
          <h4 class="font-semibold text-sm mb-4">智慧製造</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.smartMfg" :key="link.text">
              <NuxtLink
                :to="link.url"
                class="text-white/70 text-sm hover:text-white transition-colors"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="font-semibold text-sm mb-4">關於公司</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.company" :key="link.text">
              <NuxtLink
                :to="link.url"
                class="text-white/70 text-sm hover:text-white transition-colors"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10 mt-12 pt-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <p class="text-white/60 text-sm text-center md:text-left">
            © {{ currentYear }} 鎰威科技股份有限公司 EWILL Technology. All rights reserved.
          </p>

          <!-- Contact Info -->
          <div class="flex items-center gap-6 text-white/60 text-sm">
            <a href="mailto:service@ewill.com.tw" class="hover:text-white transition-colors">
              service@ewill.com.tw
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
