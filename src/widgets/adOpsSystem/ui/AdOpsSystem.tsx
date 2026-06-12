import {
  Newspaper,
  Camera,
  AtSign,
  Hash,
  MapPin,
  Search,
  Globe,
  Network,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib";
import { AD_OPS_GROUPS, type AdOpsGroup, type AdOpsIconKey } from "@/shared/config";

export type AdOpsSystemProps = {
  groups?: AdOpsGroup[];
  className?: string;
};

const ICONS: Record<AdOpsIconKey, LucideIcon> = {
  blog: Newspaper,
  instagram: Camera,
  threads: AtSign,
  "naver-keyword": Hash,
  danggn: MapPin,
  "naver-seo": Search,
  google: Globe,
  sitemap: Network,
};

// 광고 운영·사후관리 시스템 — 채널 업로드 / 검색 상단 노출 두 그룹, 플랫폼 아이콘 카드.
export function AdOpsSystem({ groups = AD_OPS_GROUPS, className }: AdOpsSystemProps) {
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2.5 text-h3 font-bold text-text">
            <span className="h-5 w-1 rounded-full bg-gradient-brand" aria-hidden />
            {group.title}
            <span className="text-caption font-medium text-text-subtle">{group.items.length}</span>
          </h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <li key={item.label}>
                  <article className="group flex h-full items-center gap-3 rounded-card border border-border bg-surface/60 p-5 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand-cyan/40 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span className="grid size-10 shrink-0 place-items-center rounded-control bg-surface-2 text-brand-cyan transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="break-keep text-body font-medium text-text">{item.label}</span>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
