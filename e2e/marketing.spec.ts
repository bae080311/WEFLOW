import { test, expect } from "@playwright/test";

test("네비게이션이 가격 페이지로 연결된다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "제작플랜&가격안내" }).first().click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole("heading", { name: "제작플랜 & 가격안내" })).toBeVisible();
});

test("가격 페이지 CTA가 무료진단으로 연결된다", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: "무료 진단 신청" }).click();
  await expect(page).toHaveURL(/\/diagnosis$/);
});

test("성공사례 카드 → 상세 → 무료진단 CTA", async ({ page }) => {
  await page.goto("/cases");
  await page
    .getByRole("link", { name: /자세히 보기/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/cases\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 2, name: "문제 상황" })).toBeVisible();
  await page.getByRole("link", { name: "무료진단 받기" }).click();
  await expect(page).toHaveURL(/\/diagnosis$/);
});

test("홈 후기 더보기 링크가 무료진단으로 연결된다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /후기 더보기/ }).click();
  await expect(page).toHaveURL(/\/diagnosis$/);
});

test("알 수 없는 사례 슬러그는 404를 반환한다", async ({ page }) => {
  const res = await page.goto("/cases/__not_a_real_case__");
  expect(res?.status()).toBe(404);
});
