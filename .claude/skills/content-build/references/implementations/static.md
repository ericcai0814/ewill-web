# Static HTML Implementation

靜態頁面專案的驗證實作指南。

## 環境資訊

| 項目 | 值 |
|------|-----|
| **輸出目錄** | `dist/` |
| **Dev Server** | `python3 -m http.server` 或 `npx serve` |
| **圖片處理** | 自定義 `normalize-assets.ts` |
| **Build** | 自定義腳本 |

---

## 驗證指令對照

| 規則 ID | 驗證指令 |
|---------|----------|
| A1 | `find dist/assets -name '*[^a-z0-9_.-]*' -type f` |
| A2 | `npx tsx scripts/audit-content.ts` |
| A3 | `npx tsx scripts/normalize-assets.ts` (內建檢查) |
| A4 | `grep -r '<img' dist/*.html \| grep -v 'alt='` |
| C1 | `npx tsx scripts/audit-content.ts` |
| C2 | `npx tsx scripts/build-content.ts` |
| C3 | `ajv validate -s schemas/page.schema.json -d dist/content/pages/*.json` |

### 完整驗證流程

```bash
# 1. 正規化資源
npx tsx scripts/normalize-assets.ts

# 2. 稽核內容
npx tsx scripts/audit-content.ts

# 3. 建置內容
npx tsx scripts/build-content.ts

# 4. Schema 驗證 (需安裝 ajv-cli)
npm install -g ajv-cli
ajv validate -s references/schemas/page.schema.json -d dist/content/pages/*.json
```

---

## RWD 驗證

### 啟動本地伺服器

```bash
cd dist && python3 -m http.server 8080
# 或
npx serve dist -p 8080
```

### 測試步驟

1. 開啟 `http://localhost:8080`
2. 開啟 DevTools (F12)
3. 切換至 Responsive Mode

### 斷點測試

| 寬度 | 應顯示 |
|------|--------|
| 1200px | Desktop 版本 |
| 768px | 斷點切換處，確認互斥 |
| 375px | Mobile 版本 |

---

## 圖片 RWD 實作

### 使用 `<picture>` 標籤

```html
<picture>
  <source media="(max-width: 767px)" srcset="assets/hero_mobile.jpg">
  <img src="assets/hero_desktop.jpg" alt="Hero Banner">
</picture>
```

### CSS 備用方案

```css
.hero-desktop { display: block; }
.hero-mobile { display: none; }

@media (max-width: 767px) {
  .hero-desktop { display: none; }
  .hero-mobile { display: block; }
}
```

---

## Popup 實作

### localStorage 首訪檢查

```javascript
const STORAGE_KEY = 'site_popup_dismissed'

function initPopup() {
  if (localStorage.getItem(STORAGE_KEY)) return
  
  setTimeout(() => {
    showPopup()
  }, 2000)
}

function hidePopup() {
  localStorage.setItem(STORAGE_KEY, 'true')
  // hide logic
}
```

### 驗證步驟

```javascript
// 清除 localStorage (在 DevTools Console)
localStorage.removeItem('site_popup_dismissed')

// 重新載入頁面
location.reload()
```

---

## 常見問題

### 圖片 404

```bash
# 檢查 asset-manifest.json 路徑
cat dist/asset-manifest.json | jq '.assets[].normalized_path'

# 確認檔案存在
ls -la dist/assets/
```

### 非 ASCII 檔名

```bash
# 找出非 ASCII 檔名
find dist/assets -name '*[^a-z0-9_.-]*' -type f

# 重新執行正規化
npx tsx scripts/normalize-assets.ts
```

### Schema 驗證失敗

```bash
# 檢視詳細錯誤
ajv validate -s schemas/page.schema.json -d dist/content/pages/index.json --verbose
```

