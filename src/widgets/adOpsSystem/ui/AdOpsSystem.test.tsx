import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdOpsSystem } from "./AdOpsSystem";
import { AD_OPS_SYSTEM } from "@/shared/config";

describe("AdOpsSystem", () => {
  it("광고 운영 시스템 8개를 렌더한다", () => {
    render(<AdOpsSystem />);
    expect(AD_OPS_SYSTEM).toHaveLength(8);
    AD_OPS_SYSTEM.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument());
  });
});
