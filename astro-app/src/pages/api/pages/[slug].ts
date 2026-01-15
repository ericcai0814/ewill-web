/**
 * GET /api/pages/:slug
 * 取得單一頁面內容
 */
import type { APIRoute } from 'astro';
import { dataService } from '../../../services';
import type { ApiResponse } from '../../../services/types/api';
import type { PageContent } from '../../../utils/content';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing slug parameter',
      },
    };
    return new Response(JSON.stringify(response), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const page = await dataService.getPageContent(slug);

  if (!page) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Page not found: ${slug}`,
      },
    };
    return new Response(JSON.stringify(response), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response: ApiResponse<PageContent> = {
    success: true,
    data: page,
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
