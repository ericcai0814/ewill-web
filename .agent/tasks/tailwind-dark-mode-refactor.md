# Tailwind 深色模式與樣式重構

> **建立日期**: 2026-01-14
> **狀態**: 進行中
> **優先級**: 高

---

## 目標

1. 實作 Tailwind 深色模式支援
2. 將現有 BEM 樣式類別重構為 Tailwind utility classes

---

## 範圍

### 需重構的元件

| 元件 | 行數 | 複雜度 | 優先級 |
|------|-----:|:------:|:------:|
| **Layout 元件** |
| Layout.astro | 59 | 低 | P0 |
| PageLayout.astro | ~200 | 中 | P0 |
| **共用元件** |
| Header.astro | 443 | 高 | P1 |
| Footer.astro | 260 | 中 | P1 |
| Breadcrumb.astro | 168 | 低 | P1 |
| SEO.astro | 211 | 低 | P2 |
| **Section 元件** |
| HeroSection.astro | 47 | 低 | P1 |
| TextSection.astro | 86 | 低 | P1 |
| ImageSection.astro | 47 | 低 | P1 |
| CardListSection.astro | 200 | 中 | P1 |
| AnchorSection.astro | 157 | 中 | P1 |
| ProductIntroSection.astro | 98 | 低 | P1 |
| FeatureShowcaseSection.astro | 161 | 中 | P1 |
| FeatureGridSection.astro | 172 | 中 | P1 |
| CTASection.astro | 115 | 低 | P1 |
| GallerySection.astro | 269 | 高 | P2 |
| TimelineSection.astro | - | 中 | P2 |
| ContactFormSection.astro | 134 | 中 | P2 |
| PopupModal.astro | 168 | 中 | P2 |
| AnchorNav.astro | 219 | 中 | P2 |

---

## 實作步驟

### Phase 1: 配置 Tailwind 深色模式

1. 建立 `tailwind.config.mjs`
2. 設定 `darkMode: 'class'`
3. 定義品牌色彩為 CSS 變數
4. 更新 `global.css`

### Phase 2: 定義設計 tokens

```css
:root {
  /* 淺色模式 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #666666;
  --color-brand: #3f8696;
  --color-brand-hover: #2d9b9b;
}

.dark {
  /* 深色模式 */
  --color-bg-primary: #1a1a2e;
  --color-bg-secondary: #2d2d44;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a0a0a0;
  --color-brand: #4fb3c4;
  --color-brand-hover: #6fcfdf;
}
```

### Phase 3: 重構元件

#### 重構原則

1. **移除 `<style>` 區塊**：將 CSS 改為 Tailwind utility classes
2. **使用 CSS 變數**：色彩使用 `bg-[var(--color-bg-primary)]` 或自定義類別
3. **深色模式**：使用 `dark:` 前綴
4. **響應式**：使用 `sm:`, `md:`, `lg:` 前綴

#### 重構範例

**Before (BEM CSS):**
```astro
<header class="header">
  <div class="header__container">
    <a class="header__logo">...</a>
  </div>
</header>

<style>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
.header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}
</style>
```

**After (Tailwind):**
```astro
<header class="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 transition-colors">
  <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
    <a class="...">...</a>
  </div>
</header>
```

### Phase 4: 加入深色模式切換

1. 在 Header 加入切換按鈕
2. 使用 localStorage 記住偏好
3. 支援系統偏好設定 `prefers-color-scheme`

---

## 品牌色彩對照表

| 用途 | 淺色模式 | 深色模式 | Tailwind |
|------|----------|----------|----------|
| 主背景 | `#FFFFFF` | `#1A1A2E` | `bg-white dark:bg-slate-900` |
| 次背景 | `#F5F5F5` | `#2D2D44` | `bg-gray-100 dark:bg-slate-800` |
| 主文字 | `#1A1A2E` | `#F5F5F5` | `text-slate-900 dark:text-gray-100` |
| 次文字 | `#666666` | `#A0A0A0` | `text-gray-600 dark:text-gray-400` |
| 品牌色 | `#3F8696` | `#4FB3C4` | `text-teal-600 dark:text-teal-400` |
| 品牌懸停 | `#2D9B9B` | `#6FCFDF` | `hover:text-teal-500` |

---

## 驗收標準

- [ ] Tailwind 配置完成，支援深色模式
- [ ] 所有元件移除 `<style>` 區塊
- [ ] 深色模式切換正常運作
- [ ] 響應式在手機/平板/桌機都正常
- [ ] 建置成功，無錯誤
- [ ] 無障礙屬性保留

---

## 相關檔案

- `astro-app/tailwind.config.mjs` (新增)
- `astro-app/src/styles/global.css` (修改)
- `astro-app/src/components/*.astro` (重構)
- `astro-app/src/layouts/*.astro` (重構)
