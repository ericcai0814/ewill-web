/**
 * GET /api/events/:id
 *
 * 根據 ID 取得活動詳情
 */
import type { APIRoute } from 'astro';

// 標記為 server-side route（不預先渲染）
export const prerender = false;
import { db, isMockMode } from '../../../../lib/db/client';
import { events } from '../../../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../../../lib/utils/response';
import { eq } from 'drizzle-orm';
import type { EventDetail, EventStatus, EventCategory, AioData } from '@ewill/shared';

// Mock 資料：key 使用 page_slug（與 EventCard 連結格式對應）
const MOCK_EVENT_DETAILS: Record<string, EventDetail> = {
  'event_mock_1': {
    id: 'mock-event-1',
    title: '[Mock] 資安研討會 2026',
    summary: '探討最新資安趨勢與解決方案',
    category: 'seminar',
    status: 'published',
    event_date: '2026-03-15T09:00:00.000Z',
    cover_image_id: 'mock-cover-1',
    page_slug: 'event_mock_1',
    content: '# Mock 活動內容\n\n這是 CI 環境的測試資料。',
    seo: {
      title: '[Mock] 資安研討會 2026 | 鎰威科技',
      description: '探討最新資安趨勢與解決方案',
      keywords: ['security', 'seminar', 'mock'],
    },
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  'event_mock_2': {
    id: 'mock-event-2',
    title: '[Mock] 線上技術分享',
    summary: '雲端安全最佳實務',
    category: 'webinar',
    status: 'published',
    event_date: '2026-02-20T14:00:00.000Z',
    cover_image_id: 'mock-cover-2',
    page_slug: 'event_mock_2',
    content: '# Mock 線上分享\n\n這是 CI 環境的測試資料。',
    seo: {
      title: '[Mock] 線上技術分享 | 鎰威科技',
      description: '雲端安全最佳實務',
      keywords: ['cloud', 'security', 'mock'],
    },
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
};

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify(errorResponse(ErrorCodes.VALIDATION_ERROR, '缺少活動 ID')),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Mock 模式：回傳假資料
    if (isMockMode()) {
      const mockEvent = MOCK_EVENT_DETAILS[id];
      if (!mockEvent) {
        return new Response(
          JSON.stringify(errorResponse(ErrorCodes.NOT_FOUND, `[Mock] 找不到活動: ${id}`)),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify(successResponse(mockEvent)), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=600, stale-while-revalidate=120',
        },
      });
    }

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
