import { describe, it, expect, vi, beforeEach } from "vitest";

const { exportReservations, exportInquiries, exportCombined } = vi.hoisted(() => ({
  exportReservations: vi.fn(),
  exportInquiries: vi.fn(),
  exportCombined: vi.fn(),
}));
vi.mock("@/shared/lib/excel", () => ({ exportReservations, exportInquiries, exportCombined }));

import { exportAdminReservations, exportAdminInquiries, exportAdminCombined } from "./exportAdmin";
import type { Reservation } from "@/entities/reservation";
import type { Inquiry } from "@/entities/inquiry";

const reservation = {
  id: "1",
  status: "대기",
  createdAt: "2026-06-13T09:30:00.000Z",
  name: "홍길동",
  phone: "010-1234-5678",
  desiredDate: "2026-06-20",
  desiredTime: "14:00",
  isManualTime: false,
  projectType: "홈페이지 제작",
  industry: "카페",
  agreed: true,
} as Reservation;

const inquiry = {
  id: "2",
  status: "대기",
  createdAt: "2026-06-13T10:00:00.000Z",
  name: "김철수",
  phone: "010-0000-0000",
  projectType: "랜딩페이지 제작",
  industry: "필라테스",
  source: "diagnosis",
  agreed: true,
} as Inquiry;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exportAdmin", () => {
  it("전체 내보내기는 예약·문의 행으로 exportCombined 호출", async () => {
    await exportAdminCombined([reservation], [inquiry]);
    expect(exportCombined).toHaveBeenCalledTimes(1);
    const [resRows, inqRows] = exportCombined.mock.calls[0];
    expect(resRows[0].이름).toBe("홍길동");
    expect(inqRows[0].유입경로).toBe("무료진단");
  });

  it("예약/문의 개별 내보내기", async () => {
    await exportAdminReservations([reservation]);
    expect(exportReservations).toHaveBeenCalledTimes(1);
    await exportAdminInquiries([inquiry]);
    expect(exportInquiries).toHaveBeenCalledTimes(1);
  });
});
