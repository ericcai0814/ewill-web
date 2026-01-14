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

### 4.1 sync-content 保護機制
- **可同步類型**：`text`, `image`（從 md 解析）
- **手動類型**：`card_list`, `cta`, `contact_form`, `anchor`, `product_intro`, `feature_grid`, `feature_showcase`, `timeline`, `gallery` 等（在 yml 手動配置）
- **保護邏輯**：
  - 若頁面 yml 包含任何手動類型 section，**完全跳過同步**
  - 這確保精心設計的佈局不會被覆蓋
  - 僅同步純 text/image 頁面（如 event_* 活動頁）
- **pre-commit hook**：當 index.md 變更時自動執行 sync-content
- **重要**：手動配置的頁面需直接編輯 yml，md 檔案僅作為原始內容參考

**頁面類型與編輯指南**：
| 頁面類型 | 範例 | 編輯方式 | 說明 |
|----------|------|----------|------|
| 產品頁 | acunetix, logsec | 直接編輯 yml | 複雜佈局，使用 product_intro + feature_* |
| 列表頁 | index, event_information | 直接編輯 yml | 卡片列表，使用 card_list |
| 服務頁 | services, solutions | 直接編輯 yml | 錨點導航，使用 anchor + cta |
| 活動頁 | event_2025* | 編輯 md，自動同步 | 純內容，使用 text + image |
| 靜態頁 | about_us, esg | 編輯 md，自動同步 | 純內容，使用 text + image |

### 4.2 Section Type 使用指南

**12 種可用的 Section Types**：

| Type | 使用次數 | 適用場景 | 必填欄位 |
|------|:--------:|----------|----------|
| `product_intro` | 30 | 產品頁 Hero 區塊 | title, description, image_id |
| `feature_showcase` | 29 | 功能展示（圖文並排） | title, items[] |
| `cta` | 26 | Call to Action 按鈕 | button_text, button_link |
| `text` | 23 | 純文字內容 | content |
| `feature_grid` | 15 | 多欄功能卡片 | items[] |
| `image` | 50 | 單張圖片 | image_id |
| `carousel` | 3 | 圖片輪播（含 RWD） | items[], display? |
| `gallery` | 6 | 圖片網格 | images[] |
| `anchor` | 6 | 錨點導航區塊 | id, title, cards[] |
| `card_list` | 3 | 卡片列表 | cards[], columns |
| `contact_form` | 1 | 聯絡表單 | fields[], button_text |
| `timeline` | - | 時間軸 | items[] |

**選擇指南**：
- 新建產品頁：`product_intro` → `feature_showcase` → `feature_grid` → `cta`
- 新建列表頁：`card_list`（設定 columns: 3 或 4）
- 新建活動頁：純 `text` + `image`，可由 md 同步

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
- **Gitignore 目錄**：以下目錄被 gitignore，變更不需 commit：
  - `astro-app/public/content/` - 動態生成的頁面 JSON 內容
  - `.claude/settings.local.json` - 本地 Claude 設定

### 6. 設計決策確認流程
- **UI/UX 變更前必須確認**：新增、修改、移除任何視覺元件前，使用 `AskUserQuestion` 確認
- **避免「先做再拆」的摩擦**：不要假設用戶需要某功能，先問再做
- **反模式案例**：
  ```
  ❌ 錯誤：自行實作 AnchorNav → 用戶說不需要 → 移除（浪費兩個 commit）
  ✅ 正確：詢問「是否需要 AnchorNav 側邊導航？」→ 確認後再實作
  ```

### 7. Content Build 工作流程（2026-01-14 新增）

**問題背景**：修改 `pages/*/index.yml` 後，本地預覽沒有更新；部署後頁面顯示 404 或內容遺失。

**根本原因**：
1. 內容系統有兩層轉換：`yml → JSON → Astro 渲染`
2. 修改 yml 後必須執行 `pnpm run build`（根目錄）才能生成 JSON
3. CI/CD 原本缺少 content build 步驟，導致 `public/content/` 為空

**正確的內容流程**：
```
pages/*.yml  →  根目錄 pnpm run build  →  astro-app/public/content/*.json  →  Astro 渲染
```

**兩個 build 的區別**：
| 位置 | 指令 | package.json script | 作用 |
|------|------|---------------------|------|
| **根目錄** | `pnpm run build` | `npx tsx .claude/skills/content-build/scripts/build.ts` | yml → JSON |
| astro-app/ | `pnpm run build` | `astro build` | JSON → HTML |

**CI/CD 必要步驟**（順序重要）：
```yaml
- name: Sync content
  run: pnpm run sync-content      # 1. md → yml（根目錄）

- name: Build content
  run: pnpm run build              # 2. yml → JSON（根目錄）⚠️ 關鍵步驟

- name: Build Astro site
  working-directory: astro-app
  run: pnpm run build              # 3. JSON → HTML（astro-app/）
```

**開發流程提醒**：
- 修改 yml 後，**在根目錄**執行 `pnpm run build`
- 如果本地預覽沒更新，先檢查是否執行了 content build
- 新增 Section Type 或 Component 時，確認 CI/CD 流程完整

**任務規劃必須包含**：
- [ ] 元件實作
- [ ] 整合到 PageLayout
- [ ] **CI/CD 依賴確認** ← 容易遺漏！

---

## 待探索
- [ ] 自動化 Schema.org JSON-LD 生成
- [ ] 圖片壓縮與 WebP 轉換流程
- [ ] 多語系內容管理策略
