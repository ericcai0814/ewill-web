# Content Guide 內容填充指南

## 內容來源

所有內容來自 `pages/` 目錄：

```
pages/
├── {page}/
│   ├── index.md      # 📝 頁面內容（人工編輯）
│   ├── index.yml     # 🔧 頁面元資料 + layout.sections（程式產生）
│   └── assets/       # 圖片資源
│       ├── *.jpg|png
│       └── *.yml     # 圖片元資料
```

## 內容編輯流程

```
1. 編輯 index.md（人工）
2. 執行 npm run sync-content（自動轉換）
3. 產生 index.yml 的 layout.sections（自動）
4. Commit 兩個檔案
```

> ⚠️ **請勿手動編輯 `layout.sections`**，應編輯 `index.md` 後執行同步腳本

## index.md 格式規範

### 基本結構

```markdown
##### English Label

## 中文標題

段落內容...

![](assets/image.jpg)

##### Another Label

## 另一個標題

更多內容...

![](assets/another.jpg)
```

### 格式說明

| Markdown 語法 | 用途 | 轉換結果 |
|--------------|------|----------|
| `##### Label` | 英文小標（斜體） | section.label |
| `## 標題` | 主標題 | section.title |
| `### 副標題` | 副標題 | 包含在 content |
| `#### 說明` | 說明文字 | 包含在 content |
| 段落文字 | 內容 | section.content |
| `![](assets/xxx.jpg)` | 圖片 | type: image, image_id |

### 圖片引用

使用相對路徑引用 `assets/` 目錄下的圖片：

```markdown
![](assets/banner.jpg)
```

轉換腳本會：
1. 解析圖片路徑
2. 查找對應的 `.yml` 描述檔
3. 取得 `id` 欄位
4. 產生 `{ type: "image", image_id: "xxx" }`

## 轉換結果範例

### 輸入：index.md

```markdown
##### About Us

## 公司簡介

鎰威科技專注於推動企業數位轉型...

![](assets/about_us_1.png)

##### Milestones

## 公司沿革

我們的成長歷程...

![](assets/timeline.png)
```

### 輸出：index.yml 的 layout.sections

```yaml
layout:
  sections:
    - type: "text"
      label: "About Us"
      title: "公司簡介"
      content: |
        鎰威科技專注於推動企業數位轉型...
    - type: "image"
      image_id: "about_us_1"
    - type: "text"
      label: "Milestones"
      title: "公司沿革"
      content: |
        我們的成長歷程...
    - type: "image"
      image_id: "timeline"
```

## 程式讀取

### 使用 composables/useContent.ts

```typescript
import { useContent } from '~/composables/useContent'

const { pageContent, findAssetById } = useContent('logsec')

// pageContent.layout.sections 包含結構化內容
// findAssetById('image_id') 取得圖片資訊
```

### Section 類型

| type | 欄位 | 說明 |
|------|------|------|
| `text` | `label`, `title`, `content` | 文字區塊 |
| `image` | `image_id` | 圖片區塊 |

## index.yml 其他區塊

以下區塊需**手動維護**（不受 sync-content 影響）：

### SEO 區塊

```yaml
seo:
  title: "頁面標題 - 鎰威科技"
  description: "頁面描述..."
  keywords:
    - 關鍵字1
    - 關鍵字2
```

### URL Mapping 區塊

```yaml
url_mapping:
  current_url: "/about/"
  old_url: "/about_us/"
  redirect: true
```

### Hero 區塊

```yaml
layout:
  hero:
    image:
      id: banner_id  # 手動指定 Banner 圖片
```

## 同步指令

```bash
# 同步所有頁面
npm run sync-content

# 同步特定頁面
npm run sync-content -- --page=about_us
```

## 注意事項

1. **圖片必須有 .yml 描述檔**：轉換腳本需要讀取 `id` 欄位
2. **保持 md 和 yml 同步**：每次編輯 md 後都要執行 sync-content
3. **Commit 兩個檔案**：md 和 yml 應一起提交
4. **Hero 圖片手動設定**：`layout.hero.image.id` 不由腳本產生
