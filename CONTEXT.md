# 專案當前互文 (CONTEXT)

本文件記錄專案的當前狀態與技術重點，供開發者與 AI 快速掌握狀況。

## 狀態總覽

- **最後更新時間**: 2026-01-06
- **目前階段**: Doc System 完善，已建立 Design Guideline 與 7 個 Claude Commands 自動化流程。
- **專案類型**: 網站內容庫 (Content Repository) / 靜態資源管理。
- **圖片覆蓋率**: 231 張圖片，全部 100% 有 `.yml` 描述檔
- **圖片結構**: 所有模組圖片統一存放於 `{module}/assets/`（含首頁 `index/assets/`）
- **設計規範**: [DESIGN_GUIDELINE.md](./DESIGN_GUIDELINE.md) 定義品牌視覺規範，供 AI 生成一致性設計

## Claude 自動化

詳見 [.claude/commands/README.md](./.claude/commands/README.md)

### Skills（自動觸發）

| Skill | 說明 |
|-------|------|
| `doc-sync` | 修改文件時自動提醒同步 |
| `image-management` | 處理圖片時自動套用規範 |
| `sop-consistency` | 結構變更時自動檢查一致性 |

### Commands（明確呼叫）

| 指令 | 用途 | 頻率 |
|------|------|------|
| `/daily_check` | 每日檢查 | 每日 |
| `/seo_audit` | SEO 稽核 | 每週 |
| `/check_sop` | SOP 一致性檢查 | 每月 |
| `/gen_image_meta` | 圖片描述檔生成 | 新增圖片時 |
| `/new_page` | 建立新頁面 | 新增頁面時 |
| `/eval_architecture` | 架構評估 | 新專案時 |

## 詳細記錄

> 📋 詳細的變更歷史與決策背景，請參考 `.agent/` 目錄：

| 文件 | 說明 |
|------|------|
| [.agent/README.md](./.agent/README.md) | AI Agent 文件索引 |
| [變更日誌](./.agent/System/changelog.md) | 專案所有變更記錄（時間倒序） |
| [決策記錄](./.agent/System/decisions.md) | 重要決策的背景、選項與理由 |
| [專案特性](./.agent/System/learnings.md) | AI 學習到的專案慣例與最佳實務 |

## 關鍵技術與依賴

- **結構**: Folder-based 結構，以產品/解決方案分類。
- **Metadata**: YAML (`.yml`) 格式。
- **內容與元資料分離**: `index.md`（內容）+ `index.yml`（SEO/AIO）

### 主要目錄與 URL 對應

| 目錄                     | 新 URL                                    | 說明               |
| ------------------------ | ----------------------------------------- | ------------------ |
| `root`                   | `/`                                       | 首頁               |
| `about_us/`              | `/about/`                                 | 關於我們           |
| `solutions/`             | `/security-solutions/`                    | 資安服務總覽       |
| `palo_alto/`             | `/security-solutions/palo-alto-networks/` | Palo Alto Networks |
| `fortinet/`              | `/security-solutions/fortinet/`           | Fortinet           |
| `acunetix/`              | `/security-solutions/acunetix/`           | Acunetix           |
| `security_scorecard/`    | `/security-solutions/security-scorecard/` | SecurityScorecard  |
| `vicarius_vrx/`          | `/security-solutions/vicarius-vrx/`       | Vicarius vRX       |
| `array/`                 | `/security-solutions/array-networks/`     | Array Networks     |
| `logsec/`                | `/security-solutions/logsec/`             | LOGSEC             |
| `ist/`                   | `/security-solutions/endpoint-security/`  | IST 端點安全       |
| `vmware/`                | `/infrastructure/vmware/`                 | VMware             |
| `smartmanufacturing_ai/` | `/smart-manufacturing/`                   | 智慧製造總覽       |
| `mes/`                   | `/smart-manufacturing/mes/`               | MES                |
| `wms/`                   | `/smart-manufacturing/wms/`               | WMS                |
| `scm/`                   | `/smart-manufacturing/scm/`               | SCM                |
| `data_middleware/`       | `/smart-manufacturing/data-platform/`     | 數據中台           |
| `esg/`                   | `/esg/`                                   | ESG 永續發展       |
| `event_*/`               | `/events/*`                               | 活動頁面           |

## 待辦事項 / Next Steps

- [ ] **實作 URL Redirect**：在網站伺服器設定 301 redirect，將舊 URL 導向新 URL。
- [ ] **Schema.org 實作**：將 YAML 中的 `aio` 區塊轉換為頁面的 JSON-LD 結構化資料。
- [ ] **持續維護**：確保未來新增的頁面皆符合新的 YAML 規範與命名慣例。
