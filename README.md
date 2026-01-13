# EWILL Legacy Assets

## 專案簡介

本專案為 Ewill 鎰威科技官方網站的網站內容與圖片資源管理庫。包含網站各區塊（解決方案、產品介紹、活動資訊等）的圖片素材、頁面 metadata 及 SEO/AIO 配置。

---

## 快速開始

### 人類開發者

```
README.md (你在這裡) → CONTEXT.md (當前狀態) → GUIDELINES.md (開發規範)
```

### AI Agent

```
.claude/CLAUDE.md (行為準則) → .agent/system/system_prompt.md (身份職責) → 對應 SOP
```

### 常用指令速查

| 指令 | 用途 | 使用時機 |
|------|------|----------|
| `/check_assets` | 檢查圖片描述檔完整性 | 每日、新增圖片後 |
| `/check_docs` | 文件一致性檢查 | 每月、結構變更後 |
| `/seo_audit` | SEO 稽核 | 每週 |
| `/gen_image_meta` | 生成圖片描述檔 | 新增圖片後 |

---

## 目錄結構

```
ewill-web/
├── pages/                       # 📄 網站頁面內容（SEO 資料源）
│   ├── index/                   # 首頁 → /
│   │   ├── index.md             # 頁面內容
│   │   ├── index.yml            # SEO/AIO 配置
│   │   └── assets/              # 圖片資源
│   ├── about_us/                # 關於我們 → /about/
│   ├── solutions/               # 資安服務總覽 → /security-solutions/
│   │
│   ├── # 資安產品 (Security Solutions)
│   ├── palo_alto/               # → /security-solutions/palo-alto-networks/
│   ├── fortinet/                # → /security-solutions/fortinet/
│   ├── acunetix/                # → /security-solutions/acunetix/
│   ├── security_scorecard/      # → /security-solutions/security-scorecard/
│   ├── vicarius_vrx/            # → /security-solutions/vicarius-vrx/
│   ├── array/                   # → /security-solutions/array-networks/
│   ├── logsec/                  # → /security-solutions/logsec/
│   ├── ist/                     # → /security-solutions/endpoint-security/
│   │
│   ├── # 基礎架構 (Infrastructure)
│   ├── vmware/                  # → /infrastructure/vmware/
│   │
│   ├── # 智慧製造 (Smart Manufacturing)
│   ├── smartmanufacturing_ai/   # → /smart-manufacturing/
│   ├── mes/                     # → /smart-manufacturing/mes/
│   ├── wms/                     # → /smart-manufacturing/wms/
│   ├── scm/                     # → /smart-manufacturing/scm/
│   ├── data_middleware/         # → /smart-manufacturing/data-platform/
│   │
│   ├── # 其他
│   ├── esg/                     # → /esg/
│   ├── event_20251118/          # → /events/smart-manufacturing-webinar-2025/
│   └── event_20251124/          # → /events/passwordless-identity-protection/
│
├── .agent/                      # 🤖 AI Agent 協作系統
│   ├── README.md                # 文件索引
│   ├── tasks/                   # 功能 PRD
│   ├── system/                  # 系統狀態、決策記錄
│   ├── sop/                     # 標準作業程序
│   ├── scripts/                 # 維護腳本
│   └── run-logs/                # 執行日誌
│
├── .claude/                     # 🔮 Claude 配置
│   ├── CLAUDE.md                # AI 協作行為準則
│   ├── commands/                # AI 指令
│   └── skills/                  # AI 技能
│       └── content-build/       # 內容建置流水線
│
├── # 建置輸出（已 gitignore）
├── static-app/                  # 靜態輸出
├── next-app/                    # Next.js 專案 public/
└── nuxt-app/                    # Nuxt 專案 public/
│
├── README.md                    # 本文件
├── GUIDELINES.md                # 開發維護指南
├── DESIGN_GUIDELINE.md          # 視覺設計規範
└── CONTEXT.md                   # 專案狀態
```

## 頁面目錄結構

每個頁面目錄採用統一結構：

```
pages/{page_name}/
├── index.md              # 頁面內容（Markdown）
├── index.yml             # 頁面元資料（SEO、AIO）
└── assets/               # 圖片資源目錄
    ├── banner.jpg        # 圖片檔案
    ├── banner.jpg.yml    # 圖片描述檔
    └── ...
```

