/**
 * API Provider
 * 透過 HTTP API 取得資料
 */
import { getConfig } from '../config';
import type { DataProvider } from '../types/provider';
import type {
  PageContent,
  ContentManifest,
  AssetManifest,
  AssetEntry,
} from '../../utils/content';
import type { ApiResponse } from '../types/api';
import type {
  EventDetail,
  EventListResponse,
  EventQueryParams,
  FormConfigResponse,
} from '@ewill/shared';

export class ApiProvider implements DataProvider {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    const config = getConfig();
    this.baseUrl = config.apiBaseUrl;
    this.timeout = config.apiTimeout;
  }

  private async fetch<T>(endpoint: string): Promise<T | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`ApiProvider: API 回傳 ${response.status}`);
        return null;
      }

      const result: ApiResponse<T> = await response.json();

      if (!result.success) {
        console.error(`ApiProvider: API 錯誤`, result.error);
        return null;
      }

      return result.data;
    } catch (error) {
      console.error(`ApiProvider: 請求失敗 ${endpoint}`, error);
      return null;
    }
  }

  async getPageContent(slug: string): Promise<PageContent | null> {
    return this.fetch<PageContent>(`/pages/${slug}`);
  }

  async getAllPages(): Promise<string[]> {
    const manifest = await this.getContentManifest();
    if (!manifest) return [];

    const excludeModules = ['header', 'footer'];
    return manifest.pages
      .filter((page) => !excludeModules.includes(page.module))
      .map((page) => page.slug);
  }

  async getContentManifest(): Promise<ContentManifest | null> {
    return this.fetch<ContentManifest>('/manifest');
  }

  async getAssetManifest(): Promise<AssetManifest | null> {
    return this.fetch<AssetManifest>('/assets/manifest');
  }

  async getAssetById(imageId: string): Promise<AssetEntry | null> {
    return this.fetch<AssetEntry>(`/assets/${imageId}`);
  }

  // ========== Event Methods ==========

  async getEvents(params?: EventQueryParams): Promise<EventListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';

    const result = await this.fetch<EventListResponse>(endpoint);
    return result || {
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
      has_more: false,
    };
  }

  async getEventById(id: string): Promise<EventDetail | null> {
    return this.fetch<EventDetail>(`/events/${id}`);
  }

  // ========== Form Config Methods ==========

  async getFormConfig(formId: string): Promise<FormConfigResponse | null> {
    return this.fetch<FormConfigResponse>(`/forms/${formId}`);
  }
}
