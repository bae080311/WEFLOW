import { describe, it, expect, vi, beforeEach } from "vitest";
import * as XLSX from "xlsx";
import { exportSheets, exportReservations, exportInquiries, exportCombined } from "./excel";

vi.mock("xlsx", () => {
  const book_new = vi.fn(() => ({ SheetNames: [], Sheets: {} }));
  const json_to_sheet = vi.fn((rows) => ({ __rows: rows }));
  const book_append_sheet = vi.fn();
  const writeFile = vi.fn();
  return { utils: { book_new, json_to_sheet, book_append_sheet }, writeFile };
});

const mocked = vi.mocked(XLSX, true);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("excel — exportCombined", () => {
  it("예약·문의 2시트로 한 파일을 만든다", async () => {
    await exportCombined([{ 이름: "홍길동" }], [{ 이름: "김철수" }], "전체.xlsx");
    expect(mocked.utils.book_append_sheet).toHaveBeenCalledTimes(2);
    const sheetNames = mocked.utils.book_append_sheet.mock.calls.map((c) => c[2]);
    expect(sheetNames).toEqual(["예약", "문의"]);
    expect(mocked.writeFile).toHaveBeenCalledWith(expect.anything(), "전체.xlsx");
  });

  it("한글 헤더 행을 그대로 json_to_sheet 에 전달", async () => {
    const rows = [{ 이름: "홍길동", 연락처: "010" }];
    await exportReservations(rows, "예약.xlsx");
    expect(mocked.utils.json_to_sheet).toHaveBeenCalledWith(rows);
    expect(mocked.writeFile).toHaveBeenCalledWith(expect.anything(), "예약.xlsx");
  });
});

describe("excel — 개별 내보내기", () => {
  it("exportReservations 는 예약 시트 1개", async () => {
    await exportReservations([{ 이름: "a" }]);
    expect(mocked.utils.book_append_sheet).toHaveBeenCalledTimes(1);
    expect(mocked.utils.book_append_sheet.mock.calls[0][2]).toBe("예약");
  });

  it("exportInquiries 는 문의 시트 1개", async () => {
    await exportInquiries([{ 이름: "b" }]);
    expect(mocked.utils.book_append_sheet.mock.calls[0][2]).toBe("문의");
  });

  it("exportSheets 는 시트 수만큼 append", async () => {
    await exportSheets("x.xlsx", [
      { name: "A", rows: [] },
      { name: "B", rows: [] },
      { name: "C", rows: [] },
    ]);
    expect(mocked.utils.book_append_sheet).toHaveBeenCalledTimes(3);
  });
});
