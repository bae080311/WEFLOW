import type { PersistedRecord, RecordInput } from "@/shared/api";
import type { InquirySource, ProjectType } from "@/shared/types";

/** 문의 레코드 (diagnosis·landing·modal 공통, requirements §9). */
export interface Inquiry extends PersistedRecord {
  name: string;
  phone: string;
  projectType: ProjectType;
  industry: string;
  note?: string;
  source: InquirySource;
  agreed: true;
}

export type InquiryDraftInput = {
  name: string;
  phone: string;
  projectType: ProjectType;
  industry: string;
  note?: string;
};

/** 폼 값 + source → 저장 입력(순수). trim + agreed:true 강제 + 빈 note 제거. */
export function createInquiryDraft(
  input: InquiryDraftInput,
  source: InquirySource,
): RecordInput<Inquiry> {
  const note = input.note?.trim();
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    projectType: input.projectType,
    industry: input.industry.trim(),
    ...(note ? { note } : {}),
    source,
    agreed: true,
  };
}
