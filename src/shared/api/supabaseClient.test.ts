import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const createClient = vi.fn(() => ({ id: "fake-client" }));
vi.mock("@supabase/supabase-js", () => ({ createClient }));

beforeEach(() => {
  vi.resetModules();
  createClient.mockClear();
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});

describe("supabaseClient", () => {
  it("env 없으면 null + hasSupabaseEnv false", async () => {
    const mod = await import("./supabaseClient");
    expect(mod.getSupabaseClient()).toBeNull();
    expect(mod.hasSupabaseEnv()).toBe(false);
    expect(createClient).not.toHaveBeenCalled();
  });

  it("env 있으면 createClient 호출 + 싱글톤 캐시", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const mod = await import("./supabaseClient");
    const c1 = mod.getSupabaseClient();
    const c2 = mod.getSupabaseClient();
    expect(c1).not.toBeNull();
    expect(c1).toBe(c2);
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mod.hasSupabaseEnv()).toBe(true);
  });

  it("URL 의 경로/슬래시를 origin 으로 정규화(PGRST125 예방)", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co/rest/v1/";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const mod = await import("./supabaseClient");
    mod.getSupabaseClient();
    expect(createClient).toHaveBeenCalledWith(
      "https://x.supabase.co",
      "anon-key",
      expect.anything(),
    );
  });

  it("형식이 잘못된 URL 은 null(폴백)", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "eyJhbGciOi-not-a-url";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const mod = await import("./supabaseClient");
    expect(mod.getSupabaseClient()).toBeNull();
    expect(mod.normalizeSupabaseUrl("https://x.supabase.co/rest/v1")).toBe("https://x.supabase.co");
    expect(mod.normalizeSupabaseUrl("nonsense")).toBeNull();
    expect(mod.normalizeSupabaseUrl(undefined)).toBeNull();
  });
});