### 頁面配置 (index.yml)

每個頁面的 `index.yml` 包含：

| 區塊              | 說明                                     |
| ----------------- | ---------------------------------------- |
| `seo`             | Title、Description、Keywords             |
| `url_mapping`     | 新舊 URL 對應與 redirect 設定            |
| `aio`             | AI Optimization 結構化資料（Schema.org） |
| `content_summary` | 內容摘要，供 AI 爬蟲理解                 |

### 圖片資源

- 專案中包含 231 張 `.jpg` 與 `.png` 圖片
- 各頁面圖片存放於 `pages/{page}/assets/` 目錄
- 每張圖片都對應一個 `.yml` 描述檔（如 `banner.jpg.yml`）

## Content Build（內容建置）

使用 `.claude/skills/content-build/` 將內容轉換為網站資源：

```bash
# 自動偵測輸出目標
npx tsx .claude/skills/content-build/scripts/build.ts

# 明確指定目標
npx tsx .claude/skills/content-build/scripts/build.ts --target=static  # → static-app/
npx tsx .claude/skills/content-build/scripts/build.ts --target=next    # → next-app/public/
npx tsx .claude/skills/content-build/scripts/build.ts --target=nuxt    # → nuxt-app/public/
npx tsx .claude/skills/content-build/scripts/build.ts --target=astro   # → astro-app/public/
```

建置流程：

1. **normalize-assets** - 正規化圖片檔名，產出 `asset-manifest.json`
2. **audit-content** - 檢查 Markdown 是否違規引用原始檔名
3. **build-content** - 解析 `index.yml`，產出頁面 JSON

## 維護腳本

位於 `.agent/scripts/` 目錄：

| 腳本                        | 用途                                     |
| --------------------------- | ---------------------------------------- |
| `find_undescribed.py`       | 掃描目錄，找出缺少 `.yml` 描述檔的圖片   |
| `fix-yml-metadata.py`       | 批次補齊 `.yml` 的 `id` 和 `alt` 欄位    |
| `migrate-image-refs.py`     | 遷移圖片引用從 `index.md` 至 `index.yml` |
| `analyze_website_design.py` | 分析網站設計結構與元素                   |

```bash
# 檢查缺少描述檔的圖片
python3 .agent/scripts/find_undescribed.py pages/

# 補齊 .yml 欄位
python3 .agent/scripts/fix-yml-metadata.py

# 遷移圖片引用
python3 .agent/scripts/migrate-image-refs.py

# 分析網站設計
python3 .agent/scripts/analyze_website_design.py
```

## URL 結構

本專案採用 SEO 友善的層級化 URL 結構：

```
/                                    # 首頁
/about/                              # 關於我們
/security-solutions/                 # 資安解決方案總覽
/security-solutions/{product}/       # 各資安產品頁
/infrastructure/                     # 基礎架構
/infrastructure/{product}/           # 各基礎架構產品
/smart-manufacturing/                # 智慧製造總覽
/smart-manufacturing/{system}/       # 各智慧製造系統
/esg/                                # ESG 永續發展
/events/                             # 活動列表
/events/{event-name}/                # 各活動頁面
```

## AIO (AI Optimization)

為符合 Google AI Overview 與 LLM 搜尋趨勢，每頁配置：

- **Schema.org 結構化資料**：Product、Organization、FAQ、BreadcrumbList 等
- **FAQ Schema**：常見問題，有助於 AI 摘要與精選摘要
- **Content Summary**：頁面主題、目標受眾、核心價值摘要

## 使用方式

1. 瀏覽本專案資源時，確保圖片與其 `.yml` 描述檔保持同步。
2. 新增頁面時，在 `pages/` 下建立目錄，參考 `GUIDELINES.md` 建立完整的 `index.yml`。
3. 變更 URL 時，更新 `url_mapping` 並確保設定 301 redirect。

---

## 文件系統使用指南

本專案建立了一套**文件驅動的 AI 協作系統**，適用於人類開發者與 AI Agent。

### 系統架構概覽

