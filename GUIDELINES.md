# 開發與維護指南 (GUIDELINES)

為了保持專案結構的一致性與資源的完整性，請遵循以下準則：

## 1. 圖片資源管理

### 目錄結構

所有頁面內容存放於 `pages/` 目錄，圖片資源存放於各頁面的 `assets/` 子目錄：

```
pages/
└── {page_name}/
    ├── index.md              # 頁面內容
    ├── index.yml             # 頁面元資料（SEO、AIO）
    └── assets/               # 圖片資源目錄
        ├── banner.jpg        # 圖片檔案
        ├── banner.jpg.yml    # 圖片描述檔
        └── ...
```

**說明**：首頁資源存放於 `pages/index/assets/`。

### 圖片引用格式

在 `index.md` 中引用圖片時，使用相對路徑：

```markdown
![](assets/banner.jpg)
```

### 新增圖片

- 圖片應放置於對應頁面的 `assets/` 目錄
- 當你新增 `.jpg` 或 `.png` 圖片時，**必須**立即建立一個同名的 `.yml` 檔案
- **不要**留下沒有描述檔的圖片孤兒

### 描述檔 (.yml) 規範
- **格式**: 標準 YAML 格式。
- **必要欄位**: `description`。
- **內容語言**: **繁體中文** (Traditional Chinese)。
- **撰寫風格**:
  - 簡潔明瞭，描述圖片的核心視覺元素與傳達的訊息。
  - 若圖片包含文字（如 Banner），請將關鍵文字包含在描述中。
  - 範例：
    ```yaml
    description: "首頁橫幅，背景為藍色科技風格，文字顯示 '智慧製造與資安整合專家'。"
    ```

## 2. 頁面 index.yml 規範

每個頁面目錄下的 `index.yml` 必須包含以下區塊：

### 2.1 SEO 區塊
```yaml
seo:
  title: "主標題 | 副標題 - 鎰威科技"  # 50-60 字元
  description: "頁面描述..."           # 150-160 字元
  keywords:
    # 品牌關鍵字
    - 產品名稱
    - 鎰威科技
    # 功能關鍵字
    - 核心功能1
    - 核心功能2
    # 長尾關鍵字
    - XX 推薦
    - XX 導入
```

### 2.2 URL Mapping 區塊
```yaml
url_mapping:
  current_url: "/security-solutions/product-name/"  # 新 URL
  old_url: "/old_path/"                              # 舊 URL
  redirect: true                                     # 是否需要 301 redirect
```

### 2.3 AIO (AI Optimization) 區塊
```yaml
aio:
  webpage:
    type: "ProductPage"  # 或 CollectionPage, AboutPage, EventPage, ServicePage
    name: "頁面名稱"
    description: "頁面簡述"
    breadcrumb:
      type: "BreadcrumbList"
      itemListElement:
        - type: "ListItem"
          position: 1
          name: "首頁"
          item: "https://www.ewill.com.tw/"
        - type: "ListItem"
          position: 2
          name: "分類名稱"
          item: "https://www.ewill.com.tw/category/"

  product:  # 或 service, event 等
    type: "Product"
    name: "產品名稱"
    brand: "品牌名稱"
    category: "產品分類"
    description: "產品描述"
    features:
      - "功能特點 1"
      - "功能特點 2"

  faq:
    - question: "常見問題 1？"
      answer: "問題 1 的回答。"
    - question: "常見問題 2？"
      answer: "問題 2 的回答。"
```

### 2.4 Content Summary 區塊
```yaml
content_summary:
  main_topic: "頁面主題"
  key_features:
    - "特點 1"
    - "特點 2"
  target_audience:
    - "目標受眾 1"
    - "目標受眾 2"
```

## 3. URL 命名慣例

### 規則
- **使用連字號 (`-`)**：不使用底線 (`_`) 或空格
- **全小寫**：避免大小寫混用
- **語義化**：使用有意義的英文單詞，而非代碼或日期
- **層級化**：依據資訊架構建立層級

### 範例
| 正確 | 錯誤 |
|------|------|
| `/security-solutions/` | `/solutions/` |
| `/palo-alto-networks/` | `/palo_alto/` |
| `/smart-manufacturing/` | `/smartmanufacturing_ai/` |
| `/events/webinar-2025/` | `/event_20251118/` |

### URL 分類結構
```
/                           # 首頁
/about/                     # 關於我們
/security-solutions/        # 資安解決方案
/security-solutions/{product}/
/infrastructure/            # 基礎架構
/infrastructure/{product}/
/smart-manufacturing/       # 智慧製造
/smart-manufacturing/{system}/
/esg/                       # ESG 永續
/events/                    # 活動
/events/{event-name}/
```

