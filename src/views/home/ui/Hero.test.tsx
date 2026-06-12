import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { ROUTES } from "@/shared/config";

describe("Hero", () => {
  it("히어로 제목과 3개 CTA를 올바른 경로로 렌더한다", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /문의로 이어지는\s*홈페이지를 만듭니다/,
    );
    expect(screen.getByRole("link", { name: "무료 진단 신청" })).toHaveAttribute(
      "href",
      ROUTES.diagnosis,
    );
    expect(screen.getByRole("link", { name: "성공 사례 보기" })).toHaveAttribute(
      "href",
      ROUTES.cases,
    );
    expect(screen.getByRole("link", { name: "WEFLOW 랜딩 페이지" })).toHaveAttribute(
      "href",
      ROUTES.landing,
    );
  });
});
