# Astro 元件設計規格

> 技術設計文件，詳細定義元件結構與介面

## 元件總覽

| 類型 | 數量 | 說明 |
|------|------|------|
| Layout | 4 | 頁面版型（Base, Page, Home, Anchor） |
| 基礎元件 | 3 | Card, Overlay, Icon |
| 容器元件 | 1 | CardGrid |
| 共用元件 | 6 | Header, Footer, SEO, MobileDrawer 等 |
| Section 元件 (P0) | 3 | Hero, Text, Image |
| Section 元件 (P1) | 8 | CardList, Anchor, FeatureGrid, Timeline, Gallery, ProductIntro, FeatureShowcase, CTA |
| 導航元件 | 2 | Breadcrumb, AnchorNav |
| 功能元件 | 1 | PopupModal |

---

## 一、Layout 元件

### BaseLayout

- **路徑**: `src/layouts/Layout.astro`
- **職責**: HTML 文檔結構、全域樣式載入

```typescript
interface Props {
  title: string;
  description?: string;
  keywords?: string[];
}
```

### PageLayout

- **路徑**: `src/layouts/PageLayout.astro`
- **職責**: 標準頁面結構 (Header + slot + Footer)

```typescript
interface Props {
  page: PageContent;
  showBreadcrumb?: boolean;
}
```

**使用方式**:
```astro
<PageLayout page={pageData}>
  <HeroSection image={page.layout.hero.image} />
  {sections.map(s => <DynamicSection section={s} />)}
</PageLayout>
```

### HomeLayout

- **路徑**: `src/layouts/HomeLayout.astro`
- **職責**: 首頁專用版型（CardGrid 佈局 + PopupModal）

```typescript
interface Props {
  page: PageContent;
  popup?: PopupConfig;
}
```

**結構**:
```
┌─────────────────────────────────────┐
│              Header                  │
├─────────────────────────────────────┤
│           HeroSection               │
├─────────────────────────────────────┤
│  Section (About)                    │
├─────────────────────────────────────┤
│  CardGrid (服務項目 - 3欄)          │
├─────────────────────────────────────┤
│  CardGrid (解決方案 - 5卡片 3+2)    │
├─────────────────────────────────────┤
│              Footer                  │
├─────────────────────────────────────┤
│  PopupModal (條件觸發)              │
└─────────────────────────────────────┘
```

### AnchorPageLayout

- **路徑**: `src/layouts/AnchorPageLayout.astro`
- **職責**: 錨點導航頁面版型（services, solutions 頁面）

```typescript
interface Props {
  page: PageContent;
  anchors: AnchorItem[];
}

interface AnchorItem {
  id: string;
  label: string;
}
```

**結構**:
```
┌─────────────────────────────────────┐
│              Header                  │
├─────────────────────────────────────┤
│           HeroSection               │
├────────┬────────────────────────────┤
│        │  AnchorSection #1          │
│ Anchor │────────────────────────────│
│  Nav   │  AnchorSection #2          │
│(sticky)│────────────────────────────│
│        │  AnchorSection #3          │
├────────┴────────────────────────────┤
│              Footer                  │
└─────────────────────────────────────┘
```

**行為**:
- AnchorNav 在桌面版 sticky 於左側
- 滾動時自動高亮當前 section
- URL hash 同步更新

---

## 二、基礎元件

### Card

- **路徑**: `src/components/Card.astro`
- **職責**: 可重用卡片元件

```typescript
interface CardProps {
  variant: 'service' | 'solution' | 'event' | 'product';
  image?: {
    id: string;
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  link?: string;
  link_text?: string;  // 預設 "了解更多"
  clickable?: boolean; // 整張卡片可點擊
}
```

**樣式規格**:

| 屬性 | 值 | 說明 |
|------|-----|------|
| 背景 | `#FFFFFF` | 白底 |
| 圓角 | `12px` | 圓角 |
| 陰影 | `0 4px 20px rgba(0,0,0,0.08)` | 微陰影 |
| 內距 | `24px` | 四邊內距 |

**互動規格**:

```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card:active {
  transform: scale(0.98);
}
```

**內部結構**:
```
┌─────────────────────────┐
│  ┌─────────────────┐    │
│  │   Image/Logo    │    │  64x64 或 aspect-ratio 16:9
│  └─────────────────┘    │
│                         │
│  Title                  │  18px, font-weight: 700
│  ─────────────────────  │
│  Description text...    │  14px, color: #4A4A4A
│                         │
│  [了解更多 →]           │  CTA link, Teal-500
└─────────────────────────┘
```

