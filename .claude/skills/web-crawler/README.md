# 🕷️ 網站內容爬蟲工具 - Agent 使用指南

## 📋 概述

這是一個標準化的網站爬蟲工具，用於完整備份網站內容。

**當你需要執行以下任務時，請使用此工具：**
- 備份整個網站內容
- 將網站頁面轉換為 Markdown
- 下載網站的主要圖片
- 產生 SEO / Schema.org / Open Graph 設定
- 網站遷移前的內容擷取

---

## 🚀 快速開始

### 安裝依賴

```bash
cd /path/to/web-crawler
pip install -r requirements.txt
```

### 基本用法

```bash
# 互動模式（會詢問網址）
python crawler.py

# 直接指定網址
python crawler.py https://example.com

# 指定輸出目錄
python crawler.py https://example.com -o ./my-backup
```

---

## 📁 輸出結構

執行後會產生以下結構：

```
./crawled-site/
└── example.com/
    ├── robots.txt              # 原始 robots.txt
    ├── crawl-report.yml        # 爬取報告
    ├── index.md                # 首頁 Markdown
    ├── index.yml               # 首頁 SEO 設定
    ├── images/                 # 首頁圖片
    │   ├── hero.jpg
    │   └── hero.yml            # 圖片描述
    ├── about/
    │   ├── index.md
    │   ├── index.yml
    │   └── images/
    └── blog/
        └── post-title/
            ├── index.md
            ├── index.yml
            └── images/
```

---

## ⚙️ 參數說明

| 參數 | 簡寫 | 預設值 | 說明 |
|------|------|--------|------|
| `url` | - | 無 | 目標網站網址 |
| `--output` | `-o` | `./crawled-site` | 輸出目錄 |
| `--delay` | `-d` | `2.0` | 請求間隔（秒） |
| `--timeout` | `-t` | `30` | 請求超時（秒） |
| `--retries` | `-r` | `3` | 最大重試次數 |
| `--min-image-size` | - | `100` | 最小圖片尺寸（px） |

---

## 📄 輸出檔案說明

### index.md（頁面 Markdown）

```markdown
---
source_url: "https://example.com/about"
crawled_at: "2024-01-15T10:30:00+08:00"
---

# 關於我們

頁面內容...

![圖片說明](./images/photo.jpg)
```

### index.yml（SEO 設定）

包含：
- **SEO 設定**：meta title、description、keywords
- **URL 設定**：路徑、slug、重導向規則
- **Schema.org**：結構化資料（WebPage、BreadcrumbList）
- **Open Graph**：社群分享設定
- **Twitter Card**：Twitter 分享設定

### {image}.yml（圖片描述）

包含：
- 基本資訊：檔名、格式、尺寸
- 描述：alt 文字、詳細描述（待 AI 填入）
- SEO：建議檔名、關鍵字
- 來源：原始 URL、所屬頁面

---

## 🔧 進階用法

### 在 Python 中呼叫

```python
from crawler import WebsiteCrawler, CrawlerConfig

# 自訂設定
config = CrawlerConfig(
    output_dir='./backup',
    crawl_delay=3.0,
    min_image_size=150
)

# 執行爬蟲
crawler = WebsiteCrawler(config)
report = crawler.crawl('https://example.com')

# 查看報告
print(f"成功爬取 {report['crawl_report']['pages']['successfully_crawled']} 頁")
```

### 自訂排除規則

修改 `CrawlerConfig` 中的：
- `excluded_image_patterns`：排除的圖片 URL 模式
- `excluded_elements`：排除的 HTML 元素
- `excluded_classes`：排除的 CSS class 關鍵字

---

## ⚠️ 注意事項

1. **遵守 robots.txt**：工具會下載並顯示 robots.txt，請確認目標網站允許爬取
2. **請求間隔**：預設 2 秒，請勿設太短以免造成目標伺服器負擔
3. **版權問題**：下載的內容可能有版權，請確認使用目的合法
4. **圖片描述**：`description.detailed` 欄位標記為「待 AI 分析」，需要另外使用 Vision API 填入

---

## 🐛 常見問題

### Q: 為什麼有些頁面沒有被爬取？

A: 可能原因：
- 頁面不在 sitemap.xml 中
- 頁面沒有從首頁連結
- 頁面需要 JavaScript 渲染（此工具不支援 SPA）

### Q: 圖片為什麼被排除？

A: 圖片會被排除如果：
- URL 包含 logo、icon、sprite 等關鍵字
- 尺寸小於 100x100 px
- 是重複的圖片（同 hash）

### Q: 如何處理需要登入的網站？

A: 目前版本不支援登入驗證，未來可擴充 session/cookie 功能。

---

## 📊 爬取報告範例

執行完成後會產生 `crawl-report.yml`：

```yaml
crawl_report:
  target_domain: example.com
  crawl_completed: '2024-01-15T11:30:00+08:00'
  pages:
    total_found: 50
    successfully_crawled: 48
    failed: 2
    failed_urls:
      - url: https://example.com/broken
        error: 404 Not Found
  images:
    total_found: 200
    downloaded: 150
    excluded: 40
    duplicates: 10
  files_generated:
    markdown_files: 48
    yaml_config_files: 48
    image_description_files: 150
```

---

## 🔄 版本紀錄

### v1.0.0
- 初始版本
- 支援 sitemap.xml 解析
- 支援頁面內容清理與 Markdown 轉換
- 支援圖片下載與去重
- 產生 SEO/Schema.org/OG YAML 設定
