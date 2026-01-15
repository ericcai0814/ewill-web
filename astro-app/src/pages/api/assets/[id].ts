/**
 * GET /api/assets/:id
 * 根據 ID 取得單一圖片資源
 */
import type { APIRoute } from 'astro';
import { dataService } from '../../../services';
import type { ApiResponse } from '../../../services/types/api';
import type { AssetEntry } from '../../../utils/content';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing asset ID parameter',
      },
    };
    return new Response(JSON.stringify(response), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const asset = await dataService.getAssetById(id);

  if (!asset) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Asset not found: ${id}`,
      },
    };
    return new Response(JSON.stringify(response), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response: ApiResponse<AssetEntry> = {
    success: true,
    data: asset,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400', // 24 hours for assets
    },
  });
};
