import fs from 'fs/promises';
import path from 'path';

/**
 * 圖片資源型別（來自 asset-manifest.json）
 */
export interface AssetEntry {
  id: string;
  original_path: string;
  normalized_path: string;
  variants: {
    desktop: string;
    mobile: string;
  };
  alt: string;
}

/**
 * 圖片清單型別
 */
export interface AssetManifest {
  generated_at: string;
  target: string;
  assets: AssetEntry[];
}

/**
 * 解析後的圖片（用於 layout）
 */
export interface ResolvedImage {
  id: string;
  desktop: string;
  mobile: string;
  alt: string;
}

/**
 * Layout section 型別
 */
export interface CardData {
  id: string;
  image_id: string;
  title: string;
  description: string;
  link?: string;
  link_text?: string;
}

export interface FeatureData {
  id: string;
  image_id?: string;
  icon?: string;
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description?: string;
  image_id?: string;
}

export interface GalleryImage {
  id: string;
  image_id: string;
  title?: string;
  caption?: string;
}

export interface ContactField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'textarea';
}

export interface CarouselItem {
  image_id: string;
  title?: string;
  caption?: string;
}

export interface LayoutSection {
  type: 'image' | 'text' | 'card_list' | 'anchor' | 'feature_grid' | 'cta' | 'product_intro' | 'feature_showcase' | 'timeline' | 'gallery' | 'contact_form' | 'carousel';
  // Common
  id?: string;
  image_id?: string;
  content?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  // card_list / anchor
  columns?: 2 | 3 | 4 | 5;
  layout_variant?: '3-2' | 'equal';
  cards?: CardData[];
  // feature_grid
  variant?: string;
  features?: FeatureData[];
  // cta
  button_text?: string;
  button_link?: string;
  align?: 'center' | 'left';
  // feature_showcase
  layout?: 'alternating' | 'image-left' | 'image-right' | 'vertical' | 'horizontal';
  // timeline
  events?: TimelineEvent[];
  // gallery
  images?: GalleryImage[];
  gap?: 'small' | 'medium' | 'large';
  lightbox?: boolean;
  // contact_form
  fields?: ContactField[];
  // carousel
  items?: CarouselItem[];
  autoplay?: number;
  dots?: boolean;
  arrows?: boolean;
}

/**
 * AIO (All-In-One) JSON-LD 結構化資料型別
 */
export interface AioData {
  organization?: {
    type: string;
    name: string;
    alternateName?: string;
    url: string;
    logo?: string;
    description?: string;
    foundingDate?: string;
    address?: {
      type: string;
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
    contactPoint?: {
      type: string;
      contactType: string;
      availableLanguage: string[];
    };
    sameAs?: string[];
  };
  website?: {
    type: string;
    name: string;
    url: string;
    potentialAction?: {
      type: string;
      target: string;
      query_input: string;
    };
  };
  webpage?: {
    type: string;
    name: string;
    description?: string;
    primaryImageOfPage?: string;
    breadcrumb?: {
      type: string;
      itemListElement: {
        type: string;
        position: number;
        name: string;
        item: string;
      }[];
    };
  };
  faq?: {
    question: string;
    answer: string;
  }[];
}

/**
 * AnchorNav 項目型別
 */
export interface AnchorItem {
  id: string;
  label: string;
  icon?: string;
}

/**
 * 頁面內容型別（來自 content/pages/*.json）
 */
export interface PageContent {
  slug: string;
  module: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  url_mapping: {
    current_url: string;
    new_url?: string;
  };
  layout?: {
    hero?: {
      image?: ResolvedImage;
    };
    anchors?: AnchorItem[];  // AnchorNav 導航項目
    sections?: LayoutSection[];
    popup?: {
      image_id: string;
      link: string;
      trigger: string;
    };
  };
  aio?: AioData;
  content: string;
  generated_at: string;
}

/**
 * 內容清單型別（來自 content/manifest.json）
 */
export interface ContentManifest {
  generated_at: string;
  pages: {
    slug: string;
    module: string;
    path: string;
  }[];
}

// 快取（僅在 production 模式使用）
let assetManifestCache: AssetManifest | null = null;
let contentManifestCache: ContentManifest | null = null;

// 開發模式標記
const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';

/**
 * 取得 asset manifest
 */
export async function getAssetManifest(): Promise<AssetManifest | null> {
  // 開發模式不使用快取，確保檔案變更能即時反映
  if (!isDev && assetManifestCache) return assetManifestCache;

  try {
    const manifestPath = path.join(process.cwd(), 'public', 'asset-manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    // 僅在 production 模式快取
    if (!isDev) {
      assetManifestCache = manifest;
    }
    return manifest;
  } catch (error) {
    console.error('無法讀取 asset-manifest.json', error);
    return null;
  }
}

/**
 * 取得 content manifest
 */
export async function getContentManifest(): Promise<ContentManifest | null> {
  // 開發模式不使用快取
  if (!isDev && contentManifestCache) return contentManifestCache;

  try {
    const manifestPath = path.join(process.cwd(), 'public', 'content', 'manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    if (!isDev) {
      contentManifestCache = manifest;
    }
    return manifest;
  } catch (error) {
    console.error('無法讀取 content/manifest.json', error);
    return null;
  }
}

/**
 * 讀取單一頁面內容
 * @param pagePath - 頁面 slug，例如 'index'、'about_us'
 */
export async function getPageContent(pagePath: string): Promise<PageContent | null> {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'content', 'pages', `${pagePath}.json`);
    const content = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(content) as PageContent;
  } catch (error) {
    console.error(`無法讀取頁面內容: ${pagePath}`, error);
    return null;
  }
}

