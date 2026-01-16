/**
 * API Response 工具函式
 */

// 直接定義類型，避免 workspace 套件在 Vercel Functions 中的問題
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    version: string;
    cached?: boolean;
  };
}

const API_VERSION = '1.0.0';

/**
 * 建立成功回應
 */
export function successResponse<T>(data: T, cached = false): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: API_VERSION,
      cached,
    },
  };
}

/**
 * 建立錯誤回應
 */
export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: API_VERSION,
    },
  };
}

/**
 * 常用錯誤碼
 */
export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;
