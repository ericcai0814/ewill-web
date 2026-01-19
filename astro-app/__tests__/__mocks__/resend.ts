/**
 * Resend Email Mock
 *
 * Mock Resend SDK，用於測試 email 發送功能
 */
import { vi } from 'vitest';

// Mock email 發送結果
export interface MockEmailResult {
  data: { id: string } | null;
  error: { message: string; name: string } | null;
}

// 預設成功結果
const defaultSuccessResult: MockEmailResult = {
  data: { id: 'mock-email-id-123' },
  error: null,
};

// 預設失敗結果
const defaultErrorResult: MockEmailResult = {
  data: null,
  error: { message: 'Mock error', name: 'MockError' },
};

// Mock emails.send 方法
export const mockSend = vi.fn<[], Promise<MockEmailResult>>().mockResolvedValue(defaultSuccessResult);

// Mock Resend 類別
export const MockResend = vi.fn().mockImplementation(() => ({
  emails: {
    send: mockSend,
  },
}));

// Helper: 設定成功回應
export function mockSendSuccess(emailId = 'mock-email-id-123') {
  mockSend.mockResolvedValue({
    data: { id: emailId },
    error: null,
  });
}

// Helper: 設定失敗回應
export function mockSendError(message = 'Mock error') {
  mockSend.mockResolvedValue({
    data: null,
    error: { message, name: 'MockError' },
  });
}

// Helper: 設定拋出例外
export function mockSendThrow(error = new Error('Network error')) {
  mockSend.mockRejectedValue(error);
}

// 重設所有 mock
export function resetResendMocks() {
  mockSend.mockClear();
  mockSend.mockResolvedValue(defaultSuccessResult);
}

export default {
  Resend: MockResend,
  mockSend,
  mockSendSuccess,
  mockSendError,
  mockSendThrow,
  resetResendMocks,
};
