---
name: web-crawler
description: "標準化網站爬蟲工具，用於備份網站內容、轉換為 Markdown、下載圖片、產生 SEO 設定。當需要爬取網站、備份網頁、擷取網站內容、網站遷移時使用此工具。"
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

## ⚠️ 重要：分階段執行流程

此工具採用**分階段確認機制**，確保產出品質符合使用者預期。

**執行流程：**
```
Step 1: 詢問目標網址
    ↓
Step 2: 先爬首頁（預覽模式）
    ↓
Step 3: 展示預覽結果給使用者確認
    ↓
Step 4: 使用者確認 → 若不符合預期，詢問調整需求
    ↓
Step 5: 確認 OK 後，繼續爬取全站
```

---

## 何時使用此工具

當使用者的需求符合以下情況時，**必須使用此工具**：

- ✅ 備份整個網站內容
- ✅ 將網站頁面轉換為 Markdown 格式
- ✅ 下載網站的主要內容圖片
- ✅ 產生 SEO / Schema.org / Open Graph 設定
- ✅ 網站遷移前的內容擷取

---

## 執行步驟（Agent 必須遵循）

### Step 1: 詢問目標網址

如果使用者沒有提供網址，先詢問：

```
請提供要爬取的網站網址（例如：example.com）
```

### Step 2: 執行預覽模式（先爬首頁）

```bash
# 安裝依賴（如果尚未安裝）
pip install requests beautifulsoup4 lxml PyYAML --break-system-packages

# 執行預覽模式（預設）
# 重要：輸出到專案根目錄
python /path/to/web-crawler/crawler.py https://目標網址 --preview -o ./
```

**輸出路徑說明：**
- 預設輸出到 `./{domain}/`（專案根目錄下的網域資料夾）
- 使用 `-o` 參數可指定輸出目錄
- 例如 `-o ./backup/` 會輸出到 `./backup/{domain}/` 資料夾

### Step 3: 展示預覽結果給使用者

爬完首頁後，**必須**向使用者展示以下內容並請求確認：

```markdown
## 🔍 首頁預覽結果

**基本資訊：**
- 目標網站：{domain}
- 發現頁面：{total_pages} 個
- 首頁圖片：{images_downloaded} 張下載 / {images_excluded} 張排除

**產生的檔案：**
- `./{domain}/index.md` - 首頁 Markdown
- `./{domain}/index.yml` - SEO 設定
- `./{domain}/images/` - 首頁圖片

---

請確認以下項目是否符合預期：

1. **內容擷取**：Markdown 內容是否正確？是否包含不需要的區塊（如廣告、導覽列）？
2. **圖片過濾**：圖片是否正確？是否漏抓主要圖片，或多抓了裝飾圖？
3. **SEO 資訊**：title、description 是否正確擷取？
4. **格式排版**：標題層級、段落分隔是否正確？

請回覆：
- ✅ **符合預期** → 我將繼續爬取全站
- ❌ **需要調整** → 請告訴我哪裡需要修改
```

### Step 4: 處理使用者回饋

**如果使用者說「符合預期」或「OK」：**
→ 進入 Step 5 繼續爬取

**如果使用者說「需要調整」：**
→ 詢問具體問題，例如：

```markdown
了解，請告訴我需要調整的地方：

1. **內容問題**：
   - 哪些區塊不應該被擷取？（請提供 class 名稱或描述）
   - 哪些內容漏掉了？

2. **圖片問題**：
   - 哪些圖片不應該下載？（請提供關鍵字）
   - 哪些圖片漏掉了？

3. **格式問題**：
   - 需要怎麼調整？

4. **其他**：
   - 還有其他需要調整的嗎？
```

根據回饋調整 `CrawlerConfig` 設定，然後重新執行預覽。

### Step 5: 繼續爬取全站

使用者確認 OK 後，執行：

```bash
python /path/to/web-crawler/crawler.py https://目標網址 --continue
```

### Step 6: 回報完成

爬取完成後，向使用者報告：

```markdown
## ✅ 爬取完成

**統計：**
- 成功頁面：{pages_crawled}/{pages_found}
- 下載圖片：{images_downloaded} 張
- 失敗頁面：{pages_failed} 個

**輸出位置：**
`./{domain}/`

**完整報告：**
`./{domain}/crawl-report.yml`
```

---

## 參數說明

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `--preview` | ✅ 預設 | 預覽模式：只爬首頁 |
| `--continue` | - | 繼續模式：爬取剩餘頁面 |
| `--full` | - | 完整模式：跳過確認，一次爬完 |
| `-o, --output` | `./` | 輸出目錄 |
| `-d, --delay` | `2.0` | 請求間隔秒數 |
| `--min-image-size` | `100` | 最小圖片尺寸 px |

---

## 調整設定的方式

如果使用者需要調整過濾規則，可以修改 `CrawlerConfig`：

### 調整圖片過濾

```python
# 新增排除關鍵字
config.excluded_image_patterns.append(r'banner')
config.excluded_image_patterns.append(r'promo')

# 調整最小尺寸
config.min_image_size = 150  # 排除小於 150px 的圖片
```

### 調整內容過濾

```python
# 新增排除的 HTML 元素
config.excluded_elements.append('section.promo')

# 新增排除的 class 關鍵字
config.excluded_classes.append('newsletter')
config.excluded_classes.append('subscribe')
```

---

## 輸出檔案格式

### index.yml（SEO 設定檔）

```yaml
seo:
  meta_title: "頁面標題"
  meta_description: "頁面描述"
  meta_keywords: [關鍵字1, 關鍵字2]
  
url:
  original: "https://old-site.com/path"
  current: "https://new-site.com/path"
  redirects: []
  
schema:
  "@type": "WebPage"
  name: "頁面名稱"
  breadcrumb: {...}
  
open_graph:
  og_type: "website"
  og_title: "分享標題"
  og_image: "./images/cover.jpg"
```

### {image}.yml（圖片描述檔）

```yaml
filename: "hero.jpg"
description:
  alt_text: "原始 alt 文字"
  detailed: "（待 AI 分析產生詳細描述）"
source:
  original_url: "https://..."
  page_url: "https://..."
```

---

## 注意事項

⚠️ **重要提醒：**

1. **必須先預覽確認** — 不要直接使用 `--full` 跳過確認
2. 遵守 `robots.txt` 規範
3. 請求間隔建議至少 2 秒
4. 不支援需要 JavaScript 渲染的 SPA 網站
5. 不支援需要登入的頁面
