import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("label 과 input 을 htmlFor/id 로 연결한다", () => {
    render(<FormField label="이름" />);
    const input = screen.getByLabelText("이름");
    expect(input).toBeInTheDocument();
  });

  it("required 면 * 표시 + required 속성을 단다", () => {
    render(<FormField label="연락처" required />);
    expect(screen.getByText("*", { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeRequired();
  });

  it("error 면 aria-invalid + aria-describedby 로 메시지를 연결한다", () => {
    render(<FormField label="이름" error="필수 항목입니다" />);
    const input = screen.getByLabelText("이름");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const msg = screen.getByText("필수 항목입니다");
    expect(input).toHaveAttribute("aria-describedby", msg.id);
  });

  it("error 가 없으면 aria-invalid 가 없다", () => {
    render(<FormField label="이름" />);
    expect(screen.getByLabelText("이름")).not.toHaveAttribute("aria-invalid");
  });

  it("입력값을 받는다", async () => {
    render(<FormField label="이름" />);
    const input = screen.getByLabelText("이름");
    await userEvent.type(input, "홍길동");
    expect(input).toHaveValue("홍길동");
  });
});
