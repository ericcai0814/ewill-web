/**
 * GET /api/manifest
 * 取得內容清單
 */
import type { APIRoute } from 'astro';
import { dataService } from '../../services';
import type { ApiResponse } from '../../services/types/api';
import type { ContentManifest } from '../../utils/content';

export const prerender = false;

export const GET: APIRoute = async () => {
  const manifest = await dataService.getContentManifest();

  if (!manifest) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Manifest not found',
      },
    };
    return new Response(JSON.stringify(response), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response: ApiResponse<ContentManifest> = {
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
