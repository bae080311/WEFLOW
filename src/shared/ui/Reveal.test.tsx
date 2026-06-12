import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  const original = globalThis.IntersectionObserver;

  afterEach(() => {
    globalThis.IntersectionObserver = original;
    vi.restoreAllMocks();
  });

  it("IntersectionObserver 가 없으면 자식을 즉시 노출한다", () => {
    // @ts-expect-error 테스트에서 의도적으로 미지원 환경을 시뮬레이션
    delete globalThis.IntersectionObserver;
    const { container } = render(<Reveal delay={120}>콘텐츠</Reveal>);
    expect(screen.getByText("콘텐츠")).toBeInTheDocument();
    expect(container.querySelector(".reveal")).toHaveClass("is-visible");
    expect(container.querySelector(".reveal")).toHaveStyle({ transitionDelay: "120ms" });
  });

  it("교차 시 is-visible 을 부여하고 관찰을 해제한다", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let trigger: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
    globalThis.IntersectionObserver = vi.fn(
      (cb: (entries: { isIntersecting: boolean }[]) => void) => {
        trigger = cb;
        return {
          observe,
          disconnect,
          unobserve: vi.fn(),
          takeRecords: vi.fn(),
          root: null,
          rootMargin: "",
          thresholds: [],
        };
      },
    ) as unknown as typeof IntersectionObserver;

    const { container } = render(<Reveal>나타남</Reveal>);
    expect(observe).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".reveal")).not.toHaveClass("is-visible");

    act(() => trigger?.([{ isIntersecting: true }]));
    expect(container.querySelector(".reveal")).toHaveClass("is-visible");
    expect(disconnect).toHaveBeenCalled();
  });
});
