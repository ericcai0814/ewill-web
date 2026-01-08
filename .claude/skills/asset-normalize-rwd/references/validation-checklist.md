# Validation Checklist

靜態頁面產出後的驗證清單，確保品質一致性。

## 目錄

- [自動化驗證](#自動化驗證)
- [手動驗證](#手動驗證)
- [RWD 驗證流程](#rwd-驗證流程)

---

## 自動化驗證

以下項目可透過腳本自動檢查：

### 資源檔案

| ID | 檢查項目 | 驗證方式 | 腳本 |
|----|----------|----------|------|
| A1 | 圖片檔名為 ASCII 小寫 | 正則 `/^[a-z0-9_.-]+$/` | `audit-content.ts` |
| A2 | asset-manifest.json 路徑存在 | 檔案系統檢查 | `audit-content.ts` |
| A3 | 圖片 ID 唯一 | manifest 掃描 | `normalize-assets.ts` |
| A4 | 所有圖片有 alt 屬性 | HTML 解析 | 可新增 |

### 內容檔案

| ID | 檢查項目 | 驗證方式 | 腳本 |
|----|----------|----------|------|
| C1 | Markdown 無直接圖片引用 | 正則掃描 `![` | `audit-content.ts` |
| C2 | index.yml layout 的 image_id 有效 | 對照 manifest | `build-content.ts` |
| C3 | page.json 結構符合 schema | JSON Schema 驗證 | `ajv` |

### 執行指令

```bash
# 執行所有自動化檢查
npx tsx scripts/normalize-assets.ts
npx tsx scripts/audit-content.ts
npx tsx scripts/build-content.ts

# JSON Schema 驗證 (需安裝 ajv-cli)
ajv validate -s references/schemas/page.schema.json -d dist/content/pages/*.json
```

---

## 手動驗證

以下項目需人工檢查：

### 響應式圖片

| ID | 檢查項目 | 驗證方式 |
|----|----------|----------|
| R1 | Hero Banner 桌機/手機互斥顯示 | 縮放瀏覽器視窗，確認只顯示一張 |
| R2 | 卡片圖片 RWD 正確切換 | 同上 |
| R3 | 無水平捲軸 | 手機寬度 (375px) 下檢查 |
| R4 | 圖片無拉伸變形 | 視覺檢查 `object-fit` 效果 |

### 彈窗 Popup

| ID | 檢查項目 | 驗證方式 |
|----|----------|----------|
| P1 | 首訪觸發正確 | 清除 localStorage 後重新載入 |
| P2 | 再訪不顯示 | 關閉後重新載入，確認不再出現 |
| P3 | 遮罩 + 置中 | 視覺檢查 |
| P4 | 關閉按鈕有效 | 點擊測試 |
| P5 | 點擊遮罩可關閉 | 點擊測試 |
| P6 | ESC 鍵可關閉 | 鍵盤測試 |

### 樣式與排版

| ID | 檢查項目 | 驗證方式 |
|----|----------|----------|
| S1 | 背景圖正確套用 | 視覺檢查各區塊背景 |
| S2 | 字體渲染正常 | 確認無亂碼或缺字 |
| S3 | 連結可點擊 | 點擊測試 |

---

## RWD 驗證流程

### 步驟 1：準備測試環境

```bash
# 啟動本地伺服器
cd dist && python3 -m http.server 8080
```

### 步驟 2：桌機版檢查 (≥1024px)

1. 開啟 `http://localhost:8080`
2. 確認 Hero Banner 顯示桌機版圖片
3. 確認卡片顯示桌機版圖片
4. 檢查 Popup 首訪觸發（清除 localStorage 後）

### 步驟 3：手機版檢查 (<768px)

1. 開啟 DevTools → 切換至手機模擬 (iPhone 14 / 375px)
2. 確認 Hero Banner 顯示手機版圖片
3. 確認卡片圖片高度為 180px
4. 確認無水平捲軸
5. 確認 Popup 置中且有遮罩

### 步驟 4：切換測試

1. 從桌機寬度逐漸縮小至手機寬度
2. 確認在 768px 斷點正確切換
3. 確認切換過程無閃爍或同時顯示兩張圖

---

## 檢查清單模板

```markdown
## 頁面驗證：{page_name}

日期：{date}
驗證者：{name}

### 自動化檢查
- [ ] A1 圖片檔名 ASCII 小寫
- [ ] A2 manifest 路徑存在
- [ ] A3 圖片 ID 唯一
- [ ] C1 Markdown 無直接圖片引用
- [ ] C2 image_id 對應有效
- [ ] C3 JSON Schema 驗證通過

### RWD 檢查
- [ ] R1 Hero Banner 互斥顯示
- [ ] R2 卡片圖片 RWD 切換
- [ ] R3 無水平捲軸
- [ ] R4 圖片無拉伸

### Popup 檢查
- [ ] P1 首訪觸發正確
- [ ] P2 再訪不顯示
- [ ] P3 遮罩 + 置中
- [ ] P4 關閉按鈕有效
- [ ] P5 點擊遮罩可關閉
- [ ] P6 ESC 鍵可關閉

### 備註
{notes}
```

---

## 常見問題排查

| 症狀 | 可能原因 | 解決方式 |
|------|----------|----------|
| 桌機/手機圖片同時顯示 | CSS 互斥規則缺失 | 檢查 `display: none` 切換 |
| Popup 每次都顯示 | localStorage key 錯誤 | 檢查 key 命名與讀取邏輯 |
| 圖片 404 | manifest 路徑與實際不符 | 重新執行 `normalize-assets.ts` |
| 非 ASCII 檔名 | 正規化未執行 | 執行 `normalize-assets.ts` |
| 卡片圖片變形 | 缺少 `object-fit: cover` | 補上 CSS |

