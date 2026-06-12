import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewMarquee } from "./ReviewMarquee";
import { REVIEWS } from "@/entities/review";

describe("ReviewMarquee", () => {
  it("모든 후기를 마퀴 트랙에 2벌로 렌더한다", () => {
    render(<ReviewMarquee />);
    expect(REVIEWS).toHaveLength(8);
    REVIEWS.forEach((r) => expect(screen.getAllByText(r.quote)).toHaveLength(2));
  });
});
