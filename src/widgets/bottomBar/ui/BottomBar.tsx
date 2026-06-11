import Link from "next/link";
import { BookOpen, ClipboardCheck, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { BOTTOM_CTA_ITEMS, EXTERNAL_LINK_ATTRS } from "@/shared/config";

const ICONS: Record<string, LucideIcon> = {
  "24시간 상담": Phone,
  "카카오톡 문의": MessageCircle,
  블로그: BookOpen,
  무료진단: ClipboardCheck,
};

const cellClass =
  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-2 text-caption text-text-muted transition-colors hover:text-text active:text-brand-cyan focus-visible:text-text focus-visible:outline-none";

export function BottomBar() {
  return (
    <nav
      aria-label="빠른 상담"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] print:hidden"
    >
      <ul className="mx-auto grid max-w-content grid-cols-4">
        {BOTTOM_CTA_ITEMS.map((item) => {
          const Icon = ICONS[item.label];
          const content = (
            <>
              {Icon ? <Icon className="size-5" aria-hidden /> : null}
              <span>{item.label}</span>
            </>
          );
          return (
            <li key={item.label}>
              {item.kind === "route" ? (
                <Link href={item.href} className={cellClass}>
                  {content}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={cellClass}
                  {...(item.kind === "external" ? EXTERNAL_LINK_ATTRS : {})}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
