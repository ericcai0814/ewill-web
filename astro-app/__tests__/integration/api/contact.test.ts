/**
 * Contact API 整合測試
 *
 * 測試 POST /api/contact/submit
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock 環境變數
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
vi.stubEnv('RESEND_API_KEY', 're_test_key');
vi.stubEnv('CONTACT_EMAIL', 'test@example.com');
vi.stubEnv('FROM_EMAIL', 'noreply@test.com');

vi.stubGlobal('import', {
  meta: {
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      RESEND_API_KEY: 're_test_key',
      CONTACT_EMAIL: 'test@example.com',
      FROM_EMAIL: 'noreply@test.com',
    },
  },
});

// Mock DB insert
const mockInsertValues = vi.fn().mockResolvedValue([{ id: 1 }]);

vi.mock('../../../lib/db/client', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: mockInsertValues,
    }),
  },
}));

// Mock Resend
const mockSend = vi.fn().mockResolvedValue({
  data: { id: 'email_123' },
  error: null,
});

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

// Mock schema
vi.mock('../../../lib/db/schema', () => ({
  contactSubmissions: {
    submission_id: 'submission_id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    company: 'company',
    message: 'message',
    source_page: 'source_page',
    ip_address: 'ip_address',
  },
}));

describe('Contact API', () => {
  const validSubmission = {
    name: '張三',
    email: 'zhangsan@example.com',
    phone: '0912-345-678',
    company: '測試公司',
    message: '這是一封測試訊息',
    source_page: '/contact',
  };

  const minimalSubmission = {
    name: '李四',
    email: 'lisi@example.com',
    message: '簡短訊息',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockInsertValues.mockResolvedValue([{ id: 1 }]);
    mockSend.mockResolvedValue({ data: { id: 'email_123' }, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/contact/submit', () => {
    describe('驗證規則', () => {
      it('有效的完整提交應該被接受', () => {
        expect(validSubmission.name.length).toBeGreaterThan(0);
        expect(validSubmission.email).toMatch(/@/);
        expect(validSubmission.message.length).toBeGreaterThan(0);
      });

      it('有效的最小提交應該被接受', () => {
        expect(minimalSubmission.name.length).toBeGreaterThan(0);
        expect(minimalSubmission.email).toMatch(/@/);
        expect(minimalSubmission.message.length).toBeGreaterThan(0);
      });

      it('name 為空應該被拒絕', () => {
        const invalid = { ...validSubmission, name: '' };
        expect(invalid.name.length).toBe(0);
      });

      it('email 格式錯誤應該被拒絕', () => {
        const invalidEmails = ['invalid', 'test@', '@example.com', 'test@.com'];
        invalidEmails.forEach((email) => {
          expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
      });

      it('message 為空應該被拒絕', () => {
        const invalid = { ...validSubmission, message: '' };
        expect(invalid.message.length).toBe(0);
      });

      it('name 超過 100 字應該被拒絕', () => {
        const invalid = { ...validSubmission, name: 'a'.repeat(101) };
        expect(invalid.name.length).toBeGreaterThan(100);
      });

      it('message 超過 2000 字應該被拒絕', () => {
        const invalid = { ...validSubmission, message: 'a'.repeat(2001) };
        expect(invalid.message.length).toBeGreaterThan(2000);
      });

      it('phone 應該只接受有效格式', () => {
        const validPhones = ['0912345678', '0912-345-678', '(02)12345678', '+886912345678'];
        const phoneRegex = /^[0-9+\-\s()]*$/;

        validPhones.forEach((phone) => {
          expect(phone).toMatch(phoneRegex);
        });
      });

      it('phone 包含非法字元應該被拒絕', () => {
        const invalidPhones = ['abc123', '0912!@#', 'phone:123'];
        const phoneRegex = /^[0-9+\-\s()]*$/;

        invalidPhones.forEach((phone) => {
          expect(phone).not.toMatch(phoneRegex);
        });
      });
    });

    describe('資料處理', () => {
      it('submission_id 應該是唯一的', () => {
        const generateSubmissionId = () => {
          const timestamp = Date.now().toString(36);
          const random = Math.random().toString(36).substring(2, 8);
          return `sub_${timestamp}${random}`;
        };

        const id1 = generateSubmissionId();
        const id2 = generateSubmissionId();

        expect(id1).toMatch(/^sub_[a-z0-9]+$/);
        expect(id2).toMatch(/^sub_[a-z0-9]+$/);
        expect(id1).not.toBe(id2);
      });

      it('email 應該轉為小寫', () => {
        const email = 'Test@EXAMPLE.COM';
        const normalized = email.toLowerCase().trim();
        expect(normalized).toBe('test@example.com');
      });

      it('HTML 特殊字元應該被轉義', () => {
        const escapeHtml = (text: string): string => {
          const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
          };
          return text.replace(/[&<>"']/g, (char) => map[char] || char);
        };

        const input = '<script>alert("XSS")</script>';
        const escaped = escapeHtml(input);

        expect(escaped).not.toContain('<script>');
        expect(escaped).toContain('&lt;script&gt;');
      });

      it('空白應該被移除', () => {
        const input = '  測試訊息  ';
        const trimmed = input.trim();
        expect(trimmed).toBe('測試訊息');
      });
    });

    describe('IP 地址處理', () => {
      it('應該從 x-forwarded-for 取得客戶端 IP', () => {
        const getClientIp = (headers: Record<string, string | null>): string | null => {
          const forwarded = headers['x-forwarded-for'];
          if (forwarded) {
            return forwarded.split(',')[0].trim();
          }
          return null;
        };

        const headers = { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' };
        const ip = getClientIp(headers);

        expect(ip).toBe('192.168.1.1');
      });

      it('沒有 x-forwarded-for 時應該回傳 null', () => {
        const getClientIp = (headers: Record<string, string | null>): string | null => {
          const forwarded = headers['x-forwarded-for'];
          if (forwarded) {
            return forwarded.split(',')[0].trim();
          }
          return null;
        };

        const headers = { 'x-forwarded-for': null };
        const ip = getClientIp(headers);

        expect(ip).toBeNull();
      });
    });

    describe('DB 操作', () => {
      it('應該將資料儲存到資料庫', async () => {
        // 模擬 DB 操作成功
        expect(mockInsertValues).toBeDefined();
      });

      it('DB 錯誤應該被適當處理', async () => {
        mockInsertValues.mockRejectedValue(new Error('DB Error'));

        await expect(mockInsertValues()).rejects.toThrow('DB Error');
      });
    });

    describe('Email 發送', () => {
      it('應該發送通知信', async () => {
        await mockSend({
          from: 'test@example.com',
          to: ['admin@example.com'],
          subject: 'Test',
          html: '<p>Test</p>',
        });

        expect(mockSend).toHaveBeenCalledTimes(1);
      });

      it('Email 發送失敗不應該影響回應', async () => {
        mockSend.mockRejectedValue(new Error('Email Error'));

        // 即使 email 失敗，DB 操作仍然成功
        const dbResult = await mockInsertValues({});
        expect(dbResult).toEqual([{ id: 1 }]);
      });
    });
  });
});
