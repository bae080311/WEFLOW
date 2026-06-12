import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CountUp } from "./CountUp";

describe("CountUp", () => {
  const originalIO = globalThis.IntersectionObserver;
  const originalRaf = globalThis.requestAnimationFrame;
  const originalCaf = globalThis.cancelAnimationFrame;

  afterEach(() => {
    globalThis.IntersectionObserver = originalIO;
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCaf;
    vi.restoreAllMocks();
  });

  it("IntersectionObserver 미지원 시 최종값을 즉시(포맷 적용) 표시한다", () => {
    // @ts-expect-error 미지원 환경 시뮬레이션
    delete globalThis.IntersectionObserver;
    render(<CountUp value={28} format={(n) => `${n}+`} />);
    expect(screen.getByText("28+")).toBeInTheDocument();
  });

  it("뷰포트 진입 시 카운트업을 진행해 최종값에 도달한다", () => {
    let trigger: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
    const disconnect = vi.fn();
    globalThis.IntersectionObserver = vi.fn(
      (cb: (entries: { isIntersecting: boolean }[]) => void) => {
        trigger = cb;
        return {
          observe: vi.fn(),
          disconnect,
          unobserve: vi.fn(),
          takeRecords: vi.fn(),
          root: null,
          rootMargin: "",
          thresholds: [],
        };
      },
    ) as unknown as typeof IntersectionObserver;

    let ts = 0;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      ts += 700;
      cb(ts);
      return ts;
    }) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = vi.fn();

    render(<CountUp value={7} durationMs={1200} />);
    expect(screen.getByText("0")).toBeInTheDocument();

    act(() => trigger?.([{ isIntersecting: true }]));
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });
});
