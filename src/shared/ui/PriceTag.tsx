import { cn } from "@/shared/lib/cn";

const krw = new Intl.NumberFormat("ko-KR");

function formatPrice(amount: number, monthly: boolean, from: boolean): string {
  return `${monthly ? "월 " : ""}${krw.format(amount)}원${from ? "~" : ""}`;
}

export type PriceTagProps = {
  amount: number;
  originalAmount?: number;
  monthly?: boolean;
  from?: boolean;
  originalFrom?: boolean;
  className?: string;
};

export function PriceTag({
  amount,
  originalAmount,
  monthly = false,
  from = false,
  originalFrom = false,
  className,
}: PriceTagProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {originalAmount != null ? (
        <span className="text-body text-text-subtle line-through">
          {formatPrice(originalAmount, monthly, originalFrom)}
        </span>
      ) : null}
      <span className="text-h2 font-bold text-text">{formatPrice(amount, monthly, from)}</span>
    </div>
  );
}
