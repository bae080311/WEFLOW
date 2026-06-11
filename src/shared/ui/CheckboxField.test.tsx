import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxField } from "./CheckboxField";

describe("CheckboxField", () => {
  it("label 클릭으로 체크가 토글된다", async () => {
    render(<CheckboxField label="개인정보 수집 및 상담 동의" />);
    const checkbox = screen.getByRole("checkbox", { name: /개인정보 수집/ });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(screen.getByText("개인정보 수집 및 상담 동의"));
    expect(checkbox).toBeChecked();
  });

  it("error 면 메시지와 aria-invalid 를 연결한다", () => {
    render(<CheckboxField label="동의" error="동의가 필요합니다" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("동의가 필요합니다")).toBeInTheDocument();
  });
});
