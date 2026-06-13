import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }));
vi.mock("@/shared/api", () => ({ getSupabaseClient }));

import { useAdminSession } from "./useAdminSession";

function fakeClient(session: unknown) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  };
}

beforeEach(() => {
  getSupabaseClient.mockReset();
});

describe("useAdminSession", () => {
  it("supabase env 없으면 guest + signIn 안내 에러", async () => {
    getSupabaseClient.mockReturnValue(null);
    const { result } = renderHook(() => useAdminSession());
    await waitFor(() => expect(result.current.status).toBe("guest"));
    const res = await result.current.signIn("a@b.com", "pw");
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it("세션 있으면 authed + 이메일 노출", async () => {
    getSupabaseClient.mockReturnValue(fakeClient({ user: { email: "admin@weflow.kr" } }));
    const { result } = renderHook(() => useAdminSession());
    await waitFor(() => expect(result.current.status).toBe("authed"));
    expect(result.current.email).toBe("admin@weflow.kr");
  });

  it("세션 없으면 guest", async () => {
    getSupabaseClient.mockReturnValue(fakeClient(null));
    const { result } = renderHook(() => useAdminSession());
    await waitFor(() => expect(result.current.status).toBe("guest"));
  });

  it("signIn 성공/실패", async () => {
    const client = fakeClient(null);
    getSupabaseClient.mockReturnValue(client);
    const { result } = renderHook(() => useAdminSession());
    await waitFor(() => expect(result.current.status).toBe("guest"));

    const ok = await result.current.signIn("a@b.com", "pw");
    expect(ok.ok).toBe(true);

    client.auth.signInWithPassword.mockResolvedValueOnce({ error: new Error("bad") });
    const fail = await result.current.signIn("a@b.com", "bad");
    expect(fail.ok).toBe(false);

    await result.current.signOut();
    expect(client.auth.signOut).toHaveBeenCalled();
  });
});
