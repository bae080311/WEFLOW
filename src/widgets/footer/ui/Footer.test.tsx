import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("회사 정보(대표·사업자번호·이메일·운영시간·카피라이트)를 노출한다", () => {
    render(<Footer />);
    expect(screen.getByText(/신서준/)).toBeInTheDocument();
    expect(screen.getByText(/884-07-03480/)).toBeInTheDocument();
    expect(screen.getByText(/contact@weflowlab\.kr/)).toBeInTheDocument();
    expect(screen.getByText(/연중무휴 24시간 상담가능/)).toBeInTheDocument();
    expect(screen.getByText(/© 2026 WEFLOW/)).toBeInTheDocument();
  });

  it("개인정보처리방침/이용약관을 실제 라우트로 연결한다", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "개인정보처리방침" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByRole("link", { name: "이용약관" })).toHaveAttribute("href", "/terms");
  });

  it("외부 소셜 링크는 새 탭(noopener noreferrer) 으로 연다", () => {
    render(<Footer />);
    const blog = screen.getByRole("link", { name: "블로그" });
    expect(blog).toHaveAttribute("href", "https://m.blog.naver.com/weflowlab");
    expect(blog).toHaveAttribute("target", "_blank");
    expect(blog.getAttribute("rel")).toContain("noopener");
  });

  it("dead link(빈 값/#) 이 없다", () => {
    render(<Footer />);
    screen.getAllByRole("link").forEach((anchor) => {
      const href = anchor.getAttribute("href") ?? "";
      expect(href).not.toBe("");
      expect(href).not.toBe("#");
    });
  });
});
