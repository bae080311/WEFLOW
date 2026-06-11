import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileDrawer } from "./MobileDrawer";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("MobileDrawer", () => {
  it("open=false 면 렌더하지 않는다", () => {
    render(<MobileDrawer open={false} onClose={() => {}} pathname="/" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("열리면 6개 nav 와 무료진단 CTA 를 노출한다", () => {
    render(<MobileDrawer open onClose={() => {}} pathname="/" />);
    const nav = screen.getByRole("navigation", { name: "모바일 메뉴 항목" });
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(6);
    expect(nav).toBeInTheDocument();
  });

  it("backdrop 클릭으로 닫는다", async () => {
    const onClose = vi.fn();
    render(<MobileDrawer open onClose={onClose} pathname="/" />);
    await userEvent.click(screen.getByTestId("drawer-backdrop"));
    expect(onClose).toHaveBeenCalled();
  });

  it("pathname 이 바뀌면 닫는다(라우트 변경)", () => {
    const onClose = vi.fn();
    const { rerender } = render(<MobileDrawer open onClose={onClose} pathname="/" />);
    onClose.mockClear();
    rerender(<MobileDrawer open onClose={onClose} pathname="/services" />);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
