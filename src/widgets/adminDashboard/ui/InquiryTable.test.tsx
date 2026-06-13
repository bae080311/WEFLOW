import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InquiryTable } from "./InquiryTable";
import type { Inquiry } from "@/entities/inquiry";

const inquiry: Inquiry = {
  id: "i1",
  status: "대기",
  createdAt: "2026-06-13T10:00:00.000Z",
  name: "김철수",
  phone: "010-0000-0000",
  projectType: "랜딩페이지 제작",
  industry: "필라테스",
  note: "견적 문의",
  source: "diagnosis",
  agreed: true,
};

describe("InquiryTable", () => {
  it("컬럼 헤더(상태·이름·연락처·접수일·관리)와 행을 렌더", () => {
    render(<InquiryTable inquiries={[inquiry]} onUpdateStatus={vi.fn()} onDelete={vi.fn()} />);
    for (const column of ["상태", "이름", "연락처", "접수일", "관리"]) {
      expect(screen.getByRole("columnheader", { name: column })).toBeInTheDocument();
    }
    expect(screen.getByText("김철수")).toBeInTheDocument();
  });

  it("상세 펼침으로 제작종류·업종·추가요청사항", async () => {
    render(<InquiryTable inquiries={[inquiry]} onUpdateStatus={vi.fn()} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "상세 보기" }));
    expect(screen.getByText("견적 문의")).toBeInTheDocument();
    expect(screen.getByText("필라테스")).toBeInTheDocument();
  });

  it("상태 변경 콜백", async () => {
    const onUpdateStatus = vi.fn();
    render(
      <InquiryTable inquiries={[inquiry]} onUpdateStatus={onUpdateStatus} onDelete={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "완료" }));
    expect(onUpdateStatus).toHaveBeenCalledWith("i1", "완료");
  });
});
