import { describe, it, expect } from "vitest";
import { company } from "./company";

describe("company", () => {
  it("공식 회사 정보를 담는다", () => {
    expect(company.name).toBe("WEFLOW");
    expect(company.ceo).toBe("신서준");
    expect(company.businessNumber).toBe("884-07-03480");
    expect(company.email).toBe("contact@weflowlab.kr");
    expect(company.hours).toBe("연중무휴 24시간 상담가능");
  });
});
