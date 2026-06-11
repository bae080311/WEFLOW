import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextareaField } from "./TextareaField";

describe("TextareaField", () => {
  it("label 과 textarea 를 연결한다", () => {
    render(<TextareaField label="추가요청사항" />);
    const ta = screen.getByLabelText("추가요청사항");
    expect(ta.tagName).toBe("TEXTAREA");
  });

  it("입력값을 받는다", async () => {
    render(<TextareaField label="추가요청사항" />);
    const ta = screen.getByLabelText("추가요청사항");
    await userEvent.type(ta, "빠른 상담 원해요");
    expect(ta).toHaveValue("빠른 상담 원해요");
  });

  it("error 면 메시지와 aria-invalid 를 연결한다", () => {
    render(<TextareaField label="추가요청사항" error="너무 깁니다" />);
    const ta = screen.getByLabelText("추가요청사항");
    expect(ta).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("너무 깁니다")).toBeInTheDocument();
  });
});
