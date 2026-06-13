"use client";

import { Table, TableCell, TableHeaderCell, StatusBadge } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib";
import { StatusControl } from "@/features/adminStatusControl";
import type { Inquiry } from "@/entities/inquiry";
import type { Status } from "@/shared/types";
import { ExpandableRow } from "./ExpandableRow";
import { AdminCell } from "./AdminCell";

export type InquiryTableProps = {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
};

const COLUMNS = ["상태", "이름", "연락처", "접수일", "관리"];
const COL_SPAN = COLUMNS.length + 1;

export function InquiryTable({ inquiries, onUpdateStatus, onDelete }: InquiryTableProps) {
  return (
    <Table>
      <thead className="hidden md:table-header-group">
        <tr>
          {COLUMNS.map((column) => (
            <TableHeaderCell key={column}>{column}</TableHeaderCell>
          ))}
          <TableHeaderCell>
            <span className="sr-only">상세</span>
          </TableHeaderCell>
        </tr>
      </thead>
      <tbody className="block space-y-3 md:table-row-group md:space-y-0">
        {inquiries.map((inquiry) => (
          <ExpandableRow
            key={inquiry.id}
            colSpan={COL_SPAN}
            cells={
              <>
                <AdminCell label="상태">
                  <StatusBadge status={inquiry.status} />
                </AdminCell>
                <AdminCell label="이름">{inquiry.name}</AdminCell>
                <AdminCell label="연락처">{inquiry.phone}</AdminCell>
                <AdminCell label="접수일">{formatDateTime(inquiry.createdAt)}</AdminCell>
                <AdminCell label="관리" stack>
                  <StatusControl
                    status={inquiry.status}
                    onProgress={() => onUpdateStatus(inquiry.id, "진행중")}
                    onComplete={() => onUpdateStatus(inquiry.id, "완료")}
                    onDelete={() => onDelete(inquiry.id)}
                  />
                </AdminCell>
              </>
            }
            details={[
              { label: "제작종류", value: inquiry.projectType },
              { label: "업종", value: inquiry.industry },
              { label: "추가요청사항", value: inquiry.note || "-" },
            ]}
          />
        ))}
        {inquiries.length === 0 ? (
          <tr className="block md:table-row">
            <TableCell
              colSpan={COL_SPAN}
              className="block py-8 text-center text-text-muted md:table-cell"
            >
              표시할 문의가 없습니다.
            </TableCell>
          </tr>
        ) : null}
      </tbody>
    </Table>
  );
}
