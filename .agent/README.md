# .agent 文件索引

本目錄包含 AI Agent 協作所需的所有關鍵資訊，讓任何工程師或 AI 都能獲得系統的完整上下文。

## 目錄結構

```
.agent/
├── README.md          # 本文件（文件索引）
├── tasks/             # 功能 PRD 與實作計畫
├── system/            # 系統狀態、架構與決策記錄
├── sop/               # 標準作業程序（工作流程）
├── scripts/           # Agent 工具腳本
└── run-logs/          # 執行日誌（每日一檔）
```

---

## tasks/

存放功能的 PRD（產品需求文件）與實作計畫。

| 檔案                                 | 說明                       |
| ------------------------------------ | -------------------------- |
| [specs/](./tasks/specs/)             | 網站重建專案規格文件       |
| [astro-component-implementation.md](./tasks/astro-component-implementation.md) | Astro 元件實作進度追蹤 |
| [website-validation-react-src.md](./tasks/website-validation-react-src.md) | React 驗證網站實作記錄 |

### tasks/specs/ 子目錄

| 檔案                         | 說明                   |
| ---------------------------- | ---------------------- |
| `phase-1-project-setup.md`   | Phase 1：專案建置      |
| `phase-2-shared-components.md` | Phase 2：共用元件    |
| `phase-3-homepage.md`        | Phase 3：首頁實作      |
| `phase-4-inner-pages.md`     | Phase 4：內頁實作      |
| `phase-5-optimization-deployment.md` | Phase 5：優化與部署 |
| `design-system.md`           | 設計系統規格           |
| `content-guide.md`           | 內容指南               |
| `testing-plan.md`            | 測試計畫               |

---

## system/

記錄系統當前狀態、架構決策與學習發現。

| 檔案                                          | 說明                                    |
| --------------------------------------------- | --------------------------------------- |
| [system_prompt.md](./system/system_prompt.md) | AI Agent 系統提示詞，定義角色與行為準則 |
| [changelog.md](./system/changelog.md)         | 專案變更日誌（單一來源）                |
| [decisions.md](./system/decisions.md)         | 重要決策記錄，包含背景、選項與理由      |
| [learnings.md](./system/learnings.md)         | 專案特性與最佳實務                      |

---

## sop/

標準作業程序，定義執行特定任務的最佳實踐。

### 工作流程 SOP（有執行順序）

| 檔案                                                 | 說明                 |
| ---------------------------------------------------- | -------------------- |
| [00_project_init.md](./sop/00_project_init.md)       | 專案文件初始化與維護 |
| [01_site_analysis.md](./sop/01_site_analysis.md)     | 網站結構化分析       |
| [02_image_download.md](./sop/02_image_download.md)   | 圖片下載腳本生成     |
| [02b_image_metadata.md](./sop/02b_image_metadata.md) | 圖片描述檔生成       |
| [03_content_flow.md](./sop/03_content_flow.md)       | 圖文按資料流排序     |
| [04_seo_structure.md](./sop/04_seo_structure.md)     | SEO 與 URL 結構化    |
| [05_agent_refactor.md](./sop/05_agent_refactor.md)   | AI Agent 自動重構    |

### 參考指南（獨立參考）

| 檔案                                                                       | 說明               |
| -------------------------------------------------------------------------- | ------------------ |
| [guide_architecture_evaluation.md](./sop/guide_architecture_evaluation.md) | 內容架構評估建議書 |

---

## scripts/

Agent 執行任務時使用的工具腳本。

| 腳本                        | 用途                                     |
| --------------------------- | ---------------------------------------- |
| `find_undescribed.py`       | 掃描目錄，找出缺少 `.yml` 描述檔的圖片   |
| `fix-yml-metadata.py`       | 批次補齊 `.yml` 的 `id` 和 `alt` 欄位    |
| `migrate-image-refs.py`     | 遷移圖片引用從 `index.md` 至 `index.yml` |
| `analyze_website_design.py` | 分析網站設計結構與元素                   |

```bash
# 範例
python3 .agent/scripts/find_undescribed.py pages/
python3 .agent/scripts/fix-yml-metadata.py
```

---

## run-logs/

每日執行日誌，記錄 Agent 完成的所有任務。由 `run-log` skill 自動維護。

### 簡化格式

```markdown
### [HH:MM] 任務標題

- **Prompt**：用戶輸入的指令
- **結果**：一句話摘要
- **Commit**：`hash` - commit message
```

```bash
# 檔案命名
.agent/run-logs/YYYY-MM-DD.md
```

---

---

## 執行計畫

AI 協作者的完整執行指南，確保跨對話的一致性與品質。

| 檔案                                          | 說明                                    |
| --------------------------------------------- | --------------------------------------- |
| [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) | 多階段執行計畫，涵蓋文件發現、實作、驗證、Commit 完整流程 |

**使用時機**：
- 新 AI 協作者首次進入專案
- 開始複雜的多步驟任務
- 需要確保遵循專案規範

**核心階段**：
- Phase 0: 文件發現與系統理解（必讀）
- Phase 1: 任務理解與範圍確認
- Phase 2: 實作執行（從文件複製模式）
- Phase 3: 文件同步更新
- Phase 4: 最終驗證與 Commit
- Phase 5: 專案特定驗證（可選）

---

## 相關文件

- [README.md](../README.md) - 專案概觀與目錄結構
- [GUIDELINES.md](../GUIDELINES.md) - 開發規範與命名慣例
- [CONTEXT.md](../CONTEXT.md) - 專案當前狀態
- [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) - AI 執行計畫（跨對話指南）
