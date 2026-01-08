# Next.js Implementation

Next.js 14+ (App Router) 專案的驗證實作指南。

## 環境資訊

| 項目 | 值 |
|------|-----|
| **輸出目錄** | `.next/` (SSR) 或 `out/` (Static Export) |
| **Dev Server** | `npm run dev` (port 3000) |
| **圖片處理** | `next/image` (內建) |
| **Build** | `npm run build` |

---

## 驗證指令對照

| 規則 ID | 驗證方式 |
|---------|----------|
| A1 | `find public/assets -name '*[^a-z0-9_.-]*' -type f` |
| A2 | Build 時自動檢查（404 會報錯） |
| A3 | ESLint 規則 或自定義 script |
| A4 | `next/image` 強制要求 `alt` prop（編譯錯誤） |
| C1 | ESLint 規則 |
| C2 | TypeScript 編譯檢查 |
| C3 | Zod schema 或 `tsc` |

### 完整驗證流程

```bash
# 1. TypeScript 檢查
npx tsc --noEmit

# 2. Lint 檢查
npm run lint

# 3. Build 驗證
npm run build

# 4. 靜態導出 (如適用)
npm run build && npx next export
```

---

## 圖片 RWD 實作

### 基本使用

```tsx
import Image from 'next/image'

export function HeroBanner() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Hero Banner"
      width={1920}
      height={600}
      sizes="100vw"
      priority // 首屏圖片加 priority
    />
  )
}
```

### 響應式變體

```tsx
import Image from 'next/image'

export function ResponsiveHero() {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet="/images/hero-mobile.jpg" />
      <Image
        src="/images/hero-desktop.jpg"
        alt="Hero Banner"
        width={1920}
        height={600}
        sizes="100vw"
      />
    </picture>
  )
}
```

### Fill 模式 (等比縮放)

```tsx
export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[200px] md:h-[180px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  )
}
```

---

## Popup 實作

### Client Component

```tsx
'use client'

import { useEffect, useState } from 'react'

interface PopupProps {
  storageKey: string
  trigger: 'first_visit' | 'session' | 'always'
  delay?: number
  children: React.ReactNode
}

export function Popup({ storageKey, trigger, delay = 2000, children }: PopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const storage = trigger === 'session' ? sessionStorage : localStorage
    const key = `popup_${storageKey}_dismissed`
    
    if (trigger !== 'always' && storage.getItem(key)) return
    
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [storageKey, trigger, delay])
  
  const hide = () => {
    setIsVisible(false)
    const storage = trigger === 'session' ? sessionStorage : localStorage
    storage.setItem(`popup_${storageKey}_dismissed`, 'true')
  }
  
  // ESC 鍵關閉
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) hide()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isVisible])
  
  if (!isVisible) return null
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && hide()}
    >
      <div className="relative max-w-[80vw] max-h-[80vh]">
        <button 
          onClick={hide}
          className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
```

### 使用

```tsx
// app/page.tsx
import { Popup } from '@/components/Popup'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      {/* 頁面內容 */}
      
      <Popup storageKey="logsec" trigger="first_visit">
        <a href="/logsec">
          <Image 
            src="/images/popup-logsec.png" 
            alt="LOGSEC 推廣"
            width={800}
            height={600}
          />
        </a>
      </Popup>
    </>
  )
}
```

---

## RWD 驗證

### 測試步驟

```bash
# 啟動開發伺服器
npm run dev
```

1. 開啟 `http://localhost:3000`
2. DevTools → Responsive Mode
3. 測試斷點：1200px → 768px → 375px

### next.config.js 圖片設定

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
}

module.exports = nextConfig
```

---

## 常見問題

### Image 元件 src 路徑錯誤

```tsx
// ❌ 錯誤：相對路徑
<Image src="images/hero.jpg" />

// ✓ 正確：public 目錄下的絕對路徑
<Image src="/images/hero.jpg" />

// ✓ 正確：import 靜態資源
import heroImg from '@/public/images/hero.jpg'
<Image src={heroImg} />
```

### Hydration 不匹配

```tsx
// 使用 dynamic import 避免 SSR
import dynamic from 'next/dynamic'

const Popup = dynamic(() => import('@/components/Popup'), {
  ssr: false
})
```

### Static Export 圖片優化

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Static export 需要關閉優化
  },
}
```

### alt 屬性缺失

```tsx
// Next.js 會在編譯時報錯
// Error: Image is missing required "alt" property

// ✓ 永遠提供有意義的 alt
<Image src="/hero.jpg" alt="公司首頁主視覺，展示核心服務" />

// 裝飾性圖片使用空字串
<Image src="/decoration.png" alt="" />
```

