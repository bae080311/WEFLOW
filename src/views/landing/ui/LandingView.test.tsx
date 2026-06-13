import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModalProvider } from "@/shared/lib/modalContext";
import { LandingView } from "./LandingView";

vi.mock("@/features/inquiryForm", () => ({
  InquiryForm: ({ source }: { source?: string | null }) => (
    <div data-testid="inquiry-form" data-source={source ?? ""} />
  ),
}));

function setup() {
  return render(
    <ModalProvider>
      <LandingView />
    </ModalProvider>,
  );
}

describe("LandingView", () => {
  it("문의 폼을 두 위치(모바일 inline + 데스크탑 sticky)에 source=landing 으로 배치", () => {
    setup();
    const forms = screen.getAllByTestId("inquiry-form");
    expect(forms).toHaveLength(2);
    forms.forEach((form) => expect(form).toHaveAttribute("data-source", "landing"));
  });

  it("재사용 섹션(가격 8카드·6단계·후기·진단 체크리스트)을 모두 노출", () => {
    setup();
    // 가격 카드(8개 1열, 그룹 제목)
    expect(screen.getByRole("heading", { name: "제작 플랜" })).toBeInTheDocument();
    // 6단계 프로세스
    expect(screen.getAllByText("상담·진단").length).toBeGreaterThan(0);
    // 후기 섹션 헤더
    expect(screen.getByRole("heading", { name: "고객 후기" })).toBeInTheDocument();
    // 진단 체크리스트 항목
    expect(screen.getAllByText("문의 구조 진단").length).toBeGreaterThan(0);
    // 통계 밴드
    expect(screen.getByText(/평균 3~7일 제작 완료/)).toBeInTheDocument();
  });

  it("히어로 CTA(실제 제작 성공 보기 → /cases)를 노출", () => {
    setup();
    expect(screen.getByRole("link", { name: "실제 제작 성공 보기" })).toHaveAttribute(
      "href",
      "/cases",
    );
  });
});
