"use client";

import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { Button, Container, FormField } from "@/shared/ui";
import type { SignInResult } from "../model/useAdminSession";

export type AdminLoginGateProps = {
  onSignIn: (email: string, password: string) => Promise<SignInResult>;
};

export function AdminLoginGate({ onSignIn }: AdminLoginGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await onSignIn(email, password);
    setSubmitting(false);
    if (!result.ok) setError(result.error ?? "로그인에 실패했습니다.");
  }

  return (
    <Container className="flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="rounded-card border border-border bg-surface p-8">
        <span className="grid size-12 place-items-center rounded-full bg-gradient-brand text-white">
          <Lock className="size-5" aria-hidden />
        </span>
        <h1 className="mt-5 text-h2 text-text">관리자 로그인</h1>
        <p className="mt-2 text-caption text-text-muted">WEFLOW 관리자 계정으로 로그인하세요.</p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <FormField
            label="이메일"
            name="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FormField
            label="비밀번호"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? (
            <p role="alert" className="text-caption text-danger">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="gradient" disabled={submitting}>
            {submitting ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
