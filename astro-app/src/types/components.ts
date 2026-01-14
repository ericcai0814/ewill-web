/**
 * Astro 元件共用類型定義
 */

// ============================================
// 基礎類型
// ============================================

/** 圖片資源（已解析） */
export interface ImageAsset {
  /** 桌面版圖片路徑 */
  desktop: string;
  /** 手機版圖片路徑 */
  mobile: string;
  /** 替代文字 */
  alt: string;
}

/** 連結項目 */
export interface LinkItem {
  /** 連結文字 */
  text: string;
  /** 連結網址 */
  url: string;
}

/** 導航項目（含子選單） */
export interface NavItem {
  /** 顯示文字 */
  text: string;
  /** 連結網址 */
  url: string;
  /** 子選單 */
  children?: NavItem[];
}

// ============================================
// Section 元件類型
// ============================================

/** Section 基礎屬性 */
export interface SectionBaseProps {
  /** 錨點 ID */
  id?: string;
  /** 小標籤（通常為英文） */
  label?: string;
  /** 標題 */
  title?: string;
  /** 描述文字 */
  description?: string;
}

/** 卡片項目 */
export interface CardItem {
  /** 唯一識別碼 */
  id: string;
  /** 圖片資源 ID */
  image_id: string;
  /** 標題 */
  title: string;
  /** 描述 */
  description: string;
  /** 連結網址 */
  link?: string;
  /** 連結文字 @default '了解更多' */
  link_text?: string;
}

/** 功能項目 */
export interface FeatureItem {
  /** 唯一識別碼 */
  id: string;
  /** 圖片資源 ID */
  image_id?: string;
  /** SVG 圖示字串 */
  icon?: string;
  /** 標題 */
  title: string;
  /** 副標題 */
  subtitle?: string;
  /** 描述 */
  description: string;
  /** 項目清單 */
  bullets?: string[];
}

/** 時間軸事件 */
export interface TimelineEvent {
  /** 唯一識別碼 */
  id: string;
  /** 年份 */
  year: string;
  /** 標題 */
  title: string;
  /** 描述 */
  description?: string;
  /** 圖片資源 ID */
  image_id?: string;
}

/** 圖庫項目 */
export interface GalleryItem {
  /** 唯一識別碼 */
  id: string;
  /** 圖片資源 ID */
  image_id: string;
  /** 標題 */
  title?: string;
  /** 說明文字 */
  caption?: string;
}

/** 表單欄位 */
export interface FormField {
  /** 欄位名稱 */
  name: string;
  /** 顯示標籤 */
  label: string;
  /** 佔位文字 */
  placeholder?: string;
  /** 是否必填 @default false */
  required?: boolean;
  /** 欄位類型 @default 'text' */
  type?: 'text' | 'email' | 'tel' | 'textarea';
}

// ============================================
// 元件 Props 類型
// ============================================

/** HeroSection Props */
export interface HeroSectionProps {
  /** 圖片資源 */
  image: ImageAsset;
  /** 是否顯示暗色疊加層 @default false */
  overlay?: boolean;
  /** 高度模式 @default 'fixed' */
  height?: 'full' | 'fixed' | 'auto';
}

/** TextSection Props */
export interface TextSectionProps extends SectionBaseProps {
  /** Markdown 內容 */
  content: string;
}

/** ImageSection Props */
export interface ImageSectionProps {
  /** 圖片資源 ID */
  image_id: string;
}

/** CardListSection Props */
export interface CardListSectionProps extends SectionBaseProps {
  /** 欄數 @default 3 */
  columns?: 3 | 4 | 5;
  /** 佈局變體 @default 'equal' */
  layout_variant?: '3-2' | 'equal';
  /** 卡片清單 */
  cards: CardItem[];
}

/** AnchorSection Props */
export interface AnchorSectionProps {
  /** 錨點 ID */
  id: string;
  /** 標題 */
  title: string;
  /** 描述 */
  description?: string;
  /** 卡片清單 */
  cards: CardItem[];
}

