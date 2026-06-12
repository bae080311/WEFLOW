import { describe, it, expect } from "vitest";
import { CASES } from "./model";
import { getCaseDetail } from "./detail";

describe("getCaseDetail", () => {
  it("28개 업종 모두 상세 콘텐츠를 생성한다", () => {
    expect(CASES).toHaveLength(28);
    CASES.forEach((c) => {
      const detail = getCaseDetail(c);
      expect(detail.industry).toBe(c.industry);
      expect(detail.problem.length).toBeGreaterThan(0);
      expect(detail.direction.length).toBeGreaterThan(0);
      expect(detail.expectedEffect.length).toBeGreaterThan(0);
      expect(detail.inquiryImprovements.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("업종명을 문제 상황·기대 효과 산문에 반영한다", () => {
    const detail = getCaseDetail(CASES[0]);
    expect(detail.problem).toContain(CASES[0].industry);
    expect(detail.expectedEffect).toContain(CASES[0].industry);
  });

  it("어떤 업종에서도 의료/병원 관련 표현을 포함하지 않는다", () => {
    const banned = ["병원", "의료", "진료", "시술", "환자", "처방", "치료", "클리닉", "의원"];
    CASES.forEach((c) => {
      const detail = getCaseDetail(c);
      const haystack = [
        detail.industry,
        detail.problem,
        detail.direction,
        detail.expectedEffect,
        ...detail.inquiryImprovements,
      ].join(" ");
      banned.forEach((word) => expect(haystack).not.toContain(word));
    });
  });
});
