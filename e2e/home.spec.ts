import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that the page has loaded
    expect(page.url()).toContain('/');
  });

  test('should have correct title', async ({ page }) => {
    await page.goto('/');
    
    // Update this to match your actual page title
    await expect(page).toHaveTitle(/template-app/i);
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should navigate properly', async ({ page }) => {
    await page.goto('/');
    
    // Add navigation tests based on your app structure
    // Example:
    // await page.click('text=About');
    // await expect(page).toHaveURL('/about');
  });
});

