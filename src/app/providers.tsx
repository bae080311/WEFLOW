"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Query Provider (P1 = 스캐폴드만). 훅/fetch 는 P7 데이터 계층에서 도입.
// QueryClient 는 useState 초기화로 1회만 생성 — 렌더 side effect 없음(React 19 컴파일러 안전).
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
