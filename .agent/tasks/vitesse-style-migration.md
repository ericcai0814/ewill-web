# Vitesse Style 設計風格遷移計畫

> **建立日期**: 2026-01-14
> **狀態**: 📋 Planning
> **預估影響**: 18 個元件、1 個全域樣式檔、1 個設計規範文件

---

## 一、變更概述

### 1.1 目標

將現有的「鎰威科技品牌風格」遷移至「Vitesse Style」極簡開發者美學。

### 1.2 設計哲學差異

| 項目 | 現有風格 | Vitesse Style |
|------|----------|---------------|
| **整體調性** | 專業科技感、企業級 | 極簡、功能優先、開發者導向 |
| **色彩** | Teal 漸層 (#2D9B9B) | Emerald 單色 (#10b981) |
| **陰影** | 多層陰影 (shadow-card) | 無陰影或極淺 |
| **圓角** | 12px-24px | rounded / rounded-md |
| **動效** | 上浮 + 陰影變化 | 淡入淡出 + 透明度 |
| **字型** | Poppins + Noto Sans TC | Inter + system-ui |
| **佈局寬度** | 1200-1400px | 768-1024px |

---

## 二、Phase 分解

### Phase 1: 基礎設施準備 ⏱️ 優先執行

**目標**：建立 Vitesse 色彩系統與 CSS 變數

| # | 任務 | 檔案 | 說明 |
|---|------|------|------|
| 1.1 | 更新 CSS 變數 | `astro-app/src/styles/global.css` | 替換 @theme 色彩定義 |
| 1.2 | 新增 Vitesse 色彩 | 同上 | 淺色/深色模式變數 |
| 1.3 | 移除漸層定義 | 同上 | 刪除 --gradient-* 變數 |
| 1.4 | 更新字型定義 | 同上 | Inter + system-ui |
| 1.5 | 簡化陰影定義 | 同上 | 移除或極度淺化 |

**Phase 1 CSS 變數規格**：

```css
/* Vitesse Light Mode */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --border-color: #e5e7eb;
  --accent: #10b981;
  --accent-hover: #059669;

  color-scheme: light;
}

/* Vitesse Dark Mode */
.dark {
  --bg-primary: #121212;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #262626;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --border-color: #374151;
  --accent: #34d399;
  --accent-hover: #6ee7b7;

  color-scheme: dark;
}
```

---

### Phase 2: Layout 元件重構

**目標**：簡化 Header、Footer、佈局寬度

| # | 任務 | 檔案 | 說明 |
|---|------|------|------|
| 2.1 | 簡化 Header | `Header.astro` | 移除毛玻璃效果、簡化導覽 |
| 2.2 | 簡化 Footer | `Footer.astro` | 移除漸層背景、簡化欄位 |
| 2.3 | 調整容器寬度 | `PageLayout.astro` | max-width: 1024px |
| 2.4 | 新增暗色切換 | `Header.astro` | 右上角 icon |

**Header 設計規格**：
- 高度：64px
- 背景：`--bg-primary`（無毛玻璃）
- Logo + 主要連結 + Dark Mode Toggle
- 無陰影或僅 1px 底部邊框

**Footer 設計規格**：
- 背景：`--bg-secondary`
- 簡潔連結列表
- 無漸層

---

### Phase 3: Section 元件重構

**目標**：將 12 種 Section 元件改為 Vitesse 風格

| # | 元件 | 變更重點 |
|---|------|----------|
| 3.1 | `HeroSection` | 移除漸層背景、簡化為純色或圖片 |
| 3.2 | `TextSection` | 行高 1.6-1.75、內文寬度限制 |
| 3.3 | `ImageSection` | 移除陰影、簡化圓角 |
| 3.4 | `CardListSection` | 無陰影卡片、淺灰背景區分 |
| 3.5 | `FeatureShowcaseSection` | 簡化視覺效果 |
| 3.6 | `FeatureGridSection` | 簡化 icon 容器 |
| 3.7 | `ProductIntroSection` | 移除 3D 效果 |
| 3.8 | `CTASection` | Ghost style 按鈕 |
| 3.9 | `AnchorSection` | 簡化導覽樣式 |
| 3.10 | `GallerySection` | 簡化外框 |
| 3.11 | `TimelineSection` | 簡化線條 |
| 3.12 | `ContactFormSection` | 簡化輸入框（底線樣式） |

---

### Phase 4: 共用元件與細節

| # | 任務 | 檔案 | 說明 |
|---|------|------|------|
| 4.1 | 更新按鈕樣式 | 全域 CSS | Primary/Secondary/Ghost |
| 4.2 | 更新連結 hover | 全域 CSS | 底線延伸動效 |
| 4.3 | 更新 Breadcrumb | `Breadcrumb.astro` | 簡化分隔符 |
| 4.4 | 更新 SEO | `SEO.astro` | 無需變更 |

**按鈕規格**：

```css
/* Primary Button */
.btn-primary {
  background: var(--accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* rounded-md */
  transition: opacity 0.15s ease;
}
.btn-primary:hover {
  opacity: 0.9;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  transition: background-color 0.15s ease;
}
.btn-ghost:hover {
  background: var(--bg-secondary);
}
```

---

### Phase 5: DESIGN_GUIDELINE.md 更新

**目標**：同步更新設計規範文件

| # | 區塊 | 變更 |
|---|------|------|
| 5.1 | 色彩系統 | 替換為 Vitesse 色彩 |
| 5.2 | Typography | 更新字型與行高 |
| 5.3 | 元件樣式 | 更新按鈕、卡片、表單 |
| 5.4 | 動效規範 | 簡化為 150-300ms |
| 5.5 | Don'ts | 新增 Vitesse 禁止項目 |

---

## 三、Vitesse Style 設計規格速查

### 色彩系統

| 用途 | 淺色模式 | 深色模式 |
|------|----------|----------|
| 背景 | #ffffff | #121212 |
| 次要背景 | #fafafa | #1a1a1a |
| 主文字 | #1a1a1a | #e5e7eb |
| 次要文字 | #6b7280 | #9ca3af |
| 邊框 | #e5e7eb | #374151 |
| 強調色 | #10b981 | #34d399 |

### Typography

| 元素 | 規格 |
|------|------|
| 字型 | Inter, system-ui, sans-serif |
| 內文行高 | 1.6-1.75 |
| 字重 | 400 (內文) / 500 (小標) / 600-700 (大標) |
| 程式碼 | Fira Code, JetBrains Mono, monospace |

### 間距與佈局

| 項目 | 規格 |
|------|------|
| 頁面最大寬度 | 768px-1024px |
| 內容區塊 padding | 1.5rem - 2rem |
| 間距基準 | 4px (8, 12, 16, 24, 32...) |

### 動效

| 項目 | 規格 |
|------|------|
| Duration | 150ms-300ms |
| Easing | ease-out, ease-in-out |
| Hover 效果 | opacity 變化、translateY(-1px)、底線延伸 |

### 禁止項目

- ❌ 漸層背景
- ❌ 多彩配色
- ❌ 過度陰影
- ❌ 花俏動畫
- ❌ 過多邊框裝飾
- ❌ 不必要的 icon 填充

---

## 四、Icon 使用規範

- **圖標庫**：Iconify
- **推薦 icon set**：carbon, tabler, lucide, heroicons
- **大小**：1em 或 1.25em（與文字對齊）
- **顏色**：繼承 currentColor

---

## 五、驗證檢查清單

### Phase 完成檢查

- [ ] 所有元件在淺色/深色模式正常顯示
- [ ] 無漸層背景殘留
- [ ] 無過度陰影殘留
- [ ] 頁面寬度符合 768-1024px
- [ ] 動效時間 ≤ 300ms
- [ ] DESIGN_GUIDELINE.md 已同步更新
- [ ] `npm run build` 無錯誤

### 視覺檢查

- [ ] Header 簡潔、無毛玻璃
- [ ] Footer 無漸層
- [ ] 卡片無陰影或極淺
- [ ] 按鈕樣式符合規格
- [ ] Dark Mode 切換正常

---

## 六、回滾計畫

若需回滾，可透過以下方式：

```bash
# 回滾到遷移前的 commit
git log --oneline -10  # 找到遷移前的 commit
git revert <commit-hash>
```

建議：每個 Phase 完成後獨立 commit，方便部分回滾。

---

## 七、相關文件

- [DESIGN_GUIDELINE.md](../../DESIGN_GUIDELINE.md) - 現有設計規範
- [global.css](../../astro-app/src/styles/global.css) - 全域樣式
- [Vitesse 參考網站](https://vitesse.netlify.app/) - 風格參考

---

## 八、執行記錄

| Phase | 狀態 | 完成日期 | 備註 |
|-------|------|----------|------|
| Phase 1 | ⏳ Pending | - | - |
| Phase 2 | ⏳ Pending | - | - |
| Phase 3 | ⏳ Pending | - | - |
| Phase 4 | ⏳ Pending | - | - |
| Phase 5 | ⏳ Pending | - | - |
