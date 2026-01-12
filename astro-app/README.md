# 鎰威科技 Astro 專案

基於 Astro 4.x 建立的企業形象官網，使用 SSG 靜態生成，從 `pages/` 目錄讀取 Markdown + YAML 內容。

## 技術棧

- **框架**: Astro 4.x
- **語言**: TypeScript (strict mode)
- **樣式**: Tailwind CSS 4.x
- **內容管理**: Markdown + YAML
- **套件管理**: pnpm

## 快速開始

```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置靜態網站
pnpm build
```

開啟 http://localhost:4321 查看結果。

## 專案結構

```
astro-app/
├── src/
│   ├── layouts/          # 版型
│   ├── components/       # 元件  
│   ├── pages/            # 頁面路由
│   ├── styles/           # 樣式
│   └── utils/            # 工具函式
│       └── content.ts    # 內容讀取 API
└── astro.config.mjs      # Astro 配置
```

## 內容來源

從 `../pages/` 讀取 Markdown + YAML：

```
pages/index/
├── index.md   # 內容
├── index.yml  # SEO 設定
└── assets/    # 圖片
```

完整文件請參考 [完整 README](./FULL_README.md)

