/**
 * POST /api/contact/submit
 *
 * 提交聯絡表單
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../lib/db/client';
import { contactSubmissions } from '../../lib/db/schema';
import { successResponse, errorResponse, ErrorCodes } from '../../lib/utils/response';
import { validate, contactFormSchema, sanitizeInput } from '../../lib/utils/validate';
import { sendContactNotification } from '../../lib/email/resend';

// 直接定義類型，避免 workspace 套件在 Vercel Functions 中的問題
interface ContactSubmissionResponse {
  submission_id: string;
  submitted: boolean;
  message: string;
}

/**
 * 產生唯一的 submission ID
 */
function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `sub_${timestamp}${random}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允許 POST
  if (req.method !== 'POST') {
    return res.status(405).json(
      errorResponse(ErrorCodes.METHOD_NOT_ALLOWED, '只允許 POST 請求')
    );
  }

  // 驗證輸入
  const validation = validate(contactFormSchema, req.body);
  if (!validation.success) {
    return res.status(400).json(
      errorResponse(ErrorCodes.VALIDATION_ERROR, '輸入驗證失敗', {
        errors: validation.errors,
      })
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
    ip_address: getClientIp(req),
  };

  try {
    // 儲存到資料庫
    await db.insert(contactSubmissions).values(sanitizedData);

    // 發送 Email 通知（不阻塞回應）
    sendContactNotification({
      ...data,
      submission_id: submissionId,
    }).catch((err) => {
      console.error('Email 發送失敗（已記錄到 DB）:', err);
    });

    const response: ContactSubmissionResponse = {
      submission_id: submissionId,
      submitted: true,
      message: '感謝您的來信，我們將盡快與您聯繫。',
    };

    return res.status(201).json(successResponse(response));
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, '伺服器錯誤，請稍後再試')
    );
  }
}

/**
 * 取得客戶端 IP
 */
function getClientIp(req: VercelRequest): string | null {
  // Vercel 會在 x-forwarded-for header 中提供真實 IP
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  return null;
}
