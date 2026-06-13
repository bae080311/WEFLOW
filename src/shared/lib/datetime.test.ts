import { describe, it, expect } from "vitest";
import {
  TIME_SLOTS,
  generateTimeSlots,
  toMinutes,
  todayISO,
  isToday,
  isPastDate,
  isSlotDisabled,
  formatDateTime,
  toISODate,
  weekdayKo,
  formatDateKo,
  formatTimeKo,
} from "./datetime";

describe("datetime — 시간 슬롯", () => {
  it("20슬롯, 첫 09:00 / 마지막 18:30", () => {
    expect(TIME_SLOTS).toHaveLength(20);
    expect(TIME_SLOTS[0]).toBe("09:00");
    expect(TIME_SLOTS[TIME_SLOTS.length - 1]).toBe("18:30");
  });

  it("인접 슬롯 간격은 30분", () => {
    const slots = generateTimeSlots();
    for (let i = 1; i < slots.length; i += 1) {
      expect(toMinutes(slots[i]) - toMinutes(slots[i - 1])).toBe(30);
    }
  });

  it("generateTimeSlots 는 TIME_SLOTS 와 동일", () => {
    expect(generateTimeSlots()).toEqual([...TIME_SLOTS]);
  });

  it("toMinutes 변환", () => {
    expect(toMinutes("09:00")).toBe(540);
    expect(toMinutes("13:30")).toBe(810);
    expect(toMinutes("18:30")).toBe(1110);
  });
});

describe("datetime — 날짜 판정", () => {
  it("todayISO / toISODate 는 로컬 날짜를 YYYY-MM-DD 로", () => {
    const now = new Date(2026, 5, 13, 9, 0); // 2026-06-13
    expect(todayISO(now)).toBe("2026-06-13");
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("isToday / isPastDate", () => {
    const now = new Date(2026, 5, 13, 9, 0);
    expect(isToday("2026-06-13", now)).toBe(true);
    expect(isToday("2026-06-14", now)).toBe(false);
    expect(isPastDate("2026-06-12", now)).toBe(true);
    expect(isPastDate("2026-06-13", now)).toBe(false);
    expect(isPastDate("2026-06-14", now)).toBe(false);
  });
});

describe("datetime — isSlotDisabled", () => {
  it("오늘이 아니면 모두 활성", () => {
    const now = new Date(2026, 5, 13, 13, 0);
    expect(isSlotDisabled("09:00", "2026-06-14", now)).toBe(false);
    expect(isSlotDisabled("18:30", "2026-06-14", now)).toBe(false);
  });

  it("오늘이면 현재 시각 이전 슬롯만 비활성", () => {
    const now = new Date(2026, 5, 13, 13, 0); // 지금 13:00
    expect(isSlotDisabled("12:30", "2026-06-13", now)).toBe(true);
    expect(isSlotDisabled("13:00", "2026-06-13", now)).toBe(false);
    expect(isSlotDisabled("13:30", "2026-06-13", now)).toBe(false);
  });

  it("오늘 13:15 면 13:00 은 비활성(이미 지남)", () => {
    const now = new Date(2026, 5, 13, 13, 15);
    expect(isSlotDisabled("13:00", "2026-06-13", now)).toBe(true);
    expect(isSlotDisabled("13:30", "2026-06-13", now)).toBe(false);
  });
});

describe("datetime — formatDateTime", () => {
  it("ISO 를 YYYY-MM-DD HH:MM 으로", () => {
    expect(formatDateTime("2026-06-13T09:30:45.123Z")).toBe("2026-06-13 09:30");
    expect(formatDateTime("")).toBe("");
  });
});

describe("datetime — 한국어 포맷", () => {
  it("weekdayKo / formatDateKo", () => {
    expect(weekdayKo("2026-06-15")).toBe("월"); // 2026-06-15 = 월요일
    expect(formatDateKo("2026-06-15")).toBe("6월 15일 (월)");
    expect(formatDateKo("")).toBe("");
  });

  it("formatTimeKo 12시간제", () => {
    expect(formatTimeKo("09:00")).toBe("오전 9:00");
    expect(formatTimeKo("11:30")).toBe("오전 11:30");
    expect(formatTimeKo("12:00")).toBe("오후 12:00");
    expect(formatTimeKo("14:00")).toBe("오후 2:00");
    expect(formatTimeKo("18:30")).toBe("오후 6:30");
  });
});
