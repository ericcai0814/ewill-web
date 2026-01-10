# 頁面內容遷移計畫

> **建立日期**: 2026-01-10
> **目標**: 將所有頁面從 `index.md` + `index.yml` 格式遷移至統一的 `index.yml` sections 結構

---

## 1. 遷移狀態總覽

| 狀態 | 數量 | 說明 |
|------|:----:|------|
| ✅ 已遷移 | 1 | `index.md` deprecated，`index.yml` 有 sections |
| ⚠️ 部分遷移 | 1 | `index.yml` 有 sections，但 `index.md` 未標記 deprecated |
| ⏳ 待遷移 | 18 | 需將 `index.md` 內容遷移至 `index.yml` sections |
| ➖ 不適用 | 1 | `header/` 是共用元件，非頁面 |

---

## 2. 各頁面遷移狀態

### ✅ 已完成

| 頁面 | index.md | index.yml sections |
|------|:--------:|:------------------:|
| `logsec` | deprecated | ✅ |

### ⚠️ 需檢查

| 頁面 | index.md | index.yml sections | 備註 |
|------|:--------:|:------------------:|------|
| `index` | 有內容 | ✅ | 需標記 md 為 deprecated |

### ⏳ 待遷移

| 優先級 | 頁面 | 分類 |
|:------:|------|------|
| 高 | `about_us` | 關於我們 |
| 高 | `solutions` | 資安解決方案總覽 |
| 中 | `palo_alto` | 資安產品 |
| 中 | `fortinet` | 資安產品 |
| 中 | `acunetix` | 資安產品 |
| 中 | `security_scorecard` | 資安產品 |
| 中 | `vicarius_vrx` | 資安產品 |
| 中 | `array` | 資安產品 |
| 中 | `ist` | 資安產品 |
| 中 | `vmware` | 基礎架構 |
| 低 | `smartmanufacturing_ai` | 智慧製造總覽 |
| 低 | `mes` | 智慧製造 |
| 低 | `wms` | 智慧製造 |
| 低 | `scm` | 智慧製造 |
| 低 | `data_middleware` | 智慧製造 |
| 低 | `esg` | ESG |
| 低 | `event_20251118` | 活動 |
| 低 | `event_20251124` | 活動 |

### ➖ 不適用

| 頁面 | 說明 |
|------|------|
| `header` | 共用元件（導覽列），非頁面內容 |

---

## 3. 遷移步驟

每個頁面的遷移流程：

### Step 1: 分析現有 index.md 結構

```bash
cat pages/{page}/index.md
```

識別：
- 標題層級（##、###、####）
- 圖片引用（![](assets/xxx.png)）
- 文字段落

### Step 2: 建立 sections 結構

在 `index.yml` 中新增 `layout.sections`：

```yaml
layout:
  hero:
    image:
      id: {banner_id}
  sections:
    - type: "text"
      content: |
        ## 標題
        #### 副標題
        ...
    - type: "image"
      image_id: "{image_id}"
    # 重複交替...
```

### Step 3: 標記 index.md 為 deprecated

```markdown
# This file is deprecated. Content is now managed in index.yml's 'sections' array.
```

### Step 4: 驗證

1. 執行 content-build
2. 檢查 JSON 輸出是否正確
3. 在 Nuxt 頁面中測試渲染

---

## 4. 遷移範本

### 原始 index.md 格式

```markdown
##### About Us

## 公司簡介

鎰威科技專注於推動企業數位轉型...

![](assets/about_us_1.png)

##### Milestones

## 公司沿革

![](assets/timeline_1.png)
```

### 轉換後 index.yml 格式

```yaml
layout:
  hero:
    image:
      id: about_banner
  sections:
    - type: "text"
      content: |
        ## 公司簡介
        #### About Us
        鎰威科技專注於推動企業數位轉型...
    - type: "image"
      image_id: "about_us_1"
    - type: "text"
      content: |
        ## 公司沿革
        #### Milestones
    - type: "image"
      image_id: "timeline_1"
```

---

## 5. 注意事項

1. **圖片 ID 對應**：確保 `image_id` 與 `assets/*.yml` 中的 `id` 一致
2. **Markdown 格式**：content 使用 YAML 多行字串（`|`）
3. **標題層級**：保持原有的標題結構（##、###、####）
4. **內容完整性**：確保所有文字和圖片都正確遷移

---

## 6. 相關文件

- [GUIDELINES.md](../../GUIDELINES.md) - 第 2.1 節 Layout 區塊規範
- [content-guide.md](./specs/content-guide.md) - 內容填充指南
- [nuxt-page-implementation.md](./nuxt-page-implementation.md) - Nuxt 頁面實作計畫
