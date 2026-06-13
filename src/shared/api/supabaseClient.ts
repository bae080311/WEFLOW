import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * NEXT_PUBLIC_SUPABASE_URL 정규화:
 * - 따옴표/공백 제거
 * - origin 만 사용(끝 슬래시·`/rest/v1` 같은 경로 중복 방지 → PGRST125 예방)
 * 형식이 잘못되면 null 을 반환해 명확히 신호한다.
 */
export function normalizeSupabaseUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/^['"]|['"]$/g, "");
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

/** env(NEXT_PUBLIC_SUPABASE_*) 가 유효하면 클라이언트, 없거나 형식 오류면 null(→ localStorage 폴백). */
export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !url) {
      console.error(
        "[weflow] NEXT_PUBLIC_SUPABASE_URL 형식이 올바르지 않습니다. " +
          "예: https://<project-ref>.supabase.co (경로/슬래시 없이). localStorage 폴백으로 동작합니다.",
      );
    }
    return null;
  }
  client = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}

export function hasSupabaseEnv(): boolean {
  return Boolean(
    normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