/** FeatureGridSection Props */
export interface FeatureGridSectionProps extends SectionBaseProps {
  /** 欄數 @default 3 */
  columns?: 3 | 4;
  /** 樣式變體 @default 'default' */
  variant?: 'default' | 'icon' | 'minimal';
  /** 功能清單 */
  features: FeatureItem[];
}

/** FeatureShowcaseSection Props */
export interface FeatureShowcaseSectionProps extends SectionBaseProps {
  /** 佈局方式 @default 'alternating' */
  layout?: 'alternating' | 'image-left' | 'image-right' | 'vertical' | 'horizontal';
  /** 功能清單 */
  features: FeatureItem[];
}

/** CTASection Props */
export interface CTASectionProps {
  /** 標題 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 按鈕文字 */
  button_text: string;
  /** 按鈕連結 */
  button_link: string;
  /** 對齊方式 @default 'center' */
  align?: 'center' | 'left';
  /** 樣式變體 @default 'primary' */
  variant?: 'primary' | 'secondary';
}

/** TimelineSection Props */
export interface TimelineSectionProps extends SectionBaseProps {
  /** 時間軸事件清單 */
  events: TimelineEvent[];
}

/** GallerySection Props */
export interface GallerySectionProps extends SectionBaseProps {
  /** 欄數 @default 3 */
  columns?: 2 | 3 | 4;
  /** 間距 @default 'medium' */
  gap?: 'small' | 'medium' | 'large';
  /** 是否啟用燈箱 @default true */
  lightbox?: boolean;
  /** 圖片清單 */
  images: GalleryItem[];
}

/** ContactFormSection Props */
export interface ContactFormSectionProps extends SectionBaseProps {
  /** 表單欄位 */
  fields: FormField[];
}

/** 輪播項目 */
export interface CarouselItem {
  /** 圖片資源 ID */
  image_id: string;
  /** 標題 */
  title?: string;
  /** 說明文字 */
  caption?: string;
}

/** CarouselSection Props */
export interface CarouselSectionProps extends SectionBaseProps {
  /** 輪播項目 */
  items: CarouselItem[];
  /** 自動播放間隔（毫秒），0 為不自動播放 @default 0 */
  autoplay?: number;
  /** 是否顯示指示點 @default true */
  dots?: boolean;
  /** 是否顯示前後箭頭 @default true */
  arrows?: boolean;
}

/** ProductIntroSection Props */
export interface ProductIntroSectionProps {
  /** 小標籤 */
  label?: string;
  /** 標題 */
  title: string;
  /** 描述 */
  description?: string;
  /** 特色清單 */
  features?: string[];
  /** 圖片資源 ID */
  image_id?: string;
}

/** PopupModal Props */
export interface PopupModalProps {
  /** 圖片資源 ID */
  image_id: string;
  /** 點擊連結 */
  link: string;
  /** 觸發時機 @default 'first_visit' */
  trigger?: 'first_visit' | 'always' | 'scroll';
}

/** Breadcrumb Props */
export interface BreadcrumbProps {
  /** 麵包屑項目 */
  items: {
    /** 顯示文字 */
    label: string;
    /** 連結網址（最後一項不需要） */
    href?: string;
  }[];
}

/** AnchorNav Props */
export interface AnchorNavProps {
  /** 導航項目 */
  items: {
    /** 錨點 ID */
    id: string;
    /** 顯示標籤 */
    label: string;
    /** 圖示 */
    icon?: string;
  }[];
}

// ============================================
// Layout 元件類型
// ============================================

/** Header Props（目前無外部 props，從 content 讀取） */
export interface HeaderProps {
  // 保留供未來擴充
}

/** Footer Props（目前無外部 props，從 content 讀取） */
export interface FooterProps {
  // 保留供未來擴充
}
