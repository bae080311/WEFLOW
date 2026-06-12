import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalProvider, useInquiryModal } from "@/shared/lib";
import { InquiryModalButton } from "./InquiryModalButton";

function Probe() {
  const { isOpen, source } = useInquiryModal();
  return <p>{isOpen ? `open:${source}` : "closed"}</p>;
}

describe("InquiryModalButton", () => {
  it("클릭 시 해당 source 로 문의 모달을 연다", () => {
    render(
      <ModalProvider>
        <InquiryModalButton source="cases">더 많은 사례 문의하기</InquiryModalButton>
        <Probe />
      </ModalProvider>,
    );
    expect(screen.getByText("closed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "더 많은 사례 문의하기" }));
    expect(screen.getByText("open:cases")).toBeInTheDocument();
  });
});
