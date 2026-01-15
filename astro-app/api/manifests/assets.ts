/**
 * GET /api/manifests/assets
 *
 * 取得圖片資源清單
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { assets } from '../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  try {
    // 查詢所有資源
    const allAssets = await db
      .select()
      .from(assets);

    const manifest = {
      generated_at: new Date().toISOString(),
      target: 'astro',
      assets: allAssets.map((asset) => ({
        id: asset.image_id,
        original_path: asset.original_path,
        normalized_path: asset.normalized_path,
        variants: asset.variants,
        alt: asset.alt,
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
