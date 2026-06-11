import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewCard } from "./ReviewCard";
import { REVIEWS } from "../model";

describe("ReviewCard", () => {
  it("후기 본문과 작성자/업종을 렌더한다", () => {
    const review = REVIEWS[0];
    render(<ReviewCard review={review} />);
    expect(screen.getByText(review.quote)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(review.industry))).toBeInTheDocument();
  });

  it("별점 5점을 접근성 라벨로 표시한다", () => {
    render(<ReviewCard review={REVIEWS[0]} />);
    expect(screen.getByLabelText("별점 5점")).toBeInTheDocument();
  });
});
