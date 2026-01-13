# Astro 元件實作任務

> 建立日期: 2026-01-13
> 狀態: 🚧 進行中
> 設計規格: [`astro-app/src/COMPONENTS.md`](../../astro-app/src/COMPONENTS.md)

## 目標

實作 Astro 元件，將 content-build 產出渲染為完整靜態網站。

---

## 前置條件

- [x] content-build 支援 astro target
- [x] content.ts 讀取 JSON 產出
- [x] 首頁整合驗證
- [x] COMPONENTS.md 設計規格

---

## Phase 1: 核心元件 (P0)

### Layout

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| BaseLayout | ✅ | `Layout.astro` |
| PageLayout | ⬜ | 整合 Header/Footer |

### 共用元件

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| Header | ⬜ | ← header.json |
| Footer | ⬜ | ← footer.json |
| SEO | ⬜ | 已部分實現於 Layout |

### Section 元件

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| HeroSection | ⬜ | RWD picture |
| TextSection | ⬜ | Markdown 渲染 |
| ImageSection | ⬜ | asset manifest 查詢 |

### 頁面路由

| 頁面 | 狀態 | 備註 |
|------|:----:|------|
| index.astro | ✅ | 驗證完成 |
| [...slug].astro | ⬜ | 20 個內頁 |

---

## Phase 2: 增強功能 (P1)

| 元件 | 狀態 | 備註 |
|------|:----:|------|
| Breadcrumb | ⬜ | 麵包屑導覽 |
| PopupModal | ⬜ | 首頁彈窗 |

---

## 實作順序

```
1. PageLayout     ← 整合框架
2. Header         ← 導覽功能
3. Footer         ← 頁尾連結
4. HeroSection    ← 主視覺
5. TextSection    ← 文字內容
6. ImageSection   ← 圖片內容
7. [...slug]      ← 動態路由
```

---

## 驗收標準

### 功能

- [ ] 22 個頁面正確渲染
- [ ] Header 導覽運作
- [ ] Footer 連結正確
- [ ] RWD 切換正常 (1024px)

### 技術

- [ ] TypeScript 無錯誤
- [ ] Build 成功
- [ ] Lighthouse > 90

### 建置測試

```bash
npm run build && cd astro-app && pnpm build
ls astro-app/dist/*.html | wc -l  # 應為 22+
```

---

## 相關文件

| 文件 | 說明 |
|------|------|
| [COMPONENTS.md](../../astro-app/src/COMPONENTS.md) | 元件設計規格 |
| [README.md](../../astro-app/README.md) | Build 流程 |
| [content.ts](../../astro-app/src/utils/content.ts) | 內容讀取 API |
