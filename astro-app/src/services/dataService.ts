/**
 * Data Service
 * 統一的資料存取層，根據設定切換 Provider
 */
import { getConfig, isDev } from './config';
import { JsonProvider, ApiProvider } from './providers';
import type { DataProvider } from './types/provider';
import type {
  PageContent,
  ContentManifest,
  AssetManifest,
  AssetEntry,
  PageType,
} from '../utils/content';
import type {
  ContactSubmitRequest,
  ContactSubmitResponse,
  ApiResponse,
} from './types/api';

// 頁面類型映射（從 content.ts 複製）
const PAGE_TYPE_MAP: Record<string, PageType> = {
  // 資安產品
  acunetix: 'security',
  array: 'security',
  bitdefender: 'security',
  deep_instinct: 'security',
  fortinet: 'security',
  ist: 'security',
  logsec: 'security',
  palo_alto: 'security',
  security_scorecard: 'security',
  sonarqube: 'security',
  tenable_nessus: 'security',
  vicarius_vrx: 'security',
  // 基礎架構
  proxmox_ve: 'infrastructure',
  ubuntu: 'infrastructure',
  vmware: 'infrastructure',
  // 智慧製造
  ai_agent: 'manufacturing',
  ai_forecasting: 'manufacturing',
  aps: 'manufacturing',
  cms_568: 'manufacturing',
  data_middleware: 'manufacturing',
  jennifer_apm: 'manufacturing',
  mes: 'manufacturing',
  scm: 'manufacturing',
  wms: 'manufacturing',
  smartmanufacturing_ai: 'manufacturing',
};

class DataService {
  private provider: DataProvider;
  private config = getConfig();

  constructor() {
    // 根據環境變數選擇 Provider
    this.provider = this.config.useApi
      ? new ApiProvider()
      : new JsonProvider();

    if (isDev()) {
      console.log(
        `DataService: 使用 ${this.config.useApi ? 'API' : 'JSON'} Provider`
      );
    }
  }

  // ========== Page Content ==========

  async getPageContent(slug: string): Promise<PageContent | null> {
    return this.provider.getPageContent(slug);
  }

  async getAllPages(): Promise<string[]> {
    return this.provider.getAllPages();
  }

  async getContentManifest(): Promise<ContentManifest | null> {
    return this.provider.getContentManifest();
  }

  // ========== Assets ==========

  async getAssetManifest(): Promise<AssetManifest | null> {
    return this.provider.getAssetManifest();
  }

  async getAssetById(imageId: string): Promise<AssetEntry | null> {
    return this.provider.getAssetById(imageId);
  }

  // ========== Page Type Helpers ==========

  /**
   * 依類型取得頁面清單
   */
  async getPagesByType(type: PageType): Promise<string[]> {
    try {
      const allPages = await this.getAllPages();

      if (type === 'event') {
        return allPages.filter((slug) => slug.startsWith('event_'));
      }

      if (type === 'general') {
        const categorizedPages = new Set(Object.keys(PAGE_TYPE_MAP));
        return allPages.filter(
          (slug) => !categorizedPages.has(slug) && !slug.startsWith('event_')
        );
      }

      return allPages.filter((slug) => PAGE_TYPE_MAP[slug] === type);
    } catch (error) {
      console.error(`無法取得 ${type} 類型頁面`, error);
      return [];
    }
  }

  /**
   * 取得頁面的類型
   */
  getPageType(slug: string): PageType {
    if (slug.startsWith('event_')) return 'event';
    return PAGE_TYPE_MAP[slug] || 'general';
  }

  // ========== Form Submission ==========

  async submitContactForm(
    data: ContactSubmitRequest
  ): Promise<ApiResponse<ContactSubmitResponse>> {
    if (!this.config.useApi) {
      // Mock response for development
      return {
        success: true,
        data: {
          submission_id: `mock-${Date.now()}`,
          submitted: true,
          message: '感謝您的來信，我們將盡快與您聯繫。',
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          cached: false,
        },
      };
    }

    // Real API call
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: '網路連線錯誤，請稍後再試',
        },
      };
    }
  }
}

// Singleton instance
export const dataService = new DataService();
