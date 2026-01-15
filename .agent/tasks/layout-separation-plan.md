# Implementation Plan：佈局分離與 Template 重構

> **建立日期**：2026-01-15
> **狀態**：規劃中
> **分支**：`feature/layout-separation`
> **依據**：[decisions.md - 2026-01-15 md/yml 職責釐清與佈局分離]

---

## 零、指導原則（Kyle 的願景）

> **「苦勞都交給 AI Agent，功勞留給自己。」**

### 理想工作流程

```
內容人員                    AI Agent                    人類審核
    │                           │                           │
    ▼                           │                           │
提供文案+圖片 ──────────────────▶ 自動套版排版                │
    │                           │                           │
選擇版型 ──────────────────────▶ 一次生成 N 種變體           │
    │                           │                           │
    │                           ▼                           │
    │                      自動截圖放相簿 ─────────────────▶ 挑選順眼版本
    │                           │                           │
    │                           │                           ▼
    │                           │                      納入主分支
```

### 設計原則

- **內容人員**：只管文案和圖片，不碰版型
- **AI Agent**：負責套版、排版、生成變體
- **人類**：最後挑選、決策

---

## 一、目標

1. yml 只保留 SEO、AIO 資訊（內容資料）
2. 佈局由 Template 負責（版型庫）
3. 現有頁面逐步遷移
4. 為 AI 自動套版奠定基礎

---

## 二、頁面分類

### 2.1 統計（共 36 個頁面）

| 分類 | 數量 | 頁面 |
|------|------|------|
| **首頁** | 1 | index |
| **產品頁** | 19 | logsec, acunetix, bitdefender, fortinet, ist, jennifer_apm, palo_alto, proxmox_ve, security_scorecard, sonarqube, tenable_nessus, ubuntu, vicarius_vrx, vmware, array, deep_instinct, ai_agent, ai_forecasting, data_middleware |
| **智慧製造** | 6 | aps, cms_568, mes, scm, wms, smartmanufacturing_ai |
| **活動頁** | 5 | event_information, event_20251021, event_20251118, event_20251119, event_20251124 |
| **一般頁** | 5 | about_us, contact, services, solutions, esg |

### 2.2 建議 Template 數量

| Template | 適用頁面 | 佈局結構 |
|----------|----------|----------|
| **HomePage** | index | Hero + CardList + CTA |
| **ProductPage** | 產品頁、智慧製造（25 頁） | Hero + ProductIntro + FeatureShowcase + CTA |
| **EventPage** | 活動頁（5 頁） | Hero + Carousel/Text + CTA |
| **GeneralPage** | about_us, services, solutions, esg | Hero + Anchor/Text + CTA |
| **ContactPage** | contact | Hero + ContactForm |

**共 5 種 Template**

---

## 三、現有 Section Types 分析

### 3.1 佈局用（移到 Template）

| Section Type | 使用次數 | 對應元件 |
|--------------|----------|----------|
| product_intro | 30 | ProductIntroSection |
| feature_showcase | 29 | FeatureShowcaseSection |
| cta | 26 | CTASection |
| feature_grid | 15 | FeatureGridSection |
| gallery | 6 | GallerySection |
| anchor | 5 | AnchorSection |
| carousel | 3 | CarouselSection |
| card_list | 3 | CardListSection |
| contact_form | 1 | ContactFormSection |

### 3.2 內容用（保留在 yml 或移到 md）

| Section Type | 使用次數 | 處理方式 |
|--------------|----------|----------|
| image | 25 | 移到 md 或 Template 直接引用 |
| text | 24 | 移到 md |

---

## 四、yml 結構調整

### 4.1 調整前

