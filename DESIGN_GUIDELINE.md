# 鎰威科技 Design Guideline

本文件定義鎰威科技的視覺設計規範（Vitesse Style），作為 AI Agent 生成 UI 元件、頁面設計時的參考依據，確保產出與品牌視覺一致。

---

## 1. 設計哲學 (Design Philosophy)

### 1.1 Vitesse Style 核心原則

Vitesse Style 是一種極簡主義的開發者導向設計美學，強調：

| 原則 | 說明 |
|------|------|
| **極簡優先** | 移除所有非必要的視覺元素 |
| **內容為王** | 設計服務於內容，而非裝飾 |
| **無漸層** | 使用純色，不使用任何漸層效果 |
| **無重陰影** | 僅使用極淺或無陰影 |
| **功能導向** | 每個元素都有其目的 |

### 1.2 品牌視覺風格

- **整體調性**：專業、簡潔、現代
- **設計語言**：扁平化設計，極簡主義
- **視覺氛圍**：乾淨、專注、高效

### 1.3 品牌標語

```
PROFESSION · FOCUS · SPECIALIZATION
專業 · 專注 · 專精
```

---

## 2. 色彩系統 (Color System)

### 2.1 主色調 - Emerald (祖母綠)

| 名稱 | 色碼 | 用途 |
|------|------|------|
| **Accent** (Light Mode) | `#10b981` | 按鈕、連結、重點元素 |
| **Accent Hover** (Light Mode) | `#059669` | Hover 狀態 |
| **Accent** (Dark Mode) | `#34d399` | 按鈕、連結、重點元素 |
| **Accent Hover** (Dark Mode) | `#6ee7b7` | Hover 狀態 |

### 2.2 Light Mode 配色

| 名稱 | 色碼 | 用途 |
|------|------|------|
| **Background Primary** | `#ffffff` | 主要背景 |
| **Background Secondary** | `#fafafa` | 次要背景、區塊交替 |
| **Background Tertiary** | `#f5f5f5` | 卡片填充、佔位符 |
| **Text Primary** | `#1a1a1a` | 主要文字 |
| **Text Secondary** | `#525252` | 次要文字 |
| **Text Tertiary** | `#a3a3a3` | 輔助文字、placeholder |
| **Border** | `#e5e5e5` | 邊框、分隔線 |

### 2.3 Dark Mode 配色

| 名稱 | 色碼 | 用途 |
|------|------|------|
| **Background Primary** | `#121212` | 主要背景 |
| **Background Secondary** | `#1a1a1a` | 次要背景 |
| **Background Tertiary** | `#262626` | 卡片填充 |
| **Text Primary** | `#f5f5f5` | 主要文字 |
| **Text Secondary** | `#a3a3a3` | 次要文字 |
| **Text Tertiary** | `#737373` | 輔助文字 |
| **Border** | `#404040` | 邊框、分隔線 |

### 2.4 語意色 (Semantic Colors)

| 名稱 | 色碼 | 用途 |
|------|------|------|
| **Success** | `#10b981` | 成功狀態 |
| **Warning** | `#f59e0b` | 警告提示 |
| **Error** | `#ef4444` | 錯誤狀態 |
| **Info** | `#3b82f6` | 資訊提示 |

### 2.5 CSS 變數定義

```css
:root {
  /* 背景 */
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;

  /* 文字 */
  --text-primary: #1a1a1a;
  --text-secondary: #525252;
  --text-tertiary: #a3a3a3;

  /* 邊框 */
  --border-color: #e5e5e5;

  /* 強調色 */
  --accent: #10b981;
  --accent-hover: #059669;
}

.dark {
  --bg-primary: #121212;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #262626;

  --text-primary: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-tertiary: #737373;

  --border-color: #404040;

  --accent: #34d399;
  --accent-hover: #6ee7b7;
}
```

---

## 3. 字型系統 (Typography)

### 3.1 字型家族

| 類型 | 字型 | 備用字型 |
|------|------|----------|
| **主要字型** | Inter | ui-sans-serif, system-ui, sans-serif |
| **等寬字型** | ui-monospace | SFMono-Regular, Menlo, monospace |

### 3.2 字體大小

採用相對保守的字體尺寸，確保閱讀舒適：

