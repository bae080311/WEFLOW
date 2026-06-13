import { describe, it, expect } from "vitest";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "./legal";
import { COMPANY } from "./company";

describe("legal — 개인정보처리방침", () => {
  it("필수 섹션을 포함", () => {
    const headings = PRIVACY_POLICY.sections.map((s) => s.heading);
    expect(headings).toContain("수집하는 개인정보 항목");
    expect(headings).toContain("개인정보의 수집 및 이용 목적");
    expect(headings).toContain("개인정보의 보유 및 이용 기간");
    expect(headings).toContain("개인정보 보호책임자");
  });

  it("보호책임자 섹션에 회사 이메일 표기", () => {
    const responsible = PRIVACY_POLICY.sections.find((s) => s.heading === "개인정보 보호책임자");
    expect(responsible?.items?.some((item) => item.includes(COMPANY.email))).toBe(true);
  });
});

describe("legal — 이용약관", () => {
  it("필수 섹션을 포함", () => {
    const headings = TERMS_OF_SERVICE.sections.map((s) => s.heading);
    expect(headings).toContain("목적");
    expect(headings).toContain("용어의 정의");
    expect(headings).toContain("서비스의 제공 및 내용");
    expect(headings).toContain("분쟁 해결 및 준거법");
  });
});
