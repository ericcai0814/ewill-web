# AI 協作行為準則

本文件定義 AI Agent 在本專案中的行為準則，確保文件一致性。

## 自動觸發規則

### 當修改以下文件時，必須同步檢查：

| 修改的文件 | 必須檢查 |
|------------|----------|
| `GUIDELINES.md` | `.agent/System/learnings.md`、相關 SOP 的約束條件 |
| `.agent/SOP/*.md` | `changelog.md`、`.agent/README.md` |
| `.claude/commands/*.md` | `changelog.md`、`CONTEXT.md`、`.claude/commands/README.md` |
| 圖片結構變更 | `learnings.md`、所有 SOP 的路徑說明 |
| 目錄結構變更 | `decisions.md`、`README.md`、SOP |

### 當執行以下操作後，必須更新：

| 操作 | 必須更新 |
|------|----------|
| 新增 SOP | `changelog.md`、`.agent/README.md` |
| 新增 Command | `changelog.md`、`CONTEXT.md`、`.claude/commands/README.md` |
| 重大決策 | `decisions.md`、`changelog.md` |
| 結構重構 | `changelog.md`、`learnings.md`、`README.md` |

## 完成任務前的檢查清單

在回報任務完成前，AI 應確認：

- [ ] 變更是否已記錄到 `changelog.md`
- [ ] 相關文件是否已同步更新
- [ ] 路徑引用是否正確
- [ ] 與 `GUIDELINES.md` 的規範是否一致

## Commit 規則

**完成任務後，須先詢問用戶確認是否需要 commit**：

1. 完成任務後，詢問：「是否需要 commit？」
2. **執行文件同步檢查**（見下方）
3. 用戶確認後，使用 `git add -A` 暫存所有變更
4. 依照 `GUIDELINES.md` 第 10 章的 Commit Message 規範撰寫訊息
5. 執行 `git commit`
6. 回報 commit hash 與變更摘要

### ⚠️ Commit 前必須檢查的文件

**每次 commit 前，必須檢查以下文件是否需要更新：**

| 文件 | 檢查內容 |
|------|----------|
| `README.md` | 目錄結構、建置指令、維護腳本 |
| `CONTEXT.md` | 目錄結構、Skills/Commands、關鍵技術 |
| `GUIDELINES.md` | 開發規範、命名慣例 |
| `DESIGN_GUIDELINE.md` | 設計規範（如有 UI 變更） |
| `.agent/README.md` | Agent 文件索引 |
| `.claude/` 相關文件 | Skills/Commands 索引 |

**觸發更新的變更類型：**

| 變更類型 | 需要更新的文件 |
|----------|----------------|
| 目錄結構變更 | `README.md`、`CONTEXT.md` |
| 新增/修改 scripts | `README.md`、`.agent/README.md` |
| 新增/修改 skills | `CONTEXT.md`、`README.md` |
| 輸出路徑變更 | `README.md`、`CONTEXT.md`、`SKILL.md` |
| .gitignore 變更 | `README.md`（如涉及建置輸出） |

### Commit 時機

| 情境 | 處理方式 |
|------|:--------:|
| 完成用戶請求的任務 | 詢問確認 |
| 完成文件更新 | 詢問確認 |
| 完成結構重構 | 詢問確認 |
| 僅回答問題（無檔案變更） | 不 commit |
| 用戶明確要求 commit | 直接執行 |
| 用戶明確要求不要 commit | 不 commit |

## 參考文件

- [變更影響檢查清單](../.agent/SOP/05_agent_refactor.md#變更影響檢查清單)
- [更新觸發條件](../.agent/SOP/00_project_init.md#自動更新觸發條件)
- [Claude Commands](./commands/README.md)

