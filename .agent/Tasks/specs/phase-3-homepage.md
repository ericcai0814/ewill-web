# Phase 3: 首頁開發

## 目標

實作首頁，整合 `pages/index/` 內容。

## 頁面結構

```
┌─────────────────────────────────────┐
│            Header                   │
├─────────────────────────────────────┤
│                                     │
│         Hero Banner                 │
│    (desktop/mobile 切換)            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     What We Offer (服務項目)        │
│     ┌─────┐ ┌─────┐ ┌─────┐        │
│     │Card │ │Card │ │Card │        │
│     └─────┘ └─────┘ └─────┘        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     Solutions (產品解決方案)        │
│     ┌─────┐ ┌─────┐ ┌─────┐        │
│     │Card │ │Card │ │Card │ ...    │
│     └─────┘ └─────┘ └─────┘        │
│              (背景圖)               │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
│                                     │
│    Popup Banner (首訪彈窗)          │
│                                     │
```

## 資料來源

```yaml
# pages/index/index.yml
layout:
  hero:
    image:
      id: hero_banner
      desktop: hero_banner_desktop
      mobile: hero_banner_mobile
  sections:
    - type: services
      images: [...]
    - type: solutions
      images: [...]
  popup:
    image_id: popup_logsec
    trigger: first_visit
```

## 實作細節

### Hero Banner

- 使用 `<picture>` 實現 RWD
- Desktop: 1920x600
- Mobile: 750x400
- 斷點: 768px

### 服務項目卡片

- 3 欄排列（desktop）
- 1 欄排列（mobile）
- 圖片高度: desktop 200px, mobile 180px
- `object-fit: cover`

### 解決方案區塊

- 背景圖: `home-bg.png` (右下角)
- 5 張卡片
- Grid 排列

### 首訪彈窗

- `localStorage` 追蹤首訪
- 2 秒延遲顯示
- 全屏遮罩 + 置中
- ESC / 點擊遮罩關閉

## 驗收標準

- [ ] Hero Banner RWD 正確
- [ ] 卡片圖片不變形
- [ ] 彈窗首訪邏輯正確
- [ ] 頁面無水平捲軸
- [ ] Lighthouse Performance > 80

