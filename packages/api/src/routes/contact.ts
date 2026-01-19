/**
 * Contact Routes
 *
 * POST /api/contact/submit - 提交聯絡表單
 */
import { Hono } from 'hono';
import { contactService } from '../services/contactService';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';

const contact = new Hono();

/**
 * 取得客戶端 IP
 */
function getClientIp(c: { req: { header: (name: string) => string | undefined } }): string | null {
  // Vercel/Cloudflare 會在 x-forwarded-for header 中提供真實 IP
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return null;
}

/**
 * POST /api/contact/submit
 */
contact.post('/submit', async (c) => {
  // 解析 body
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, '無效的 JSON 格式'),
      400
    );
  }

  try {
    const result = await contactService.submit({
      data: body,
      ipAddress: getClientIp(c),
    });

    if (!result.success) {
      return c.json(
        errorResponse(ErrorCodes.VALIDATION_ERROR, result.error, result.details as Record<string, unknown>),
        400
      );
    }

    return c.json(successResponse(result.data), 201);
  } catch (error) {
    console.error('Contact API error:', error);
    return c.json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試'),
      500
    );
  }
});

/**
 * POST /api/contact (alias for /api/contact/submit)
 */
contact.post('/', async (c) => {
  // 解析 body
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, '無效的 JSON 格式'),
      400
    );
  }

  try {
    const result = await contactService.submit({
      data: body,
      ipAddress: getClientIp(c),
    });

    if (!result.success) {
      return c.json(
        errorResponse(ErrorCodes.VALIDATION_ERROR, result.error, result.details as Record<string, unknown>),
        400
      );
    }

    return c.json(successResponse(result.data), 201);
  } catch (error) {
    console.error('Contact API error:', error);
    return c.json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試'),
      500
    );
  }
});

export default contact;
