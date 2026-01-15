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
}
