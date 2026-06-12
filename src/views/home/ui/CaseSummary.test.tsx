import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CaseSummary } from "./CaseSummary";
import { ROUTES } from "@/shared/config";
import { CASE_SUMMARY_SLUGS } from "../config/homeContent";

describe("CaseSummary", () => {
  it("5개 케이스와 CTA를 렌더한다", () => {
    render(<CaseSummary />);
    expect(CASE_SUMMARY_SLUGS).toHaveLength(5);
    expect(screen.getAllByRole("link", { name: /자세히 보기/ })).toHaveLength(5);
    expect(screen.getByRole("link", { name: "살펴보기" })).toHaveAttribute("href", ROUTES.cases);
    expect(screen.getByRole("link", { name: "무료진단 받기" })).toHaveAttribute(
      "href",
      ROUTES.diagnosis,
    );
  });

  it("패널에 hover 하면 해당 패널이 활성(확장)된다", () => {
    const { container } = render(<CaseSummary />);
    const panels = container.querySelectorAll("[data-case-panel]");
    expect(panels).toHaveLength(5);
    // 기본은 첫 패널 활성
    expect(panels[0]).toHaveAttribute("data-active", "true");
    expect(panels[2]).toHaveAttribute("data-active", "false");

    fireEvent.mouseEnter(panels[2]);
    expect(panels[2]).toHaveAttribute("data-active", "true");
    expect(panels[0]).toHaveAttribute("data-active", "false");
  });
});
