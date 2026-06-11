import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { Header } from "./Header";

beforeEach(() => {
  vi.mocked(usePathname).mockReturnValue("/");
});

describe("Header", () => {
  it("주 메뉴에 6개 nav를 requirements §2 순서로 노출한다", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual(["/", "/services", "/pricing", "/cases", "/reservation", "/diagnosis"]);
  });

  it("로고는 홈으로 연결된다", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "WEFLOW 홈" })).toHaveAttribute("href", "/");
  });

  it("무료진단 신청 CTA는 /diagnosis 로 연결된다", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "무료진단 신청" })).toHaveAttribute(
      "href",
      "/diagnosis",
    );
  });

  it("현재 경로 nav 에 aria-current=page 를 표시한다", () => {
    vi.mocked(usePathname).mockReturnValue("/pricing");
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    const active = within(nav).getByRole("link", { name: "제작플랜&가격안내" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("햄버거로 모바일 드로어를 열고 Esc 로 닫는다", async () => {
    render(<Header />);
    const trigger = screen.getByRole("button", { name: "메뉴 열기" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "모바일 메뉴" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "모바일 메뉴" })).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
