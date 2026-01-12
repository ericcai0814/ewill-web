---
name: web-crawler
description: "標準化網站爬蟲工具，用於備份網站內容、轉換為 Markdown、下載圖片、產生 SEO 設定。"
version: 1.1.0
triggers:
  - "爬取網站"
  - "備份網站"
  - "擷取網頁"
  - "網站內容"
  - "crawl"
  - "scrape"
  - "backup website"
---

# 網站爬蟲工具 (Web Crawler)

備份網站內容 → 轉換 Markdown → 下載圖片 → 產生 SEO 設定。

## 分階段流程（必須遵循）

```
Step 1: 詢問目標網址
Step 2: 預覽模式（先爬首頁）
Step 3: 展示結果請使用者確認
Step 4: 調整或繼續
Step 5: 爬取全站
Step 6: 回報完成
```

## 快速開始

```bash
# 安裝依賴
pip install requests beautifulsoup4 lxml PyYAML --break-system-packages

# 預覽模式（預設）
python .claude/skills/web-crawler/crawler.py https://目標網址 --preview -o ./

# 確認後繼續
python .claude/skills/web-crawler/crawler.py https://目標網址 --continue
```

## 使用時機

- ✅ 備份整個網站內容
- ✅ 將網頁轉換為 Markdown
- ✅ 下載網站圖片
- ✅ 產生 SEO / Schema.org 設定
- ✅ 網站遷移前的內容擷取

## 注意事項

- **必須先預覽確認** — 不要直接使用 `--full`
- 遵守 `robots.txt` 規範
- 請求間隔建議至少 2 秒
- 不支援 JavaScript SPA 或需登入頁面

---

## 參考文件索引

按需載入，避免 context pollution。

| 文件 | 用途 | ~Tokens |
|------|------|---------|
| [workflow.md](references/workflow.md) | 完整 6 步驟流程與對話範本 | ~900 |
| [config.md](references/config.md) | 參數說明與過濾調整 | ~350 |
| [output-format.md](references/output-format.md) | 輸出檔案格式（yml） | ~300 |
| [README.md](README.md) | 爬蟲腳本技術文件 | ~2500 |
