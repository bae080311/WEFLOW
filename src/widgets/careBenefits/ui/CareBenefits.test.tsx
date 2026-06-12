import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareBenefits } from "./CareBenefits";
import { CARE_BENEFITS } from "@/shared/config";

describe("CareBenefits", () => {
  it("케어플랜 혜택 6개를 렌더한다", () => {
    render(<CareBenefits />);
    expect(CARE_BENEFITS).toHaveLength(6);
    CARE_BENEFITS.forEach((b) => expect(screen.getByText(b)).toBeInTheDocument());
  });
});
