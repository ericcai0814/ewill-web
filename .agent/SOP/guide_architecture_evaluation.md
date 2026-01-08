# 內容架構評估建議書：「.md + .yml 分離」結構適用性分析

> **版本**: 1.0  
> **建立日期**: 2026-01-06  
> **適用情境**: 新專案需求評估階段  
> **使用方式**: 將本建議書與客戶需求訪談結果交由 AI 進行適用性判斷

---

## 一、架構概述

### 1.1 什麼是「.md + .yml 分離」結構？

將網站內容與元資料分離儲存的架構模式：

| 檔案類型 | 用途 | 範例 |
|----------|------|------|
| `index.md` | 頁面內容（Markdown 格式） | 文案、圖片引用、排版 |
| `index.yml` | 頁面元資料（YAML 格式） | SEO、Schema.org、URL mapping |
| `image.jpg.yml` | 圖片描述檔 | alt 描述、用途說明 |

### 1.2 架構優勢

- **AI Agent 協作友善**：AI 可獨立更新 metadata，降低誤改內容風險
- **關注點分離**：內容編輯與 SEO 配置可獨立作業
- **版本控制清晰**：內容變更與配置變更獨立追蹤
- **複雜結構支援**：適合 50+ 行的 Schema.org 結構化資料

### 1.3 架構劣勢

- 檔案數量較多
- 不符合常見 SSG 框架（Hugo、Astro）的 frontmatter 慣例
- 需要自訂建置流程

---

## 二、適用性評估條件

> **AI 判斷指引**：根據以下條件計算適用性分數，總分 100 分。

### 2.1 評估條件與權重

| 條件編號 | 評估條件 | 權重 | 判斷方式 |
|:--------:|----------|:----:|----------|
| C01 | 需要複雜的 Schema.org 結構化資料 | 20 | 是=20, 部分=10, 否=0 |
| C02 | 需要 AI/自動化更新 metadata | 20 | 是=20, 計畫中=10, 否=0 |
| C03 | 需要 URL redirect 管理 | 10 | 是=10, 否=0 |
| C04 | 多語系（i18n）需求 | 10 | 是=10, 否=0 |
| C05 | SEO 配置複雜度高（關鍵字策略、AIO） | 15 | 高=15, 中=8, 低=0 |
| C06 | 內容與 SEO 由不同角色維護 | 10 | 是=10, 否=0 |
| C07 | 預計使用 SSG 框架（Hugo/Astro/VitePress） | -15 | 是=-15, 否=0 |
| C08 | 網站頁面數量 | 10 | >50頁=10, 20-50頁=5, <20頁=0 |
| C09 | 圖片資源需要統一管理描述 | 10 | 是=10, 否=0 |
| C10 | 專案有 AI Agent 協作規劃 | 10 | 是=10, 否=0 |

### 2.2 適用性判斷標準

| 總分範圍 | 建議結果 | 說明 |
|:--------:|----------|------|
| 70-100 | ✅ **強烈建議採用** | 專案特性高度符合此架構優勢 |
| 50-69 | ⚠️ **可考慮採用** | 需評估團隊熟悉度與建置成本 |
| 30-49 | △ **視情況決定** | 可採用簡化版或 frontmatter 替代 |
| 0-29 | ❌ **不建議採用** | 建議使用標準 frontmatter 架構 |

---

## 三、客戶需求訪談收集清單

> **使用說明**：業務/PM 在需求訪談時，請收集以下資訊，填入後交由 AI 進行評估。

### 3.1 專案基本資訊

```yaml
project_info:
  project_name: ""           # 專案名稱
  client_name: ""            # 客戶名稱
  project_type: ""           # 專案類型：企業官網 / 產品站 / 電商 / 部落格 / 文檔站 / 活動站 / 其他
  estimated_pages: 0         # 預估頁面數量
  launch_date: ""            # 預計上線日期
  budget_level: ""           # 預算等級：高 / 中 / 低
```

### 3.2 技術需求

```yaml
technical_requirements:
  # SSG 框架
  ssg_framework:
    required: false          # 是否必須使用 SSG 框架
    preferred: ""            # 偏好框架：Hugo / Astro / VitePress / Next.js / 無偏好 / 自訂

  # 多語系
  i18n:
    required: false          # 是否需要多語系
    languages: []            # 語系列表，如 ["zh-TW", "en", "ja"]

  # CMS 整合
  cms_integration:
    required: false          # 是否需要 CMS
    preferred: ""            # 偏好 CMS：Contentful / Strapi / Sanity / 無 / 其他
```

### 3.3 SEO 與 AIO 需求

