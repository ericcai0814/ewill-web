# Phase 2: 共用元件

## 目標

建立可重用的 UI 元件庫。

## 元件清單

### Layout 元件

| 元件 | 說明 |
|------|------|
| `Header` | 導覽列（Logo、選單、CTA） |
| `Footer` | 頁尾（聯絡資訊、連結） |
| `Container` | 內容容器（max-width） |
| `Section` | 區塊容器（padding） |

### UI 元件

| 元件 | 說明 |
|------|------|
| `Button` | 按鈕（primary、secondary、outline） |
| `Card` | 卡片（圖片、標題、描述） |
| `ResponsiveImage` | RWD 圖片（desktop/mobile 變體） |
| `PopupBanner` | 彈窗廣告（首訪觸發） |

### 特殊元件

| 元件 | 說明 |
|------|------|
| `HeroBanner` | 首屏主視覺 |
| `ServiceCard` | 服務項目卡片 |
| `SolutionCard` | 解決方案卡片 |

## 元件規格

### ResponsiveImage

```tsx
interface ResponsiveImageProps {
  desktop: string
  mobile: string
  alt: string
  className?: string
  priority?: boolean
}
```

### Card

```tsx
interface CardProps {
  image: {
    desktop: string
    mobile: string
    alt: string
  }
  title: string
  description?: string
  href?: string
}
```

## 驗收標準

- [ ] 所有元件有 TypeScript 類型
- [ ] 元件支援 RWD
- [ ] 元件可獨立使用

