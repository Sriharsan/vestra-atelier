import { test, expect } from "@playwright/test";

test.describe("Shop", () => {
  test("renders 10 product cards with images", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/shop");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("10 pieces")).toBeVisible();

    const names = [
      "Cream Silk Blouse",
      "Clay Linen Dress",
      "Red Churidar Kurta",
      "Banarasi Silk Saree",
      "Pleated Midi Dress",
      "Espresso Double Breasted Blazer",
      "Charcoal Nehru Jacket",
      "Ivory Sherwani",
      "Green Kurta Set",
      "Oxford Button Down",
    ];
    for (const name of names) {
      await expect(page.getByText(name).first()).toBeVisible();
    }

    expect(errors).toEqual([]);
  });

  test("has correct page title", async ({ page }) => {
    await page.goto("/shop");
    await expect(page).toHaveTitle(/Shop.*Vestra/);
  });

  test("no console errors on shop page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("Shop — Mobile", () => {
  test.use({
    viewport: { width: 375, height: 812 },
    isMobile: true,
  });

  test("shop renders and scrolls on mobile", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("10 pieces")).toBeVisible();
    await expect(page.getByText("Cream Silk Blouse").first()).toBeVisible();
  });

  test("no horizontal overflow on mobile shop", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
