# Nuxt 頁面實作計畫

> **建立日期**: 2026-01-09
> **狀態**: 規劃中

---

## 1. 現況分析

### 1.1 nuxt-app 現有結構

```
nuxt-app/
├── app.vue                    # 主應用入口
├── nuxt.config.ts             # Nuxt 配置（已整合 TailwindCSS）
├── tailwind.config.ts         # TailwindCSS 配置
├── layouts/
│   └── default.vue            # 預設佈局（含簡化 Header/Footer）
├── pages/
│   └── index.vue              # 首頁（已實作）
├── assets/
│   └── css/main.css           # 主樣式（已定義共用元件）
└── public/                    # 靜態資源
```

### 1.2 已實作項目

| 項目 | 狀態 | 說明 |
|------|:----:|------|
| 首頁 | ✅ | `pages/index.vue` - 完整實作 |
| 預設佈局 | ⚠️ | 簡化版 Header/Footer，未使用 `header.yml` |
| TailwindCSS | ✅ | 已配置主色系、共用元件樣式 |
| 設計規範 | ✅ | `section-label`、`section-title`、`btn-*`、`card` |

### 1.3 待實作頁面（20 個）

| 分類 | 模組 | URL | 優先級 |
|------|------|-----|:------:|
| **關於** | `about_us` | `/about/` | 中 |
| **總覽** | `solutions` | `/security-solutions/` | 中 |
| **資安產品** | `logsec` | `/security-solutions/logsec/` | **高** |
| | `palo_alto` | `/security-solutions/palo-alto-networks/` | 低 |
| | `fortinet` | `/security-solutions/fortinet/` | 低 |
| | `acunetix` | `/security-solutions/acunetix/` | 低 |
| | `security_scorecard` | `/security-solutions/security-scorecard/` | 低 |
| | `vicarius_vrx` | `/security-solutions/vicarius-vrx/` | 低 |
| | `array` | `/security-solutions/array-networks/` | 低 |
| | `ist` | `/security-solutions/endpoint-security/` | 低 |
| **基礎架構** | `vmware` | `/infrastructure/vmware/` | 低 |
| **智慧製造** | `smartmanufacturing_ai` | `/smart-manufacturing/` | 低 |
| | `mes` | `/smart-manufacturing/mes/` | 低 |
| | `wms` | `/smart-manufacturing/wms/` | 低 |
| | `scm` | `/smart-manufacturing/scm/` | 低 |
| | `data_middleware` | `/smart-manufacturing/data-platform/` | 低 |
| **其他** | `esg` | `/esg/` | 低 |
| | `event_20251118` | `/events/smart-manufacturing-webinar-2025/` | 低 |
| | `event_20251124` | `/events/passwordless-identity-protection/` | 低 |

---

## 2. 實作優先順序

### Phase 1: 共用元件重構（必要前置）

**目標**：建立可重用的共用元件，使用 `pages/header/header.yml` 資料

| 元件 | 檔案 | 說明 |
|------|------|------|
| AppHeader | `components/AppHeader.vue` | 完整導覽列（含三層選單） |
| AppFooter | `components/AppFooter.vue` | 頁尾（多欄式） |
| SectionHeader | `components/SectionHeader.vue` | 區塊標題（Label + Title） |
| ProductCard | `components/ProductCard.vue` | 產品/服務卡片 |
| ResponsiveImage | `components/ResponsiveImage.vue` | RWD 圖片元件 |

### Phase 2: 頁面模板

| 模板 | 適用頁面 | 區塊 |
|------|----------|------|
| `ProductPage` | 資安產品、基礎架構 | Banner → 特色 → 功能 → FAQ → CTA |
| `CategoryPage` | solutions、smartmanufacturing_ai | Banner → 分類卡片 → CTA |
| `AboutPage` | about_us、esg | Banner → 內容區塊 → CTA |
| `EventPage` | event_* | Banner → 活動資訊 → 報名 |

### Phase 3: 頁面實作順序

1. **高優先**：`logsec`（首頁彈窗連結目標）
2. **中優先**：`about_us`、`solutions`
3. **低優先**：其他產品頁、活動頁

---

## 3. 技術規範

