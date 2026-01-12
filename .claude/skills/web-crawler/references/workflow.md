# Web Crawler 完整工作流程

## 分階段執行流程

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
    ↓
Step 6: 回報完成
```

---

## Step 1: 詢問目標網址

如果使用者沒有提供網址，先詢問：

```
請提供要爬取的網站網址（例如：example.com）
```

---

## Step 2: 執行預覽模式（先爬首頁）

```bash
# 安裝依賴（如果尚未安裝）
pip install requests beautifulsoup4 lxml PyYAML --break-system-packages

# 執行預覽模式
python .claude/skills/web-crawler/crawler.py https://目標網址 --preview -o ./
```

**輸出路徑說明：**
- 預設輸出到 `./{domain}/`（專案根目錄下的網域資料夾）
- 使用 `-o` 參數可指定輸出目錄

---

## Step 3: 展示預覽結果給使用者

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

1. **內容擷取**：Markdown 內容是否正確？
2. **圖片過濾**：圖片是否正確？
3. **SEO 資訊**：title、description 是否正確？
4. **格式排版**：標題層級、段落分隔是否正確？

請回覆：
- ✅ **符合預期** → 我將繼續爬取全站
- ❌ **需要調整** → 請告訴我哪裡需要修改
```

---

## Step 4: 處理使用者回饋

**如果使用者說「符合預期」或「OK」：**
→ 進入 Step 5 繼續爬取

**如果使用者說「需要調整」：**
→ 詢問具體問題：

```markdown
了解，請告訴我需要調整的地方：

1. **內容問題**：哪些區塊不應該被擷取？哪些內容漏掉了？
2. **圖片問題**：哪些圖片不應該下載？哪些圖片漏掉了？
3. **格式問題**：需要怎麼調整？
4. **其他**：還有其他需要調整的嗎？
```

根據回饋調整設定後重新執行預覽。

---

## Step 5: 繼續爬取全站

使用者確認 OK 後，執行：

```bash
python .claude/skills/web-crawler/crawler.py https://目標網址 --continue
```

---

## Step 6: 回報完成

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
