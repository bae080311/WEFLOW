"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { Button, Container } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import { MobileDrawer } from "./MobileDrawer";
import { NavLinks } from "./NavLinks";

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 시 글래스 강화(블러·테두리·그림자) — side effect 는 useEffect 안에서만.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 shadow-lg backdrop-blur-xl"
          : "border-b border-transparent bg-bg/40 backdrop-blur-md",
      )}
    >
      {/* 상단 브랜드 그라디언트 헤어라인 (스크롤 시 등장) */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-brand transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <Container
        className={cn(
          "flex items-center justify-between gap-4 transition-[height] duration-300",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Link
          href={ROUTES.home}
          aria-label="WEFLOW 홈"
          className="group flex shrink-0 items-center gap-2 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          <span className="relative inline-flex">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-brand-cyan/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
            />
            <Image
              src="/logo_icon.png"
              alt="WEFLOW"
              width={30}
              height={30}
              className="relative transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110"
            />
          </span>
          <span className="text-h3 font-bold tracking-tight text-text">
            WE<span className="text-gradient-brand">FLOW</span>
          </span>
        </Link>

        <NavLinks pathname={pathname} />

        <div className="flex shrink-0 items-center gap-2">
          <Button
            href={ROUTES.diagnosis}
            variant="gradient"
            size="sm"
            className="group hidden px-6 sm:inline-flex"
          >
            <Sparkles
              className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              aria-hidden
            />
            무료진단 신청
          </Button>
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-control border border-transparent text-text transition-colors hover:border-border hover:bg-surface active:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan md:hidden"
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </Container>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pathname={pathname} />
    </header>
  );
}
