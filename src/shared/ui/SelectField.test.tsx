import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectField } from "./SelectField";

const options = [
  { value: "landing", label: "랜딩페이지 제작" },
  { value: "homepage", label: "홈페이지 제작" },
];

describe("SelectField", () => {
  it("label 과 select 를 연결하고 옵션을 렌더한다", () => {
    render(<SelectField label="제작종류" options={options} />);
    const select = screen.getByLabelText("제작종류");
    expect(select.tagName).toBe("SELECT");
    expect(screen.getByRole("option", { name: "랜딩페이지 제작" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "홈페이지 제작" })).toBeInTheDocument();
  });

  it("placeholder 옵션은 disabled 이며 기본 선택된다(required 검증 유효)", () => {
    render(<SelectField label="제작종류" options={options} placeholder="선택하세요" />);
    const placeholder = screen.getByRole("option", { name: "선택하세요" });
    expect(placeholder).toBeDisabled();
    // 첫 실제 옵션이 자동 선택되지 않고 placeholder(빈 값)가 선택되어 있어야 한다
    expect(screen.getByLabelText("제작종류")).toHaveValue("");
  });

  it("선택값을 변경할 수 있다", async () => {
    render(<SelectField label="제작종류" options={options} placeholder="선택" />);
    const select = screen.getByLabelText("제작종류");
    await userEvent.selectOptions(select, "homepage");
    expect(select).toHaveValue("homepage");
  });

  it("error 면 aria-invalid 를 단다", () => {
    render(<SelectField label="제작종류" options={options} error="필수" />);
    expect(screen.getByLabelText("제작종류")).toHaveAttribute("aria-invalid", "true");
  });
});
