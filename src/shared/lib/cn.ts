import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// className 병합 유틸 (조건부 클래스 + Tailwind 충돌 해소). 전 컴포넌트의 표준 헬퍼.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
