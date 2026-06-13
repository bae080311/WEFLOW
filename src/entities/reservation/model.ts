import type { PersistedRecord, RecordInput } from "@/shared/api";
import type { ProjectType } from "@/shared/types";

/** 예약 레코드 (requirements §9). */
export interface Reservation extends PersistedRecord {
  name: string;
  phone: string;
  desiredDate: string; // 희망일 (YYYY-MM-DD)
  desiredTime: string; // 희망시간 (20슬롯 중 하나 또는 직접입력)
  isManualTime: boolean;
  projectType: ProjectType;
  industry: string;
  note?: string;
  agreed: true; // 개인정보 동의(필수)
}

export type ReservationDraftInput = {
  name: string;
  phone: string;
  desiredDate: string;
  desiredTime: string;
  isManualTime: boolean;
  projectType: ProjectType;
  industry: string;
  note?: string;
};

/** 폼 값 → 저장 입력(순수). trim + agreed:true 강제 + 빈 note 제거. */
export function createReservationDraft(input: ReservationDraftInput): RecordInput<Reservation> {
  const note = input.note?.trim();
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    desiredDate: input.desiredDate,
    desiredTime: input.desiredTime.trim(),
    isManualTime: input.isManualTime,
    projectType: input.projectType,
    industry: input.industry.trim(),
    ...(note ? { note } : {}),
    agreed: true,
  };
}
