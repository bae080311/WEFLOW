import { Check } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type StepperProps = {
  steps: string[];
  current: number; // 0-based
  className?: string;
};

// 단계 표시기. 완료=체크, 현재=시안 테두리, 이후=흐림.
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn("flex items-center", className)}>
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            className={cn("flex items-center gap-2", index < steps.length - 1 && "flex-1")}
          >
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full text-caption font-bold transition-colors",
                done
                  ? "bg-gradient-brand text-white"
                  : active
                    ? "border-2 border-brand-cyan text-brand-cyan"
                    : "border border-border text-text-subtle",
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-caption",
                active ? "font-medium text-text" : "hidden text-text-muted sm:inline",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 ? (
              <span
                className={cn("mx-2 h-px flex-1", done ? "bg-brand-cyan" : "bg-border")}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
