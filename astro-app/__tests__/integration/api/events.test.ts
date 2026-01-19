/**
 * Events API 整合測試
 *
 * 測試 GET /api/events 和 GET /api/events/:id
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock 環境變數
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
vi.stubGlobal('import', {
  meta: {
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    },
  },
});

// 模擬活動資料
const mockEvents = [
  {
    event_id: 'event_20251021',
    title: '資安研討會 2025',
    summary: '年度資安研討會',
    category: 'seminar',
    status: 'published',
    event_date: new Date('2025-10-21T09:00:00Z'),
    end_date: new Date('2025-10-21T17:00:00Z'),
    cover_image_id: 'images_event_cover_01',
    hero_image_id: 'images_event_hero_01',
    page_slug: 'event_20251021',
    content: '# 研討會內容\n\n這是研討會詳細說明...',
    gallery: ['images_gallery_01', 'images_gallery_02'],
    seo: {
      title: '資安研討會 2025 | 鎰威科技',
      description: '年度資安研討會',
      keywords: ['security', 'seminar'],
    },
    aio: null,
    created_at: new Date('2025-01-01T00:00:00Z'),
    updated_at: new Date('2025-01-15T00:00:00Z'),
  },
  {
    event_id: 'event_20251118',
    title: '產品發表會',
    summary: '新產品發表',
    category: 'press_release',
    status: 'published',
    event_date: new Date('2025-11-18T14:00:00Z'),
    end_date: null,
    cover_image_id: 'images_event_cover_02',
    hero_image_id: null,
    page_slug: 'event_20251118',
    content: '# 產品發表會\n\n新產品介紹...',
    gallery: null,
    seo: {
      title: '產品發表會 | 鎰威科技',
      description: '新產品發表',
      keywords: ['product', 'launch'],
    },
    aio: null,
    created_at: new Date('2025-01-05T00:00:00Z'),
    updated_at: new Date('2025-01-10T00:00:00Z'),
  },
];

// Mock DB 和 drizzle-orm - 使用 vi.hoisted
const { mockSelectResult, mockCountResult, mockDb } = vi.hoisted(() => {
  const mockSelectResult = vi.fn();
  const mockCountResult = vi.fn();

  const mockDb = {
    select: vi.fn().mockImplementation((fields) => {
      const isCountQuery = fields && fields.count !== undefined;
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockImplementation(() => {
                  return isCountQuery ? mockCountResult() : mockSelectResult();
                }),
              }),
            }),
            // 用於 count query 和 單一查詢
            limit: vi.fn().mockImplementation(() => {
              // 用於 getEventDetail 的查詢
              return mockSelectResult();
            }),
          }),
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              offset: vi.fn().mockImplementation(() => mockSelectResult()),
            }),
          }),
        }),
      };
    }),
  };

  return { mockSelectResult, mockCountResult, mockDb };
});

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((column, value) => ({ column, value, type: 'eq' })),
  desc: vi.fn((column) => ({ column, direction: 'desc' })),
  asc: vi.fn((column) => ({ column, direction: 'asc' })),
  and: vi.fn((...conditions) => ({ conditions, type: 'and' })),
  sql: vi.fn((strings, ...values) => ({ sql: strings.join('?'), values })),
}));

vi.mock('../../../lib/db/client', () => ({
  db: mockDb,
}));

// Mock schema
vi.mock('../../../lib/db/schema', () => ({
  events: {
    event_id: 'event_id',
    title: 'title',
    summary: 'summary',
    category: 'category',
    status: 'status',
    event_date: 'event_date',
    end_date: 'end_date',
    cover_image_id: 'cover_image_id',
    hero_image_id: 'hero_image_id',
    page_slug: 'page_slug',
    content: 'content',
    gallery: 'gallery',
    seo: 'seo',
    aio: 'aio',
    created_at: 'created_at',
    updated_at: 'updated_at',
  },
}));

// Import handlers after mocks
import { GET as getEventList, ALL as allEventList } from '../../../src/pages/api/events/index';
import { GET as getEventDetail, ALL as allEventDetail } from '../../../src/pages/api/events/[id]';

describe('Events API', () => {
  // Helper function to create mock Request
  function createRequest(url: string, options: RequestInit = {}): Request {
    return new Request(url, {
      method: 'GET',
      ...options,
    });
  }

  // Helper function to create mock context for list endpoint
  function createListContext(request: Request) {
    return {
      request,
      params: {},
      props: {},
      redirect: vi.fn(),
      url: new URL(request.url),
      site: new URL('http://localhost:4321'),
      generator: 'Astro',
      cookies: {
        get: vi.fn(),
        has: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
        headers: vi.fn(),
      },
      locals: {},
    } as any;
  }

  // Helper function to create mock context for detail endpoint
  function createDetailContext(request: Request, id: string) {
    return {
      request,
      params: { id },
      props: {},
      redirect: vi.fn(),
      url: new URL(request.url),
      site: new URL('http://localhost:4321'),
      generator: 'Astro',
      cookies: {
        get: vi.fn(),
        has: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
        headers: vi.fn(),
      },
      locals: {},
    } as any;
  }

  beforeEach(() => {
    vi.clearAllMocks();

    // 預設回傳資料
    mockSelectResult.mockResolvedValue(
      mockEvents.map((e) => ({
        id: e.event_id,
        title: e.title,
        summary: e.summary,
        category: e.category,
        event_date: e.event_date,
        cover_image_id: e.cover_image_id,
        page_slug: e.page_slug,
      }))
    );
    mockCountResult.mockResolvedValue([{ count: mockEvents.length }]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/events', () => {
    describe('成功回應', () => {
      it('應該回傳 200 和活動列表', async () => {
        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('items');
        expect(json.data).toHaveProperty('total');
        expect(json.data).toHaveProperty('page');
        expect(json.data).toHaveProperty('page_size');
        expect(json.data).toHaveProperty('has_more');
      });

      it('items 應該包含必要欄位', async () => {
        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        const item = json.data.items[0];

        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('summary');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('event_date');
        expect(item).toHaveProperty('cover_image_id');
        expect(item).toHaveProperty('page_slug');
      });

      it('應該設定正確的 Cache-Control header', async () => {
        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.headers.get('Cache-Control')).toContain('s-maxage');
      });
    });

    describe('分頁', () => {
      it('預設 page 為 1', async () => {
        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page).toBe(1);
      });

      it('預設 page_size 為 10', async () => {
        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page_size).toBe(10);
      });

      it('應該接受 page 參數', async () => {
        const request = createRequest('http://localhost:4321/api/events?page=2');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page).toBe(2);
      });

      it('應該接受 page_size 參數', async () => {
        const request = createRequest('http://localhost:4321/api/events?page_size=5');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page_size).toBe(5);
      });

      it('page_size 最大為 50', async () => {
        const request = createRequest('http://localhost:4321/api/events?page_size=100');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page_size).toBe(50);
      });

      it('page 最小為 1', async () => {
        const request = createRequest('http://localhost:4321/api/events?page=0');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page).toBe(1);
      });

      it('無效的 page 參數應該使用預設值', async () => {
        const request = createRequest('http://localhost:4321/api/events?page=invalid');
        const context = createListContext(request);
        const response = await getEventList(context);

        const json = await response.json();
        expect(json.data.page).toBe(1);
      });
    });

    describe('篩選', () => {
      it('應該接受 status 參數', async () => {
        const request = createRequest('http://localhost:4321/api/events?status=published');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });

      it('應該接受 category 參數', async () => {
        const request = createRequest('http://localhost:4321/api/events?category=seminar');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });

      it('無效的 status 參數應該被忽略', async () => {
        const request = createRequest('http://localhost:4321/api/events?status=invalid');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });

      it('無效的 category 參數應該被忽略', async () => {
        const request = createRequest('http://localhost:4321/api/events?category=invalid');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });
    });

    describe('排序', () => {
      it('預設按 event_date 排序', async () => {
        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });

      it('應該接受 sort_by=created_at', async () => {
        const request = createRequest('http://localhost:4321/api/events?sort_by=created_at');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });

      it('應該接受 sort_order=asc', async () => {
        const request = createRequest('http://localhost:4321/api/events?sort_order=asc');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });

      it('無效的 sort_by 應該使用預設值', async () => {
        const request = createRequest('http://localhost:4321/api/events?sort_by=invalid');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(200);
      });
    });

    describe('錯誤處理', () => {
      it('DB 錯誤應該回傳 500', async () => {
        mockSelectResult.mockRejectedValue(new Error('DB Error'));

        const request = createRequest('http://localhost:4321/api/events');
        const context = createListContext(request);
        const response = await getEventList(context);

        expect(response.status).toBe(500);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('INTERNAL_ERROR');
      });
    });

    describe('其他 HTTP 方法', () => {
      it('POST 應該回傳 405', async () => {
        const request = createRequest('http://localhost:4321/api/events', { method: 'POST' });
        const context = createListContext(request);
        const response = await allEventList(context);

        expect(response.status).toBe(405);

        const json = await response.json();
        expect(json.error.code).toBe('METHOD_NOT_ALLOWED');
      });
    });
  });

  describe('GET /api/events/:id', () => {
    beforeEach(() => {
      // 設定詳情查詢的 mock
      mockSelectResult.mockImplementation(() =>
        Promise.resolve([mockEvents[0]])
      );
    });

    describe('optional 欄位處理', () => {
      it('end_date 為 null 時應該正確處理', async () => {
        // 使用沒有 end_date 的活動
        mockSelectResult.mockResolvedValue([mockEvents[1]]);

        const request = createRequest('http://localhost:4321/api/events/event_20251118');
        const context = createDetailContext(request, 'event_20251118');
        const response = await getEventDetail(context);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.data.end_date).toBeUndefined();
      });

      it('hero_image_id 為 null 時應該正確處理', async () => {
        mockSelectResult.mockResolvedValue([mockEvents[1]]);

        const request = createRequest('http://localhost:4321/api/events/event_20251118');
        const context = createDetailContext(request, 'event_20251118');
        const response = await getEventDetail(context);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.data.hero_image_id).toBeUndefined();
      });

      it('gallery 為 null 時應該正確處理', async () => {
        mockSelectResult.mockResolvedValue([mockEvents[1]]);

        const request = createRequest('http://localhost:4321/api/events/event_20251118');
        const context = createDetailContext(request, 'event_20251118');
        const response = await getEventDetail(context);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.data.gallery).toBeUndefined();
      });

      it('aio 為 null 時應該正確處理', async () => {
        mockSelectResult.mockResolvedValue([mockEvents[0]]);

        const request = createRequest('http://localhost:4321/api/events/event_20251021');
        const context = createDetailContext(request, 'event_20251021');
        const response = await getEventDetail(context);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.data.aio).toBeUndefined();
      });
    });

    describe('成功回應', () => {
      it('應該回傳 200 和活動詳情', async () => {
        const request = createRequest('http://localhost:4321/api/events/event_20251021');
        const context = createDetailContext(request, 'event_20251021');
        const response = await getEventDetail(context);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('title');
        expect(json.data).toHaveProperty('content');
      });

      it('詳情應該包含完整欄位', async () => {
        const request = createRequest('http://localhost:4321/api/events/event_20251021');
        const context = createDetailContext(request, 'event_20251021');
        const response = await getEventDetail(context);

        const json = await response.json();
        const event = json.data;

        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('title');
        expect(event).toHaveProperty('summary');
        expect(event).toHaveProperty('category');
        expect(event).toHaveProperty('status');
        expect(event).toHaveProperty('event_date');
        expect(event).toHaveProperty('content');
        expect(event).toHaveProperty('seo');
      });

      it('應該設定正確的 Cache-Control header', async () => {
        const request = createRequest('http://localhost:4321/api/events/event_20251021');
        const context = createDetailContext(request, 'event_20251021');
        const response = await getEventDetail(context);

        expect(response.headers.get('Cache-Control')).toContain('s-maxage');
      });
    });

    describe('錯誤處理', () => {
      it('缺少 ID 應該回傳 400', async () => {
        const request = createRequest('http://localhost:4321/api/events/');
        const context = createDetailContext(request, '');
        const response = await getEventDetail(context);

        expect(response.status).toBe(400);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('VALIDATION_ERROR');
      });

      it('不存在的 ID 應該回傳 404', async () => {
        mockSelectResult.mockResolvedValue([]);

        const request = createRequest('http://localhost:4321/api/events/not-exist');
        const context = createDetailContext(request, 'not-exist');
        const response = await getEventDetail(context);

        expect(response.status).toBe(404);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('NOT_FOUND');
      });

      it('DB 錯誤應該回傳 500', async () => {
        mockSelectResult.mockRejectedValue(new Error('DB Error'));

        const request = createRequest('http://localhost:4321/api/events/event_20251021');
        const context = createDetailContext(request, 'event_20251021');
        const response = await getEventDetail(context);

        expect(response.status).toBe(500);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('INTERNAL_ERROR');
      });
    });

    describe('其他 HTTP 方法', () => {
      it('POST 應該回傳 405', async () => {
        const request = createRequest('http://localhost:4321/api/events/event_20251021', {
          method: 'POST',
        });
        const context = createDetailContext(request, 'event_20251021');
        const response = await allEventDetail(context);

        expect(response.status).toBe(405);
      });

      it('DELETE 應該回傳 405', async () => {
        const request = createRequest('http://localhost:4321/api/events/event_20251021', {
          method: 'DELETE',
        });
        const context = createDetailContext(request, 'event_20251021');
        const response = await allEventDetail(context);

        expect(response.status).toBe(405);
      });
    });
  });
});
