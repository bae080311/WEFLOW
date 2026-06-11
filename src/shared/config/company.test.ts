import { describe, it, expect } from "vitest";
import { COMPANY } from "./company";

describe("COMPANY", () => {
  it("공식 회사 정보를 담는다", () => {
    expect(COMPANY.name).toBe("WEFLOW");
    expect(COMPANY.ceo).toBe("신서준");
    expect(COMPANY.businessNumber).toBe("884-07-03480");
    expect(COMPANY.email).toBe("contact@weflowlab.kr");
    expect(COMPANY.hours).toBe("연중무휴 24시간 상담가능");
  });
});
