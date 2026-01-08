# Design System 設計系統規範

## 色彩系統

### 主色調

```css
:root {
  /* Primary - 深藍色系 */
  --primary-900: #0a1628;
  --primary-800: #0f2744;
  --primary-700: #143860;
  --primary-600: #1a4a7c;
  --primary-500: #1f5c98;
  
  /* Accent - 青綠色系 */
  --accent-500: #00d4aa;
  --accent-400: #00e6b8;
  --accent-300: #33ecc6;
  
  /* Neutral */
  --gray-900: #1a1a1a;
  --gray-700: #4a4a4a;
  --gray-500: #8a8a8a;
  --gray-300: #d0d0d0;
  --gray-100: #f5f5f5;
  
  /* Semantic */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### 深色主題背景

- Hero: 深藍漸層 `linear-gradient(135deg, var(--primary-900), var(--primary-700))`
- 卡片: 半透明深色 `rgba(15, 39, 68, 0.8)`
- 內文區: 白色 `#ffffff`

## 字型系統

### 字型家族

```css
:root {
  --font-heading: 'Noto Sans TC', sans-serif;
  --font-body: 'Noto Sans TC', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### 字級

| 名稱 | 大小 | 行高 | 用途 |
|------|------|------|------|
| `display` | 48px / 36px (mobile) | 1.2 | Hero 標題 |
| `h1` | 36px / 28px | 1.3 | 頁面標題 |
| `h2` | 28px / 24px | 1.4 | 區塊標題 |
| `h3` | 20px / 18px | 1.5 | 卡片標題 |
| `body` | 16px | 1.6 | 內文 |
| `small` | 14px | 1.5 | 輔助文字 |

## 間距系統

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
}
```

## 斷點

```css
/* Mobile First */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 圓角

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

## 陰影

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

## 動畫

```css
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;

/* 進場動畫 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

