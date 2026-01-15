/**
 * @ewill/shared - 共用類型定義
 *
 * 這些類型定義用於 API 與前端之間的資料交換。
 * 單一來源：packages/shared/src/types/index.ts
 */

// ============================================================
// Asset Types（圖片資源）
// ============================================================

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

// ============================================================
// Content Manifest Types
// ============================================================

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

// ============================================================
// Layout Section Types
// ============================================================

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

export type LayoutSectionType =
  | 'image'
  | 'text'
  | 'card_list'
  | 'anchor'
  | 'feature_grid'
  | 'cta'
  | 'product_intro'
  | 'feature_showcase'
  | 'timeline'
  | 'gallery'
  | 'contact_form'
  | 'carousel';

export interface LayoutSection {
  type: LayoutSectionType;
  // Common
  id?: string;
  image_id?: string;
  content?: string;
  // image
  display?: 'all' | 'desktop' | 'mobile';
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

// ============================================================
// AIO (All-In-One) JSON-LD Types
// ============================================================

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
  product?: {
    type: string;
    name: string;
    description?: string;
    brand?: string;
    category?: string;
    image?: string;
    offers?: {
      type: string;
      availability?: string;
      priceCurrency?: string;
      seller?: {
        type: string;
        name: string;
      };
    };
  };
  service?: {
    type: string;
    name: string;
    serviceType?: string;
    description?: string;
    offers?: {
      name: string;
      description: string;
    }[];
  };
  event?: {
    type: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: {
      name: string;
      address?: string;
    };
    attendanceMode?: string;
  };
}

// ============================================================
// Anchor Navigation Types
// ============================================================

export interface AnchorItem {
  id: string;
  label: string;
  icon?: string;
}

// ============================================================
// Template Content Types
// ============================================================

/**
 * Template 內容資料結構
 * 用於 ProductPage、EventPage 等固定佈局 Template
 */
export interface TemplateContent {
  hero?: {
    image_id?: string;
    title?: string;
    subtitle?: string;
  };
  intro?: {
    label?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    align?: 'center' | 'left';
  };
  features?: FeatureData[];
  cta?: {
    title?: string;
    description?: string;
    button_text?: string;
    button_link?: string;
    variant?: 'primary' | 'secondary' | 'dark';
  };
  about?: {
    label?: string;
    title?: string;
    content?: string;
  };
  services?: {
    label?: string;
    title?: string;
    description?: string;
    columns?: number;
    layout_variant?: string;
    cards?: CardData[];
  };
  solutions?: {
    label?: string;
    title?: string;
    description?: string;
    columns?: number;
    layout_variant?: string;
    cards?: CardData[];
  };
  carousel?: {
    id?: string;
    label?: string;
    title?: string;
    description?: string;
    items?: CarouselItem[];
    autoplay?: number;
    dots?: boolean;
    arrows?: boolean;
  };
  texts?: {
    id?: string;
    label?: string;
    title?: string;
    content?: string;
  }[];
  anchors?: {
    id?: string;
    title?: string;
    description?: string;
    cards?: CardData[];
  }[];
  form?: {
    label?: string;
    title?: string;
    fields?: ContactField[];
    button_text?: string;
  };
}

// ============================================================
// Page Content Types
// ============================================================

export type PageTemplate = 'product' | 'event' | 'general' | 'contact' | 'home';

/**
 * 頁面內容型別（來自 content/pages/*.json）
 */
export interface PageContent {
  slug: string;
  module: string;
  template?: PageTemplate;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    og_image?: string;
  };
  url_mapping: {
    current_url: string;
    new_url?: string;
  };
  content?: TemplateContent;
  layout?: {
    template?: string;
    hero?: {
      image?: ResolvedImage;
      overlay?: boolean;
      height?: 'full' | 'fixed' | 'auto';
    };
    anchors?: AnchorItem[];
    sections?: LayoutSection[];
    popup?: {
      image_id: string;
      link: string;
      trigger: string;
    };
  };
  aio?: AioData;
  generated_at: string;
}

// ============================================================
// Page Type Classification
// ============================================================

export type PageType =
  | 'security'
  | 'infrastructure'
  | 'manufacturing'
  | 'event'
  | 'general';

// ============================================================
// API Response Types
// ============================================================

/**
 * 標準 API 回應格式
 */
export interface ApiResponse<T> {
  /** 請求是否成功 */
  success: boolean;
  /** 回傳資料或 null */
  data: T | null;
  /** 錯誤資訊（僅在失敗時） */
  error?: {
    /** 錯誤碼 */
    code: string;
    /** 人類可讀訊息 */
    message: string;
    /** 除錯資訊 */
    details?: Record<string, unknown>;
  };
  /** 中繼資訊 */
  meta?: {
    /** ISO 8601 時間戳 */
    timestamp: string;
    /** API 版本 */
    version: string;
    /** 是否為快取 */
    cached?: boolean;
  };
}

// ============================================================
// Contact Form Types
// ============================================================

/**
 * 聯絡表單提交資料
 */
export interface ContactFormSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source_page?: string;
}

/**
 * 聯絡表單提交回應
 */
export interface ContactSubmissionResponse {
  submission_id: string;
  submitted: boolean;
  message: string;
}
