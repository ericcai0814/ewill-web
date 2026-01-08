# Phase 1: 專案初始化

## 目標

建立 Next.js 14+ (App Router) 專案基礎架構。

## 技術棧

| 項目 | 選擇 |
|------|------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Package Manager | npm |

## 執行步驟

### 1.1 建立專案

```bash
npx create-next-app@latest ewill-next --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 1.2 專案結構

```
ewill-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # 基礎 UI 元件
│   │   └── layout/           # 版面元件
│   └── lib/
│       └── utils.ts          # 工具函數
├── public/
│   └── assets/               # 靜態資源
├── content/                  # 內容來源 (從 pages/ 讀取)
└── tailwind.config.ts
```

### 1.3 設定 Tailwind

- 自訂色彩變數
- 設定字型
- 設定 breakpoints

### 1.4 設定內容來源

```typescript
// lib/content.ts
export async function getPageContent(slug: string) {
  // 從 ../pages/{slug}/index.yml 讀取內容
}
```

## 驗收標準

- [ ] 專案可執行 `npm run dev`
- [ ] TypeScript 無錯誤
- [ ] Tailwind 樣式正常
- [ ] 可讀取 pages/ 內容

