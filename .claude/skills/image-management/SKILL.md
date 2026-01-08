---
name: image-management
description: 管理圖片資源與描述檔。當新增圖片、處理圖片路徑、或詢問圖片相關問題時自動觸發，確保遵循 assets/ 目錄結構規範。
---

# 圖片資源管理規則

本專案所有圖片必須遵循統一的目錄結構與描述檔規範。

## 目錄結構

所有模組（包含首頁）都遵循相同結構：

```
{module}/
├── index.md
├── index.yml
└── assets/
    ├── image.jpg
    ├── image.jpg.yml
    └── ...
```

## 規範要點

### 圖片存放
- 圖片必須存放於 `assets/` 子目錄
- **不允許**圖片直接放在模組根目錄

### 描述檔 (.yml)
- 每張圖片**必須**有對應的 `.yml` 描述檔
- 檔名格式：`{圖片檔名}.yml`（如 `banner.jpg.yml`）
- 必要欄位：`description`
- 語言：繁體中文
- 字數：不超過 50 字

### 描述檔格式

```yaml
description: "圖片描述，簡潔說明核心視覺元素與傳達訊息"
```

### 圖片引用格式

在 `index.md` 中引用圖片：

```markdown
![](assets/banner.jpg)
```

## 檢查缺少描述檔的圖片

```bash
python3 scripts/find_undescribed.py

# 掃描指定目錄
python3 scripts/find_undescribed.py logsec/
```

## 新增圖片流程

1. 將圖片放入 `{module}/assets/` 目錄
2. **立即**建立對應的 `.yml` 描述檔
3. 在 `index.md` 中使用 `assets/` 路徑引用
4. 執行 `find_undescribed.py` 驗證完整性

