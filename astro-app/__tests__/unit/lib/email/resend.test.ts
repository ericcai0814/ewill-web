/**
 * lib/email/resend.ts 單元測試
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 設定環境變數（在 import 之前）
vi.stubEnv('RESEND_API_KEY', 're_test_api_key');
vi.stubEnv('CONTACT_EMAIL', 'test@example.com');
vi.stubEnv('FROM_EMAIL', 'noreply@test.com');

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      RESEND_API_KEY: 're_test_api_key',
      CONTACT_EMAIL: 'test@example.com',
      FROM_EMAIL: 'noreply@test.com',
    },
  },
});

// Mock Resend SDK
const mockSend = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend,
      };
    },
  };
});

import { sendContactNotification } from '../../../../lib/email/resend';

describe('lib/email/resend', () => {
  const mockSubmission = {
    submission_id: 'sub_test123',
    name: '張三',
    email: 'zhangsan@example.com',
    phone: '0912-345-678',
    company: '測試公司',
    message: '這是一封測試訊息。\n包含換行。',
    source_page: '/contact',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({
      data: { id: 'email_test_id' },
      error: null,
    });
  });

  describe('sendContactNotification', () => {
    it('應該成功發送通知信', async () => {
      const result = await sendContactNotification(mockSubmission);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('應該使用正確的發送參數', async () => {
      await sendContactNotification(mockSubmission);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining('鎰威網站'),
          to: expect.arrayContaining(['test@example.com']),
          subject: expect.stringContaining('張三'),
        })
      );
    });

    it('subject 應該包含提交者姓名', async () => {
      await sendContactNotification(mockSubmission);

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.subject).toBe('[網站表單] 張三 的來信');
    });

    it('HTML 內容應該包含所有欄位', async () => {
      await sendContactNotification(mockSubmission);

      const callArgs = mockSend.mock.calls[0][0];
      const html = callArgs.html;

      expect(html).toContain('張三');
      expect(html).toContain('zhangsan@example.com');
      expect(html).toContain('0912-345-678');
      expect(html).toContain('測試公司');
      expect(html).toContain('這是一封測試訊息');
      expect(html).toContain('/contact');
      expect(html).toContain('sub_test123');
    });

    it('HTML 應該轉義 XSS 字元', async () => {
      const xssSubmission = {
        ...mockSubmission,
        name: '<script>alert("XSS")</script>',
        message: 'Test & "quotes" <b>bold</b>',
      };

      await sendContactNotification(xssSubmission);

      const callArgs = mockSend.mock.calls[0][0];
      const html = callArgs.html;

      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&amp;');
      expect(html).toContain('&quot;');
    });

    it('訊息中的換行應該轉換為 <br>', async () => {
      await sendContactNotification(mockSubmission);

      const callArgs = mockSend.mock.calls[0][0];
      const html = callArgs.html;

      expect(html).toContain('<br>');
    });

    it('選填欄位為空時應該顯示「未填寫」', async () => {
      const minimalSubmission = {
        submission_id: 'sub_test123',
        name: '測試',
        email: 'test@example.com',
        message: '測試訊息',
      };

      await sendContactNotification(minimalSubmission);

      const callArgs = mockSend.mock.calls[0][0];
      const html = callArgs.html;

      expect(html).toContain('未填寫');
    });

    it('Resend API 錯誤時應該回傳 error', async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'API Error', name: 'ResendError' },
      });

      const result = await sendContactNotification(mockSubmission);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('網路錯誤時應該捕獲例外', async () => {
      mockSend.mockRejectedValue(new Error('Network Error'));

      const result = await sendContactNotification(mockSubmission);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
    });

    it('未知錯誤時應該回傳「未知錯誤」', async () => {
      mockSend.mockRejectedValue('string error');

      const result = await sendContactNotification(mockSubmission);

      expect(result.success).toBe(false);
      expect(result.error).toBe('未知錯誤');
    });
  });
});
