/**
 * Data Service 設定
 * 透過環境變數控制資料來源切換
 */

/** 資料來源類型 */
export type DataSourceType = 'json' | 'api' | 'mock';

export interface DataServiceConfig {
  /** 資料來源（json | api | mock） */
  dataSource: DataSourceType;
  /** 是否使用 API（向後相容，已棄用） */
  useApi: boolean;
  /** API Base URL */
  apiBaseUrl: string;
  /** API Timeout (ms) */
  apiTimeout: number;
}

/**
 * 取得 Data Service 設定
 *
 * 優先順序：
 * 1. DATA_SOURCE 環境變數（新版，推薦）
 * 2. USE_API 環境變數（向後相容）
 * 3. 預設為 'json'
 */
export function getConfig(): DataServiceConfig {
  // 新版 DATA_SOURCE 環境變數
  const dataSourceEnv = import.meta.env.DATA_SOURCE as string | undefined;

  // 向後相容：USE_API=true 等同於 DATA_SOURCE=api
  const useApiEnv = import.meta.env.USE_API === 'true';

  let dataSource: DataSourceType = 'json';

  if (dataSourceEnv === 'mock' || dataSourceEnv === 'api' || dataSourceEnv === 'json') {
    dataSource = dataSourceEnv;
  } else if (useApiEnv) {
    dataSource = 'api';
  }

  return {
    dataSource,
    useApi: dataSource === 'api', // 向後相容
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
