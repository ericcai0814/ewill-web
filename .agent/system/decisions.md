# 決策記錄 (Decisions)

本文件記錄專案中的重要決策，供團隊成員與 AI 協作者參考。

---

## [2026-01-16] 部署平台從 Cloudflare Pages 遷移到 Vercel

### 背景

專案原本使用 Cloudflare Pages 部署靜態網站。新增 API 功能（聯絡表單）後，需要 Serverless Functions 支援。Cloudflare Pages Functions 與 Vercel Functions 格式不同。

### 問題

- 專案已有 `api/*.ts` 使用 Vercel Functions 格式
- Cloudflare Pages 不支援 Vercel Functions
- 需要二選一：改寫 API 或遷移平台

### 選項

1. **改寫 API**：將 `api/*.ts` 改為 Cloudflare Pages Functions 格式
2. **遷移平台**：將部署從 Cloudflare Pages 改為 Vercel

### 決策

選擇**選項 2**：遷移到 Vercel

### 理由

- **保留現有程式碼**：API 已使用 Vercel Functions 格式，無需改寫
- **本地開發一致**：`vercel dev` 可完整模擬生產環境
- **生態系整合**：`@astrojs/vercel` adapter、Neon PostgreSQL 皆原生支援
- **CI/CD 控制**：透過 GitHub Actions 部署，保持 test → deploy 流程

### 執行內容

1. 修改 `astro.config.mjs`：加入 `@astrojs/vercel` adapter
2. 修改 `.github/workflows/deploy.yml`：改用 Vercel CLI 部署
3. 設定 GitHub Secrets：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`
4. 設定 Vercel 環境變數：`DATABASE_URL`
5. 停用 Vercel GitHub 整合（Ignored Build Step: Don't build anything）

### 架構

```
用戶 → Vercel CDN → Static Assets (Astro SSG)
                  → Vercel Functions (API) → Neon PostgreSQL
```

### 狀態

✅ 已執行

---

## [2026-01-15] md/yml 職責釐清與佈局分離

### 背景

與顧問 Kyle 討論 md + yml 架構的原始設計意圖。目前 yml 中包含 `layout.sections` 佈局配置，導致 md 和 yml 內容重複，且偏離原始設計。

### Kyle 的澄清

1. **md + yml 是規劃階段**：整理資訊架構用，不是實作架構
2. **yml 職責**：SEO、AIO、URL redirect
3. **佈局屬於設計階段**：應由 HTML Layout/Template 負責
4. **不需復刻舊版**：可嘗試更現代化的設計版型

### Kyle 的願景：AI 自動套版

> 對於發布一個新的內容來說，就是負責內容的人只要專心提供文案和圖片。
>
> 再選擇合適的版型，會設計新的版型，讓 AI 自己去做套版、排版，把這段人工省下來。
>
> 這樣可以讓 AI 一次做 30 種也沒問題（開多分支），做出來自動截圖放相簿，最後再挑一個順眼的版本納入主要分支。
>
> **「苦勞都交給 AI Agent，功勞留給自己。」**
>
> 用這樣的原則思考做法。換句話說，AI 不會跟你搶功勞；但也千萬別跟 AI 搶苦勞。

### 核心原則

> 如果負責內容資訊架構為主的 md/yml 裡面出現跟版型、外觀這些，就屬於偏離它們的本質用途

### 決策

- **md/yml 專注於**：內容、SEO、URL redirect
- **佈局/版型**：由 HTML Template 負責，不放在 yml
- **sync-content**：需重新評估，可能移除

### 影響

- yml 中的 `layout.sections` 需要調整或移除
- 需規劃頁面 Template（ProductPage、EventPage 等）
- 設計方向可以更現代化，不需 1:1 復刻舊版

### 來源

與顧問 Kyle 討論確認（2026-01-15）

### 狀態

🔄 待執行

---

## [2026-01-14] sync-content 保護機制策略變更

### 背景

`sync-content` 原本實作「智慧合併」機制，嘗試將 md 內容同步到 yml 的同時保留手動配置的 sections。但實測發現此機制會破壞頁面佈局順序（手動 sections 被移到最後）。

### 問題場景

```
原始 services/index.yml：
- anchor (軟體開發)    ← 手動配置
- text (資訊安全)      ← 可同步
- cta (連結)           ← 手動配置
- anchor (系統規劃)    ← 手動配置

