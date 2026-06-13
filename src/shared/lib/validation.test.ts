import { describe, it, expect } from "vitest";
import {
  validateName,
  validatePhone,
  validateRequired,
  validateAgreed,
  validateInquiry,
  validateReservation,
  isValid,
  type InquiryFormValues,
  type ReservationFormValues,
} from "./validation";

const validInquiry: InquiryFormValues = {
  name: "홍길동",
  phone: "010-1234-5678",
  projectType: "홈페이지 제작",
  industry: "카페",
  note: "",
  agreed: true,
};

describe("validation — 개별 규칙", () => {
  it("이름 필수", () => {
    expect(validateName("")).toBeDefined();
    expect(validateName("  ")).toBeDefined();
    expect(validateName("홍길동")).toBeUndefined();
  });

  it("연락처 필수 + 자릿수", () => {
    expect(validatePhone("")).toBeDefined();
    expect(validatePhone("123")).toBeDefined();
    expect(validatePhone("010-1234-5678")).toBeUndefined();
    expect(validatePhone("0212345678")).toBeUndefined();
  });

  it("일반 필수 필드", () => {
    expect(validateRequired("", "업종")).toContain("업종");
    expect(validateRequired("카페", "업종")).toBeUndefined();
  });

  it("동의 true 강제", () => {
    expect(validateAgreed(false)).toBeDefined();
    expect(validateAgreed(true)).toBeUndefined();
  });
});

describe("validation — validateInquiry", () => {
  it("정상 입력은 에러 없음", () => {
    expect(isValid(validateInquiry(validInquiry))).toBe(true);
  });

  it("누락 필드마다 에러 키", () => {
    const errors = validateInquiry({
      name: "",
      phone: "",
      projectType: "",
      industry: "",
      note: "",
      agreed: false,
    });
    expect(Object.keys(errors).sort()).toEqual(
      ["agreed", "industry", "name", "phone", "projectType"].sort(),
    );
    expect(isValid(errors)).toBe(false);
  });

  it("동의 누락만 있으면 agreed 에러", () => {
    const errors = validateInquiry({ ...validInquiry, agreed: false });
    expect(errors).toHaveProperty("agreed");
    expect(Object.keys(errors)).toHaveLength(1);
  });
});

describe("validation — validateReservation", () => {
  const now = new Date(2026, 5, 13, 13, 0);
  const base: ReservationFormValues = {
    ...validInquiry,
    desiredDate: "2026-06-20",
    desiredTime: "14:00",
    isManualTime: false,
  };

  it("정상 예약은 에러 없음", () => {
    expect(isValid(validateReservation(base, now))).toBe(true);
  });

  it("과거 날짜는 에러", () => {
    const errors = validateReservation({ ...base, desiredDate: "2026-06-01" }, now);
    expect(errors.desiredDate).toContain("지난 날짜");
  });

  it("날짜 미선택 에러", () => {
    const errors = validateReservation({ ...base, desiredDate: "" }, now);
    expect(errors).toHaveProperty("desiredDate");
  });

  it("시간 미선택 에러", () => {
    const errors = validateReservation({ ...base, desiredTime: "" }, now);
    expect(errors).toHaveProperty("desiredTime");
  });

  it("직접 입력 시간만 있어도 통과", () => {
    const errors = validateReservation(
      { ...base, desiredTime: "오후 2시쯤", isManualTime: true },
      now,
    );
    expect(isValid(errors)).toBe(true);
  });
});
