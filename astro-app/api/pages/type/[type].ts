/**
 * GET /api/pages/type/:type
 *
 * 依類型篩選頁面
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../../lib/db/client';
import { pages } from '../../../lib/db/schema';
import { like, notInArray, and, inArray } from 'drizzle-orm';
import { successResponse, errorResponse, ErrorCodes } from '../../../lib/utils/response';
import { validate, pageTypeSchema } from '../../../lib/utils/validate';

// 頁面分類映射
const PAGE_TYPE_MAP: Record<string, string[]> = {
  security: [
    'acunetix', 'array', 'bitdefender', 'deep_instinct', 'fortinet',
    'ist', 'logsec', 'palo_alto', 'security_scorecard', 'sonarqube',
    'tenable_nessus', 'vicarius_vrx',
  ],
  infrastructure: ['proxmox_ve', 'ubuntu', 'vmware'],
  manufacturing: [
    'ai_agent', 'ai_forecasting', 'aps', 'cms_568', 'data_middleware',
    'jennifer_apm', 'mes', 'scm', 'wms', 'smartmanufacturing_ai',
  ],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  // 取得並驗證 type
  const { type } = req.query;

  if (typeof type !== 'string') {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'type 參數無效')
    );
  }

  const validation = validate(pageTypeSchema, type);
  if (!validation.success) {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'type 格式無效', {
        errors: validation.errors,
      })
    );
  }

  try {
    let slugs: string[] = [];

    if (type === 'event') {
      // 活動頁面：以 event_ 開頭
      const result = await db
        .select({ slug: pages.slug })
        .from(pages)
        .where(like(pages.slug, 'event_%'));
      slugs = result.map((p) => p.slug);
    } else if (type === 'general') {
      // 一般頁面：不在任何分類中
      const allCategorized = [
        ...PAGE_TYPE_MAP.security,
        ...PAGE_TYPE_MAP.infrastructure,
        ...PAGE_TYPE_MAP.manufacturing,
      ];

      const result = await db
        .select({ slug: pages.slug })
        .from(pages)
        .where(
          and(
            notInArray(pages.slug, allCategorized),
            notInArray(pages.module, ['header', 'footer'])
          )
        );

      // 再過濾掉 event_ 開頭的
      slugs = result
        .map((p) => p.slug)
        .filter((slug) => !slug.startsWith('event_'));
    } else {
      // 其他類型：根據映射表篩選
      const mappedSlugs = PAGE_TYPE_MAP[type] || [];
      if (mappedSlugs.length > 0) {
        const result = await db
          .select({ slug: pages.slug })
          .from(pages)
          .where(inArray(pages.slug, mappedSlugs));
        slugs = result.map((p) => p.slug);
      }
    }

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
