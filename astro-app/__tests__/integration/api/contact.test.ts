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

// Mock DB client - 使用 vi.hoisted 確保變數在 mock 前可用
const { mockInsertValues, mockDb } = vi.hoisted(() => {
  const mockInsertValues = vi.fn().mockResolvedValue([{ id: 1 }]);
  const mockDb = {
    insert: vi.fn().mockReturnValue({
      values: mockInsertValues,
    }),
  };
  return { mockInsertValues, mockDb };
});

vi.mock('../../../lib/db/client', () => ({
  db: mockDb,
  isMockMode: () => false,
}));

// Mock Resend
const { mockSend } = vi.hoisted(() => {
  const mockSend = vi.fn().mockResolvedValue({
    data: { id: 'email_123' },
    error: null,
  });
  return { mockSend };
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

// Import handlers after mocks
import { POST, ALL } from '../../../src/pages/api/contact/submit';

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

  // Helper function to create mock Request
  function createRequest(body: unknown, options: RequestInit = {}): Request {
    return new Request('http://localhost:4321/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  // Helper function to create mock context
  function createContext(request: Request) {
    return {
      request,
      params: {},
      props: {},
      redirect: vi.fn(),
      url: new URL(request.url),
      site: new URL('http://localhost:4321'),
      generator: 'Astro',
      cookies: {
        get: vi.fn(),
        has: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
        headers: vi.fn(),
      },
      locals: {},
      preferredLocale: undefined,
      preferredLocaleList: undefined,
      currentLocale: undefined,
    } as any;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockInsertValues.mockResolvedValue([{ id: 1 }]);
    mockSend.mockResolvedValue({ data: { id: 'email_123' }, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/contact/submit', () => {
    describe('成功提交', () => {
      it('有效的完整提交應該回傳 201', async () => {
        const request = createRequest(validSubmission);
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(201);

        const json = await response.json();
        expect(json.success).toBe(true);
        expect(json.data.submission_id).toMatch(/^sub_[a-z0-9]+$/);
        expect(json.data.submitted).toBe(true);
        expect(json.data.message).toContain('感謝');
      });

      it('有效的最小提交應該回傳 201', async () => {
        const request = createRequest(minimalSubmission);
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(201);

        const json = await response.json();
        expect(json.success).toBe(true);
      });

      it('應該呼叫 db.insert', async () => {
        const request = createRequest(validSubmission);
        const context = createContext(request);
        await POST(context);

        expect(mockInsertValues).toHaveBeenCalledTimes(1);
        expect(mockInsertValues).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '張三',
            email: 'zhangsan@example.com',
            message: '這是一封測試訊息',
          })
        );
      });

      it('email 應該轉為小寫', async () => {
        const request = createRequest({
          ...validSubmission,
          email: 'TEST@EXAMPLE.COM',
        });
        const context = createContext(request);
        await POST(context);

        expect(mockInsertValues).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
          })
        );
      });

      it('應該從 x-forwarded-for 取得 IP', async () => {
        const request = createRequest(validSubmission, {
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '192.168.1.1, 10.0.0.1',
          },
        });
        const context = createContext(request);
        await POST(context);

        expect(mockInsertValues).toHaveBeenCalledWith(
          expect.objectContaining({
            ip_address: '192.168.1.1',
          })
        );
      });
    });

    describe('驗證失敗', () => {
      it('無效的 JSON 格式應該回傳 400', async () => {
        const request = new Request('http://localhost:4321/api/contact/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json',
        });
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.message).toContain('JSON');
      });

      it('name 為空應該回傳 400', async () => {
        const request = createRequest({ ...validSubmission, name: '' });
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('VALIDATION_ERROR');
      });

      it('缺少 name 應該回傳 400', async () => {
        const { name, ...noName } = validSubmission;
        const request = createRequest(noName);
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });

      it('email 格式錯誤應該回傳 400', async () => {
        const request = createRequest({ ...validSubmission, email: 'invalid' });
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });

      it('缺少 email 應該回傳 400', async () => {
        const { email, ...noEmail } = validSubmission;
        const request = createRequest(noEmail);
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });

      it('message 為空應該回傳 400', async () => {
        const request = createRequest({ ...validSubmission, message: '' });
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });

      it('缺少 message 應該回傳 400', async () => {
        const { message, ...noMessage } = validSubmission;
        const request = createRequest(noMessage);
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });

      it('name 超過 100 字應該回傳 400', async () => {
        const request = createRequest({ ...validSubmission, name: 'a'.repeat(101) });
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });

      it('message 超過 2000 字應該回傳 400', async () => {
        const request = createRequest({ ...validSubmission, message: 'a'.repeat(2001) });
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(400);
      });
    });

    describe('錯誤處理', () => {
      it('DB 錯誤應該回傳 500', async () => {
        mockInsertValues.mockRejectedValue(new Error('DB Connection Failed'));

        const request = createRequest(validSubmission);
        const context = createContext(request);
        const response = await POST(context);

        expect(response.status).toBe(500);

        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('INTERNAL_ERROR');
      });

      it('Email 發送失敗不應該影響回應', async () => {
        mockSend.mockRejectedValue(new Error('Email Error'));

        const request = createRequest(validSubmission);
        const context = createContext(request);
        const response = await POST(context);

        // 即使 email 失敗，回應仍然是 201
        expect(response.status).toBe(201);
      });
    });

    describe('安全性', () => {
      it('XSS 字元應該被清理', async () => {
        const xssSubmission = {
          ...validSubmission,
          name: '<script>alert("XSS")</script>',
          message: 'Test & "quotes" <b>bold</b>',
        };

        const request = createRequest(xssSubmission);
        const context = createContext(request);
        await POST(context);

        expect(mockInsertValues).toHaveBeenCalledWith(
          expect.objectContaining({
            name: expect.not.stringContaining('<script>'),
            message: expect.not.stringContaining('<b>'),
          })
        );
      });

      it('空白應該被移除', async () => {
        const request = createRequest({
          ...validSubmission,
          name: '  張三  ',
          message: '  測試訊息  ',
        });
        const context = createContext(request);
        await POST(context);

        expect(mockInsertValues).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '張三',
            message: '測試訊息',
          })
        );
      });
    });
  });

  describe('其他 HTTP 方法', () => {
    it('GET 應該回傳 405', async () => {
      const request = new Request('http://localhost:4321/api/contact/submit', {
        method: 'GET',
      });
      const context = createContext(request);
      const response = await ALL(context);

      expect(response.status).toBe(405);

      const json = await response.json();
      expect(json.error.code).toBe('METHOD_NOT_ALLOWED');
    });

    it('PUT 應該回傳 405', async () => {
      const request = new Request('http://localhost:4321/api/contact/submit', {
        method: 'PUT',
        body: JSON.stringify(validSubmission),
      });
      const context = createContext(request);
      const response = await ALL(context);

      expect(response.status).toBe(405);
    });

    it('DELETE 應該回傳 405', async () => {
      const request = new Request('http://localhost:4321/api/contact/submit', {
        method: 'DELETE',
      });
      const context = createContext(request);
      const response = await ALL(context);

      expect(response.status).toBe(405);
    });
  });
});
