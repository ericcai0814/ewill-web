/**
 * GET /api/assets/:imageId
 *
 * 根據 ID 取得單一圖片資源
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { assets } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  // 取得 imageId
  const { imageId } = req.query;

  if (typeof imageId !== 'string' || !imageId) {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'imageId 參數無效')
    );
  }

  try {
    // 查詢資源
    const [asset] = await db
      .select()
      .from(assets)
      .where(eq(assets.image_id, imageId));

    if (!asset) {
      return res.status(404).json(
        errorResponse(ErrorCodes.NOT_FOUND, `Asset not found: ${imageId}`)
      );
    }

    const assetEntry = {
      id: asset.image_id,
      original_path: asset.original_path,
      normalized_path: asset.normalized_path,
      variants: asset.variants,
      alt: asset.alt,
    };

    // 設定快取（5 分鐘）
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(successResponse(assetEntry));
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤')
    );
  }
}
