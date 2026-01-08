# Nuxt Implementation

Nuxt 3 專案的驗證實作指南。

## 環境資訊

| 項目 | 值 |
|------|-----|
| **輸出目錄** | `.output/` (SSR) 或 `dist/` (Static) |
| **Dev Server** | `npm run dev` (port 3000) |
| **圖片處理** | `@nuxt/image` |
| **Build** | `npm run build` 或 `npm run generate` |

---

## 驗證指令對照

| 規則 ID | 驗證方式 |
|---------|----------|
| A1 | `find public/assets -name '*[^a-z0-9_.-]*' -type f` |
| A2 | Build 時自動檢查（404 會報錯） |
| A3 | 自定義 ESLint 規則 或 build script |
| A4 | `@nuxt/image` 強制要求 `alt` prop |
| C1 | ESLint 規則檢查 MDC 語法 |
| C2 | TypeScript 編譯檢查 |
| C3 | `nuxt typecheck` |

### 完整驗證流程

```bash
# 1. TypeScript 檢查
npx nuxt typecheck

# 2. Lint 檢查
npm run lint

# 3. Build 驗證
npm run build

# 4. 靜態生成 (如適用)
npm run generate
```

---

## 圖片 RWD 實作

### 安裝 @nuxt/image

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    screens: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280,
    }
  }
})
```

### 使用 NuxtPicture

```vue
<template>
  <NuxtPicture
    src="/images/hero.jpg"
    :img-attrs="{ alt: 'Hero Banner', class: 'hero-image' }"
    sizes="mobile:100vw tablet:100vw desktop:100vw"
    :modifiers="{ quality: 80 }"
  />
</template>
```

### 手動變體切換

```vue
<template>
  <picture>
    <source media="(max-width: 767px)" :srcset="mobileImage">
    <NuxtImg :src="desktopImage" :alt="alt" />
  </picture>
</template>

<script setup>
const props = defineProps<{
  desktopImage: string
  mobileImage: string
  alt: string
}>()
</script>
```

---

## Popup 實作

### Composable

```typescript
// composables/usePopup.ts
export function usePopup(key: string, trigger: 'first_visit' | 'session' | 'always') {
  const isVisible = ref(false)
  
  const storage = trigger === 'session' ? sessionStorage : localStorage
  const storageKey = `popup_${key}_dismissed`
  
  function show() {
    if (trigger !== 'always' && storage.getItem(storageKey)) return
    isVisible.value = true
  }
  
  function hide() {
    isVisible.value = false
    if (trigger !== 'always') {
      storage.setItem(storageKey, 'true')
    }
  }
  
  // ESC 鍵關閉
  onMounted(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isVisible.value) hide()
    })
  })
  
  return { isVisible, show, hide }
}
```

### 使用

```vue
<template>
  <Teleport to="body">
    <div v-if="popup.isVisible.value" class="popup-overlay" @click.self="popup.hide">
      <div class="popup-content">
        <button @click="popup.hide">×</button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const popup = usePopup('logsec', 'first_visit')

onMounted(() => {
  setTimeout(() => popup.show(), 2000)
})
</script>
```

---

## RWD 驗證

### 測試步驟

```bash
# 啟動開發伺服器
npm run dev
```

1. 開啟 `http://localhost:3000`
2. DevTools → Responsive Mode
3. 測試斷點：1200px → 768px → 375px

### Nuxt DevTools

```bash
# 啟用 DevTools
npx nuxi devtools enable
```

在 DevTools 中檢查：
- Components 結構
- Assets 載入狀態
- Hydration 狀態

---

## 常見問題

### 圖片未正確載入

```vue
<!-- 確認路徑以 / 開頭 -->
<NuxtImg src="/images/hero.jpg" />

<!-- 或使用 ~ alias -->
<NuxtImg src="~/assets/images/hero.jpg" />
```

### SSR Hydration 不匹配

```vue
<!-- 使用 ClientOnly 包裝 localStorage 相關邏輯 -->
<ClientOnly>
  <PopupBanner />
</ClientOnly>
```

### 圖片優化未生效

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    provider: 'ipx', // 本地開發使用 ipx
    quality: 80,
    format: ['webp', 'jpg']
  }
})
```

