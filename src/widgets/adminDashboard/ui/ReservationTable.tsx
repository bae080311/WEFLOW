"use client";

import { Table, TableCell, TableHeaderCell, StatusBadge } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib";
import { StatusControl } from "@/features/adminStatusControl";
import type { Reservation } from "@/entities/reservation";
import type { Status } from "@/shared/types";
import { ExpandableRow } from "./ExpandableRow";
import { AdminCell } from "./AdminCell";

export type ReservationTableProps = {
  reservations: Reservation[];
  onUpdateStatus: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
};

const COLUMNS = ["상태", "이름", "연락처", "접수일", "희망 일정", "관리"];
const COL_SPAN = COLUMNS.length + 1; // + 토글

export function ReservationTable({
  reservations,
  onUpdateStatus,
  onDelete,
}: ReservationTableProps) {
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
        {reservations.map((reservation) => (
          <ExpandableRow
            key={reservation.id}
            colSpan={COL_SPAN}
            cells={
              <>
                <AdminCell label="상태">
                  <StatusBadge status={reservation.status} />
                </AdminCell>
                <AdminCell label="이름">{reservation.name}</AdminCell>
                <AdminCell label="연락처">{reservation.phone}</AdminCell>
                <AdminCell label="접수일">{formatDateTime(reservation.createdAt)}</AdminCell>
                <AdminCell label="희망 일정">
                  {reservation.desiredDate} {reservation.desiredTime}
                </AdminCell>
                <AdminCell label="관리" stack>
                  <StatusControl
                    status={reservation.status}
                    onProgress={() => onUpdateStatus(reservation.id, "진행중")}
                    onComplete={() => onUpdateStatus(reservation.id, "완료")}
                    onDelete={() => onDelete(reservation.id)}
                  />
                </AdminCell>
              </>
            }
            details={[
              { label: "제작종류", value: reservation.projectType },
              { label: "업종", value: reservation.industry },
              { label: "추가요청사항", value: reservation.note || "-" },
            ]}
          />
        ))}
        {reservations.length === 0 ? (
          <tr className="block md:table-row">
            <TableCell
              colSpan={COL_SPAN}
              className="block py-8 text-center text-text-muted md:table-cell"
            >
              표시할 예약이 없습니다.
            </TableCell>
          </tr>
        ) : null}
      </tbody>
    </Table>
  );
}
