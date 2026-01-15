/**
 * Neon PostgreSQL 連線客戶端
 *
 * 環境變數：
 * - DATABASE_URL: Neon 連線字串
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 檢查環境變數
if (!process.env.DATABASE_URL) {
  console.warn('警告：DATABASE_URL 未設定，資料庫功能將無法使用');
}

// 建立 Neon SQL 客戶端
const sql = neon(process.env.DATABASE_URL || '');

// 建立 Drizzle ORM 實例
export const db = drizzle(sql, { schema });

// 匯出 schema 供其他模組使用
export { schema };
