"use client";

import { useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";
import { useFocusTrap } from "@/shared/lib/focusTrap";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

const emptySubscribe = () => () => {};

// 클라이언트 여부 감지 (SSR=false → 하이드레이션 후 true). setState-in-effect 없이 portal 렌더 게이트.
function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Esc · 포커스 트랩 · 스크롤 잠금 · 포커스 복원 (공통 훅)
  useFocusTrap(isClient && open, panelRef, onClose);

  if (!isClient || !open) return null;

  return createPortal(
    <div
      data-testid="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 p-5 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "w-full max-w-lg rounded-card border border-border bg-surface p-6 focus:outline-none",
          className,
        )}
      >
        {title ? (
          <h2 id={titleId} className="mb-4 text-h3 text-text">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
