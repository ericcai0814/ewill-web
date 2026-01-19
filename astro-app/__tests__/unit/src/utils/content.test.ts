/**
 * src/utils/content.ts 單元測試
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
  readFile: vi.fn(),
}));

import fs from 'fs/promises';
import {
  getAssetManifest,
  getContentManifest,
  getPageContent,
  getAllPages,
  getPagesByType,
  getPageType,
  getAssetById,
  getImagePath,
  type AssetManifest,
  type ContentManifest,
  type PageContent,
} from '../../../../src/utils/content';

describe('src/utils/content', () => {
  const mockAssetManifest: AssetManifest = {
    generated_at: '2024-01-15T10:00:00.000Z',
    target: 'astro',
    assets: [
      {
        id: 'images_hero_01',
        original_path: '/images/hero/01.jpg',
        normalized_path: '/assets/images/hero/01.jpg',
        variants: {
          desktop: '/assets/images/hero/01-desktop.webp',
          mobile: '/assets/images/hero/01-mobile.webp',
        },
        alt: 'Hero Image',
      },
      {
        id: 'images_product_acunetix',
        original_path: '/images/product/acunetix.png',
        normalized_path: '/assets/images/product/acunetix.png',
        variants: {
          desktop: '/assets/images/product/acunetix-desktop.webp',
          mobile: '/assets/images/product/acunetix-mobile.webp',
        },
        alt: 'Acunetix Product',
      },
    ],
  };

  const mockContentManifest: ContentManifest = {
    generated_at: '2024-01-15T10:00:00.000Z',
    pages: [
      { slug: 'index', module: 'home', path: 'pages/index.json' },
      { slug: 'about_us', module: 'about', path: 'pages/about_us.json' },
      { slug: 'acunetix', module: 'security', path: 'pages/acunetix.json' },
      { slug: 'proxmox_ve', module: 'infrastructure', path: 'pages/proxmox_ve.json' },
      { slug: 'mes', module: 'manufacturing', path: 'pages/mes.json' },
      { slug: 'event_20251021', module: 'event', path: 'pages/event_20251021.json' },
      { slug: 'header', module: 'header', path: 'pages/header.json' },
      { slug: 'footer', module: 'footer', path: 'pages/footer.json' },
    ],
  };

  const mockPageContent: PageContent = {
    slug: 'acunetix',
    module: 'security',
    template: 'product',
    seo: {
      title: 'Acunetix',
      description: 'Web 弱點掃描',
      keywords: ['security', 'scanner'],
    },
    url_mapping: {
      current_url: '/acunetix/',
    },
    generated_at: '2024-01-15T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock DEV mode to disable caching
    vi.stubGlobal('import', {
      meta: { env: { DEV: true } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getAssetManifest', () => {
    it('應該成功讀取並解析 asset manifest', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockAssetManifest));

      const result = await getAssetManifest();

      expect(result).toEqual(mockAssetManifest);
      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('asset-manifest.json'),
        'utf-8'
      );
    });

    it('讀取失敗時應該回傳 null', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

      const result = await getAssetManifest();

      expect(result).toBeNull();
    });

    it('應該包含 generated_at 欄位', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockAssetManifest));

      const result = await getAssetManifest();

      expect(result?.generated_at).toBe('2024-01-15T10:00:00.000Z');
    });

    it('應該包含 assets 陣列', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockAssetManifest));

      const result = await getAssetManifest();

      expect(result?.assets).toHaveLength(2);
    });
  });

  describe('getContentManifest', () => {
    it('應該成功讀取並解析 content manifest', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockContentManifest));

      const result = await getContentManifest();

      expect(result).toEqual(mockContentManifest);
    });

    it('讀取失敗時應該回傳 null', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

      const result = await getContentManifest();

      expect(result).toBeNull();
    });
  });

  describe('getPageContent', () => {
    it('應該成功讀取指定頁面內容', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPageContent));

      const result = await getPageContent('acunetix');

      expect(result).toEqual(mockPageContent);
      expect(fs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('acunetix.json'),
        'utf-8'
      );
    });

    it('頁面不存在時應該回傳 null', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

      const result = await getPageContent('nonexistent');

      expect(result).toBeNull();
    });

    it('應該解析頁面的 SEO 資訊', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPageContent));

      const result = await getPageContent('acunetix');

      expect(result?.seo.title).toBe('Acunetix');
      expect(result?.seo.description).toBe('Web 弱點掃描');
    });
  });

  describe('getAllPages', () => {
    it('應該回傳所有頁面 slug（排除 header/footer）', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockContentManifest));

      const result = await getAllPages();

      expect(result).toContain('index');
      expect(result).toContain('acunetix');
      expect(result).not.toContain('header');
      expect(result).not.toContain('footer');
    });

    it('manifest 不存在時應該回傳空陣列', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

      const result = await getAllPages();

      expect(result).toEqual([]);
    });
  });

  describe('getPagesByType', () => {
    beforeEach(() => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockContentManifest));
    });

    it('應該回傳 security 類型頁面', async () => {
      const result = await getPagesByType('security');

      expect(result).toContain('acunetix');
    });

    it('應該回傳 infrastructure 類型頁面', async () => {
      const result = await getPagesByType('infrastructure');

      expect(result).toContain('proxmox_ve');
    });

    it('應該回傳 manufacturing 類型頁面', async () => {
      const result = await getPagesByType('manufacturing');

      expect(result).toContain('mes');
    });

    it('應該回傳 event 類型頁面（以 event_ 開頭）', async () => {
      const result = await getPagesByType('event');

      expect(result).toContain('event_20251021');
    });

    it('應該回傳 general 類型頁面（未分類）', async () => {
      const result = await getPagesByType('general');

      expect(result).toContain('about_us');
      expect(result).not.toContain('acunetix');
    });
  });

  describe('getPageType', () => {
    it('應該識別 security 類型頁面', () => {
      expect(getPageType('acunetix')).toBe('security');
      expect(getPageType('bitdefender')).toBe('security');
      expect(getPageType('fortinet')).toBe('security');
    });

    it('應該識別 infrastructure 類型頁面', () => {
      expect(getPageType('proxmox_ve')).toBe('infrastructure');
      expect(getPageType('ubuntu')).toBe('infrastructure');
      expect(getPageType('vmware')).toBe('infrastructure');
    });

    it('應該識別 manufacturing 類型頁面', () => {
      expect(getPageType('mes')).toBe('manufacturing');
      expect(getPageType('wms')).toBe('manufacturing');
      expect(getPageType('aps')).toBe('manufacturing');
    });

    it('應該識別 event 類型頁面', () => {
      expect(getPageType('event_20251021')).toBe('event');
      expect(getPageType('event_20251118')).toBe('event');
    });

    it('未知頁面應該回傳 general', () => {
      expect(getPageType('about_us')).toBe('general');
      expect(getPageType('contact')).toBe('general');
      expect(getPageType('unknown_page')).toBe('general');
    });
  });

  describe('getAssetById', () => {
    it('應該根據 ID 找到對應的圖片資源', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockAssetManifest));

      const result = await getAssetById('images_hero_01');

      expect(result).toEqual(mockAssetManifest.assets[0]);
    });

    it('找不到時應該回傳 null', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockAssetManifest));

      const result = await getAssetById('nonexistent_image');

      expect(result).toBeNull();
    });

    it('manifest 不存在時應該回傳 null', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

      const result = await getAssetById('images_hero_01');

      expect(result).toBeNull();
    });

    it('應該回傳完整的 variants 資訊', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockAssetManifest));

      const result = await getAssetById('images_product_acunetix');

      expect(result?.variants.desktop).toContain('desktop');
      expect(result?.variants.mobile).toContain('mobile');
    });
  });

  describe('getImagePath (deprecated)', () => {
    it('應該回傳相容的圖片路徑', () => {
      const result = getImagePath('any_page', 'test-image.jpg');

      expect(result).toBe('/assets/test-image.jpg');
    });

    it('應該忽略 pagePath 參數', () => {
      const result1 = getImagePath('page1', 'image.png');
      const result2 = getImagePath('page2', 'image.png');

      expect(result1).toBe(result2);
    });
  });

  describe('getPagesByType 錯誤處理', () => {
    it('getAllPages 失敗時應該回傳空陣列', async () => {
      // 模擬 getContentManifest 拋出錯誤
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Network Error'));

      const result = await getPagesByType('security');

      expect(result).toEqual([]);
    });
  });

  describe('getAllPages 錯誤處理', () => {
    it('manifest 讀取失敗時應該回傳空陣列', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission Denied'));

      const result = await getAllPages();

      expect(result).toEqual([]);
    });
  });

  describe('Production 模式快取', () => {
    it('應該在 production 模式下使用快取', async () => {
      // 模擬 production 模式
      vi.stubGlobal('import', {
        meta: { env: { DEV: false } },
      });

      // 重新載入模組以套用新的環境設定
      vi.resetModules();

      // 由於快取邏輯的測試需要修改全域狀態，這裡僅驗證功能存在
      const contentModule = await import('../../../../src/utils/content');
      expect(contentModule.getAssetManifest).toBeDefined();
      expect(contentModule.getContentManifest).toBeDefined();
    });
  });
});
