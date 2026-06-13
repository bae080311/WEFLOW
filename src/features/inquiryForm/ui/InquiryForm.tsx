"use client";

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
import { cn } from "@/shared/lib";
import type { InquirySource } from "@/shared/types";
import { INQUIRY_STEPS, useInquiryForm } from "../model/useInquiryForm";

export type InquiryFormProps = {
  source?: InquirySource | null;
  className?: string;
  onSuccess?: () => void;
};

// 재사용 문의 폼(FormModal · 무료진단 · 랜딩 sticky 공용). 2단계: ① 정보 입력 ② 동의 & 제출.
export function InquiryForm({ source, className, onSuccess }: InquiryFormProps) {
  const {
    values,
    errors,
    step,
    submitting,
    submitted,
    submitError,
    setField,
    goNext,
    goBack,
    handleSubmit,
    reset,
  } = useInquiryForm(source ?? "review_modal", onSuccess);

  if (submitted) {
    return (
      <FormSuccess
        className={className}
        title="문의가 접수되었습니다"
        description="담당자가 확인 후 빠르게 연락드리겠습니다."
      >
        <Button type="button" variant="outlined" onClick={reset}>
          새 문의 작성
        </Button>
      </FormSuccess>
    );
  }

  const isLastStep = step === INQUIRY_STEPS.length - 1;

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} noValidate>
      <Stepper steps={INQUIRY_STEPS} current={step} />

      {step === 0 ? (
        <div className="flex flex-col gap-4">
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
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-border bg-surface-2 p-4">
            <p className="text-body text-text">
              {values.name} · {values.phone}
            </p>
            <p className="mt-1 text-caption text-text-muted">
              {values.projectType} · {values.industry}
            </p>
          </div>
          <TextareaField
            label="추가요청사항"
            name="note"
            placeholder="요청사항을 적어주세요 (선택)"
            value={values.note}
            onChange={(event) => setField("note", event.target.value)}
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

      <div className="flex gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" className="flex-1" onClick={goBack}>
            이전
          </Button>
        ) : null}
        {isLastStep ? (
          <Button type="submit" variant="gradient" className="flex-1" disabled={submitting}>
            {submitting ? "전송 중…" : "문의 보내기"}
          </Button>
        ) : (
          <Button type="button" variant="gradient" className="flex-1" onClick={goNext}>
            다음
          </Button>
        )}
      </div>
    </form>
  );
}
