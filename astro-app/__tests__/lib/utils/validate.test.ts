/**
 * 驗證工具測試
 */
import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  slugSchema,
  pageTypeSchema,
  validate,
  escapeHtml,
  sanitizeInput,
} from '../../../lib/utils/validate';

describe('contactFormSchema', () => {
  it('應接受有效的表單資料', () => {
    const validData = {
      name: '測試用戶',
      email: 'test@example.com',
      message: '這是一則測試訊息',
    };
    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('應接受包含選填欄位的表單資料', () => {
    const validData = {
      name: '測試用戶',
      email: 'test@example.com',
      phone: '02-1234-5678',
      company: '測試公司',
      message: '這是一則測試訊息',
      source_page: '/contact',
    };
    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('應拒絕空姓名', () => {
    const invalidData = {
      name: '',
      email: 'test@example.com',
      message: '測試訊息',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('name'))).toBe(true);
    }
  });

  it('應拒絕超過 100 字的姓名', () => {
    const invalidData = {
      name: 'a'.repeat(101),
      email: 'test@example.com',
      message: '測試訊息',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('應拒絕無效的 Email 格式', () => {
    const invalidData = {
      name: '測試用戶',
      email: 'invalid-email',
      message: '測試訊息',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('email'))).toBe(true);
    }
  });

  it('應拒絕無效的電話格式', () => {
    const invalidData = {
      name: '測試用戶',
      email: 'test@example.com',
      phone: 'abc-invalid',
      message: '測試訊息',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('phone'))).toBe(true);
    }
  });

  it('應接受有效的電話格式', () => {
    const validPhones = [
      '0912345678',
      '02-1234-5678',
      '+886-2-1234-5678',
      '(02) 1234 5678',
    ];
    validPhones.forEach((phone) => {
      const result = contactFormSchema.safeParse({
        name: '測試',
        email: 'test@example.com',
        phone,
        message: '測試訊息',
      });
      expect(result.success).toBe(true);
    });
  });

  it('應拒絕空訊息', () => {
    const invalidData = {
      name: '測試用戶',
      email: 'test@example.com',
      message: '',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('應拒絕超過 2000 字的訊息', () => {
    const invalidData = {
      name: '測試用戶',
      email: 'test@example.com',
      message: 'a'.repeat(2001),
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('slugSchema', () => {
  it('應接受有效的 slug', () => {
    const validSlugs = ['home', 'about_us', 'product123', 'event_20251021'];
    validSlugs.forEach((slug) => {
      const result = slugSchema.safeParse(slug);
      expect(result.success).toBe(true);
    });
  });

  it('應拒絕空 slug', () => {
    const result = slugSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('應拒絕包含大寫字母的 slug', () => {
    const result = slugSchema.safeParse('AboutUs');
    expect(result.success).toBe(false);
  });

  it('應拒絕包含連字號的 slug', () => {
    const result = slugSchema.safeParse('about-us');
    expect(result.success).toBe(false);
  });

  it('應拒絕包含特殊字元的 slug', () => {
    const invalidSlugs = ['about/us', 'product@123', 'test.page'];
    invalidSlugs.forEach((slug) => {
      const result = slugSchema.safeParse(slug);
      expect(result.success).toBe(false);
    });
  });

  it('應拒絕超過 100 字的 slug', () => {
    const result = slugSchema.safeParse('a'.repeat(101));
    expect(result.success).toBe(false);
  });
});

describe('pageTypeSchema', () => {
  it('應接受所有有效的頁面類型', () => {
    const validTypes = ['security', 'infrastructure', 'manufacturing', 'event', 'general'];
    validTypes.forEach((type) => {
      const result = pageTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
    });
  });

  it('應拒絕無效的頁面類型', () => {
    const invalidTypes = ['invalid', 'unknown', '', 'Security'];
    invalidTypes.forEach((type) => {
      const result = pageTypeSchema.safeParse(type);
      expect(result.success).toBe(false);
    });
  });
});

describe('validate', () => {
  it('應回傳成功結果和資料', () => {
    const result = validate(slugSchema, 'valid_slug');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('valid_slug');
    }
  });

  it('應回傳失敗結果和錯誤', () => {
    const result = validate(slugSchema, 'Invalid-Slug');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });
});

describe('escapeHtml', () => {
  it('應轉義 HTML 特殊字元', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    expect(escapeHtml('"quote"')).toBe('&quot;quote&quot;');
    expect(escapeHtml("it's")).toBe("it&#x27;s");
  });

  it('應正確處理混合特殊字元', () => {
    const input = '<div class="test">Hello & "World"</div>';
    const expected = '&lt;div class=&quot;test&quot;&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('應保持普通文字不變', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
    expect(escapeHtml('測試中文')).toBe('測試中文');
  });

  it('應處理空字串', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('sanitizeInput', () => {
  it('應去除前後空白並轉義 HTML', () => {
    expect(sanitizeInput('  Hello World  ')).toBe('Hello World');
    expect(sanitizeInput('  <script>alert(1)</script>  ')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('應處理只有空白的字串', () => {
    expect(sanitizeInput('   ')).toBe('');
  });
});
