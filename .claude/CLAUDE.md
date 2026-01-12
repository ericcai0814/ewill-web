# AI 協作行為準則

## 核心原則

1. **文件同步**：變更程式碼後，檢查相關文件是否需要更新
2. **Commit 前確認**：所有 commit 須經用戶同意
3. **不破壞性操作**：刪除、覆蓋、修改 URL 結構前必須確認

## 同步啟發式

變更任何文件時，問自己：

- 影響專案結構？→ 更新 `README.md`、`CONTEXT.md`
- 重大決策？→ 記錄到 `.agent/system/decisions.md`
- 新的教訓？→ 加入 `.agent/system/learnings.md`
- 新增 SOP/Command/Skill？→ 更新 `changelog.md` 與對應索引

## Commit 流程

1. 完成任務後詢問：「是否需要 commit？」
2. 檢查核心文件是否需同步更新（README、CONTEXT、GUIDELINES）
3. 用戶確認後執行 `git add -A && git commit`
4. 依照 `GUIDELINES.md` 第 10 章撰寫 commit message

## 參考文件

| 需要時讀取 | 用途 |
|------------|------|
| [變更影響檢查清單](./.agent/SOP/05_agent_refactor.md#變更影響檢查清單) | 完整的同步規則 |
| [Commands 索引](./commands/README.md) | 可用指令清單 |
| [SOP 索引](./.agent/README.md) | 標準作業程序 |
