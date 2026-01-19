/**
 * Vitest Global Setup
 *
 * 這個檔案在每個測試檔案執行前載入
 */
import { vi } from 'vitest';

// Mock 環境變數
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
vi.stubEnv('RESEND_API_KEY', 're_test_key');
vi.stubEnv('CONTACT_EMAIL', 'test@example.com');
vi.stubEnv('FROM_EMAIL', 'noreply@test.com');

// Mock import.meta.env for Astro
vi.stubGlobal('import', {
  meta: {
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      RESEND_API_KEY: 're_test_key',
      CONTACT_EMAIL: 'test@example.com',
      FROM_EMAIL: 'noreply@test.com',
      DEV: true,
    },
  },
});
