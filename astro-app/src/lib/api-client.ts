/**
 * 前端 API Client
 *
 * 統一的 API 調用工具，使用原生 fetch（輕量、無額外依賴）
 *
 * 使用方式：
 * ```ts
 * import { apiClient } from '@/lib/api-client';
 *
 * // POST 請求
 * const result = await apiClient.post('/api/contact/submit', { name: 'John', ... });
 *
 * // GET 請求
 * const events = await apiClient.get('/api/events', { page: 1, status: 'published' });
 * ```
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiClientOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 10000; // 10 秒

/**
 * 統一的 API Client
 */
export const apiClient = {
  /**
   * GET 請求
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>,
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';

    return this.request<T>(`${url}${queryString}`, {
      method: 'GET',
      ...options,
    });
  },

  /**
   * POST 請求
   */
  async post<T = unknown>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },

  /**
   * PUT 請求
   */
  async put<T = unknown>(
    url: string,
    body?: unknown,
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },

  /**
   * DELETE 請求
   */
  async delete<T = unknown>(
    url: string,
    options?: ApiClientOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
      ...options,
    });
  },

  /**
   * 核心請求方法
   */
  async request<T = unknown>(
    url: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = DEFAULT_TIMEOUT, headers: customHeaders, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 解析 JSON 回應
      const data = await response.json();

      // 如果後端回傳標準 ApiResponse 格式，直接返回
      if (typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>;
      }

      // 否則包裝成標準格式
      if (response.ok) {
        return { success: true, data: data as T };
      } else {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: { code: 'TIMEOUT', message: '請求逾時，請稍後再試' },
          };
        }
        return {
          success: false,
          error: { code: 'NETWORK_ERROR', message: '網路錯誤，請檢查網路連線' },
        };
      }

      return {
        success: false,
        error: { code: 'UNKNOWN_ERROR', message: '未知錯誤' },
      };
    }
  },
};

export default apiClient;
