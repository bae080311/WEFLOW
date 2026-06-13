// 예약 시간 그리드: 09:00 ~ 18:30, 30분 간격 = 정확히 20슬롯 (requirements §3-5).
// (순수 모듈 — React 의존 없음. mount 후 현재시각 훅은 ./useNow 참조)
export const SLOT_START_MINUTES = 9 * 60; // 09:00
export const SLOT_END_MINUTES = 18 * 60 + 30; // 18:30
export const SLOT_INTERVAL = 30;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "HH:MM" 20개 슬롯 생성 (순수). */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let m = SLOT_START_MINUTES; m <= SLOT_END_MINUTES; m += SLOT_INTERVAL) {
    slots.push(`${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`);
  }
  return slots;
}

/** 09:00 ~ 18:30 / 30분 = 20개. */
export const TIME_SLOTS: readonly string[] = generateTimeSlots();

/** "13:30" → 810 (자정 기준 분). */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Date 의 로컬 날짜를 "YYYY-MM-DD" 로(달력 셀·input min 용). */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** now 의 로컬 날짜를 "YYYY-MM-DD" 로. */
export function todayISO(now: Date): string {
  return toISODate(now);
}

/** dateISO("YYYY-MM-DD") 가 now 의 로컬 날짜와 같은가. */
export function isToday(dateISO: string, now: Date): boolean {
  return dateISO === todayISO(now);
}

/** dateISO 가 now 의 오늘보다 과거 날짜인가 (날짜 단위). */
export function isPastDate(dateISO: string, now: Date): boolean {
  return dateISO < todayISO(now);
}

/**
 * 슬롯 비활성 여부.
 * - 선택 날짜가 오늘이 아니면 활성(false).
 * - 오늘이면 현재 시각 이전 슬롯만 비활성(requirements §3-5: "지금 13시면 13시 이전 비활성").
 */
export function isSlotDisabled(slot: string, dateISO: string, now: Date): boolean {
  if (!isToday(dateISO, now)) return false;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return toMinutes(slot) < nowMinutes;
}

/** ISO 문자열을 "YYYY-MM-DD HH:MM" 표시용으로(결정적, 타임존 영향 없음). */
export function formatDateTime(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 16).replace("T", " ");
}

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** "YYYY-MM-DD" → 요일("월"). 로컬 기준(타임존 안전하게 y/m/d 분해). */
export function weekdayKo(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return WEEKDAYS_KO[new Date(year, month - 1, day).getDay()];
}

/** "YYYY-MM-DD" → "6월 15일 (월)". */
export function formatDateKo(iso: string): string {
  if (!iso) return "";
  const [, month, day] = iso.split("-").map(Number);
  return `${month}월 ${day}일 (${weekdayKo(iso)})`;
}

/** "14:00" → "오후 2:00". (12시간제 + 오전/오후) */
export function formatTimeKo(hhmm: string): string {
  const [hour, minute] = hhmm.split(":").map(Number);
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${hour12}:${pad2(minute)}`;
}
