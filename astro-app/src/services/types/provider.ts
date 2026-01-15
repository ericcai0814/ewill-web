/**
 * Data Provider Interface
 * 定義所有 provider 必須實作的方法
 */
import type {
  PageContent,
  ContentManifest,
  AssetManifest,
  AssetEntry,
} from '../../utils/content';

export interface DataProvider {
  /** 取得單一頁面內容 */
  getPageContent(slug: string): Promise<PageContent | null>;

  /** 取得所有頁面清單 */
  getAllPages(): Promise<string[]>;

  /** 取得內容清單 manifest */
  getContentManifest(): Promise<ContentManifest | null>;

  /** 取得圖片資源 manifest */
  getAssetManifest(): Promise<AssetManifest | null>;

  /** 根據 ID 取得圖片資源 */
  getAssetById(imageId: string): Promise<AssetEntry | null>;
}
