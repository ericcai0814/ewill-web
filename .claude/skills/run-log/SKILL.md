---
name: run-log
description: "自動記錄任務執行日誌。當完成任務並執行 git commit 後，自動追加簡化的 run log 到當日日誌檔案。"
version: 1.0.0
triggers:
  - "git commit"
  - "任務完成"
  - "commit 後"
---

# Run-Log 自動記錄

## 觸發時機

當執行 `git commit` 成功後，**必須**自動追加 run log。

---

## 簡化格式

每筆 log 使用以下精簡格式：

```markdown
### [HH:MM] 任務標題

- **結果**：一句話摘要
- **Commit**：`hash` - commit message
```

### 範例

```markdown
### [16:15] Commands 重新命名

- **結果**：將 daily_check → check_assets，check_sop → check_docs
- **Commit**：`90bde9e` - refactor(commands): 重新命名 daily_check 和 check_sop
```

---

## 執行步驟

### Step 1：確認當日日誌檔案存在

檔案路徑：`.agent/run-logs/YYYY-MM-DD.md`

如果不存在，建立並加入標題：

```markdown
# Run Logs - YYYY-MM-DD

---
```

### Step 2：追加 log 條目

在檔案末尾追加新 log，使用簡化格式。

### Step 3：不需要額外 commit

run-log 更新會在**下一次** commit 時一併提交，避免無限迴圈。

---

## 欄位說明

| 欄位 | 說明 |
|------|------|
| `HH:MM` | 當前時間（Asia/Taipei） |
| 任務標題 | commit message 的簡化版 |
| 結果 | 一句話摘要 |
| Commit | hash + message |

---

## 注意事項

1. **只在成功 commit 後觸發**，失敗的 commit 不記錄
2. **不要為 run-log 更新單獨 commit**，避免無限迴圈
3. **時區**：使用 Asia/Taipei（UTC+8）
4. **檔名**：每日一檔，格式 `YYYY-MM-DD.md`

---

## 與其他文件的關係

| 文件 | 用途 | 詳細程度 |
|------|------|----------|
| `run-logs/` | 每日執行記錄 | 簡化（標題+結果+commit） |
| `changelog.md` | 功能變更記錄 | 詳細（完整說明） |

run-logs 是 changelog 的**索引**，方便快速查看當日執行了什麼。
