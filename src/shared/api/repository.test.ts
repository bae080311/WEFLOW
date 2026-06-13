import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }));
vi.mock("./supabaseClient", () => ({ getSupabaseClient, hasSupabaseEnv: vi.fn() }));

import { createRepository } from "./repository";
import type { PersistedRecord } from "./types";

type TestRecord = PersistedRecord & { name: string };

beforeEach(() => {
  getSupabaseClient.mockReset();
  window.localStorage.clear();
});

describe("createRepository — 어댑터 선택", () => {
  it("supabase 클라이언트 없으면 localStorage 폴백 어댑터", async () => {
    getSupabaseClient.mockReturnValue(null);
    const repo = createRepository<TestRecord>({ table: "t", storageKey: "weflow:repo-test" });
    const created = await repo.create({ name: "fallback" } as never);
    expect(created.status).toBe("대기");
    expect(await repo.list()).toHaveLength(1);
  });

  it("supabase 클라이언트 있으면 Supabase 어댑터(from 호출)", async () => {
    const builder: Record<string, unknown> = {};
    for (const m of ["select", "order"]) builder[m] = vi.fn(() => builder);
    builder.then = (resolve: (v: unknown) => unknown) => resolve({ data: [], error: null });
    const from = vi.fn(() => builder);
    getSupabaseClient.mockReturnValue({ from } as unknown as SupabaseClient);

    const repo = createRepository<TestRecord>({ table: "reservations", storageKey: "x" });
    await repo.list();
    expect(from).toHaveBeenCalledWith("reservations");
  });
});
