"use client";

import type { ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/shared/ui";
import { useInquiryModal } from "@/shared/lib";
import type { InquirySource } from "@/shared/types";

export type InquiryModalButtonProps = {
  source?: InquirySource;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

// 전역 문의 모달을 여는 CTA. 모달 훅을 쓰므로 client 경계는 이 컴포넌트 한 곳으로 격리한다.
export function InquiryModalButton({
  source,
  variant = "outlined",
  size = "md",
  className,
  children,
}: InquiryModalButtonProps) {
  const { openInquiryModal } = useInquiryModal();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => openInquiryModal(source)}
    >
      {children}
    </Button>
  );
}
