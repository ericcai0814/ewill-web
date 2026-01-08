# Phase 4: 內頁開發

## 目標

實作所有內頁，整合 `pages/*/` 內容。

## 頁面清單

| 路由 | 來源 | 優先級 |
|------|------|:------:|
| `/about` | `pages/about_us/` | P1 |
| `/solutions` | `pages/solutions/` | P1 |
| `/esg` | `pages/esg/` | P2 |
| `/logsec` | `pages/logsec/` | P1 |
| `/acunetix` | `pages/acunetix/` | P2 |
| `/array` | `pages/array/` | P2 |
| `/fortinet` | `pages/fortinet/` | P2 |
| `/palo-alto` | `pages/palo_alto/` | P2 |
| `/security-scorecard` | `pages/security_scorecard/` | P2 |
| `/vicarius-vrx` | `pages/vicarius_vrx/` | P2 |
| `/vmware` | `pages/vmware/` | P2 |
| `/ist` | `pages/ist/` | P2 |
| `/mes` | `pages/mes/` | P3 |
| `/wms` | `pages/wms/` | P3 |
| `/scm` | `pages/scm/` | P3 |
| `/data-middleware` | `pages/data_middleware/` | P3 |
| `/smartmanufacturing-ai` | `pages/smartmanufacturing_ai/` | P3 |

## 頁面模板

### 產品頁模板

```
┌─────────────────────────────────────┐
│            Header                   │
├─────────────────────────────────────┤
│         Hero Banner                 │
├─────────────────────────────────────┤
│         產品介紹                    │
├─────────────────────────────────────┤
│         功能特色                    │
├─────────────────────────────────────┤
│         應用場景                    │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

## 動態路由

```typescript
// app/[slug]/page.tsx
export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page) => ({ slug: page.slug }))
}
```

## 驗收標準

- [ ] 所有頁面可訪問
- [ ] SEO meta 正確
- [ ] 圖片正確載入
- [ ] RWD 正常

