import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { useAdminSessionMock } = vi.hoisted(() => ({ useAdminSessionMock: vi.fn() }));
vi.mock("@/features/adminAuth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/adminAuth")>();
  return { ...actual, useAdminSession: useAdminSessionMock };
});

const { reservationServiceMock, inquiryServiceMock } = vi.hoisted(() => ({
  reservationServiceMock: {
    list: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    updateStatus: vi.fn(),
    remove: vi.fn(),
  },
  inquiryServiceMock: {
    list: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    updateStatus: vi.fn(),
    remove: vi.fn(),
  },
}));
vi.mock("@/entities/reservation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/reservation")>();
  return { ...actual, reservationService: reservationServiceMock };
});
vi.mock("@/entities/inquiry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/inquiry")>();
  return { ...actual, inquiryService: inquiryServiceMock };
});

import { AdminDashboardPage } from "./AdminDashboardPage";
import type { Reservation } from "@/entities/reservation";

const resA: Reservation = {
  id: "a",
  status: "대기",
  createdAt: "2026-06-13T09:00:00.000Z",
  name: "가게A",
  phone: "010-1111-1111",
  desiredDate: "2026-06-20",
  desiredTime: "14:00",
  isManualTime: false,
  projectType: "홈페이지 제작",
  industry: "카페",
  agreed: true,
};
const resB: Reservation = { ...resA, id: "b", status: "완료", name: "가게B", desiredTime: "15:00" };

beforeEach(() => {
  vi.clearAllMocks();
  reservationServiceMock.list.mockResolvedValue([resA, resB]);
  reservationServiceMock.subscribe.mockReturnValue(() => {});
  inquiryServiceMock.list.mockResolvedValue([]);
  inquiryServiceMock.subscribe.mockReturnValue(() => {});
});

function authed() {
  useAdminSessionMock.mockReturnValue({
    status: "authed",
    email: "admin@weflow.kr",
    signIn: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
  });
}

describe("AdminDashboardPage", () => {
  it("미인증이면 로그인 게이트", () => {
    useAdminSessionMock.mockReturnValue({
      status: "guest",
      email: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });
    render(<AdminDashboardPage />);
    expect(screen.getByRole("heading", { name: "관리자 로그인" })).toBeInTheDocument();
  });

  it("인증되면 예약·문의 대시보드와 데이터를 표시", async () => {
    authed();
    render(<AdminDashboardPage />);
    expect(screen.getByText(/WEFLOW 관리자/)).toBeInTheDocument();
    expect(await screen.findByText("가게A")).toBeInTheDocument();
    expect(screen.getByText("가게B")).toBeInTheDocument();
  });

  it("상태 탭으로 필터링(완료만)", async () => {
    authed();
    render(<AdminDashboardPage />);
    await screen.findByText("가게A");
    await userEvent.click(screen.getByRole("tab", { name: "완료" }));
    expect(screen.queryByText("가게A")).not.toBeInTheDocument();
    expect(screen.getByText("가게B")).toBeInTheDocument();
  });

  it("상태 변경 시 예약 서비스 호출", async () => {
    authed();
    render(<AdminDashboardPage />);
    await screen.findByText("가게A");
    await userEvent.click(screen.getByRole("tab", { name: "대기" }));
    const row = screen.getByText("가게A").closest("tr") as HTMLElement;
    await userEvent.click(within(row).getByRole("button", { name: "완료" }));
    expect(reservationServiceMock.updateStatus).toHaveBeenCalledWith("a", "완료");
  });
});
