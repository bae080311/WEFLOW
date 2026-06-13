import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CasesView } from "./CasesView";
import { CASES } from "@/entities/case";
import { ModalProvider } from "@/shared/lib";

describe("CasesView", () => {
  it("28개 사례 카드와 문의 모달 CTA를 렌더한다", () => {
    render(
      <ModalProvider>
        <CasesView />
      </ModalProvider>,
    );
    expect(CASES).toHaveLength(28);
    expect(screen.getAllByRole("link", { name: /자세히 보기/ })).toHaveLength(28);
    expect(screen.getByRole("button", { name: "더보기" })).toBeInTheDocument();
  });
});
