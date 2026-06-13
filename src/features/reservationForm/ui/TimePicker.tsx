"use client";

import { FormField } from "@/shared/ui";
import { TIME_SLOTS, isSlotDisabled, cn } from "@/shared/lib";

export type TimePickerProps = {
  value: string; // 선택된 슬롯(직접입력 시 "")
  manualValue: string; // 직접입력 텍스트
  dateISO: string;
  now: Date | null;
  onSelectSlot: (slot: string) => void;
  onManualChange: (text: string) => void;
};

// PDF: 9시~18:30 30분 간격 총 20슬롯을 가로 5 × 세로 4 그리드로 한 번에 표시 + "또는 직접 입력".
// 오늘 날짜면 현재 시각 이전 슬롯은 비활성. 그리드 ↔ 직접입력은 상위(ReservationForm)에서 상호배타 처리.
export function TimePicker({
  value,
  manualValue,
  dateISO,
  now,
  onSelectSlot,
  onManualChange,
}: TimePickerProps) {
  const isDisabled = (slot: string) =>
    now != null && dateISO !== "" ? isSlotDisabled(slot, dateISO, now) : false;
  const allDisabled = TIME_SLOTS.every(isDisabled);

  return (
    <div className="flex flex-col gap-3">
      {allDisabled ? (
        <p className="rounded-control border border-border bg-surface px-4 py-3 text-caption text-text-muted">
          이 날짜는 예약 가능한 시간이 없어요. 다른 날짜를 선택해 주세요.
        </p>
      ) : (
        <div role="group" aria-label="희망 시간 선택" className="grid grid-cols-5 gap-1 sm:gap-2">
          {TIME_SLOTS.map((slot) => {
            const disabled = isDisabled(slot);
            const active = value === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  "h-11 rounded-control border text-caption font-medium tabular-nums tracking-tight transition-colors sm:text-body sm:tracking-normal",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
                  active
                    ? "border-brand-cyan bg-gradient-brand text-white"
                    : "border-border bg-surface text-text hover:border-brand-cyan/50",
                  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border",
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="text-caption text-text-subtle">또는</span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      <FormField
        label="원하시는 시간대 (직접 입력)"
        name="manualTime"
        placeholder="예: 오후 2시 이후"
        value={manualValue}
        onChange={(event) => onManualChange(event.target.value)}
      />
    </div>
  );
}
