import { ProcessStepCard, Reveal } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { PROCESS_STEPS, type ProcessStep } from "@/shared/config";

export type ProcessStepsProps = {
  steps?: ProcessStep[];
  className?: string;
};

// 6단계 제작 프로세스 카드 그리드. Section/헤더는 소비 측(view)이 소유한다.
export function ProcessSteps({ steps = PROCESS_STEPS, className }: ProcessStepsProps) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {steps.map((s, idx) => (
        <li key={s.step}>
          <Reveal delay={idx * 60} className="h-full">
            <ProcessStepCard step={s.step} title={s.title} description={s.description} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
