/**
 * GET /api/events/:id
 *
 * 根據 ID 取得活動詳情
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { events } from '../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';
import { eq } from 'drizzle-orm';

// 直接定義類型，避免 workspace 套件在 Vercel Functions 中的問題
type EventStatus = 'draft' | 'published' | 'archived';
type EventCategory = 'seminar' | 'webinar' | 'press_release' | 'exhibition' | 'other';

interface AioData {
  [key: string]: unknown;
}

interface EventDetail {
  id: string;
  title: string;
  summary: string;
  category: EventCategory;
  status: EventStatus;
  event_date: string;
  end_date?: string;
  cover_image_id: string;
  hero_image_id?: string;
  page_slug: string;
  content: string;
  gallery?: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    og_image?: string;
  };
  aio?: AioData;
  created_at: string;
  updated_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 GET
  if (req.method !== 'GET') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 GET 請求')
    );
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, '缺少活動 ID')
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
      return res.status(404).json(
        errorResponse(ErrorCodes.NOT_FOUND, `找不到活動: ${id}`)
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

    // 設定快取 header（10 分鐘）
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=120');

    return res.status(200).json(successResponse(response));
  } catch (error) {
    console.error('Event detail API error:', error);
    return res.status(500).json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試')
    );
  }
}
