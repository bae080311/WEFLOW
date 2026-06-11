import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("대기는 라벨과 muted 변형을 쓴다", () => {
    render(<StatusBadge status="대기" />);
    const el = screen.getByText("대기");
    expect(el).toHaveClass("text-text-muted");
  });

  it("진행중은 warning 변형을 쓴다", () => {
    render(<StatusBadge status="진행중" />);
    expect(screen.getByText("진행중")).toHaveClass("text-warning");
  });

  it("완료는 success 변형을 쓴다", () => {
    render(<StatusBadge status="완료" />);
    expect(screen.getByText("완료")).toHaveClass("text-success");
  });
});
