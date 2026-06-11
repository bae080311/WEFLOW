import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceCard } from "./PriceCard";
import { pricingPlans } from "../model";

const master = pricingPlans.find((p) => p.id === "master")!;
const start = pricingPlans.find((p) => p.id === "start")!;
const weCare = pricingPlans.find((p) => p.id === "we-care")!;

describe("PriceCard", () => {
  it("플랜명·구성·할인가·정가(취소선)를 렌더한다", () => {
    render(<PriceCard plan={start} />);
    expect(screen.getByRole("heading", { name: "START 랜딩페이지" })).toBeInTheDocument();
    expect(screen.getByText("랜딩페이지 1페이지")).toBeInTheDocument();
    expect(screen.getByText("249,000원")).toBeInTheDocument();
    expect(screen.getByText("498,000원")).toHaveClass("line-through");
  });

  it("기능(✓) 리스트를 모두 렌더한다", () => {
    render(<PriceCard plan={start} />);
    start.features.forEach((f) => {
      expect(screen.getByText(f)).toBeInTheDocument();
    });
  });

  it("크라운 플랜은 왕관 아이콘을 표시한다", () => {
    render(<PriceCard plan={master} />);
    expect(screen.getByLabelText("추천 플랜")).toBeInTheDocument();
  });

  it("비크라운 플랜은 왕관 아이콘이 없다", () => {
    render(<PriceCard plan={start} />);
    expect(screen.queryByLabelText("추천 플랜")).not.toBeInTheDocument();
  });

  it("케어 플랜은 '월' 접두 + '~' 접미를 표시한다", () => {
    render(<PriceCard plan={weCare} />);
    expect(screen.getByText("월 89,000원~")).toBeInTheDocument();
  });
});
