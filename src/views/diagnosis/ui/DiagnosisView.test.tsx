import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiagnosisView } from "./DiagnosisView";
import { DIAGNOSIS_CHECKLIST } from "@/shared/config";

vi.mock("@/features/inquiryForm", () => ({
  InquiryForm: ({ source }: { source?: string | null }) => (
    <div data-testid="inquiry-form" data-source={source ?? ""} />
  ),
}));

describe("DiagnosisView", () => {
  it("히어로 2줄 제목을 렌더", () => {
    render(<DiagnosisView />);
    expect(screen.getByText("무료진단 받기")).toBeInTheDocument();
    expect(screen.getByText("무료진단 후 견적받기")).toBeInTheDocument();
  });

  it("진단 체크리스트 4항목을 재사용", () => {
    render(<DiagnosisView />);
    for (const item of DIAGNOSIS_CHECKLIST) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("체크리스트 CTA 는 폼 섹션 앵커로 연결", () => {
    const { container } = render(<DiagnosisView />);
    expect(screen.getByRole("link", { name: /무료진단 신청/ })).toHaveAttribute(
      "href",
      "#diagnosis-form",
    );
    expect(container.querySelector("#diagnosis-form")).toBeInTheDocument();
  });

  it("문의 폼을 source=diagnosis 로 배치", () => {
    render(<DiagnosisView />);
    expect(screen.getByTestId("inquiry-form")).toHaveAttribute("data-source", "diagnosis");
  });
});
