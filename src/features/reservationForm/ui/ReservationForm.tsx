"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck } from "lucide-react";
import {
  Button,
  CheckboxField,
  FormAlert,
  FormField,
  FormSuccess,
  SelectField,
  Stepper,
  TextareaField,
} from "@/shared/ui";
import { PROJECT_TYPE_OPTIONS } from "@/shared/config";
import {
  cn,
  formatDateKo,
  formatTimeKo,
  isValid,
  useNow,
  validateReservation,
  type FieldErrors,
} from "@/shared/lib";
import { createReservationDraft, reservationService } from "@/entities/reservation";
import type { ProjectType } from "@/shared/types";
import { Calendar } from "./Calendar";
import { TimePicker } from "./TimePicker";

export type ReservationFormProps = {
  className?: string;
  onSuccess?: () => void;
};

type InquiryValues = {
  name: string;
  phone: string;
  projectType: string;
  industry: string;
  note: string;
  agreed: boolean;
};

const EMPTY: InquiryValues = {
  name: "",
  phone: "",
  projectType: "",
  industry: "",
  note: "",
  agreed: false,
};

const STEPS = ["일정 선택", "정보 입력", "확인 및 동의"];
// 각 단계에서 검증할 필드 키.
const STEP_FIELDS: string[][] = [
  ["desiredDate", "desiredTime"],
  ["name", "phone", "projectType", "industry"],
  ["agreed"],
];

// 예약 폼(3단계): ① 일정(달력+20슬롯+직접입력) ② 정보 ③ 확인·동의. 제출 시 예약 서비스 기록.
export function ReservationForm({ className, onSuccess }: ReservationFormProps) {
  const now = useNow();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<InquiryValues>(EMPTY);
  const [desiredDate, setDesiredDate] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [isManualTime, setIsManualTime] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function setField(field: keyof InquiryValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // 그리드 선택 ↔ 직접 입력은 상호배타.
  function selectSlot(slot: string) {
    setDesiredTime(slot);
    setIsManualTime(false);
  }
  function changeManual(text: string) {
    setDesiredTime(text);
    setIsManualTime(true);
  }

  function allErrors(): FieldErrors {
    const all = { ...values, desiredDate, desiredTime, isManualTime };
    return validateReservation(all, now ?? new Date());
  }

  function stepErrors(targetStep: number): FieldErrors {
    const full = allErrors();
    const picked: FieldErrors = {};
    for (const key of STEP_FIELDS[targetStep]) {
      if (full[key]) picked[key] = full[key];
    }
    return picked;
  }

  function handleNext() {
    const errs = stepErrors(step);
    if (!isValid(errs)) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((prev) => prev - 1);
  }

  function goToStep(target: number) {
    setErrors({});
    setStep(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const full = allErrors();
    if (!isValid(full)) {
      setErrors(full);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    try {
      await reservationService.create(
        createReservationDraft({
          name: values.name,
          phone: values.phone,
          desiredDate,
          desiredTime,
          isManualTime,
          projectType: values.projectType as ProjectType,
          industry: values.industry,
          note: values.note,
        }),
      );
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setSubmitError("예약 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <FormSuccess
        className={className}
        title="예약이 접수되었습니다"
        description="희망 일정을 확인한 뒤 담당자가 빠르게 연락드리겠습니다."
      />
    );
  }

  const gridSelected = isManualTime ? "" : desiredTime;
  const manualValue = isManualTime ? desiredTime : "";
  const timeLabel = desiredTime ? (isManualTime ? desiredTime : formatTimeKo(desiredTime)) : "";

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} noValidate>
      <Stepper steps={STEPS} current={step} />

      {step === 0 ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-caption font-medium text-text">
              희망 날짜<span className="text-danger"> *</span>
            </span>
            <Calendar value={desiredDate} onSelect={setDesiredDate} now={now} />
            {errors.desiredDate ? (
              <p className="text-caption text-danger">{errors.desiredDate}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-caption font-medium text-text">
              희망 시간<span className="text-danger"> *</span>
            </span>
            <TimePicker
              value={gridSelected}
              manualValue={manualValue}
              dateISO={desiredDate}
              now={now}
              onSelectSlot={selectSlot}
              onManualChange={changeManual}
            />
            {errors.desiredTime ? (
              <p className="text-caption text-danger">{errors.desiredTime}</p>
            ) : null}
          </div>

          {desiredDate && desiredTime ? (
            <div className="flex items-center gap-2 rounded-control border border-brand-cyan/40 bg-surface-2 px-4 py-3 text-body text-text">
              <CalendarCheck className="size-4 shrink-0 text-brand-cyan" aria-hidden />
              <span>
                {formatDateKo(desiredDate)} · {timeLabel}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="이름"
              name="name"
              required
              placeholder="홍길동"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              error={errors.name}
            />
            <FormField
              label="연락처"
              name="phone"
              type="tel"
              required
              placeholder="010-0000-0000"
              value={values.phone}
              onChange={(event) => setField("phone", event.target.value)}
              error={errors.phone}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="제작종류"
              name="projectType"
              required
              placeholder="선택해 주세요"
              options={PROJECT_TYPE_OPTIONS.map((option) => ({ value: option, label: option }))}
              value={values.projectType}
              onValueChange={(value) => setField("projectType", value)}
              error={errors.projectType}
            />
            <FormField
              label="업종"
              name="industry"
              required
              placeholder="예: 카페"
              value={values.industry}
              onChange={(event) => setField("industry", event.target.value)}
              error={errors.industry}
            />
          </div>
          <TextareaField
            label="추가요청사항"
            name="note"
            placeholder="요청사항을 적어주세요 (선택)"
            value={values.note}
            onChange={(event) => setField("note", event.target.value)}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-4">
          <SummaryCard
            title="일정"
            onEdit={() => goToStep(0)}
            items={[
              { label: "날짜", value: desiredDate ? formatDateKo(desiredDate) : "-" },
              { label: "시간", value: timeLabel || "-" },
            ]}
          />
          <SummaryCard
            title="신청 정보"
            onEdit={() => goToStep(1)}
            items={[
              { label: "이름", value: values.name || "-" },
              { label: "연락처", value: values.phone || "-" },
              { label: "제작종류", value: values.projectType || "-" },
              { label: "업종", value: values.industry || "-" },
              { label: "추가요청사항", value: values.note || "-" },
            ]}
          />
          <CheckboxField
            label="개인정보 수집 및 상담 동의 (필수)"
            name="agreed"
            required
            checked={values.agreed}
            onChange={(event) => setField("agreed", event.target.checked)}
            error={errors.agreed}
          />
        </div>
      ) : null}

      {submitError ? <FormAlert>{submitError}</FormAlert> : null}

      <div className="flex items-center gap-3 pt-1">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={handleBack}>
            이전
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            variant="gradient"
            size="lg"
            className="flex-1"
            onClick={handleNext}
          >
            다음
          </Button>
        ) : (
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="flex-1"
            disabled={submitting}
          >
            {submitting ? "전송 중…" : "예약 신청하기"}
          </Button>
        )}
      </div>
    </form>
  );
}

// 확인 단계 요약 카드 — 헤더의 "수정"으로 해당 단계로 점프.
function SummaryCard({
  title,
  onEdit,
  items,
}: {
  title: string;
  onEdit: () => void;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-card border border-border bg-surface-2 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-body font-bold text-text">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded text-caption text-brand-cyan transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          수정
        </button>
      </div>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-caption text-text-muted">{item.label}</dt>
            <dd className="mt-1 break-keep text-body text-text">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
