import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders all sections without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sections = [
      "See every look",
      "Shoppers want to see themselves",
      "Give the shopper a mirror",
      "Three steps",
      "Every piece your house cuts",
      "What changes when shoppers",
      "A fitting room",
      "Runs where you run",
      "Per SKU",
      "What brands",
      "Then decide",
    ];

    for (const text of sections) {
      const el = page.getByText(text, { exact: false }).first();
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
    }

    expect(errors).toEqual([]);
  });

  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Vestra/);
  });

  test("privacy and terms pages render", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /Privacy policy/i })).toBeVisible();

    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /Terms of service/i })).toBeVisible();
  });

  test("cookie consent banner appears and can be dismissed", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByText("We use essential cookies");
    await expect(banner).toBeVisible();

    await page.getByRole("button", { name: "Essentials only" }).click();
    await expect(banner).not.toBeVisible();
  });
});
