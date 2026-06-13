"use client";

import { Modal } from "@/shared/ui";
import { useInquiryModal } from "@/shared/lib";
import { InquiryForm } from "@/features/inquiryForm";

// 전역 문의 모달. 내부 폼은 재사용 features/inquiryForm. source 는 모달을 연 CTA 출처.
export function FormModal() {
  const { isOpen, source, closeInquiryModal } = useInquiryModal();

  return (
    <Modal open={isOpen} onClose={closeInquiryModal} title="무료 상담 문의">
      <InquiryForm source={source} onSuccess={closeInquiryModal} />
    </Modal>
  );
}
