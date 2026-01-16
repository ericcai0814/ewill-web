/**
 * Response 工具測試
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { successResponse, errorResponse, ErrorCodes } from '../../../lib/utils/response';

describe('successResponse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-16T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('應建立正確的成功回應結構', () => {
    const data = { id: 1, name: 'test' };
    const response = successResponse(data);

    expect(response).toEqual({
      success: true,
      data: { id: 1, name: 'test' },
      meta: {
        timestamp: '2026-01-16T12:00:00.000Z',
        version: '1.0.0',
        cached: false,
      },
    });
  });

  it('應支援 cached 參數', () => {
    const response = successResponse({ test: true }, true);

    expect(response.meta?.cached).toBe(true);
  });

  it('應處理 null 資料', () => {
    const response = successResponse(null);

    expect(response.success).toBe(true);
    expect(response.data).toBeNull();
  });

  it('應處理陣列資料', () => {
    const data = ['item1', 'item2', 'item3'];
    const response = successResponse(data);

    expect(response.success).toBe(true);
    expect(response.data).toEqual(data);
  });

  it('應處理空物件', () => {
    const response = successResponse({});

    expect(response.success).toBe(true);
    expect(response.data).toEqual({});
  });
});

describe('errorResponse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-16T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('應建立正確的錯誤回應結構', () => {
    const response = errorResponse('TEST_ERROR', '測試錯誤訊息');

    expect(response).toEqual({
      success: false,
      data: null,
      error: {
        code: 'TEST_ERROR',
        message: '測試錯誤訊息',
      },
      meta: {
        timestamp: '2026-01-16T12:00:00.000Z',
        version: '1.0.0',
      },
    });
  });

  it('應支援 details 參數', () => {
    const response = errorResponse('VALIDATION_ERROR', '驗證失敗', {
      field: 'email',
      reason: 'invalid format',
    });

    expect(response.error?.details).toEqual({
      field: 'email',
      reason: 'invalid format',
    });
  });

  it('應在沒有 details 時不包含該欄位', () => {
    const response = errorResponse('NOT_FOUND', '找不到資源');

    expect(response.error).not.toHaveProperty('details');
  });
});

describe('ErrorCodes', () => {
  it('應包含所有預定義的錯誤碼', () => {
    expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCodes.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    expect(ErrorCodes.METHOD_NOT_ALLOWED).toBe('METHOD_NOT_ALLOWED');
    expect(ErrorCodes.RATE_LIMITED).toBe('RATE_LIMITED');
  });

  it('應與 errorResponse 搭配使用', () => {
    const response = errorResponse(ErrorCodes.NOT_FOUND, '頁面不存在');

    expect(response.error?.code).toBe('NOT_FOUND');
  });
});
