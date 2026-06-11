"use client";

import { type FormEvent } from "react";
import { Button, CheckboxField, FormField, Modal, SelectField, TextareaField } from "@/shared/ui";
import { useInquiryModal } from "@/shared/lib";
import { PROJECT_TYPE_OPTIONS } from "@/shared/config";

export function FormModal() {
  const { isOpen, closeInquiryModal } = useInquiryModal();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeInquiryModal();
  };

  return (
    <Modal open={isOpen} onClose={closeInquiryModal} title="무료 상담 문의">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormField label="이름" name="name" required placeholder="홍길동" />
        <FormField label="연락처" name="phone" type="tel" required placeholder="010-0000-0000" />
        <SelectField
          label="제작종류"
          name="projectType"
          required
          placeholder="선택해 주세요"
          options={PROJECT_TYPE_OPTIONS.map((option) => ({ value: option, label: option }))}
        />
        <FormField label="업종" name="industry" required placeholder="예: 카페" />
        <TextareaField
          label="추가요청사항"
          name="note"
          placeholder="요청사항을 적어주세요 (선택)"
        />
        <CheckboxField label="개인정보 수집 및 상담 동의 (필수)" name="agreed" required />
        <Button type="submit" variant="gradient" className="mt-2">
          문의 보내기
        </Button>
      </form>
    </Modal>
  );
}