```yaml
seo_requirements:
  # SEO 複雜度
  complexity: ""             # 高 / 中 / 低
                             # 高：完整關鍵字策略、競品分析、定期優化
                             # 中：基本 Title/Description 優化
                             # 低：不重視 SEO

  # Schema.org 結構化資料
  schema_org:
    required: false          # 是否需要 Schema.org
    types: []                # 需要的類型：Product / Organization / FAQ / Event / Article / BreadcrumbList

  # AIO (AI Optimization)
  aio_required: false        # 是否需要 AI 搜尋優化（Google AI Overview）

  # URL 管理
  url_management:
    has_old_site: false      # 是否有舊網站需要 redirect
    redirect_required: false # 是否需要 URL redirect 管理
```

### 3.4 內容管理需求

```yaml
content_management:
  # 維護角色
  maintainers:
    content_editor: false    # 是否有專職內容編輯
    seo_specialist: false    # 是否有專職 SEO 人員
    separate_roles: false    # 內容與 SEO 是否由不同人維護

  # 更新頻率
  update_frequency: ""       # 高（每週）/ 中（每月）/ 低（每季或更少）

  # 圖片管理
  image_management:
    volume: ""               # 圖片數量：大（100+）/ 中（30-100）/ 小（<30）
    alt_text_required: false # 是否需要統一管理圖片 alt 描述
    reuse_across_pages: false # 圖片是否會跨頁面重複使用
```

### 3.5 AI/自動化需求

```yaml
automation_requirements:
  # AI Agent 協作
  ai_agent:
    planned: false           # 是否計畫使用 AI Agent 協作
    use_cases: []            # 用途：SEO優化 / 內容生成 / FAQ生成 / 圖片描述 / 其他

  # 自動化腳本
  automation_scripts:
    required: false          # 是否需要自動化腳本處理內容
    types: []                # 類型：批次SEO更新 / 圖片處理 / 內容驗證 / 其他
```

### 3.6 團隊能力評估

```yaml
team_capability:
  # 技術熟悉度
  familiarity:
    markdown: ""             # Markdown 熟悉度：高 / 中 / 低
    yaml: ""                 # YAML 熟悉度：高 / 中 / 低
    git: ""                  # Git 版本控制熟悉度：高 / 中 / 低

  # 自訂建置能力
  custom_build:
    capable: false           # 是否有能力自訂建置流程
    resources: ""            # 資源配置：充足 / 有限 / 無
```

---

## 四、AI 評估指令模板

> **使用方式**：將以下指令與填寫完成的需求訪談資料一起提供給 AI。

```
請根據以下資訊，評估此專案是否適合採用「.md + .yml 分離」架構：

1. 參考建議書：[內容架構評估建議書]
2. 客戶需求訪談結果：[貼上填寫完成的 YAML]

請執行以下評估：
1. 逐一檢視評估條件 C01-C10，給出各項分數與理由
2. 計算總分
3. 根據適用性判斷標準給出建議結果
4. 如果建議採用，說明實施重點
5. 如果不建議採用，推薦替代方案
```

---

## 五、決策流程圖

```
                    ┌─────────────────┐
                    │  收到新專案需求  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ PM/業務填寫訪談 │
                    │    收集清單     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  AI 自動評估    │
                    │  (本建議書+需求) │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │  總分 ≥70   │   │ 總分 50-69  │   │  總分 <50   │
    │ 強烈建議採用 │   │  可考慮採用  │   │  不建議採用  │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │ 啟動專案    │   │ 團隊討論    │   │ 採用標準    │
    │ 套用此架構  │   │ 評估成本    │   │ Frontmatter │
    └─────────────┘   └─────────────┘   └─────────────┘
```

---

## 六、適用網站類型速查表

| 網站類型 | 預設適用性 | 關鍵判斷因素 |
|----------|:----------:|--------------|
| 企業官網 / B2B 產品站 | ✅ 高 | 複雜 SEO + Schema.org |
| AI/自動化內容管理系統 | ✅ 高 | AI Agent 協作需求 |
| 多語系商業網站 | ✅ 高 | i18n + SEO 分離維護 |
| 行銷活動 / Campaign 站 | ⚠️ 中高 | URL redirect + Event Schema |
| 技術文檔站 | △ 中 | 視 SEO 需求決定 |
| 電商網站 | △ 中 | 視 Product Schema 複雜度 |
| 個人部落格 | ❌ 低 | 過度設計 |
| 簡單靜態頁面 | ❌ 低 | 不需要 |

---

## 七、版本歷史

| 版本 | 日期 | 變更說明 |
|------|------|----------|
| 1.0 | 2026-01-06 | 初版建立 |

---

## 八、相關文件

- [GUIDELINES.md](../../GUIDELINES.md) - 開發與維護指南
- [CONTEXT.md](../../CONTEXT.md) - 專案狀態互文
- [.agent/README.md](../README.md) - AI Agent 文件索引

