/**
 * lib/utils/validate.ts 單元測試
 */
import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  slugSchema,
  pageTypeSchema,
  validate,
  escapeHtml,
  sanitizeInput,
  type ContactFormInput,
} from '../../../../lib/utils/validate';

describe('lib/utils/validate', () => {
  describe('contactFormSchema', () => {
    it('應該接受有效的聯絡表單資料', () => {
      const validData: ContactFormInput = {
        name: '張三',
        email: 'test@example.com',
        message: '這是測試訊息',
      };

      const result = validate(contactFormSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('應該接受包含選填欄位的完整資料', () => {
      const validData: ContactFormInput = {
        name: '張三',
        email: 'test@example.com',
        phone: '0912-345-678',
        company: '測試公司',
        message: '這是測試訊息',
        source_page: '/contact',
      };

      const result = validate(contactFormSchema, validData);
      expect(result.success).toBe(true);
    });

    describe('name 欄位驗證', () => {
      it('應該拒絕空的姓名', () => {
        const data = { name: '', email: 'test@example.com', message: 'test' };
        const result = validate(contactFormSchema, data);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.errors[0].path).toContain('name');
        }
      });

      it('應該拒絕超過 100 字的姓名', () => {
        const data = {
          name: 'a'.repeat(101),
          email: 'test@example.com',
          message: 'test',
        };
        const result = validate(contactFormSchema, data);

        expect(result.success).toBe(false);
      });

      it('應該接受剛好 100 字的姓名', () => {
        const data = {
          name: 'a'.repeat(100),
          email: 'test@example.com',
          message: 'test',
        };
        const result = validate(contactFormSchema, data);

        expect(result.success).toBe(true);
      });
    });

    describe('email 欄位驗證', () => {
      it('應該拒絕無效的 email 格式', () => {
        const invalidEmails = [
          'invalid',
          'invalid@',
          '@example.com',
          'test@.com',
          'test@example.',
          'test example@mail.com',
        ];

        invalidEmails.forEach((email) => {
          const data = { name: 'test', email, message: 'test' };
          const result = validate(contactFormSchema, data);
          expect(result.success).toBe(false);
        });
      });

      it('應該接受有效的 email 格式', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@example.org',
          'test123@sub.domain.com',
        ];

        validEmails.forEach((email) => {
          const data = { name: 'test', email, message: 'test' };
          const result = validate(contactFormSchema, data);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('phone 欄位驗證', () => {
      it('應該接受有效的電話格式', () => {
        const validPhones = [
          '0912345678',
          '0912-345-678',
          '(02) 1234-5678',
          '+886 912 345 678',
          '02-12345678',
        ];

        validPhones.forEach((phone) => {
          const data = { name: 'test', email: 'test@example.com', phone, message: 'test' };
          const result = validate(contactFormSchema, data);
          expect(result.success).toBe(true);
        });
      });

      it('應該拒絕包含非法字元的電話', () => {
        const invalidPhones = ['abc123', '0912345678!', 'phone: 123'];

        invalidPhones.forEach((phone) => {
          const data = { name: 'test', email: 'test@example.com', phone, message: 'test' };
          const result = validate(contactFormSchema, data);
          expect(result.success).toBe(false);
        });
      });

      it('應該接受空的電話（選填）', () => {
        const data = { name: 'test', email: 'test@example.com', message: 'test' };
        const result = validate(contactFormSchema, data);
        expect(result.success).toBe(true);
      });
    });

    describe('company 欄位驗證', () => {
      it('應該接受有效的公司名稱', () => {
        const data = {
          name: 'test',
          email: 'test@example.com',
          company: '測試公司股份有限公司',
          message: 'test',
        };
        const result = validate(contactFormSchema, data);
        expect(result.success).toBe(true);
      });

      it('應該拒絕超過 100 字的公司名稱', () => {
        const data = {
          name: 'test',
          email: 'test@example.com',
          company: 'a'.repeat(101),
          message: 'test',
        };
        const result = validate(contactFormSchema, data);
        expect(result.success).toBe(false);
      });
    });

    describe('message 欄位驗證', () => {
      it('應該拒絕空的訊息', () => {
        const data = { name: 'test', email: 'test@example.com', message: '' };
        const result = validate(contactFormSchema, data);
        expect(result.success).toBe(false);
      });

      it('應該拒絕超過 2000 字的訊息', () => {
        const data = {
          name: 'test',
          email: 'test@example.com',
          message: 'a'.repeat(2001),
        };
        const result = validate(contactFormSchema, data);
        expect(result.success).toBe(false);
      });

      it('應該接受剛好 2000 字的訊息', () => {
        const data = {
          name: 'test',
          email: 'test@example.com',
          message: 'a'.repeat(2000),
        };
        const result = validate(contactFormSchema, data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('slugSchema', () => {
    it('應該接受有效的 slug', () => {
      const validSlugs = ['index', 'about_us', 'product123', 'a', 'test_page_1'];

      validSlugs.forEach((slug) => {
        const result = slugSchema.safeParse(slug);
        expect(result.success).toBe(true);
      });
    });

    it('應該拒絕包含大寫字母的 slug', () => {
      const result = slugSchema.safeParse('About');
      expect(result.success).toBe(false);
    });

    it('應該拒絕包含連字號的 slug', () => {
      const result = slugSchema.safeParse('about-us');
      expect(result.success).toBe(false);
    });

    it('應該拒絕空的 slug', () => {
      const result = slugSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('應該拒絕超過 100 字的 slug', () => {
      const result = slugSchema.safeParse('a'.repeat(101));
      expect(result.success).toBe(false);
    });

    it('應該拒絕包含特殊字元的 slug', () => {
      const invalidSlugs = ['test!', 'test@page', 'test#1', 'test/page'];

      invalidSlugs.forEach((slug) => {
        const result = slugSchema.safeParse(slug);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('pageTypeSchema', () => {
    it('應該接受所有有效的頁面類型', () => {
      const validTypes = ['security', 'infrastructure', 'manufacturing', 'event', 'general'];

      validTypes.forEach((type) => {
        const result = pageTypeSchema.safeParse(type);
        expect(result.success).toBe(true);
      });
    });

    it('應該拒絕無效的頁面類型', () => {
      const invalidTypes = ['invalid', 'product', 'page', ''];

      invalidTypes.forEach((type) => {
        const result = pageTypeSchema.safeParse(type);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('validate', () => {
    it('成功時應該回傳 success: true 和 data', () => {
      const schema = contactFormSchema;
      const data = { name: 'test', email: 'test@example.com', message: 'hello' };

      const result = validate(schema, data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it('失敗時應該回傳 success: false 和 errors', () => {
      const schema = contactFormSchema;
      const data = { name: '', email: 'invalid', message: '' };

      const result = validate(schema, data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('escapeHtml', () => {
    it('應該轉義 & 符號', () => {
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('應該轉義 < 符號', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    it('應該轉義 > 符號', () => {
      expect(escapeHtml('a > b')).toBe('a &gt; b');
    });

    it('應該轉義雙引號', () => {
      expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('應該轉義單引號', () => {
      expect(escapeHtml("it's")).toBe('it&#x27;s');
    });

    it('應該同時轉義多個特殊字元', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('不含特殊字元時應該原樣回傳', () => {
      expect(escapeHtml('hello world')).toBe('hello world');
    });

    it('應該處理空字串', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('應該處理中文字元', () => {
      expect(escapeHtml('你好世界')).toBe('你好世界');
    });

    it('應該處理混合內容', () => {
      const input = '<div class="test">你好 & 世界</div>';
      const expected = '&lt;div class=&quot;test&quot;&gt;你好 &amp; 世界&lt;/div&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });
  });

  describe('sanitizeInput', () => {
    it('應該移除前後空白並轉義 HTML', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('應該轉義 HTML 並移除空白', () => {
      expect(sanitizeInput('  <script>  ')).toBe('&lt;script&gt;');
    });

    it('應該處理空字串', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('應該處理只有空白的字串', () => {
      expect(sanitizeInput('   ')).toBe('');
    });

    it('應該保留字串中間的空白', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });
  });
});
