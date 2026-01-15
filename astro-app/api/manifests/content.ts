/**
 * GET /api/manifests/content
 *
 * 取得內容清單索引
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { pages } from '../../lib/db/schema';
import { notInArray, max } from 'drizzle-orm';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  try {
    // 查詢所有頁面（排除 header/footer）
    const allPages = await db
      .select({
        slug: pages.slug,
        module: pages.module,
        generated_at: pages.generated_at,
      })
      .from(pages)
      .where(notInArray(pages.module, ['header', 'footer']));

    // 取得最新的 generated_at
    const latestDate = allPages.reduce((latest, page) => {
      return page.generated_at > latest ? page.generated_at : latest;
    }, '');

    const manifest = {
      generated_at: latestDate,
      pages: allPages.map((page) => ({
        slug: page.slug,
        module: page.module,
        path: `pages/${page.slug}.json`,
      })),
    };

    // 設定快取（5 分鐘）
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(successResponse(manifest));
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤')
    );
  }
}
