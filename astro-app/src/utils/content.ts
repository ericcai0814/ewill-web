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
export interface LayoutSection {
  type: 'image' | 'text';
  image_id?: string;
  content?: string;
  label?: string;
  title?: string;
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
    sections?: LayoutSection[];
    popup?: {
      image_id: string;
      link: string;
      trigger: string;
    };
  };
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

// 快取
let assetManifestCache: AssetManifest | null = null;
let contentManifestCache: ContentManifest | null = null;

/**
 * 取得 asset manifest
 */
export async function getAssetManifest(): Promise<AssetManifest | null> {
  if (assetManifestCache) return assetManifestCache;

  try {
    const manifestPath = path.join(process.cwd(), 'public', 'asset-manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    assetManifestCache = JSON.parse(content);
    return assetManifestCache;
  } catch (error) {
    console.error('無法讀取 asset-manifest.json', error);
    return null;
  }
}

/**
 * 取得 content manifest
 */
export async function getContentManifest(): Promise<ContentManifest | null> {
  if (contentManifestCache) return contentManifestCache;

  try {
    const manifestPath = path.join(process.cwd(), 'public', 'content', 'manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    contentManifestCache = JSON.parse(content);
    return contentManifestCache;
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
