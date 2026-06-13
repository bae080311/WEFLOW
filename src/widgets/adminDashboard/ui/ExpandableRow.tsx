"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib";

export type DetailItem = { label: string; value: ReactNode };

export type ExpandableRowProps = {
  cells: ReactNode; // 주요 셀(<AdminCell>...). 토글 셀은 내부에서 덧붙임
  details: DetailItem[];
  colSpan: number; // 전체 컬럼 수(토글 포함)
};

// 메인 행 + 아래 화살표로 펼쳐지는 상세(제작종류·업종·추가요청사항 등).
// 모바일: 카드(테두리+패딩) / 데스크탑: 일반 table-row.
export function ExpandableRow({ cells, details, colSpan }: ExpandableRowProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="block rounded-card border border-border bg-surface p-4 align-middle md:table-row md:rounded-none md:border-0 md:bg-transparent md:p-0">
        {cells}
        <td className="flex justify-end pt-2 md:table-cell md:border-b md:border-border md:px-4 md:py-3 md:text-right">
          <button
            type="button"
            aria-expanded={open}
            aria-label="상세 보기"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-control px-2 py-1 text-caption text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan md:size-8 md:justify-center md:px-0 md:py-0"
          >
            <span className="md:hidden">상세</span>
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </td>
      </tr>
      {open ? (
        <tr
          className={cn(
            "block rounded-card border border-border bg-surface-2/40 p-4",
            "md:table-row md:rounded-none md:border-0 md:bg-transparent md:p-0",
          )}
        >
          <td
            colSpan={colSpan}
            className="block md:table-cell md:border-b md:border-border md:bg-surface-2/40 md:px-4 md:py-3"
          >
            <dl className="grid gap-3 sm:grid-cols-3">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-caption text-text-muted">{detail.label}</dt>
                  <dd className="mt-1 break-keep text-body text-text">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </td>
        </tr>
      ) : null}
    </>
  );
}
