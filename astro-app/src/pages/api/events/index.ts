/**
 * GET /api/events
 *
 * 取得活動列表（支援分頁、篩選、排序）
 *
 * Query Parameters:
 * - page: 頁碼（從 1 開始，預設 1）
 * - page_size: 每頁數量（預設 10，最大 50）
 * - status: 狀態篩選（draft | published | archived）
 * - category: 分類篩選（seminar | webinar | press_release | exhibition | other）
 * - sort_by: 排序欄位（event_date | created_at，預設 event_date）
 * - sort_order: 排序方向（asc | desc，預設 desc）
 */
import type { APIRoute } from 'astro';

// 標記為 server-side route（不預先渲染）
export const prerender = false;
import { db } from '../../../../lib/db/client';
import { events } from '../../../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../../../lib/utils/response';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import type { EventListResponse, EventStatus, EventCategory } from '@ewill/shared';

const VALID_STATUS: EventStatus[] = ['draft', 'published', 'archived'];
const VALID_CATEGORY: EventCategory[] = ['seminar', 'webinar', 'press_release', 'exhibition', 'other'];
const VALID_SORT_BY = ['event_date', 'created_at'] as const;
const VALID_SORT_ORDER = ['asc', 'desc'] as const;

export const GET: APIRoute = async ({ request }) => {
  try {
    // 解析 URL 取得 query parameters
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const pageSizeParam = url.searchParams.get('page_size');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const sortBy = url.searchParams.get('sort_by') || 'event_date';
    const sortOrder = url.searchParams.get('sort_order') || 'desc';

    // 驗證並轉換分頁參數
    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(pageSizeParam || '10', 10) || 10));
    const offset = (page - 1) * pageSize;

    // 建立篩選條件
    const conditions = [];

    if (status && VALID_STATUS.includes(status as EventStatus)) {
      conditions.push(eq(events.status, status as string));
    }

    if (category && VALID_CATEGORY.includes(category as EventCategory)) {
      conditions.push(eq(events.category, category as string));
    }

    // 驗證排序參數
    const validSortBy = VALID_SORT_BY.includes(sortBy as typeof VALID_SORT_BY[number])
      ? (sortBy as typeof VALID_SORT_BY[number])
      : 'event_date';
    const validSortOrder = VALID_SORT_ORDER.includes(sortOrder as typeof VALID_SORT_ORDER[number])
      ? (sortOrder as typeof VALID_SORT_ORDER[number])
      : 'desc';

    // 建立排序
    const sortColumn = validSortBy === 'event_date' ? events.event_date : events.created_at;
    const orderFn = validSortOrder === 'desc' ? desc : asc;

    // 查詢資料
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: events.event_id,
          title: events.title,
          summary: events.summary,
          category: events.category,
          event_date: events.event_date,
          cover_image_id: events.cover_image_id,
          page_slug: events.page_slug,
        })
        .from(events)
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(events)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count || 0);

    const response: EventListResponse = {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        category: item.category as EventCategory,
        event_date: item.event_date.toISOString(),
        cover_image_id: item.cover_image_id,
        page_slug: item.page_slug,
      })),
      total,
      page,
      page_size: pageSize,
      has_more: offset + items.length < total,
    };

    return new Response(JSON.stringify(successResponse(response)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Events API error:', error);
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
