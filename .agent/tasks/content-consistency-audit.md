# 內容一致性稽核任務

> **建立日期**: 2026-01-14
> **執行日期**: 2026-01-14
> **狀態**: 已完成
> **優先級**: 中
> **報告**: [content-consistency-audit-report.md](./content-consistency-audit-report.md)

---

## 任務目標

確保每一頁的 `index.yml`、`index.md` 與 Astro 元件資料完全一致，避免：
- 引用不存在的圖片資源
- 使用未實作的 section type
- md 與 yml 內容不同步
- 孤立的資源檔案

---

## 檢查範圍

```
pages/
├── {page}/
│   ├── index.md          # Markdown 內容
│   ├── index.yml         # 頁面配置
│   └── assets/           # 圖片資源
│       ├── *.jpg/png     # 圖片檔
│       └── *.yml         # 圖片描述

astro-app/src/
├── components/           # Section 元件
└── layouts/
    └── PageLayout.astro  # Section 渲染邏輯
```

---

## 檢查項目

### 1. 圖片資源一致性

| 檢查點 | 說明 |
|--------|------|
| **image_id 存在性** | yml 中引用的 `image_id` 必須存在於 `asset-manifest.json` |
| **assets 描述完整** | 每個 `assets/*.jpg/png` 必須有對應的 `.yml` 描述檔 |
| **孤立資源** | 檢查是否有未被任何 yml 引用的圖片 |

### 2. Section Type 一致性

| 檢查點 | 說明 |
|--------|------|
| **type 已實作** | yml 中的 section `type` 必須有對應的 Astro 元件 |
| **必填欄位** | 每種 type 的必填欄位必須存在 |

**已實作的 Section Types**：

| Type | 元件 | 必填欄位 |
|------|------|----------|
| `text` | TextSection | `content` |
| `image` | ImageSection | `image_id` |
| `card_list` | CardListSection | `cards` |
| `anchor` | AnchorSection | `id`, `cards` |
| `feature_grid` | FeatureGridSection | `features` |
| `cta` | CTASection | `button_text`, `button_link` |
| `product_intro` | ProductIntroSection | `title` |
| `feature_showcase` | FeatureShowcaseSection | `features` |
| `timeline` | TimelineSection | `events` |
| `gallery` | GallerySection | `images` |
| `contact_form` | ContactFormSection | `fields`, `button_text` |

### 3. Content Blocks 同步

| 檢查點 | 說明 |
|--------|------|
| **md → yml 同步** | index.md 的內容區塊數量應與 yml 的 `content.blocks` 一致 |
| **hash 驗證** | 若有 hash 機制，確認內容未被修改 |

### 4. SEO 完整性

| 檢查點 | 說明 |
|--------|------|
| **必填 SEO** | `title`, `description` 必須存在 |
| **keywords 格式** | 必須為陣列格式 |

---

## 執行方式

### 方案 A：手動檢查（小規模）

```bash
# 1. 檢查 image_id 引用
grep -r "image_id:" pages/*/index.yml | cut -d: -f3 | sort | uniq

# 2. 檢查 section types
grep -r "type:" pages/*/index.yml | grep -v "og:type" | cut -d: -f3 | sort | uniq

# 3. 執行 content build 驗證
npm run build
```

### 方案 B：自動化腳本（推薦）

建立 `tools/audit-content-consistency.py`：
- 讀取所有 `pages/*/index.yml`
- 驗證 image_id 存在於 asset-manifest
- 驗證 section type 已實作
- 輸出不一致項目報告

---

## 驗收標準

- [ ] 所有 image_id 引用都能在 asset-manifest.json 找到
- [ ] 所有 section type 都有對應的 Astro 元件
- [ ] 所有 assets 目錄的圖片都有 .yml 描述檔
- [ ] content build 無錯誤
- [ ] Astro build 無錯誤

---

## 預期產出

1. 不一致項目清單（若有）
2. 修復 PR（若需要）
3. 更新 `.agent/system/learnings.md` 記錄發現的問題模式

---

## 相關資源

- [GUIDELINES.md](../../GUIDELINES.md) - index.yml 規範
- [content.ts](../../astro-app/src/utils/content.ts) - 類型定義
- [PageLayout.astro](../../astro-app/src/layouts/PageLayout.astro) - Section 渲染
