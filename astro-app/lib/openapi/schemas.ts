/**
 * OpenAPI 相容的 Zod Schemas
 *
 * 使用 @asteasolutions/zod-to-openapi 註冊 schemas
 */
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// 擴展 Zod 以支援 OpenAPI
extendZodWithOpenApi(z);

// ============================================================
// Common Schemas
// ============================================================

export const MetaSchema = z.object({
  timestamp: z.string().openapi({
    description: 'ISO 8601 格式的時間戳',
    example: '2026-01-16T12:00:00.000Z',
  }),
  version: z.string().openapi({
    description: 'API 版本',
    example: '1.0.0',
  }),
  cached: z.boolean().optional().openapi({
    description: '是否為快取結果',
  }),
}).openapi('Meta');

export const ErrorSchema = z.object({
  code: z.string().openapi({
    description: '錯誤碼',
    example: 'NOT_FOUND',
  }),
  message: z.string().openapi({
    description: '錯誤訊息',
    example: '找不到指定的資源',
  }),
  details: z.record(z.unknown()).optional().openapi({
    description: '額外的錯誤詳情',
  }),
}).openapi('Error');

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().openapi({
      description: '請求是否成功',
    }),
    data: dataSchema.nullable().openapi({
      description: '回應資料',
    }),
    error: ErrorSchema.optional(),
    meta: MetaSchema.optional(),
  });

// ============================================================
// Page Schemas
// ============================================================

export const SeoSchema = z.object({
  title: z.string().openapi({
    description: '頁面標題',
    example: 'Bitdefender GravityZone 企業端點防護 - 鎰威科技',
  }),
  description: z.string().openapi({
    description: '頁面描述',
    example: '鎰威科技代理 Bitdefender GravityZone 企業端點防護平台',
  }),
  keywords: z.array(z.string()).openapi({
    description: 'SEO 關鍵字',
    example: ['Bitdefender', 'EDR', '端點防護'],
  }),
  og_image: z.string().optional().openapi({
    description: 'Open Graph 圖片 URL',
  }),
}).openapi('Seo');

export const UrlMappingSchema = z.object({
  current_url: z.string().openapi({
    description: '目前 URL',
    example: '/bitdefender/',
  }),
  new_url: z.string().optional().openapi({
    description: '新 URL（重導向用）',
  }),
}).openapi('UrlMapping');

export const PageContentSchema = z.object({
  slug: z.string().openapi({
    description: '頁面 slug',
    example: 'bitdefender',
  }),
  module: z.string().openapi({
    description: '模組名稱',
    example: 'bitdefender',
  }),
  template: z.string().optional().openapi({
    description: '頁面模板',
    example: 'product',
  }),
  seo: SeoSchema,
  url_mapping: UrlMappingSchema,
  content: z.record(z.unknown()).optional().openapi({
    description: '頁面內容（Template Content）',
  }),
  layout: z.record(z.unknown()).optional().openapi({
    description: '佈局設定',
  }),
  aio: z.record(z.unknown()).optional().openapi({
    description: 'All-In-One JSON-LD 結構化資料',
  }),
  generated_at: z.string().openapi({
    description: '生成時間（ISO 8601）',
    example: '2026-01-16T12:00:00.000Z',
  }),
}).openapi('PageContent');

export const PageSlugSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9_]+$/)
  .openapi({
    description: '頁面 slug（只能包含小寫字母、數字和底線）',
    example: 'bitdefender',
  });

export const PageTypeSchema = z.enum([
  'security',
  'infrastructure',
  'manufacturing',
  'event',
  'general',
]).openapi('PageType');

// ============================================================
// Contact Form Schemas
// ============================================================

export const ContactFormInputSchema = z.object({
  name: z.string().min(1).max(100).openapi({
    description: '聯絡人姓名',
    example: '王小明',
  }),
  email: z.string().email().openapi({
    description: '電子郵件',
    example: 'contact@example.com',
  }),
  phone: z.string().regex(/^[0-9+\-\s()]*$/).max(20).optional().openapi({
    description: '聯絡電話',
    example: '02-1234-5678',
  }),
  company: z.string().max(100).optional().openapi({
    description: '公司名稱',
    example: '範例科技股份有限公司',
  }),
  message: z.string().min(1).max(2000).openapi({
    description: '訊息內容',
    example: '我想了解更多關於貴公司的產品...',
  }),
  source_page: z.string().optional().openapi({
    description: '來源頁面',
    example: '/contact/',
  }),
}).openapi('ContactFormInput');

export const ContactSubmissionResponseSchema = z.object({
  submission_id: z.string().openapi({
    description: '提交 ID',
    example: 'sub_abc123def456',
  }),
  submitted: z.boolean().openapi({
    description: '是否成功提交',
    example: true,
  }),
  message: z.string().openapi({
    description: '回應訊息',
    example: '感謝您的來信，我們將盡快與您聯繫。',
  }),
}).openapi('ContactSubmissionResponse');

// ============================================================
// Event Schemas
// ============================================================

export const EventCategorySchema = z.enum([
  'seminar',
  'webinar',
  'press_release',
  'exhibition',
  'other',
]).openapi('EventCategory');

export const EventStatusSchema = z.enum([
  'draft',
  'published',
  'archived',
]).openapi('EventStatus');

export const EventListItemSchema = z.object({
  id: z.string().openapi({ description: '活動 ID' }),
  title: z.string().openapi({ description: '活動標題' }),
  summary: z.string().openapi({ description: '活動摘要' }),
  category: EventCategorySchema,
  event_date: z.string().openapi({ description: '活動日期' }),
  cover_image_id: z.string().openapi({ description: '封面圖片 ID' }),
  page_slug: z.string().openapi({ description: '對應頁面 slug' }),
}).openapi('EventListItem');

export const EventListResponseSchema = z.object({
  items: z.array(EventListItemSchema),
  total: z.number().openapi({ description: '總數量' }),
  page: z.number().openapi({ description: '目前頁碼' }),
  page_size: z.number().openapi({ description: '每頁數量' }),
  has_more: z.boolean().openapi({ description: '是否還有更多' }),
}).openapi('EventListResponse');

// ============================================================
// Asset Schemas
// ============================================================

export const AssetVariantsSchema = z.object({
  desktop: z.string().openapi({ description: '桌面版圖片路徑' }),
  mobile: z.string().openapi({ description: '行動版圖片路徑' }),
}).openapi('AssetVariants');

export const AssetEntrySchema = z.object({
  id: z.string().openapi({ description: '資源 ID', example: 'images_hero_banner' }),
  original_path: z.string().openapi({ description: '原始檔案路徑' }),
  normalized_path: z.string().openapi({ description: '正規化後的路徑' }),
  variants: AssetVariantsSchema,
  alt: z.string().openapi({ description: '圖片替代文字' }),
}).openapi('AssetEntry');

export const AssetManifestSchema = z.object({
  generated_at: z.string().openapi({ description: '生成時間' }),
  target: z.string().openapi({ description: '目標環境' }),
  assets: z.array(AssetEntrySchema),
}).openapi('AssetManifest');

// ============================================================
// Manifest Schemas
// ============================================================

export const ContentManifestPageSchema = z.object({
  slug: z.string(),
  module: z.string(),
  path: z.string(),
}).openapi('ContentManifestPage');

export const ContentManifestSchema = z.object({
  generated_at: z.string(),
  pages: z.array(ContentManifestPageSchema),
}).openapi('ContentManifest');
