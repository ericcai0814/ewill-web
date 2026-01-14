# CarouselSection 輪播圖元件實作

## 背景

原官網 `/about_us/` 頁面的「公司沿革」和「資格證書」區塊使用輪播圖展示多張圖片，目前網站缺少此元件。

## 需求來源

- 頁面：`/about_us/`
- 區塊：
  1. **公司沿革 (Milestones)**：展示公司發展歷程圖片
  2. **資格證書 (Certification)**：展示多張證書圖片

## 設計規格

### Props 介面

```typescript
export interface CarouselItem {
  /** 圖片資源 ID */
  image_id: string;
  /** 標題（選填） */
  title?: string;
  /** 說明文字（選填） */
  caption?: string;
}

export interface Props {
  /** 小標籤 */
  label?: string;
  /** 標題 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 輪播項目 */
  items: CarouselItem[];
  /** 自動播放間隔（毫秒），0 為不自動播放 @default 0 */
  autoplay?: number;
  /** 是否顯示指示點 @default true */
  dots?: boolean;
  /** 是否顯示前後箭頭 @default true */
  arrows?: boolean;
  /** 是否循環播放 @default true */
  loop?: boolean;
}
```

### Section Type

在 `content.ts` 新增：

```typescript
type: 'carousel'
```

### 使用範例

```json
{
  "type": "carousel",
  "id": "milestones",
  "label": "Milestones",
  "title": "公司沿革",
  "autoplay": 5000,
  "items": [
    { "image_id": "about_us_2_1_fix2_1" },
    { "image_id": "about_us_2_2_fix2_1" }
  ]
}
```

## 技術實作

### 選項比較

| 方案 | 優點 | 缺點 |
|------|------|------|
| **原生 CSS scroll-snap** | 無依賴、輕量 | 需自行實作箭頭/指示點邏輯 |
| **Swiper.js** | 功能完整、手勢支援好 | 增加 bundle size (~40KB) |
| **Embla Carousel** | 輕量 (~8KB)、Vanilla JS | 需額外整合 |

### 建議方案

使用**原生 CSS scroll-snap** + 少量 JS：
- 符合 Vitesse 極簡風格
- 無外部依賴
- 效能最佳

### 核心實作

```astro
<div class="carousel-container overflow-x-auto snap-x snap-mandatory">
  <div class="carousel-track flex">
    {items.map((item) => (
      <div class="carousel-slide snap-center shrink-0 w-full">
        <!-- 圖片內容 -->
      </div>
    ))}
  </div>
</div>

<!-- 指示點 -->
<div class="carousel-dots flex justify-center gap-2 mt-4">
  {items.map((_, i) => (
    <button class="w-2 h-2 rounded-full bg-[var(--border-color)]" data-index={i} />
  ))}
</div>
```

## 圖片配置（已確認）

### 公司沿革 (Milestones)

**桌面版** (`display: desktop`)
| 圖片 ID | 用途 |
|---------|------|
| `about_us_2_1_fix2_1` | 沿革合併圖 1 |
| `about_us_2_2_fix2_1` | 沿革合併圖 2 |

**手機版** (`display: mobile`) - 含年份標籤
| 圖片 ID | 年份 |
|---------|------|
| `about_us_2_1_m` | 2006 |
| `about_us_2_2_m` | 2012 |
| `about_us_2_3_m` | 2018 |
| `about_us_2_4_m` | 2022 |
| `about_us_2_5_m` | 2025 |

### 資格證書 (Certification) - 7 張

| 圖片 ID | 說明 |
|---------|------|
| `qij2pjc0ypkyf32xudqfv5kr95basbyimfobaxtpmo` | 數位發展部資安服務機構 |
| `1100811208_scaled_qij2h7hiek6hjh6hha4g9r8pr8d7kvw557kf7o6ark` | 自動化服務能量登錄 |
| `1100511205_scaled_qij2gzysvvw6ylhep6vfpt5105e9vb2ag6cjdghg5c` | 資訊安全服務能量登錄 |
| `1080611006_scaled_qij2h3q5n81c91by38hxzs6vdovqq3h7soyhakbvgg` | 資訊技術服務能量登錄 |
| `270012013_qij2pl7pcdnj2b07jejp053ofx217q5zaoza9hqxa8` | ISO 27001 認證 |
| `ttqs_qij2pgiie7h3g971auik5oadgzp758nbm1puv3xw5c` | TTQS 證書 |
| `11410171161016_rdlwpft05l34thpa49vumpm5rkxfoythj7hy9gnlds` | 人才發展品質認證 |

## 實作步驟

### Phase 1: 元件建立 ✅

- [x] 建立 `CarouselSection.astro`
- [x] 新增 Props 類型（內嵌於元件）
- [x] 實作 CSS scroll-snap 輪播
- [x] 實作指示點與箭頭
- [x] 新增 `display` 屬性支援 RWD

### Phase 2: 整合 ✅

- [x] 更新 `content.ts` 新增 carousel type
- [x] 更新 `PageLayout.astro` 渲染邏輯
- [x] 更新 `about_us/index.yml` 使用 carousel section
- [x] **CI/CD 依賴**：確認 `deploy.yml` 包含 `pnpm run build`（根目錄）步驟

### Phase 3: 驗證

- [ ] 測試桌面版輪播
- [ ] 測試手機版觸控滑動
- [ ] 測試自動播放功能
- [ ] 測試錨點連結 (#milestones, #certification)

## 狀態

- **建立日期**：2026-01-14
- **完成日期**：2026-01-14
- **目前狀態**：待驗證
- **優先級**：中
