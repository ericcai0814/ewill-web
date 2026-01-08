---
description: 解析網頁資料流並將圖文按正確順序整合到 Markdown
---

# 圖文按資料流排序整合

## 角色定義

你是一位精通網頁內容解析與文件生成的自動化專家。你能夠解析網頁的 DOM 結構，提取圖文內容，並按照原始順序重組為 Markdown 文件。

---

## 任務描述

更新每個頁面的 `.md` 檔案，將已下載的圖片嵌入到正確的位置。

---

## 工作流程

### Step 1：解析原始網頁

使用 Python 腳本解析網頁 DOM 結構，提取內容順序。

### Step 2：提取內容元素

| 元素類型 | 提取內容           |
| -------- | ------------------ |
| 標題     | `<h1>` ~ `<h6>`    |
| 段落     | `<p>` 文字內容     |
| 圖片     | `<img>` src 與 alt |
| 列表     | `<ul>`, `<ol>`     |
| 表格     | `<table>`          |

### Step 3：建立內容索引

根據 DOM 順序建立內容順序索引。

### Step 4：整合本地圖片

將本地圖片路徑嵌入對應位置（圖片存放於 `assets/` 子目錄）。

### Step 5：輸出 Markdown

生成更新後的 `.md` 檔案。

---

## Python 腳本

```python
#!/usr/bin/env python3
"""content_flow_parser.py - 解析網頁資料流並生成 Markdown"""
from bs4 import BeautifulSoup
from pathlib import Path
import yaml


def parse_content_flow(html_path):
    """解析 HTML 檔案，提取內容區塊"""
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    content_blocks = []
    main_content = soup.find('main') or soup.find('article') or soup.body

    for element in main_content.descendants:
        if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            content_blocks.append({
                'type': 'heading',
                'level': element.name,
                'text': element.get_text().strip()
            })
        elif element.name == 'p':
            text = element.get_text().strip()
            if text:
                content_blocks.append({
                    'type': 'paragraph',
                    'text': text
                })
        elif element.name == 'img':
            content_blocks.append({
                'type': 'image',
                'src': element.get('src'),
                'alt': element.get('alt', '')
            })
        elif element.name == 'li':
            text = element.get_text().strip()
            if text:
                content_blocks.append({
                    'type': 'list_item',
                    'text': text
                })

    return content_blocks


def load_image_description(assets_dir, image_filename):
    """從 assets/ 目錄讀取圖片描述"""
    yml_path = assets_dir / f"{image_filename}.yml"
    if yml_path.exists():
        with open(yml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            return data.get('description', '')
    return ''


def generate_markdown(content_blocks, output_path, page_dir):
    """
    生成 Markdown，圖片路徑使用 assets/ 子目錄

    Args:
        content_blocks: 內容區塊列表
        output_path: 輸出檔案路徑
        page_dir: 頁面目錄路徑
    """
    assets_dir = page_dir / "assets"
    lines = []

    for block in content_blocks:
        if block['type'] == 'heading':
            level = int(block['level'][1])
            lines.append(f"{'#' * level} {block['text']}")
            lines.append("")

        elif block['type'] == 'paragraph':
            lines.append(block['text'])
            lines.append("")

        elif block['type'] == 'image':
            # 取得圖片檔名
            image_filename = Path(block['src']).name
            local_path = assets_dir / image_filename

            # 從 assets/ 目錄的 .yml 讀取描述
            alt = (load_image_description(assets_dir, image_filename)
                   or block['alt']
                   or image_filename)

            # 檢查圖片是否存在
            if local_path.exists():
                # 使用相對路徑（assets/ 子目錄）
                lines.append(f"![{alt}](assets/{image_filename})")
            else:
                lines.append(f"[圖片缺失: {image_filename}]")
            lines.append("")

        elif block['type'] == 'list_item':
            lines.append(f"- {block['text']}")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


if __name__ == "__main__":
    # 使用範例
    page_dir = Path('logsec')  # 頁面目錄

    blocks = parse_content_flow('logsec.html')
    generate_markdown(blocks, page_dir / 'index.md', page_dir)

    print(f"已生成: {page_dir / 'index.md'}")
```

---

## 檔案結構

> [!IMPORTANT]
> 圖片存放於 `assets/` 子目錄，與 `.md` 檔案分離。

```
/logsec/
├── index.md              # 主要內容
├── index.yml             # 技術參數
└── assets/               # 圖片資源目錄
    ├── banner.jpg        # 圖片
    ├── banner.jpg.yml    # 圖片描述
    ├── dashboard.png
    └── dashboard.png.yml
```

---

## 輸出格式

```markdown
# 頁面標題

第一段文字內容...

![LOGSEC 日誌管理解決方案橫幅](assets/banner.jpg)

第二段文字內容...

## 子標題

- 列表項目 1
- 列表項目 2

![Graylog 儀表板截圖](assets/dashboard.png)
```

---

## 約束條件

- **圖片路徑**：使用相對路徑（`assets/` 子目錄，格式：`assets/filename.jpg`）
- **圖片存放於 `assets/` 子目錄**
- 保持原始網頁的內容順序
- 圖片需包含 alt text（從 `assets/*.yml` 描述檔讀取）
- 若圖片不存在，以佔位符 `[圖片缺失: filename]` 標記
- **語言**：繁體中文

---

## 相關文件

- [GUIDELINES.md](../../GUIDELINES.md) - 圖片資源管理規範
- [02_image_download.md](./02_image_download.md) - 圖片下載 SOP
- [02b_image_metadata.md](./02b_image_metadata.md) - 圖片描述檔 SOP
