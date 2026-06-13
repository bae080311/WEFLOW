import { Reveal, SectionHeader } from "@/shared/ui";
import { LANDING_VALUES, LANDING_VALUES_HEADER } from "../config/landingContent";

export function LandingValues() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader {...LANDING_VALUES_HEADER} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {LANDING_VALUES.map((value, index) => (
          <li key={value.title}>
            <Reveal
              delay={index * 60}
              className="h-full rounded-card border border-border bg-surface p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand-cyan/40 hover:shadow-glow"
            >
              <p className="text-body font-bold text-text">{value.title}</p>
              <p className="mt-2 text-caption text-text-muted">{value.description}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
