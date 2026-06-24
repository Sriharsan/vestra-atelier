import { test, expect } from "@playwright/test";

test.describe("Virtual Fitting Room", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");
  });

  test("renders the dressing room heading", async ({ page }) => {
    await expect(page.getByText("Upload your photo,")).toBeVisible();
    await expect(page.getByText("try it on.")).toBeVisible();
  });

  test("person preset is selected by default", async ({ page }) => {
    const personImg = page.getByAltText("Selected person");
    await expect(personImg).toBeVisible();
  });

  test("gender toggle filters looks", async ({ page }) => {
    await expect(page.getByText("Anarkali Suit")).toBeVisible();
    await expect(page.getByText("Lehenga Choli")).toBeVisible();

    await page.getByRole("radio", { name: "Men", exact: true }).click();
    await expect(page.getByText("Sherwani")).toBeVisible();
    await expect(page.getByText("Kurta with Nehru Jacket")).toBeVisible();
    await expect(page.getByText("Anarkali Suit")).not.toBeVisible();
  });

  test("demo try-on flow completes", async ({ page }) => {
    const anarkaliBtn = page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first();
    await anarkaliBtn.click();
    await expect(anarkaliBtn).toHaveAttribute("aria-pressed", "true");

    await page.locator("button.btn-saffron").click();

    await expect(page.getByText("Your look is ready.")).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText("Demo preview")).toBeVisible();
  });

  test("privacy notice is visible", async ({ page }) => {
    await expect(page.getByText(/photograph stays in your browser/i)).toBeVisible();
  });
});
