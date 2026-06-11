import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("<section> 으로 렌더하고 세로 리듬 클래스를 적용한다", () => {
    render(<Section data-testid="s">내용</Section>);
    const el = screen.getByTestId("s");
    expect(el.tagName).toBe("SECTION");
    expect(el).toHaveClass("py-12", "md:py-20", "lg:py-24");
  });

  it("기본은 배경 클래스가 없다", () => {
    render(<Section data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el).not.toHaveClass("bg-bg-deep");
    expect(el).not.toHaveClass("bg-surface");
  });

  it("bg variant 를 적용한다", () => {
    const { rerender } = render(<Section data-testid="s" bg="deep" />);
    expect(screen.getByTestId("s")).toHaveClass("bg-bg-deep");
    rerender(<Section data-testid="s" bg="surface" />);
    expect(screen.getByTestId("s")).toHaveClass("bg-surface");
  });
});
