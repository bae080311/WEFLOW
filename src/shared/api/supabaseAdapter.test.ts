import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdapter } from "./supabaseAdapter";
import type { PersistedRecord } from "./types";

type TestRecord = PersistedRecord & { name: string };

type Result = { data: unknown; error: unknown };

function makeBuilder(result: Result) {
  const builder: Record<string, unknown> = {};
  for (const m of ["insert", "update", "delete", "select", "order", "eq", "single"]) {
    builder[m] = vi.fn(() => builder);
  }
  // thenable → await chain 시 result 로 resolve
  builder.then = (resolve: (v: Result) => unknown) => resolve(result);
  return builder as Record<string, ReturnType<typeof vi.fn>> & { then: unknown };
}

function makeClient(result: Result) {
  let lastBuilder: ReturnType<typeof makeBuilder> | undefined;
  const from = vi.fn(() => {
    lastBuilder = makeBuilder(result);
    return lastBuilder;
  });
  let changeCb: (() => Promise<void>) | undefined;
  const channel = {
    on: vi.fn((_event: string, _filter: unknown, cb: () => Promise<void>) => {
      changeCb = cb;
      return channel;
    }),
    subscribe: vi.fn(() => channel),
  };
  const client = {
    from,
    channel: vi.fn(() => channel),
    removeChannel: vi.fn(),
  };
  return {
    client: client as unknown as SupabaseClient,
    getBuilder: () => lastBuilder!,
    getChangeCb: () => changeCb!,
    channel,
    removeChannel: client.removeChannel,
  };
}

describe("supabaseAdapter", () => {
  it("create 는 status='대기' 로 insert (returning 없이, anon RLS 안전)", async () => {
    const { client, getBuilder } = makeClient({ data: null, error: null });
    const adapter = createSupabaseAdapter<TestRecord>(client, "reservations");
    const created = await adapter.create({ name: "홍길동" } as never);
    expect(created.status).toBe("대기");
    expect(getBuilder().insert).toHaveBeenCalledWith(
      expect.objectContaining({ status: "대기", name: "홍길동" }),
    );
    expect(getBuilder().select).not.toHaveBeenCalled();
  });

  it("list 는 createdAt 내림차순 order", async () => {
    const rows = [{ id: "1", status: "대기", createdAt: "t", name: "a" }];
    const { client, getBuilder } = makeClient({ data: rows, error: null });
    const adapter = createSupabaseAdapter<TestRecord>(client, "reservations");
    const list = await adapter.list();
    expect(list).toEqual(rows);
    expect(getBuilder().order).toHaveBeenCalledWith("createdAt", { ascending: false });
  });

  it("updateStatus 는 update + eq(id) 후 반환", async () => {
    const row = { id: "1", status: "완료", createdAt: "t", name: "a" };
    const { client, getBuilder } = makeClient({ data: row, error: null });
    const adapter = createSupabaseAdapter<TestRecord>(client, "reservations");
    const updated = await adapter.updateStatus("1", "완료");
    expect(updated.status).toBe("완료");
    expect(getBuilder().update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "완료", updatedAt: expect.any(String) }),
    );
    expect(getBuilder().eq).toHaveBeenCalledWith("id", "1");
  });

  it("remove 는 delete + eq(id)", async () => {
    const { client, getBuilder } = makeClient({ data: null, error: null });
    const adapter = createSupabaseAdapter<TestRecord>(client, "reservations");
    await adapter.remove("9");
    expect(getBuilder().delete).toHaveBeenCalled();
    expect(getBuilder().eq).toHaveBeenCalledWith("id", "9");
  });

  it("error 가 있으면 throw", async () => {
    const { client } = makeClient({ data: null, error: new Error("boom") });
    const adapter = createSupabaseAdapter<TestRecord>(client, "reservations");
    await expect(adapter.create({ name: "x" } as never)).rejects.toThrow("boom");
  });

  it("subscribe 는 채널 구독 + 변경 시 최신 목록 콜백 + unsub 시 removeChannel", async () => {
    const rows = [{ id: "1", status: "대기", createdAt: "t", name: "a" }];
    const { client, channel, removeChannel, getChangeCb } = makeClient({ data: rows, error: null });
    const adapter = createSupabaseAdapter<TestRecord>(client, "inquiries");
    const onChange = vi.fn();
    const unsubscribe = adapter.subscribe(onChange);
    expect(channel.on).toHaveBeenCalled();
    expect(channel.subscribe).toHaveBeenCalled();
    await getChangeCb()();
    expect(onChange).toHaveBeenCalledWith(rows);
    unsubscribe();
    expect(removeChannel).toHaveBeenCalled();
  });
});
