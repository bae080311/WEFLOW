import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewSection } from "./ReviewSection";
import { ROUTES } from "@/shared/config";

describe("ReviewSection", () => {
  it("후기 더보기 링크가 /diagnosis 로 연결된다", () => {
    render(<ReviewSection />);
    expect(screen.getByRole("heading", { name: "고객 후기" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /후기 더보기/ })).toHaveAttribute(
      "href",
      ROUTES.diagnosis,
    );
  });
});
