# Web Crawler 輸出檔案格式

## index.yml（SEO 設定檔）

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

---

## {image}.yml（圖片描述檔）

```yaml
filename: "hero.jpg"
description:
  alt_text: "原始 alt 文字"
  detailed: "（待 AI 分析產生詳細描述）"
source:
  original_url: "https://..."
  page_url: "https://..."
```
