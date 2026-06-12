import { cn } from "@/shared/lib/cn";

export type ProcessStepCardProps = {
  step: number;
  title: string;
  description?: string;
  className?: string;
};

export function ProcessStepCard({ step, title, description, className }: ProcessStepCardProps) {
  const label = String(step).padStart(2, "0");
  return (
    <div
      className={cn(
        "accent-top group relative h-full overflow-hidden rounded-card border border-border bg-gradient-card p-6",
        "transition-[transform,border-color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-brand-cyan/40 hover:shadow-glow",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <span className="text-gradient-brand text-h1 font-bold leading-none">{label}</span>
      <h3 className="mt-4 text-h3 text-text">{title}</h3>
      {description ? <p className="mt-2 text-body text-text-muted">{description}</p> : null}
    </div>
  );
}
