# Git Commit Message 規範

本文件定義專案 Git Commit Message 撰寫規範，參考 [AngularJS Git Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit) 與 [iT邦幫忙文章](https://ithelp.ithome.com.tw/articles/10228738)。

---

## 訊息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Header（必要）

```
<type>(<scope>): <subject>
```

- **type**（必要）：commit 類別
- **scope**（可選）：影響範圍
- **subject**（必要）：簡短描述，不超過 50 字元，結尾不加句號

### Body（可選）

- 詳細描述本次變更
- 每行不超過 72 字元
- 說明 **Why** 與 **What**
- 可使用條列式說明

### Footer（可選）

- 填寫任務編號：`issue #123`
- 不兼容變動：以 `BREAKING CHANGE:` 開頭

---

## Type 類別

| Type       | 說明                                         |
| ---------- | -------------------------------------------- |
| `feat`     | 新增/修改功能 (feature)                      |
| `fix`      | 修補 bug                                     |
| `docs`     | 文件變更 (documentation)                     |
| `style`    | 格式調整（不影響程式碼運行）                 |
| `refactor` | 重構（非新功能、非修 bug）                   |
| `perf`     | 效能優化                                     |
| `test`     | 增加測試                                     |
| `chore`    | 建構程序或輔助工具變動                       |
| `revert`   | 撤銷先前 commit                              |

---

## Scope 建議

本專案建議使用以下 scope：

| Scope     | 說明                           |
| --------- | ------------------------------ |
| `agent`   | `.agent/` 目錄相關             |
| `claude`  | `.claude/` 目錄相關            |
| `content` | 內容模組（index.md、index.yml）|
| `assets`  | 圖片與媒體資源                 |
| `seo`     | SEO 優化相關                   |
| `scripts` | 腳本工具                       |
| `website` | 驗證網站                       |
| `design`  | 設計規範                       |

---

## 範例

### feat：新增功能

```
feat(agent): 建立 AI Agent 協作系統

新增 .agent/ 目錄，包含：
- SOP/：7 個標準作業程序
- System/：系統狀態與決策記錄
- Tasks/：功能 PRD 存放處

主要功能：
- 定義網站分析、圖片處理、SEO 優化等工作流程
- 建立變更日誌與決策記錄機制
- 提供 AI Agent 行為準則
```

### fix：修復 bug

```
fix(content): 修正圖片路徑引用錯誤

問題：
index.md 中的圖片路徑指向舊位置，導致圖片無法顯示

修正：
將 ![](image.png) 改為 ![](assets/image.png)

issue #42
```

### docs：文件變更

```
docs(agent): 更新 SOP 目錄說明

- 補充 02b_image_metadata.md 的約束條件
- 修正 README.md 中的路徑引用
```

### refactor：重構

```
refactor(assets): 圖片資源結構重構

將 19 個模組的圖片從同層目錄移至 assets/ 子目錄：

舊結構：module/image.png
新結構：module/assets/image.png

調整內容：
- 移動 220 張圖片 + 220 個 yml
- 更新 19 個 index.md 的圖片引用
- 更新 GUIDELINES.md 規範
```

### perf：效能優化

```
perf(scripts): 優化圖片掃描效能

調整 find_undescribed.py 掃描邏輯：
- 使用 pathlib 取代 os.walk
- 加入快取機制避免重複掃描

結果：
執行時間 15 秒 → 2 秒

issue #56
```

### chore：建構程序

```
chore: 更新 .gitignore

新增忽略規則：
- node_modules/
- .DS_Store
- *.log
```

---

## 最佳實踐

1. **獨立 commit 每個意義不同的變更**
   - 不要把多個不相關的修改放在同一個 commit

2. **subject 簡潔明瞭**
   - 使用動詞開頭：新增、修正、更新、移除、重構
   - 不超過 50 字元

3. **body 說明 Why & What**
   - 為什麼要做這個變更？
   - 做了什麼具體改動？

4. **關聯 issue 編號**
   - 方便追蹤程式異動原因

5. **保持一致性**
   - 團隊統一使用相同的 type 定義

---

## 參考資源

- [AngularJS Git Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [iT邦幫忙：Git Commit Message 這樣寫會更好](https://ithelp.ithome.com.tw/articles/10228738)

