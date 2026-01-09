# Header 導覽列模組

## 模組資訊

| 欄位 | 內容 |
|------|------|
| 模組路徑 | 全站共用元件 |
| 主要功能 | 網站導覽、品牌識別、轉換入口 |
| 桌面高度 | 80px |
| 手機高度 | 64px |

---

## 版面配置

### 桌面版結構

```
┌──────────────────────────────────────────────────────────────────┐
│  Logo (左)          導覽選單 (中)                    CTA (右)    │
│  ┌─────────┐   ┌──────────────────────────────┐   ┌──────────┐  │
│  │ EWILL   │   │ 活動 │ 關於 │ ESG │ 服務... │   │ 聯絡鎰威 │  │
│  │ 鎰威科技 │   └──────────────────────────────┘   └──────────┘  │
│  └─────────┘                                                      │
└──────────────────────────────────────────────────────────────────┘
```

### 手機版結構

```
┌──────────────────────────────────────┐
│  Logo (左)              漢堡選單 (右) │
│  ┌─────────┐              ┌────────┐ │
│  │ EWILL   │              │   ≡    │ │
│  └─────────┘              └────────┘ │
└──────────────────────────────────────┘
```

---

## 視覺規範

| 屬性 | 桌面版 | 手機版 |
|------|--------|--------|
| 背景色 | 透明 → 白色（滾動後） | 透明 → 白色 |
| 文字色 | `#3F8696` (青藍色) | `#3F8696` |
| 固定行為 | 滾動後消失 | 滾動後消失 |
| Logo 高度 | 40px | 32px |

### CSS 規範

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: transparent;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header--scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header__link {
  font-size: 16px;
  font-weight: 500;
  color: #3F8696;
  padding: 8px 16px;
  transition: color 0.2s ease;
}

.header__link:hover {
  color: #2D9B9B;
}

.header__submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.header__link:hover + .header__submenu,
.header__submenu:hover {
  display: block;
}
```

---

## 導覽結構

### 主選單 (8 項)

1. **活動訊息** - `/event_information/`
2. **關於鎰威** - `/about_us/` (有子選單)
3. **ESG** - `/esg/`
4. **服務項目** - `/services/` (有子選單)
5. **產品解決方案** - `/solutions/` (有子選單，三層)
6. **智慧製造及AI** - `/smartmanufacturing_ai/` (有子選單)
7. **聯絡鎰威** - `/contact/`

### 詳細結構請參見 `header.yml`

---

## 互動行為

### 桌面版

| 行為 | 說明 |
|------|------|
| Hover 主選單 | 顯示下拉子選單 |
| Click 選單項 | 導航至對應頁面 |
| 滾動頁面 | Header 消失（非 Sticky） |

### 手機版

| 行為 | 說明 |
|------|------|
| Click 漢堡選單 | 展開全螢幕側邊選單 |
| Click 展開按鈕 (+) | 展開子選單 |
| Click 選單項 | 導航並關閉選單 |

---

## 相關資源

- Logo 圖片：`assets/logo.png`, `assets/logo-white.png`
- 詳細資料結構：`header.yml`
- 設計規範：`DESIGN_GUIDELINE.md` > 6.3 導覽列

---

## 開發注意事項

1. **無障礙性 (a11y)**
   - 所有連結需有清晰的 `aria-label`
   - 子選單展開狀態需使用 `aria-expanded`
   - 鍵盤導航支援 (Tab, Enter, Escape)

2. **效能考量**
   - 使用 CSS transition 而非 JavaScript 動畫
   - 子選單延遲載入（lazy load）

3. **SEO**
   - 確保所有連結可被爬蟲索引
   - 使用語意化 HTML (`<nav>`, `<ul>`, `<li>`)