```
ewill-web/
├── 根目錄文件/              # 人類友好入口
│   ├── README.md           # 快速開始（你在這裡）
│   ├── CONTEXT.md          # 當前狀態快報
│   ├── GUIDELINES.md       # 開發規範
│   └── DESIGN_GUIDELINE.md # 視覺設計規範
│
├── .agent/                 # AI 深度參考（記憶庫）
│   ├── system/             # 狀態：changelog、decisions、learnings
│   ├── sop/                # 流程：標準作業程序
│   ├── tasks/              # 需求：PRD 與實作計劃
│   └── run-logs/           # 日誌：每日執行記錄
│
└── .claude/                # 自動化配置
    ├── commands/           # 明確呼叫（輸入 /command）
    └── skills/             # 自動觸發（根據請求內容）
```

### Commands 完整參考

明確輸入 `/command` 觸發的指令：

| 指令 | 用途 | 建議頻率 |
|------|------|----------|
| `/check_assets` | 檢查圖片描述檔、MD/YML 配對完整性 | 每日 |
| `/check_docs` | 文件一致性檢查（README/GUIDELINES/CONTEXT） | 每月 |
| `/seo_audit` | SEO 稽核（Title/Description/FAQ） | 每週 |
| `/gen_image_meta` | 為新增圖片生成 `.yml` 描述檔 | 新增圖片後 |
| `/update_doc` | 更新 `.agent/` 文件結構與索引 | 架構變更後 |
| `/eval_architecture` | 評估新專案是否適合此架構 | 新專案評估 |

### Skills 觸發詞參考

根據請求內容自動判斷是否套用：

| Skill | 觸發詞 | 功能 |
|-------|--------|------|
| **content-build** | 「建立 next/nuxt 網頁」「normalize assets」 | 內容建置流水線 |
| **doc-sync** | 修改 GUIDELINES/SOP/Commands | 文件同步檢查 |
| **sop-consistency** | 結構變更、目錄重構 | SOP 一致性檢查 |
| **web-crawler** | 「爬取網站」「備份網站」「crawl」 | 網站爬蟲工具 |
| **run-log** | git commit 成功後 | 自動記錄執行日誌 |

### 建議工作流程

#### 每日流程
```
開始工作 → /check_assets → 檢查圖片完整性 → 修復缺失 → 開始開發
```

#### 每週流程
```
/seo_audit → 檢查 SEO 配置 → 優化 Title/Description/FAQ
```

#### 新增內容流程
```
1. 建立頁面目錄 pages/{page_name}/
2. 建立 index.md + index.yml
3. 上傳圖片到 assets/
4. /gen_image_meta → 生成圖片描述檔
5. /check_assets → 驗證完整性
6. git commit
```

#### 結構變更流程
```
1. 執行結構變更
2. /check_docs → 檢查文件是否需要更新
3. /update_doc → 更新文件系統
4. git commit（自動觸發 run-log）
```

### 文件同步規則

當修改以下文件時，必須同步檢查：

| 修改的文件 | 必須檢查 |
|------------|----------|
| `GUIDELINES.md` | `learnings.md`、SOP 約束條件 |
| `.agent/sop/*.md` | `changelog.md`、`.agent/README.md` |
| `.claude/commands/` | `changelog.md`、`CONTEXT.md` |
| 圖片結構變更 | `learnings.md`、SOP 路徑說明 |
| 目錄結構變更 | `decisions.md`、`README.md`、SOP |

### SOP 索引

位於 `.agent/sop/` 目錄：

| SOP | 用途 |
|-----|------|
| `00_project_init.md` | 專案文件初始化與維護 |
| `01_site_analysis.md` | 網站結構化分析 |
| `02_image_download.md` | 圖片下載腳本生成 |
| `02b_image_metadata.md` | 圖片描述檔生成 |
| `03_content_flow.md` | 圖文按資料流排序 |
| `04_seo_structure.md` | SEO 與 URL 結構化 |
| `05_agent_refactor.md` | AI Agent 自動重構 |

---

## 相關文件

- [GUIDELINES.md](./GUIDELINES.md) - 開發與維護規範
- [DESIGN_GUIDELINE.md](./DESIGN_GUIDELINE.md) - 視覺設計規範（AI 生成 UI 參考）
- [CONTEXT.md](./CONTEXT.md) - 專案當前狀態與近期變更
- [.agent/README.md](./.agent/README.md) - AI Agent 文件索引
- [.agent/sop/](./.agent/sop/) - 標準作業程序
- [.claude/skills/content-build/SKILL.md](./.claude/skills/content-build/SKILL.md) - 內容建置流水線
