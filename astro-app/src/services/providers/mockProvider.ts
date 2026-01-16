/**
 * Mock Data Provider
 * 用於開發/測試環境，從 mock JSON 檔案讀取動態資料
 * 頁面內容委託給 JsonProvider
 */
import { JsonProvider } from './jsonProvider';
import type { DataProvider } from '../types/provider';
import type {
  PageContent,
  ContentManifest,
  AssetManifest,
  AssetEntry,
} from '../../utils/content';
import type {
  EventDetail,
  EventListResponse,
  EventQueryParams,
  FormConfigResponse,
} from '@ewill/shared';

// 直接導入 mock 資料
import eventsData from '../mock/events.json';
import formFieldsData from '../mock/form-fields.json';

interface MockEvent {
  id: string;
  title: string;
  summary: string;
  category: 'seminar' | 'webinar' | 'press_release' | 'exhibition' | 'other';
  status: 'draft' | 'published' | 'archived';
  event_date: string;
  end_date?: string;
  cover_image_id: string;
  hero_image_id?: string;
  page_slug: string;
  content: string;
  gallery?: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    og_image?: string;
  };
  created_at: string;
  updated_at: string;
}

export class MockProvider implements DataProvider {
  private jsonProvider: JsonProvider;
  private events: MockEvent[];
  private formConfigs: Record<string, FormConfigResponse>;

  constructor() {
    this.jsonProvider = new JsonProvider();
    this.events = eventsData.events as MockEvent[];
    this.formConfigs = formFieldsData.forms as Record<string, FormConfigResponse>;
  }

  // ========== 委託給 JsonProvider ==========

  async getPageContent(slug: string): Promise<PageContent | null> {
    return this.jsonProvider.getPageContent(slug);
  }

  async getAllPages(): Promise<string[]> {
    return this.jsonProvider.getAllPages();
  }

  async getContentManifest(): Promise<ContentManifest | null> {
    return this.jsonProvider.getContentManifest();
  }

  async getAssetManifest(): Promise<AssetManifest | null> {
    return this.jsonProvider.getAssetManifest();
  }

  async getAssetById(imageId: string): Promise<AssetEntry | null> {
    return this.jsonProvider.getAssetById(imageId);
  }

  // ========== Event Methods ==========

  async getEvents(params?: EventQueryParams): Promise<EventListResponse> {
    let filtered = [...this.events];

    // 狀態篩選
    if (params?.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    // 分類篩選
    if (params?.category) {
      filtered = filtered.filter((e) => e.category === params.category);
    }

    // 排序
    const sortBy = params?.sort_by || 'event_date';
    const sortOrder = params?.sort_order || 'desc';

    filtered.sort((a, b) => {
      const aVal = sortBy === 'event_date' ? a.event_date : a.created_at;
      const bVal = sortBy === 'event_date' ? b.event_date : b.created_at;
      const comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // 分頁
    const page = params?.page || 1;
    const pageSize = Math.min(params?.page_size || 10, 50);
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginated.map((e) => ({
        id: e.id,
        title: e.title,
        summary: e.summary,
        category: e.category,
        event_date: e.event_date,
        cover_image_id: e.cover_image_id,
        page_slug: e.page_slug,
      })),
      total: filtered.length,
      page,
      page_size: pageSize,
      has_more: startIndex + pageSize < filtered.length,
    };
  }

  async getEventById(id: string): Promise<EventDetail | null> {
    const event = this.events.find((e) => e.id === id);
    if (!event) return null;

    return {
      id: event.id,
      title: event.title,
      summary: event.summary,
      category: event.category,
      status: event.status,
      event_date: event.event_date,
      end_date: event.end_date,
      cover_image_id: event.cover_image_id,
      hero_image_id: event.hero_image_id,
      page_slug: event.page_slug,
      content: event.content,
      gallery: event.gallery,
      seo: event.seo,
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  }

  // ========== Form Config Methods ==========

  async getFormConfig(formId: string): Promise<FormConfigResponse | null> {
    return this.formConfigs[formId] || null;
  }
}
