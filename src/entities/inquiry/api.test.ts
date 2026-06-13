import { describe, it, expect, vi, beforeEach } from "vitest";

const { createRepository } = vi.hoisted(() => ({ createRepository: vi.fn() }));
vi.mock("@/shared/api", () => ({ createRepository }));

import { inquiryService } from "./api";

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

describe("inquiryService — repository 위임", () => {
  it("inquiries 테이블/스토리지 키로 repository 생성", async () => {
    await inquiryService.list();
    expect(createRepository).toHaveBeenCalledWith({
      table: "inquiries",
      storageKey: "weflow:inquiries",
    });
  });

  it("create/updateStatus/remove/subscribe 위임", async () => {
    await inquiryService.create({ name: "a" } as never);
    expect(fakeRepo.create).toHaveBeenCalled();
    await inquiryService.updateStatus("1", "진행중");
    expect(fakeRepo.updateStatus).toHaveBeenCalledWith("1", "진행중");
    await inquiryService.remove("1");
    expect(fakeRepo.remove).toHaveBeenCalledWith("1");
    const cb = vi.fn();
    inquiryService.subscribe(cb);
    expect(fakeRepo.subscribe).toHaveBeenCalledWith(cb);
  });
});