智慧合併後：
- text (從 md 解析)    ← 全部 syncable 在前
- image (從 md 解析)
- anchor               ← 手動被移到最後
- cta
- anchor
```

### 選項

1. **改進智慧合併**：保留手動 sections 的原始位置索引，合併時還原位置
2. **完全跳過**：若頁面有任何手動 sections，完全不同步
3. **標記系統**：在 yml 中加入 `sync: false` 標記排除特定頁面

### 決策

選擇**選項 2**：完全跳過含手動 sections 的頁面

### 理由

- **簡單可靠**：邏輯清晰，不會有意外的副作用
- **保護設計**：手動配置的頁面通常是精心設計的佈局，不應被干擾
- **明確分界**：區分「純內容頁」（md 驅動）與「複雜佈局頁」（yml 驅動）
- **實作成本低**：只需加一個檢查函式，不需維護複雜的位置索引邏輯

### 影響

- 37 個頁面中，約 30 個含手動 sections 會被跳過
- 僅 event_* 等純 text/image 頁面會被同步
- 手動配置的頁面需直接編輯 yml

### 狀態

✅ 已執行

---

## [2026-01-06] .agent/ 目錄結構重構

### 背景

原有的 `.agent/` 目錄結構（`memory/`, `prompts/`, `workflows/`, `guides/`）與 `.claude/commands/update_doc.md` 定義的標準格式（`Tasks/`, `System/`, `SOP/`）不一致，需要統一。

### 選項

1. 維持現有結構，刪除 `update_doc.md`
2. 整合 `update_doc.md` 到 `system_prompt.md`
3. 重構 `.agent/` 目錄，採用標準化的 Tasks/System/SOP 格式

### 決策

選擇**選項 3**：重構為標準化格式

### 理由

- 符合 `.claude/commands/update_doc.md` 定義的通用標準
- `Tasks/` 提供功能規劃的專屬空間
- `System/` 整合系統狀態與決策記錄
- `SOP/` 統一所有標準作業程序
- 提升結構清晰度與可維護性

### 遷移對應

| 舊 | 新 |
|----|-----|
| `memory/` | `System/` |
| `prompts/` | `System/` |
| `workflows/` | `SOP/` |
| `guides/` | `SOP/` |

### 狀態

✅ 已執行

---

## [2026-01-06] 文件結構職責劃分

### 背景

專案同時有根目錄文件（`README.md`、`GUIDELINES.md`、`CONTEXT.md`）和 `.agent/memory/` 目錄，導致部分資訊重複（如 `CONTEXT.md` 和 `changelog.md` 的變更記錄）。

### 選項

1. 合併所有文件到根目錄
2. 合併所有文件到 `.agent/memory/`
3. 維持分離，但明確劃分職責並減少重複

### 決策

選擇**選項 3**：維持分離，明確劃分職責

### 理由

- 根目錄文件是「人類友好入口」，新成員/PM 第一眼能看到重要資訊
- `.agent/memory/` 是「AI 深度參考」，提供詳細歷史與學習記錄
- 精簡 `CONTEXT.md`，變更記錄連結到 `changelog.md`，避免維護兩份

### 狀態

✅ 已執行

---

## [2026-01-06] 圖片資源重構至 assets/ 目錄

### 背景

專案中圖片與 `.md`、`.yml` 檔案混放在同一目錄，隨著資源增加，目錄結構變得混亂，不易維護。

### 選項

1. 維持現狀（圖片與內容檔案混放）
2. 建立根目錄 `assets/shared/` 存放所有共用圖片
3. 各模組建立獨立的 `assets/` 子目錄

### 決策

選擇**選項 3**：各模組建立獨立的 `assets/` 子目錄

### 理由

- 保持各模組獨立性，方便模組化管理
- 圖片與對應頁面在同一模組下，關係清晰
- 不影響現有重複圖片（如 `Frame-81_fix0219.png`），避免引用複雜化
- 根目錄圖片（首頁資源）保持原位，符合直覺

### 執行摘要

- 建立 19 個 `assets/` 目錄
- 移動 220 張圖片 + 220 個 yml 描述檔
- 更新 19 個 `index.md` 的引用路徑
- 根目錄 11 張圖片保持不動

### 狀態

✅ 已執行

---

## [2026-01-06] 建立架構評估指南

### 背景

為使未來新專案能快速評估是否適合採用「.md + .yml 分離」架構，需要建立結構化的評估機制，讓 AI 可自動判斷。

### 選項

1. 每次評估時由人工判斷
2. 建立評估建議書，但由人工閱讀後判斷
3. 建立結構化評估建議書，包含計分系統與訪談收集清單，供 AI 自動評估

### 決策

選擇**選項 3**：建立結構化評估建議書

### 理由

- 業務/PM 可使用標準化的訪談收集清單
- AI 可根據計分系統自動給出建議
- 建構自動化的專案團隊流程

### 狀態

✅ 已執行（儲存於 `.agent/sop/guide_architecture_evaluation.md`）

---

## [2026-01-05] 建立 AI Agent 協作系統

### 背景

為使 AI Agent 能夠作為專案的長期協作者，需要建立結構化的協作機制，包含記憶系統、工作流程定義與系統提示詞。

### 選項

1. 將所有提示詞放在單一檔案中
2. 建立 `.agent/` 目錄，依功能模組化拆分

### 決策

選擇**選項 2**：建立模組化的 `.agent/` 目錄結構

### 理由

- 避免單一檔案過長，防止 LLM context window 限制
- 便於個別更新與維護
- 符合現有專案的模組化風格

### 狀態

✅ 已執行

---

## [2026-01-02] 採用 MD/YML 雙檔案系統

### 背景

需要區分「人類可讀的內容規劃」與「機器可讀的技術參數」。

### 選項

1. 所有內容放在單一 YAML 檔案
2. MD 放內容、YML 放技術參數
3. 使用 Markdown frontmatter 合併

### 決策

選擇**選項 2**：MD/YML 雙檔案系統

### 理由

- MD 檔案對 PM / 設計師 / 內容編輯友善
- YML 檔案便於工程師解析與程式處理
- 避免檔案過長導致 LLM 幻覺
- AI Agent 可獨立更新 YML（SEO、FAQ）而不影響內容
- 複雜的 AIO 結構（80-110 行）不適合放入 frontmatter

### 狀態

✅ 已執行
