import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeliveryFlow } from "./DeliveryFlow";
import { DELIVERY_STEPS } from "@/shared/config";

describe("DeliveryFlow", () => {
  it("4단계 배송 흐름을 렌더한다", () => {
    render(<DeliveryFlow />);
    expect(DELIVERY_STEPS).toHaveLength(4);
    DELIVERY_STEPS.forEach((s) => expect(screen.getByText(s.title)).toBeInTheDocument());
    expect(screen.getByText("3~7일 배송완료")).toBeInTheDocument();
  });
});
