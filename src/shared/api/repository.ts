import { getSupabaseClient } from "./supabaseClient";
import { createSupabaseAdapter } from "./supabaseAdapter";
import { createLocalStorageAdapter } from "./localStorageAdapter";
import type { PersistedRecord, RepositoryConfig, RepositoryPort } from "./types";

/**
 * "DB 교체 = 어댑터 1개 교체"의 단일 분기점.
 * env(NEXT_PUBLIC_SUPABASE_*) 있으면 Supabase(Realtime), 없으면 localStorage 폴백.
 */
export function createRepository<T extends PersistedRecord>(
  config: RepositoryConfig,
): RepositoryPort<T> {
  const supabase = getSupabaseClient();
  if (supabase) return createSupabaseAdapter<T>(supabase, config.table);
  return createLocalStorageAdapter<T>(config.storageKey);
}
