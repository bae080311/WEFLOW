"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui";
import { ExcelButton } from "@/features/excelExport";
import { AdminLogoutButton } from "@/features/adminAuth";

export type AdminTopbarProps = {
  email: string | null;
  onRefresh: () => void;
  onExportAll: () => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
};

export function AdminTopbar({ email, onRefresh, onExportAll, onSignOut }: AdminTopbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div>
        <p className="text-h3 text-text">WEFLOW 관리자</p>
        {email ? <p className="text-caption text-text-muted">{email}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ExcelButton onExport={onExportAll}>전체 엑셀 다운로드</ExcelButton>
        <Button size="sm" variant="outlined" onClick={onRefresh}>
          <RefreshCw className="size-4" aria-hidden />
          새로고침
        </Button>
        <AdminLogoutButton onSignOut={onSignOut} />
      </div>
    </header>
  );
}
