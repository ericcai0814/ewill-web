<script setup lang="ts">
// 導覽選單資料結構
interface NavItem {
  text: string
  url: string
  is_cta?: boolean
  children?: NavItem[]
}

// 導覽選單資料（來自 pages/header/header.yml）
const navigation: NavItem[] = [
  {
    text: '活動訊息',
    url: '/event_information/',
    children: []
  },
  {
    text: '關於鎰威',
    url: '/about_us/',
    children: [
      { text: '公司簡介', url: '/about_us/#about_us' },
      { text: '公司沿革', url: '/about_us/#milestones' },
      { text: '資格證書', url: '/about_us/#certification' }
    ]
  },
  {
    text: 'ESG',
    url: '/esg/',
    children: []
  },
  {
    text: '服務項目',
    url: '/services/',
    children: [
      { text: '軟體開發服務', url: '/services/#software_development' },
      { text: '資訊安全服務', url: '/services/#security_services' },
      {
        text: '系統規劃服務',
        url: '/services/#system_planning',
        children: [
          { text: '開源作業系統', url: '/ubuntu/' },
          { text: '虛擬化解決方案', url: '/vmware/' },
          { text: '伺服器虛擬化管理', url: '/proxmox_ve/' }
        ]
      }
    ]
  },
  {
    text: '產品解決方案',
    url: '/solutions/',
    children: [
      {
        text: '資安評估',
        url: '/solutions/#security_assessment',
        children: [
          { text: '資安評級工具', url: '/security_scorecard/' }
        ]
      },
      {
        text: '資安檢測',
        url: '/solutions/#security_testing',
        children: [
          { text: '弱點掃描工具', url: '/tenable_nessus/' },
          { text: '原始碼分析平台', url: '/sonarqube/' },
          { text: '網站安全掃描', url: '/acunetix/' }
        ]
      },
      {
        text: '資安防護',
        url: '/solutions/#security_defense',
        children: [
          { text: '次世代防火牆', url: '/palo_alto/' },
          { text: '整合資安平台', url: '/fortinet/' },
          { text: '深度學習防護', url: '/deep_instinct/' },
          { text: '防毒與威脅防護', url: '/bitdefender/' }
        ]
      },
      {
        text: '資安強化',
        url: '/solutions/#security_enhancement',
        children: [
          { text: '端點安全管理', url: '/ist/' },
          { text: 'SSL VPN 解決方案', url: '/array/' },
          { text: '資安預警解決方案', url: '/logsec/' },
          { text: '漏洞風險管理', url: '/vicarius_vrx/' }
        ]
      }
    ]
  },
  {
    text: '智慧製造及AI',
    url: '/smartmanufacturing_ai/',
    children: [
      { text: 'APS 智慧生產核心', url: '/aps/' },
      { text: 'MES 製造系統', url: '/mes/' },
      { text: 'SCM 智慧供應鏈', url: '/scm/' },
      { text: 'WMS 智慧倉儲', url: '/wms/' },
      { text: '承攬商管理系統', url: '/cms_568/' },
      { text: 'AI Agent 解決方案', url: '/ai_agent/' },
      { text: 'AI 數據分析預測', url: '/ai_forecasting/' },
      { text: '數據中台', url: '/data_middleware/' }
    ]
  },
  {
    text: '聯絡鎰威',
    url: '/contact/',
    is_cta: true,
    children: []
  }
]

// 狀態
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const activeDropdown = ref<number | null>(null)
const activeSubmenu = ref<string | null>(null)

// 滾動監聽
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 桌面版下拉選單
const openDropdown = (index: number) => {
  activeDropdown.value = index
}

const closeDropdown = () => {
  activeDropdown.value = null
  activeSubmenu.value = null
}

// 三層選單
const openSubmenu = (key: string) => {
  activeSubmenu.value = key
}

const closeSubmenu = () => {
  activeSubmenu.value = null
}

// 手機版選單
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 手機版展開狀態
const mobileExpanded = ref<Set<string>>(new Set())

