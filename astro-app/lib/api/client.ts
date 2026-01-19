/**
 * Core Backend API Client
 *
 * 用於 BFF (Astro) 呼叫 Core Backend (@ewill/api)
 */
import type {
  ApiResponse,
  EventListResponse,
  EventDetail,
  ContactSubmissionResponse,
  ContactFormSubmission,
} from '@ewill/shared';

/**
 * 取得 API Base URL
 * - 開發環境：http://localhost:3001
 * - 生產環境：透過環境變數設定，或使用相對路徑（同 origin 部署）
 */
function getApiBase(): string {
  // Server-side: 使用 import.meta.env 或 process.env
  const apiUrl =
    (import.meta as unknown as { env?: Record<string, string> }).env?.API_URL ||
    process.env.API_URL ||
    'http://localhost:3001';
  return apiUrl;
}

/**
 * 通用 fetch 包裝器
 */
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const base = getApiBase();
  const url = `${base}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (error) {
    console.error(`API fetch error [${path}]:`, error);
    return {
      success: false,
      data: null as T,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to API server',
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }
}

/**
 * Events API
 */
export interface FetchEventsParams {
  page?: number;
  page_size?: number;
  status?: string;
  category?: string;
  sort_by?: string;
  sort_order?: string;
}

export async function fetchEvents(
  params?: FetchEventsParams
): Promise<ApiResponse<EventListResponse>> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  const path = `/api/events${query ? `?${query}` : ''}`;
  return apiFetch<EventListResponse>(path);
}

export async function fetchEvent(id: string): Promise<ApiResponse<EventDetail>> {
  return apiFetch<EventDetail>(`/api/events/${id}`);
}

/**
 * Contact API
 */
export async function submitContactForm(
  data: ContactFormSubmission
): Promise<ApiResponse<ContactSubmissionResponse>> {
  return apiFetch<ContactSubmissionResponse>('/api/contact/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Health Check
 */
export async function checkHealth(): Promise<
  ApiResponse<{
    status: string;
    timestamp: string;
    version: string;
    environment: string;
    database: string;
  }>
> {
  return apiFetch('/api/health');
}
