import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceTag } from "./PriceTag";

describe("PriceTag", () => {
  it("할인가를 천단위 콤마 + 원 으로 표시한다", () => {
    render(<PriceTag amount={249000} />);
    expect(screen.getByText("249,000원")).toBeInTheDocument();
  });

  it("정가는 있을 때만 취소선으로 표시한다", () => {
    const { rerender } = render(<PriceTag amount={249000} />);
    expect(screen.queryByText("498,000원")).not.toBeInTheDocument();
    rerender(<PriceTag amount={249000} originalAmount={498000} />);
    const original = screen.getByText("498,000원");
    expect(original).toHaveClass("line-through");
  });

  it("monthly 면 '월' 접두, from 이면 '~' 접미를 붙인다", () => {
    render(<PriceTag amount={89000} originalAmount={170000} monthly from />);
    expect(screen.getByText("월 89,000원~")).toBeInTheDocument();
    // 정가는 originalFrom 미지정 → '~' 없음
    expect(screen.getByText("월 170,000원")).toBeInTheDocument();
  });

  it("originalFrom 으로 정가에도 '~' 를 붙인다", () => {
    render(<PriceTag amount={189000} originalAmount={378000} monthly from originalFrom />);
    expect(screen.getByText("월 378,000원~")).toBeInTheDocument();
    expect(screen.getByText("월 189,000원~")).toBeInTheDocument();
  });
});
