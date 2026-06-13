import { describe, it, expect, vi, beforeEach } from "vitest";

const { createRepository } = vi.hoisted(() => ({ createRepository: vi.fn() }));
vi.mock("@/shared/api", () => ({ createRepository }));

import { reservationService } from "./api";

const fakeRepo = {
  create: vi.fn().mockResolvedValue({ id: "1" }),
  list: vi.fn().mockResolvedValue([]),
  updateStatus: vi.fn().mockResolvedValue({ id: "1", status: "완료" }),
  remove: vi.fn().mockResolvedValue(undefined),
  subscribe: vi.fn(() => () => {}),
};

beforeEach(() => {
  vi.clearAllMocks();
  createRepository.mockReturnValue(fakeRepo);
});

describe("reservationService — repository 위임", () => {
  it("reservations 테이블/스토리지 키로 repository 생성", async () => {
    await reservationService.list();
    expect(createRepository).toHaveBeenCalledWith({
      table: "reservations",
      storageKey: "weflow:reservations",
    });
  });

  it("create/updateStatus/remove/subscribe 위임", async () => {
    await reservationService.create({ name: "a" } as never);
    expect(fakeRepo.create).toHaveBeenCalled();
    await reservationService.updateStatus("1", "완료");
    expect(fakeRepo.updateStatus).toHaveBeenCalledWith("1", "완료");
    await reservationService.remove("1");
    expect(fakeRepo.remove).toHaveBeenCalledWith("1");
    const cb = vi.fn();
    reservationService.subscribe(cb);
    expect(fakeRepo.subscribe).toHaveBeenCalledWith(cb);
  });
});
