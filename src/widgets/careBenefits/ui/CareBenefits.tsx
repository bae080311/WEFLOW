import {
  Sparkles,
  Layers,
  Rocket,
  Wallet,
  Headphones,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib";
import { CARE_BENEFIT_ITEMS, type CareBenefit } from "@/shared/config";
import { Reveal } from "@/shared/ui";

export type CareBenefitsProps = {
  benefits?: CareBenefit[];
  className?: string;
};

const ICONS: LucideIcon[] = [Sparkles, Layers, Rocket, Wallet, Headphones, LifeBuoy];

// WEFLOW 케어플랜 혜택 — 균등 카드 그리드(3×2). 각 카드는 아이콘·제목·보조 설명으로
// 혜택이 한눈에 들어오게 한다. 첫 카드(케어플랜)는 그라디언트 링으로 앵커.
export function CareBenefits({ benefits = CARE_BENEFIT_ITEMS, className }: CareBenefitsProps) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {benefits.map((benefit, idx) => {
        const Icon = ICONS[idx % ICONS.length];
        const featured = idx === 0;
        return (
          <li key={benefit.title}>
            <Reveal delay={idx * 70} className="h-full">
              <article
                className={cn(
                  "group relative flex h-full flex-col gap-4 overflow-hidden rounded-card p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out",
                  "hover:-translate-y-1.5 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  featured
                    ? "gradient-ring accent-top bg-gradient-card"
                    : "border border-border bg-surface/60 backdrop-blur-sm hover:border-brand-cyan/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-control transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100",
                    featured
                      ? "bg-gradient-brand text-white glow-brand"
                      : "bg-surface-2 text-brand-cyan",
                  )}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-h3 font-bold text-text">{benefit.title}</h3>
                  <p className="text-body text-text-muted">{benefit.description}</p>
                </div>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
