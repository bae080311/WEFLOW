import { createRepository } from "@/shared/api";
import type { RecordInput, RepositoryPort, Unsubscribe } from "@/shared/api";
import type { Status } from "@/shared/types";
import type { Reservation } from "./model";

let repository: RepositoryPort<Reservation> | null = null;

function repo(): RepositoryPort<Reservation> {
  repository ??= createRepository<Reservation>({
    table: "reservations",
    storageKey: "weflow:reservations",
  });
  return repository;
}

/** 컴포넌트가 직접 호출하는 예약 서비스(영속 계층 추상화). */
export const reservationService = {
  create: (input: RecordInput<Reservation>): Promise<Reservation> => repo().create(input),
  list: (): Promise<Reservation[]> => repo().list(),
  updateStatus: (id: string, status: Status): Promise<Reservation> =>
    repo().updateStatus(id, status),
  remove: (id: string): Promise<void> => repo().remove(id),
  subscribe: (onChange: (records: Reservation[]) => void): Unsubscribe =>
    repo().subscribe(onChange),
};
