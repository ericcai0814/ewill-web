/**
 * SEO 相關類型定義
 */

/** JSON-LD 結構化資料類型 */
export type JsonLdType =
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'Product'
  | 'FAQPage'
  | 'BreadcrumbList';

/** JSON-LD 項目 */
export interface JsonLdItem {
  /** 結構化資料類型 */
  type: JsonLdType;
  /** 資料內容 */
  data: Record<string, unknown>;
}

/** Open Graph 類型 */
export type OgType = 'website' | 'article' | 'product';

/** SEO 元件 Props */
export interface SEOProps {
  // 基礎 SEO
  /** 頁面標題 */
  title: string;
  /** 頁面描述 */
  description?: string;
  /** 關鍵字 */
  keywords?: string[];
  /** Canonical URL */
  canonical?: string;

  // Open Graph
  /** OG 類型 @default 'website' */
  ogType?: OgType;
  /** OG 圖片 */
  ogImage?: string;
  /** OG 圖片替代文字 */
  ogImageAlt?: string;

  // JSON-LD 結構化資料
  /** JSON-LD 項目清單 */
  jsonLd?: JsonLdItem[];

  // 索引控制
  /** 禁止索引 @default false */
  noindex?: boolean;
  /** 禁止追蹤連結 @default false */
  nofollow?: boolean;
}

/** FAQ 項目（用於 FAQPage JSON-LD） */
export interface FAQItem {
  /** 問題 */
  question: string;
  /** 答案 */
  answer: string;
}

/** 麵包屑項目（用於 BreadcrumbList JSON-LD） */
export interface BreadcrumbItem {
  /** 位置（從 1 開始） */
  position: number;
  /** 名稱 */
  name: string;
  /** URL */
  url: string;
}

/** 組織資料（用於 Organization JSON-LD） */
export interface OrganizationData {
  /** 組織名稱 */
  name: string;
  /** 別名 */
  alternateName?: string;
  /** 網站 URL */
  url: string;
  /** Logo URL */
  logo?: string;
  /** 描述 */
  description?: string;
  /** 成立日期 */
  foundingDate?: string;
  /** 地址 */
  address?: {
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  /** 聯絡方式 */
  contactPoint?: {
    contactType: string;
    availableLanguage: string[];
  };
  /** 社群連結 */
  sameAs?: string[];
}
