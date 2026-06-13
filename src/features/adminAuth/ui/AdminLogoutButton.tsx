"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui";

export type AdminLogoutButtonProps = {
  onSignOut: () => void | Promise<void>;
};

export function AdminLogoutButton({ onSignOut }: AdminLogoutButtonProps) {
  return (
    <Button size="sm" variant="ghost" onClick={() => void onSignOut()}>
      <LogOut className="size-4" aria-hidden />
      로그아웃
    </Button>
  );
}
