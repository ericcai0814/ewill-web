/**
 * Neon PostgreSQL 連線客戶端
 *
 * 環境變數：
 * - DATABASE_URL: Neon 連線字串
 *
 * 注意：Astro 5 使用 import.meta.env 存取 .env 檔案的環境變數
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 惰性初始化：確保環境變數在執行時才被讀取
let _sql: NeonQueryFunction<false, false> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getConnectionString(): string {
  // 優先使用 import.meta.env（Astro/Vite 環境）
  // 次要使用 process.env（Node.js 環境，如 seed script）
  const connectionString =
    (import.meta as any).env?.DATABASE_URL ||
    process.env.DATABASE_URL ||
    '';

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
export const db: NeonHttpDatabase<typeof schema> = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    if (!_db) {
      _db = drizzle(getSql(), { schema });
    }
    return (_db as any)[prop];
  },
});

// 匯出 schema 供其他模組使用
export { schema };
