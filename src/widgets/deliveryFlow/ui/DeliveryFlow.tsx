import { cn } from "@/shared/lib";
import { DELIVERY_STEPS, type DeliveryStep } from "@/shared/config";

export type DeliveryFlowProps = {
  steps?: DeliveryStep[];
  className?: string;
};

// 제작 배송 흐름 4단계 — 그라디언트 타임라인. 데스크탑=가로 라인+노드, 모바일=세로 스택.
export function DeliveryFlow({ steps = DELIVERY_STEPS, className }: DeliveryFlowProps) {
  return (
    <ol
      className={cn(
        "relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-4",
        className,
      )}
    >
      {/* 데스크탑 가로 커넥터 — 노드 중심(높이 28px) 뒤를 지난다 */}
      <div className="divider-brand absolute inset-x-12 top-7 hidden md:block" aria-hidden />
      {steps.map((s) => (
        <li key={s.step} className="relative z-10 flex flex-col items-center gap-3 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-surface gradient-ring">
            <span className="text-gradient-brand text-h3 font-bold leading-none">
              {String(s.step).padStart(2, "0")}
            </span>
          </div>
          <span className="text-body font-medium text-text">{s.title}</span>
        </li>
      ))}
    </ol>
  );
}
