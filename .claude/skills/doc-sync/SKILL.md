---
name: doc-sync
description: |
  確保文件同步一致性。每次 commit 前必須檢查核心文件是否需要更新。
  觸發時機：任何檔案變更、結構調整、功能新增/修改時。
---

# 文件同步規則

## ⚠️ 核心規則：每次 Commit 必須檢查

**每次 commit 前，必須檢查以下文件是否需要更新：**

| 文件 | 檢查內容 |
|------|----------|
| `README.md` | 目錄結構、建置指令、維護腳本 |
| `CONTEXT.md` | 目錄結構、Skills/Commands、關鍵技術 |
| `GUIDELINES.md` | 開發規範、命名慣例 |
| `DESIGN_GUIDELINE.md` | 設計規範（如有 UI 變更） |
| `.agent/README.md` | Agent 文件索引 |
| `.claude/commands/README.md` | Commands 索引（如有變更） |

## 觸發條件與影響範圍

### 修改 .claude/skills/ 時

| 修改的文件 | 必須更新 |
|------------|----------|
| `skills/*/scripts/*.ts` | `SKILL.md`、`README.md`、`CONTEXT.md` |
| `skills/*/config.ts` | `README.md`（目錄結構）、`CONTEXT.md`（輸出目標） |
| `skills/*/SKILL.md` | `CONTEXT.md`（Skills 表格） |

### 修改 .agent/ 時

| 修改的文件 | 必須更新 |
|------------|----------|
| `.agent/scripts/*.py` | `README.md`（維護腳本）、`.agent/README.md` |
| `.agent/SOP/*.md` | `.agent/README.md`、`changelog.md` |
| `.agent/System/*.md` | `GUIDELINES.md`（如有規範變更） |

### 修改根目錄文件時

| 修改的文件 | 必須檢查 |
|------------|----------|
| `GUIDELINES.md` | `.agent/System/learnings.md`、相關 SOP |
| `README.md` | `.agent/README.md` 是否需要同步 |
| `CONTEXT.md` | 確保與實際專案結構一致 |

### 修改 .gitignore 或目錄結構時

| 變更類型 | 必須更新 |
|----------|----------|
| 新增/刪除目錄 | `README.md`、`CONTEXT.md` 目錄結構 |
| 修改 `.gitignore` | `README.md`（如涉及建置輸出） |
| 重新命名目錄 | 所有引用該路徑的文件 |

## 執行步驟

1. **完成功能開發**
2. **執行文件檢查**：
   ```
   需要更新的文件：
   - [ ] README.md（目錄結構？建置指令？）
   - [ ] CONTEXT.md（目錄結構？Skills？技術依賴？）
   - [ ] GUIDELINES.md（規範變更？）
   - [ ] .agent/README.md（索引變更？）
   ```
3. **更新相關文件**
4. **Commit**

## Commit 前檢查清單

- [ ] `README.md` 目錄結構是否正確
- [ ] `CONTEXT.md` 是否反映當前狀態
- [ ] 新增的 script/skill 是否已記錄
- [ ] 輸出目錄變更是否已更新
- [ ] 路徑引用是否正確

