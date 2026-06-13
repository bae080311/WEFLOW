import { formatDateTime } from "@/shared/lib";
import type { InquirySource } from "@/shared/types";
import type { Reservation } from "@/entities/reservation";
import type { Inquiry } from "@/entities/inquiry";

export type ExcelRow = Record<string, string>;

const SOURCE_LABELS: Record<InquirySource, string> = {
  diagnosis: "무료진단",
  landing: "랜딩",
  review_modal: "후기 모달",
  cases: "성공사례",
};

// 한글 컬럼 헤더로 매핑(엑셀 시트 표시용).
export function reservationRows(reservations: Reservation[]): ExcelRow[] {
  return reservations.map((r) => ({
    상태: r.status,
    이름: r.name,
    연락처: r.phone,
    접수일: formatDateTime(r.createdAt),
    희망일: r.desiredDate,
    희망시간: r.desiredTime,
    제작종류: r.projectType,
    업종: r.industry,
    추가요청사항: r.note ?? "",
  }));
}

export function inquiryRows(inquiries: Inquiry[]): ExcelRow[] {
  return inquiries.map((i) => ({
    상태: i.status,
    이름: i.name,
    연락처: i.phone,
    접수일: formatDateTime(i.createdAt),
    유입경로: SOURCE_LABELS[i.source],
    제작종류: i.projectType,
    업종: i.industry,
    추가요청사항: i.note ?? "",
  }));
}
