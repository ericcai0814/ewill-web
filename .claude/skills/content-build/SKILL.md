---
name: content-build
description: |
  內容建置流水線。管理圖片資源、正規化檔名、建立 RWD 友善的內容模型。
  支援 Next.js、Nuxt、靜態輸出三種目標，自動偵測或明確指定。

  觸發時機：
  - 「建立 next 網頁」「建立 Next.js 網站」
  - 「建立 nuxt 網頁」「建立 Nuxt 網站」
  - 「建立靜態頁面」「建立 static 網頁」
  - 「執行 content build」「normalize assets」
  - 處理圖片資源、建立 page model
---

# Content Build Pipeline

內容建置流水線：圖片資源管理 → 檔名正規化 → 內容編譯。

## 快速開始

```bash
npx tsx .claude/skills/content-build/scripts/build.ts           # 自動偵測
npx tsx .claude/skills/content-build/scripts/build.ts --target=next   # Next.js
npx tsx .claude/skills/content-build/scripts/build.ts --target=nuxt   # Nuxt
npx tsx .claude/skills/content-build/scripts/build.ts --target=static # 靜態
```

## 輸出目標

| 目標 | 偵測條件 | 輸出目錄 |
|------|----------|----------|
| Next.js | `next.config.*` 存在 | `{project}/public/` |
| Nuxt | `nuxt.config.*` 存在 | `{project}/public/` |
| Static | 預設 | `static-app/` |

## 驗收標準

```bash
python3 .agent/scripts/find_undescribed.py     # 1. 所有圖片有元資料
npx tsx .claude/skills/content-build/scripts/audit-content.ts  # 2. 無違規引用
```

---

## 參考文件索引

按需載入，避免 context pollution。

| 文件 | 用途 | ~Tokens |
|------|------|---------|
| [workflow.md](references/workflow.md) | 完整三步驟流程 | ~1800 |
| [schemas.md](references/schemas.md) | 資料結構定義 | ~2800 |
| [content-contract.md](references/content-contract.md) | 產出契約 | ~2000 |
| [validation-rules.md](references/validation-rules.md) | 驗證規則 | ~2400 |
| [ui-behavior.md](references/ui-behavior.md) | UI 行為規格 | ~2600 |

### 框架專屬指南

| 文件 | 用途 | ~Tokens |
|------|------|---------|
| [next.md](references/implementations/next.md) | Next.js 實作 | ~2800 |
| [nuxt.md](references/implementations/nuxt.md) | Nuxt 實作 | ~1900 |
| [static.md](references/implementations/static.md) | 靜態輸出 | ~1500 |