| 名稱 | 大小 | 行高 | 用途 |
|------|------|------|------|
| **H1** | 2xl-3xl (24-30px) | 1.3 | 頁面標題 |
| **H2** | xl-2xl (20-24px) | 1.4 | 區塊標題 |
| **H3** | lg (18px) | 1.5 | 卡片標題 |
| **Body** | base (16px) | 1.6-1.75 | 內文 |
| **Small** | sm (14px) | 1.5 | 描述文字 |
| **XSmall** | xs (12px) | 1.4 | 標籤、註解 |

### 3.3 字重

| 名稱 | 字重 | 用途 |
|------|------|------|
| **Regular** | 400 | 內文 |
| **Medium** | 500 | 強調、連結 |
| **SemiBold** | 600 | 標題、按鈕 |

### 3.4 Section Label 樣式

```css
/* 區塊標籤 - 大寫、追蹤字距 */
.section-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent);
}
```

---

## 4. 間距系統 (Spacing)

### 4.1 基準單位

基準單位：**4px**

### 4.2 區塊間距

Vitesse Style 使用較緊湊的間距：

| 場景 | 間距 |
|------|------|
| Section 上下間距 | `48px (py-12)` ~ `64px (py-16)` |
| 區塊標題與內容 | `40px (mb-10)` |
| 卡片間距 | `24px (gap-6)` |
| 卡片內間距 | `20px (p-5)` ~ `24px (p-6)` |

### 4.3 頁面寬度

| 類型 | 最大寬度 | 用途 |
|------|----------|------|
| **container-wide** | 1024px | 統一頁面寬度 |

---

## 5. 元件樣式 (Components)

### 5.1 按鈕 (Buttons)

#### Primary Button

```css
.btn-primary {
  background-color: var(--accent);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease-out;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background-color: var(--accent-hover);
}
```

#### Secondary Button

```css
.btn-secondary {
  background-color: transparent;
  color: var(--accent);
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid var(--accent);
  cursor: pointer;
  transition: all 150ms ease-out;
}

.btn-secondary:hover {
  background-color: var(--accent);
  color: white;
}
```

### 5.2 卡片 (Cards)

#### 基本卡片

```css
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 20px;
  transition: border-color 200ms ease-out;
}

.card:hover {
  border-color: var(--accent);
}
```

#### 填充卡片

```css
.card-filled {
  background-color: var(--bg-secondary);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 20px;
  transition: border-color 200ms ease-out;
}

.card-filled:hover {
  border-color: var(--accent);
}
```

### 5.3 表單元件 (Form Elements)

```css
input, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 200ms ease-out;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
}

input::placeholder, textarea::placeholder {
  color: var(--text-tertiary);
}
```

### 5.4 連結樣式

```css
a {
  color: var(--accent);
  text-decoration: none;
  transition: color 150ms ease-out;
}

a:hover {
  color: var(--accent-hover);
}
```

---

## 6. 版面結構 (Layout)

### 6.1 Header

- 高度：64px (固定)
- 背景：`var(--bg-primary)` + 底部邊框
- 無 backdrop-filter 或 glassmorphism
- Logo 高度：28px

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}
```

### 6.2 Footer

- 背景：`var(--bg-secondary)` + 頂部邊框
- 無漸層
- 4 欄式佈局

```css
.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 48px 0;
}
```

### 6.3 頁面結構

```
┌─────────────────────────────────────┐
│       Header (64px, fixed)          │
├─────────────────────────────────────┤
│              Hero                    │
├─────────────────────────────────────┤
│           Section 1                  │ py-12 ~ py-16
│  ┌─────────────────────────────┐    │
│  │   Label (xs, uppercase)     │    │
│  │   Title (2xl semibold)      │    │
│  │   Content / Cards           │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│           Section 2                  │
├─────────────────────────────────────┤
│              Footer                  │
└─────────────────────────────────────┘
```

### 6.4 Hero Banner

頁面頂部主視覺橫幅，統一高度確保視覺一致性。

| 高度模式 | 手機版 | 桌面版 (≥768px) | 說明 |
|----------|--------|-----------------|------|
| `fixed` (預設) | 300px | 500px | 固定高度，圖片 `object-cover` |
| `full` | 100vh | 100vh | 全螢幕，min-height: 600px |
| `auto` | 依圖片 | 依圖片 | 圖片原始比例 |

```css
/* Fixed 模式 */
.hero-fixed {
  height: 300px;  /* mobile */
}
@media (min-width: 768px) {
  .hero-fixed {
    height: 500px;  /* desktop */
  }
}

/* 圖片填滿 */
.hero-fixed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

