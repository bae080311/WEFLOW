import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingView } from "./PricingView";
import { ROUTES } from "@/shared/config";
import { PRICING_VAT_NOTE } from "../config/notes";

describe("PricingView", () => {
  it("인트로·그룹 제목·8개 카드 1열·VAT 안내·진단 CTA를 렌더한다", () => {
    render(<PricingView />);
    expect(screen.getByRole("heading", { name: "제작플랜 & 가격안내" })).toBeInTheDocument();
    // 그룹 제목(제작/케어/광고)
    expect(screen.getByRole("heading", { name: "제작 플랜" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "케어 플랜" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "광고 플랜" })).toBeInTheDocument();
    // 8개 카드가 한 번에 모두 노출(탭 없음)
    expect(screen.getByRole("heading", { name: "START 랜딩페이지" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "MASTER 프리미엄" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "당근 플레이스 광고" })).toBeInTheDocument();
    expect(screen.getByText(PRICING_VAT_NOTE)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "무료 진단 신청" })).toHaveAttribute(
      "href",
      ROUTES.diagnosis,
    );
  });
});
