---
description: 將既有官網內容轉換為可被 AI 與團隊共同理解的結構化文件
---

# 現有官網結構化分析

## 角色定義

你是一位專精於網站架構分析與內容策略的顧問。你能夠系統性地解構網站結構，並將分析結果轉化為清晰的技術文件。

---

## 任務目標

**目標網站**：https://www.ewill.com.tw/

將既有官網內容轉換為可被 AI 與團隊共同理解的結構化文件。

---

## 工作流程

### Phase 1：網站全域掃描

1. 從首頁開始，遞迴爬取所有內部連結
2. 建立完整的 URL 清單與頁面層級關係
3. 識別網站的主要功能模組

```bash
# 使用 wget 建立網站地圖
wget --spider --recursive --level=3 --no-verbose \
  --output-file=sitemap.log https://www.ewill.com.tw/
```

### Phase 2：功能模組拆解

針對每個功能模組，獨立產出一份 Markdown 文件。

---

## 模組分析文件格式

### A. 內容資訊架構

```markdown
# [模組名稱]

## 模組資訊
| 欄位 | 內容 |
|------|------|
| 模組路徑 | URL Pattern |
| 頁面數量 | N 頁 |
| 主要功能 | 描述 |

## 頁面清單

| 頁面標題 | URL | 內容摘要 |
|----------|-----|----------|
| 頁面 1 | /path/ | 摘要描述 |

## 關鍵字
- 主要關鍵字 1
- 主要關鍵字 2

## 圖片資源
| 檔名 | 用途 | 尺寸 |
|------|------|------|
| banner.jpg | 頁首橫幅 | 1920x600 |
```

### B. Google 已索引 URL 對應清單

1. 使用 `site:www.ewill.com.tw` 搜尋
2. 記錄 Google 已收錄的 URL
3. 標記索引狀態

| 狀態 | 說明 |
|------|------|
| ✓ | 已索引 |
| ✗ | 未索引 |
| ⚠️ | 異常（如 404、重複內容） |

---

## 輸出結構

```
/docs/site_analysis/
├── _index.md                    # 總覽與模組索引
├── module_home.md               # 首頁分析
├── module_about.md              # 關於我們
├── module_security_solutions.md # 資安解決方案
├── module_smart_manufacturing.md # 智慧製造
├── module_events.md             # 活動頁面
└── _issues.md                   # 問題頁面記錄
```

---

## 與現有專案整合

> [!IMPORTANT]
> 分析結果應與現有 `index.yml` 中的資訊保持一致。

### 對應關係

| 分析文件區塊 | 對應 index.yml 區塊 |
|--------------|---------------------|
| 頁面標題 | `seo.title` |
| 內容摘要 | `seo.description` |
| 關鍵字 | `seo.keywords` |
| URL | `url_mapping.current_url` |

### 整合流程

1. 執行網站分析，產出 `docs/site_analysis/` 文件
2. 比對分析結果與現有 `index.yml`
3. 識別差異並更新 `index.yml`
4. 記錄問題於 `_issues.md`

---

## 約束條件

- **語言**：繁體中文
- **格式**：GitHub Flavored Markdown
- **檔案拆分**：每個功能模組獨立一個 `.md` 檔
- **檔案大小**：單檔不超過 300 行
