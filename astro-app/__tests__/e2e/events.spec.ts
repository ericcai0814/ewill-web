/**
 * 活動頁面 E2E 測試
 */
import { test, expect } from '@playwright/test';

test.describe('活動列表頁', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/event_information/');
  });

  test('應該正確載入活動列表頁', async ({ page }) => {
    // 檢查頁面標題
    await expect(page).toHaveTitle(/活動|event/i);
  });

  test('應該顯示活動卡片', async ({ page }) => {
    // 等待內容載入
    await page.waitForLoadState('networkidle');

    // 檢查是否有活動卡片或列表項目
    const eventCards = page.locator('[class*="card"], [class*="event"], article');
    const cardCount = await eventCards.count();

    // 應該至少有一個活動（或顯示「暫無活動」訊息）
    if (cardCount === 0) {
      const emptyMessage = page.locator('text=/暫無|沒有|empty/i');
      await expect(emptyMessage).toBeVisible();
    } else {
      expect(cardCount).toBeGreaterThan(0);
    }
  });

  test('活動卡片應該包含必要資訊', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // 排除 Astro dev toolbar
    const eventCards = page.locator('main [class*="card"], main [class*="event"], main article');
    const cardCount = await eventCards.count();

    if (cardCount > 0) {
      const firstCard = eventCards.first();

      // 應該有標題
      const title = firstCard.locator('h2, h3, [class*="title"]');
      await expect(title.first()).toBeVisible();

      // 應該有連結
      const link = firstCard.locator('a');
      await expect(link.first()).toBeVisible();
    }
  });

  test('活動卡片點擊應該導航到詳情頁', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // 排除 Astro dev toolbar
    const eventCards = page.locator('main [class*="card"], main [class*="event"], main article');
    const cardCount = await eventCards.count();

    if (cardCount > 0) {
      // 找到第一個活動的連結
      const firstLink = eventCards.first().locator('a').first();
      const href = await firstLink.getAttribute('href');

      if (href) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        // 確認 URL 已變更
        expect(page.url()).toContain('/event');
      }
    }
  });
});

test.describe('活動詳情頁', () => {
  test('應該正確載入活動詳情', async ({ page }) => {
    // 先到列表頁找一個活動
    await page.goto('/event_information/');
    await page.waitForLoadState('networkidle');

    // 排除 Astro dev toolbar
    const eventLinks = page.locator('main a[href*="/events/"]');
    const linkCount = await eventLinks.count();

    if (linkCount > 0) {
      // 點擊第一個活動連結
      await eventLinks.first().click();
      await page.waitForLoadState('networkidle');

      // 檢查頁面載入 - 使用 main 區域內的 h1
      const title = page.locator('main h1').first();
      await expect(title).toBeVisible();
    }
  });

  test('活動詳情應該顯示完整內容', async ({ page }) => {
    await page.goto('/event_information/');
    await page.waitForLoadState('networkidle');

    // 排除 Astro dev toolbar
    const eventLinks = page.locator('main a[href*="/events/"]');
    const linkCount = await eventLinks.count();

    if (linkCount > 0) {
      await eventLinks.first().click();
      await page.waitForLoadState('networkidle');

      // 應該有活動標題 - 使用 main 區域內的 h1
      const title = page.locator('main h1').first();
      await expect(title).toBeVisible();

      // 應該有活動內容
      const content = page.locator('main, article, [class*="content"]');
      await expect(content.first()).toBeVisible();
    }
  });
});

test.describe('活動頁面 - SEO', () => {
  test('列表頁應該有正確的 meta tags', async ({ page }) => {
    await page.goto('/event_information/');

    // 檢查 title
    await expect(page).toHaveTitle(/.+/);

    // 檢查 description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('詳情頁應該有正確的 meta tags', async ({ page }) => {
    await page.goto('/event_information/');
    await page.waitForLoadState('networkidle');

    const eventLinks = page.locator('a[href*="/events/"]');
    const linkCount = await eventLinks.count();

    if (linkCount > 0) {
      await eventLinks.first().click();
      await page.waitForLoadState('networkidle');

      // 檢查 title
      await expect(page).toHaveTitle(/.+/);

      // 檢查 description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
    }
  });
});

test.describe('活動 API', () => {
  test('GET /api/events 應該回傳正確格式', async ({ request }) => {
    const response = await request.get('/api/events');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('items');
    expect(data.data).toHaveProperty('total');
    expect(data.data).toHaveProperty('page');
    expect(data.data).toHaveProperty('page_size');
  });

  test('GET /api/events 應該支援分頁', async ({ request }) => {
    const response = await request.get('/api/events?page=1&page_size=5');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.data.page).toBe(1);
    expect(data.data.page_size).toBe(5);
  });

  test('GET /api/events 應該支援篩選', async ({ request }) => {
    const response = await request.get('/api/events?status=published');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
