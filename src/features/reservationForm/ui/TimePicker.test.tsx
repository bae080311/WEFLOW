import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "./TimePicker";

function slotButtons() {
  return screen.queryAllByRole("button").filter((b) => /^\d{2}:\d{2}$/.test(b.textContent ?? ""));
}

describe("TimePicker", () => {
  it("20슬롯(09:00~18:30/30분)을 한 번에 5×4 그리드로 표시한다", () => {
    render(
      <TimePicker
        value=""
        manualValue=""
        dateISO="2099-12-31"
        now={null}
        onSelectSlot={() => {}}
        onManualChange={() => {}}
      />,
    );
    // 총 20개가 동시에 노출(오전/오후 분리 없음)
    expect(slotButtons()).toHaveLength(20);
    expect(screen.getByRole("button", { name: "09:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "12:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18:30" })).toBeInTheDocument();
    // 5열 그리드
    expect(screen.getByRole("group", { name: "희망 시간 선택" })).toHaveClass("grid-cols-5");
  });

  it("슬롯 클릭 시 onSelectSlot, 직접 입력 시 onManualChange", async () => {
    const onSelectSlot = vi.fn();
    const onManualChange = vi.fn();
    render(
      <TimePicker
        value=""
        manualValue=""
        dateISO="2099-12-31"
        now={null}
        onSelectSlot={onSelectSlot}
        onManualChange={onManualChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "10:00" }));
    expect(onSelectSlot).toHaveBeenCalledWith("10:00");
    await userEvent.type(screen.getByLabelText(/원하시는 시간대/), "x");
    expect(onManualChange).toHaveBeenCalled();
  });

  it("선택값 슬롯이 강조(aria-pressed)된다", () => {
    render(
      <TimePicker
        value="14:00"
        manualValue=""
        dateISO="2099-12-31"
        now={null}
        onSelectSlot={() => {}}
        onManualChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "14:00" })).toHaveAttribute("aria-pressed", "true");
  });

  it("오늘이면 현재 시각 이전 슬롯 비활성(13시면 13시 이전 불가)", () => {
    const now = new Date(2026, 5, 13, 13, 0); // 오후 1시
    render(
      <TimePicker
        value=""
        manualValue=""
        dateISO="2026-06-13"
        now={now}
        onSelectSlot={() => {}}
        onManualChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "12:30" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "13:00" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "13:30" })).not.toBeDisabled();
  });

  it("가능한 시간이 없으면 안내 문구(슬롯 미표시)", () => {
    const now = new Date(2026, 5, 13, 19, 0); // 영업 종료 후 → 오늘 전부 비활성
    render(
      <TimePicker
        value=""
        manualValue=""
        dateISO="2026-06-13"
        now={now}
        onSelectSlot={() => {}}
        onManualChange={() => {}}
      />,
    );
    expect(screen.getByText(/예약 가능한 시간이 없어요/)).toBeInTheDocument();
    expect(slotButtons()).toHaveLength(0);
  });
});
