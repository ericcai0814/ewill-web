/**
 * Resend Email 整合
 *
 * 環境變數：
 * - RESEND_API_KEY: Resend API 金鑰
 * - CONTACT_EMAIL: 接收通知的 Email（預設 sales@ewill.com.tw）
 *
 * 注意：Astro 5 使用 import.meta.env 存取 .env 檔案的環境變數
 */
import { Resend } from 'resend';
import type { ContactFormSubmission } from '@ewill/shared';
import { escapeHtml } from '../utils/validate';

/**
 * 取得環境變數（同時支援 Astro/Vite 和 Node.js 環境）
 */
function getEnvVar(key: string, defaultValue?: string): string | undefined {
  return (
    (import.meta as any).env?.[key] ||
    process.env[key] ||
    defaultValue
  );
}

// 惰性初始化 Resend 客戶端
let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = getEnvVar('RESEND_API_KEY');
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// 通知接收者
function getContactEmail(): string {
  return getEnvVar('CONTACT_EMAIL', 'sales@ewill.com.tw') as string;
}

function getFromEmail(): string {
  return getEnvVar('FROM_EMAIL', 'noreply@ewill.com.tw') as string;
}

/**
 * 發送聯絡表單通知信
 */
export async function sendContactNotification(
  submission: ContactFormSubmission & { submission_id: string }
): Promise<{ success: boolean; error?: string }> {
  // 如果沒有設定 API Key，跳過發送
  const apiKey = getEnvVar('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('RESEND_API_KEY 未設定，跳過 Email 發送');
    return { success: true };
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: `鎰威網站 <${getFromEmail()}>`,
      to: [getContactEmail()],
      subject: `[網站表單] ${submission.name} 的來信`,
      html: generateEmailHtml(submission),
    });

    if (error) {
      console.error('Resend 發送失敗:', error);
      return { success: false, error: error.message };
    }

    console.log('Email 發送成功:', data?.id);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知錯誤';
    console.error('Email 發送例外:', message);
    return { success: false, error: message };
  }
}

/**
 * 產生 Email HTML 內容
 */
function generateEmailHtml(
  submission: ContactFormSubmission & { submission_id: string }
): string {
  const safeName = escapeHtml(submission.name);
  const safeEmail = escapeHtml(submission.email);
  const safePhone = submission.phone ? escapeHtml(submission.phone) : '未填寫';
  const safeCompany = submission.company ? escapeHtml(submission.company) : '未填寫';
  const safeMessage = escapeHtml(submission.message).replace(/\n/g, '<br>');
  const sourcePage = submission.source_page ? escapeHtml(submission.source_page) : '未知';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 16px; }
        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .value { margin-top: 4px; }
        .message-box { background: white; padding: 16px; border-radius: 4px; border-left: 4px solid #1e3a5f; }
        .footer { margin-top: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">新的聯絡表單提交</h2>
          <p style="margin: 8px 0 0; opacity: 0.8;">ID: ${submission.submission_id}</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">姓名</div>
            <div class="value">${safeName}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
          </div>
          <div class="field">
            <div class="label">電話</div>
            <div class="value">${safePhone}</div>
          </div>
          <div class="field">
            <div class="label">公司</div>
            <div class="value">${safeCompany}</div>
          </div>
          <div class="field">
            <div class="label">來源頁面</div>
            <div class="value">${sourcePage}</div>
          </div>
          <div class="field">
            <div class="label">訊息內容</div>
            <div class="message-box">${safeMessage}</div>
          </div>
        </div>
        <div class="footer">
          此信件由鎰威科技網站自動發送，請勿直接回覆。
        </div>
      </div>
    </body>
    </html>
  `;
}
