/**
 * Contact Service
 *
 * 聯絡表單業務邏輯
 */
import { db, isMockMode } from '../db';
import { contactSubmissions } from '../db/schema';
import { sendContactNotification } from './emailService';
import { validate, contactFormSchema, sanitizeInput } from '../utils/validate';
import type {
  ContactFormSubmission,
  ContactSubmissionResponse,
} from '@ewill/shared';

/**
 * 產生唯一的 submission ID
 */
function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `sub_${timestamp}${random}`;
}

export interface ContactSubmitParams {
  data: unknown;
  ipAddress: string | null;
}

export const contactService = {
  /**
   * 提交聯絡表單
   */
  async submit(
    params: ContactSubmitParams
  ): Promise<
    | { success: true; data: ContactSubmissionResponse }
    | { success: false; error: string; details?: unknown }
  > {
    const { data, ipAddress } = params;

    // 驗證輸入
    const validation = validate(contactFormSchema, data);
    if (!validation.success) {
      return {
        success: false,
        error: '輸入驗證失敗',
        details: { errors: validation.errors },
      };
    }

    const validData = validation.data as ContactFormSubmission;

    // 產生 submission ID
    const submissionId = generateSubmissionId();

    // 清理輸入
    const sanitizedData = {
      submission_id: submissionId,
      name: sanitizeInput(validData.name),
      email: validData.email.toLowerCase().trim(),
      phone: validData.phone ? sanitizeInput(validData.phone) : null,
      company: validData.company ? sanitizeInput(validData.company) : null,
      message: sanitizeInput(validData.message),
      source_page: validData.source_page || null,
      ip_address: ipAddress,
    };

    // Mock 模式：跳過資料庫操作，直接回傳成功
    if (!isMockMode()) {
      // 儲存到資料庫
      await db.insert(contactSubmissions).values(sanitizedData);

      // 發送 Email 通知（不阻塞回應）
      sendContactNotification({
        ...validData,
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

    return { success: true, data: response };
  },
};
