import { describe, it, expect, beforeEach, vi } from "vitest";
import { createLocalStorageAdapter } from "./localStorageAdapter";
import type { PersistedRecord } from "./types";

type TestRecord = PersistedRecord & { name: string };

const KEY = "weflow:test-records";

beforeEach(() => {
  window.localStorage.clear();
});

describe("localStorageAdapter — CRUD", () => {
  it("create 는 status='대기' + id + createdAt 를 채운다", async () => {
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    const record = await repo.create({ name: "홍길동" } as never);
    expect(record.status).toBe("대기");
    expect(record.id).toBeTruthy();
    expect(record.createdAt).toBeTruthy();
    expect(record.name).toBe("홍길동");
  });

  it("list 는 createdAt 내림차순(최신 우선)", async () => {
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    await repo.create({ name: "first" } as never);
    await new Promise((r) => setTimeout(r, 2));
    await repo.create({ name: "second" } as never);
    const list = await repo.list();
    expect(list).toHaveLength(2);
    expect(list[0].name).toBe("second");
  });

  it("updateStatus 는 상태 + updatedAt 반영", async () => {
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    const created = await repo.create({ name: "a" } as never);
    const updated = await repo.updateStatus(created.id, "완료");
    expect(updated.status).toBe("완료");
    expect(updated.updatedAt).toBeTruthy();
    const list = await repo.list();
    expect(list[0].status).toBe("완료");
  });

  it("없는 id updateStatus 는 throw", async () => {
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    await expect(repo.updateStatus("nope", "완료")).rejects.toThrow();
  });

  it("remove 후 목록에서 사라짐", async () => {
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    const created = await repo.create({ name: "a" } as never);
    await repo.remove(created.id);
    expect(await repo.list()).toHaveLength(0);
  });

  it("새 인스턴스에서도 영속(새로고침 시뮬)", async () => {
    const repo1 = createLocalStorageAdapter<TestRecord>(KEY);
    await repo1.create({ name: "persist" } as never);
    const repo2 = createLocalStorageAdapter<TestRecord>(KEY);
    const list = await repo2.list();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe("persist");
  });
});

describe("localStorageAdapter — subscribe", () => {
  it("변경 시 최신 목록으로 콜백", async () => {
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    const onChange = vi.fn();
    const unsubscribe = repo.subscribe(onChange);
    await repo.create({ name: "a" } as never);
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.lastCall?.[0]).toHaveLength(1);
    unsubscribe();
    await repo.create({ name: "b" } as never);
    expect(onChange.mock.lastCall?.[0]).toHaveLength(1); // unsubscribe 후 갱신 안 됨
  });

  it("손상된 JSON 은 빈 목록으로 복구", async () => {
    window.localStorage.setItem(KEY, "{not json");
    const repo = createLocalStorageAdapter<TestRecord>(KEY);
    expect(await repo.list()).toEqual([]);
  });
});
