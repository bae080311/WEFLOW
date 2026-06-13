"use client";

import { useState } from "react";
import { Container } from "@/shared/ui";
import { AdminLoginGate, useAdminSession } from "@/features/adminAuth";
import {
  AdminTopbar,
  InquiryTable,
  ReservationTable,
  StatusTabs,
  type StatusFilter,
} from "@/widgets/adminDashboard";
import {
  ExcelButton,
  exportAdminCombined,
  exportAdminInquiries,
  exportAdminReservations,
} from "@/features/excelExport";
import { reservationService } from "@/entities/reservation";
import { inquiryService } from "@/entities/inquiry";
import type { Status } from "@/shared/types";
import { useAdminData } from "../model/useAdminData";

function filterByStatus<T extends { status: Status }>(items: T[], filter: StatusFilter): T[] {
  return filter === "전체" ? items : items.filter((item) => item.status === filter);
}

export function AdminDashboardPage() {
  const session = useAdminSession();

  if (session.status === "loading") {
    return <Container className="py-24 text-center text-text-muted">불러오는 중…</Container>;
  }
  if (session.status === "guest") {
    return <AdminLoginGate onSignIn={session.signIn} />;
  }
  return <AuthedDashboard email={session.email} onSignOut={session.signOut} />;
}

function AuthedDashboard({
  email,
  onSignOut,
}: {
  email: string | null;
  onSignOut: () => Promise<void>;
}) {
  const { reservations, inquiries, refresh } = useAdminData();
  const [tab, setTab] = useState<StatusFilter>("전체");

  const visibleReservations = filterByStatus(reservations, tab);
  const visibleInquiries = filterByStatus(inquiries, tab);

  return (
    <Container className="flex flex-col gap-8 py-8">
      <AdminTopbar
        email={email}
        onRefresh={() => void refresh()}
        onExportAll={() => exportAdminCombined(reservations, inquiries)}
        onSignOut={onSignOut}
      />
      <StatusTabs value={tab} onChange={setTab} />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h3 text-text">
            예약 관리 <span className="text-text-muted">({visibleReservations.length})</span>
          </h2>
          <ExcelButton onExport={() => exportAdminReservations(reservations)}>
            예약 엑셀
          </ExcelButton>
        </div>
        <ReservationTable
          reservations={visibleReservations}
          onUpdateStatus={(id, status) => void reservationService.updateStatus(id, status)}
          onDelete={(id) => void reservationService.remove(id)}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h3 text-text">
            문의 관리 <span className="text-text-muted">({visibleInquiries.length})</span>
          </h2>
          <ExcelButton onExport={() => exportAdminInquiries(inquiries)}>문의 엑셀</ExcelButton>
        </div>
        <InquiryTable
          inquiries={visibleInquiries}
          onUpdateStatus={(id, status) => void inquiryService.updateStatus(id, status)}
          onDelete={(id) => void inquiryService.remove(id)}
        />
      </section>
    </Container>
  );
}
