import type { Status } from "@/shared/types";
import { createEventBus } from "@/shared/lib/events";
import type { PersistedRecord, RecordInput, RepositoryPort, Unsubscribe } from "./types";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

/**
 * localStorage 폴백 어댑터(env 키 없을 때). 같은 브라우저 멀티탭 실시간 동기화:
 * - 인탭: events 버스 emit.
 * - 크로스탭: localStorage 쓰기가 다른 탭의 `storage` 이벤트를 발화 → 버스 subscribe 가 수신.
 * SSR/window 부재 시 in-memory 폴백으로 안전.
 */
export function createLocalStorageAdapter<T extends PersistedRecord>(
  storageKey: string,
): RepositoryPort<T> {
  const bus = createEventBus(storageKey);
  let memory: T[] = [];

  // localStorage 사용 가능 여부(SSR·Safari 프라이빗 모드·jsdom 스텁 등에서는 메모리 폴백).
  function storageAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const probe = "__weflow_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }
  const useStorage = storageAvailable();

  function read(): T[] {
    if (!useStorage) return memory;
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  function write(records: T[]): void {
    if (useStorage) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    } else {
      memory = records;
    }
    bus.emit();
  }

  function sortedDesc(records: T[]): T[] {
    return [...records].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
    );
  }

  return {
    async create(input: RecordInput<T>): Promise<T> {
      const record = {
        ...input,
        id: generateId(),
        status: "대기" as Status,
        createdAt: new Date().toISOString(),
      } as T;
      write([record, ...read()]);
      return record;
    },
    async list(): Promise<T[]> {
      return sortedDesc(read());
    },
    async updateStatus(id: string, status: Status): Promise<T> {
      const records = read();
      const updatedAt = new Date().toISOString();
      let updated: T | undefined;
      const next = records.map((record) => {
        if (record.id !== id) return record;
        updated = { ...record, status, updatedAt };
        return updated;
      });
      if (!updated) throw new Error(`레코드를 찾을 수 없습니다: ${id}`);
      write(next);
      return updated;
    },
    async remove(id: string): Promise<void> {
      write(read().filter((record) => record.id !== id));
    },
    subscribe(onChange: (records: T[]) => void): Unsubscribe {
      return bus.subscribe(() => onChange(sortedDesc(read())));
    },
  };
}
