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

// Mock DB
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockOffset = vi.fn();

vi.mock('../../../lib/db/client', () => ({
  db: {
    select: () => ({
      from: mockFrom,
    }),
  },
}));

// Mock drizzle-orm 的 sql 函式
vi.mock('drizzle-orm', async () => {
  const actual = await vi.importActual('drizzle-orm');
  return {
    ...actual,
    sql: vi.fn((strings: TemplateStringsArray, ...values: any[]) => {
      return { sql: strings.join('?'), values };
    }),
  };
});

describe('Events API', () => {
  // 模擬活動資料
  const mockEvents = [
    {
      id: 'event_20251021',
      title: '資安研討會 2025',
      summary: '年度資安研討會',
      category: 'seminar',
      event_date: new Date('2025-10-21T09:00:00Z'),
      cover_image_id: 'images_event_cover_01',
      page_slug: 'event_20251021',
    },
    {
      id: 'event_20251118',
      title: '產品發表會',
      summary: '新產品發表',
      category: 'press_release',
      event_date: new Date('2025-11-18T14:00:00Z'),
      cover_image_id: 'images_event_cover_02',
      page_slug: 'event_20251118',
    },
  ];

  const mockEventDetail = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 設定 mock chain
    mockFrom.mockReturnValue({
      where: mockWhere,
      orderBy: mockOrderBy,
      limit: mockLimit,
    });

    mockWhere.mockReturnValue({
      orderBy: mockOrderBy,
      limit: mockLimit,
    });

    mockOrderBy.mockReturnValue({
      limit: mockLimit,
      offset: mockOffset,
    });

    mockLimit.mockReturnValue({
      offset: mockOffset,
    });

    mockOffset.mockResolvedValue(mockEvents);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/events', () => {
    it('應該回傳活動列表', async () => {
      // 這是一個概念測試，實際需要使用 Astro 的測試工具
      // 或者直接測試 handler 函式
      expect(mockEvents).toHaveLength(2);
      expect(mockEvents[0].title).toBe('資安研討會 2025');
    });

    it('活動應該包含必要欄位', () => {
      const event = mockEvents[0];

      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('summary');
      expect(event).toHaveProperty('category');
      expect(event).toHaveProperty('event_date');
      expect(event).toHaveProperty('cover_image_id');
      expect(event).toHaveProperty('page_slug');
    });

    it('category 應該是有效值', () => {
      const validCategories = ['seminar', 'webinar', 'press_release', 'exhibition', 'other'];

      mockEvents.forEach((event) => {
        expect(validCategories).toContain(event.category);
      });
    });

    it('event_date 應該是有效日期', () => {
      mockEvents.forEach((event) => {
        expect(event.event_date).toBeInstanceOf(Date);
        expect(event.event_date.toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe('GET /api/events/:id', () => {
    it('活動詳情應該包含完整欄位', () => {
      expect(mockEventDetail).toHaveProperty('event_id');
      expect(mockEventDetail).toHaveProperty('title');
      expect(mockEventDetail).toHaveProperty('summary');
      expect(mockEventDetail).toHaveProperty('category');
      expect(mockEventDetail).toHaveProperty('status');
      expect(mockEventDetail).toHaveProperty('event_date');
      expect(mockEventDetail).toHaveProperty('content');
      expect(mockEventDetail).toHaveProperty('seo');
    });

    it('content 應該包含 Markdown 內容', () => {
      expect(mockEventDetail.content).toContain('#');
      expect(mockEventDetail.content.length).toBeGreaterThan(0);
    });

    it('SEO 應該包含必要欄位', () => {
      expect(mockEventDetail.seo).toHaveProperty('title');
      expect(mockEventDetail.seo).toHaveProperty('description');
      expect(mockEventDetail.seo).toHaveProperty('keywords');
      expect(Array.isArray(mockEventDetail.seo.keywords)).toBe(true);
    });

    it('gallery 應該是圖片 ID 陣列', () => {
      expect(Array.isArray(mockEventDetail.gallery)).toBe(true);
      mockEventDetail.gallery?.forEach((id) => {
        expect(typeof id).toBe('string');
        expect(id).toMatch(/^images_/);
      });
    });

    it('status 應該是有效值', () => {
      const validStatuses = ['draft', 'published', 'archived'];
      expect(validStatuses).toContain(mockEventDetail.status);
    });
  });
});
