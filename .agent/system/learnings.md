# 學習與發現 (Learnings)

本文件記錄 AI Agent 在協作過程中的學習與發現，有助於持續優化協作效率。

---

## 專案特性

### 1. 檔案命名慣例
- 專案目錄使用 `snake_case`（如 `palo_alto/`、`security_scorecard/`）
- URL 使用 `kebab-case`（如 `/palo-alto-networks/`）
- 圖片檔名允許中文與底線（如 `首頁Banner1209.png`）

### 2. 內容結構
- 每個產品/解決方案有獨立目錄
- 每個目錄包含 `index.md`（內容）和 `index.yml`（技術參數）
- 圖片存放於 `assets/` 子目錄，與 `.md` 檔案分離
- 首頁資源同樣遵循此規範，存放於 `index/assets/`

### 3. 描述語言
- 所有內容使用**繁體中文**
- 技術欄位名稱使用英文（如 `seo`, `aio`, `url_mapping`）

---

## 最佳實務

### 1. 圖片描述撰寫
- 描述核心視覺元素與傳達訊息
- 若圖片包含文字，需將關鍵文字納入描述
- 字數控制在 50 字以內

### 2. SEO 優化
- Title 長度：50-60 字元
- Description 長度：150-160 字元
- 每頁至少 3-4 個 FAQ

### 3. 避免的問題
- 不要留下沒有 `.yml` 描述檔的圖片
- 不要使用絕對路徑引用圖片
- 不要在 MD 檔案中放技術參數

### 4. 爬蟲與 sync-content 整合
- 爬蟲可能使用 `./images/` 路徑，但實際圖片存於 `assets/`
- `sync-content.ts` 的 `getImageId` 需處理 `images/` 和 `assets/` 兩種前綴
- 圖片 `.yml` 描述檔應包含語義化 `id`（如 `event_20251021_photo`），而非檔名格式
- 跨頁面引用圖片時，需將圖片複製到對應頁面的 `assets/` 目錄

### 4.1 sync-content 智慧合併機制
- **可同步類型**：`text`, `image`（從 md 解析）
- **手動類型**：`card_list`, `cta`, `contact_form`, `feature_grid` 等（在 yml 手動配置）
- **智慧合併邏輯**：
  1. 從 md 解析新的 text/image sections
  2. 保留現有的手動配置 sections
  3. 合併順序：新的 text/image 在前，手動 sections 在後
- **pre-commit hook**：當 index.md 變更時自動執行 sync-content
- **重要**：手動配置的 sections 不會被 sync-content 覆蓋

### 5. Git Commit 規範
- **顆粒度**：一個 commit 只做一件事，按功能邊界拆分
- **Scope 分離**：不同 scope 的變更應分開 commit
  - `docs` - 文件變更
  - `feat(module)` - 功能新增
  - `agent` - Agent 系統變更
- **範例拆分**：
  ```
  docs(specs): 新增專案規格文件
  feat(ewill-next): 初始化 Next.js 專案
  feat(ewill-next): 實作首頁元件
  chore(agent): 建立 run-log 系統
  ```
- **禁止 Co-Authored-By**：本專案不使用 Co-Authored-By 標記

### 6. 設計決策確認流程
- **UI/UX 變更前必須確認**：新增、修改、移除任何視覺元件前，使用 `AskUserQuestion` 確認
- **避免「先做再拆」的摩擦**：不要假設用戶需要某功能，先問再做
- **反模式案例**：
  ```
  ❌ 錯誤：自行實作 AnchorNav → 用戶說不需要 → 移除（浪費兩個 commit）
  ✅ 正確：詢問「是否需要 AnchorNav 側邊導航？」→ 確認後再實作
  ```

---

## 待探索
- [ ] 自動化 Schema.org JSON-LD 生成
- [ ] 圖片壓縮與 WebP 轉換流程
- [ ] 多語系內容管理策略
