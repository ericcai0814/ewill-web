// nuxt-app/composables/useLayoutContent.ts
/**
 * Composable for fetching layout component data (header/footer)
 * These are loaded once and cached for the entire session
 */

// Types for Header
export interface NavItem {
  text: string
  url: string
  is_cta?: boolean
  children?: NavItem[]
}

export interface HeaderContent {
  component: {
    name: string
    type: string
    description: string
  }
  logo: {
    src: string
    alt: string
    width: number
    height: number
    link: string
  }
  navigation: NavItem[]
  styles: {
    desktop: {
      height: string
      background: string
      background_scrolled: string
      backdrop_filter: string
      text_color: string
      hover_color: string
      shadow_scrolled: string
    }
    mobile: {
      height: string
      background: string
      hamburger_color: string
    }
  }
  accessibility: {
    nav_label: string
    menu_label: string
    hamburger_label: string
    close_label: string
    submenu_label: string
  }
}

// Types for Footer
export interface FooterLink {
  text: string
  url: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface FooterContent {
  component: {
    name: string
    type: string
    description: string
  }
  company: {
    name: string
    name_en: string
    description: string
    logo: string
  }
  contact: {
    phone: string
    email: string
    address: string
  }
  quick_links: FooterLink[]
  solutions: FooterLink[]
  social: SocialLink[]
  copyright: {
    text: string
    year: number
  }
}

// Cache for layout content
const headerCache = ref<HeaderContent | null>(null)
const footerCache = ref<FooterContent | null>(null)

export const useHeaderContent = () => {
  const content = ref<HeaderContent | null>(headerCache.value)
  const loading = ref(!headerCache.value)
  const error = ref<Error | null>(null)

  const fetchContent = async () => {
    if (headerCache.value) {
      content.value = headerCache.value
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await $fetch<HeaderContent>('/content/pages/header.json')
      headerCache.value = data
      content.value = data
    } catch (e) {
      error.value = e as Error
      console.error('Failed to fetch header content:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchContent)

  return {
    content,
    loading,
    error,
  }
}

export const useFooterContent = () => {
  const content = ref<FooterContent | null>(footerCache.value)
  const loading = ref(!footerCache.value)
  const error = ref<Error | null>(null)

  const fetchContent = async () => {
    if (footerCache.value) {
      content.value = footerCache.value
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await $fetch<FooterContent>('/content/pages/footer.json')
      footerCache.value = data
      content.value = data
    } catch (e) {
      error.value = e as Error
      console.error('Failed to fetch footer content:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchContent)

  return {
    content,
    loading,
    error,
  }
}
