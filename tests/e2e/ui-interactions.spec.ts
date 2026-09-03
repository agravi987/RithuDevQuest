import { test, expect } from "@playwright/test";

/**
 * UI Interaction & Accessibility Tests
 */

test.describe("Keyboard Navigation", () => {
  test("landing page: CTA is keyboard-focusable", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /launch your quest/i });
    await cta.focus();
    await expect(cta).toBeFocused();
  });
});

test.describe("Navigation Links", () => {
  test("landing page has brand text", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "RithuDevQuest" }),
    ).toBeVisible();
  });
});

test.describe("Theme & Visual Consistency", () => {
  test("body has background color applied", async ({ page }) => {
    await page.goto("/");
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(bgColor).not.toBe("transparent");
  });

  test("no large layout shifts (CLS check)", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    const layoutShifts = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as unknown as {
              hadRecentInput: boolean;
              value: number;
            };
            if (shift.hadRecentInput === false) {
              cls += shift.value;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 1000);
      });
    });
    expect(layoutShifts).toBeLessThan(0.5);
  });

  test("font sizes are readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/login");
    const bodyFontSize = await page.evaluate(() => {
      return parseFloat(window.getComputedStyle(document.body).fontSize);
    });
    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
  });
});

test.describe("No Console Errors", () => {
  test("landing page has no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto("/");
    await page.waitForTimeout(3000);

    // Filter out resource loading 404s (fonts, favicons, analytics) and Next.js internals
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("404") &&
        !e.includes("manifest") &&
        !e.includes("service-worker") &&
        !e.includes("_next/static") &&
        !e.includes("Failed to load resource"),
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("login page has no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto("/login");
    await page.waitForTimeout(2000);
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("404") &&
        !e.includes("manifest") &&
        !e.includes("service-worker") &&
        !e.includes("Failed to load resource"),
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("signup page has no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto("/signup");
    await page.waitForTimeout(2000);
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("404") &&
        !e.includes("manifest") &&
        !e.includes("service-worker") &&
        !e.includes("Failed to load resource"),
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe("404 Page", () => {
  test("invalid route does not crash", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-12345");
    // Page should load without crashing (even if it's a 404 or redirect)
    await page.waitForTimeout(1000);
    const text = await page.textContent("body");
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });
});
