import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalDocument } from "./LegalDocument";
import { COMPANY } from "@/shared/config";

const sample = {
  title: "테스트 문서",
  effectiveDate: "2026-01-01",
  intro: "본 문서는 테스트입니다.",
  sections: [
    { heading: "첫 번째", paragraphs: ["문단 내용"] },
    { heading: "두 번째", items: ["항목 A", "항목 B"] },
  ],
};

describe("LegalDocument", () => {
  it("제목·시행일·섹션·회사정보를 렌더", () => {
    render(<LegalDocument {...sample} />);
    expect(screen.getByRole("heading", { level: 1, name: "테스트 문서" })).toBeInTheDocument();
    expect(screen.getByText("시행일: 2026-01-01")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. 첫 번째" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. 두 번째" })).toBeInTheDocument();
    expect(screen.getByText("항목 A")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(COMPANY.businessNumber))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(COMPANY.email))).toBeInTheDocument();
  });
});