/**
 * 頁面類型定義
 */
export type PageType =
  | 'security'        // 資安產品
  | 'infrastructure'  // 基礎架構
  | 'manufacturing'   // 智慧製造
  | 'event'           // 活動頁面
  | 'general';        // 一般頁面

/**
 * 頁面分類映射
 */
const PAGE_TYPE_MAP: Record<string, PageType> = {
  // 資安產品
  acunetix: 'security',
  array: 'security',
  bitdefender: 'security',
  deep_instinct: 'security',
  fortinet: 'security',
  ist: 'security',
  logsec: 'security',
  palo_alto: 'security',
  security_scorecard: 'security',
  sonarqube: 'security',
  tenable_nessus: 'security',
  vicarius_vrx: 'security',
  // 基礎架構
  proxmox_ve: 'infrastructure',
  ubuntu: 'infrastructure',
  vmware: 'infrastructure',
  // 智慧製造
  ai_agent: 'manufacturing',
  ai_forecasting: 'manufacturing',
  aps: 'manufacturing',
  cms_568: 'manufacturing',
  data_middleware: 'manufacturing',
  jennifer_apm: 'manufacturing',
  mes: 'manufacturing',
  scm: 'manufacturing',
  wms: 'manufacturing',
  smartmanufacturing_ai: 'manufacturing',
};

/**
 * 取得所有可用頁面清單
 * @returns 頁面 slug 陣列（排除 header、footer 等共用元件）
 */
export async function getAllPages(): Promise<string[]> {
  try {
    const manifest = await getContentManifest();
    if (!manifest) return [];

    // 過濾出實際頁面（排除 header、footer 等共用元件）
    const excludeModules = ['header', 'footer'];
    return manifest.pages
      .filter(page => !excludeModules.includes(page.module))
      .map(page => page.slug);
  } catch (error) {
    console.error('無法讀取頁面清單', error);
    return [];
  }
}

/**
 * 依類型取得頁面清單
 * @param type - 頁面類型
 * @returns 符合類型的頁面 slug 陣列
 */
export async function getPagesByType(type: PageType): Promise<string[]> {
  try {
    const allPages = await getAllPages();

    if (type === 'event') {
      // 活動頁面以 event_ 開頭
      return allPages.filter(slug => slug.startsWith('event_'));
    }

    if (type === 'general') {
      // 一般頁面：不在任何分類中的頁面
      const categorizedPages = new Set(Object.keys(PAGE_TYPE_MAP));
      return allPages.filter(slug =>
        !categorizedPages.has(slug) && !slug.startsWith('event_')
      );
    }

    // 其他類型：根據映射表篩選
    return allPages.filter(slug => PAGE_TYPE_MAP[slug] === type);
  } catch (error) {
    console.error(`無法取得 ${type} 類型頁面`, error);
    return [];
  }
}

/**
 * 取得頁面的類型
 * @param slug - 頁面 slug
 * @returns 頁面類型
 */
export function getPageType(slug: string): PageType {
  if (slug.startsWith('event_')) return 'event';
  return PAGE_TYPE_MAP[slug] || 'general';
}

/**
 * 根據 image_id 取得圖片資源
 * @param imageId - 圖片 ID
 */
export async function getAssetById(imageId: string): Promise<AssetEntry | null> {
  const manifest = await getAssetManifest();
  if (!manifest) return null;

  return manifest.assets.find(asset => asset.id === imageId) || null;
}

/**
 * 取得圖片路徑（相容舊 API）
 * @deprecated 改用 getAssetById
 */
export function getImagePath(_pagePath: string, imageName: string): string {
  // 相容舊 API，但建議改用 asset manifest
  return `/assets/${imageName}`;
}