const toggleMobileExpand = (key: string) => {
  if (mobileExpanded.value.has(key)) {
    mobileExpanded.value.delete(key)
  } else {
    mobileExpanded.value.add(key)
  }
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'"
  >
    <div class="container mx-auto px-4 md:px-6">
      <nav class="flex items-center justify-between h-20" aria-label="主要導覽列">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <img
            src="/assets/logo.png"
            alt="鎰威科技 EWILL Technology"
            class="h-10 w-auto"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-1">
          <div
            v-for="(item, index) in navigation"
            :key="item.text"
            class="relative"
            @mouseenter="openDropdown(index)"
            @mouseleave="closeDropdown"
          >
            <!-- 主選單項目 -->
            <NuxtLink
              :to="item.url"
              class="px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors font-medium text-[15px]"
              :class="{ 'text-primary-500': item.is_cta }"
            >
              {{ item.text }}
              <svg
                v-if="item.children && item.children.length > 0"
                class="inline-block w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </NuxtLink>

            <!-- 二層下拉選單 -->
            <Transition name="dropdown">
              <div
                v-if="activeDropdown === index && item.children && item.children.length > 0"
                class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 min-w-[200px] py-2"
              >
                <div
                  v-for="child in item.children"
                  :key="child.text"
                  class="relative"
                  @mouseenter="child.children && child.children.length > 0 ? openSubmenu(`${index}-${child.text}`) : null"
                  @mouseleave="closeSubmenu"
                >
                  <NuxtLink
                    :to="child.url"
                    class="flex items-center justify-between px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50 transition-colors text-sm"
                  >
                    {{ child.text }}
                    <svg
                      v-if="child.children && child.children.length > 0"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </NuxtLink>

                  <!-- 三層子選單 -->
                  <Transition name="submenu">
                    <div
                      v-if="activeSubmenu === `${index}-${child.text}` && child.children && child.children.length > 0"
                      class="absolute top-0 left-full ml-1 bg-white rounded-lg shadow-xl border border-gray-100 min-w-[180px] py-2"
                    >
                      <NuxtLink
                        v-for="grandchild in child.children"
                        :key="grandchild.text"
                        :to="grandchild.url"
                        class="block px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50 transition-colors text-sm"
                      >
                        {{ grandchild.text }}
                      </NuxtLink>
                    </div>
                  </Transition>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 text-gray-700 hover:text-primary-500 transition-colors"
          @click="toggleMobileMenu"
          :aria-label="isMobileMenuOpen ? '關閉選單' : '開啟選單'"
          :aria-expanded="isMobileMenuOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Mobile Menu Panel -->
    <Transition name="slide">
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
      >
        <!-- Mobile Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <img src="/assets/logo.png" alt="鎰威科技" class="h-8 w-auto" />
          <button
            class="p-2 text-gray-500 hover:text-gray-700"
            @click="closeMobileMenu"
            aria-label="關閉選單"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <nav class="p-4" aria-label="手機版選單">
          <div v-for="(item, index) in navigation" :key="item.text" class="border-b border-gray-100 last:border-0">
            <div class="flex items-center justify-between">
              <NuxtLink
                :to="item.url"
                class="flex-1 py-3 text-gray-700 font-medium"
                :class="{ 'text-primary-500': item.is_cta }"
                @click="closeMobileMenu"
              >
                {{ item.text }}
              </NuxtLink>
              <button
                v-if="item.children && item.children.length > 0"
                class="p-2 text-gray-400"
                @click="toggleMobileExpand(`item-${index}`)"
                :aria-label="`展開${item.text}子選單`"
              >
                <svg
                  class="w-5 h-5 transition-transform"
                  :class="{ 'rotate-180': mobileExpanded.has(`item-${index}`) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- Mobile Submenu Level 2 -->
            <div
              v-if="item.children && item.children.length > 0 && mobileExpanded.has(`item-${index}`)"
              class="pl-4 pb-2"
            >
              <div v-for="(child, childIndex) in item.children" :key="child.text">
                <div class="flex items-center justify-between">
                  <NuxtLink
                    :to="child.url"
                    class="flex-1 py-2 text-gray-600 text-sm"
                    @click="closeMobileMenu"
                  >
                    {{ child.text }}
                  </NuxtLink>
                  <button
                    v-if="child.children && child.children.length > 0"
                    class="p-1 text-gray-400"
                    @click="toggleMobileExpand(`item-${index}-${childIndex}`)"
                  >
                    <svg
                      class="w-4 h-4 transition-transform"
                      :class="{ 'rotate-180': mobileExpanded.has(`item-${index}-${childIndex}`) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <!-- Mobile Submenu Level 3 -->
                <div
                  v-if="child.children && child.children.length > 0 && mobileExpanded.has(`item-${index}-${childIndex}`)"
                  class="pl-4"
                >
                  <NuxtLink
                    v-for="grandchild in child.children"
                    :key="grandchild.text"
                    :to="grandchild.url"
                    class="block py-2 text-gray-500 text-sm"
                    @click="closeMobileMenu"
                  >
                    {{ grandchild.text }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Submenu Animation */
.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
