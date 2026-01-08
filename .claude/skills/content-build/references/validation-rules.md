# Validation Rules

本文件定義 UI 驗證規則，與框架無關。具體實作方式請參考 `implementations/` 目錄。

## 目錄

- [圖片資源 (Assets)](#圖片資源-assets)
- [響應式設計 (RWD)](#響應式設計-rwd)
- [彈窗 (Popup)](#彈窗-popup)
- [內容完整性 (Content)](#內容完整性-content)
- [檢查清單模板](#檢查清單模板)
- [常見問題排查](#常見問題排查)

---

## 圖片資源 (Assets)

| ID | 規則 | 驗證條件 | 可自動化 |
|----|------|----------|:--------:|
| A1 | 檔名正規化 | 所有檔名符合 `/^[a-z0-9_.-]+$/` | ✓ |
| A2 | 資源可達性 | 所有引用的圖片路徑存在 | ✓ |
| A3 | ID 唯一性 | 資源識別碼不重複 | ✓ |
| A4 | 替代文字 | 所有 `<img>` 有非空 `alt` 屬性 | ✓ |
| A5 | 檔案大小 | 圖片檔案 < 500KB（建議） | ✓ |

### A1 詳細說明

**目的**: 確保跨平台相容性，避免 URL 編碼問題

**允許字元**: `a-z` `0-9` `_` `-` `.`

**違規範例**:
- `首頁Banner.png` ❌ (中文)
- `Hero-Banner.PNG` ❌ (大寫)
- `hero banner.png` ❌ (空格)

**合規範例**:
- `hero-banner.png` ✓
- `hero_banner_01.jpg` ✓

---

## 響應式設計 (RWD)

| ID | 規則 | 驗證條件 | 可自動化 |
|----|------|----------|:--------:|
| R1 | 變體互斥 | 同一元件的 desktop/mobile 任一時刻只顯示一個 | - |
| R2 | 無水平溢出 | 任何視窗寬度下無 `overflow-x: scroll` | - |
| R3 | 圖片不變形 | 圖片保持原始比例（`object-fit` 正確） | - |
| R4 | 斷點一致 | 所有元件使用相同斷點切換 | - |

### R1 詳細說明

**目的**: 避免在斷點切換時出現兩張圖同時顯示

**驗證方式**:
1. 將視窗從 1200px 逐漸縮小至 320px
2. 觀察 Hero Banner 是否始終只顯示一張
3. 在斷點 (768px) 附近來回切換確認

**實作模式**:
- 優先使用 `<picture>` + `<source media="...">`
- 備選使用 CSS `display: none` 切換

---

## 彈窗 (Popup)

| ID | 規則 | 驗證條件 | 可自動化 |
|----|------|----------|:--------:|
| P1 | 觸發邏輯 | 依 trigger 類型正確觸發 | - |
| P2 | 可關閉 | 至少一種關閉方式有效 | - |
| P3 | 遮罩樣式 | 有半透明背景遮罩 | - |
| P4 | 置中對齊 | 水平垂直居中 | - |
| P5 | 鍵盤支援 | ESC 鍵可關閉 | - |
| P6 | 焦點管理 | 開啟時焦點移入，關閉時焦點還原 | - |

### Trigger 類型定義

| trigger | 行為 | 儲存機制 |
|---------|------|----------|
| `first_visit` | 首次訪問顯示，關閉後不再顯示 | `localStorage` |
| `session` | 每個 session 首次顯示 | `sessionStorage` |
| `always` | 每次頁面載入都顯示 | 無 |
| `scroll` | 滾動到指定位置顯示 | 無 |
| `exit_intent` | 滑鼠移出視窗時顯示 | `localStorage` |

### P1 驗證步驟 (first_visit)

1. 清除 localStorage
2. 載入頁面 → 應顯示彈窗
3. 關閉彈窗
4. 重新載入頁面 → 不應再顯示

---

## 內容完整性 (Content)

| ID | 規則 | 驗證條件 | 可自動化 |
|----|------|----------|:--------:|
| C1 | 資源解耦 | Markdown 無直接 `![](path)` 圖片引用 | ✓ |
| C2 | Layout 有效 | `layout.image_id` 對應資源存在 | ✓ |
| C3 | Schema 合規 | 輸出 JSON 符合定義的 Schema | ✓ |
| C4 | 連結有效 | 所有內部連結指向存在的頁面 | ✓ |

### C1 詳細說明

**目的**: 將圖片引用從內容中分離，統一由 layout 管理

**違規範例** (index.md):
```markdown
## 服務項目
![軟體開發](assets/software.png)
```

**合規範例** (index.yml):
```yaml
layout:
  sections:
    - type: services
      images:
        - id: service_software
```

---

## 檢查清單模板

```markdown
## 頁面驗證：{page_name}

日期：{date}
驗證者：{name}
框架：{framework}

### 自動化檢查
- [ ] A1 圖片檔名 ASCII 小寫
- [ ] A2 資源路徑存在
- [ ] A3 圖片 ID 唯一
- [ ] A4 所有圖片有 alt
- [ ] C1 Markdown 無直接圖片引用
- [ ] C2 image_id 對應有效
- [ ] C3 JSON Schema 驗證通過

### RWD 檢查
- [ ] R1 變體互斥顯示
- [ ] R2 無水平捲軸
- [ ] R3 圖片無拉伸
- [ ] R4 斷點切換正確

### Popup 檢查
- [ ] P1 觸發邏輯正確
- [ ] P2 可關閉
- [ ] P3 遮罩 + 置中
- [ ] P5 ESC 鍵支援

### 備註
{notes}
```

---

## 常見問題排查

| 症狀 | 可能原因 | 驗證規則 |
|------|----------|----------|
| 桌機/手機圖片同時顯示 | CSS 互斥規則缺失 | R1 |
| 圖片變形 | 缺少 `object-fit` | R3 |
| Popup 每次都顯示 | storage key 錯誤 | P1 |
| 圖片 404 | 路徑不存在 | A2 |
| 非 ASCII 檔名 | 正規化未執行 | A1 |
| build 時警告 missing alt | 圖片缺少替代文字 | A4 |

---

## 相關文件

- [UI 行為規格](./ui-behavior.md)
- [Content Contract](./content-contract.md)
- [實作指南](./implementations/)

