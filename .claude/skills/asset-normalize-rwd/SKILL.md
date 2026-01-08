---
name: asset-normalize-rwd
description: 圖片資源正規化與 RWD 內容建置流程。將非 ASCII 圖片檔名轉為 ASCII 全小寫，將 RWD 圖片變體從 markdown 移至 index.yml layout spec，產出 dist/content 與 dist/assets。觸發時機：執行網站內容建置、normalize assets、處理圖片檔名、建立 page model。
---

# Asset Normalize + RWD Content Model

將非 ASCII 圖片檔名正規化，並建立 RWD 友善的內容模型。

## 工作流程概覽

```
1. normalize-assets   → 正規化檔名，產出 asset-manifest.json
2. audit-content      → 檢查 md 是否違規引用原始檔名
3. build-content      → 解析 index.yml，產出 dist/content + dist/assets
```

## Step 1: Normalize Assets

執行 `scripts/normalize-assets.ts`：

```bash
npx tsx scripts/normalize-assets.ts
```

### 輸入

- `pages/*/assets/*` - 原始圖片
- `pages/*/assets/*.yml` - 圖片元資料（整合格式，可選）

### 輸出

- `dist/assets/` - 正規化後的圖片
- `dist/asset-manifest.json` - 檔名對應表

### 檔名正規化規則

| 原始檔名       | 正規化結果                    |
| -------------- | ----------------------------- |
| `首頁橫幅.jpg` | `hero_a1b2c3.jpg`（有 .yml）  |
| `首頁橫幅.jpg` | `img_a1b2c3d4.jpg`（無 .yml） |
| `Banner.PNG`   | `banner_a1b2c3.png`（大寫轉小寫） |

### 圖片元資料格式（.yml 整合格式）

```yaml
# pages/index/assets/home-banner-1209.png.yml
id: hero_banner
alt: 首頁主視覺橫幅，深藍色科技背景搭配專業標語
description: "桌機版首頁主視覺橫幅..."
variants:
  desktop: home-banner-1209.png
  mobile: bn-home-m.jpg
```

| 欄位 | 必要 | 說明 |
|------|:----:|------|
| `id` | ✓ | 圖片識別碼，用於 layout 引用 |
| `alt` | ✓ | 圖片替代文字（SEO/無障礙） |
| `description` | - | 詳細描述（供 AI/人類閱讀） |
| `variants` | - | RWD 變體對應檔案 |

### asset-manifest.json 結構

```json
{
  "assets": [
    {
      "id": "hero_banner",
      "original_path": "pages/home/assets/首頁橫幅.jpg",
      "normalized_path": "dist/assets/hero_banner_a1b2c3.jpg",
      "variants": {
        "desktop": "dist/assets/hero_banner_a1b2c3_desktop.jpg",
        "mobile": "dist/assets/hero_banner_a1b2c3_mobile.jpg"
      },
      "alt": "首頁主視覺橫幅"
    }
  ]
}
```

## Step 2: Audit Content

執行 `scripts/audit-content.ts`：

```bash
npx tsx scripts/audit-content.ts
```

### 檢查規則

| 規則               | 說明                         | 範例                          |
| ------------------ | ---------------------------- | ----------------------------- |
| `no-raw-asset-ref` | 禁止引用未正規化檔名         | `![](assets/首頁橫幅.jpg)` ❌ |
| `use-image-id`     | 應使用 image_id 於 index.yml | `layout.hero.image_id` ✅     |

### 輸出

```
❌ pages/home/index.md:15 - 禁止直接引用 assets/首頁橫幅.jpg
   建議：移至 index.yml 使用 image_id: hero_banner

✅ All 12 modules passed audit
```

## Step 3: Build Content

執行 `scripts/build-content.ts`：

```bash
npx tsx scripts/build-content.ts
```

### 輸入

- `pages/*/index.md` - 內容 markdown
- `pages/*/index.yml` - 頁面配置
- `dist/asset-manifest.json` - 資源對應表

### index.yml layout 結構

```yaml
# pages/home/index.yml
seo:
  title: 首頁
  description: 網站首頁描述

layout:
  hero:
    image:
      id: hero_banner
      desktop: hero_banner_desktop # 可選，預設為 {id}_desktop
      mobile: hero_banner_mobile # 可選，預設為 {id}_mobile

  sections:
    - type: feature_cards
      image_ids:
        - feature_01
        - feature_02
```

### 輸出

- `dist/content/pages/*.json` - 解析後的頁面 JSON
- `dist/content/manifest.json` - 頁面清單

### 頁面 JSON 結構

```json
{
  "slug": "home",
  "seo": {"title": "首頁", "description": "..."},
  "layout": {
    "hero": {
      "image": {
        "id": "hero_banner",
        "desktop": "/assets/hero_banner_a1b2c3_desktop.jpg",
        "mobile": "/assets/hero_banner_a1b2c3_mobile.jpg",
        "alt": "首頁主視覺橫幅"
      }
    }
  },
  "content": "..."
}
```

## Schemas

- `schemas/page.schema.json` - 頁面 JSON 結構驗證
- `schemas/image.schema.json` - 圖片資源結構驗證
- `schemas/asset-manifest.schema.json` - 資源清單結構驗證

詳見 [references/schemas.md](references/schemas.md)

## 驗收標準

```bash
# 1. asset-manifest.json 存在且全小寫 ASCII
jq '.assets[].normalized_path' dist/asset-manifest.json | grep -E '^"[a-z0-9_/.-]+"$'

# 2. audit-content 無違規
npx tsx scripts/audit-content.ts && echo "✅ Audit passed"

# 3. 頁面 JSON 已解析圖片路徑
jq '.layout.hero.image.desktop' dist/content/pages/home.json
# 應輸出: "/assets/hero_banner_a1b2c3_desktop.jpg"
```

## 檔案結構

```
專案根目錄/
├── pages/
│   └── {page}/
│       ├── index.md
│       ├── index.yml
│       └── assets/
│           ├── *.jpg|png|webp
│           └── *.yml
├── scripts/
│   ├── normalize-assets.ts
│   ├── audit-content.ts
│   └── build-content.ts
├── schemas/
│   ├── page.schema.json
│   ├── image.schema.json
│   └── asset-manifest.schema.json
├── dist/
│   ├── assets/
│   ├── asset-manifest.json
│   └── content/
│       ├── pages/*.json
│       └── manifest.json
└── docs/
    ├── content-contract.md
    └── content-policy.md
```
