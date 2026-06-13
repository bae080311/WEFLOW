"use client";

import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/shared/ui";

export type ExcelButtonProps = {
  onExport: () => void | Promise<void>;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ExcelButton({
  onExport,
  children,
  variant = "outlined",
  size = "sm",
}: ExcelButtonProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await onExport();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={busy}>
      <Download className="size-4" aria-hidden />
      {children}
    </Button>
  );
}
