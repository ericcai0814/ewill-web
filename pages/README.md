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

| 語法                  | 用途                           |
| --------------------- | ------------------------------ |
| `##### Label`         | 英文小標（轉為 section.label） |
| `## 標題`             | 主標題（轉為 section.title）   |
| `### 副標題`          | 包含在 section.content         |
| `![](assets/xxx.jpg)` | 圖片（轉為 image section）     |

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
  sections: # 由 sync-content 自動產生
    - type: text
      title: 標題
      content: 內容...
    - type: image
      image_id: feature_image

aio: # AI Optimization（Schema.org）
  webpage:
    type: ProductPage
    name: 頁面名稱
```

### 圖片描述檔（\*.yml）

每張圖片需對應一個 `.yml` 描述檔：

```yaml
id: product_banner # 必要：唯一識別碼
alt: 產品橫幅圖 # 必要：替代文字
description: > # 必要：詳細描述
  產品橫幅，藍色背景，
  顯示產品主要功能特色。
```

## 工作流程

### 編輯內容

**方式 A：直接編輯 yml（簡單）**

```
1. 編輯 index.yml 的 layout.sections
2. git commit
```

**方式 B：透過 md 同步（選配，適合大量內容）**

```
1. 編輯 index.md
2. 執行 sync-content 轉換
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

| type    | 說明                                 |
| ------- | ------------------------------------ |
| `text`  | 文字區塊（含 label、title、content） |
| `image` | 圖片區塊（引用 image_id）            |

### 手動配置（在 yml 編輯）

| type           | 說明                 |
| -------------- | -------------------- |
| `anchor`       | 錨點區塊（含 cards） |
| `cta`          | 行動呼籲按鈕         |
| `card_list`    | 卡片列表             |
| `feature_grid` | 功能格狀展示         |

> 含手動類型的頁面不會被 `sync-content` 修改

## 圖片路徑格式

| 來源     | 格式               | 說明     |
| -------- | ------------------ | -------- |
| 手動編輯 | `assets/xxx.jpg`   | 標準格式 |
| 爬蟲產生 | `./images/xxx.jpg` | 自動轉換 |

兩種格式都會對應到 `assets/` 目錄，由 `sync-content` 自動處理。

## sync-content 實作規格（選配）

> **此功能為選配**，非必要實作。偏好直接編輯 `index.yml`，可跳過此機制。
> 適用場景：頁面數量多、需頻繁更新內容、希望以 Markdown 作為內容編輯介面。

以下為 md → yml 轉換的完整規格，供 AI Agent 自行判斷是否需要實作。

### 輸入輸出範例

**輸入：index.md**

```markdown
##### About Us

## 公司簡介

鎰威科技專注於推動企業數位轉型...

### 核心價值

我們秉持專業、效率、信任的精神。

![](assets/about_us_1.png)

##### Milestones

## 公司沿革

2010 年成立至今...

![](assets/timeline.png)
```

**輸出：index.yml 的 layout.sections**

```yaml
layout:
  sections:
    - type: text
      label: About Us
      title: 公司簡介
      content: |
        鎰威科技專注於推動企業數位轉型...

        ### 核心價值

        我們秉持專業、效率、信任的精神。
    - type: image
      image_id: about_us_1
    - type: text
      label: Milestones
      title: 公司沿革
      content: |
        2010 年成立至今...
    - type: image
      image_id: timeline
```

### 解析規則

| Markdown 語法 | 解析行為                                       |
| ------------- | ---------------------------------------------- |
| `##### Label` | 設定下一個 text section 的 `label`，觸發 flush |
| `## 標題`     | 設定 `title`，觸發 flush（`###` 除外）         |
| `### 副標題`  | 累積到 `content`                               |
| `#### 說明`   | 累積到 `content`                               |
| `![](path)`   | 建立 image section，觸發 flush                 |
| 其他文字      | 累積到 `content`                               |

**flush 行為**：當遇到新的 `#####`、`##` 或圖片時，將累積的 label/title/content 打包成一個 text section。

### 解析流程（偽代碼）

