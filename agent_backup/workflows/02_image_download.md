---
description: 生成使用 curl/wget 的圖片下載腳本
---

# 圖片下載腳本生成

## 角色定義

你是一位熟悉 Shell 腳本與網頁爬蟲的自動化工程師。你擅長使用 `curl`、`wget` 等工具批量下載網路資源。

---

## 任務描述

針對指定網頁，生成可執行的圖片下載腳本。

> [!CAUTION]
> **不直接執行下載**，僅生成腳本供人工審核後執行。

---

## 工作流程

### Step 1：分析網頁 HTML
提取所有 `<img>` 標籤的 `src` 屬性。

```python
from bs4 import BeautifulSoup
import requests

def extract_images(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    images = []
    for img in soup.find_all('img'):
        src = img.get('src')
        if src:
            images.append(src)
    return images
```

### Step 2：過濾圖片

排除版面裝飾圖，保留主要內容圖片。

**過濾規則（排除）：**

| 條件 | 說明 |
|------|------|
| 檔名包含 | `icon`, `logo`, `bg`, `pattern`, `sprite` |
| 尺寸限制 | 小於 100x100 像素 |
| 路徑包含 | `/assets/icons/`, `/images/ui/` |

### Step 3：生成 Shell 腳本

將圖片下載到與對應 `.md` 檔案相同的目錄。

---

## 輸出格式

```bash
#!/bin/bash
# ============================================================
# 自動生成的圖片下載腳本
# 目標頁面: [頁面 URL]
# 生成時間: [時間戳記]
# ============================================================

# 目標目錄（與 .md 檔案同層）
TARGET_DIR="./logsec"
mkdir -p "$TARGET_DIR"

echo "開始下載圖片..."
echo "目標目錄: $TARGET_DIR"
echo ""

# 下載圖片（支援斷點續傳）
download_image() {
    local url="$1"
    local filename="$2"
    
    if [ -f "$TARGET_DIR/$filename" ]; then
        echo "⏭️  $filename 已存在，跳過"
        return
    fi
    
    curl -L -C - -o "$TARGET_DIR/$filename" "$url" && \
        echo "✓ $filename" || \
        echo "✗ $filename 下載失敗"
}

# 圖片清單
download_image "https://example.com/image1.jpg" "image1.jpg"
download_image "https://example.com/image2.png" "image2.png"

echo ""
echo "下載完成！"
echo "請檢查 $TARGET_DIR 目錄"
```

---

## 腳本功能需求

### 必要功能
- [x] 進度顯示（成功 ✓ / 失敗 ✗ / 跳過 ⏭️）
- [x] 錯誤處理
- [x] 斷點續傳（`curl -C -` 或 `wget -c`）
- [x] 跳過已存在的檔案

### 選用功能
- [ ] 並行下載（使用 `xargs -P`）
- [ ] 自動重試（失敗後重試 3 次）
- [ ] 日誌輸出到檔案

---

## 目錄結構遵循

> [!IMPORTANT]
> 圖片必須下載到與 `.md` 檔案同層目錄，不使用 `images/` 子目錄。

```
/logsec/
├── index.md              # 頁面內容
├── index.yml             # 技術參數
├── banner.jpg            # ← 圖片放這裡
├── banner.jpg.yml        # ← 描述檔
├── dashboard.png
└── dashboard.png.yml
```

---

## 約束條件

- **不直接執行下載**，僅生成腳本
- 腳本需包含完整註解
- 支援 macOS 與 Linux
- 使用 `curl` 或 `wget`（優先 `curl`）
