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
}
