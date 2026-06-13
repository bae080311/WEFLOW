import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalProvider, useInquiryModal } from "@/shared/lib/modalContext";
import { ROUTES } from "@/shared/config";
import { LandingHero } from "./LandingHero";

function StateProbe() {
  const { isOpen, source } = useInquiryModal();
  return <div data-testid="modal-state">{isOpen ? source : "closed"}</div>;
}

function setup() {
  return render(
    <ModalProvider>
      <LandingHero />
      <StateProbe />
    </ModalProvider>,
  );
}

describe("LandingHero", () => {
  it("큰 제목과 부제를 렌더", () => {
    setup();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "문의로 이어지는홈페이지를 만듭니다",
    );
  });

  it("'실제 제작 성공 보기' → /cases", () => {
    setup();
    expect(screen.getByRole("link", { name: "실제 제작 성공 보기" })).toHaveAttribute(
      "href",
      ROUTES.cases,
    );
  });

  it("'무료진단 후 견적받기' 클릭 시 문의 모달(source=landing) 오픈", async () => {
    setup();
    expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");
    await userEvent.click(screen.getByRole("button", { name: "무료진단 후 견적받기" }));
    expect(screen.getByTestId("modal-state")).toHaveTextContent("landing");
  });
});
