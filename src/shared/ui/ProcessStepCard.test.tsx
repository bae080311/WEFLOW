import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessStepCard } from "./ProcessStepCard";

describe("ProcessStepCard", () => {
  it("스텝 번호를 2자리(zero-pad)로 표시한다", () => {
    render(<ProcessStepCard step={1} title="상담·진단" />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("제목을 heading 으로, 설명은 있을 때만 렌더한다", () => {
    const { rerender } = render(<ProcessStepCard step={2} title="기획·설계" />);
    expect(screen.getByRole("heading", { name: "기획·설계" })).toBeInTheDocument();
    expect(screen.queryByText("문의 구조 및 전략 설계")).not.toBeInTheDocument();
    rerender(<ProcessStepCard step={2} title="기획·설계" description="문의 구조 및 전략 설계" />);
    expect(screen.getByText("문의 구조 및 전략 설계")).toBeInTheDocument();
  });
});
