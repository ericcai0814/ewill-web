/**
 * Events Routes
 *
 * GET /api/events - 取得活動列表
 * GET /api/events/:id - 取得活動詳情
 */
import { Hono } from 'hono';
import { eventService } from '../services/eventService';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';

const events = new Hono();

/**
 * GET /api/events
 *
 * Query Parameters:
 * - page: 頁碼（從 1 開始，預設 1）
 * - page_size: 每頁數量（預設 10，最大 50）
 * - status: 狀態篩選（draft | published | archived）
 * - category: 分類篩選（seminar | webinar | press_release | exhibition | other）
 * - sort_by: 排序欄位（event_date | created_at，預設 event_date）
 * - sort_order: 排序方向（asc | desc，預設 desc）
 */
events.get('/', async (c) => {
  try {
    const url = new URL(c.req.url);
    const params = {
      page: parseInt(url.searchParams.get('page') || '1', 10),
      page_size: parseInt(url.searchParams.get('page_size') || '10', 10),
      status: url.searchParams.get('status') || undefined,
      category: url.searchParams.get('category') || undefined,
      sort_by: url.searchParams.get('sort_by') || 'event_date',
      sort_order: url.searchParams.get('sort_order') || 'desc',
    };

    const result = await eventService.list(params);

    return c.json(successResponse(result), 200, {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
    });
  } catch (error) {
    console.error('Events API error:', error);
    return c.json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試'),
      500
    );
  }
});

/**
 * GET /api/events/:id
 */
events.get('/:id', async (c) => {
  const id = c.req.param('id');

  if (!id) {
    return c.json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, '缺少活動 ID'),
      400
    );
  }

  try {
    const event = await eventService.getById(id);

    if (!event) {
      return c.json(
        errorResponse(ErrorCodes.NOT_FOUND, `找不到活動: ${id}`),
        404
      );
    }

    return c.json(successResponse(event), 200, {
      'Cache-Control': 's-maxage=600, stale-while-revalidate=120',
    });
  } catch (error) {
    console.error('Event detail API error:', error);
    return c.json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試'),
      500
    );
  }
});

export default events;
