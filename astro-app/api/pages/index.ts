/**
 * GET /api/pages
 *
 * 取得所有頁面 slug 清單
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { pages } from '../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  try {
    // 查詢所有頁面的 slug（排除 header/footer）
    const allPages = await db
      .select({ slug: pages.slug })
      .from(pages)
      .where((fields, { notInArray }) =>
        notInArray(fields.module, ['header', 'footer'])
      );

    const slugs = allPages.map((p) => p.slug);

    // 設定快取（5 分鐘）
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(successResponse(slugs));
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤')
    );
  }
}
