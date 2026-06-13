import type { Status } from "@/shared/types";

/** 모든 영속 레코드 공통 필드(서버/어댑터가 생성·관리). */
export type PersistedRecord = {
  id: string;
  status: Status;
  createdAt: string; // ISO
  updatedAt?: string;
};

/** 폼이 만드는 입력 — id/status/createdAt/updatedAt 은 어댑터가 채운다. */
export type RecordInput<T extends PersistedRecord> = Omit<
  T,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type Unsubscribe = () => void;

/**
 * 영속 포트(어댑터 교체 지점). 제네릭으로 entities 타입을 알지 않아 FSD 방향을 지킨다.
 * 구체 타입 바인딩은 entity 의 api 가 수행.
 */
export interface RepositoryPort<T extends PersistedRecord> {
  /** status="대기" + id/createdAt 생성하여 저장. */
  create(input: RecordInput<T>): Promise<T>;
  /** createdAt 내림차순 목록. */
  list(): Promise<T[]>;
  updateStatus(id: string, status: Status): Promise<T>;
  remove(id: string): Promise<void>;
  /** 변경 시 최신 목록으로 콜백(실시간/멀티탭). */
  subscribe(onChange: (records: T[]) => void): Unsubscribe;
}

export type RepositoryConfig = { table: string; storageKey: string };
