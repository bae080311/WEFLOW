import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BottomBar } from "./BottomBar";

describe("BottomBar", () => {
  it("4개 CTA 를 고정 노출한다", () => {
    render(<BottomBar />);
    const nav = screen.getByRole("navigation", { name: "빠른 상담" });
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
  });

  it("각 CTA 의 href/kind 가 §7·§8 정확값과 일치한다", () => {
    render(<BottomBar />);
    expect(screen.getByRole("link", { name: /24시간 상담/ })).toHaveAttribute(
      "href",
      "tel:01029717280",
    );

    const kakao = screen.getByRole("link", { name: /카카오톡 문의/ });
    expect(kakao).toHaveAttribute("href", "http://pf.kakao.com/_xntCbX");
    expect(kakao).toHaveAttribute("target", "_blank");
    expect(kakao.getAttribute("rel")).toContain("noopener");

    expect(screen.getByRole("link", { name: /블로그/ })).toHaveAttribute(
      "href",
      "https://m.blog.naver.com/weflowlab",
    );
    expect(screen.getByRole("link", { name: /무료진단/ })).toHaveAttribute("href", "/diagnosis");
  });
});
