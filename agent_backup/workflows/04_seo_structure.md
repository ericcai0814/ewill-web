---
description: 將 SEO 與網址策略明確文件化，使用 MD 放主要內容、YML 放工程參數
---

# SEO 與 URL 結構化設定

## 角色定義

你是一位同時精通內容策略與技術實作的網站架構師。你能夠將 SEO 策略拆分為「人類可讀的內容規劃」與「機器可讀的技術參數」。

---

## 任務目標

將 SEO 與網址策略明確文件化，作為後續設計與開發的依據。

---

## 核心原則：MD/YML 雙檔案系統

| 檔案類型 | 內容 | 目標讀者 |
|----------|------|----------|
| `.md` 檔案 | 網頁主要內容（文案、結構、視覺說明） | PM / 設計師 / 內容編輯 |
| `.yml` 檔案 | 網頁實作需要的技術參數 | 工程師 / AI Agent |

> [!TIP]
> 檔案精簡原則：避免單一檔案過長，防止 LLM context window 限制導致幻覺。

---

## 檔案結構

```
/logsec/
├── index.md              # 頁面內容規劃（人類可讀）
├── index.yml             # 技術參數設定（機器可讀）
├── faq.md                # FAQ 內容（獨立拆分）
├── banner.jpg            # 圖片直接放同層目錄
├── banner.jpg.yml        # 圖片描述
├── dashboard.png
└── dashboard.png.yml
```

---

## MD 檔案規格（內容）

### 用途
- 給 PM / 設計師 / 內容編輯閱讀
- 描述頁面的內容結構與文案

### 格式

```markdown
# [頁面標題]

## 頁面摘要
[1-2 句說明此頁面的目的]

## 內容大綱

### 區塊 1：Hero Banner
- **標題**：[主標題文案]
- **副標題**：[副標題文案]
- **CTA**：[按鈕文字] → [連結目標]
- **視覺**：`banner.jpg`

### 區塊 2：功能介紹
- **內容**：[功能描述]
- **視覺**：`feature.png`

## 行動呼籲
[頁面的主要 CTA 設計]
```

### 約束
- 最大 300 行，超過需拆分
- 圖片參考使用檔名（如 `banner.jpg`）

---

## YML 檔案規格（技術）

### 用途
- 給工程師與 AI Agent 解析
- 包含 SEO、URL Mapping、Schema.org 設定

### 格式

```yaml
# ============================================================
# 頁面技術參數設定
# ============================================================

page:
  slug: "logsec"
  url: "/security-solutions/logsec/"
  template: "product-page"

# SEO 設定
seo:
  title: "LOGSEC 企業級日誌管理解決方案 | 鎰威科技"
  description: "LOGSEC 提供集中式日誌管理..."
  keywords:
    - 日誌管理
    - SIEM
    - Graylog
    - 資安監控

# URL 對應
url_mapping:
  current_url: "/security-solutions/logsec/"
  old_url: "/logsec/"
  redirect: true

# AIO 結構化資料
aio:
  webpage:
    type: "ProductPage"
    name: "LOGSEC 日誌管理解決方案"
    description: "企業級日誌集中管理與告警平台"
    breadcrumb:
      type: "BreadcrumbList"
      itemListElement:
        - type: "ListItem"
          position: 1
          name: "首頁"
          item: "https://www.ewill.com.tw/"
        - type: "ListItem"
          position: 2
          name: "資安解決方案"
          item: "https://www.ewill.com.tw/security-solutions/"
        - type: "ListItem"
          position: 3
          name: "LOGSEC"
          item: "https://www.ewill.com.tw/security-solutions/logsec/"

  product:
    type: "Product"
    name: "LOGSEC 日誌管理解決方案"
    brand: "鎰威科技"
    category: "資訊安全/日誌管理"
    description: "企業級日誌集中管理與即時告警平台"
    features:
      - "集中式日誌收集"
      - "即時異常告警"
      - "視覺化儀表板"

  faq:
    - question: "LOGSEC 支援哪些日誌格式？"
      answer: "LOGSEC 支援 Syslog、Windows Event、..."
    - question: "如何整合現有設備？"
      answer: "LOGSEC 提供多種 Agent 與 API..."

# 內容摘要
content_summary:
  main_topic: "企業日誌集中管理"
  target_audience:
    - "資安管理人員"
    - "IT 主管"
  key_features:
    - "日誌集中化"
    - "即時告警"
    - "合規報表"
```

### 約束
- 最大 200 行，超過需拆分
- 使用 YAML 標準格式
- 註解使用 `#`

---

## URL 命名規則

### 規則
| 項目 | 規範 |
|------|------|
| 分隔符 | 使用連字號 `-`（不使用底線 `_`） |
| 大小寫 | 全小寫 |
| 語義 | 使用有意義的英文單詞 |
| 層級 | 依資訊架構建立層級 |

### 對照表

| 目錄名稱 | URL |
|----------|-----|
| `palo_alto/` | `/security-solutions/palo-alto-networks/` |
| `logsec/` | `/security-solutions/logsec/` |
| `smartmanufacturing_ai/` | `/smart-manufacturing/` |
| `event_20251118/` | `/events/smart-manufacturing-webinar-2025/` |

---

## 參考文件

- [GUIDELINES.md](../../GUIDELINES.md) - SEO 規範（第 5 章）
- [GUIDELINES.md](../../GUIDELINES.md) - URL 命名慣例（第 3 章）
- [README.md](../../README.md) - URL 結構說明
