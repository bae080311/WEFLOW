import type { SupabaseClient } from "@supabase/supabase-js";
import type { Status } from "@/shared/types";
import type { PersistedRecord, RecordInput, RepositoryPort, Unsubscribe } from "./types";

// 테이블 컬럼은 모델과 동일한 camelCase(스키마에서 따옴표로 생성) → 매핑 불필요.
const ORDER_COLUMN = "createdAt";

/** Supabase(Postgres + Realtime) 어댑터. env 키가 있을 때 사용. */
export function createSupabaseAdapter<T extends PersistedRecord>(
  client: SupabaseClient,
  table: string,
): RepositoryPort<T> {
  async function fetchAll(): Promise<T[]> {
    const { data, error } = await client
      .from(table)
      .select("*")
      .order(ORDER_COLUMN, { ascending: false });
    if (error) throw error;
    return (data ?? []) as T[];
  }

  return {
    async create(input: RecordInput<T>): Promise<T> {
      // 익명(anon) INSERT 만 허용하고 SELECT 는 막으므로(RLS, PII 보호) returning 을 쓰지 않는다.
      const { error } = await client
        .from(table)
        .insert({ ...input, status: "대기" satisfies Status });
      if (error) throw error;
      return {
        ...input,
        id: "",
        status: "대기",
        createdAt: new Date().toISOString(),
      } as unknown as T;
    },
    list: fetchAll,
    async updateStatus(id: string, status: Status): Promise<T> {
      const { data, error } = await client
        .from(table)
        .update({ status, updatedAt: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as T;
    },
    async remove(id: string): Promise<void> {
      const { error } = await client.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    subscribe(onChange: (records: T[]) => void): Unsubscribe {
      const channel = client
        .channel(`weflow:${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, async () => {
          onChange(await fetchAll());
        })
        .subscribe();
      return () => {
        void client.removeChannel(channel);
      };
    },
  };
}
