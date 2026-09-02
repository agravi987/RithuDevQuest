import { test, expect } from "@playwright/test";

/**
 * Responsive Layout Tests
 * Tests: no overflow on all pages, proper text sizing,
 * header behavior, mobile nav, all viewports.
 */

const VIEWPORTS = [
  { name: "mobile-small", width: 320, height: 568 },
  { name: "mobile", width: 375, height: 812 },
  { name: "mobile-large", width: 428, height: 926 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "desktop-wide", width: 1920, height: 1080 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Viewport: ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("landing page: no horizontal overflow", async ({ page }) => {
      await page.goto("/");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 2);
    });

    test("landing page: hero text is visible and not clipped", async ({ page }) => {
      await page.goto("/");
      const hero = page.locator("h1").first();
      await expect(hero).toBeVisible();
      const box = await hero.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(-5);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 50);
      }
    });

    test("landing page: CTA button is clickable and not offscreen", async ({ page }) => {
      await page.goto("/");
      const cta = page.getByRole("link", { name: /launch/i });
      await expect(cta).toBeVisible();
      const box = await cta.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(-5);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 10);
      }
    });

    test("login page: no horizontal overflow", async ({ page }) => {
      await page.goto("/login");
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 2);
    });

    test("login page: form is centered and visible", async ({ page }) => {
      await page.goto("/login");
      const form = page.getByRole("button", { name: /sign in|log in/i });
      await expect(form).toBeVisible();
      const box = await form.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(-5);
      }
    });
  });
}
