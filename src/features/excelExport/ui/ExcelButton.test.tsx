import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExcelButton } from "./ExcelButton";

describe("ExcelButton", () => {
  it("클릭 시 onExport 를 호출", async () => {
    const onExport = vi.fn().mockResolvedValue(undefined);
    render(<ExcelButton onExport={onExport}>예약 엑셀</ExcelButton>);
    await userEvent.click(screen.getByRole("button", { name: /예약 엑셀/ }));
    await waitFor(() => expect(onExport).toHaveBeenCalledTimes(1));
  });
});
