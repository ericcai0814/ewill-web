# SEO 完整實現計畫

## 現況分析

### 已實現 ✅
| 項目 | 狀態 | 位置 |
|------|------|------|
| SEO.astro 元件 | ✅ 完成 | `src/components/SEO.astro` |
| Meta tags (title, description, keywords) | ✅ 完成 | SEO.astro |
| Open Graph 基礎標籤 | ✅ 完成 | SEO.astro |
| Twitter Card | ✅ 完成 | SEO.astro |
| JSON-LD (Organization, WebSite, WebPage, FAQ) | ✅ 完成 | SEO.astro |
| Sitemap 自動生成 | ✅ 完成 | @astrojs/sitemap |
| yml aio 結構定義 | ✅ 完成 | pages/*/index.yml |

### 需改進/新增 ❌
| 項目 | 狀態 | 說明 |
|------|------|------|
| robots.txt | ❌ 缺少 | 需建立靜態檔案 |
| 301 Redirect | ❌ 未實現 | url_mapping 結構存在但未處理 |
| OG Image 1200x630 | ⚠️ 部分 | 缺少自動調整尺寸 |
| BreadcrumbList JSON-LD | ⚠️ 部分 | 需確認正確傳遞到 SEO 元件 |
| Product Schema | ⚠️ 部分 | 產品頁需完善 |
| Article Schema | ❌ 缺少 | 活動/新聞頁需新增 |
| Service Schema | ❌ 缺少 | 服務頁需新增 |

---

## 實現計畫

### Phase 1: 基礎設施 (技術 SEO)

#### 1.1 建立 robots.txt
**檔案**: `astro-app/public/robots.txt`

```txt
User-agent: *
Allow: /

Sitemap: https://www.ewill.com.tw/sitemap-index.xml

# 禁止爬取的路徑
Disallow: /api/
Disallow: /_astro/
```

#### 1.2 實現 301 Redirect
**方式**: Astro middleware 或 _redirects 檔案

```ts
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

const redirects: Record<string, string> = {
  '/old-path/': '/new-path/',
  // 從 url_mapping.old_url → url_mapping.current_url
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (redirects[pathname]) {
    return context.redirect(redirects[pathname], 301);
  }

  return next();
});
```

#### 1.3 Sitemap 優化
**修改**: `astro.config.mjs`

```js
sitemap({
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: new Date(),
  filter: (page) => !page.includes('/api/'),
  serialize: (item) => {
    // 根據頁面類型設定優先級
    if (item.url === 'https://www.ewill.com.tw/') {
      item.priority = 1.0;
    } else if (item.url.includes('/solutions/') || item.url.includes('/services/')) {
      item.priority = 0.9;
    }
    return item;
  },
})
```

---

### Phase 2: Meta Tags 完善

#### 2.1 更新 SEO.astro

**新增功能**:
- og:image 預設值
- og:image:width / og:image:height
- twitter:site / twitter:creator
- article 相關 meta (published_time, modified_time)

```astro
<!-- 新增 OG Image 尺寸 -->
{ogImage && (
  <>
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
  </>
)}

<!-- Twitter 帳號 -->
<meta name="twitter:site" content="@ewilltechnology" />

<!-- Article Meta (條件渲染) -->
{ogType === 'article' && publishedTime && (
  <>
    <meta property="article:published_time" content={publishedTime} />
    <meta property="article:modified_time" content={modifiedTime || publishedTime} />
    <meta property="article:author" content="鎰威科技" />
  </>
)}
```

#### 2.2 OG Image 自動處理
**方案**: 建立預設 OG Image 或使用 Hero Banner

```ts
// utils/seo.ts
export function getOgImage(pageContent: PageContent): string {
  // 1. 優先使用頁面指定的 og_image
  if (pageContent.seo?.og_image) {
    return pageContent.seo.og_image;
  }

  // 2. 使用 hero banner desktop 版本
  if (pageContent.layout?.hero?.image?.desktop) {
    return `https://www.ewill.com.tw${pageContent.layout.hero.image.desktop}`;
  }

  // 3. fallback 預設圖片
  return 'https://www.ewill.com.tw/assets/og-default.jpg';
}
```

---

### Phase 3: JSON-LD 結構化資料

#### 3.1 新增 Schema Types

**Product Schema** (產品頁):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Acunetix Web 弱點掃描工具",
  "description": "...",
  "brand": {
    "@type": "Brand",
    "name": "Acunetix"
  },
  "category": "Security Software",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "TWD",
    "seller": {
      "@type": "Organization",
      "name": "鎰威科技"
    }
  }
}
```

**Service Schema** (服務頁):
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "IT Security Consulting",
  "provider": {
    "@type": "Organization",
    "name": "鎰威科技"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Taiwan"
  }
}
```

**Event Schema** (活動頁):
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "企業資安研討會",
  "startDate": "2025-10-21",
  "location": {
    "@type": "Place",
    "name": "台北國際會議中心"
  },
  "organizer": {
    "@type": "Organization",
    "name": "鎰威科技"
  }
}
```

#### 3.2 更新 SEO.astro convertToJsonLd

新增 `Service` 和 `Event` 類型處理：

```ts
case 'Service':
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: data.serviceType,
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: siteName,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Taiwan',
    },
    offers: data.offers,
  };

case 'Event':
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    location: data.location,
    organizer: {
      '@type': 'Organization',
      name: siteName,
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: data.attendanceMode || 'https://schema.org/OfflineEventAttendanceMode',
  };
```

#### 3.3 更新 yml aio 結構

為產品頁新增 product schema:
```yaml
# pages/acunetix/index.yml
aio:
  product:
    type: Product
    name: Acunetix Web 弱點掃描工具
    description: 自動化 Web 應用程式安全測試工具
    brand: Acunetix
    category: Security Software
```

為服務頁新增 service schema:
```yaml
# pages/services/index.yml
aio:
  service:
    type: Service
    serviceType: IT Security Consulting
    name: 資訊安全服務
```

---

### Phase 4: PageLayout 整合

#### 4.1 更新 PageLayout.astro

確保 aio 資料正確傳遞到 SEO 元件：

```astro
// 建構 JSON-LD 資料
function buildJsonLd(aioData: AioData | undefined): JsonLdItem[] {
  if (!aioData) return [];

  const items: JsonLdItem[] = [];

  // Organization (僅首頁)
  if (aioData.organization) {
    items.push({ type: 'Organization', data: aioData.organization });
  }

  // WebSite (僅首頁)
  if (aioData.website) {
    items.push({ type: 'WebSite', data: aioData.website });
  }

  // WebPage (每頁)
  if (aioData.webpage) {
    items.push({ type: 'WebPage', data: aioData.webpage });
  }

  // FAQ
  if (aioData.faq?.length > 0) {
    items.push({ type: 'FAQPage', data: { items: aioData.faq } });
  }

  // Product (產品頁)
  if (aioData.product) {
    items.push({ type: 'Product', data: aioData.product });
  }

  // Service (服務頁)
  if (aioData.service) {
    items.push({ type: 'Service', data: aioData.service });
  }

  // Event (活動頁)
  if (aioData.event) {
    items.push({ type: 'Event', data: aioData.event });
  }

  return items;
}
```

---

## 實現順序

| 優先級 | 項目 | 工時估計 | 影響範圍 |
|--------|------|----------|----------|
| P0 | robots.txt | 5 min | 全站 |
| P0 | Sitemap 優化 | 15 min | 全站 |
| P1 | SEO.astro OG Image 完善 | 30 min | 全站 |
| P1 | Service Schema | 30 min | 服務頁 |
| P1 | Product Schema | 45 min | 產品頁 (20+) |
| P2 | Event Schema | 30 min | 活動頁 (5+) |
| P2 | 301 Redirect | 45 min | 舊 URL |
| P3 | BreadcrumbList 驗證 | 30 min | 全站 |

---

## 驗證清單

### Google Rich Results Test
- [ ] Organization ✓
- [ ] WebSite ✓
- [ ] WebPage ✓
- [ ] FAQPage ✓
- [ ] Product ✓
- [ ] Service ✓
- [ ] Event ✓
- [ ] BreadcrumbList ✓

### Lighthouse SEO Audit
- [ ] Document has a `<title>` element ✓
- [ ] Document has a meta description ✓
- [ ] Page has successful HTTP status code ✓
- [ ] Document has a valid `hreflang` (N/A - 單語系)
- [ ] Document has a valid `rel=canonical` ✓
- [ ] Document avoids plugins ✓
- [ ] Links have descriptive text ✓
- [ ] Page isn't blocked from indexing ✓
- [ ] robots.txt is valid ✓
- [ ] Image elements have `[alt]` attributes ✓
- [ ] Document has a valid `robots.txt` ✓
- [ ] Tap targets are sized appropriately ✓
- [ ] Document uses legible font sizes ✓

---

## 檔案變更清單

| 檔案 | 操作 | 說明 |
|------|------|------|
| `public/robots.txt` | 新增 | 搜尋引擎爬蟲規則 |
| `astro.config.mjs` | 修改 | Sitemap 優化 |
| `src/components/SEO.astro` | 修改 | OG Image, Service, Event Schema |
| `src/types/seo.ts` | 修改 | 新增 Service, Event 類型 |
| `src/utils/content.ts` | 修改 | AioData 新增類型 |
| `src/layouts/PageLayout.astro` | 修改 | buildJsonLd 新增類型 |
| `pages/*/index.yml` | 修改 | 新增 aio.product/service/event |