### Overlay

- **路徑**: `src/components/Overlay.astro`
- **職責**: 遮罩層（供 PopupModal、MobileDrawer 共用）

```typescript
interface OverlayProps {
  visible: boolean;
  onClick?: () => void;
  blur?: boolean;  // 啟用 backdrop-filter
}
```

**樣式**:
```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);  /* 若 blur=true */
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay--visible {
  opacity: 1;
}
```

---

## 三、容器元件

### CardGrid

- **路徑**: `src/components/CardGrid.astro`
- **職責**: 卡片網格容器，處理 RWD 欄位變化

```typescript
interface CardGridProps {
  columns: 3 | 4 | 5;
  layout_variant?: '3-2' | 'equal';  // 5 卡片時: 3+2 排列或平均
  gap?: 'sm' | 'md' | 'lg';          // 預設 'md'
  children: Card[];
}
```

**RWD 規格**:

| 斷點 | 欄數 | 間距 |
|------|------|------|
| Desktop (≥1024px) | 依 columns 設定 | 24px |
| Tablet (≥768px) | 2 | 20px |
| Mobile (<768px) | 1 | 16px |

**實作**:
```css
.card-grid {
  display: grid;
  gap: var(--grid-gap, 24px);
}

/* Desktop: 3 columns */
.card-grid--cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* Desktop: 5 columns with 3+2 layout */
.card-grid--cols-5.card-grid--variant-3-2 {
  grid-template-columns: repeat(3, 1fr);
}
.card-grid--cols-5.card-grid--variant-3-2 > :nth-child(n+4) {
  grid-column: span 1;
}

/* Tablet */
@media (max-width: 1023px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile */
@media (max-width: 767px) {
  .card-grid { grid-template-columns: 1fr; }
}
```

---

## 四、共用元件

### Header

- **路徑**: `src/components/Header.astro`
- **資料來源**: `/content/pages/header.json`

```typescript
interface HeaderProps {
  navigation: NavItem[];
  logo: {
    src: string;
    alt: string;
    link: string;
  };
  styles?: {
    height: { desktop: string; mobile: string };
    background: string;
  };
}

interface NavItem {
  text: string;
  url: string;
  children?: NavItem[];
  is_cta?: boolean;
}
```

**行為規格**:

| 屬性 | 值 | 說明 |
|------|-----|------|
| 桌面版高度 | 80px | fixed 定位 |
| 手機版高度 | 64px | fixed 定位 |
| 隱藏閾值 | 100px | 向下滾動超過此值後隱藏 |
| 顯示觸發 | 向上滾動 | 任意向上滾動即顯示 |

**滾動行為**:
```typescript
interface HeaderScrollBehavior {
  hideOnScrollDown: true;
  hideThreshold: 100;           // px
  showOnScrollUp: true;
  backgroundOnScroll: 'rgba(255,255,255,0.95)';
  backdropBlur: '10px';
}
```

**狀態變化**:
1. **初始狀態**: 可見，背景透明或半透明
2. **向下滾動 > 100px**: 向上滑出隱藏（transition: transform 0.3s）
3. **向上滾動**: 立即滑入顯示，背景變實
4. **滾動後背景**: `rgba(255,255,255,0.95)` + `backdrop-filter: blur(10px)`

**手機版行為**:
- 漢堡選單 → 點擊展開 MobileDrawer
- 側邊抽屜從右側滑入

### Footer

- **路徑**: `src/components/Footer.astro`
- **資料來源**: `/content/pages/footer.json`

```typescript
interface FooterProps {
  company: {
    logo: string;
    name: string;
    description: string;
  };
  sections: {
    title: string;
    links: { text: string; url: string }[];
  }[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    platform: string;
    url: string;
    icon: string;
  }[];
  copyright: string;
}
```

**佈局規格**:
- 桌面: 4 欄 (Logo | 快速連結 | 解決方案 | 聯絡)
- 平板: 2 欄
- 手機: 單欄 (可收合)

### MobileDrawer

- **路徑**: `src/components/MobileDrawer.astro`
- **職責**: 手機版側邊抽屜選單

