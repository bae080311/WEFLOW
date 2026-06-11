import { test, expect } from "@playwright/test";

test("홈 히어로가 렌더되고 핵심 CTA가 연결된다", async ({ page }) => {
  await page.goto("/");

  // 히어로 제목 (§3-1)
  await expect(
    page.getByRole("heading", { level: 1, name: /문의로 이어지는\s*홈페이지를 만듭니다/ }),
  ).toBeVisible();

  // 헤더 로고 (전역 셸)
  await expect(page.getByRole("link", { name: "WEFLOW 홈" })).toBeVisible();

  // 히어로 CTA → 무료진단
  await page.getByRole("link", { name: "무료 진단 신청" }).click();
  await expect(page).toHaveURL(/\/diagnosis$/);
});
