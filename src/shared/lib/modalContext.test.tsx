import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalProvider, useInquiryModal } from "./modalContext";

function Probe() {
  const { isOpen, source, openInquiryModal, closeInquiryModal } = useInquiryModal();
  return (
    <div>
      <span data-testid="state">{isOpen ? `open:${source ?? "none"}` : "closed"}</span>
      <button onClick={() => openInquiryModal("landing")}>open</button>
      <button onClick={() => closeInquiryModal()}>close</button>
    </div>
  );
}

describe("modalContext", () => {
  it("기본은 닫힘 상태다", () => {
    render(
      <ModalProvider>
        <Probe />
      </ModalProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent("closed");
  });

  it("openInquiryModal(source) 로 열리고 source 를 기록한다", async () => {
    render(
      <ModalProvider>
        <Probe />
      </ModalProvider>,
    );
    await userEvent.click(screen.getByText("open"));
    expect(screen.getByTestId("state")).toHaveTextContent("open:landing");
    await userEvent.click(screen.getByText("close"));
    expect(screen.getByTestId("state")).toHaveTextContent("closed");
  });

  it("Provider 밖에서 훅을 쓰면 에러를 던진다", () => {
    function Bare() {
      useInquiryModal();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/ModalProvider/);
  });
});