```yaml
seo:
  title: ...
  description: ...
  keywords: [...]

url_mapping:
  current_url: /logsec/
  old_url: /old/logsec/
  redirect: true

layout:
  hero:
    type: hero_banner
    image: { id: banner }
  sections:
    - type: product_intro      # ← 佈局
      title: ...               # ← 內容
      description: ...         # ← 內容
    - type: feature_showcase   # ← 佈局
      features: [...]          # ← 內容
    - type: cta                # ← 佈局
      title: ...               # ← 內容
```

### 4.2 調整後

```yaml
seo:
  title: ...
  description: ...
  keywords: [...]

url_mapping:
  current_url: /logsec/
  old_url: /old/logsec/
  redirect: true

# 內容資料（供 Template 使用）
content:
  hero:
    image_id: banner
    title: LOGSEC
    subtitle: 資安預警解決方案

  intro:
    label: 資安預警解決方案
    title: LOGSEC 平台功能概覽
    description: ...

  features:
    - id: feature_1
      image_id: logsec_1
      title: 整合日誌，安全更清晰
      description: ...
    - id: feature_2
      ...

  cta:
    title: 立即了解 LOGSEC 解決方案
    description: ...
    button_text: 聯繫我們
    button_link: /contact/

# 佈局由 Template 決定，yml 不指定
```

### 4.3 差異對比

| 項目 | 調整前 | 調整後 |
|------|--------|--------|
| 佈局 | yml 指定 `type: product_intro` | Template 寫死 `<ProductIntroSection />` |
| 內容 | 分散在各 section | 集中在 `content` 區塊 |
| 彈性 | 高（改 yml 改佈局） | 低（改 Template 改佈局） |
| 職責 | 模糊 | 清楚 |

---

## 五、Template 設計

### 5.1 ProductPage.astro（範例）

```astro
---
import HeroSection from '@/components/HeroSection.astro'
import ProductIntroSection from '@/components/ProductIntroSection.astro'
import FeatureShowcaseSection from '@/components/FeatureShowcaseSection.astro'
import CTASection from '@/components/CTASection.astro'

const { content } = Astro.props
---

<HeroSection {...content.hero} />
<ProductIntroSection {...content.intro} />
<FeatureShowcaseSection features={content.features} />
<CTASection {...content.cta} />
```

### 5.2 Template 與頁面對應

| 頁面 | Template | 備註 |
|------|----------|------|
| logsec | ProductPage | |
| acunetix | ProductPage | |
| event_20251124 | EventPage | |
| about_us | GeneralPage | 有 anchor 導航 |
| contact | ContactPage | 有表單 |

---

## 六、遷移計畫

### Phase 1：建立 Template 架構

1. 建立 5 個 Template 檔案
2. 調整 Astro routing 支援 Template 選擇
3. 不動現有 yml，先跑通流程

### Phase 2：試點遷移（選 3 頁）

1. **logsec**（產品頁代表）
2. **event_20251124**（活動頁代表）
3. **about_us**（一般頁代表）

調整這 3 頁的 yml 結構，驗證 Template 正確運作。

### Phase 3：批次遷移

依分類逐步遷移：
1. 產品頁（19 頁）
2. 智慧製造（6 頁）
3. 活動頁（5 頁）
4. 一般頁（5 頁）
5. 首頁（1 頁）

### Phase 4：清理

1. 移除 `layout.sections` 相關邏輯
2. 移除 `sync-content` 機制
3. 更新文件

---

## 七、風險評估

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| Template 不夠彈性 | 特殊頁面無法處理 | 保留 1-2 個 slot 供擴充 |
| 遷移過程網站壞掉 | 影響線上服務 | Phase 2 先在本地驗證 |
| 內容資料結構不一致 | 遷移困難 | 建立 migration script |

---

## 八、待確認事項

- [ ] Template 是否需要支援深色模式切換？
- [ ] yml 的 `content` 結構是否需要更細緻的 schema 定義？
- [ ] 是否需要保留部分動態佈局能力（如 A/B 測試）？

---

## 九、下一步

1. 確認此 plan 是否符合需求
2. 開始 Phase 1：建立 Template 架構
