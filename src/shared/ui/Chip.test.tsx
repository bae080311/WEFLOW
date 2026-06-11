import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("사각형(rounded-control)이며 pill 이 아니다", () => {
    render(<Chip>빠른제작</Chip>);
    const el = screen.getByText("빠른제작");
    expect(el).toHaveClass("rounded-control");
    expect(el).not.toHaveClass("rounded-full");
  });

  it("가로로 늘어나지 않도록 w-fit / inline-flex 를 쓴다", () => {
    render(<Chip>합리적 비용</Chip>);
    const el = screen.getByText("합리적 비용");
    expect(el).toHaveClass("inline-flex", "w-fit");
  });

  it("brand variant 를 적용한다", () => {
    render(<Chip variant="brand">케어 플랜</Chip>);
    expect(screen.getByText("케어 플랜")).toHaveClass("text-brand-cyan");
  });
});
