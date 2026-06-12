import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PricingCards } from "./PricingCards";
import { PRICING_PLANS } from "@/entities/pricingPlan";

describe("PricingCards", () => {
  it("3개 그룹 탭(제작/케어/광고)을 렌더하고 기본은 제작 플랜이다", () => {
    render(<PricingCards />);
    expect(PRICING_PLANS).toHaveLength(8);
    expect(screen.getByRole("tab", { name: "제작 플랜" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "케어 플랜" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "광고 플랜" })).toBeInTheDocument();
    // 기본 탭 = 제작(3카드)
    expect(screen.getByRole("heading", { name: "START 랜딩페이지" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GROW 홈페이지" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "MASTER 프리미엄" })).toBeInTheDocument();
    expect(screen.getByText("필수 선택형 (3중 택1)")).toBeInTheDocument();
  });

  it("탭을 바꾸면 해당 그룹 카드가 표시된다", () => {
    render(<PricingCards />);
    fireEvent.click(screen.getByRole("tab", { name: "케어 플랜" }));
    expect(screen.getByRole("heading", { name: "WE CARE" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "WEFLOW CARE" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "START 랜딩페이지" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "광고 플랜" }));
    expect(screen.getByRole("heading", { name: "네이버 광고" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "당근 플레이스 광고" })).toBeInTheDocument();
  });

  it("정가(취소선)→할인가를 PDF 규정값대로 표기한다(그룹별 탭)", () => {
    render(<PricingCards />);
    const groups: Record<string, [string, string][]> = {
      "제작 플랜": [
        ["498,000원", "249,000원"],
        ["1,980,000원", "990,000원"],
        ["2,980,000원", "1,490,000원"],
      ],
      "케어 플랜": [
        ["월 170,000원", "월 89,000원~"],
        ["월 378,000원~", "월 189,000원~"],
        ["월 678,000원~", "월 339,000원~"],
      ],
      "광고 플랜": [
        ["298,000원", "149,000원~"],
        ["158,000원", "79,000원~"],
      ],
    };
    for (const [tab, pairs] of Object.entries(groups)) {
      fireEvent.click(screen.getByRole("tab", { name: tab }));
      pairs.forEach(([original, sale]) => {
        expect(screen.getByText(original)).toHaveClass("line-through");
        expect(screen.getByText(sale)).toBeInTheDocument();
      });
    }
  });

  it("크라운 추천 플랜: 제작 탭=MASTER, 케어 탭=WEFLOW CARE", () => {
    render(<PricingCards />);
    expect(screen.getByLabelText("추천 플랜")).toBeInTheDocument(); // 제작 탭의 MASTER
    fireEvent.click(screen.getByRole("tab", { name: "케어 플랜" }));
    expect(screen.getByLabelText("추천 플랜")).toBeInTheDocument(); // 케어 탭의 WEFLOW CARE
    fireEvent.click(screen.getByRole("tab", { name: "광고 플랜" }));
    expect(screen.queryByLabelText("추천 플랜")).not.toBeInTheDocument();
  });
});
