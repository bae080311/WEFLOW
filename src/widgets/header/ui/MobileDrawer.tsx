"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn, useFocusTrap } from "@/shared/lib";
import { NAV_ITEMS, ROUTES } from "@/shared/config";
import { isActive } from "../lib/isActive";

export type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export function MobileDrawer({ open, onClose, pathname }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const isFirstRender = useRef(true);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onCloseRef.current();
  }, [pathname]);

  useFocusTrap(open, panelRef, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        data-testid="drawer-backdrop"
        className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-2 border-l border-border bg-surface p-5 shadow-2xl animate-drawer-in focus:outline-none"
      >
        {/* 좌측 가장자리 브랜드 글로우 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-brand-cyan/60 via-brand-blue/40 to-transparent"
        />
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center self-end rounded-control text-text transition-colors hover:bg-surface-2 active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          <X className="size-6" aria-hidden />
        </button>
        <nav aria-label="모바일 메뉴 항목" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive(item.href, pathname) ? "page" : undefined}
              style={{ animationDelay: `${index * 45 + 60}ms` }}
              className={cn(
                "flex min-h-11 items-center rounded-control px-3 py-3 text-body transition-colors animate-fade-up",
                "hover:bg-surface-2 active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
                isActive(item.href, pathname)
                  ? "bg-surface-2 font-medium text-text"
                  : "text-text-muted hover:text-text",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          href={ROUTES.diagnosis}
          variant="gradient"
          className="mt-2 animate-fade-up"
          style={{ animationDelay: `${NAV_ITEMS.length * 45 + 60}ms` }}
          onClick={onClose}
        >
          무료진단 신청
        </Button>
      </div>
    </div>,
    document.body,
  );
}
