import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("기본 variant 클래스와 radius 를 적용한다", () => {
    render(<Card data-testid="card">내용</Card>);
    const el = screen.getByTestId("card");
    expect(el).toHaveClass("bg-surface", "border-border", "rounded-card");
  });

  it("gradient / premium variant 를 적용한다", () => {
    const { rerender } = render(<Card data-testid="card" variant="gradient" />);
    expect(screen.getByTestId("card")).toHaveClass("bg-gradient-card");
    rerender(<Card data-testid="card" variant="premium" />);
    expect(screen.getByTestId("card")).toHaveClass("border-accent");
  });

  it("interactive 면 hover 글로우 클래스를 추가한다", () => {
    render(<Card data-testid="card" interactive />);
    const el = screen.getByTestId("card");
    expect(el).toHaveClass("cursor-pointer");
    expect(el.className).toContain("hover:shadow-glow");
  });

  it("caller className 을 병합한다", () => {
    render(<Card data-testid="card" className="p-10" />);
    expect(screen.getByTestId("card")).toHaveClass("p-10");
  });
});
