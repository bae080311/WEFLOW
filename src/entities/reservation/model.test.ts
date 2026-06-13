import { describe, it, expect } from "vitest";
import { createReservationDraft } from "./model";

describe("createReservationDraft", () => {
  it("trim + agreed:true 강제", () => {
    const draft = createReservationDraft({
      name: "  홍길동 ",
      phone: " 010-1234-5678 ",
      desiredDate: "2026-06-20",
      desiredTime: " 14:00 ",
      isManualTime: false,
      projectType: "홈페이지 제작",
      industry: " 카페 ",
      note: "  잘 부탁드립니다  ",
    });
    expect(draft.name).toBe("홍길동");
    expect(draft.phone).toBe("010-1234-5678");
    expect(draft.desiredTime).toBe("14:00");
    expect(draft.industry).toBe("카페");
    expect(draft.note).toBe("잘 부탁드립니다");
    expect(draft.agreed).toBe(true);
  });

  it("빈 note 는 생략", () => {
    const draft = createReservationDraft({
      name: "a",
      phone: "010-1234-5678",
      desiredDate: "2026-06-20",
      desiredTime: "14:00",
      isManualTime: true,
      projectType: "랜딩페이지 제작",
      industry: "헬스장",
      note: "   ",
    });
    expect(draft.note).toBeUndefined();
    expect(draft.isManualTime).toBe(true);
  });
});
