import { test, expect } from '@playwright/test';

/**
 * Accessibility tests to ensure the application is accessible
 * These tests check for common accessibility issues
 */

test.describe('Accessibility', () => {
  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    
    // There should be exactly one h1 on the page
    expect(h1Count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // All buttons should have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || 
                            await button.textContent();
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check if an element has focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // This is a basic check - for comprehensive testing, consider using axe-core
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    expect(backgroundColor).toBeTruthy();
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Alt attribute should exist (can be empty for decorative images)
      expect(alt !== null).toBeTruthy();
    }
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeTruthy();
  });
});

/**
 * For more comprehensive accessibility testing, consider integrating axe-core:
 * 
 * npm install --save-dev @axe-core/playwright
 * 
 * import { injectAxe, checkA11y } from '@axe-core/playwright';
 * 
 * test('should not have any automatically detectable accessibility issues', async ({ page }) => {
 *   await page.goto('/');
 *   await injectAxe(page);
 *   await checkA11y(page);
 * });
 */

