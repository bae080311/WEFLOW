"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/shared/api";

export type AdminSessionStatus = "loading" | "authed" | "guest";

export type SignInResult = { ok: boolean; error?: string };

export type AdminSession = {
  status: AdminSessionStatus;
  email: string | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
};

// Supabase Auth 기반 관리자 세션. env 키가 없으면 guest 로 두고 로그인 시 안내.
export function useAdminSession(): AdminSession {
  const [status, setStatus] = useState<AdminSessionStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // env 미구성 → 즉시 guest (mount 1회). 외부 인증 시스템 부재 동기화.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("guest");
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setStatus(data.session ? "authed" : "guest");
      setEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "authed" : "guest");
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn(emailInput: string, password: string): Promise<SignInResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "인증 서비스가 구성되지 않았습니다. 관리자에게 문의하세요." };
    }
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password });
    if (error) return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    return { ok: true };
  }

  async function signOut(): Promise<void> {
    await getSupabaseClient()?.auth.signOut();
  }

  return { status, email, signIn, signOut };
}
