import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingCards } from "./PricingCards";
import { PRICING_PLANS } from "@/entities/pricingPlan";

describe("PricingCards", () => {
  it("8개 카드를 세로 1열로 한 번에 모두 렌더한다(탭 없음)", () => {
    render(<PricingCards />);
    expect(PRICING_PLANS).toHaveLength(8);
    // 8개 플랜 제목이 동시에 노출
    for (const name of [
      "START 랜딩페이지",
      "GROW 홈페이지",
      "MASTER 프리미엄",
      "WE CARE",
      "FLOW CARE",
      "WEFLOW CARE",
      "네이버 광고",
      "당근 플레이스 광고",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    // 그룹 제목 3개
    expect(screen.getByRole("heading", { name: "제작 플랜" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "케어 플랜" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "광고 플랜" })).toBeInTheDocument();
    // "필수 선택형 (3중 택1)"은 제작·케어 그룹 모두에 표기(2회)
    expect(screen.getAllByText("필수 선택형 (3중 택1)")).toHaveLength(2);
  });

  it("정가(취소선)→할인가를 PDF 규정값대로 모두 표기한다", () => {
    render(<PricingCards />);
    const pairs: [string, string][] = [
      ["498,000원", "249,000원"],
      ["1,980,000원", "990,000원"],
      ["2,980,000원", "1,490,000원"],
      ["월 170,000원", "월 89,000원~"],
      ["월 378,000원~", "월 189,000원~"],
      ["월 678,000원~", "월 339,000원~"],
      ["298,000원", "149,000원~"],
      ["158,000원", "79,000원~"],
    ];
    for (const [original, sale] of pairs) {
      expect(screen.getByText(original)).toHaveClass("line-through");
      expect(screen.getByText(sale)).toBeInTheDocument();
    }
  });

  it("크라운 추천 플랜은 MASTER·WEFLOW CARE 2개뿐이다", () => {
    render(<PricingCards />);
    expect(screen.getAllByLabelText("추천 플랜")).toHaveLength(2);
  });
});
