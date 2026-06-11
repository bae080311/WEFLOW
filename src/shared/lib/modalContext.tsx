"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { InquirySource } from "../types";

export type InquiryModalState = {
  isOpen: boolean;
  source: InquirySource | null;
  openInquiryModal: (source?: InquirySource) => void;
  closeInquiryModal: () => void;
};

const InquiryModalContext = createContext<InquiryModalState | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<InquirySource | null>(null);

  const openInquiryModal = (next?: InquirySource) => {
    setSource(next ?? null);
    setIsOpen(true);
  };
  const closeInquiryModal = () => {
    setIsOpen(false);
  };

  const value: InquiryModalState = { isOpen, source, openInquiryModal, closeInquiryModal };

  return <InquiryModalContext.Provider value={value}>{children}</InquiryModalContext.Provider>;
}

export function useInquiryModal(): InquiryModalState {
  const ctx = useContext(InquiryModalContext);
  if (ctx === null) {
    throw new Error("useInquiryModal 은 <ModalProvider> 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
