import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createElement, type AnchorHTMLAttributes, type ReactNode } from "react";

// jsdom 의 localStorage 는 이 환경에서 비어 있는 스텁이라 동작하는 in-memory 폴리필로 교체.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length(): number {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
}
Object.defineProperty(window, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) =>
    createElement("a", props, children),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    sizes,
  }: {
    src: string | { src: string };
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    sizes?: string;
  }) =>
    createElement("img", {
      src: typeof src === "string" ? src : src.src,
      alt,
      width,
      height,
      className,
      sizes,
    }),
}));
