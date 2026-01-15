/**
 * API Response 標準格式
 * Mock data 結構即為未來 API 回傳格式
 */

/** 基礎 API Response */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: ApiError;
  meta?: ApiMeta;
}

/** API 錯誤格式 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** API Metadata */
export interface ApiMeta {
  timestamp: string;
  version: string;
  cached?: boolean;
}

// ========== Contact Form ==========

/** Contact Form 提交請求 */
export interface ContactSubmitRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  /** 來源頁面 */
  source_page?: string;
  /** reCAPTCHA token（未來擴充） */
  recaptcha_token?: string;
}

/** Contact Form 提交回應 */
export interface ContactSubmitResponse {
  /** 提交 ID */
  submission_id: string;
  /** 是否成功 */
  submitted: boolean;
  /** 確認訊息 */
  message: string;
}

// ========== Type Aliases ==========

/** 頁面內容 API Response */
export type PageContentResponse<T = unknown> = ApiResponse<T>;

/** Manifest API Response */
export type ManifestResponse<T = unknown> = ApiResponse<T>;

/** Asset API Response */
export type AssetResponse<T = unknown> = ApiResponse<T>;
