# 內容一致性稽核報告

> **稽核日期**: 2026-01-14
> **更新日期**: 2026-01-14
> **稽核範圍**: 37 個頁面、341 個圖片資源

---

## 摘要

| 檢查項目 | 狀態 | 問題數 |
|----------|:----:|:------:|
| image_id 引用一致性 | ⚠️ | 1 |
| Section Type 一致性 | ✓ | 0 |
| Assets 描述檔完整性 | ⚠️ | 105 |
| Content Build | ✓ | 0 |
| Astro Build | ✓ | 0 |

**總體結論**: 可正常建置，僅有少量資源引用問題。

---

## 問題清單

### 1. 缺失的 image_id（1 個）

以下 image_id 在 yml 中被引用，但不存在於 asset-manifest.json：

| image_id | 引用頁面 | 引用位置 |
|----------|----------|----------|
| `array_1_fix` | array | line 137 |

**建議修復**:
1. 下載對應的圖片資源到 `pages/array/assets/` 目錄
2. 建立對應的 `.yml` 描述檔
3. 或更新 yml 引用正確的 image_id

---

### 2. 重複的 yml 描述檔（105 個）

同時存在 `image.jpg.yml` 和 `image.yml` 兩種格式：

**範例**:
```
pages/bitdefender/assets/
├── bitdefender_1.jpg
├── bitdefender_1.jpg.yml  ← 正確格式
└── bitdefender_1.yml      ← 應刪除（舊格式）
```

**影響**: 無直接影響，但造成目錄混亂。

**建議修復**:
```bash
# 預覽要刪除的檔案
find pages/*/assets -name "*.yml" ! -name "*.*.yml" | head -20

# 確認後刪除
find pages/*/assets -name "*.yml" ! -name "*.*.yml" -delete
```

---

### 3. Section Type 使用狀況

**目前使用的 Layout Section Types**:

| Type | 使用次數 | 說明 |
|------|:--------:|------|
| `image` | 50 | 圖片區塊 |
| `product_intro` | 30 | 產品介紹（hero + 描述） |
| `feature_showcase` | 29 | 功能展示（圖文並排） |
| `cta` | 26 | Call to Action 按鈕 |
| `text` | 23 | 純文字內容 |
| `feature_grid` | 15 | 功能網格（多欄卡片） |
| `gallery` | 6 | 圖片輪播 |
| `anchor` | 6 | 錨點導航區塊 |
| `hero_banner` | 5 | Hero Banner |
| `card_list` | 3 | 卡片列表 |
| `contact_form` | 1 | 聯絡表單 |

**結論**: 所有使用中的 type 都已在 Astro 元件中實作，無問題。

---

## 建置結果

| 建置步驟 | 結果 | 說明 |
|----------|:----:|------|
| Content Build | ✓ | 38 頁面、341 資源 |
| Astro Build | ✓ | 36 頁面（排除 header/footer） |

---

## sync-content 保護機制

sync-content 會自動跳過含手動 sections 的頁面：

- **可同步類型**: `text`, `image`
- **手動類型（受保護）**: `product_intro`, `feature_showcase`, `cta`, `feature_grid`, `gallery`, `anchor`, `card_list`, `contact_form`

若頁面 yml 包含任何手動類型，sync-content 會完全跳過該頁面，保護精心設計的佈局不被覆蓋。

---

## 建議後續行動

### 優先級 P1（影響顯示）

1. **修復 1 個缺失的 image_id**
   - 檢查 `pages/array/index.yml` line 137
   - 確認 `array_1_fix` 圖片是否存在，或更新為正確的 image_id

### 優先級 P2（程式碼整潔）

2. **清理 105 個重複的 yml 檔案**
   ```bash
   # 預覽要刪除的檔案
   find pages/*/assets -name "*.yml" ! -name "*.*.yml" | head -20

   # 確認後刪除
   find pages/*/assets -name "*.yml" ! -name "*.*.yml" -delete
   ```

---

## 附錄：稽核命令

```bash
# 檢查缺失的 image_id
comm -23 \
  <(grep -roh "image_id: [a-zA-Z0-9_]*" pages/*/index.yml | sed 's/image_id: //' | sort | uniq) \
  <(cat astro-app/public/asset-manifest.json | python3 -c "import json,sys; d=json.load(sys.stdin); print('\n'.join(sorted([a['id'] for a in d['assets']])))")

# 檢查 section types 使用狀況
grep -roh "type: [a-zA-Z_]*" pages/*/index.yml | sed 's/type: //' | sort | uniq -c | sort -rn

# 檢查重複的 yml 檔案
find pages/*/assets -name "*.yml" ! -name "*.*.yml" | wc -l
```
