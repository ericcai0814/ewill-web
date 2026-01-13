# Astro 元件設計規格

> 技術設計文件，詳細定義元件結構與介面

## 元件總覽

| 類型 | 數量 | 說明 |
|------|------|------|
| Layout | 2 | 頁面版型 |
| 共用元件 | 5 | Header, Footer, SEO 等 |
| Section 元件 | 3 | Hero, Text, Image |
| 功能元件 | 2 | Breadcrumb, Popup |

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

---

## 二、共用元件

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
- 桌面版高度: 80px
- 手機版高度: 64px
- 滾動 > 100px 後隱藏
- 手機版: 漢堡選單 → 側邊抽屜

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

### Breadcrumb

- **路徑**: `src/components/Breadcrumb.astro`

```typescript
interface BreadcrumbProps {
  items?: { label: string; href: string }[];
  // 若未提供，從 URL 自動生成
}
```

### PopupModal

- **路徑**: `src/components/PopupModal.astro`

```typescript
interface PopupProps {
  image: {
    desktop: string;
    mobile: string;
    alt: string;
  };
  link: string;
  trigger: 'first_visit' | 'scroll' | 'time';
  delay?: number;  // ms, for 'time' trigger
}
```

**行為規格**:
- `first_visit`: 檢查 localStorage，首次訪問顯示
- 關閉後設定 `site_popup_dismissed = true`

---

## 三、Section 元件

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

---

## 四、相依關係圖

```
BaseLayout
└── PageLayout
    ├── Header ← header.json
    │   └── NavItem (recursive)
    ├── Breadcrumb (optional)
    ├── <slot>
    │   ├── HeroSection
    │   │   └── <picture> (RWD)
    │   └── [DynamicSections]
    │       ├── TextSection
    │       │   └── Markdown renderer
    │       └── ImageSection
    │           └── getAssetById()
    ├── PopupModal (index only)
    └── Footer ← footer.json
```

---

## 五、品牌色系

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

## 六、響應式斷點

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

## 七、檔案結構

```
astro-app/src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── SEO.astro
│   ├── Breadcrumb.astro
│   ├── PopupModal.astro
│   ├── HeroSection.astro
│   ├── TextSection.astro
│   └── ImageSection.astro
├── layouts/
│   ├── Layout.astro
│   └── PageLayout.astro
├── pages/
│   ├── index.astro
│   └── [...slug].astro
├── utils/
│   └── content.ts
└── styles/
    └── global.css
```
