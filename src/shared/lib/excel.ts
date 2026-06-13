// 엑셀(xlsx/SheetJS) 내보내기. 호출 시점에 동적 import 하여 마케팅 번들에서 분리(admin 전용).
// FSD 제약상 entities 타입을 알 수 없으므로 "이미 한글 헤더로 매핑된 행"만 받는다.

export type SheetRow = Record<string, string | number>;
export type SheetSpec = { name: string; rows: SheetRow[] };

/** 여러 시트를 한 워크북으로 묶어 .xlsx 다운로드. .xlsx 는 UTF-8 기본이라 한글 안전. */
export async function exportSheets(filename: string, sheets: SheetSpec[]): Promise<void> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  }
  XLSX.writeFile(workbook, filename);
}

/** 예약 단일 시트. */
export function exportReservations(rows: SheetRow[], filename = "weflow-예약.xlsx"): Promise<void> {
  return exportSheets(filename, [{ name: "예약", rows }]);
}

/** 문의 단일 시트. */
export function exportInquiries(rows: SheetRow[], filename = "weflow-문의.xlsx"): Promise<void> {
  return exportSheets(filename, [{ name: "문의", rows }]);
}

/** 예약 + 문의 2시트 한 파일(관리자 전체 다운로드). */
export function exportCombined(
  reservationRows: SheetRow[],
  inquiryRows: SheetRow[],
  filename = "weflow-전체.xlsx",
): Promise<void> {
  return exportSheets(filename, [
    { name: "예약", rows: reservationRows },
    { name: "문의", rows: inquiryRows },
  ]);
}
