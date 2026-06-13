import { test, expect } from "@playwright/test";

test("무료진단 페이지가 진단 체크리스트와 단계형 문의 폼을 노출한다", async ({ page }) => {
  await page.goto("/diagnosis");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("무료진단");
  await expect(page.getByText("문의 구조 진단")).toBeVisible();

  // 1단계: 정보 입력
  await expect(page.getByLabel(/이름/)).toBeVisible();
  await expect(page.getByLabel(/연락처/)).toBeVisible();
  await expect(page.getByRole("combobox", { name: /제작종류/ })).toBeVisible();
  await expect(page.getByLabel(/업종/)).toBeVisible();

  await page.getByLabel(/이름/).fill("홍길동");
  await page.getByLabel(/연락처/).fill("010-1234-5678");
  await page.getByRole("combobox", { name: /제작종류/ }).click();
  await page.getByRole("option", { name: "홈페이지 제작", exact: true }).click();
  await page.getByLabel(/업종/).fill("카페");
  await page.getByRole("button", { name: "다음", exact: true }).click();

  // 2단계: 추가요청 + 동의 + 제출
  await expect(page.getByLabel(/추가요청사항/)).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /개인정보 수집/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "문의 보내기" })).toBeVisible();
});

test("예약 페이지가 달력과 오전/오후 시간 선택을 노출한다", async ({ page }) => {
  await page.goto("/reservation");
  await expect(page.getByRole("group", { name: "희망 날짜 선택" })).toBeVisible();
  await expect(page.getByRole("button", { name: "다음 달" })).toBeVisible();
  // 오전/오후 세그먼트로 슬롯 묶음 표시
  await expect(page.getByRole("button", { name: "오전", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "오후", exact: true }).click();
  await expect(page.getByRole("button", { name: "18:30" })).toBeVisible();
  await page.getByRole("button", { name: "오전", exact: true }).click();
  await expect(page.getByRole("button", { name: "09:00" })).toBeVisible();
  await expect(page.getByLabel(/원하시는 시간대/)).toBeVisible();
  // 1단계 → "다음"으로 진행하는 스텝 위저드
  await expect(page.getByText("일정 선택")).toBeVisible();
  await expect(page.getByRole("button", { name: "다음", exact: true })).toBeVisible();
});

test("예약 스텝 위저드: 일정 → 정보 → 확인 진행", async ({ page }) => {
  await page.goto("/reservation");
  await page.getByRole("button", { name: "다음 달" }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await page.getByRole("button", { name: "오후", exact: true }).click();
  await page.getByRole("button", { name: "14:00" }).click();
  await page.getByRole("button", { name: "다음", exact: true }).click();

  await page.getByLabel(/이름/).fill("홍길동");
  await page.getByLabel(/연락처/).fill("010-1234-5678");
  await page.getByRole("combobox", { name: /제작종류/ }).click();
  await page.getByRole("option", { name: "랜딩페이지 제작", exact: true }).click();
  await page.getByLabel(/업종/).fill("필라테스");
  await page.getByRole("button", { name: "다음", exact: true }).click();

  // 3단계: 확인 요약 + 동의 + 제출 버튼
  await expect(page.getByText("홍길동")).toBeVisible();
  await expect(page.getByRole("button", { name: "예약 신청하기" })).toBeVisible();
});

test("랜딩 '실제 제작 성공 보기' → /cases", async ({ page }) => {
  await page.goto("/landing");
  await page.getByRole("link", { name: "실제 제작 성공 보기" }).click();
  await expect(page).toHaveURL(/\/cases$/);
});

test("랜딩 '무료진단 후 견적받기' → 문의 모달", async ({ page }) => {
  await page.goto("/landing");
  await page.getByRole("button", { name: "무료진단 후 견적받기" }).click();
  await expect(page.getByRole("dialog", { name: "무료 상담 문의" })).toBeVisible();
});

test("Footer 개인정보처리방침 / 이용약관 링크", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "개인정보처리방침" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { level: 1, name: "개인정보처리방침" })).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: "이용약관" }).click();
  await expect(page).toHaveURL(/\/terms$/);
  await expect(page.getByRole("heading", { level: 1, name: "이용약관" })).toBeVisible();
});

test("관리자 페이지는 미인증 시 로그인 게이트를 노출한다", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "관리자 로그인" })).toBeVisible();
});
