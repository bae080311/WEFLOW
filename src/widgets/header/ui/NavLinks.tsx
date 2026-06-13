"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/shared/config";
import { cn } from "@/shared/lib";
import { isActive } from "../lib/isActive";

// 데스크탑 주 메뉴 — hover 따라 미끄러지고 현재 경로에 머무는 알약 인디케이터.
export function NavLinks({ pathname }: { pathname: string }) {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeIndex = NAV_ITEMS.findIndex((item) => isActive(item.href, pathname));
  const [hovered, setHovered] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const measure = () => {
      const target = hovered ?? (activeIndex >= 0 ? activeIndex : -1);
      if (target < 0) {
        setIndicator({ left: 0, width: 0 });
        return;
      }
      const el = linkRefs.current[target];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [hovered, activeIndex]);

  return (
    <nav
      aria-label="주 메뉴"
      className="relative hidden items-center gap-1 md:flex"
      onMouseLeave={() => setHovered(null)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 h-9 rounded-control bg-surface transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={
          {
            width: `${indicator.width}px`,
            transform: `translate(${indicator.left}px, -50%)`,
            opacity: indicator.width ? 1 : 0,
          } as CSSProperties
        }
      />
      {NAV_ITEMS.map((item, index) => {
        const active = isActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              linkRefs.current[index] = el;
            }}
            aria-current={active ? "page" : undefined}
            onMouseEnter={() => setHovered(index)}
            className={cn(
              "relative rounded-control px-3 py-2 text-body transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
              active ? "font-medium text-text" : "text-text-muted hover:text-text",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
