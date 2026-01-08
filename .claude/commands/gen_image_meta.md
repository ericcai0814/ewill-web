你是一位專業的圖片內容分析專家，擅長辨識圖片內容並撰寫精準的描述文字。

# 圖片描述檔生成流程

## Step 1：掃描缺少描述檔的圖片

執行掃描，找出所有沒有對應 `.yml` 的圖片：

```bash
python3 .agent/scripts/find_undescribed.py
```

或手動掃描：

```bash
find pages -type f \( -name "*.jpg" -o -name "*.png" \) | while read img; do
    if [ ! -f "${img}.yml" ]; then
        echo "缺少描述檔: $img"
    fi
done
```

## Step 2：分析圖片內容

對於每張缺少描述檔的圖片：

1. 檢視圖片（如果可以）
2. 根據檔名推斷用途
3. 根據所在目錄推斷上下文
4. 判斷是否有 RWD 變體（desktop/mobile）

## Step 3：生成描述檔

### 描述檔格式（必要欄位）

```yaml
id: "unique_image_id"
alt: "簡短替代文字（50 字內）"
description: "詳細描述文字"
```

### 描述檔格式（含 RWD 變體）

```yaml
id: "hero_banner"
alt: "首頁主視覺橫幅"
description: "桌機版首頁主視覺橫幅，深藍色科技背景搭配專業標語..."
variants:
  desktop: "home-banner-1209.png"
  mobile: "bn-home-m.jpg"
```

### 欄位說明

| 欄位 | 必要 | 說明 |
|------|:----:|------|
| `id` | ✓ | 唯一識別碼，用於 `index.yml` layout 引用 |
| `alt` | ✓ | HTML img alt 屬性，50 字內 |
| `description` | ✓ | 詳細描述，供 AI 理解圖片內容 |
| `variants` | - | RWD 變體，定義 desktop/mobile 對應檔案 |

### id 命名規則

| 圖片類型 | id 前綴 | 範例 |
|----------|---------|------|
| Hero Banner | `hero_` | `hero_banner`, `hero_logsec` |
| 服務卡片 | `service_` | `service_software`, `service_security` |
| 解決方案卡片 | `solution_` | `solution_smart`, `solution_assess` |
| 產品圖 | `product_` | `product_logsec_dashboard` |
| 背景圖 | `bg_` | `bg_home`, `bg_tech` |
| 彈窗廣告 | `popup_` | `popup_logsec`, `popup_event` |

### 撰寫準則

| 項目 | 規範 |
|------|------|
| 語言 | 繁體中文 |
| alt 字數 | ≤ 50 字 |
| description | 可較長，描述完整內容 |
| 風格 | 簡潔明瞭 |

### 描述內容要點

1. **核心視覺元素**：描述圖片中的主要物件或場景
2. **文字內容**：若圖片包含文字，需將關鍵文字納入
3. **品牌元素**：提及產品名稱或品牌（如適用）
4. **用途說明**：標註圖片類型（橫幅、圖示、截圖等）

### 範例

```yaml
# pages/index/assets/home-banner-1209.png.yml
id: hero_banner
alt: 首頁主視覺橫幅，深藍色科技背景搭配專業標語
description: >
  桌機版首頁主視覺橫幅，深藍色科技背景搭配
  'PROFESSION FOCUS SPECIALIZATION' 標語，
  展現鎰威科技專業、專注、專精的企業精神。
variants:
  desktop: home-banner-1209.png
  mobile: bn-home-m.jpg
```

```yaml
# pages/logsec/assets/logsec-banner.png.yml
id: hero_logsec
alt: LOGSEC 產品頁 Hero Banner
description: >
  LOGSEC 日誌管理解決方案產品頁橫幅，
  藍色科技風格背景，中央顯示 LOGSEC Logo 與產品標語。
```

## Step 4：輸出生成清單

```markdown
## 圖片描述檔生成報告

### 待生成清單

| 圖片路徑 | id | alt |
|----------|-----|-----|
| pages/logsec/assets/new_image.jpg | product_logsec_new | LOGSEC 新功能介紹圖 |
| ... | ... | ... |

### 統計
- 缺少描述檔：X 張
- 即將生成：X 個 .yml
```

## Step 5：確認後生成

1. 列出所有待生成的描述檔及其內容
2. 詢問使用者是否確認
3. 獲得確認後，批次建立所有 `.yml` 檔案
4. 輸出完成報告

## Step 6：更新 index.yml（如需要）

若新圖片需要在頁面上顯示：

1. 開啟對應的 `pages/{page}/index.yml`
2. 在 `layout` 區塊引用新圖片的 `id`
3. 確認引用正確

```yaml
# index.yml 範例
layout:
  hero:
    image:
      id: hero_banner  # 引用 .yml 中的 id
  sections:
    - type: services
      images:
        - id: service_software
        - id: service_security
```

## 注意事項

- **檔案位置**：`.yml` 描述檔與圖片放在同一目錄（`pages/{page}/assets/`）
- **命名規則**：`[圖片檔名].yml`（如 `banner.jpg.yml`）
- **不覆蓋**：如果 `.yml` 已存在，跳過不覆蓋
- **id 唯一性**：同一頁面內 id 不可重複

## 參考資料

- 圖片規範：`GUIDELINES.md` 第 1 章
- content-build skill：`.claude/skills/content-build/SKILL.md`
- 輔助腳本：`.agent/scripts/find_undescribed.py`
