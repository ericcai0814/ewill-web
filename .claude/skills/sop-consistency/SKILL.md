---
name: sop-consistency
description: 檢查 SOP 與專案現況的一致性。當執行結構變更、目錄重構、或詢問 SOP 相關問題時自動觸發，確保 SOP 文件反映最新的專案狀態。
---

# SOP 一致性檢查規則

當專案結構變更後，必須確保 SOP 文件與現況一致。

## 檢查項目

### 圖片路徑格式
- 是否使用 `assets/` 子目錄格式
- 範例路徑是否為 `module/assets/image.jpg`

### 目錄結構說明
- 是否符合 `Tasks/System/SOP` 結構
- `.agent/` 結構描述是否正確

### 相對路徑引用
- 引用其他文件的路徑是否正確
- 從 SOP 引用 System 應使用 `../System/`
- 引用根目錄應使用 `../../`

### 範例程式碼
- 腳本中的路徑是否正確
- 是否使用 `scripts/` 目錄路徑

### 約束條件
- 描述是否與 `GUIDELINES.md` 一致

## 變更類型與影響範圍

| 變更類型 | 需檢查的文件 |
|----------|--------------|
| 圖片路徑/結構變更 | `learnings.md`、所有 SOP、`GUIDELINES.md` |
| 目錄結構重構 | `decisions.md`、所有 SOP、`README.md` |
| 新增 Command | `changelog.md`、`CONTEXT.md`、`.claude/commands/README.md` |
| 新增/修改 SOP | `changelog.md`、`.agent/README.md` |
| 規範變更 | `GUIDELINES.md`、`learnings.md`、相關 SOP |

## 檢查流程

```
結構變更完成
    │
    ▼
1. 更新 changelog.md 記錄變更
    │
    ▼
2. 檢查 System 文件
   - learnings.md 慣例是否過時
   - decisions.md 路徑是否正確
    │
    ▼
3. 檢查 SOP 文件
   - 路徑引用是否正確
   - 範例程式碼是否過時
    │
    ▼
4. 檢查根目錄文件
   - README.md 結構說明
   - CONTEXT.md 狀態描述
   - GUIDELINES.md 規範內容
    │
    ▼
執行 /check_sop 驗證一致性
```

## 相關資源

- [變更影響檢查清單](../../.agent/SOP/05_agent_refactor.md#變更影響檢查清單)
- [更新觸發條件](../../.agent/SOP/00_project_init.md#自動更新觸發條件)

