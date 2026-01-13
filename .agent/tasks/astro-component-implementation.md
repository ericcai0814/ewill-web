# Astro 元件實作任務

> 建立日期: 2026-01-13
> 狀態: ✅ 完成
> 設計規格: [`astro-app/src/COMPONENTS.md`](../../astro-app/src/COMPONENTS.md)

## 目標

實作 Astro 元件，將 content-build 產出渲染為完整靜態網站。

---

## 前置條件

- [x] content-build 支援 astro target
- [x] content.ts 讀取 JSON 產出
- [x] 首頁整合驗證
- [x] COMPONENTS.md 設計規格

---

## Phase 1: 核心元件 (P0)

### Layout

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| BaseLayout | ✅ | `Layout.astro` |
| PageLayout | ✅ | 整合 Header/Footer |

### 共用元件

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| Header | ✅ | ← header.json |
| Footer | ✅ | ← footer.json |
| SEO | ✅ | 已整合於 Layout |

### Section 元件

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| HeroSection | ✅ | RWD picture |
| TextSection | ✅ | Markdown 渲染 |
| ImageSection | ✅ | asset manifest 查詢 |

### 頁面路由

| 頁面 | 狀態 | 備註 |
|------|:----:|------|
| index.astro | ✅ | 使用 PageLayout |
| [...slug].astro | ✅ | 20 個內頁 |

---

## Phase 2: 增強功能 (P1)

### 功能元件

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| Breadcrumb | ✅ | 麵包屑導覽 + JSON-LD |
| PopupModal | ✅ | 首頁彈窗 (first_visit/scroll/time) |

### Section 元件 (P1)

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| CardListSection | ✅ | 卡片列表 (3/4/5 欄 + 3-2 變體) |
| AnchorSection | ✅ | 可錨點定位區塊 + scroll-margin |
| FeatureGridSection | ✅ | 特色網格 (3/4 欄 + icon/minimal 變體) |
| CTASection | ✅ | 行動呼籲 (primary/secondary/dark) |
| ProductIntroSection | ✅ | 產品介紹 + 功能列表 |
| FeatureShowcaseSection | ✅ | 圖文交錯展示 (alternating) |
| TimelineSection | ✅ | 時間軸 (vertical/horizontal) + Lightbox |
| GallerySection | ✅ | 圖片圖庫 (2/3/4 欄) + Lightbox |

---

## Phase 3: Layout YML 優化

> 將現有 text + image 扁平結構優化為語義化 section types

| 頁面 | 狀態 | 新增類型 |
|------|:----:|----------|
| index | ✅ | hero_banner, card_list (x2) |
| solutions | ✅ | anchor_section (x4) |
| about_us | ✅ | feature_grid, timeline, gallery |
| logsec | ✅ | product_intro, feature_showcase, cta |
| 其他產品頁 (25) | ✅ | product_intro, feature_grid, feature_showcase, gallery, cta |

---

## 實作順序

```
1. PageLayout     ← 整合框架
2. Header         ← 導覽功能
3. Footer         ← 頁尾連結
4. HeroSection    ← 主視覺
5. TextSection    ← 文字內容
6. ImageSection   ← 圖片內容
7. [...slug]      ← 動態路由
```

---

## 驗收標準

### 功能

- [x] 36 個頁面正確渲染
- [x] Header 導覽運作
- [x] Footer 連結正確
- [x] RWD 切換正常 (1024px)
- [x] Breadcrumb 導覽 (內頁)
- [x] PopupModal 彈窗 (首頁)

### 技術

- [x] TypeScript 無錯誤
- [x] Build 成功
- [x] Lighthouse Performance: 97, SEO: 100

### 建置測試

```bash
npm run build && cd astro-app && pnpm build
ls astro-app/dist/*.html | wc -l  # 應為 22+
```

---

## 相關文件

| 文件 | 說明 |
|------|------|
| [COMPONENTS.md](../../astro-app/src/COMPONENTS.md) | 元件設計規格 |
| [README.md](../../astro-app/README.md) | Build 流程 |
| [content.ts](../../astro-app/src/utils/content.ts) | 內容讀取 API |
