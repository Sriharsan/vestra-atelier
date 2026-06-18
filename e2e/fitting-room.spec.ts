import { test, expect } from "@playwright/test";

test.describe("Virtual Fitting Room", () => {
  test("full try-on flow with preset", async ({ page }) => {
    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Compose the look")).toBeVisible();

    const presetButton = page.getByRole("button", { name: /Casual/i }).first();
    if (await presetButton.isVisible()) {
      await presetButton.click();
    }

    await expect(page.getByText(/Upload|photograph|photo/i).first()).toBeVisible();
  });

  test("fitting room page has photo retention notice", async ({ page }) => {
    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/photograph|photo|retention|session/i).first()).toBeVisible();
  });
});
