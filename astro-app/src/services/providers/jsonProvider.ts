/**
 * JSON File Provider
 * 從 public/content/ 讀取 JSON 檔案
 */
import fs from 'fs/promises';
import path from 'path';
import { isDev } from '../config';
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

export class JsonProvider implements DataProvider {
  private contentManifestCache: ContentManifest | null = null;
  private assetManifestCache: AssetManifest | null = null;
  private isDevMode: boolean;

  constructor() {
    this.isDevMode = isDev();
  }

  async getPageContent(slug: string): Promise<PageContent | null> {
    try {
      const jsonPath = path.join(
        process.cwd(),
        'public',
        'content',
        'pages',
        `${slug}.json`
      );
      const content = await fs.readFile(jsonPath, 'utf-8');
      return JSON.parse(content) as PageContent;
    } catch (error) {
      console.error(`JsonProvider: 無法讀取頁面 ${slug}`, error);
      return null;
    }
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
    // 開發模式不使用快取，確保檔案變更能即時反映
    if (!this.isDevMode && this.contentManifestCache) {
      return this.contentManifestCache;
    }

    try {
      const manifestPath = path.join(
        process.cwd(),
        'public',
        'content',
        'manifest.json'
      );
      const content = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      // 僅在 production 模式快取
      if (!this.isDevMode) {
        this.contentManifestCache = manifest;
      }
      return manifest;
    } catch (error) {
      console.error('JsonProvider: 無法讀取 manifest.json', error);
      return null;
    }
  }

  async getAssetManifest(): Promise<AssetManifest | null> {
    if (!this.isDevMode && this.assetManifestCache) {
      return this.assetManifestCache;
    }

    try {
      const manifestPath = path.join(
        process.cwd(),
        'public',
        'asset-manifest.json'
      );
      const content = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      if (!this.isDevMode) {
        this.assetManifestCache = manifest;
      }
      return manifest;
    } catch (error) {
      console.error('JsonProvider: 無法讀取 asset-manifest.json', error);
      return null;
    }
  }

  async getAssetById(imageId: string): Promise<AssetEntry | null> {
    const manifest = await this.getAssetManifest();
    if (!manifest) return null;

    return manifest.assets.find((asset) => asset.id === imageId) || null;
  }

  // ========== Event Methods (Not supported in JsonProvider) ==========

  async getEvents(_params?: EventQueryParams): Promise<EventListResponse> {
    console.warn('JsonProvider: getEvents() 不支援，請使用 MockProvider 或 ApiProvider');
    return {
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
      has_more: false,
    };
  }

  async getEventById(_id: string): Promise<EventDetail | null> {
    console.warn('JsonProvider: getEventById() 不支援，請使用 MockProvider 或 ApiProvider');
    return null;
  }

  // ========== Form Config Methods (Not supported in JsonProvider) ==========

  async getFormConfig(_formId: string): Promise<FormConfigResponse | null> {
    console.warn('JsonProvider: getFormConfig() 不支援，請使用 MockProvider 或 ApiProvider');
    return null;
  }
}
