# 鎰威科技 Astro 專案

基於 Astro 5.x 建立的企業形象官網，使用 SSG 靜態生成，整合 content-build 內容處理流水線。

## 技術棧

- **框架**: Astro 5.x
- **語言**: TypeScript (strict mode)
- **樣式**: Tailwind CSS 4.x
- **內容處理**: content-build pipeline
- **套件管理**: pnpm

## Build

本專案採用兩階段建置：先由 `content-build` 處理內容與圖片，再由 Astro 進行 SSG 靜態生成。

### 快速開始

```bash
# 完整建置（兩階段）
cd /path/to/ewill-web
npm run build && cd astro-app && pnpm build

# 預覽產出
pnpm preview
```

### 建置流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  pages/         │ ──► │  content-build  │ ──► │  astro build    │
│  (md + yml)     │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                        │
                               ▼                        ▼
                        astro-app/public/         astro-app/dist/
                        ├── assets/               └── (靜態網站)
                        ├── asset-manifest.json
                        └── content/
                            └── pages/*.json
```

**階段一：content-build**

```bash
# 從專案根目錄執行
npm run build                    # 自動偵測 Astro
npm run build -- --target=astro  # 明確指定
```

產出（輸出到 `astro-app/public/`）：
- `assets/` — 正規化圖片（ASCII 檔名 + hash + RWD 變體）
- `asset-manifest.json` — 圖片清單
- `content/pages/*.json` — 編譯後頁面（22 頁）
- `content/manifest.json` — 頁面清單

**階段二：Astro SSG**

```bash
cd astro-app
pnpm build      # 產出到 dist/
pnpm preview    # 本地預覽 http://localhost:4321
```

### 開發模式

開發時需先執行 content-build：

```bash
# 1. 執行 content-build（產出 public/content/）
npm run build

# 2. 啟動 dev server
cd astro-app && pnpm dev
```

### 環境需求

| 項目 | 版本 |
|------|------|
| Node.js | >= 20.x |
| pnpm | >= 9.x |

### 常見問題

**Q: content-build 找不到框架？**
```bash
# 確認 astro.config.mjs 存在
ls astro-app/astro.config.mjs

# 手動指定 target
npm run build -- --target=astro
```

**Q: 圖片 404？**
```bash
# 檢查 public/assets/ 是否有檔案
ls astro-app/public/assets/ | head -5

# 重新執行 content-build
npm run build
```

**Q: Astro build 失敗「無法讀取 content」？**
```bash
# 確認 content-build 已執行
ls astro-app/public/content/pages/

# 應該看到 index.json, about_us.json 等檔案
```

**Q: 中文檔名出現在 dist/？**

content-build 未執行。重新執行：
```bash
npm run build && cd astro-app && pnpm build
```

## 專案結構

```
astro-app/
├── public/                 # content-build 產出
│   ├── assets/             # 正規化圖片
│   ├── asset-manifest.json # 圖片清單
│   └── content/            # 頁面 JSON
├── src/
│   ├── layouts/            # 版型
│   ├── components/         # 元件
│   ├── pages/              # 頁面路由
│   ├── styles/             # 樣式
│   └── utils/
│       └── content.ts      # 內容讀取 API
├── dist/                   # Astro 建置產出
└── astro.config.mjs        # Astro 配置
```

## 內容 API

```typescript
import { getPageContent, getAllPages, getAssetById } from '../utils/content';

// 讀取單一頁面
const page = await getPageContent('index');
// page.seo, page.layout, page.content

// 取得所有頁面 slug
const pages = await getAllPages();
// ['index', 'about_us', 'solutions', ...]

// 根據 ID 取得圖片
const asset = await getAssetById('hero_banner');
// asset.normalized_path, asset.variants.desktop, asset.variants.mobile
```
