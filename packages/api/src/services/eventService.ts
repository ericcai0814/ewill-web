/**
 * Event Service
 *
 * 活動業務邏輯
 */
import { db, isMockMode } from '../db';
import { events } from '../db/schema';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import type {
  EventListResponse,
  EventDetail,
  EventStatus,
  EventCategory,
  AioData,
} from '@ewill/shared';

const VALID_STATUS: EventStatus[] = ['draft', 'published', 'archived'];
const VALID_CATEGORY: EventCategory[] = [
  'seminar',
  'webinar',
  'press_release',
  'exhibition',
  'other',
];
const VALID_SORT_BY = ['event_date', 'created_at'] as const;
const VALID_SORT_ORDER = ['asc', 'desc'] as const;

// Mock 資料：用於沒有 DATABASE_URL 的 CI 環境
const MOCK_EVENTS: EventListResponse['items'] = [
  {
    id: 'mock-event-1',
    title: '[Mock] 資安研討會 2026',
    summary: '探討最新資安趨勢與解決方案',
    category: 'seminar',
    event_date: '2026-03-15T09:00:00.000Z',
    cover_image_id: 'mock-cover-1',
    page_slug: 'event_mock_1',
  },
  {
    id: 'mock-event-2',
    title: '[Mock] 線上技術分享',
    summary: '雲端安全最佳實務',
    category: 'webinar',
    event_date: '2026-02-20T14:00:00.000Z',
    cover_image_id: 'mock-cover-2',
    page_slug: 'event_mock_2',
  },
];

const MOCK_EVENT_DETAILS: Record<string, EventDetail> = {
  event_mock_1: {
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
  event_mock_2: {
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

export interface EventQueryParams {
  page?: number;
  page_size?: number;
  status?: string;
  category?: string;
  sort_by?: string;
  sort_order?: string;
}

export const eventService = {
  /**
   * 取得活動列表（支援分頁、篩選、排序）
   */
  async list(params: EventQueryParams): Promise<EventListResponse> {
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(50, Math.max(1, params.page_size || 10));
    const offset = (page - 1) * pageSize;
    const { status, category, sort_by, sort_order } = params;

    // Mock 模式：回傳假資料
    if (isMockMode()) {
      return {
        items: MOCK_EVENTS.slice(offset, offset + pageSize),
        total: MOCK_EVENTS.length,
        page,
        page_size: pageSize,
        has_more: offset + pageSize < MOCK_EVENTS.length,
      };
    }

    // 建立篩選條件
    const conditions = [];

    if (status && VALID_STATUS.includes(status as EventStatus)) {
      conditions.push(eq(events.status, status));
    }

    if (category && VALID_CATEGORY.includes(category as EventCategory)) {
      conditions.push(eq(events.category, category));
    }

    // 驗證排序參數
    const validSortBy = VALID_SORT_BY.includes(
      sort_by as (typeof VALID_SORT_BY)[number]
    )
      ? (sort_by as (typeof VALID_SORT_BY)[number])
      : 'event_date';
    const validSortOrder = VALID_SORT_ORDER.includes(
      sort_order as (typeof VALID_SORT_ORDER)[number]
    )
      ? (sort_order as (typeof VALID_SORT_ORDER)[number])
      : 'desc';

    // 建立排序
    const sortColumn =
      validSortBy === 'event_date' ? events.event_date : events.created_at;
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

    return {
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
  },

  /**
   * 根據 ID 取得活動詳情
   */
  async getById(id: string): Promise<EventDetail | null> {
    // Mock 模式：回傳假資料
    if (isMockMode()) {
      return MOCK_EVENT_DETAILS[id] || null;
    }

    // 查詢活動
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.event_id, id))
      .limit(1);

    if (!event) {
      return null;
    }

    // 轉換為 EventDetail 格式
    return {
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
  },
};