```typescript
interface MobileDrawerProps {
  navigation: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}
```

**樣式規格**:
```css
.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: #FFFFFF;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1001;
  padding: 24px;
  overflow-y: auto;
}

.mobile-drawer--open {
  transform: translateX(0);
}
```

**行為**:
- 點擊漢堡選單開啟（從右側滑入）
- 點擊 Overlay 或 X 按鈕關閉
- 開啟時 body overflow: hidden（防止背景滾動）

### SEO

- **路徑**: `src/components/SEO.astro`

```typescript
interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  jsonLd?: object;
}
```

**輸出**:
- `<title>`, `<meta description>`, `<meta keywords>`
- Open Graph tags
- Twitter Card tags
- JSON-LD 結構化資料

---

## 五、導航元件

### Breadcrumb

- **路徑**: `src/components/Breadcrumb.astro`

```typescript
interface BreadcrumbProps {
  items?: { label: string; href: string }[];
  // 若未提供，從 URL 自動生成
}
```

### AnchorNav

- **路徑**: `src/components/AnchorNav.astro`
- **職責**: 錨點導航選單（配合 AnchorSection 使用）

```typescript
interface AnchorNavProps {
  items: {
    id: string;       // 對應 AnchorSection 的 id
    label: string;    // 顯示文字
    icon?: string;    // 選用圖示
  }[];
  position: 'sticky-left' | 'sticky-top';
  scrollOffset?: number;  // 滾動偏移（補償 Header 高度，預設 80）
}
```

**桌面版（sticky-left）**:
```css
.anchor-nav {
  position: sticky;
  top: 100px;  /* Header 高度 + 間距 */
  width: 200px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.anchor-nav__item {
  display: block;
  padding: 12px 16px;
  color: #4A4A4A;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.anchor-nav__item:hover {
  color: #2D9B9B;
}

.anchor-nav__item--active {
  color: #2D9B9B;
  border-left-color: #2D9B9B;
  background: rgba(45, 155, 155, 0.05);
}
```

**手機版（sticky-top）**:
```css
@media (max-width: 1023px) {
  .anchor-nav {
    position: sticky;
    top: 64px;  /* Mobile header height */
    width: 100%;
    display: flex;
    overflow-x: auto;
    background: #FFFFFF;
    border-bottom: 1px solid #E5E5E5;
    z-index: 10;
  }

  .anchor-nav__item {
    flex-shrink: 0;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
}
```

**行為**:
1. 點擊項目 → smooth scroll 到對應 section
2. 滾動時自動偵測當前 section，高亮對應 nav item
3. URL hash 同步更新（`#software_development`）
4. 支援鍵盤導航（Tab、Enter）

---

## 六、功能元件

### PopupModal

- **路徑**: `src/components/PopupModal.astro`
- **職責**: 彈窗廣告/公告（LOGSEC 廣告彈窗等）

```typescript
interface PopupModalProps {
  image: {
    desktop: string;    // 桌面版圖片 (492x663)
    mobile: string;     // 手機版圖片 (360x478)
    alt: string;
  };
  link: string;
  trigger: 'first_visit' | 'scroll' | 'time';
  triggerConfig?: {
    delay?: number;           // ms, for 'time' trigger
    scrollThreshold?: number; // px, for 'scroll' trigger
  };
  closeBehavior: {
    clickOverlay: boolean;    // 點擊遮罩關閉（預設 true）
    pressEscape: boolean;     // ESC 鍵關閉（預設 true）
    showCloseButton: boolean; // 顯示 X 按鈕（預設 true）
  };
  storage: {
    key: string;              // localStorage key（預設 'site_popup_dismissed'）
    expireDays?: number;      // 過期天數（預設 7，避免永久不顯示）
  };
}
```

**樣式規格**:
```css
.popup-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  z-index: 1001;
  opacity: 0;
  transition: all 0.3s ease;
}

.popup-modal--visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.popup-modal__close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.popup-modal__image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
```

**行為規格**:

| 觸發類型 | 行為 |
|----------|------|
| `first_visit` | 檢查 localStorage，首次訪問或過期後顯示 |
| `scroll` | 滾動超過 scrollThreshold 後顯示 |
| `time` | 頁面載入 delay ms 後顯示 |

