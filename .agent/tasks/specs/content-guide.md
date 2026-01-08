# Content Guide 內容填充指南

## 內容來源

所有內容來自 `pages/` 目錄：

```
pages/
├── {page}/
│   ├── index.md      # 文字內容
│   ├── index.yml     # SEO + layout 配置
│   └── assets/       # 圖片資源
│       ├── *.jpg|png
│       └── *.yml     # 圖片元資料
```

## 讀取內容

### 使用 lib/content.ts

```typescript
import { getPageContent, getPageAssets } from '@/lib/content'

// 取得頁面內容
const page = await getPageContent('index')
// { seo, layout, content }

// 取得圖片資源
const assets = await getPageAssets('index')
// [{ id, alt, desktop, mobile }]
```

## 圖片使用

### 從 index.yml layout 取得圖片 ID

```yaml
# pages/index/index.yml
layout:
  hero:
    image:
      id: hero_banner
  sections:
    - type: services
      images:
        - id: service_software
        - id: service_security
        - id: service_system
```

### 從 assets/*.yml 取得圖片資訊

```yaml
# pages/index/assets/home-banner-1209.png.yml
id: hero_banner
alt: 首頁主視覺橫幅
description: "..."
variants:
  desktop: home-banner-1209.png
  mobile: bn-home-m.jpg
```

### 在元件中使用

```tsx
import { getImageById } from '@/lib/content'

const heroImage = await getImageById('index', 'hero_banner')
// { id, alt, desktop: '/assets/...', mobile: '/assets/...' }

<ResponsiveImage
  desktop={heroImage.desktop}
  mobile={heroImage.mobile}
  alt={heroImage.alt}
  priority
/>
```

## SEO 內容

### 從 index.yml 取得 SEO

```yaml
# pages/index/index.yml
seo:
  title: 鎰威科技 | 專業資安與智慧製造解決方案
  description: 鎰威科技專注於企業數位轉型...
  keywords:
    - 資訊安全
    - 智慧製造
    - 數位轉型
```

### 應用到 metadata

```typescript
// app/page.tsx
import { getPageContent } from '@/lib/content'

export async function generateMetadata() {
  const page = await getPageContent('index')
  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords
  }
}
```

## 文字內容

### Markdown 處理

```typescript
import { marked } from 'marked'
import { getPageContent } from '@/lib/content'

const page = await getPageContent('index')
const html = marked(page.content)
```

### 注意事項

- Markdown 中**不應有**圖片引用（已遷移至 layout）
- 使用 layout 配置決定圖片位置
- 文字內容僅包含純文字和格式

## 內容更新流程

1. 修改 `pages/{page}/index.md` 或 `index.yml`
2. 執行 `npm run build` 重新建置
3. 驗證頁面顯示正確
4. Commit 變更

