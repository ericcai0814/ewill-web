# Astro 元件 Props TypeScript 標準化

## 目標

統一所有 Astro 元件的 Props TypeScript 定義，確保類型安全與一致性。

## 現況分析

| 狀態 | 數量 | 元件 |
|------|------|------|
| ✅ 已定義 Props | 16 | AnchorNav, AnchorSection, Breadcrumb, CardListSection, ContactFormSection, CTASection, FeatureGridSection, FeatureShowcaseSection, GallerySection, HeroSection, ImageSection, PopupModal, ProductIntroSection, SEO, TextSection, TimelineSection |
| ❌ 未定義 Props | 2 | Header, Footer |

## 標準規範

### 1. Props 介面命名

```typescript
// 元件內部定義
export interface Props {
  // ...
}

// 使用 Astro.props 解構
const { prop1, prop2 } = Astro.props;
```

### 2. 共用類型定義位置

```
astro-app/src/types/
├── index.ts          # 統一匯出
├── components.ts     # 元件共用類型
├── content.ts        # 內容資料類型
└── seo.ts            # SEO 相關類型
```

### 3. Props 定義標準格式

```typescript
/**
 * 元件名稱
 * 元件描述
 */
export interface Props {
  /** 必填屬性說明 */
  requiredProp: string;

  /** 選填屬性說明 */
  optionalProp?: string;

  /** 有預設值的屬性說明 @default 'value' */
  withDefault?: string;
}

const {
  requiredProp,
  optionalProp,
  withDefault = 'value',
} = Astro.props;
```

## 實作任務

### Phase 1: 建立共用類型檔案

- [ ] 建立 `src/types/index.ts`
- [ ] 建立 `src/types/components.ts` - 共用元件類型
- [ ] 建立 `src/types/content.ts` - 內容資料類型（從 content.ts 抽取）
- [ ] 建立 `src/types/seo.ts` - SEO 相關類型（從 SEO.astro 抽取）

### Phase 2: 定義共用類型

```typescript
// src/types/components.ts

/** 圖片資源 */
export interface ImageAsset {
  desktop: string;
  mobile: string;
  alt: string;
}

/** 連結項目 */
export interface LinkItem {
  text: string;
  url: string;
}

/** 卡片項目 */
export interface CardItem {
  id: string;
  image_id: string;
  title: string;
  description: string;
  link?: string;
  link_text?: string;
}

/** Section 基礎屬性 */
export interface SectionBaseProps {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
}
```

### Phase 3: 更新現有元件

依照元件類型分批處理：

#### 3.1 Section 元件（共用 SectionBaseProps）

- [ ] TextSection.astro
- [ ] ImageSection.astro
- [ ] CardListSection.astro
- [ ] FeatureGridSection.astro
- [ ] FeatureShowcaseSection.astro
- [ ] GallerySection.astro
- [ ] TimelineSection.astro
- [ ] CTASection.astro
- [ ] ContactFormSection.astro
- [ ] AnchorSection.astro

#### 3.2 特殊元件

- [ ] HeroSection.astro - 保持獨立 Props
- [ ] ProductIntroSection.astro - 保持獨立 Props
- [ ] SEO.astro - 已完成，抽取類型到 types/seo.ts
- [ ] PopupModal.astro
- [ ] Breadcrumb.astro
- [ ] AnchorNav.astro

#### 3.3 Layout 元件

- [ ] Header.astro - 新增 Props 介面（即使為空）
- [ ] Footer.astro - 新增 Props 介面（即使為空）

### Phase 4: 更新 PageLayout

- [ ] 更新 `src/layouts/PageLayout.astro` 使用共用類型
- [ ] 更新 `src/utils/content.ts` 匯出類型

## 驗證檢查清單

- [ ] 所有元件都有 `export interface Props`
- [ ] 所有 Props 屬性都有 JSDoc 註解
- [ ] 共用類型從 `src/types/` 匯入
- [ ] TypeScript 編譯無錯誤
- [ ] 開發伺服器正常運作

## 參考範例

### SEO.astro（現有良好範例）

```typescript
export interface JsonLdItem {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'Product' | 'FAQPage' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

export interface Props {
  // 基礎 SEO
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;

  // Open Graph
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogImageAlt?: string;

  // JSON-LD 結構化資料
  jsonLd?: JsonLdItem[];

  // 控制
  noindex?: boolean;
  nofollow?: boolean;
}
```

## 狀態

- **建立日期**：2026-01-14
- **完成日期**：2026-01-14
- **目前狀態**：✅ Phase 1-2 完成
- **優先級**：中

## 完成項目

### Phase 1: 類型目錄建立 ✅

- [x] `src/types/index.ts` - 統一匯出
- [x] `src/types/components.ts` - 元件共用類型（20+ 類型定義）
- [x] `src/types/seo.ts` - SEO 相關類型

### Phase 2: 元件更新 ✅

- [x] HeroSection - 使用 ImageAsset
- [x] TextSection - 新增 JSDoc 註解
- [x] ImageSection - 新增 JSDoc 註解
- [x] CardListSection - 使用 CardItem
- [x] Header - 新增 Props 介面，使用 NavItem
- [x] Footer - 新增 Props 介面，使用 LinkItem
