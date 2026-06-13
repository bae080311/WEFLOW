import { PRICING_PLANS, PriceCard, type PricingGroup } from "@/entities/pricingPlan";
import { Reveal } from "@/shared/ui";
import { cn } from "@/shared/lib";

const GROUP_META: Record<PricingGroup, { title: string; note?: string }> = {
  제작: { title: "제작 플랜", note: "필수 선택형 (3중 택1)" },
  케어: { title: "케어 플랜", note: "필수 선택형 (3중 택1)" },
  광고: { title: "광고 플랜", note: "키워드 셋팅" },
};

const DEFAULT_GROUPS: PricingGroup[] = ["제작", "케어", "광고"];

export type PricingCardsProps = {
  groups?: PricingGroup[];
  className?: string;
};

// PDF: 8개 가격 카드를 "세로 카드형식 1열로" 전부 노출. 그룹(제작/케어/광고)별 제목·안내(3중 택1) 후
// 카드가 1열로 쭉 쌓인다. 각 카드 진입은 스태거 fade-up.
export function PricingCards({ groups = DEFAULT_GROUPS, className }: PricingCardsProps) {
  return (
    <div className={cn("flex flex-col gap-14", className)}>
      {groups.map((group) => {
        const plans = PRICING_PLANS.filter((p) => p.group === group);
        const meta = GROUP_META[group];
        return (
          <section key={group} aria-label={meta.title} className="flex flex-col gap-6">
            <div className="text-center">
              <h3 className="text-h2 text-text">{meta.title}</h3>
              {meta.note ? <p className="mt-2 text-caption text-text-muted">{meta.note}</p> : null}
            </div>
            <ul className="mx-auto flex w-full max-w-2xl flex-col gap-5">
              {plans.map((plan, i) => (
                <li key={plan.id}>
                  <Reveal delay={i * 80}>
                    <PriceCard plan={plan} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
