import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServicesAdOps } from "./ServicesAdOps";
import { AD_OPS_SYSTEM } from "@/shared/config";

describe("ServicesAdOps", () => {
  it("광고 운영·사후관리 시스템 8항목을 렌더한다", () => {
    render(<ServicesAdOps />);
    expect(screen.getByRole("heading", { name: "광고 운영·사후관리 시스템" })).toBeInTheDocument();
    AD_OPS_SYSTEM.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument());
  });
});
