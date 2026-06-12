import Link from "next/link";
import { BookOpen, ClipboardCheck, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { BOTTOM_CTA_ITEMS, EXTERNAL_LINK_ATTRS } from "@/shared/config";
import { cn } from "@/shared/lib";

const ICONS: Record<string, LucideIcon> = {
  "24시간 상담": Phone,
  "카카오톡 문의": MessageCircle,
  블로그: BookOpen,
  무료진단: ClipboardCheck,
};

// 부드러운 전환 — 모든 카드가 동일 이징을 공유한다.
const EASE =
  "transition-[transform,max-width,opacity,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// 맥북 Stage Manager 식 오른쪽 플로팅 링크 스택.
// 기본은 아이콘만 살짝 보이고(접힘), 도크 호버/포커스 시 카드가 스태거로 펼쳐지며 라벨이 나온다.
export function StageDock() {
  return (
    <nav aria-label="빠른 상담" className="group fixed bottom-6 right-3 z-40 print:hidden">
      <ul className="flex flex-col items-end gap-3">
        {BOTTOM_CTA_ITEMS.map((item, i) => {
          const Icon = ICONS[item.label];
          const cardClass = cn(
            "flex items-center gap-2 rounded-2xl border border-border bg-surface/90 p-3 shadow-lg backdrop-blur-md will-change-transform",
            EASE,
            // 접힘: 살짝 오른쪽으로 밀리고 축소된 '스택' 느낌
            "translate-x-1.5 scale-[0.95]",
            // 펼침: 도크 전체 호버/포커스 또는 개별 호버 시
            "group-hover:translate-x-0 group-hover:scale-100 group-focus-within:translate-x-0 group-focus-within:scale-100",
            "hover:!scale-105 hover:border-brand-cyan/50 hover:shadow-glow",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
          );
          const labelClass = cn(
            "max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap text-caption font-medium text-text opacity-0",
            EASE,
            "group-hover:max-w-[9rem] group-hover:translate-x-0 group-hover:opacity-100",
            "group-focus-within:max-w-[9rem] group-focus-within:translate-x-0 group-focus-within:opacity-100",
          );
          const content = (
            <>
              {Icon ? <Icon className="size-5 shrink-0 text-brand-cyan" aria-hidden /> : null}
              <span className={labelClass}>{item.label}</span>
            </>
          );
          return (
            <li key={item.label} style={{ transitionDelay: `${i * 45}ms` }}>
              {item.kind === "route" ? (
                <Link
                  href={item.href}
                  className={cardClass}
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  {content}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={cardClass}
                  style={{ transitionDelay: `${i * 45}ms` }}
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
