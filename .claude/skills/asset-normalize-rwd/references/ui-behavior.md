# UI Behavior Specification

本文件定義 UI 元件的行為規格，確保前端實作一致性。

## 目錄

- [通用配置](#通用配置)
- [響應式圖片](#響應式圖片)
- [彈窗 Popup](#彈窗-popup)
- [卡片 Card](#卡片-card)
- [Hero Banner](#hero-banner)

---

## 通用配置

### 斷點 (Breakpoints)

| 名稱 | 寬度 | 說明 |
|------|------|------|
| mobile | < 768px | 手機 |
| tablet | 768px ~ 1023px | 平板 |
| desktop | ≥ 1024px | 桌機 |

可在專案 `site-config.yml` 中覆寫：

```yaml
breakpoints:
  mobile: 768
  tablet: 1024
```

---

## 響應式圖片

### 變體定義

在 `*.yml` 中定義：

```yaml
# home-banner.png.yml
id: hero_banner
alt: 首頁主視覺
variants:
  desktop: home-banner.png
  mobile: home-banner-m.jpg
```

### 渲染規則

| 變體配置 | 輸出 HTML |
|----------|-----------|
| 有 `desktop` + `mobile` | `<picture>` + `<source>` |
| 只有單一圖片 | `<img>` |

#### 標準輸出 (picture)

```html
<picture>
  <source media="(max-width: 767px)" srcset="{mobile_path}">
  <img src="{desktop_path}" alt="{alt}">
</picture>
```

#### CSS 備用方案

當無法使用 `<picture>` 時：

```css
.hero-desktop { display: block; }
.hero-mobile { display: none; }

@media (max-width: 767px) {
  .hero-desktop { display: none; }
  .hero-mobile { display: block; }
}
```

### 不變式

- **互斥顯示**: 同一元件的 desktop/mobile 變體在任何時刻只顯示一個
- **無閃爍**: 切換時不應出現兩張圖同時顯示

---

## 彈窗 Popup

### 觸發器類型

在 `index.yml` 的 `layout.popup` 中定義：

```yaml
layout:
  popup:
    image_id: popup_logsec
    link: "/logsec"
    trigger: "first_visit"  # 觸發器類型
    delay: 2000             # 延遲毫秒 (可選)
```

| trigger | 說明 | 實作機制 |
|---------|------|----------|
| `first_visit` | 首次訪問顯示，關閉後不再顯示 | `localStorage` |
| `session` | 每個 session 首次顯示 | `sessionStorage` |
| `always` | 每次載入都顯示 | 無儲存 |
| `scroll` | 滾動到指定位置顯示 | `IntersectionObserver` |

### first_visit 實作規範

```javascript
const STORAGE_KEY = '{site_id}_{popup_id}_dismissed'

// 檢查是否已顯示過
const hasShown = localStorage.getItem(STORAGE_KEY)

// 首次訪問才顯示
if (!hasShown) {
  setTimeout(showPopup, delay)
}

// 關閉時記錄
function hidePopup() {
  localStorage.setItem(STORAGE_KEY, 'true')
}
```

### 樣式規範

| 屬性 | 必要 | 說明 |
|------|:----:|------|
| 遮罩 (overlay) | ✓ | 半透明背景 `rgba(0,0,0,0.7)` |
| 置中 | ✓ | 水平垂直置中 (`flexbox` 或 `transform`) |
| 關閉方式 | ✓ | 按鈕 / 點擊遮罩 / ESC 鍵 |
| 進場動畫 | - | `scale` + `fade` |

#### 標準 CSS

```css
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.popup-overlay.show {
  opacity: 1;
  visibility: visible;
}

.popup-content {
  position: relative;
  max-width: 80vw;
  max-height: 80vh;
  transform: scale(0.8);
  transition: transform 0.3s;
}

.popup-overlay.show .popup-content {
  transform: scale(1);
}
```

### 關閉行為

```javascript
// 1. 關閉按鈕
closeBtn.addEventListener('click', hidePopup)

// 2. 點擊遮罩
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) hidePopup()
})

// 3. ESC 鍵
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hidePopup()
})
```

---

## 卡片 Card

### 圖片規範

| 屬性 | Desktop | Mobile |
|------|---------|--------|
| `object-fit` | `cover` | `cover` |
| `object-position` | `center` | `center top` |
| `height` | `200px` | `180px` |
| `width` | `100%` | `100%` |

#### CSS

```css
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}

@media (max-width: 767px) {
  .card-image {
    height: 180px;
    object-position: center top;
  }
}
```

### RWD 變體

若卡片圖片有 desktop/mobile 變體，使用 `<picture>` 渲染：

```html
<article class="card">
  <picture>
    <source media="(max-width: 767px)" srcset="{mobile}">
    <img src="{desktop}" alt="{alt}" class="card-image">
  </picture>
  <div class="card-content">...</div>
</article>
```

---

## Hero Banner

### 定義

```yaml
# index.yml
layout:
  hero:
    image:
      id: hero_banner
      desktop: hero_banner_desktop
      mobile: hero_banner_mobile
```

### 渲染規則

繼承 [響應式圖片](#響應式圖片) 規則，額外約束：

| 屬性 | 值 |
|------|-----|
| `width` | `100%` |
| `height` | `auto` |
| `margin-top` | navbar 高度 (通常 64px) |

#### CSS

```css
.hero {
  position: relative;
  margin-top: 64px;  /* navbar 高度 */
  overflow: hidden;
}

.hero img {
  width: 100%;
  height: auto;
}
```

---

## 擴展指南

新增 UI 元件時，需定義：

1. **YAML 配置格式** - 在 `index.yml` 中如何設定
2. **渲染規則** - 輸出什麼 HTML
3. **樣式規範** - 必要的 CSS 屬性
4. **行為規範** - JavaScript 互動邏輯
5. **不變式** - 必須成立的條件