**關閉行為**:
1. 點擊 X 按鈕 → 關閉 + 記錄 localStorage
2. 點擊遮罩 → 關閉（若 clickOverlay = true）
3. 按 ESC 鍵 → 關閉（若 pressEscape = true）
4. 點擊圖片 → 跳轉至 link

**避免重複彈出**:
```typescript
// 檢查是否應顯示
function shouldShowPopup(key: string, expireDays: number): boolean {
  const dismissed = localStorage.getItem(key);
  if (!dismissed) return true;

  const dismissedAt = new Date(dismissed);
  const now = new Date();
  const daysDiff = (now - dismissedAt) / (1000 * 60 * 60 * 24);

  return daysDiff > expireDays;
}

// 記錄關閉時間
function dismissPopup(key: string): void {
  localStorage.setItem(key, new Date().toISOString());
}
```

---

## 七、Section 元件

### HeroSection

- **路徑**: `src/components/HeroSection.astro`

```typescript
interface HeroProps {
  image: {
    id: string;
    desktop: string;
    mobile: string;
    alt: string;
  };
  overlay?: boolean;
  height?: 'full' | 'auto';
}
```

**實作**:
```astro
<picture>
  <source media="(min-width: 1024px)" srcset={image.desktop} />
  <source media="(max-width: 1023px)" srcset={image.mobile} />
  <img src={image.desktop} alt={image.alt} />
</picture>
```

### TextSection

- **路徑**: `src/components/TextSection.astro`

```typescript
interface TextSectionProps {
  content: string;    // Markdown 內容
  title?: string;     // 區塊標題
  label?: string;     // 上方小標籤 (如 "About Us")
}
```

**實作重點**:
- 使用 `marked` 或 Astro 內建 Markdown 渲染
- 支援內部連結 `[文字](/path/)`

### ImageSection

- **路徑**: `src/components/ImageSection.astro`

```typescript
interface ImageSectionProps {
  image_id: string;
}
```

**實作重點**:
- 從 `asset-manifest.json` 查詢圖片路徑
- 使用 `getAssetById()` 工具函數

### CardListSection (P1)

- **路徑**: `src/components/CardListSection.astro`
- **用途**: 卡片列表（服務項目、產品解決方案）

```typescript
interface CardListSectionProps {
  label?: string;
  title: string;
  description?: string;
  columns: 3 | 4 | 5;
  layout_variant?: '3-2' | 'equal';  // 5 cards: 3+2 或平均
  cards: {
    id: string;
    image_id: string;
    title: string;
    description: string;
    link?: string;
    link_text?: string;
  }[];
}
```

### AnchorSection (P1)

- **路徑**: `src/components/AnchorSection.astro`
- **用途**: 可錨點定位區塊（解決方案頁各類別）

```typescript
interface AnchorSectionProps {
  id: string;           // 錨點 ID
  title: string;
  description: string;
  cards: {
    id: string;
    image_id: string;
    title: string;
    description: string;
    link?: string;
    link_text?: string;
  }[];
}
```

### FeatureGridSection (P1)

- **路徑**: `src/components/FeatureGridSection.astro`
- **用途**: 特色網格（核心價值、認證等）

```typescript
interface FeatureGridSectionProps {
  columns: 3 | 4;
  image?: {
    desktop: string;
    mobile_variant: 'horizontal' | 'vertical';
  };
  features: {
    id: string;
    image_id?: string;
    title: string;
    subtitle?: string;
    description: string;
  }[];
}
```

### TimelineSection (P1)

- **路徑**: `src/components/TimelineSection.astro`
- **用途**: 時間軸/沿革展示

```typescript
interface TimelineSectionProps {
  label?: string;
  title: string;
  image: {
    desktop: string[];
    mobile: string[];
  };
}
```

### GallerySection (P1)

- **路徑**: `src/components/GallerySection.astro`
- **用途**: 圖片圖庫展示（證書、案例等）

```typescript
interface GallerySectionProps {
  label?: string;
  title: string;
  columns: 3 | 4;
  images: {
    id: string;
    image_id: string;
    title?: string;
  }[];
}
```

### ProductIntroSection (P1)

- **路徑**: `src/components/ProductIntroSection.astro`
- **用途**: 產品介紹區塊

```typescript
interface ProductIntroSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  description: string;
}
```

### FeatureShowcaseSection (P1)

- **路徑**: `src/components/FeatureShowcaseSection.astro`
- **用途**: 功能展示（圖文交錯）

