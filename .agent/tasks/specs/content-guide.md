# Content Guide 內容填充指南

## 內容來源

所有內容來自 `pages/` 目錄：

```
pages/
├── {page}/
│   ├── index.yml     # 頁面內容與元資料（SEO、AIO、layout）
│   ├── index.md      # ⚠️ 已廢棄，內容已遷移至 index.yml
│   └── assets/       # 圖片資源
│       ├── *.jpg|png
│       └── *.yml     # 圖片元資料
```

## 讀取內容

### 使用 lib/content.ts

```typescript
import { getPageContent, getPageAssets } from '@/lib/content'

// 取得頁面內容
const page = await getPageContent('logsec')
// { seo, layout: { hero, sections }, ... }

// 取得圖片資源
const assets = await getPageAssets('logsec')
// [{ id, alt, desktop, mobile }]
```

## 頁面結構

### layout.hero - Hero Banner

```yaml
# pages/logsec/index.yml
layout:
  hero:
    image:
      id: logsec_banner  # 對應 assets/*.yml 中的 id
```

### layout.sections - 頁面內容區塊

頁面內容透過 `sections` 陣列定義，支援 `text` 和 `image` 兩種類型：

```yaml
layout:
  sections:
    # 文字區塊
    - type: "text"
      content: |
        ## 標題
        #### 副標題
        ### 區塊標題
        段落內容...

    # 圖片區塊
    - type: "image"
      image_id: "feature_image"
```

### Section 類型

| type | 必要欄位 | 說明 |
|------|----------|------|
| `text` | `content` | Markdown 格式的文字內容 |
| `image` | `image_id` | 圖片 ID，對應 `assets/*.yml` 中的 `id` |

## 圖片使用

### 從 assets/*.yml 取得圖片資訊

```yaml
# pages/logsec/assets/logsec_banner.jpg.yml
id: logsec_banner
alt: LOGSEC 橫幅圖片
description: "..."
```

### 在元件中使用

```tsx
import { getImageById } from '@/lib/content'

const heroImage = await getImageById('logsec', 'logsec_banner')
// { id, alt, normalized_path, variants: { desktop, mobile } }

<ResponsiveImage
  desktop={heroImage.variants.desktop}
  mobile={heroImage.variants.mobile}
  alt={heroImage.alt}
  priority
/>
```

## SEO 內容

### 從 index.yml 取得 SEO

```yaml
# pages/logsec/index.yml
seo:
  title: LOGSEC 資安預警平台 | 日誌管理 - 鎰威科技
  description: 鎰威科技自主研發 LOGSEC 資安預警平台...
  keywords:
    - LOGSEC
    - 資安預警系統
    - 日誌管理
```

### 應用到 metadata

```typescript
// app/page.tsx
import { getPageContent } from '@/lib/content'

export async function generateMetadata() {
  const page = await getPageContent('logsec')
  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords
  }
}
```

## 注意事項

- **index.md 已廢棄**：所有內容透過 `index.yml` 的 `layout.sections` 管理
- 圖片透過 `image_id` 引用，不再使用 Markdown 圖片語法
- 文字內容使用 Markdown 格式，支援標題、段落等

## 內容更新流程

1. 修改 `pages/{page}/index.yml` 的 `layout.sections`
2. 執行 `npm run build` 重新建置
3. 驗證頁面顯示正確
4. Commit 變更

## 完整範例

```yaml
# pages/logsec/index.yml
seo:
  title: "LOGSEC 資安預警平台 | 日誌管理 - 鎰威科技"
  description: "鎰威科技自主研發 LOGSEC 資安預警平台..."
  keywords:
    - LOGSEC
    - 資安預警系統

url_mapping:
  current_url: "/security-solutions/logsec/"
  old_url: "/logsec/"
  redirect: true

layout:
  hero:
    image:
      id: logsec_banner
  sections:
    - type: "text"
      content: |
        ## LOGSEC
        #### 資安預警解決方案
        ### 平台功能概覽
        LOGSEC 平台透過行為記錄整合...
    - type: "image"
      image_id: "logsec_1_fix"
    - type: "text"
      content: |
        ### 整合日誌，安全更清晰
        客戶設備產生日誌繁多且分散...
    - type: "image"
      image_id: "logsec_2_fix"
```
