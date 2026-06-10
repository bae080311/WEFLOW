import { test, expect } from "@playwright/test";

test("홈 페이지가 렌더된다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "WEFLOW" })).toBeVisible();
});