```typescript
interface FeatureShowcaseSectionProps {
  layout: 'alternating' | 'image-left' | 'image-right';
  features: {
    id: string;
    image_id: string;
    title: string;
    description: string;
  }[];
}
```

### CTASection (P1)

- **路徑**: `src/components/CTASection.astro`
- **用途**: 行動呼籲區塊

```typescript
interface CTASectionProps {
  title: string;
  description?: string;
  button_text: string;
  button_link: string;
  variant?: 'primary' | 'secondary';
}
```

---

## 八、相依關係圖

```
BaseLayout
├── PageLayout (一般頁面)
│   ├── Header ← header.json
│   │   ├── NavItem (recursive)
│   │   └── MobileDrawer (手機版)
│   │       └── Overlay
│   ├── Breadcrumb (optional)
│   ├── <slot>
│   │   ├── HeroSection
│   │   │   └── <picture> (RWD)
│   │   └── [DynamicSections]
│   │       ├── TextSection → Markdown renderer
│   │       ├── ImageSection → getAssetById()
│   │       └── CardListSection → CardGrid → Card
│   └── Footer ← footer.json
│
├── HomeLayout (首頁)
│   ├── Header
│   ├── HeroSection
│   ├── CardGrid → Card (服務項目 3 欄)
│   ├── CardGrid → Card (解決方案 5 卡片)
│   ├── Footer
│   └── PopupModal
│       └── Overlay
│
└── AnchorPageLayout (錨點頁面: services, solutions)
    ├── Header
    ├── HeroSection
    ├── AnchorNav (sticky)
    │   └── [AnchorSection] × N
    └── Footer
```

**元件使用關係**:
```
Card (基礎) ──┬── CardGrid (容器)
              └── CardListSection (Section)
                  └── AnchorSection (Section)

Overlay (基礎) ──┬── PopupModal
                 └── MobileDrawer
```

---

## 九、品牌色系

```css
:root {
  /* 主色 */
  --color-primary: #3F8696;
  --color-primary-hover: #2D9B9B;

  /* 輔色 */
  --color-secondary: #1A1A2E;
  --color-accent: #2D9B9B;

  /* 中性色 */
  --color-neutral-light: #FFFFFF;
  --color-neutral-dark: #333333;
  --color-neutral-gray: #666666;

  /* 背景 */
  --color-bg-light: #F5F5F5;
  --color-bg-dark: #1A1A2E;
}
```

---

## 十、響應式斷點

```css
/* Tailwind 預設 */
sm:  640px   /* 手機橫向 */
md:  768px   /* 平板 */
lg:  1024px  /* 桌面 (主要斷點) */
xl:  1280px  /* 大螢幕 */
2xl: 1536px  /* 超大螢幕 */
```

**主要斷點**: `1024px` (Hero 圖片切換)

---

## 十一、檔案結構

```
astro-app/src/
├── components/
│   │
│   │  # 基礎元件
│   ├── Card.astro
│   ├── Overlay.astro
│   │
│   │  # 容器元件
│   ├── CardGrid.astro
│   │
│   │  # 共用元件
│   ├── Header.astro
│   ├── Footer.astro
│   ├── SEO.astro
│   ├── MobileDrawer.astro
│   │
│   │  # 導航元件
│   ├── Breadcrumb.astro
│   ├── AnchorNav.astro
│   │
│   │  # 功能元件
│   ├── PopupModal.astro
│   │
│   │  # Section 元件 (P0)
│   ├── HeroSection.astro
│   ├── TextSection.astro
│   ├── ImageSection.astro
│   │
│   │  # Section 元件 (P1)
│   ├── CardListSection.astro
│   ├── AnchorSection.astro
│   ├── FeatureGridSection.astro
│   ├── TimelineSection.astro
│   ├── GallerySection.astro
│   ├── ProductIntroSection.astro
│   ├── FeatureShowcaseSection.astro
│   └── CTASection.astro
│
├── layouts/
│   ├── Layout.astro          # BaseLayout
│   ├── PageLayout.astro      # 一般頁面
│   ├── HomeLayout.astro      # 首頁專用
│   └── AnchorPageLayout.astro # 錨點導航頁面
│
├── pages/
│   ├── index.astro
│   └── [...slug].astro
│
├── utils/
│   └── content.ts
│
└── styles/
    └── global.css
```
