import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClosingCta } from "./ClosingCta";
import { ROUTES } from "@/shared/config";

describe("ClosingCta", () => {
  it("제목과 두 CTA를 올바른 경로로 렌더한다", () => {
    render(<ClosingCta />);
    expect(
      screen.getByRole("heading", { name: /문의로 이어지는 홈페이지를 시작하세요/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "무료 진단 신청" })).toHaveAttribute(
      "href",
      ROUTES.diagnosis,
    );
    expect(screen.getByRole("link", { name: /성공 사례 보기/ })).toHaveAttribute(
      "href",
      ROUTES.cases,
    );
  });
});
