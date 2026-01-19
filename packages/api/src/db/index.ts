/**
 * Neon PostgreSQL 連線客戶端
 *
 * 環境變數：
 * - DATABASE_URL: Neon 連線字串
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 惰性初始化：確保環境變數在執行時才被讀取
let _sql: NeonQueryFunction<false, false> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

/**
 * 檢查是否為 Mock 模式（沒有設定 DATABASE_URL）
 */
export function isMockMode(): boolean {
  const connectionString = process.env.DATABASE_URL || '';
  return !connectionString;
}

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL || '';

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL 未設定。請確認 .env 檔案存在且包含 DATABASE_URL。'
    );
  }

  return connectionString;
}

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    _sql = neon(getConnectionString());
  }
  return _sql;
}

// 使用 getter 確保 db 在首次存取時才初始化
export const db: NeonHttpDatabase<typeof schema> = new Proxy(
  {} as NeonHttpDatabase<typeof schema>,
  {
    get(_, prop) {
      if (!_db) {
        _db = drizzle(getSql(), { schema });
      }
      return (_db as unknown as Record<string, unknown>)[prop as string];
    },
  }
);

// 匯出 schema 供其他模組使用
export { schema };
