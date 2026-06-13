import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectField } from "./SelectField";

const options = [
  { value: "landing", label: "랜딩페이지 제작" },
  { value: "homepage", label: "홈페이지 제작" },
];

function Controlled({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <SelectField
      label="제작종류"
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="선택"
    />
  );
}

describe("SelectField (커스텀 드롭다운)", () => {
  it("닫힌 상태에서는 placeholder 를 보이고 옵션은 렌더하지 않는다", () => {
    render(<Controlled />);
    const combobox = screen.getByRole("combobox", { name: "제작종류" });
    expect(combobox).toHaveTextContent("선택");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("클릭하면 열려 옵션을 보이고, 선택하면 닫히며 값이 반영된다", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("combobox", { name: "제작종류" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("option", { name: "홈페이지 제작" }));
    expect(screen.getByRole("combobox", { name: "제작종류" })).toHaveTextContent("홈페이지 제작");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("선택된 옵션은 aria-selected 를 단다", async () => {
    render(<Controlled initial="landing" />);
    await userEvent.click(screen.getByRole("combobox", { name: "제작종류" }));
    expect(screen.getByRole("option", { name: "랜딩페이지 제작" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("키보드(ArrowDown + Enter)로 선택할 수 있다", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="제작종류"
        options={options}
        value=""
        onValueChange={onValueChange}
        placeholder="선택"
      />,
    );
    const combobox = screen.getByRole("combobox", { name: "제작종류" });
    combobox.focus();
    await userEvent.keyboard("{ArrowDown}"); // 열림 (active=0)
    await userEvent.keyboard("{ArrowDown}"); // active=1
    await userEvent.keyboard("{Enter}"); // 선택
    expect(onValueChange).toHaveBeenCalledWith("homepage");
  });

  it("Escape 로 닫는다", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("combobox", { name: "제작종류" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("error 면 combobox 에 aria-invalid 를 단다", () => {
    render(<SelectField label="제작종류" options={options} error="필수" />);
    expect(screen.getByRole("combobox", { name: "제작종류" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("필수")).toBeInTheDocument();
  });
});
