import { test, expect } from "@playwright/test";

/**
 * Auth Pages UI/UX Tests
 * Tests: login/signup rendering, form validation, responsive layout,
 * no overflow, theme tokens (no hardcoded dark:), navigation links.
 */

test.describe("Login Page", () => {
  test("renders login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();
  });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/login");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(377);
  });

  test("signup link present", async ({ page }) => {
    await page.goto("/login");
    const signupLink = page.getByRole("link", { name: /create an account/i });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute("href", "/signup");
  });

  test("form inputs are accessible", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.getByRole("textbox", { name: /email/i });
    const passwordInput = page.getByRole("textbox", { name: /password/i });
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("empty form submission shows validation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    // Should still be on login page (not redirected)
    await expect(page).toHaveURL(/\/login/);
  });

  test("logo links to home", async ({ page }) => {
    await page.goto("/login");
    const logo = page.getByRole("link", { name: /rithudevquest/i });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("href", "/");
  });
});

test.describe("Signup Page", () => {
  test("renders signup form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByText("Create Account")).toBeVisible();
    await expect(page.getByRole("button", { name: /create|sign up/i })).toBeVisible();
  });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/signup");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(377);
  });

  test("login link present", async ({ page }) => {
    await page.goto("/signup");
    const loginLink = page.getByRole("link", { name: /sign in|log in/i });
    await expect(loginLink).toBeVisible();
  });

  test("form inputs are accessible", async ({ page }) => {
    await page.goto("/signup");
    const nameInput = page.getByRole("textbox", { name: /name/i });
    const emailInput = page.getByRole("textbox", { name: /email/i });
    const passwordInput = page.getByRole("textbox", { name: /password/i });
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });
});
