# 專案當前互文 (CONTEXT)

本文件記錄專案的當前狀態與技術重點，供開發者與 AI 快速掌握狀況。

## 狀態總覽

- **最後更新時間**: 2026-01-09
- **目前階段**: 內容邊界重構完成，所有頁面內容集中於 `pages/` 目錄
- **專案類型**: 網站內容庫 (Content Repository) / SEO 資料源
- **頁面數量**: 20 個頁面目錄 + 1 個共用元件 (Header)
- **圖片覆蓋率**: 231 張圖片，全部 100% 有 `.yml` 描述檔
- **圖片結構**: 所有頁面圖片統一存放於 `pages/{page}/assets/`
- **設計規範**: [DESIGN_GUIDELINE.md](./DESIGN_GUIDELINE.md) 定義品牌視覺規範
- **共用元件**: `pages/header/` 定義導覽列結構與樣式

## 目錄結構

```
ewill-web/
├── pages/              # 📄 網站頁面內容（SEO 資料源）
│   ├── index/          # 首頁
│   ├── about_us/       # 關於我們
│   ├── solutions/      # 資安服務總覽
│   └── ...             # 其他 17 個頁面
│
├── .agent/             # 🤖 AI Agent 協作系統
│   ├── scripts/        # 維護腳本
│   └── run-logs/       # 執行日誌
│
├── .claude/            # 🔮 Claude 配置
│   └── skills/
│       └── content-build/  # 內容建置流水線
│
├── nuxt-app/           # 🚀 Nuxt 3 應用程式（原始碼納入版控）
│   ├── pages/          # 頁面元件
│   ├── components/     # 共用元件
│   ├── composables/    # Composables
│   └── public/         # 靜態資源（content-build 輸出，已 gitignore）
│
├── # 建置輸出（已 gitignore）
├── static-app/         # --target=static 輸出
├── next-app/           # --target=next 輸出
│
└── *.md                # 專案文件
```

## Claude 自動化

詳見 [.claude/commands/README.md](./.claude/commands/README.md)

### Skills（自動觸發）

| Skill             | 說明                                          |
| ----------------- | --------------------------------------------- |
| `doc-sync`        | 修改文件時自動提醒同步                        |
| `content-build`   | 內容建置流水線（圖片正規化、RWD、多框架輸出） |
| `sop-consistency` | 結構變更時自動檢查一致性                      |
| `web-crawler`     | 網站爬蟲工具（爬取頁面、產出 md/yml/圖片）    |
| `run-log`         | 自動記錄執行日誌（commit 後觸發）             |

#### content-build 輸出目標

```bash
npx tsx .claude/skills/content-build/scripts/build.ts --target=static  # → static-app/
npx tsx .claude/skills/content-build/scripts/build.ts --target=next    # → next-app/public/
npx tsx .claude/skills/content-build/scripts/build.ts --target=nuxt    # → nuxt-app/public/
```

### Commands（明確呼叫）

| 指令                 | 用途           | 頻率       |
| -------------------- | -------------- | ---------- |
| `/check_assets`      | 資源檢查       | 每日       |
| `/seo_audit`         | SEO 稽核       | 每週       |
| `/check_docs`        | 文件一致性檢查 | 每月       |
| `/gen_image_meta`    | 圖片描述檔生成 | 新增圖片時 |
| `/eval_architecture` | 架構評估       | 新專案時   |

## 詳細記錄

> 📋 詳細的變更歷史與決策背景，請參考 `.agent/` 目錄：

| 文件                                     | 說明                          |
| ---------------------------------------- | ----------------------------- |
| [.agent/README.md](./.agent/README.md)   | AI Agent 文件索引             |
| [變更日誌](./.agent/system/changelog.md) | 專案所有變更記錄（時間倒序）  |
| [決策記錄](./.agent/system/decisions.md) | 重要決策的背景、選項與理由    |
| [專案特性](./.agent/system/learnings.md) | AI 學習到的專案慣例與最佳實務 |

## 關鍵技術與依賴

- **結構**: `pages/` 為內容邊界，以頁面為單位組織
- **Metadata**: YAML (`.yml`) 格式
- **內容與元資料分離**: `index.md`（內容）+ `index.yml`（SEO/AIO）
- **建置工具**: TypeScript（`content-build` skill）
- **輸出目標**: Static / Next.js / Nuxt（自動偵測或明確指定）

### 頁面目錄與 URL 對應

| 目錄                           | URL                                         | 說明               |
| ------------------------------ | ------------------------------------------- | ------------------ |
| `pages/index/`                 | `/`                                         | 首頁               |
| `pages/about_us/`              | `/about/`                                   | 關於我們           |
| `pages/solutions/`             | `/security-solutions/`                      | 資安服務總覽       |
| `pages/palo_alto/`             | `/security-solutions/palo-alto-networks/`   | Palo Alto Networks |
| `pages/fortinet/`              | `/security-solutions/fortinet/`             | Fortinet           |
| `pages/acunetix/`              | `/security-solutions/acunetix/`             | Acunetix           |
| `pages/security_scorecard/`    | `/security-solutions/security-scorecard/`   | SecurityScorecard  |
| `pages/vicarius_vrx/`          | `/security-solutions/vicarius-vrx/`         | Vicarius vRX       |
| `pages/array/`                 | `/security-solutions/array-networks/`       | Array Networks     |
| `pages/logsec/`                | `/security-solutions/logsec/`               | LOGSEC             |
| `pages/ist/`                   | `/security-solutions/endpoint-security/`    | IST 端點安全       |
| `pages/vmware/`                | `/infrastructure/vmware/`                   | VMware             |
| `pages/smartmanufacturing_ai/` | `/smart-manufacturing/`                     | 智慧製造總覽       |
| `pages/mes/`                   | `/smart-manufacturing/mes/`                 | MES                |
| `pages/wms/`                   | `/smart-manufacturing/wms/`                 | WMS                |
| `pages/scm/`                   | `/smart-manufacturing/scm/`                 | SCM                |
| `pages/data_middleware/`       | `/smart-manufacturing/data-platform/`       | 數據中台           |
| `pages/esg/`                   | `/esg/`                                     | ESG 永續發展       |
| `pages/event_20251118/`        | `/events/smart-manufacturing-webinar-2025/` | 活動頁面           |
| `pages/event_20251124/`        | `/events/passwordless-identity-protection/` | 活動頁面           |

## 待辦事項 / Next Steps

- [ ] **實作 URL Redirect**：在網站伺服器設定 301 redirect，將舊 URL 導向新 URL。
- [ ] **Schema.org 實作**：將 YAML 中的 `aio` 區塊轉換為頁面的 JSON-LD 結構化資料。
- [ ] **持續維護**：確保未來新增的頁面皆符合新的 YAML 規範與命名慣例。
