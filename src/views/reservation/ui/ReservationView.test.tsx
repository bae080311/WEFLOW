import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReservationView } from "./ReservationView";
import { EXTERNAL_LINKS } from "@/shared/config";
import { RESERVATION_GUIDE_STEPS } from "../config/reservationContent";

vi.mock("@/features/reservationForm", () => ({
  ReservationForm: () => <div data-testid="reservation-form" />,
}));

describe("ReservationView", () => {
  it("히어로 제목과 신뢰 칩을 렌더", () => {
    render(<ReservationView />);
    expect(screen.getByRole("heading", { level: 1, name: "상담 예약하기" })).toBeInTheDocument();
    expect(screen.getByText("연중무휴 24시간 상담")).toBeInTheDocument();
  });

  it("예약 진행 안내 단계를 모두 렌더", () => {
    render(<ReservationView />);
    for (const step of RESERVATION_GUIDE_STEPS) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });

  it("전화 즉시 상담 링크가 tel 로 연결", () => {
    render(<ReservationView />);
    expect(screen.getByRole("link", { name: /전화로 즉시 상담/ })).toHaveAttribute(
      "href",
      EXTERNAL_LINKS.tel,
    );
  });

  it("예약 폼(features/reservationForm)을 배치", () => {
    render(<ReservationView />);
    expect(screen.getByTestId("reservation-form")).toBeInTheDocument();
  });
});
