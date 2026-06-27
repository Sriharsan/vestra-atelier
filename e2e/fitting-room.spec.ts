import { test, expect } from "@playwright/test";
import { resolve, dirname } from "node:path";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

  test("demo try-on flow completes with comparison slider", async ({ page }) => {
    const anarkaliBtn = page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first();
    await anarkaliBtn.click();
    await expect(anarkaliBtn).toHaveAttribute("aria-pressed", "true");

    await page.locator("button.btn-saffron").click();

    await expect(page.getByText("Your look is ready.")).toBeVisible({
      timeout: 10_000,
    });

    await expect(page.getByText("Demo preview")).toBeVisible();

    const slider = page.getByRole("slider", { name: "Drag to compare" });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("aria-valuemin", "0");
    await expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  test("result actions appear after render", async ({ page }) => {
    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();
    await expect(page.getByText("Your look is ready.")).toBeVisible({ timeout: 10_000 });

    await expect(page.getByRole("link", { name: /Download/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Try another/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Share/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Shop this look/ })).toBeVisible();
  });

  test("reset clears result and selection", async ({ page }) => {
    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();
    await expect(page.getByText("Your look is ready.")).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /Reset/ }).click();
    await expect(page.getByText("Your look is ready.")).not.toBeVisible();
    await expect(page.getByRole("slider")).not.toBeVisible();
  });

  test("try another clears result but keeps selection", async ({ page }) => {
    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();
    await expect(page.getByText("Your look is ready.")).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /Try another/ }).click();
    await expect(page.getByRole("slider")).not.toBeVisible();
    await expect(
      page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first(),
    ).toBeVisible();
  });

  test("privacy notice is visible", async ({ page }) => {
    await expect(page.getByText(/photograph stays in your browser/i)).toBeVisible();
  });

  test("upload rejects invalid file types", async ({ page }) => {
    const tmpFile = resolve(__dirname, "tmp-test.txt");
    writeFileSync(tmpFile, "not an image");
    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpFile);
      await expect(page.getByText("Upload a JPG, PNG, or WebP image.")).toBeVisible();
    } finally {
      unlinkSync(tmpFile);
    }
  });

  test("upload accepts a valid JPEG image", async ({ page }) => {
    const peoplePath = resolve(__dirname, "../public/demo/people/woman-1.jpg");
    if (!existsSync(peoplePath)) {
      test.skip();
      return;
    }
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(peoplePath);
    await expect(page.getByAltText("Your upload")).toBeVisible();
  });

  test("keyboard navigates comparison slider", async ({ page }) => {
    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();
    await expect(page.getByText("Your look is ready.")).toBeVisible({ timeout: 10_000 });

    const slider = page.getByRole("slider", { name: "Drag to compare" });
    await slider.focus();

    const initialValue = await slider.getAttribute("aria-valuenow");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    const newValue = await slider.getAttribute("aria-valuenow");
    expect(Number(newValue)).toBeLessThan(Number(initialValue));
  });

  test("aria-live region updates during render", async ({ page }) => {
    const liveRegion = page.locator("[aria-live='polite']");
    await expect(liveRegion).toContainText("Ready to try on.");

    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();

    await expect(liveRegion).toContainText("Your look is ready.", { timeout: 10_000 });
  });

  test("no console errors on try-on page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();
    await expect(page.getByText("Your look is ready.")).toBeVisible({ timeout: 10_000 });

    expect(errors).toEqual([]);
  });

  test("gender radiogroup has correct aria attributes", async ({ page }) => {
    const radiogroup = page.getByRole("radiogroup", { name: "Gender selection" });
    await expect(radiogroup).toBeVisible();

    const womenRadio = page.getByRole("radio", { name: "Women" });
    await expect(womenRadio).toHaveAttribute("aria-checked", "true");

    const menRadio = page.getByRole("radio", { name: "Men", exact: true });
    await expect(menRadio).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("Virtual Fitting Room — Mobile", () => {
  test.use({
    viewport: { width: 375, height: 812 },
    isMobile: true,
  });

  test("diptych stacks vertically on mobile", async ({ page }) => {
    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Upload your photo,")).toBeVisible();
    await expect(page.getByText("Choose a look", { exact: true })).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
  });

  test("try-on flow works on mobile viewport", async ({ page }) => {
    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button").filter({ hasText: "Anarkali Suit" }).first().click();
    await page.locator("button.btn-saffron").click();
    await expect(page.getByText("Your look is ready.")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Demo preview")).toBeVisible();
  });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/try-on");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
