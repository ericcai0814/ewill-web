/**
 * Services 統一匯出
 */
export { dataService } from './dataService';
export { getConfig, isDev } from './config';

// Types
export type {
  ApiResponse,
  ApiError,
  ApiMeta,
  ContactSubmitRequest,
  ContactSubmitResponse,
  DataProvider,
} from './types';

// Providers (進階使用)
export { JsonProvider, ApiProvider } from './providers';
