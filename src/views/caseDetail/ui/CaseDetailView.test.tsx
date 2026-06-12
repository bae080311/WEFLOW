import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseDetailView } from "./CaseDetailView";
import { CASES, getCaseDetail } from "@/entities/case";
import { ROUTES } from "@/shared/config";

const detail = getCaseDetail(CASES[0]);

describe("CaseDetailView", () => {
  it("업종명·6개 섹션·개선 포인트·진단 CTA를 렌더한다", () => {
    render(<CaseDetailView detail={detail} />);
    expect(
      screen.getByRole("heading", { name: `${detail.industry} 제작 사례` }),
    ).toBeInTheDocument();
    ["문제 상황", "개선 방향", "기대 효과", "문의 구조 개선 포인트"].forEach((title) =>
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument(),
    );
    detail.inquiryImprovements.forEach((item) =>
      expect(screen.getByText(item)).toBeInTheDocument(),
    );
    expect(screen.getByRole("link", { name: "무료진단 받기" })).toHaveAttribute(
      "href",
      ROUTES.diagnosis,
    );
  });
});
