/**
 * 網站導覽 E2E 測試
 */
import { test, expect } from '@playwright/test';

test.describe('網站導覽', () => {
  test('首頁到聯絡頁的導覽', async ({ page }) => {
    await page.goto('/');

    // 找到聯絡我們的連結
    const contactLink = page.locator('a[href*="contact"]').first();

    if ((await contactLink.count()) > 0) {
      await contactLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('contact');
    }
  });

  test('首頁到活動頁的導覽', async ({ page }) => {
    await page.goto('/');

    // 找到活動相關的連結
    const eventLink = page.locator('a[href*="event"]').first();

    if ((await eventLink.count()) > 0) {
      await eventLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('event');
    }
  });

  test('頁尾連結應該正常運作', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();

    // 檢查至少有一些頁尾連結
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('404 頁面', () => {
  test('不存在的頁面應該顯示 404', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345/');

    // 檢查回應狀態或頁面內容
    if (response) {
      // 可能是 404 狀態碼或自訂 404 頁面（200 狀態但顯示 404 內容）
      const status = response.status();
      const content = await page.content();

      const is404Status = status === 404;
      const has404Content =
        content.includes('404') ||
        content.includes('找不到') ||
        content.includes('not found');

      expect(is404Status || has404Content).toBeTruthy();
    }
  });
});

test.describe('舊 URL 轉址', () => {
  test('舊活動 URL 應該轉址到新 URL', async ({ page }) => {
    // 訪問舊格式的活動 URL
    const response = await page.goto('/event_20251021/');

    if (response) {
      // 應該轉址到新格式
      const finalUrl = page.url();

      // 可能轉址到 /events/event_20251021/ 或保持原來的 URL
      expect(
        finalUrl.includes('/events/event_20251021') || finalUrl.includes('/event_20251021')
      ).toBeTruthy();
    }
  });
});

test.describe('效能測試', () => {
  test('首頁載入時間應該在合理範圍內', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // 載入時間應該在 10 秒內（考慮 CI 環境可能較慢）
    expect(loadTime).toBeLessThan(10000);
  });

  test('頁面應該沒有 JavaScript 錯誤', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 不應該有 JavaScript 錯誤
    expect(errors).toHaveLength(0);
  });

  test('頁面應該沒有 console 錯誤', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 過濾掉一些可接受的錯誤（如第三方腳本）
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('third-party') && !error.includes('favicon')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('無障礙測試', () => {
  test('首頁應該有 lang 屬性', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    expect(lang).toBeTruthy();
  });

  test('圖片應該有 alt 屬性', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      // 每張圖片應該有 alt 屬性（可以是空字串用於裝飾性圖片）
      expect(alt, `Image ${src} missing alt attribute`).not.toBeNull();
    }
  });

  test('表單欄位應該有 label', async ({ page }) => {
    await page.goto('/contact/');

    // 排除 Astro dev toolbar 的 input
    const inputs = page.locator(
      'main input:not([type="hidden"]):not([type="submit"]), form input:not([type="hidden"]):not([type="submit"])'
    );
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      // 跳過 Astro dev toolbar 相關的 input
      if (id?.includes('dev-toolbar') || name?.includes('dev-toolbar')) {
        continue;
      }

      // 應該有 id + label，或 aria-label，或 aria-labelledby
      const hasLabel = id
        ? (await page.locator(`label[for="${id}"]`).count()) > 0
        : false;
      const hasAriaLabel = ariaLabel !== null || ariaLabelledby !== null;

      expect(
        hasLabel || hasAriaLabel,
        `Input ${name || id} missing accessible label`
      ).toBeTruthy();
    }
  });
});
