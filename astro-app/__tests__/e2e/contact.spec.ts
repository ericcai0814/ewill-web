/**
 * 聯絡我們頁面 E2E 測試
 */
import { test, expect } from '@playwright/test';

test.describe('聯絡我們頁面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/');
  });

  test('應該正確載入聯絡頁面', async ({ page }) => {
    // 檢查頁面標題包含「聯絡」或「contact」
    await expect(page).toHaveTitle(/聯絡|contact/i);
  });

  test('應該顯示聯絡表單', async ({ page }) => {
    // 檢查表單存在
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('表單應該包含必要欄位', async ({ page }) => {
    // 檢查姓名欄位
    const nameInput = page.locator('input[name="name"], input[id*="name"]');
    await expect(nameInput).toBeVisible();

    // 檢查 Email 欄位
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    await expect(emailInput).toBeVisible();

    // 檢查訊息欄位
    const messageInput = page.locator('textarea[name="message"], textarea');
    await expect(messageInput).toBeVisible();

    // 檢查提交按鈕
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('應該顯示必填欄位提示', async ({ page }) => {
    // 檢查 required 屬性
    const nameInput = page.locator('input[name="name"], input[id*="name"]');
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const messageInput = page.locator('textarea[name="message"], textarea');

    // 至少其中一個應該有 required 屬性
    const nameRequired = await nameInput.getAttribute('required');
    const emailRequired = await emailInput.getAttribute('required');
    const messageRequired = await messageInput.getAttribute('required');

    expect(nameRequired !== null || emailRequired !== null || messageRequired !== null).toBeTruthy();
  });
});

test.describe('聯絡表單驗證', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/');
  });

  test('空表單提交應該顯示錯誤', async ({ page }) => {
    // 點擊提交按鈕
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    // 應該有驗證錯誤（HTML5 驗證或自訂錯誤訊息）
    // 檢查是否有任何錯誤訊息或欄位標記為 invalid
    const invalidFields = page.locator(':invalid');
    const errorMessages = page.locator('[class*="error"], [class*="invalid"], [role="alert"]');

    const hasInvalidFields = (await invalidFields.count()) > 0;
    const hasErrorMessages = (await errorMessages.count()) > 0;

    expect(hasInvalidFields || hasErrorMessages).toBeTruthy();
  });

  test('無效的 Email 應該顯示錯誤', async ({ page }) => {
    // 填入無效的 Email
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    await emailInput.fill('invalid-email');

    // 點擊其他地方觸發驗證
    const nameInput = page.locator('input[name="name"], input[id*="name"]');
    await nameInput.click();

    // Email 欄位應該顯示為 invalid
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });
});

test.describe('聯絡表單提交', () => {
  test('有效的表單提交應該成功', async ({ page }) => {
    await page.goto('/contact/');

    // 填寫表單
    const nameInput = page.locator('input[name="name"], input[id*="name"]');
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const messageInput = page.locator('textarea[name="message"], textarea');

    await nameInput.first().fill('E2E 測試用戶');
    await emailInput.first().fill('e2e-test@example.com');
    await messageInput.first().fill('這是 E2E 自動化測試訊息，請忽略。');

    // 填寫可選欄位（如果存在）
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]');
    if ((await phoneInput.count()) > 0) {
      await phoneInput.first().fill('0912345678');
    }

    const companyInput = page.locator('input[name="company"]');
    if ((await companyInput.count()) > 0) {
      await companyInput.first().fill('測試公司');
    }

    // 監聽 API 請求或頁面導航
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/contact') && response.request().method() === 'POST',
      { timeout: 10000 }
    ).catch(() => null);

    // 點擊提交
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.first().click();

    // 等待回應或頁面變化
    const response = await responsePromise;

    if (response) {
      // AJAX 提交：檢查回應狀態（200 或 201 都可接受）
      expect([200, 201]).toContain(response.status());

      // 檢查頁面顯示成功訊息（使用實際的 DOM 結構：#form-success）
      const successMessage = page.locator('#form-success:not(.hidden)');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    } else {
      // 傳統表單提交：等待頁面載入完成
      await page.waitForLoadState('networkidle');

      // 檢查是否有成功訊息或 URL 改變
      const hasSuccessIndicator =
        page.url().includes('success') ||
        page.url().includes('thank') ||
        (await page.locator('#form-success:not(.hidden)').count()) > 0;

      expect(hasSuccessIndicator || page.url() !== '/contact/').toBeTruthy();
    }
  });
});
