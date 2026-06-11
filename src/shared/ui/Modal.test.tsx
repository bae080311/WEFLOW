import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("Modal", () => {
  it("open=false 면 렌더하지 않는다", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        내용
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("open 이면 role=dialog + aria-modal 로 렌더한다", () => {
    render(
      <Modal open onClose={() => {}} title="문의">
        내용
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("heading", { name: "문의" })).toBeInTheDocument();
  });

  it("Esc 키로 onClose 를 호출한다", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        내용
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("backdrop 클릭은 닫고, 패널 내부 클릭은 닫지 않는다", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        <button>내부버튼</button>
      </Modal>,
    );
    await userEvent.click(screen.getByText("내부버튼"));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("열리면 body 스크롤을 잠그고 닫히면 복원한다", () => {
    const { rerender } = render(
      <Modal open onClose={() => {}}>
        내용
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Modal open={false} onClose={() => {}}>
        내용
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("");
  });
});
