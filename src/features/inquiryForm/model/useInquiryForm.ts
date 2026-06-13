"use client";

import { useState, type FormEvent } from "react";
import { validateInquiry, isValid, type FieldErrors, type InquiryFormValues } from "@/shared/lib";
import { createInquiryDraft, inquiryService } from "@/entities/inquiry";
import type { InquirySource, ProjectType } from "@/shared/types";

const EMPTY: InquiryFormValues = {
  name: "",
  phone: "",
  projectType: "",
  industry: "",
  note: "",
  agreed: false,
};

export const INQUIRY_STEPS = ["정보 입력", "동의 & 제출"];
// 각 단계에서 검증할 필드.
const STEP_FIELDS: string[][] = [["name", "phone", "projectType", "industry"], ["agreed"]];

export function useInquiryForm(source: InquirySource, onSuccess?: () => void) {
  const [values, setValues] = useState<InquiryFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function setField(field: keyof InquiryFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function stepErrors(target: number): FieldErrors {
    const all = validateInquiry(values);
    const picked: FieldErrors = {};
    for (const key of STEP_FIELDS[target]) {
      if (all[key]) picked[key] = all[key];
    }
    return picked;
  }

  function goNext() {
    const errs = stepErrors(step);
    if (!isValid(errs)) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  }

  function goBack() {
    setErrors({});
    setStep((prev) => prev - 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateInquiry(values);
    if (!isValid(validation)) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);
    try {
      await inquiryService.create(
        createInquiryDraft(
          {
            name: values.name,
            phone: values.phone,
            projectType: values.projectType as ProjectType,
            industry: values.industry,
            note: values.note,
          },
          source,
        ),
      );
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setSubmitError("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setStep(0);
    setSubmitError(null);
    setSubmitted(false);
  }

  return {
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
  };
}
