# 重構活動訊息頁面

> **建立日期**: 2026-01-14
> **完成日期**: 2026-01-14
> **狀態**: 已完成
> **優先級**: 中

---

## 目標

將 `/event_information/` 頁面重構為參照舊官網的 card 佈局。

---

## 舊官網結構分析

從截圖分析，舊官網活動訊息頁面結構：

1. **Hero Banner** - 專業·專注·專精（與其他頁面相同）
2. **標題區塊** - "Event Information" / "活動訊息"
3. **Card 列表** - 3 欄布局
   - 每張卡片包含：
     - 圖片
     - "活動新聞" 標籤
     - 描述文字
     - "了解更多" 按鈕

---

## 現有活動頁面

| 頁面 | 標題 |
|------|------|
| event_20251021 | 智慧製造線上研討會 |
| event_20251118 | LOGSEC 資安預警方案 |
| event_20251119 | Proxmox VE on Dell |
| event_20251124 | 動信免密碼零信任 |

---

## 實作步驟

### 1. 檢查 CardListSection 元件

確認現有 `CardListSection.astro` 是否支援：
- 3 欄布局
- 卡片圖片
- 標籤文字
- 描述
- 連結按鈕

### 2. 修改 event_information/index.yml

```yaml
layout:
  hero:
    image:
      id: event_banner
      desktop: event_banner
      mobile: event_banner_mobile
      alt: 活動訊息 - 專業·專注·專精
  sections:
    - type: card_list
      label: Event Information
      title: 活動訊息
      columns: 3
      cards:
        - id: event_1
          image_id: event_info_passwordless
          title: 活動新聞
          description: 動信攜手鎰威科技推廣免密碼零信任方案...
          link: /event_20251124/
          link_text: 了解更多
        - id: event_2
          image_id: event_info_news_m
          title: 活動新聞
          description: 鎰威科技發表 LOGSEC 資安預警方案...
          link: /event_20251118/
          link_text: 了解更多
        # ... 更多卡片
```

### 3. 處理圖片資源

確認 `event_information/assets/` 中的圖片 ID 對應正確。

### 4. 建置驗證

```bash
npm run build
cd astro-app && npm run build
```

---

## 驗收標準

- [ ] Hero Banner 正確顯示
- [ ] 標題區塊有 label 和 title
- [ ] Card 列表為 3 欄布局
- [ ] 每張 Card 有圖片、標籤、描述、按鈕
- [ ] 按鈕連結到對應活動頁面
- [ ] RWD 響應式正常

---

## 相關檔案

- `pages/event_information/index.yml`
- `astro-app/src/components/CardListSection.astro`
- `pages/event_information/assets/`
