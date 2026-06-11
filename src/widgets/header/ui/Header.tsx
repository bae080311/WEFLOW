"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, Container } from "@/shared/ui";
import { NAV_ITEMS, ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import { MobileDrawer } from "./MobileDrawer";
import { isActive } from "../lib/isActive";

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={ROUTES.home} aria-label="WEFLOW 홈" className="flex items-center gap-2">
          <Image src="/logo_icon.png" alt="WEFLOW" width={32} height={32} />
          <span className="text-h3 font-bold text-text">WEFLOW</span>
        </Link>

        <nav aria-label="주 메뉴" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href, pathname) ? "page" : undefined}
              className={cn(
                "rounded-control px-3 py-2 text-body transition-colors hover:bg-surface hover:text-text active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
                isActive(item.href, pathname) ? "text-text" : "text-text-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={ROUTES.diagnosis}
            variant="gradient"
            size="sm"
            className="hidden sm:inline-flex"
          >
            무료진단 신청
          </Button>
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-control text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan md:hidden"
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </Container>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pathname={pathname} />
    </header>
  );
}
