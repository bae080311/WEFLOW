import { ROUTES } from "@/shared/config";

export function isActive(href: string, pathname: string): boolean {
  return href === ROUTES.home ? pathname === "/" : pathname.startsWith(href);
}
