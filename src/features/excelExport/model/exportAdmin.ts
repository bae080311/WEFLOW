import type { Reservation } from "@/entities/reservation";
import type { Inquiry } from "@/entities/inquiry";
import { reservationRows, inquiryRows } from "./excelRows";

// xlsx 는 클릭 시점에만 동적 로드(마케팅 번들과 분리).
export async function exportAdminReservations(reservations: Reservation[]): Promise<void> {
  const excel = await import("@/shared/lib/excel");
  await excel.exportReservations(reservationRows(reservations));
}

export async function exportAdminInquiries(inquiries: Inquiry[]): Promise<void> {
  const excel = await import("@/shared/lib/excel");
  await excel.exportInquiries(inquiryRows(inquiries));
}

export async function exportAdminCombined(
  reservations: Reservation[],
  inquiries: Inquiry[],
): Promise<void> {
  const excel = await import("@/shared/lib/excel");
  await excel.exportCombined(reservationRows(reservations), inquiryRows(inquiries));
}
