/**
 * GET /api/pages/:slug
 *
 * 取得單一頁面完整內容
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { pages } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';
import { validate, slugSchema } from '../../lib/utils/validate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  // 取得並驗證 slug
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'slug 參數無效')
    );
  }

  const validation = validate(slugSchema, slug);
  if (!validation.success) {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'slug 格式無效', {
        errors: validation.errors,
      })
    );
  }

  try {
    // 查詢頁面
    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug));

    if (!page) {
      return res.status(404).json(
        errorResponse(ErrorCodes.NOT_FOUND, `Page not found: ${slug}`)
      );
    }

    // 轉換為 PageContent 格式
    const pageContent = {
      slug: page.slug,
      module: page.module,
      template: page.template,
      seo: page.seo,
      url_mapping: page.url_mapping,
      content: page.content,
      layout: page.layout,
      aio: page.aio,
      generated_at: page.generated_at,
    };

    // 設定快取（5 分鐘）
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(successResponse(pageContent));
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤')
    );
  }
}
