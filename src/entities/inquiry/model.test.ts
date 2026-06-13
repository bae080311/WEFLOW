import { describe, it, expect } from "vitest";
import { createInquiryDraft } from "./model";

describe("createInquiryDraft", () => {
  it("source 를 기록하고 agreed:true 강제", () => {
    const draft = createInquiryDraft(
      {
        name: " 김철수 ",
        phone: "010-0000-0000",
        projectType: "랜딩&홈페이지 제작",
        industry: " 필라테스 ",
        note: " 상담 원해요 ",
      },
      "diagnosis",
    );
    expect(draft.source).toBe("diagnosis");
    expect(draft.name).toBe("김철수");
    expect(draft.industry).toBe("필라테스");
    expect(draft.note).toBe("상담 원해요");
    expect(draft.agreed).toBe(true);
  });

  it("source 별로 다르게 기록 + 빈 note 생략", () => {
    const draft = createInquiryDraft(
      {
        name: "a",
        phone: "010-0000-0000",
        projectType: "기타(weflow 케어플랜)",
        industry: "카페",
      },
      "landing",
    );
    expect(draft.source).toBe("landing");
    expect(draft.note).toBeUndefined();
  });
});
