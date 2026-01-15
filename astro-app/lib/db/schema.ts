/**
 * Drizzle ORM Schema 定義
 *
 * 使用 Neon PostgreSQL（Serverless）
 */
import { pgTable, serial, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

/**
 * 頁面表 - 儲存所有頁面內容
 */
export const pages = pgTable(
  'pages',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    module: text('module').notNull(),
    template: text('template'), // 'product' | 'event' | 'general' | 'contact' | 'home'
    seo: jsonb('seo').notNull(), // SEO JSON
    url_mapping: jsonb('url_mapping'), // URL 配置
    content: jsonb('content'), // TemplateContent
    layout: jsonb('layout'), // 舊版 layout
    aio: jsonb('aio'), // AIO 結構化資料
    generated_at: text('generated_at').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('pages_slug_idx').on(table.slug),
    index('pages_module_idx').on(table.module),
    index('pages_template_idx').on(table.template),
  ]
);

/**
 * 資源表 - 儲存圖片資源 metadata
 */
export const assets = pgTable(
  'assets',
  {
    id: serial('id').primaryKey(),
    image_id: text('image_id').notNull().unique(),
    original_path: text('original_path').notNull(),
    normalized_path: text('normalized_path').notNull(),
    variants: jsonb('variants').notNull(), // { desktop, mobile }
    alt: text('alt').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('assets_image_id_idx').on(table.image_id),
  ]
);

/**
 * 聯絡表單提交表
 */
export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: serial('id').primaryKey(),
    submission_id: text('submission_id').notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    company: text('company'),
    message: text('message').notNull(),
    source_page: text('source_page'),
    ip_address: text('ip_address'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('contact_email_idx').on(table.email),
    index('contact_created_at_idx').on(table.created_at),
  ]
);

// 型別匯出
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
