import { test, expect } from "@playwright/test";

/**
 * Landing Page UI/UX Tests
 */
test.describe("Landing Page", () => {
  test("renders hero section with title and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("RithuDevQuest")).toBeVisible();
    const cta = page.getByRole("link", { name: /launch your quest/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/signup");
  });

  test("no horizontal overflow on desktop", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 1280;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(385);
  });

  test("career section shows planets", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: /choose your career path|five worlds/i });
    await expect(heading).toBeVisible();
  });

  test("gamification section renders", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: /learn like a game|gamified learning/i });
    await expect(heading).toBeVisible();
    await expect(page.getByRole("heading", { name: "Earn XP" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Build Streaks" })).toBeVisible();
  });

  test("CTA section at bottom has signup link", async ({ page }) => {
    await page.goto("/");
    const adventureBtn = page.getByRole("link", { name: /begin your adventure/i });
    await expect(adventureBtn).toBeVisible();
    await expect(adventureBtn).toHaveAttribute("href", "/signup");
  });

  test("footer renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Next.js, Prisma, Groq AI")).toBeVisible();
  });

  test("Sign In link navigates to login", async ({ page }) => {
    await page.goto("/");
    const signIn = page.getByRole("link", { name: /sign in/i }).first();
    await expect(signIn).toBeVisible();
    await signIn.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
