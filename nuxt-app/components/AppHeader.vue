<script setup lang="ts">
import { useHeaderContent, type NavItem } from '~/composables/useLayoutContent'

// Fetch header content from JSON
const { content, loading } = useHeaderContent()

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
      <nav
        class="flex items-center justify-between h-20"
        :aria-label="content?.accessibility?.nav_label || '主要導覽列'"
      >
        <!-- Logo -->
        <NuxtLink :to="content?.logo?.link || '/'" class="flex items-center">
          <img
            :src="content?.logo?.src || '/assets/logo.png'"
            :alt="content?.logo?.alt || '鎰威科技 EWILL Technology'"
            class="h-10 w-auto"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div v-if="content?.navigation" class="hidden lg:flex items-center gap-1">
          <div
            v-for="(item, index) in content.navigation"
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
          :aria-label="isMobileMenuOpen ? (content?.accessibility?.close_label || '關閉選單') : (content?.accessibility?.hamburger_label || '開啟選單')"
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
          <img
            :src="content?.logo?.src || '/assets/logo.png'"
            :alt="content?.logo?.alt || '鎰威科技'"
            class="h-8 w-auto"
          />
          <button
            class="p-2 text-gray-500 hover:text-gray-700"
            @click="closeMobileMenu"
            :aria-label="content?.accessibility?.close_label || '關閉選單'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <nav v-if="content?.navigation" class="p-4" :aria-label="content?.accessibility?.menu_label || '手機版選單'">
          <div v-for="(item, index) in content.navigation" :key="item.text" class="border-b border-gray-100 last:border-0">
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
