import { Check, Crown } from "lucide-react";
import { Badge, Card, PriceTag } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { PricingPlan } from "../model";

export type PriceCardProps = {
  plan: PricingPlan;
  className?: string;
};

export function PriceCard({ plan, className }: PriceCardProps) {
  return (
    <Card
      variant={plan.crown ? "premium" : "default"}
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant={plan.crown ? "brand" : "default"}>{plan.group}</Badge>
        {plan.crown ? (
          <Crown role="img" aria-label="추천 플랜" className="size-5 text-accent" />
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-text">{plan.name}</h3>
        <p className="text-caption text-text-muted">{plan.subtitle}</p>
      </div>

      <PriceTag
        amount={plan.salePrice}
        originalAmount={plan.originalPrice}
        monthly={plan.monthly}
        from={plan.saleFrom}
        originalFrom={plan.originalFrom}
      />

      <ul className="flex flex-col gap-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-body text-text-muted">
            <Check className="mt-1 size-4 shrink-0 text-brand-cyan" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