**使用指南**：
- 預設使用 `fixed` 模式，確保所有頁面 Banner 高度一致
- 若圖片重要內容在邊緣，可改用 `auto` 避免裁切
- `full` 適用於 Landing Page 首屏效果

---

## 7. 動效規範 (Motion)

### 7.1 過渡時間

Vitesse Style 偏好快速、精準的過渡：

| 類型 | 時長 | 用途 |
|------|------|------|
| **Fast** | 150ms | 按鈕、連結、色彩變化 |
| **Normal** | 200ms | 卡片 hover、展開收合 |
| **Slow** | 300ms | Modal 開關 |

### 7.2 緩動函數

```css
/* 主要緩動 */
--transition-fast: 150ms ease-out;
--transition-normal: 200ms ease-out;
```

### 7.3 禁止的動效

| 禁止 | 原因 |
|------|------|
| ❌ `translateY(-4px)` 上浮效果 | 過於花俏 |
| ❌ `scale(1.05)` 放大效果 | 干擾閱讀 |
| ❌ Box-shadow 變化動畫 | 效能影響 |
| ❌ 複雜的 keyframe 動畫 | 不符極簡原則 |

### 7.4 允許的動效

| 允許 | 用途 |
|------|------|
| ✅ `border-color` 變化 | Hover 狀態指示 |
| ✅ `background-color` 變化 | 按鈕 hover |
| ✅ `opacity` 變化 | 淡入淡出 |
| ✅ `color` 變化 | 連結 hover |

---

## 8. 圖片風格 (Imagery)

### 8.1 圖片處理

- 圓角：6px (rounded-md)
- 背景佔位：`var(--bg-tertiary)`
- 無陰影
- 無邊框裝飾

### 8.2 響應式圖片

使用 `<picture>` 元素提供桌面/手機版本：

```html
<picture>
  <source media="(min-width: 1024px)" srcset="desktop.jpg" />
  <source media="(max-width: 1023px)" srcset="mobile.jpg" />
  <img src="desktop.jpg" alt="描述" />
</picture>
```

---

## 9. AI 生成指引 (AI Prompt Guide)

### 9.1 生成元件時的關鍵字

```
請生成符合 Vitesse Style 的元件：
- 無漸層，使用純色
- 無陰影或僅使用極淺陰影
- 圓角 6px
- 過渡時間 150-200ms
- 使用 CSS 變數 (--bg-primary, --accent 等)
- 字型 Inter/system-ui
- 緊湊的間距
```

### 9.2 不要做的事 (Don'ts)

| 避免 | 原因 |
|------|------|
| ❌ 使用漸層背景 | Vitesse 風格禁止 |
| ❌ 使用深陰影 (box-shadow) | 過於立體 |
| ❌ 使用 hover 上浮效果 | 過於花俏 |
| ❌ 使用 glassmorphism | 不符極簡原則 |
| ❌ 使用大字體 (>30px) | 保持謙遜 |
| ❌ 使用裝飾性元素 | 專注於內容 |
| ❌ 使用 Teal (#2D9B9B) 舊品牌色 | 已改為 Emerald |

### 9.3 要做的事 (Do's)

| 執行 | 原因 |
|------|------|
| ✅ 使用 CSS 變數 | 支援主題切換 |
| ✅ 使用 border 顯示 hover 狀態 | 精準、不干擾 |
| ✅ 使用 emerald (#10b981) 作為強調色 | 當前品牌色 |
| ✅ 保持緊湊間距 | 內容密度適中 |
| ✅ 使用 container-wide | 統一頁面寬度 |

---

## 10. 設計資源 (Resources)

### 10.1 CSS 框架

- Tailwind CSS v4 (with @theme)
- 使用 CSS 變數進行主題管理

### 10.2 Tailwind 自訂 Class

```css
/* 容器 */
.container-wide { max-width: 1024px; margin: 0 auto; padding: 0 24px; }

/* 按鈕 */
.btn { ... }
.btn-primary { ... }
.btn-secondary { ... }

/* 卡片 */
.card { ... }
.card-filled { ... }

/* 排版 */
.prose { ... }
```

### 10.3 參考連結

- 官方網站：https://www.ewill.com.tw/
- Vitesse 參考：https://vitesse.netlify.app/
- 品牌核心價值：專業 · 專注 · 專精

---

## 版本紀錄

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| 1.0.0 | 2026-01-06 | 初版建立 |
| 2.0.0 | 2026-01-14 | 重構為 Vitesse Style，移除漸層、更新色彩系統為 Emerald |
