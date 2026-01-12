# Content Build 完整工作流程

## 工作流程概覽

```
1. 偵測目標        → 檢查 next.config.* 或 nuxt.config.*（無則 static）
2. 圖片管理        → 確保圖片有 .yml 元資料
3. normalize-assets → 正規化檔名，產出 asset-manifest.json
4. audit-content    → 檢查 md 是否違規引用原始檔名
5. build-content    → 解析 index.yml，產出 {outputDir}/content + {outputDir}/assets
```

---

## 圖片資源管理

### 目錄結構

所有頁面都遵循相同結構：

```
pages/
└── {page}/
    ├── index.md          # 內容 markdown
    ├── index.yml         # 頁面配置（SEO、layout）
    └── assets/           # 圖片資源
        ├── image.jpg
        ├── image.jpg.yml # 圖片元資料
        └── ...
```

### 規範要點

| 規則 | 說明 |
|------|------|
| 圖片位置 | 必須存放於 `assets/` 子目錄 |
| 元資料檔 | 每張圖片**必須**有對應的 `.yml` 檔 |
| 檔名格式 | `{圖片檔名}.yml`（如 `banner.jpg.yml`） |

### 圖片元資料格式（.yml）

```yaml
# pages/index/assets/home-banner.png.yml
id: hero_banner                    # 必要：圖片識別碼
alt: 首頁主視覺橫幅                  # 必要：替代文字（SEO/無障礙）
description: "詳細描述..."          # 選填：供 AI/人類閱讀
variants:                          # 選填：RWD 變體
  desktop: home-banner.png
  mobile: home-banner-m.jpg
```

| 欄位 | 必要 | 說明 |
|------|:----:|------|
| `id` | ✓ | 圖片識別碼，用於 layout 引用 |
| `alt` | ✓ | 圖片替代文字（SEO/無障礙） |
| `description` | - | 詳細描述（供 AI/人類閱讀） |
| `variants` | - | RWD 變體對應檔案 |

### 檢查缺少元資料的圖片

```bash
python3 .agent/scripts/find_undescribed.py
python3 .agent/scripts/find_undescribed.py pages/index/  # 掃描指定目錄
```

---

## Step 1: Normalize Assets

正規化圖片檔名，產出資源清單。

```bash
npx tsx .claude/skills/content-build/scripts/normalize-assets.ts
```

### 輸入

- `pages/*/assets/*` - 原始圖片
- `pages/*/assets/*.yml` - 圖片元資料

### 輸出

- `dist/assets/` - 正規化後的圖片
- `dist/asset-manifest.json` - 檔名對應表

### 檔名正規化規則

| 原始檔名       | 正規化結果                    |
| -------------- | ----------------------------- |
| `首頁橫幅.jpg` | `hero_a1b2c3.jpg`（有 .yml）  |
| `首頁橫幅.jpg` | `img_a1b2c3d4.jpg`（無 .yml） |
| `Banner.PNG`   | `banner_a1b2c3.png`（大寫轉小寫） |

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

---

## Step 2: Audit Content

檢查 markdown 是否違規引用原始檔名。

```bash
npx tsx .claude/skills/content-build/scripts/audit-content.ts
```

### 檢查規則

| 規則               | 說明                         | 範例                          |
| ------------------ | ---------------------------- | ----------------------------- |
| `no-raw-asset-ref` | 禁止引用未正規化檔名         | `![](assets/首頁橫幅.jpg)` ❌ |
| `use-image-id`     | 應使用 image_id 於 index.yml | `layout.hero.image_id` ✅     |

### 輸出範例

```
❌ pages/home/index.md:15 - 禁止直接引用 assets/首頁橫幅.jpg
   建議：移至 index.yml 使用 image_id: hero_banner

✅ All 12 pages passed audit
```

---

## Step 3: Build Content

解析 index.yml，產出頁面 JSON。

```bash
npx tsx .claude/skills/content-build/scripts/build-content.ts
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
      desktop: hero_banner_desktop  # 可選
      mobile: hero_banner_mobile    # 可選

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

---

## 輔助工具腳本

### fix-yml-metadata.py

批次補齊 `.yml` 檔案的 `id` 和 `alt` 欄位。

```bash
python3 .agent/scripts/fix-yml-metadata.py
```

- 從 `description` 自動生成 `alt`（取前 50 字）
- 從檔名自動生成 `id`（ASCII 小寫）

### migrate-image-refs.py

遷移圖片引用：從 `index.md` 移至 `index.yml` layout。

```bash
python3 .agent/scripts/migrate-image-refs.py
```

- 提取 `index.md` 中的 `![](assets/...)` 引用
- 生成 `index.yml` 的 `layout.hero` 和 `layout.content_images`
- 移除 `index.md` 中的圖片引用
