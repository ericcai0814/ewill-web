/**
 * lib/utils/response.ts 單元測試
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { successResponse, errorResponse, ErrorCodes } from '../../../../lib/utils/response';

describe('lib/utils/response', () => {
  // Mock Date 以確保 timestamp 一致性
  const mockDate = new Date('2024-01-15T10:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('successResponse', () => {
    it('應該回傳正確的成功回應結構', () => {
      const data = { id: 1, name: 'test' };
      const response = successResponse(data);

      expect(response).toEqual({
        success: true,
        data: { id: 1, name: 'test' },
        meta: {
          timestamp: '2024-01-15T10:00:00.000Z',
          version: '1.0.0',
          cached: false,
        },
      });
    });

    it('應該支援 cached 參數', () => {
      const data = { message: 'hello' };
      const response = successResponse(data, true);

      expect(response.meta.cached).toBe(true);
    });

    it('應該支援空物件作為 data', () => {
      const response = successResponse({});

      expect(response.success).toBe(true);
      expect(response.data).toEqual({});
    });

    it('應該支援陣列作為 data', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const response = successResponse(data);

      expect(response.data).toHaveLength(2);
      expect(response.data[0]).toEqual({ id: 1 });
    });

    it('應該支援 null 作為 data', () => {
      const response = successResponse(null);

      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });

    it('應該支援 string 作為 data', () => {
      const response = successResponse('hello');

      expect(response.data).toBe('hello');
    });

    it('應該支援 number 作為 data', () => {
      const response = successResponse(42);

      expect(response.data).toBe(42);
    });

    it('應該支援 boolean 作為 data', () => {
      const response = successResponse(true);

      expect(response.data).toBe(true);
    });
  });

  describe('errorResponse', () => {
    it('應該回傳正確的錯誤回應結構', () => {
      const response = errorResponse('TEST_ERROR', '測試錯誤訊息');

      expect(response).toEqual({
        success: false,
        data: null,
        error: {
          code: 'TEST_ERROR',
          message: '測試錯誤訊息',
        },
        meta: {
          timestamp: '2024-01-15T10:00:00.000Z',
          version: '1.0.0',
        },
      });
    });

    it('應該支援 details 參數', () => {
      const details = { field: 'email', reason: 'invalid format' };
      const response = errorResponse('VALIDATION_ERROR', '驗證失敗', details);

      expect(response.error).toEqual({
        code: 'VALIDATION_ERROR',
        message: '驗證失敗',
        details: { field: 'email', reason: 'invalid format' },
      });
    });

    it('不傳 details 時不應該有 details 欄位', () => {
      const response = errorResponse('ERROR', 'message');

      expect(response.error).not.toHaveProperty('details');
    });

    it('應該支援空物件作為 details', () => {
      const response = errorResponse('ERROR', 'message', {});

      expect(response.error.details).toEqual({});
    });

    it('應該支援複雜的 details 結構', () => {
      const details = {
        errors: [
          { field: 'name', message: '必填' },
          { field: 'email', message: '格式錯誤' },
        ],
        count: 2,
      };
      const response = errorResponse('VALIDATION_ERROR', '多個欄位驗證失敗', details);

      expect(response.error.details).toEqual(details);
    });
  });

  describe('ErrorCodes', () => {
    it('應該包含所有預期的錯誤碼', () => {
      expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCodes.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCodes.METHOD_NOT_ALLOWED).toBe('METHOD_NOT_ALLOWED');
      expect(ErrorCodes.RATE_LIMITED).toBe('RATE_LIMITED');
    });

    it('應該是唯讀常數', () => {
      // TypeScript 會在編譯時檢查，這裡只確認值的存在
      const codes = Object.values(ErrorCodes);
      expect(codes).toHaveLength(5);
    });
  });
});
