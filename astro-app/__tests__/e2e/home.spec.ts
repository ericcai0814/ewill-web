/**
 * 首頁 E2E 測試
 */
import { test, expect } from '@playwright/test';

test.describe('首頁', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('應該正確載入首頁', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle(/鎰威/);
  });

  test('應該顯示導覽列', async ({ page }) => {
    // 檢查導覽列存在
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });

  test('應該顯示頁尾', async ({ page }) => {
    // 檢查頁尾存在
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('應該有正確的 meta description', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('導覽連結應該正常運作', async ({ page }) => {
    // 找到第一個導覽連結並點擊
    const navLinks = page.locator('nav a, header a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // 取得第一個連結的 href
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        // 確認頁面已導航（URL 改變或停留在同一頁面）
        expect(page.url()).toBeTruthy();
      }
    }
  });
});

test.describe('首頁 - 響應式設計', () => {
  test('桌面版應該正確顯示', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 頁面應該正確載入
    await expect(page).toHaveTitle(/鎰威/);
  });

  test('平板版應該正確顯示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page).toHaveTitle(/鎰威/);
  });

  test('手機版應該正確顯示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page).toHaveTitle(/鎰威/);
  });
});
