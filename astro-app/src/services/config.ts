/**
 * Data Service 設定
 * 透過環境變數控制資料來源切換
 */

export interface DataServiceConfig {
  /** 是否使用 API（false 時用 JSON） */
  useApi: boolean;
  /** API Base URL */
  apiBaseUrl: string;
  /** API Timeout (ms) */
  apiTimeout: number;
}

/**
 * 取得 Data Service 設定
 */
export function getConfig(): DataServiceConfig {
  return {
    useApi: import.meta.env.USE_API === 'true',
    apiBaseUrl: import.meta.env.API_BASE_URL || '/api',
    apiTimeout: parseInt(import.meta.env.API_TIMEOUT || '5000', 10),
  };
}

/**
 * 檢查是否為開發環境
 */
export function isDev(): boolean {
  return import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';
}
