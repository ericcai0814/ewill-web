# 路由架構說明

本文件說明 Astro 專案的路由架構設計與實作方式。

## 架構概覽

### Prompt 描述 vs 實際實作

| 面向 | Prompt 描述 | 實際實作 |
|------|-------------|----------|
| 內容來源 | 執行時讀取 `content/*.md` + `*.yml` | 建置時預處理為 JSON |
| 讀取方式 | `getContentByPath(path)` | `getPageContent(slug)` |
| 頁面列表 | `getAllPages()` | ✅ 相同 |
| 類型篩選 | `getPagesByType(type)` | ✅ 已實作 |
| 動態路由 | `[...slug].astro` | ✅ 相同 |
| 目錄結構 | 巢狀（`products/xxx`）| 扁平（`xxx`）|

### 資料流程

```
┌─────────────────────────────────────────────────────────────────┐
│                        建置階段 (Build Time)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   pages/                    content-build              public/  │
│   ├── about_us/             ─────────────►            content/  │
│   │   ├── index.md                                    ├── manifest.json
│   │   ├── index.yml         1. 解析 md/yml            ├── pages/
│   │   └── assets/           2. 合併為 JSON            │   ├── about_us.json
│   │       └── *.jpg         3. 正規化圖片             │   ├── index.json
│   └── ...                   4. 產生 manifest          │   └── ...
│                                                       └── asset-manifest.json
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        執行階段 (Runtime)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   src/pages/                                                    │
│   ├── index.astro           getPageContent('index')             │
│   │                         ─────────────►  public/content/pages/index.json
│   └── [...slug].astro       getPageContent(slug)                │
│                             ─────────────►  public/content/pages/{slug}.json
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 為什麼需要 Content Build？

### 設計決策

選擇「預建置 JSON」而非「執行時直接讀取 md/yml」的原因：

#### 優點

| 優點 | 說明 |
|------|------|
| **建置時驗證** | 解析錯誤在建置時就會被發現，而非執行時 |
| **執行效能** | JSON 解析比 YAML + Markdown 解析快 10-50 倍 |
| **圖片處理** | 建置時可進行圖片正規化、產生不同尺寸 |
| **快取友善** | JSON 檔案可直接被 CDN 快取 |
| **型別安全** | 產生的 JSON 結構固定，TypeScript 型別檢查更可靠 |
| **部署簡化** | 靜態檔案部署，無需伺服器端 YAML/Markdown 解析器 |

#### 缺點

| 缺點 | 說明 | 緩解方式 |
|------|------|----------|
| **額外建置步驟** | 修改內容後需執行 `content-build` | 可整合到 dev server watch |
| **雙重來源** | md/yml 與 JSON 可能不同步 | `sync-content --check` 驗證 |
| **開發體驗** | 無法直接熱更新內容 | 開發模式禁用快取 |

### 替代方案比較

| 方案 | 建置複雜度 | 執行效能 | 開發體驗 |
|------|-----------|----------|----------|
| **預建置 JSON（現行）** | 中 | ⭐⭐⭐ 最快 | 需額外步驟 |
| 執行時讀取 md/yml | 低 | ⭐ 較慢 | 即時更新 |
| Astro Content Collections | 低 | ⭐⭐ 中等 | 框架整合 |

## 路由結構

### 現有路由

```
src/pages/
├── index.astro          # 首頁 → /
└── [...slug].astro      # 動態路由 → /{slug}
```

### URL 對應

| 頁面 slug | URL |
|-----------|-----|
| `index` | `/` |
| `about_us` | `/about_us` |
| `bitdefender` | `/bitdefender` |
| `event_20251021` | `/event_20251021` |

## 內容讀取 API

### getPageContent(slug)

讀取單一頁面的完整內容。

```typescript
const page = await getPageContent('about_us');
// 返回 PageContent 物件，包含 seo、layout、content 等
```

### getAllPages()

取得所有可用頁面的 slug 列表。

```typescript
const pages = await getAllPages();
// ['index', 'about_us', 'bitdefender', ...]
```

### getPagesByType(type)

依類型篩選頁面。

```typescript
type PageType = 'security' | 'infrastructure' | 'manufacturing' | 'event' | 'general';

const securityProducts = await getPagesByType('security');
// ['acunetix', 'bitdefender', 'fortinet', ...]

const events = await getPagesByType('event');
// ['event_20251021', 'event_20251118', ...]
```

### getPageType(slug)

取得頁面的類型。

```typescript
getPageType('bitdefender');  // 'security'
getPageType('event_20251021');  // 'event'
getPageType('about_us');  // 'general'
```

## 巢狀路由分析

### 現狀：扁平結構

```
/bitdefender
/fortinet
/about_us
```

### 可能的巢狀結構

```
/security-solutions/bitdefender
/security-solutions/fortinet
/about
```

### 實作可行性

**技術上可行**，需要：

1. 修改 `[...slug].astro` 支援多層路徑
2. 更新 `url_mapping` 配置
3. content-build 產生對應的目錄結構

```typescript
// [...slug].astro 已支援多層路徑
export const getStaticPaths = async () => {
  return [
    { params: { slug: 'security-solutions/bitdefender' } },
    { params: { slug: 'about' } },
  ];
};
```

### 是否必要？

| 考量因素 | 扁平結構 | 巢狀結構 |
|----------|----------|----------|
| **SEO** | URL 較短 | 層級較清晰 |
| **使用者體驗** | 直接存取 | 需記憶路徑 |
| **維護成本** | 低 | 需同步 redirect |
| **現有連結** | 無需變更 | 需設定 301 |

**建議**：

- **短期**：維持扁平結構，避免 SEO 風險
- **長期**：若有明確的資訊架構需求，可透過 `url_mapping.new_url` 逐步遷移

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `src/utils/content.ts` | 內容讀取工具 |
| `src/pages/[...slug].astro` | 動態路由 |
| `src/pages/index.astro` | 首頁 |
| `src/layouts/PageLayout.astro` | 頁面版型 |
| `.claude/skills/content-build/` | 內容建置工具 |
