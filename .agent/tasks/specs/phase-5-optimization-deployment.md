# Phase 5: 優化與部署

## 目標

效能優化與正式部署。

## 效能優化

### 圖片優化

- 使用 `next/image` 自動優化
- WebP 格式
- Lazy loading（非首屏圖片）
- Priority（首屏圖片）

### 程式碼優化

- 動態 import（按需載入）
- Tree shaking
- Bundle 分析

```bash
npm run build
npx @next/bundle-analyzer
```

### Core Web Vitals 目標

| 指標 | 目標 |
|------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

## SEO 優化

### Meta Tags

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: '鎰威科技',
    template: '%s | 鎰威科技'
  },
  description: '...',
  openGraph: { ... },
  twitter: { ... }
}
```

### Sitemap

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages()
  return pages.map((page) => ({
    url: `https://www.ewill.com.tw${page.url}`,
    lastModified: new Date()
  }))
}
```

### Robots.txt

```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.ewill.com.tw/sitemap.xml'
  }
}
```

## 部署

### Vercel 部署

```bash
npm install -g vercel
vercel
```

### 環境變數

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 網站 URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

## 驗收標準

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO = 100
- [ ] 所有頁面可訪問
- [ ] SSL 憑證正確
- [ ] 舊 URL 重定向正確