## 4. 檔案命名慣例

- **風格**: 使用小寫英文與底線 (snake_case)，避免空格或特殊符號。
- **常見後綴**:
  - `_banner`: 橫幅圖片
  - `_m` 或 `_mobile`: 手機版專用圖片
  - `_card`: 卡片式設計圖示
  - `_th`: 縮圖 (Thumbnail)

## 5. SEO Title/Description 規範

### Title 格式
```
主標題 | 副標題 - 鎰威科技
```
- 總長度控制在 50-60 字元
- 包含主要關鍵字
- 品牌名稱放最後

### Description 規範
- 長度控制在 150-160 字元
- 包含核心價值主張
- 包含行動呼籲或差異化描述
- 自然融入主要關鍵字

## 6. AIO (AI Optimization) 最佳實務

### FAQ Schema
- 每頁至少 3-4 個常見問題
- 問題要真實反映使用者搜尋意圖
- 答案要完整、有價值，適合被 AI 引用

### Content Summary
- 讓 AI 爬蟲快速理解頁面核心內容
- 列出目標受眾、主要功能、適用場景

### Breadcrumb
- 所有頁面都要有麵包屑結構
- 反映網站資訊架構層級

## 7. 維護流程

- **自動化檢查**: 建議定期執行檢查確認所有圖片皆有對應的 `.yml` 檔。
- **更新同步**: 修改圖片內容後，請務必檢視 `.yml` 中的描述是否仍準確。
- **URL 變更**: 若變更 URL，必須設定 301 redirect 並更新 `url_mapping`。

## 8. AI 協作準則

- 當 AI 代理人（Agent）協助編輯時，應主動檢查是否產生了新的圖片檔案，並自動補上描述檔。
- AI 應在每次重大變更後，協助更新 `CONTEXT.md` 以反映最新的專案狀態。
- 新增頁面時，AI 應確保 `index.yml` 包含完整的 `seo`、`url_mapping`、`aio`、`content_summary` 區塊。

## 9. 文件更新規範

- **同步更新**: 當新增、刪除或修改任何功能性檔案時，必須立即同步更新 `README.md`、`GUIDELINES.md` 及 `CONTEXT.md`，確保文件與專案實際狀態一致。

## 10. Git Commit Message 規範

本專案採用 [AngularJS Git Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)。

### 訊息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

| 部分 | 說明 | 必要性 |
|------|------|:------:|
| **type** | commit 類別 | ✓ |
| **scope** | 影響範圍 | 可選 |
| **subject** | 簡短描述（≤50 字元，不加句號） | ✓ |
| **body** | 詳細說明 Why & What | 可選 |
| **footer** | issue 編號、BREAKING CHANGE | 可選 |

### Type 類別

| Type | 說明 |
|------|------|
| `feat` | 新增/修改功能 |
| `fix` | 修補 bug |
| `docs` | 文件變更 |
| `style` | 格式調整（不影響程式碼運行） |
| `refactor` | 重構（非新功能、非修 bug） |
| `perf` | 效能優化 |
| `test` | 增加測試 |
| `chore` | 建構程序或輔助工具變動 |
| `revert` | 撤銷先前 commit |

### Scope 建議

| Scope | 說明 |
|-------|------|
| `agent` | `.agent/` 目錄相關 |
| `claude` | `.claude/` 目錄相關 |
| `pages` | 頁面內容（pages/*/index.md、index.yml） |
| `assets` | 圖片與媒體資源 |
| `seo` | SEO 優化相關 |
| `scripts` | 腳本工具 |
| `design` | 設計規範 |

### 範例

```
feat(agent): 建立 AI Agent 協作系統

新增 .agent/ 目錄，包含：
- SOP/：7 個標準作業程序
- System/：系統狀態與決策記錄
- Tasks/：功能 PRD 存放處
```

```
fix(content): 修正圖片路徑引用錯誤

問題：index.md 中的圖片路徑指向舊位置
修正：將 ![](image.png) 改為 ![](assets/image.png)

issue #42
```

### 最佳實踐

1. **獨立 commit**：每個意義不同的變更獨立 commit
2. **subject 簡潔**：使用動詞開頭（新增、修正、更新、移除）
3. **說明 Why & What**：body 中解釋變更原因與內容
4. **關聯 issue**：方便追蹤程式異動原因

> 參考：[Conventional Commits](https://www.conventionalcommits.org/)、[iT邦幫忙](https://ithelp.ithome.com.tw/articles/10228738)
