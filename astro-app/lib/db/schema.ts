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

/**
 * 活動表 - 儲存活動資訊（動態內容）
 */
export const events = pgTable(
  'events',
  {
    id: serial('id').primaryKey(),
    event_id: text('event_id').notNull().unique(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    category: text('category').notNull(), // 'seminar' | 'webinar' | 'press_release' | 'exhibition' | 'other'
    status: text('status').notNull().default('draft'), // 'draft' | 'published' | 'archived'
    event_date: timestamp('event_date').notNull(),
    end_date: timestamp('end_date'),
    cover_image_id: text('cover_image_id').notNull(),
    hero_image_id: text('hero_image_id'),
    page_slug: text('page_slug').notNull(),
    content: text('content').notNull(),
    gallery: jsonb('gallery'), // string[]
    seo: jsonb('seo').notNull(), // { title, description, keywords, og_image? }
    aio: jsonb('aio'), // AIO 結構化資料
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('events_event_id_idx').on(table.event_id),
    index('events_status_idx').on(table.status),
    index('events_category_idx').on(table.category),
    index('events_event_date_idx').on(table.event_date),
  ]
);

/**
 * 表單配置表 - 儲存動態表單欄位配置
 */
export const formConfigs = pgTable(
  'form_configs',
  {
    id: serial('id').primaryKey(),
    form_id: text('form_id').notNull().unique(),
    title: text('title').notNull(),
    description: text('description'),
    fields: jsonb('fields').notNull(), // FormFieldConfig[]
    submit_button_text: text('submit_button_text').notNull(),
    success_message: text('success_message').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('form_configs_form_id_idx').on(table.form_id),
  ]
);

// 型別匯出
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type FormConfig = typeof formConfigs.$inferSelect;
export type NewFormConfig = typeof formConfigs.$inferInsert;
