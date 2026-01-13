# 修復 Contact 頁面內容問題

> **建立日期**: 2026-01-14
> **完成日期**: 2026-01-14
> **狀態**: 已完成
> **優先級**: 高

---

## 問題描述

Contact 頁面（`/contact/`）的內容與原官網相差甚遠，導致頁面顯示大量錯誤內容。

### 原官網結構
- Hero Banner（專業·專注·專精）
- 「聯絡資訊」標題區塊
- 聯絡表單（姓名、電子郵件、電話/手機、公司名稱、詢問內容）
- 送出按鈕

### 目前問題

| 問題 | 說明 | 嚴重程度 |
|------|------|:--------:|
| Header 內容重複 3 次 | 爬蟲抓到響應式 Header（Desktop/Tablet/Mobile）共 3 份 | 高 |
| Footer 混入頁面 | 爬蟲沒有過濾 Footer 區塊，站點地圖被當作內容渲染 | 高 |
| 缺少聯絡表單 | 表單是前端動態渲染，爬蟲無法抓取 | 高 |
| 錯誤的 Banner | 使用首頁 Banner（`首頁Banner1209.png`）而非 contact 專用 | 中 |
| 缺少正確資源 | contact 專用 banner 未下載 | 中 |

---

## 根本原因分析

### 1. 爬蟲過濾不足

`web-crawler` 在爬取頁面時，沒有正確過濾：
- `<header>` 元素（導覽列）
- `<footer>` 元素（頁尾）
- 響應式重複內容（同一元素的 Desktop/Tablet/Mobile 版本）

### 2. 動態內容無法抓取

聯絡表單是透過 JavaScript 動態渲染，靜態爬蟲無法取得表單 HTML。

### 3. index.yml 未手動審核

爬蟲產出的 `index.yml` 直接使用，未經人工審核與修正。

---

## 受影響檔案

```
pages/contact/
├── index.md          # 含錯誤內容
├── index.yml         # layout.sections 配置錯誤
└── assets/           # 含錯誤資源
    ├── Logo.png                    # 應刪除（Header 資源）
    ├── BN-Home-M.jpg               # 應刪除（首頁資源）
    ├── Frame-81_fix0219*.png       # 應刪除（Footer 資源）
    └── 首頁Banner1209.png          # 應刪除（首頁資源）
```

---

## 解決方案

### Phase 1：下載正確資源

從原官網下載 contact 專用 banner：
- Desktop: `bn-contact-專業專注專精.jpg`
- Mobile: `bn-contact-m.jpg`

### Phase 2：清理錯誤資源

刪除 `pages/contact/assets/` 中不屬於此頁面的資源。

### Phase 3：重寫 index.yml

```yaml
seo:
  title: 聯絡我們 | 資安與智慧製造諮詢服務 - 鎰威科技
  description: ...
  keywords: [...]

url_mapping:
  current_url: /contact/
  new_url: ""

layout:
  hero:
    image:
      id: contact_banner
      desktop: contact_banner
      mobile: contact_banner_mobile
      alt: 專業·專注·專精 - 鎰威科技
  sections:
    - type: contact_form
      label: Contact
      title: 聯絡資訊
      fields:
        - name: name
          label: 您的大名
          placeholder: 請輸入您的姓名
          required: true
        - name: email
          label: 電子郵件
          placeholder: 請輸入您的電子郵件
          required: true
        - name: phone
          label: 電話 / 手機號碼
          placeholder: 請輸入您的電話 / 手機號碼
          required: false
        - name: company
          label: 公司名稱
          placeholder: 請輸入您的公司名稱
          required: false
        - name: message
          label: 詢問內容
          placeholder: 請輸入您要詢問的內容
          required: true
          type: textarea
      button_text: 送出
```

### Phase 4：新增 ContactFormSection.astro

建立聯絡表單元件，支援欄位配置與表單提交。

### Phase 5：重新建置並驗證

```bash
npm run build           # content-build
cd astro-app && pnpm build  # Astro SSG
```

---

## 驗證清單

- [x] Contact banner 正確顯示（專業·專注·專精）
- [x] 聯絡表單 5 個欄位都有顯示
- [x] 沒有 Header/Footer 內容混入
- [x] 沒有重複的 Logo 或導覽選單
- [x] 表單送出按鈕可點擊

---

## 相關截圖

- 原官網：[ewill.com.tw/contact/](https://www.ewill.com.tw/contact/)
- 問題截圖：見對話記錄 2026-01-14

---

## 預防措施

為避免類似問題再次發生，建議：

1. **爬蟲過濾規則**：更新 `web-crawler` 排除 `<header>`、`<footer>`、`.nav`、`.menu` 等共用元件
2. **人工審核流程**：爬蟲產出的 `index.yml` 必須經過人工審核後才能 commit
3. **表單頁面特殊處理**：含表單的頁面需手動建立 layout，不依賴爬蟲

---

## 參考資料

- [GUIDELINES.md](../../GUIDELINES.md) - 頁面 index.yml 規範
- [web-crawler SKILL.md](../../.claude/skills/web-crawler/SKILL.md) - 爬蟲工具說明