### 3.1 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Nuxt 3 |
| API 風格 | Composition API (`<script setup>`) |
| 樣式 | TailwindCSS |
| 資料來源 | `pages/{module}/index.yml` |
| 圖片來源 | `pages/{module}/assets/` |
| 導覽結構 | `pages/header/header.yml` |

### 3.2 RWD 斷點

| 名稱 | 寬度 | TailwindCSS |
|------|------|-------------|
| Mobile | < 768px | 預設 |
| Tablet | ≥ 768px | `md:` |
| Desktop | ≥ 1024px | `lg:` |
| Wide | ≥ 1280px | `xl:` |

### 3.3 設計規範

| 項目 | 值 |
|------|-----|
| 主色 | `#2D9B9B` (primary-500) |
| 字體 | Poppins (英文) / Noto Sans TC (中文) |
| 卡片圓角 | 12px (`rounded-xl`) |
| 按鈕圓角 | 24px (`rounded-full`) |
| 區塊間距 | 64-96px (`py-16 md:py-24`) |

詳見：[DESIGN_GUIDELINE.md](../../DESIGN_GUIDELINE.md)

---

## 4. 資料流程

```
pages/{module}/index.yml        ← 頁面資料來源
        │
        ▼
┌─────────────────────────┐
│  composables/useContent │     讀取 YAML → 解析為物件
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  nuxt-app/pages/*.vue   │     頁面元件接收並渲染
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  useSeoMeta()           │     設定 SEO meta tags
└─────────────────────────┘
```

---

## 5. 檔案命名規範

### 5.1 頁面路由對應

| 模組目錄 | Nuxt 頁面檔案 | URL |
|----------|---------------|-----|
| `pages/logsec/` | `nuxt-app/pages/security-solutions/logsec.vue` | `/security-solutions/logsec/` |
| `pages/about_us/` | `nuxt-app/pages/about.vue` | `/about/` |
| `pages/solutions/` | `nuxt-app/pages/security-solutions/index.vue` | `/security-solutions/` |

### 5.2 元件命名

| 類型 | 前綴 | 範例 |
|------|------|------|
| 佈局元件 | `App` | `AppHeader.vue`, `AppFooter.vue` |
| 區塊元件 | `Section` | `SectionHero.vue`, `SectionFeatures.vue` |
| UI 元件 | 無 | `ProductCard.vue`, `Button.vue` |

---

## 6. 單一頁面實作 Prompt

```markdown
請實作 **{頁面名稱}** 的 Nuxt 頁面：

## 資料來源
- 頁面資料：`pages/{模組}/index.yml`
- 圖片資源：`pages/{模組}/assets/`
- 導覽結構：`pages/header/header.yml`

## 參考規範
- 設計規範：`DESIGN_GUIDELINE.md`
- 頁面 YML 規範：`GUIDELINES.md` 第 2 章

## 技術要求
- 框架：Nuxt 3（Composition API）
- 樣式：TailwindCSS
- RWD：mobile / tablet / desktop

## 產出檔案
- `nuxt-app/pages/{路由}.vue`
- `nuxt-app/components/{元件}.vue`（如需要）

## 執行步驟
1. 讀取 index.yml 分析結構
2. 確認圖片資源清單
3. 提出實作方案
4. 確認後撰寫程式碼
```

---

## 7. 檢查清單

### 實作前

- [ ] 確認 `index.yml` 存在且結構正確
- [ ] 確認 `assets/` 目錄圖片齊全
- [ ] 確認圖片都有 `.yml` 描述檔

### 實作後

- [ ] Desktop / Tablet / Mobile 顯示正確
- [ ] SEO meta 正確設定（title, description, og:*）
- [ ] 圖片有 alt 文字
- [ ] 連結可正常導航
- [ ] 無 console 錯誤
- [ ] Lighthouse 分數 > 90

---

## 8. 相關文件

| 文件 | 說明 |
|------|------|
| [DESIGN_GUIDELINE.md](../../DESIGN_GUIDELINE.md) | 視覺設計規範 |
| [GUIDELINES.md](../../GUIDELINES.md) | 開發規範、YML 格式 |
| [pages/header/header.yml](../../pages/header/header.yml) | 導覽結構資料 |
| [nuxt-app/assets/css/main.css](../../nuxt-app/assets/css/main.css) | 共用樣式 |
