# 變更日誌 (Changelog)

本文件為專案變更記錄的**單一來源**，採用時間倒序排列。

> 💡 此檔案由 AI Agent 協助維護，人類可讀摘要請見 [CONTEXT.md](../../CONTEXT.md)

---

## [2026-01-09]

### Header 導覽列模組建立

爬取官網 https://www.ewill.com.tw/ 的 Header 結構，建立共用元件文件：

**新增檔案**：
- `pages/header/header.md`：模組說明文件（版面配置、視覺規範、互動行為）
- `pages/header/header.yml`：結構化資料（完整導覽選單樹狀結構含三層子選單）
- `pages/header/assets/README.md`：資源清單（Logo、圖示需求）

**爬取內容**：
| 項目 | 內容 |
|------|------|
| 主選單項目 | 8 項 |
| 子選單層級 | 最深 3 層 |
| 產品連結 | 25+ 個 |
| 視覺樣式 | 透明背景、青藍色文字 (#3F8696) |
| 互動行為 | Hover 展開子選單、非 Sticky |

---

### SOP 一致性檢查與修正

執行 `/check_sop` 檢查，修正以下一致性問題：

**05_agent_refactor.md**：
- 將目錄結構圖中的 Title Case（`Tasks/`、`System/`、`SOP/`）改為小寫（`tasks/`、`system/`、`sop/`），與實際目錄結構一致
- 更新目錄職責表格中的路徑引用
- 更新自動化 Prompt 範例中的路徑引用

**.agent/README.md**：
- 更新 tasks/ 區塊，補充 `specs/` 子目錄與 `website-validation-react-src.md` 文件索引
- 新增 `tasks/specs/` 子目錄的文件清單（Phase 1-5、design-system、content-guide、testing-plan）

---

## [2026-01-06]

### 網站視覺優化（截圖分析）

根據 `design/screenshots/` 官網截圖全面優化網站樣式：

**截圖來源**：
- `design/screenshots/index/` - 首頁截圖（桌面版、手機版）
- `design/screenshots/about/` - 關於我們截圖
- `design/screenshots/event-information/` - 活動訊息截圖

**從截圖發現的關鍵設計規範**：
| 元素 | 原本假設 | 實際設計（已修正） |
|------|----------|-------------------|
| Section Label | 深灰色 | **Teal 色斜體** |
| Section Title | 深灰色 | **Teal 色置中** |
| Footer | 4 欄 | **7 欄式多欄佈局** |
| 卡片 | 簡單卡片 | **圖片+標題+描述+按鈕** |

**更新檔案**：
- `website/src/index.css`：
  - Section Label/Title 改為 Teal 色
  - 新增 `.card-service`、`.card-event` 卡片樣式
  - 新增 `.card-grid` 網格佈局
  - Footer 樣式優化（緊湊、7 欄）
- `website/src/components/Layout.tsx`：Footer 改為 7 欄式佈局
- `DESIGN_GUIDELINE.md`：新增截圖目錄與設計規範表格

---

### Website 視覺優化（Design Guideline 套用）

根據 `DESIGN_GUIDELINE.md` 全面優化 `website/` 驗證網站，使其與原網站 (ewill.com.tw) 視覺一致：

**CSS 更新 (`src/index.css`)**：
- 套用完整 Design Guideline CSS 變數（Teal 主色系、漸層、間距）
- 新增按鈕樣式（btn-primary、btn-secondary）
- 新增卡片樣式（card、faq-item）
- 優化 Prose/Markdown 樣式（標題、連結、圖片）
- 新增動效（fadeInUp、loading-spinner）

**元件更新**：
- `Navbar.tsx`：白色毛玻璃背景、Teal 品牌色、下拉選單、響應式手機選單
- `Layout.tsx`：深色漸層 Footer、四欄式佈局、品牌標語
- `ContentPage.tsx`：Hero Banner、Breadcrumb、FAQ 手風琴、Content Summary 區塊
- `SEOHead.tsx`：美化 SEO 驗證面板、可摺疊功能

**字型整合**：
- Poppins（英文標題、小標籤）
- Noto Sans TC（中文內容）

**視覺特色**：
- 主色調：Teal (#2D9B9B)
- 圓角：12px（卡片）/ 24px（按鈕）
- 陰影：淺灰色柔和陰影
- 漸層：Teal-600 → Teal-500 → Teal-300

---

### 建立 Design Guideline（視覺設計規範）

新增 `DESIGN_GUIDELINE.md`，作為 AI Agent 生成 UI 元件與頁面設計的視覺規範參考：

**文件結構**：
1. 品牌識別 - 核心價值、視覺風格、品牌圖形
2. 色彩系統 - 主色調、漸層、輔助色、中性色、語意色
3. 字型系統 - 字型家族、大小比例、字重、特殊樣式
4. 間距系統 - 基準單位、間距比例、常用應用
5. 元件樣式 - 按鈕、卡片、圖示、表單元件
6. 版面結構 - 網格系統、頁面結構、導覽列、頁尾
7. 圖片風格 - Banner、卡片插圖、圖示插圖風格
8. 動效規範 - 過渡時間、緩動函數、常用動效
9. AI 生成指引 - Prompt 範本、風格關鍵字、Don'ts
10. 設計資源 - 圖片資源位置、推薦工具

**主要設計 Token**：
- 主色調：Teal (#2D9B9B) 系列漸層
- 字型：Poppins (英文) / Noto Sans TC (中文)
- 間距基準：4px
- 圓角：12px (卡片) / 24px (按鈕)
- 品牌圖形：3D 莫比烏斯環帶

**更新檔案**：
- `README.md`：加入 DESIGN_GUIDELINE.md 連結
- `CONTEXT.md`：加入設計規範狀態說明

---

### 首頁內容同步更新（網站爬取）

重新爬取 https://www.ewill.com.tw/ 首頁，更新 `index/` 目錄內容：

**index.md 更新**：
- 移除文字中的冗餘描述（如「智慧管理 我們提供...」改為「提供...」）
- 新增圖片 alt 文字描述
- 新增各區塊「了解更多」連結（對應網站實際連結）
- 優化圖文資料流順序，與網站一致

**圖片 yml 描述檔更新**：
- `whatweoffer_card_1.png.yml`：描述更正為「軟體開發服務」
- `whatweoffer_card_2.png.yml`：描述更正為「資訊安全服務」
- `whatweoffer_card_3.png.yml`：描述更正為「系統規劃服務」
- `solutions_card_1.png.yml`：描述更正為「智慧管理解決方案」
- `solutions_card_2.png.yml`：描述更正為「資安評估解決方案」
- `首頁Banner1209.png.yml` / `BN-Home-M.jpg.yml`：強化標語描述

**index.yml 更新**：
- 新增 FAQ：「鎰威科技有哪些產品解決方案？」
- 更新現有 FAQ 答案，增加具體產品工具名稱
- 新增 `core_values`：專業、效率、信任、創新
- 新增 `solution_categories`：五大解決方案分類與連結
- 更新 `service_categories`：與網站連結結構一致

---

### React CSR 驗證網站建立

建立 React + Vite 靜態網站，用於驗證 Doc System 資源正確性：

**專案結構**：
```
website/
├── src/
│   ├── components/        # Layout, Navbar, SEOHead
│   ├── pages/             # ContentPage
│   ├── utils/             # contentLoader, parseYaml
│   └── types/             # TypeScript 型別定義
├── scripts/
│   └── sync-content.js    # 同步 Doc System 內容
└── public/                # 同步的內容檔案
```

**功能**：
- 讀取各模組 `index.md` 渲染為頁面
- 讀取 `index.yml` 套用 SEO meta
- 自動生成 Schema.org JSON-LD
- 開發模式顯示 SEO 驗證面板
- 支援 20 個模組的路由

**啟動方式**：
```bash
cd website && npm run dev
# 訪問 http://localhost:5173/
```

### 建立 Claude Skills（自動觸發機制）

根據 [Claude Skills 官方文檔](https://code.claude.com/docs/en/skills) 建立 3 個 Skills：

| Skill | 說明 | 觸發時機 |
|-------|------|----------|
| `doc-sync` | 文件同步規則 | 修改 GUIDELINES、SOP、Commands |
| `image-management` | 圖片管理規則 | 處理圖片、新增圖片 |
| `sop-consistency` | SOP 一致性檢查 | 結構變更、目錄重構 |

**Skills vs Commands 區別**：
- Skills：Claude 根據請求內容**自動判斷**是否套用
- Commands：需明確輸入 `/command` 來執行

**更新**：
- `.claude/commands/README.md`：加入 Skills 說明與模板

### 維護腳本重構

- **建立 `scripts/` 目錄**：集中存放維護腳本
- **更新 `find_undescribed.py`**：
  - 移至 `scripts/` 目錄
  - 移除硬編碼路徑，改為動態獲取
  - 支援命令列參數指定掃描目錄
  - 新增分組統計報告輸出
  - 新增 CI/CD 相容的返回狀態碼
- **更新相關引用**：
  - `README.md`：腳本使用說明
  - `02b_image_metadata.md`：掃描指令
  - `05_agent_refactor.md`：每日檢查指令
  - `daily_check.md`：command 指令

### 首頁資源重構至 index/ 目錄

- **建立 `index/` 目錄**：首頁內容與圖片移至專屬目錄
- **移動檔案**：
  - `index.md`、`index.yml` → `index/`
  - 11 張首頁圖片 + 11 個 yml → `index/assets/`
- **更新圖片引用**：`index.md` 中的路徑從 `![](image.png)` 改為 `![](assets/image.png)`
- **移除例外規則**：
  - `GUIDELINES.md`：移除「根目錄圖片例外」
  - `learnings.md`：更新首頁圖片存放說明
  - `CONTEXT.md`：更新圖片結構描述

重構後首頁結構：
```
index/
├── index.md
├── index.yml
└── assets/
    ├── 首頁Banner1209.png
    ├── 首頁Banner1209.png.yml
    └── ...（共 11 張圖片 + 11 個 yml）
```

### 建立 CLAUDE.md 自動觸發機制

- 新增 `.claude/CLAUDE.md` - AI 協作行為準則
  - 定義文件修改時的自動檢查規則
  - 定義操作後的必要更新清單
  - 提供完成任務前的檢查清單
- 讓 AI 在每次協作時自動遵循文件同步規則
- 存放於 `.claude/` 目錄，與 commands 集中管理

### Doc System 優化與變更影響檢查機制

- **修復過時內容**：
  - `learnings.md`：圖片路徑格式從「同層目錄」更正為「assets/ 子目錄」
  - `decisions.md`：修正 `guide_architecture_evaluation.md` 路徑

- **補充更新觸發條件**（`00_project_init.md`）：
  - 新增 `changelog.md` 更新觸發條件
  - 新增 `learnings.md` 更新觸發條件
  - 新增 `decisions.md` 更新觸發條件

- **建立變更影響檢查機制**（`05_agent_refactor.md`）：
  - 新增「變更影響檢查清單」章節
  - 定義各類變更的影響範圍
  - 提供檢查流程圖

- **擴充 `/check_sop` command**：
  - 加入 System 文件檢查
  - 加入根目錄文件同步檢查

- **更新根目錄文件**：
  - `README.md`：加入 `.claude/commands/` 目錄說明
  - `CONTEXT.md`：加入 Claude Commands 速查表

### Claude Commands 批次建立

新增 7 個 Claude Commands，將 SOP 流程轉換為可直接呼叫的指令：

| Command | 用途 | 對應 SOP |
| ------- | ---- | -------- |
| `/update_doc` | 更新 .agent 文件 | - |
| `/check_sop` | SOP 一致性檢查 | 05_agent_refactor.md |
| `/daily_check` | 每日檢查 | 05_agent_refactor.md |
| `/seo_audit` | SEO 稽核 | 05_agent_refactor.md |
| `/gen_image_meta` | 圖片描述檔生成 | 02b_image_metadata.md |
| `/eval_architecture` | 架構評估 | guide_architecture_evaluation.md |
| `/new_page` | 建立新頁面 | 多個 SOP 組合 |

### SOP 維護機制建立

- **新增「每月 SOP 一致性檢查」**：在 `05_agent_refactor.md` 加入自動化檢查流程

  - 檢查圖片路徑格式
  - 檢查目錄結構說明
  - 檢查範例程式碼中的路徑
  - 提供自動化 Prompt 模板

- **SOP 命名規範調整**：區分「工作流程 SOP」與「參考指南」
  - 工作流程 SOP：`0X_name.md`（有執行順序）
  - 參考指南：`guide_name.md`（獨立參考）
  - 重新命名：`architecture_evaluation.md` → `guide_architecture_evaluation.md`

### SOP 批次更新

更新 5 個 SOP 以符合新的 `assets/` 圖片結構與 `.agent/` 目錄結構：

| SOP                     | 更新內容                                   |
| ----------------------- | ------------------------------------------ |
| `02_image_download.md`  | 下載目標目錄改為 `{module}/assets/`        |
| `02b_image_metadata.md` | 範例路徑、約束條件更新                     |
| `03_content_flow.md`    | 圖片路徑、Python 腳本更新                  |
| `04_seo_structure.md`   | 檔案結構說明更新                           |
| `05_agent_refactor.md`  | `.agent/` 結構說明重寫（Tasks/System/SOP） |

主要變更：

- 所有「圖片放同層目錄」說明改為「圖片放 `assets/` 子目錄」
- 範例路徑從 `logsec/banner.jpg` 改為 `logsec/assets/banner.jpg`
- `.agent/` 結構從 `memory/workflows/prompts` 改為 `Tasks/System/SOP`

### .agent/ 目錄結構重構

將 `.agent/` 目錄重構為標準化格式（Tasks/System/SOP）：

| 舊結構       | 新結構      | 說明                |
| ------------ | ----------- | ------------------- |
| `memory/`    | `System/`   | 系統狀態與決策記錄  |
| `prompts/`   | `System/`   | AI 系統提示詞       |
| `workflows/` | `SOP/`      | 標準作業程序        |
| `guides/`    | `SOP/`      | 評估指南            |
| _(新建)_     | `Tasks/`    | 功能 PRD 與實作計畫 |
| _(新建)_     | `README.md` | .agent 文件索引     |

最終結構：

```
.agent/
├── README.md          # 文件索引
├── Tasks/             # 功能 PRD
├── System/            # 系統狀態
│   ├── system_prompt.md
│   ├── changelog.md
│   ├── decisions.md
│   └── learnings.md
└── SOP/               # 標準作業程序
    ├── 00_project_init.md
    ├── ...
    └── architecture_evaluation.md
```

### 新增

- 新增 `architecture_evaluation.md` - 內容架構評估建議書
  - 10 項評估條件與權重計分系統
  - 客戶需求訪談收集清單（YAML 格式）
  - AI 評估指令模板
  - 適用網站類型速查表

### 變更

- 精簡 `CONTEXT.md`，移除與 changelog 重複的變更記錄
- 更新根目錄 `README.md` 的 .agent 結構說明
- 更新所有檔案中的相對路徑引用

### 圖片資源重構

- **建立 19 個 `assets/` 子目錄**：各模組圖片移至專屬 assets 目錄
- **移動 220 張圖片**（+ 220 個 yml 描述檔）至對應的 `assets/` 目錄
- **更新 19 個 `index.md`**：圖片引用路徑從 `![](image.png)` 改為 `![](assets/image.png)`
- **根目錄圖片保持原位**：11 張首頁圖片不移動
- **更新 `GUIDELINES.md`**：新增 assets 目錄結構規範

重構後結構：

```
module_name/
├── index.md
├── index.yml
└── assets/
    ├── *.jpg / *.png
    └── *.jpg.yml / *.png.yml
```

---

## [2026-01-05]

### 新增

- 建立 `.agent/` 目錄結構
  - `memory/`：決策記錄、變更日誌、學習發現
  - `prompts/`：AI 系統提示詞
  - `workflows/`：7 個標準工作流程
- 新增工作流程文件：
  | 檔案 | 用途 |
  |------|------|
  | `00_project_init.md` | 專案文件初始化與維護 |
  | `01_site_analysis.md` | 網站結構化分析 |
  | `02_image_download.md` | 圖片下載腳本生成 |
  | `02b_image_metadata.md` | 圖片描述檔生成 |
  | `03_content_flow.md` | 圖文按資料流排序 |
  | `04_seo_structure.md` | SEO 與 URL 結構化 |
  | `05_agent_refactor.md` | AI Agent 自動重構 |

### 變更

- 更新 `README.md` 加入 `.agent/` 說明
- 更新 `CONTEXT.md` 記錄 AI 協作系統建立

---

## [2026-01-02]

### 新增

- SEO/AIO 優化完成
  - 每頁新增 `seo` 區塊（Title、Description、Keywords）
  - 每頁新增 `aio` 區塊（Schema.org 結構化資料）
  - 每頁新增 `url_mapping` 區塊（新舊 URL 對應）
  - 每頁新增 `content_summary` 區塊（AI 爬蟲摘要）
- 231 張圖片 `.yml` 描述檔（100% 覆蓋）
  - `acunetix/`（7 個）
  - `array/`（15 個）
  - `esg/`（4 個）
  - 根目錄（4 個）

### 變更

- URL 結構重構為層級化
  - 資安產品：`/security-solutions/{product}/`
  - 智慧製造：`/smart-manufacturing/{system}/`
  - 基礎架構：`/infrastructure/{product}/`
  - 活動頁面：`/events/{event-name}/`
- 底線命名改為連字號（符合 SEO 最佳實務）

---

## [歷史變更]

### 初始建立

- 建立專案基礎結構
- 建立 `README.md`、`GUIDELINES.md`、`CONTEXT.md`
- 全面生成圖片描述檔
