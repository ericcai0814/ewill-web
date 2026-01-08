# Content Contract

本文件定義內容產出的契約，確保前端可正確消費 `dist/` 產物。

## 產物結構

```
dist/
├── assets/
│   ├── {id}_{hash}.{ext}           # 主圖
│   ├── {id}_{hash}_desktop.{ext}   # 桌面版
│   └── {id}_{hash}_mobile.{ext}    # 行動版
├── asset-manifest.json
└── content/
    ├── manifest.json
    └── pages/
        └── {module}.json
```

## 檔名規範

### 正規化規則

| 條件 | 輸入 | 輸出 |
|------|------|------|
| 有 .yml 且有 id | `首頁橫幅.jpg` + `id: hero` | `hero_a1b2c3.jpg` |
| 有 .yml 無 id | `首頁橫幅.jpg` | `img_a1b2c3d4.jpg` |
| 無 .yml，ASCII 檔名 | `banner.jpg` | `banner_a1b2c3.jpg` |
| 無 .yml，非 ASCII | `首頁橫幅.jpg` | `img_a1b2c3d4.jpg` |

### 檔名格式

- **字元集**: `[a-z0-9_.-]` 僅限 ASCII 小寫
- **格式**: `{semantic}_{hash}.{ext}`
- **Hash**: SHA-256 前 8 字元

## RWD 變體契約

### 命名規則

```
{base}_desktop.{ext}  # 桌面版 (≥1024px)
{base}_mobile.{ext}   # 行動版 (<1024px)
```

### 來源優先順序

1. `*.yml` 中指定的 `variants.desktop` / `variants.mobile`
2. 自動偵測同目錄下符合命名規則的檔案
3. 回退使用主圖作為所有變體

### 前端使用

```html
<picture>
  <source media="(min-width: 1024px)" srcset="/assets/hero_a1b2c3_desktop.jpg">
  <source media="(max-width: 1023px)" srcset="/assets/hero_a1b2c3_mobile.jpg">
  <img src="/assets/hero_a1b2c3_desktop.jpg" alt="...">
</picture>
```

或使用 CSS：

```css
.hero {
  background-image: url('/assets/hero_a1b2c3_mobile.jpg');
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('/assets/hero_a1b2c3_desktop.jpg');
  }
}
```

## API 契約

### asset-manifest.json

```typescript
interface AssetManifest {
  generated_at: string  // ISO 8601
  assets: AssetEntry[]
}

interface AssetEntry {
  id: string              // 唯一識別碼
  original_path: string   // 原始路徑 (for debug)
  normalized_path: string // dist/assets/xxx.jpg
  variants: {
    desktop: string       // dist/assets/xxx_desktop.jpg
    mobile: string        // dist/assets/xxx_mobile.jpg
  }
  alt: string             // 替代文字
}
```

### content/manifest.json

```typescript
interface ContentManifest {
  generated_at: string
  pages: PageEntry[]
}

interface PageEntry {
  slug: string    // 頁面 slug
  module: string  // 模組名稱
  path: string    // pages/xxx.json
}
```

### content/pages/*.json

```typescript
interface PageContent {
  slug: string
  module: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  url_mapping: {
    current_url: string
    new_url: string
  }
  layout: {
    hero?: {
      image?: ResolvedImage
    }
    sections?: Section[]
  }
  content: string  // Markdown 原始內容
  generated_at: string
}

interface ResolvedImage {
  id: string
  desktop: string  // /assets/xxx_desktop.jpg
  mobile: string   // /assets/xxx_mobile.jpg
  alt: string
}
```

## 不變式 (Invariants)

以下條件在任何 build 後都必須成立：

1. **檔名 ASCII**: `dist/assets/*` 所有檔名僅含 `[a-z0-9_.-]`
2. **路徑一致**: `asset-manifest.json` 中的所有 `normalized_path` 都存在於檔案系統
3. **ID 唯一**: 所有 `AssetEntry.id` 在 manifest 中唯一
4. **Layout 已解析**: `pages/*.json` 中的 `layout.hero.image.desktop` 為完整公開路徑，非 id

## 錯誤處理

### normalize-assets.ts

| 情況 | 處理 |
|------|------|
| .yml 解析失敗 | 警告並使用 hash 命名 |
| 檔案讀取失敗 | 錯誤並跳過該檔案 |
| ID 重複 | 自動加上數字後綴 `{id}_1` |

### audit-content.ts

| 情況 | 處理 |
|------|------|
| 發現違規引用 | 回報錯誤，exit 1 |
| 無違規 | exit 0 |

### build-content.ts

| 情況 | 處理 |
|------|------|
| asset-manifest.json 不存在 | 錯誤並終止 |
| image_id 找不到對應資源 | 警告並設為 null |
| index.yml 解析失敗 | 警告並跳過該模組 |
