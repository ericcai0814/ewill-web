/**
 * GET /api/assets/manifest
 * 取得圖片資源清單
 */
import type { APIRoute } from 'astro';
import { dataService } from '../../../services';
import type { ApiResponse } from '../../../services/types/api';
import type { AssetManifest } from '../../../utils/content';

export const prerender = false;

export const GET: APIRoute = async () => {
  const manifest = await dataService.getAssetManifest();

  if (!manifest) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Asset manifest not found',
      },
    };
    return new Response(JSON.stringify(response), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response: ApiResponse<AssetManifest> = {
    success: true,
    data: manifest,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
