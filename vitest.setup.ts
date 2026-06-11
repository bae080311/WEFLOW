import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createElement, type AnchorHTMLAttributes, type ReactNode } from "react";

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
