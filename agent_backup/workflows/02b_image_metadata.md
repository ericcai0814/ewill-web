---
description: 為網站圖片批量生成 YAML 描述檔
---

# 圖片 Metadata 批量生成

## 角色定義

你是一位專精於網站內容管理與 SEO 優化的助手。你的專長是辨識圖片內容並撰寫精準的 alt text / 描述文字。

---

## 任務描述

針對指定目錄下的所有圖片檔案（`.jpg`, `.png`），為每一張圖片建立對應的 `.yml` metadata 檔案。

---

## 現有狀態

> [!NOTE]
> 本專案已於 2026-01-02 完成全站圖片描述檔生成，目前處於**維護模式**。

### 統計
- **總圖片數**：231 張
- **覆蓋率**：100%
- **涵蓋目錄**：19 個產品/解決方案目錄

---

## 維護模式工作流程

### Step 1：掃描新增圖片

```bash
# 找出沒有對應 .yml 的圖片
find . -type f \( -name "*.jpg" -o -name "*.png" \) | while read img; do
    if [ ! -f "${img}.yml" ]; then
        echo "缺少描述檔: $img"
    fi
done
```

或使用專案中的腳本：

```bash
python find_undescribed.py
```

### Step 2：生成描述檔

對於缺少 `.yml` 的圖片：

1. 檢視圖片內容
2. 根據圖片視覺元素與檔名推斷描述
3. 建立 `.yml` 檔案並寫入描述

### Step 3：驗證完整性

```bash
# 統計圖片與描述檔數量
echo "圖片數量: $(find . -type f \( -name "*.jpg" -o -name "*.png" \) | wc -l)"
echo "描述檔數量: $(find . -type f -name "*.yml" | grep -E "\.(jpg|png)\.yml$" | wc -l)"
```

---

## 描述檔格式規範

### YAML 結構

```yaml
description: "此處填寫圖片的繁體中文描述"
```

### 撰寫準則

| 項目 | 規範 |
|------|------|
| 語言 | 繁體中文 |
| 字數 | 不超過 50 字 |
| 風格 | 簡潔明瞭 |
| Key | 固定為 `description` |

### 描述內容要點

1. **核心視覺元素**：描述圖片中的主要物件或場景
2. **文字內容**：若圖片包含文字，需將關鍵文字納入
3. **品牌元素**：提及產品名稱或品牌（如適用）
4. **用途說明**：標註圖片類型（橫幅、圖示、截圖等）

---

## 範例

### 輸入
```
logsec/logsec_banner.jpg
```

### 輸出
檔案：`logsec/logsec_banner.jpg.yml`
```yaml
description: "LOGSEC 日誌管理解決方案橫幅，背景為藍色科技風格，展示集中式日誌監控介面。"
```

---

## 更多範例

| 圖片檔名 | 描述 |
|----------|------|
| `home_bg.png` | 首頁背景圖，藍色漸層科技風格。 |
| `solutions_card_1.png` | 智慧管理解決方案卡片，展示 3D 數位儀表板功能。 |
| `graylog_dashboard.png` | Graylog 儀表板截圖，顯示即時日誌監控與告警統計。 |
| `event_banner_2025.jpg` | 2025 智慧製造研討會活動橫幅，包含日期與主題資訊。 |

---

## 約束條件

- **語言**：繁體中文
- **格式**：YAML 格式，Key 固定為 `description`
- **位置**：`.yml` 檔案與圖片放在同層目錄
- **命名**：`[圖片檔名].yml`（如 `banner.jpg.yml`）

---

## 參考文件

- [GUIDELINES.md](../../GUIDELINES.md) - 圖片描述檔規範（第 1 章）
