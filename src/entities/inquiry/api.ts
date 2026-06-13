import { createRepository } from "@/shared/api";
import type { RecordInput, RepositoryPort, Unsubscribe } from "@/shared/api";
import type { Status } from "@/shared/types";
import type { Inquiry } from "./model";

let repository: RepositoryPort<Inquiry> | null = null;

function repo(): RepositoryPort<Inquiry> {
  repository ??= createRepository<Inquiry>({
    table: "inquiries",
    storageKey: "weflow:inquiries",
  });
  return repository;
}

/** 컴포넌트가 직접 호출하는 문의 서비스(영속 계층 추상화). */
export const inquiryService = {
  create: (input: RecordInput<Inquiry>): Promise<Inquiry> => repo().create(input),
  list: (): Promise<Inquiry[]> => repo().list(),
  updateStatus: (id: string, status: Status): Promise<Inquiry> => repo().updateStatus(id, status),
  remove: (id: string): Promise<void> => repo().remove(id),
  subscribe: (onChange: (records: Inquiry[]) => void): Unsubscribe => repo().subscribe(onChange),
};
