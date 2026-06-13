import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReservationTable } from "./ReservationTable";
import type { Reservation } from "@/entities/reservation";

const reservation: Reservation = {
  id: "r1",
  status: "대기",
  createdAt: "2026-06-13T09:30:00.000Z",
  name: "홍길동",
  phone: "010-1234-5678",
  desiredDate: "2026-06-20",
  desiredTime: "14:00",
  isManualTime: false,
  projectType: "홈페이지 제작",
  industry: "카페",
  note: "빠른 상담 원해요",
  agreed: true,
};

function setup(reservations: Reservation[] = [reservation]) {
  const onUpdateStatus = vi.fn();
  const onDelete = vi.fn();
  render(
    <ReservationTable
      reservations={reservations}
      onUpdateStatus={onUpdateStatus}
      onDelete={onDelete}
    />,
  );
  return { onUpdateStatus, onDelete };
}

describe("ReservationTable", () => {
  it("컬럼 헤더(상태·이름·연락처·접수일·희망 일정·관리)와 행을 렌더", () => {
    setup();
    for (const column of ["상태", "이름", "연락처", "접수일", "희망 일정", "관리"]) {
      expect(screen.getByRole("columnheader", { name: column })).toBeInTheDocument();
    }
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText(/2026-06-20/)).toBeInTheDocument();
  });

  it("아래 화살표로 상세(제작종류·업종·추가요청사항) 펼침", async () => {
    setup();
    expect(screen.queryByText("빠른 상담 원해요")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "상세 보기" }));
    expect(screen.getByText("빠른 상담 원해요")).toBeInTheDocument();
    expect(screen.getByText("홈페이지 제작")).toBeInTheDocument();
  });

  it("진행중/완료/삭제 콜백을 호출", async () => {
    const { onUpdateStatus, onDelete } = setup();
    await userEvent.click(screen.getByRole("button", { name: "진행중" }));
    expect(onUpdateStatus).toHaveBeenCalledWith("r1", "진행중");
    await userEvent.click(screen.getByRole("button", { name: "완료" }));
    expect(onUpdateStatus).toHaveBeenCalledWith("r1", "완료");
    await userEvent.click(screen.getByRole("button", { name: "삭제" }));
    await userEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onDelete).toHaveBeenCalledWith("r1");
  });

  it("비었을 때 안내 문구", () => {
    setup([]);
    expect(screen.getByText("표시할 예약이 없습니다.")).toBeInTheDocument();
  });
});
