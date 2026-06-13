"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import type { Status } from "@/shared/types";

export type StatusControlProps = {
  status: Status;
  onProgress: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

// 한 레코드의 상태 변경(진행중/완료) + 삭제(2단계 확인) 컨트롤.
export function StatusControl({ status, onProgress, onComplete, onDelete }: StatusControlProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-caption text-text-muted">삭제할까요?</span>
        <Button
          size="sm"
          variant="ghost"
          className="text-danger"
          onClick={() => {
            onDelete();
            setConfirming(false);
          }}
        >
          확인
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          취소
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outlined" onClick={onProgress} disabled={status === "진행중"}>
        진행중
      </Button>
      <Button size="sm" variant="solid" onClick={onComplete} disabled={status === "완료"}>
        완료
      </Button>
      <Button
        size="sm"
        variant="ghost"
        aria-label="삭제"
        className="text-danger"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
