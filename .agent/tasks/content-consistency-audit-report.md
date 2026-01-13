# 內容一致性稽核報告

> **稽核日期**: 2026-01-14
> **稽核範圍**: 38 個頁面、341 個圖片資源

---

## 摘要

| 檢查項目 | 狀態 | 問題數 |
|----------|:----:|:------:|
| image_id 引用一致性 | ⚠️ | 11 |
| Section Type 一致性 | ✓ | 0 |
| Assets 描述檔完整性 | ⚠️ | 105 |
| Content Build | ✓ | 0 |
| Astro Build | ✓ | 0 |

**總體結論**: 可正常建置，但有資源引用問題需修復。

---

## 問題清單

### 1. 缺失的 image_id（11 個）

以下 image_id 在 yml 中被引用，但不存在於 asset-manifest.json：

| image_id | 引用頁面 | 引用位置 |
|----------|----------|----------|
| `array_1_fix` | array | line 183 |
| `bn_acu_1209_scaled` | acunetix | line 87 |
| `bn_acunetix_m_fix` | acunetix | line 89 |
| `bn_home_m` | event_information, index | lines 29, 32 |
| `bn_ist_1209_scaled` | ist | line 93 |
| `bn_ist_m_fix` | ist | line 95 |
| `bn_sec_1209_scaled` | security_scorecard | line 85 |
| `bn_securityscorecard_m_fix` | security_scorecard | line 87 |
| `bn_solutions_m` | solutions | line 36 |
| `bn_vmware_1209_scaled` | vmware | line 98 |
| `bn_vmware_m_fix` | vmware | line 100 |

**影響**: 這些頁面的 hero 或 image section 可能顯示不正確。

**建議修復**:
1. 下載對應的圖片資源到 assets 目錄
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
# 刪除所有舊格式 yml（不含副檔名的）
find pages/*/assets -name "*.yml" ! -name "*.jpg.yml" ! -name "*.png.yml" -delete
```

---

### 3. Section Type 使用狀況

**目前使用的 types**:
- `text`: 37 頁
- `image`: 35 頁

**已實作但未使用的 types**:
- `card_list`, `anchor`, `feature_grid`, `cta`
- `product_intro`, `feature_showcase`, `timeline`, `gallery`
- `contact_form`

**結論**: 所有使用中的 type 都已實作，無問題。

---

## 建置結果

| 建置步驟 | 結果 | 說明 |
|----------|:----:|------|
| Content Build | ✓ | 38 頁面、341 資源 |
| Astro Build | ✓ | 36 頁面（排除 header/footer） |

---

## 建議後續行動

### 優先級 P1（影響顯示）

1. **修復 11 個缺失的 image_id**
   - 從原網站下載對應圖片
   - 或更新 yml 使用現有的替代圖片

### 優先級 P2（程式碼整潔）

2. **清理 105 個重複的 yml 檔案**
   ```bash
   # 預覽要刪除的檔案
   find pages/*/assets -name "*.yml" ! -name "*.*.yml" | head -20

   # 確認後刪除
   find pages/*/assets -name "*.yml" ! -name "*.*.yml" -delete
   ```

### 優先級 P3（維護性）

3. **建立自動化檢查腳本**
   - 加入 pre-commit hook
   - 在 CI/CD 流程中檢查

---

## 附錄：稽核命令

```bash
# 檢查缺失的 image_id
comm -23 <(grep -roh "image_id: [a-zA-Z0-9_]*" pages/*/index.yml | sed 's/image_id: //' | sort | uniq) <(cat astro-app/public/asset-manifest.json | python3 -c "import json,sys; d=json.load(sys.stdin); print('\n'.join(sorted([a['id'] for a in d['assets']])))")

# 檢查 section types
python3 -c "..." # 見 content-consistency-audit.md
```
