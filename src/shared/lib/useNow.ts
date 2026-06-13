"use client";

import { useEffect, useState } from "react";

/**
 * 클라이언트 마운트 후의 현재 시각.
 * SSR/첫 렌더는 null → 서버=첫 CSR 마크업 동일(하이드레이션 안전). mount 후 실제 Date.
 * (side effect 는 useEffect 안에서만 — React 19 컴파일러 규칙 준수)
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // mount 후 1회 클라이언트 현재 시각 확정(하이드레이션 안전). 초기 state 는 SSR 결정성을 위해 null.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);
  return now;
}
