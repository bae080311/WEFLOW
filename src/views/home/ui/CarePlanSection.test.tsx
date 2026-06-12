import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarePlanSection } from "./CarePlanSection";
import { CARE_BENEFITS, DELIVERY_STEPS } from "@/shared/config";

describe("CarePlanSection", () => {
  it("케어플랜 혜택과 배송 흐름을 함께 렌더한다", () => {
    render(<CarePlanSection />);
    expect(screen.getByRole("heading", { name: "WEFLOW 케어플랜 혜택" })).toBeInTheDocument();
    CARE_BENEFITS.forEach((b) => expect(screen.getByText(b)).toBeInTheDocument());
    DELIVERY_STEPS.forEach((s) => expect(screen.getByText(s.title)).toBeInTheDocument());
  });
});
