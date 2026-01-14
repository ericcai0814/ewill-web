# Pages 目錄說明

本目錄存放網站所有頁面的內容與資源。每個子目錄代表一個頁面。

## 目錄結構

```
pages/
├── {page_name}/
│   ├── index.md          # 頁面內容（Markdown，人工編輯）
│   ├── index.yml         # 頁面配置（SEO、layout、AIO）
│   └── assets/           # 圖片資源
│       ├── banner.jpg
│       └── banner.jpg.yml
```

## 檔案說明

### index.md（內容來源）

Markdown 格式的頁面內容，供團隊溝通與審閱。

```markdown
##### English Label

## 中文標題

段落內容...

![](assets/image.jpg)
```

| 語法 | 用途 |
|------|------|
| `##### Label` | 英文小標（轉為 section.label） |
| `## 標題` | 主標題（轉為 section.title） |
| `### 副標題` | 包含在 section.content |
| `![](assets/xxx.jpg)` | 圖片（轉為 image section） |

### index.yml（頁面配置）

```yaml
seo:
  title: '頁面標題 - 鎰威科技'
  description: '頁面描述...'
  keywords: [關鍵字1, 關鍵字2]

url_mapping:
  current_url: '/new-path/'
  old_url: '/old-path/'
  redirect: true

layout:
  hero:
    image:
      id: banner_id
  sections:        # 由 sync-content 自動產生
    - type: text
      title: 標題
      content: 內容...
    - type: image
      image_id: feature_image

aio:               # AI Optimization（Schema.org）
  webpage:
    type: ProductPage
    name: 頁面名稱
```

### 圖片描述檔（*.yml）

每張圖片需對應一個 `.yml` 描述檔：

```yaml
id: product_banner          # 必要：唯一識別碼
alt: 產品橫幅圖              # 必要：替代文字
description: >              # 必要：詳細描述
  產品橫幅，藍色背景，
  顯示產品主要功能特色。
```

## 工作流程

### 編輯內容

```
1. 編輯 index.md
2. 執行 npm run sync-content
3. 檢查 index.yml 的 layout.sections
4. git commit 兩個檔案
```

### 新增頁面

```
1. 建立目錄 pages/{page_name}/
2. 建立 index.md（內容）
3. 建立 index.yml（SEO、url_mapping、aio）
4. 上傳圖片到 assets/
5. 執行 /gen_image_meta 生成圖片描述檔
6. 執行 npm run sync-content
```

### 新增圖片

```
1. 將圖片放入 assets/
2. 建立對應的 .yml 描述檔（或執行 /gen_image_meta）
3. 在 index.md 中引用：![](assets/xxx.jpg)
4. 執行 npm run sync-content
```

## Section 類型

### 自動同步（從 md 產生）

| type | 說明 |
|------|------|
| `text` | 文字區塊（含 label、title、content） |
| `image` | 圖片區塊（引用 image_id） |

### 手動配置（在 yml 編輯）

| type | 說明 |
|------|------|
| `anchor` | 錨點區塊（含 cards） |
| `cta` | 行動呼籲按鈕 |
| `card_list` | 卡片列表 |
| `feature_grid` | 功能格狀展示 |

> 含手動類型的頁面不會被 `sync-content` 修改

## 圖片路徑格式

| 來源 | 格式 | 說明 |
|------|------|------|
| 手動編輯 | `assets/xxx.jpg` | 標準格式 |
| 爬蟲產生 | `./images/xxx.jpg` | 自動轉換 |

兩種格式都會對應到 `assets/` 目錄，由 `sync-content` 自動處理。

## 常用指令

| 指令 | 用途 |
|------|------|
| `npm run sync-content` | 同步 md → yml |
| `npm run sync-content -- --page=xxx` | 同步特定頁面 |
| `npm run sync-content -- --check` | 檢查是否需要同步 |
| `/gen_image_meta` | 生成圖片描述檔 |
| `/check_assets` | 檢查圖片完整性 |

## 相關文件

- [GUIDELINES.md](../GUIDELINES.md) - 完整開發規範
- [content-guide.md](../.agent/tasks/specs/content-guide.md) - 內容填充指南
- [README.md](../README.md) - 專案總覽
