# .agent 文件索引

本目錄包含 AI Agent 協作所需的所有關鍵資訊，讓任何工程師或 AI 都能獲得系統的完整上下文。

## 目錄結構

```
.agent/
├── README.md          # 本文件（文件索引）
├── Tasks/             # 功能 PRD 與實作計畫
├── System/            # 系統狀態、架構與決策記錄
├── SOP/               # 標準作業程序（工作流程）
├── scripts/           # Agent 工具腳本
└── run-logs/          # 執行日誌（每日一檔）
```

---

## Tasks/

存放功能的 PRD（產品需求文件）與實作計畫。

| 檔案 | 說明 |
|------|------|
| *(目前為空)* | 新功能規劃時建立 |

---

## System/

記錄系統當前狀態、架構決策與學習發現。

| 檔案 | 說明 |
|------|------|
| [system_prompt.md](./System/system_prompt.md) | AI Agent 系統提示詞，定義角色與行為準則 |
| [changelog.md](./System/changelog.md) | 專案變更日誌（單一來源） |
| [decisions.md](./System/decisions.md) | 重要決策記錄，包含背景、選項與理由 |
| [learnings.md](./System/learnings.md) | 專案特性與最佳實務 |

---

## SOP/

標準作業程序，定義執行特定任務的最佳實踐。

### 工作流程 SOP（有執行順序）

| 檔案                                                         | 說明                 |
| ------------------------------------------------------------ | -------------------- |
| [00_project_init.md](./SOP/00_project_init.md)               | 專案文件初始化與維護 |
| [01_site_analysis.md](./SOP/01_site_analysis.md)             | 網站結構化分析       |
| [02_image_download.md](./SOP/02_image_download.md)           | 圖片下載腳本生成     |
| [02b_image_metadata.md](./SOP/02b_image_metadata.md)         | 圖片描述檔生成       |
| [03_content_flow.md](./SOP/03_content_flow.md)               | 圖文按資料流排序     |
| [04_seo_structure.md](./SOP/04_seo_structure.md)             | SEO 與 URL 結構化    |
| [05_agent_refactor.md](./SOP/05_agent_refactor.md)           | AI Agent 自動重構    |

### 參考指南（獨立參考）

| 檔案                                                                   | 說明                 |
| ---------------------------------------------------------------------- | -------------------- |
| [guide_architecture_evaluation.md](./SOP/guide_architecture_evaluation.md) | 內容架構評估建議書   |

---

## scripts/

Agent 執行任務時使用的工具腳本。

| 腳本 | 用途 |
|------|------|
| `find_undescribed.py` | 掃描目錄，找出缺少 `.yml` 描述檔的圖片 |
| `fix-yml-metadata.py` | 批次補齊 `.yml` 的 `id` 和 `alt` 欄位 |
| `migrate-image-refs.py` | 遷移圖片引用從 `index.md` 至 `index.yml` |
| `analyze_website_design.py` | 分析網站設計結構與元素 |

```bash
# 範例
python3 .agent/scripts/find_undescribed.py pages/
python3 .agent/scripts/fix-yml-metadata.py
```

---

## run-logs/

每日執行日誌，記錄 Agent 完成的所有任務。

| 欄位 | 說明 |
|------|------|
| `run_id` | 遞增序號或時間戳 |
| `timestamp` | 執行時間 (Asia/Taipei) |
| `goal` | 任務目標 |
| `prompt_used` | 實際使用的 prompt |
| `actions` | 具體操作列表 |
| `result` | 產出結果摘要 |
| `expectation_check` | 期待判定（expected/actual/pass/rationale） |
| `next_step` | 後續步驟 |

```bash
# 檔案命名
.agent/run-logs/YYYY-MM-DD.md
```

---

## 相關文件

- [README.md](../README.md) - 專案概觀與目錄結構
- [GUIDELINES.md](../GUIDELINES.md) - 開發規範與命名慣例
- [CONTEXT.md](../CONTEXT.md) - 專案當前狀態

