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

## 自動 Commit 規則

**每次完成任務後，必須自動執行 git commit**：

1. 使用 `git add -A` 暫存所有變更
2. 依照 `GUIDELINES.md` 第 10 章的 Commit Message 規範撰寫訊息
3. 執行 `git commit`
4. 回報 commit hash 與變更摘要

### Commit 時機

| 情境 | 是否 Commit |
|------|:-----------:|
| 完成用戶請求的任務 | ✓ |
| 完成文件更新 | ✓ |
| 完成結構重構 | ✓ |
| 僅回答問題（無檔案變更） | ✗ |
| 用戶明確要求不要 commit | ✗ |

## 參考文件

- [變更影響檢查清單](../.agent/SOP/05_agent_refactor.md#變更影響檢查清單)
- [更新觸發條件](../.agent/SOP/00_project_init.md#自動更新觸發條件)
- [Claude Commands](./commands/README.md)

