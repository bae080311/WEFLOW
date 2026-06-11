import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseCard } from "./CaseCard";
import { cases } from "../model";

const sample = cases[0]; // pt-shop

describe("CaseCard", () => {
  it("업종명과 이미지를 렌더한다", () => {
    render(<CaseCard caseItem={sample} />);
    expect(screen.getByRole("heading", { name: sample.industry })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: `${sample.industry} 제작 사례` })).toBeInTheDocument();
  });

  it("자세히 보기는 내부 /cases/[slug] 로 연결한다 (외부 데모 링크 아님)", () => {
    render(<CaseCard caseItem={sample} />);
    const link = screen.getByRole("link", { name: /자세히 보기/ });
    expect(link).toHaveAttribute("href", `/cases/${sample.slug}`);
    expect(link.getAttribute("href")).not.toMatch(/^https?:/);
  });
});
