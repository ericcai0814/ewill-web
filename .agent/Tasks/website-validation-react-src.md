---
title: CSR 靜態網站驗證
status: in_progress
created: 2026-01-06
---

# CSR 靜態網站驗證

## 功能目標

建立 React + Vite 靜態網站，驗證現有 Doc System 資源的正確性：

1. **index.md** 內容渲染正確性
2. **index.yml** SEO/AIO 資料正確性
3. **assets/** 圖片路徑正確性
4. 圖文資料流順序正確性

## 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | React + Vite | 用戶指定 |
| 路由 | React Router | SPA 路由管理 |
| Markdown | react-markdown | MD 轉 React 組件 |
| YAML | js-yaml | 解析 index.yml |
| 樣式 | Tailwind CSS | 快速建立 UI |

## 資料來源

```
各模組目錄/
├── index.md         # 頁面內容 → 渲染為 HTML
├── index.yml        # SEO/AIO → meta tags + JSON-LD
└── assets/          # 圖片 → public 靜態資源
    ├── *.jpg/png
    └── *.yml        # 圖片描述 → alt text
```

## 路由對應

使用 `index.yml` 中的 `url_mapping.current_url` 作為路由：

| 模組目錄 | 路由 |
|----------|------|
| `index/` | `/` |
| `about_us/` | `/about/` |
| `logsec/` | `/security-solutions/logsec/` |
| ... | ... |

## 驗證項目

### 內容驗證
- [ ] Markdown 渲染正確
- [ ] 圖片顯示正常
- [ ] 圖文順序與 MD 一致

### SEO 驗證
- [ ] Title 正確套用
- [ ] Description 正確套用
- [ ] Keywords 正確套用

### AIO 驗證
- [ ] Schema.org JSON-LD 生成
- [ ] FAQ Schema 生成
- [ ] Breadcrumb 生成

## 相關文件

- [GUIDELINES.md](../../GUIDELINES.md) - 資源規範
- [04_seo_structure.md](../SOP/04_seo_structure.md) - SEO 結構

