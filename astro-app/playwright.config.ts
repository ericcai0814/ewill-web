import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 測試配置
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 測試目錄
  testDir: './__tests__/e2e',

  // 測試檔案匹配模式
  testMatch: '**/*.spec.ts',

  // 完整測試超時（含重試）
  timeout: 30 * 1000,

  // expect 超時
  expect: {
    timeout: 5000,
  },

  // 平行執行
  fullyParallel: true,

  // CI 環境禁止 .only
  forbidOnly: !!process.env.CI,

  // CI 環境重試次數
  retries: process.env.CI ? 2 : 0,

  // CI 環境 worker 數量
  workers: process.env.CI ? 1 : undefined,

  // 報告格式
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  // 共用設定
  use: {
    // 基礎 URL
    baseURL: 'http://localhost:4321',

    // 追蹤（失敗時保留）
    trace: 'on-first-retry',

    // 截圖（失敗時保留）
    screenshot: 'only-on-failure',

    // 影片（失敗時保留）
    video: 'on-first-retry',
  },

  // 測試專案（瀏覽器）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 行動裝置測試
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 開發伺服器
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
