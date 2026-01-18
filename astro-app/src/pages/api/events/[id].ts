/**
 * GET /api/events/:id
 *
 * 根據 ID 取得活動詳情
 */
import type { APIRoute } from 'astro';

// 標記為 server-side route（不預先渲染）
export const prerender = false;
import { db } from '../../../../lib/db/client';
import { events } from '../../../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../../../lib/utils/response';
import { eq } from 'drizzle-orm';
import type { EventDetail, EventStatus, EventCategory, AioData } from '@ewill/shared';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify(errorResponse(ErrorCodes.VALIDATION_ERROR, '缺少活動 ID')),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 查詢活動
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.event_id, id))
      .limit(1);

    if (!event) {
      return new Response(
        JSON.stringify(errorResponse(ErrorCodes.NOT_FOUND, `找不到活動: ${id}`)),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 轉換為 EventDetail 格式
    const response: EventDetail = {
      id: event.event_id,
      title: event.title,
      summary: event.summary,
      category: event.category as EventCategory,
      status: event.status as EventStatus,
      event_date: event.event_date.toISOString(),
      end_date: event.end_date?.toISOString(),
      cover_image_id: event.cover_image_id,
      hero_image_id: event.hero_image_id || undefined,
      page_slug: event.page_slug,
      content: event.content,
      gallery: (event.gallery as string[] | null) || undefined,
      seo: event.seo as EventDetail['seo'],
      aio: (event.aio as AioData) || undefined,
      created_at: event.created_at?.toISOString() || new Date().toISOString(),
      updated_at: event.updated_at?.toISOString() || new Date().toISOString(),
    };

    return new Response(JSON.stringify(successResponse(response)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Event detail API error:', error);
    return new Response(
      JSON.stringify(errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// 只允許 GET
export const ALL: APIRoute = async () => {
  return new Response(
    JSON.stringify(errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};
