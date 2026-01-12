import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

/**
 * 頁面內容型別定義
 */
export interface PageContent {
  slug: string;
  markdown: string;
  config: PageConfig;
  html?: string;
}

/**
 * 頁面配置型別 (從 index.yml 讀取)
 */
export interface PageConfig {
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  url_mapping: {
    current_url: string;
    old_url?: string;
    redirect?: boolean;
  };
  layout?: any;
}

/**
 * 讀取單一頁面內容 (md + yml)
 * @param pagePath - 頁面目錄路徑，例如 'index'、'about_us'
 * @returns 頁面內容物件
 */
export async function getPageContent(pagePath: string): Promise<PageContent | null> {
  try {
    // 從專案根目錄的 pages/ 讀取
    const contentDir = path.join(process.cwd(), '..', 'pages', pagePath);

    // 讀取 index.md
    const mdPath = path.join(contentDir, 'index.md');
    const mdContent = await fs.readFile(mdPath, 'utf-8');

    // 使用 gray-matter 解析 markdown (支援 frontmatter)
    const { content: markdown, data: frontmatter } = matter(mdContent);

    // 讀取 index.yml
    const ymlPath = path.join(contentDir, 'index.yml');
    const ymlContent = await fs.readFile(ymlPath, 'utf-8');
    const config = yaml.load(ymlContent) as PageConfig;

    return {
      slug: pagePath,
      markdown,
      config,
    };
  } catch (error) {
    console.error(`無法讀取頁面內容: ${pagePath}`, error);
    return null;
  }
}

/**
 * 取得所有可用頁面清單
 * @returns 頁面 slug 陣列
 */
export async function getAllPages(): Promise<string[]> {
  try {
    const pagesDir = path.join(process.cwd(), '..', 'pages');
    const entries = await fs.readdir(pagesDir, { withFileTypes: true });

    // 過濾出目錄（排除 header、footer 等共用元件）
    const pages = entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !['header', 'footer'].includes(entry.name))
      .map(entry => entry.name);

    return pages;
  } catch (error) {
    console.error('無法讀取頁面清單', error);
    return [];
  }
}

/**
 * 取得圖片資源路徑
 * @param pagePath - 頁面路徑
 * @param imageName - 圖片檔名 (不含副檔名)
 * @returns 圖片相對路徑
 */
export function getImagePath(pagePath: string, imageName: string): string {
  // 根據您的專案結構，圖片位於 pages/{pagePath}/assets/
  return `/pages/${pagePath}/assets/${imageName}`;
}

/**
 * 將 Markdown 轉換為 HTML (使用 Astro 內建功能更好，此函式備用)
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // 在 Astro 中建議使用 <Content /> 元件
  // 此函式僅作為備用參考
  return markdown;
}
