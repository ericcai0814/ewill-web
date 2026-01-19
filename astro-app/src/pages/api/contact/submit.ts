/**
 * POST /api/contact/submit
 *
 * 提交聯絡表單（Astro API Route）
 */
import type { APIRoute } from 'astro';

// 標記為 server-side route（不預先渲染）
export const prerender = false;
import { db, isMockMode } from '../../../../lib/db/client';
import { contactSubmissions } from '../../../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../../../lib/utils/response';
import { validate, contactFormSchema, sanitizeInput } from '../../../../lib/utils/validate';
import { sendContactNotification } from '../../../../lib/email/resend';
import type { ContactSubmissionResponse } from '@ewill/shared';

/**
 * 產生唯一的 submission ID
 */
function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `sub_${timestamp}${random}`;
}

/**
 * 取得客戶端 IP
 */
function getClientIp(request: Request): string | null {
  // Vercel 會在 x-forwarded-for header 中提供真實 IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  // 解析 body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify(errorResponse(ErrorCodes.VALIDATION_ERROR, '無效的 JSON 格式')),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 驗證輸入
  const validation = validate(contactFormSchema, body);
  if (!validation.success) {
    return new Response(
      JSON.stringify(
        errorResponse(ErrorCodes.VALIDATION_ERROR, '輸入驗證失敗', {
          errors: validation.errors,
        })
      ),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = validation.data;

  // 產生 submission ID
  const submissionId = generateSubmissionId();

  // 清理輸入
  const sanitizedData = {
    submission_id: submissionId,
    name: sanitizeInput(data.name),
    email: data.email.toLowerCase().trim(),
    phone: data.phone ? sanitizeInput(data.phone) : null,
    company: data.company ? sanitizeInput(data.company) : null,
    message: sanitizeInput(data.message),
    source_page: data.source_page || null,
    ip_address: getClientIp(request),
  };

  try {
    // Mock 模式：跳過資料庫操作，直接回傳成功
    if (!isMockMode()) {
      // 儲存到資料庫
      await db.insert(contactSubmissions).values(sanitizedData);

      // 發送 Email 通知（不阻塞回應）
      sendContactNotification({
        ...data,
        submission_id: submissionId,
      }).catch((err) => {
        console.error('Email 發送失敗（已記錄到 DB）:', err);
      });
    }

    const response: ContactSubmissionResponse = {
      submission_id: submissionId,
      submitted: true,
      message: isMockMode()
        ? '[Mock] 感謝您的來信，我們將盡快與您聯繫。'
        : '感謝您的來信，我們將盡快與您聯繫。',
    };

    return new Response(JSON.stringify(successResponse(response)), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify(errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// 只允許 POST
export const ALL: APIRoute = async () => {
  return new Response(
    JSON.stringify(errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 POST 請求')),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};