```python
def parse_markdown(md_content, page_path):
    sections = []
    current_label = None
    current_title = None
    current_content = []

    def flush_text_section():
        nonlocal current_label, current_title, current_content
        content = "\n".join(current_content).strip()
        if current_title or content:
            section = {"type": "text", "content": content}
            if current_label:
                section["label"] = current_label
            if current_title:
                section["title"] = current_title
            sections.append(section)
        current_label = None
        current_title = None
        current_content = []

    for line in md_content.split("\n"):
        # 圖片
        match = re.match(r'!\[.*?\]\(([^)]+)\)', line)
        if match:
            flush_text_section()
            image_id = resolve_image_id(page_path, match.group(1))
            sections.append({"type": "image", "image_id": image_id})
            continue

        # ##### label
        if line.startswith("#####") and not line.startswith("######"):
            flush_text_section()
            current_label = re.sub(r'^#+\s*', '', line).strip()
            continue

        # ## title（但不是 ###）
        if re.match(r'^##\s', line) and not line.startswith("###"):
            if current_title:
                flush_text_section()
            current_title = re.sub(r'^##\s*', '', line).strip()
            continue

        # ### 或 #### 副標題 → content
        if line.startswith("###"):
            current_content.append(line)
            continue

        # 其他 → content
        current_content.append(line)

    flush_text_section()
    return sections
```

### 圖片 ID 解析

```python
def resolve_image_id(page_path, image_path):
    # 1. 正規化路徑
    normalized = image_path
    normalized = re.sub(r'^\./', '', normalized)    # ./assets/x.jpg → assets/x.jpg
    normalized = re.sub(r'^assets/', '', normalized) # assets/x.jpg → x.jpg
    normalized = re.sub(r'^images/', '', normalized) # images/x.jpg → x.jpg

    # 2. 查找描述檔取得 id
    yml_paths = [
        f"{page_path}/assets/{normalized}.yml",           # x.jpg.yml
        f"{page_path}/assets/{Path(normalized).stem}.yml" # x.yml
    ]
    for yml_path in yml_paths:
        if os.path.exists(yml_path):
            data = yaml.safe_load(open(yml_path))
            if data and data.get("id"):
                return data["id"]

    # 3. Fallback：檔名轉 ID
    fallback = Path(normalized).stem                    # 移除副檔名
    fallback = re.sub(r'[^a-zA-Z0-9_]', '_', fallback)  # 特殊字元 → _
    return fallback.lower()
```

### 同步策略

```python
MANUAL_TYPES = ["anchor", "cta", "card_list", "feature_grid",
                "product_intro", "feature_showcase", "timeline",
                "gallery", "contact_form"]

def sync_page(page_name):
    yml_path = f"pages/{page_name}/index.yml"
    md_path = f"pages/{page_name}/index.md"

    # 1. 讀取現有 sections
    yml_data = yaml.safe_load(open(yml_path))
    existing = yml_data.get("layout", {}).get("sections", [])

    # 2. 檢查是否含手動類型 → 跳過保護
    if any(s["type"] in MANUAL_TYPES for s in existing):
        print(f"跳過 {page_name}：含手動 sections")
        return

    # 3. 解析 md
    md_content = open(md_path).read()
    new_sections = parse_markdown(md_content, f"pages/{page_name}")

    # 4. 比較並更新
    if new_sections != existing:
        yml_data.setdefault("layout", {})["sections"] = new_sections
        yaml.dump(yml_data, open(yml_path, "w"), allow_unicode=True)
        print(f"已更新 {page_name}")
```

### 注意事項

1. **保留手動區塊**：含 `anchor`、`cta` 等手動類型的頁面完全跳過，避免覆蓋設計
2. **YAML 格式**：輸出時保持 `content` 為多行字串（使用 `|`）
3. **空白處理**：content 前後空白需 trim，但內部換行保留
4. **編碼**：確保 UTF-8 編碼，支援中文

## 常用指令

| 指令                      | 用途             | 必要性 |
| ------------------------- | ---------------- | ------ |
| `/gen_image_meta`         | 生成圖片描述檔   | 建議   |
| `/check_assets`           | 檢查圖片完整性   | 建議   |
| `sync-content`            | 同步 md → yml    | 選配   |
| `sync-content --page=xxx` | 同步特定頁面     | 選配   |
| `sync-content --check`    | 檢查是否需要同步 | 選配   |

## 備註

本文件為 `pages/` 目錄的完整使用手冊，包含：

- 目錄結構與檔案格式
- 工作流程
- sync-content 實作規格（供 AI Agent 參考）
