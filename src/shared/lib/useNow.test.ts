import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNow } from "./useNow";

describe("useNow", () => {
  it("마운트 후 Date 를 반환", () => {
    const { result } = renderHook(() => useNow());
    expect(result.current).toBeInstanceOf(Date);
  });
});
