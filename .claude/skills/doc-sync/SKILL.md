---
name: doc-sync
description: 確保文件同步一致性。當修改 GUIDELINES.md、SOP、Commands 或執行結構變更時自動觸發，提醒需要同步更新的相關文件。
---

# 文件同步規則

當你修改專案文件時，必須確保相關文件同步更新。

## 觸發條件與影響範圍

### 修改根目錄文件時

| 修改的文件 | 必須檢查 |
|------------|----------|
| `GUIDELINES.md` | `.agent/System/learnings.md`、相關 SOP 的約束條件 |
| `README.md` | `.agent/README.md` 是否需要同步 |
| `CONTEXT.md` | 確保與 `changelog.md` 最新記錄一致 |

### 修改 .agent/ 文件時

| 修改的文件 | 必須檢查 |
|------------|----------|
| `.agent/SOP/*.md` | `changelog.md`、`.agent/README.md` |
| `.agent/System/learnings.md` | `GUIDELINES.md` 是否一致 |
| `.agent/System/decisions.md` | 引用的路徑是否正確 |

### 修改 .claude/ 文件時

| 修改的文件 | 必須檢查 |
|------------|----------|
| `.claude/commands/*.md` | `changelog.md`、`CONTEXT.md`、`.claude/commands/README.md` |
| `.claude/skills/*.md` | `changelog.md`、`.claude/README.md`（如有） |

## 執行步驟

1. **識別變更類型**：判斷修改的是哪類文件
2. **查閱影響範圍**：根據上表找出需要檢查的文件
3. **執行同步更新**：更新所有相關文件
4. **記錄變更**：更新 `changelog.md`

## 完成任務前檢查清單

- [ ] 變更是否已記錄到 `changelog.md`
- [ ] 相關文件是否已同步更新
- [ ] 路徑引用是否正確
- [ ] 與 `GUIDELINES.md` 的規範是否一致

