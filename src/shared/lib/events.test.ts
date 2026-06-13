import { describe, it, expect, vi } from "vitest";
import { createEventBus } from "./events";

describe("events — createEventBus", () => {
  it("emit 은 인탭 리스너를 호출", () => {
    const bus = createEventBus("weflow:test");
    const listener = vi.fn();
    bus.subscribe(listener);
    bus.emit();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("같은 key 의 storage 이벤트(다른 탭)에 반응", () => {
    const bus = createEventBus("weflow:test");
    const listener = vi.fn();
    bus.subscribe(listener);
    window.dispatchEvent(new StorageEvent("storage", { key: "weflow:test" }));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("다른 key 의 storage 이벤트는 무시", () => {
    const bus = createEventBus("weflow:test");
    const listener = vi.fn();
    bus.subscribe(listener);
    window.dispatchEvent(new StorageEvent("storage", { key: "other" }));
    expect(listener).not.toHaveBeenCalled();
  });

  it("unsubscribe 후에는 호출되지 않음", () => {
    const bus = createEventBus("weflow:test");
    const listener = vi.fn();
    const unsubscribe = bus.subscribe(listener);
    unsubscribe();
    bus.emit();
    window.dispatchEvent(new StorageEvent("storage", { key: "weflow:test" }));
    expect(listener).not.toHaveBeenCalled();
  });
});
