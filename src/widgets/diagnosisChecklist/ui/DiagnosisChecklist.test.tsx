import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiagnosisChecklist } from "./DiagnosisChecklist";
import { DIAGNOSIS_CHECKLIST, ROUTES } from "@/shared/config";

describe("DiagnosisChecklist", () => {
  it("체크 4개와 진단 CTA를 렌더한다", () => {
    render(<DiagnosisChecklist />);
    expect(DIAGNOSIS_CHECKLIST).toHaveLength(4);
    DIAGNOSIS_CHECKLIST.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument());
    const cta = screen.getByRole("link", { name: "무료진단 후 견적 받기" });
    expect(cta).toHaveAttribute("href", ROUTES.diagnosis);
  });
});
