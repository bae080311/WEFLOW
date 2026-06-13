import { describe, it, expect } from "vitest";
import { reservationRows, inquiryRows } from "./excelRows";
import type { Reservation } from "@/entities/reservation";
import type { Inquiry } from "@/entities/inquiry";

const reservation: Reservation = {
  id: "1",
  status: "대기",
  createdAt: "2026-06-13T09:30:00.000Z",
  name: "홍길동",
  phone: "010-1234-5678",
  desiredDate: "2026-06-20",
  desiredTime: "14:00",
  isManualTime: false,
  projectType: "홈페이지 제작",
  industry: "카페",
  note: "메모",
  agreed: true,
};

const inquiry: Inquiry = {
  id: "2",
  status: "진행중",
  createdAt: "2026-06-13T10:00:00.000Z",
  name: "김철수",
  phone: "010-0000-0000",
  projectType: "랜딩페이지 제작",
  industry: "필라테스",
  source: "diagnosis",
  agreed: true,
};

describe("excelRows", () => {
  it("예약 행을 한글 헤더로 매핑", () => {
    const [row] = reservationRows([reservation]);
    expect(Object.keys(row)).toEqual([
      "상태",
      "이름",
      "연락처",
      "접수일",
      "희망일",
      "희망시간",
      "제작종류",
      "업종",
      "추가요청사항",
    ]);
    expect(row.접수일).toBe("2026-06-13 09:30");
    expect(row.희망시간).toBe("14:00");
  });

  it("문의 행은 유입경로를 한글로 매핑", () => {
    const [row] = inquiryRows([inquiry]);
    expect(row.유입경로).toBe("무료진단");
    expect(row.상태).toBe("진행중");
  });

  it("note 없으면 빈 문자열", () => {
    const [row] = inquiryRows([{ ...inquiry, note: undefined }]);
    expect(row.추가요청사항).toBe("");
  });
});
