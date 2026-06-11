import { describe, it, expect, vi, afterEach } from "vitest";
import { useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useFocusTrap } from "./focus-trap";

function Trap({ active, onClose }: { active: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(active, ref, onClose);
  return (
    <div ref={ref} tabIndex={-1} data-testid="panel">
      <button>first</button>
      <button>last</button>
    </div>
  );
}

afterEach(() => {
  document.body.style.overflow = "";
});

describe("useFocusTrap", () => {
  it("active 면 body 스크롤을 잠그고 비활성화되면 복원한다", () => {
    const { rerender } = render(<Trap active onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Trap active={false} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("Esc 로 onClose 를 호출한다", () => {
    const onClose = vi.fn();
    render(<Trap active onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("마지막 요소에서 Tab 누르면 첫 요소로 순환한다", () => {
    render(<Trap active onClose={() => {}} />);
    const [first, last] = screen.getAllByRole("button");
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(first).toHaveFocus();
  });

  it("첫 요소에서 Shift+Tab 누르면 마지막 요소로 순환한다", () => {
    render(<Trap active onClose={() => {}} />);
    const [first, last] = screen.getAllByRole("button");
    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
  });

  it("포커스가 패널 밖(목록 외)에 있으면 경계 요소로 보낸다", () => {
    render(<Trap active onClose={() => {}} />);
    const [first] = screen.getAllByRole("button");
    (document.activeElement as HTMLElement | null)?.blur();
    document.body.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(first).toHaveFocus();
  });
});
