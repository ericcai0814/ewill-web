/**
 * 輸入驗證工具
 */
import { z } from 'zod';

/**
 * 聯絡表單驗證 Schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, '姓名為必填').max(100, '姓名不可超過 100 字'),
  email: z.string().email('請輸入有效的 Email 格式'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, '電話格式不正確')
    .max(20)
    .optional(),
  company: z.string().max(100, '公司名稱不可超過 100 字').optional(),
  message: z.string().min(1, '訊息為必填').max(2000, '訊息不可超過 2000 字'),
  source_page: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Slug 驗證
 */
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9_]+$/, 'Slug 只能包含小寫字母、數字和底線');

/**
 * Page Type 驗證
 */
export const pageTypeSchema = z.enum([
  'security',
  'infrastructure',
  'manufacturing',
  'event',
  'general',
]);

export type PageTypeInput = z.infer<typeof pageTypeSchema>;

/**
 * 驗證結果型別
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: z.ZodError['errors'] };

/**
 * 安全驗證函式
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors };
}

/**
 * HTML 轉義（防 XSS）
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * 清理使用者輸入
 */
export function sanitizeInput(input: string): string {
  return escapeHtml(input.trim());
}
