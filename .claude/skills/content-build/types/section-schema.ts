/**
 * Section Schema - 單一來源類型定義
 *
 * 此檔案為 content-build 系統的類型定義單一來源。
 * 所有涉及 section 的腳本都應從此檔案 import 類型。
 *
 * 依賴此檔案的腳本：
 * - sync-content.ts
 * - build-content.ts
 * - astro-app/src/utils/content.ts
 * - astro-app/src/types/components.ts
 *
 * 變更此檔案時，請確認所有依賴腳本的相容性。
 */

// ============================================================================
// 基礎類型
// ============================================================================

/** 圖片資源（來自 asset-manifest.json） */
export interface AssetEntry {
  id: string
  original_path: string
  normalized_path: string
  variants: {
    desktop: string
    mobile: string
  }
  alt: string
}

/** 圖片資源清單 */
export interface AssetManifest {
  generated_at: string
  target: string
  assets: AssetEntry[]
}

/** 解析後的圖片（用於 layout） */
export interface ResolvedImage {
  id: string
  desktop: string
  mobile: string
  alt: string
}

// ============================================================================
// Section 類型定義
// ============================================================================

/** 可同步的 section 類型（從 md 解析） */
export const SYNCABLE_SECTION_TYPES = ['text', 'image'] as const
export type SyncableSectionType = typeof SYNCABLE_SECTION_TYPES[number]

/** 手動配置的 section 類型 */
export const MANUAL_SECTION_TYPES = [
  'card_list',
  'anchor',
  'feature_grid',
  'cta',
  'product_intro',
  'feature_showcase',
  'timeline',
  'gallery',
  'contact_form',
  'carousel',
] as const
export type ManualSectionType = typeof MANUAL_SECTION_TYPES[number]

/** 所有 section 類型 */
export type SectionType = SyncableSectionType | ManualSectionType

/** RWD 顯示模式 */
export type DisplayMode = 'all' | 'desktop' | 'mobile'

// ============================================================================
// 可同步的 Section 介面
// ============================================================================

/** 文字區塊 */
export interface TextSection {
  type: 'text'
  id?: string
  label?: string
  title?: string
  content: string
}

/** 圖片區塊 */
export interface ImageSection {
  type: 'image'
  image_id: string
  /** RWD 顯示模式：desktop 只在桌面顯示，mobile 只在手機顯示 */
  display?: DisplayMode
}

// ============================================================================
// 手動配置的 Section 介面
// ============================================================================

/** 卡片資料 */
export interface CardData {
  id: string
  image_id: string
  title: string
  description: string
  link?: string
  link_text?: string
}

/** 功能資料 */
export interface FeatureData {
  id: string
  image_id?: string
  icon?: string
  title: string
  subtitle?: string
  description: string
  bullets?: string[]
}

/** 時間軸事件 */
export interface TimelineEventData {
  id: string
  year: string
  title: string
  description?: string
  image_id?: string
}

/** 圖庫圖片 */
export interface GalleryImageData {
  id: string
  image_id: string
  title?: string
  caption?: string
}

/** 表單欄位 */
export interface ContactFieldData {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'textarea'
}

/** 輪播項目 */
export interface CarouselItemData {
  image_id: string
  title?: string
  caption?: string
}

/** 卡片列表區塊 */
export interface CardListSection {
  type: 'card_list'
  id?: string
  label?: string
  title?: string
  description?: string
  columns?: 2 | 3 | 4 | 5
  layout_variant?: '3-2' | 'equal'
  cards: CardData[]
}

/** 錨點區塊 */
export interface AnchorSection {
  type: 'anchor'
  id: string
  title: string
  description?: string
  cards: CardData[]
}

/** 功能網格區塊 */
export interface FeatureGridSection {
  type: 'feature_grid'
  id?: string
  label?: string
  title?: string
  columns?: 3 | 4
  variant?: 'default' | 'icon' | 'minimal'
  features: FeatureData[]
}

/** CTA 區塊 */
export interface CTASection {
  type: 'cta'
  id?: string
  title?: string
  description?: string
  button_text: string
  button_link: string
  align?: 'center' | 'left'
  variant?: 'primary' | 'secondary' | 'dark'
}

/** 產品介紹區塊 */
export interface ProductIntroSection {
  type: 'product_intro'
  id?: string
  label?: string
  title: string
  subtitle?: string
  description?: string
  align?: 'center' | 'left'
}

/** 功能展示區塊 */
export interface FeatureShowcaseSection {
  type: 'feature_showcase'
  id?: string
  label?: string
  title?: string
  layout?: 'alternating' | 'image-left' | 'image-right' | 'vertical' | 'horizontal'
  features: FeatureData[]
}

/** 時間軸區塊 */
export interface TimelineSection {
  type: 'timeline'
  id?: string
  label?: string
  title: string
  description?: string
  layout?: 'vertical' | 'horizontal'
  events: TimelineEventData[]
}

/** 圖庫區塊 */
export interface GallerySection {
  type: 'gallery'
  id?: string
  label?: string
  title?: string
  description?: string
  columns?: 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
  lightbox?: boolean
  images: GalleryImageData[]
}

/** 聯絡表單區塊 */
export interface ContactFormSection {
  type: 'contact_form'
  id?: string
  label?: string
  title: string
  fields: ContactFieldData[]
  button_text?: string
}

/** 輪播區塊 */
export interface CarouselSection {
  type: 'carousel'
  id?: string
  label?: string
  title?: string
  description?: string
  items: CarouselItemData[]
  autoplay?: number
  dots?: boolean
  arrows?: boolean
  display?: DisplayMode
}

// ============================================================================
// Union Types
// ============================================================================

/** 可同步的 Section */
export type SyncableSection = TextSection | ImageSection

/** 手動配置的 Section */
export type ManualSection =
  | CardListSection
  | AnchorSection
  | FeatureGridSection
  | CTASection
  | ProductIntroSection
  | FeatureShowcaseSection
  | TimelineSection
  | GallerySection
  | ContactFormSection
  | CarouselSection

/** 所有 Section 類型 */
export type LayoutSection = SyncableSection | ManualSection

// ============================================================================
// 輔助函式
// ============================================================================

/** 檢查是否為可同步的 section 類型 */
export function isSyncableType(type: string): type is SyncableSectionType {
  return SYNCABLE_SECTION_TYPES.includes(type as SyncableSectionType)
}

/** 檢查是否為手動配置的 section 類型 */
export function isManualType(type: string): type is ManualSectionType {
  return MANUAL_SECTION_TYPES.includes(type as ManualSectionType)
}

/**
 * 檢查 section 是否有手動配置
 * 條件：
 * 1. 非 text/image 類型
 * 2. image section 有 display 屬性（RWD 配置）
 */
export function hasManualConfig(section: LayoutSection): boolean {
  if (!isSyncableType(section.type)) {
    return true
  }
  if (section.type === 'image' && section.display) {
    return true
  }
  return false
}

/**
 * 檢查 sections 陣列是否包含手動配置
 */
export function hasManualSections(sections: LayoutSection[]): boolean {
  return sections.some(hasManualConfig)
}
