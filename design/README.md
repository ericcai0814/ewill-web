# 設計參考資料 (Design Reference)

本目錄存放官方網站的設計參考截圖，供 AI Agent 分析與還原視覺設計。

## 目錄結構

```
design/
├── README.md              # 本文件
└── screenshots/           # 網站截圖
    ├── index/             # 首頁
    │   ├── screencapture-ewill-tw-desktop.png
    │   └── screencapture-ewill-tw-index-mobile.png
    ├── about/             # 關於我們
    │   ├── screencapture-ewill-tw-about-desktop.png
    │   └── screencapture-ewill-tw-about-mobile.png
    └── event-information/ # 活動訊息
        ├── screencapture-ewill-tw-event-information-desktop.png
        └── screencapture-ewill-tw-event-information-mobile.png
```

## 截圖來源

- **網站**: https://www.ewill.com.tw/
- **擷取日期**: 2026-01-06
- **用途**: 視覺設計分析、Design Guideline 驗證

## 從截圖提取的設計規範

### 視覺特徵摘要

| 元素 | 規範 |
|------|------|
| **Section Label** | 斜體英文（如 "About Us"）、Teal 色、置中 |
| **Section Title** | 中文粗體（如 "關於我們"）、Teal 色、置中 |
| **卡片** | 白底 → 圖片/圖示 → 標題 → 描述 → 按鈕 |
| **按鈕** | 圓角膠囊、Teal 漸層、白色文字 "了解更多" |
| **Navbar** | 白底、固定、Logo 左側、選單右側 |
| **Footer** | 深 Teal 漸層、7 欄式、Logo 左上 |
| **Hero Banner** | Teal 漸層背景、3D Möbius 圖形右側 |

### 頁面結構 (Desktop)

```
┌─────────────────────────────────────────────────┐
│  Logo          Navigation Menu                  │  Navbar (白底, 固定)
├─────────────────────────────────────────────────┤
│                                                 │
│  PRPFESSION                    [3D Möbius]      │  Hero Banner
│  FOCUS                                          │  (Teal 漸層背景)
│  SPECIALIZATION                                 │
│  專業 · 專注 · 專精                              │
│                                                 │
├─────────────────────────────────────────────────┤
│            About Us (斜體, Teal)                 │
│            關於我們 (粗體, Teal)                 │  Section
│            [描述文字]                            │
├─────────────────────────────────────────────────┤
│   ┌─────┐  ┌─────┐  ┌─────┐                    │  3 欄卡片
│   │Card │  │Card │  │Card │                    │
│   └─────┘  └─────┘  └─────┘                    │
├─────────────────────────────────────────────────┤
│  Footer (深 Teal 漸層背景, 7欄)                  │
│  Logo | 活動訊息 | 關於鎰威 | 服務項目 | ...      │
│  版權聲明                                        │
└─────────────────────────────────────────────────┘
```

## 待補充截圖

- [ ] 產品內頁（如 Palo Alto、Fortinet）
- [ ] Navbar 展開狀態（下拉選單）
- [ ] 按鈕 Hover 狀態
- [ ] 智慧製造頁面

## 相關文件

- [DESIGN_GUIDELINE.md](../DESIGN_GUIDELINE.md) - 完整設計規範
- [website/](../website/) - 驗證網站實作

