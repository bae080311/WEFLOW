import { isPastDate } from "./datetime";

export type FieldErrors = Record<string, string>;

/** 이름: 필수. */
export function validateName(value: string): string | undefined {
  return value.trim() ? undefined : "이름을 입력해 주세요.";
}

/** 연락처: 필수 + 숫자 9~11자리. */
export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "연락처를 입력해 주세요.";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 11) return "올바른 연락처를 입력해 주세요.";
  return undefined;
}

/** 일반 필수 필드. */
export function validateRequired(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label}을(를) 입력해 주세요.`;
}

/** 개인정보 수집 동의(필수, true 강제). */
export function validateAgreed(agreed: boolean): string | undefined {
  return agreed ? undefined : "개인정보 수집 및 상담 동의가 필요합니다.";
}

export type InquiryFormValues = {
  name: string;
  phone: string;
  projectType: string;
  industry: string;
  note: string;
  agreed: boolean;
};

/** 문의 폼: 이름·연락처·제작종류·업종·동의(필수). */
export function validateInquiry(values: InquiryFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = validateName(values.name);
  if (name) errors.name = name;
  const phone = validatePhone(values.phone);
  if (phone) errors.phone = phone;
  const projectType = validateRequired(values.projectType, "제작종류");
  if (projectType) errors.projectType = projectType;
  const industry = validateRequired(values.industry, "업종");
  if (industry) errors.industry = industry;
  const agreed = validateAgreed(values.agreed);
  if (agreed) errors.agreed = agreed;
  return errors;
}

export type ReservationFormValues = InquiryFormValues & {
  desiredDate: string;
  desiredTime: string;
  isManualTime: boolean;
};

/** 예약 폼: 문의 필수 + 희망일(과거 불가) + 희망시간(그리드 또는 직접입력). */
export function validateReservation(values: ReservationFormValues, now: Date): FieldErrors {
  const errors = validateInquiry(values);
  if (!values.desiredDate.trim()) {
    errors.desiredDate = "희망 날짜를 선택해 주세요.";
  } else if (isPastDate(values.desiredDate, now)) {
    errors.desiredDate = "지난 날짜는 선택할 수 없습니다.";
  }
  if (!values.desiredTime.trim()) {
    errors.desiredTime = "희망 시간을 선택하거나 직접 입력해 주세요.";
  }
  return errors;
}

/** 에러 맵이 비어 있으면 유효. */
export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}
