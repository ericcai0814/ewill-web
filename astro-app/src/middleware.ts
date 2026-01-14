import { defineMiddleware } from 'astro:middleware';
import fs from 'fs/promises';
import path from 'path';

interface UrlMapping {
  current_url: string;
  old_url?: string;
  redirect?: boolean;
}

interface PageJson {
  url_mapping?: UrlMapping;
}

// 快取重定向映射
let redirectMap: Map<string, string> | null = null;

async function buildRedirectMap(): Promise<Map<string, string>> {
  if (redirectMap) return redirectMap;

  const map = new Map<string, string>();

  try {
    const pagesDir = path.join(process.cwd(), 'public', 'content', 'pages');
    const files = await fs.readdir(pagesDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
      const page: PageJson = JSON.parse(content);

      if (page.url_mapping) {
        const { current_url, old_url, redirect } = page.url_mapping;

        // 只有當 old_url 存在且與 current_url 不同，並且 redirect 為 true 時才重定向
        if (old_url && old_url !== current_url && redirect) {
          // 標準化 URL（確保有尾斜線）
          const normalizedOld = old_url.endsWith('/') ? old_url : `${old_url}/`;
          const normalizedCurrent = current_url.endsWith('/') ? current_url : `${current_url}/`;
          map.set(normalizedOld, normalizedCurrent);
        }
      }
    }
  } catch (error) {
    console.error('Error building redirect map:', error);
  }

  redirectMap = map;
  return map;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // 標準化路徑（確保有尾斜線，除了靜態資源）
  const isStaticAsset = pathname.startsWith('/_astro/') ||
                        pathname.startsWith('/assets/') ||
                        pathname.includes('.');

  if (!isStaticAsset) {
    const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;

    // 檢查是否需要重定向
    const redirects = await buildRedirectMap();
    const redirectTo = redirects.get(normalizedPath);

    if (redirectTo) {
      return context.redirect(redirectTo, 301);
    }
  }

  return next();
});
