import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "./Calendar";

const NOW = new Date(2026, 5, 13, 9, 0); // 2026-06-13

describe("Calendar", () => {
  it("요일 헤더와 현재 월 라벨을 렌더", () => {
    render(<Calendar value="" onSelect={() => {}} now={NOW} />);
    expect(screen.getByText("2026년 6월")).toBeInTheDocument();
    for (const weekday of ["일", "월", "화", "수", "목", "금", "토"]) {
      expect(screen.getByText(weekday)).toBeInTheDocument();
    }
  });

  it("과거 날짜는 비활성, 오늘 이후는 활성", () => {
    render(<Calendar value="" onSelect={() => {}} now={NOW} />);
    expect(screen.getByRole("button", { name: "1" })).toBeDisabled(); // 06-01 과거
    expect(screen.getByRole("button", { name: "13" })).not.toBeDisabled(); // 오늘
    expect(screen.getByRole("button", { name: "20" })).not.toBeDisabled();
  });

  it("이전 달 버튼은 현재 달에서 비활성", () => {
    render(<Calendar value="" onSelect={() => {}} now={NOW} />);
    expect(screen.getByRole("button", { name: "이전 달" })).toBeDisabled();
  });

  it("날짜 클릭 시 onSelect(ISO) 호출 + 선택 표시", async () => {
    const onSelect = vi.fn();
    const { rerender } = render(<Calendar value="" onSelect={onSelect} now={NOW} />);
    await userEvent.click(screen.getByRole("button", { name: "20" }));
    expect(onSelect).toHaveBeenCalledWith("2026-06-20");
    rerender(<Calendar value="2026-06-20" onSelect={onSelect} now={NOW} />);
    expect(screen.getByRole("button", { name: "20" })).toHaveAttribute("aria-pressed", "true");
  });

  it("다음 달로 이동하면 라벨이 바뀌고 1일도 활성", async () => {
    render(<Calendar value="" onSelect={() => {}} now={NOW} />);
    await userEvent.click(screen.getByRole("button", { name: "다음 달" }));
    expect(screen.getByText("2026년 7월")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이전 달" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).not.toBeDisabled(); // 07-01 미래
  });

  it("now 가 null 이면 날짜 버튼 없이 placeholder", () => {
    render(<Calendar value="" onSelect={() => {}} now={null} />);
    expect(screen.queryByRole("group", { name: "희망 날짜 선택" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다음 달" })).not.toBeInTheDocument();
  });
});
