import { cn } from "@/shared/lib/cn";
import { Card } from "./Card";

export type ProcessStepCardProps = {
  step: number;
  title: string;
  description?: string;
  className?: string;
};

export function ProcessStepCard({ step, title, description, className }: ProcessStepCardProps) {
  const label = String(step).padStart(2, "0");
  return (
    <Card variant="gradient" className={cn("flex flex-col gap-3", className)}>
      <span className="bg-gradient-brand bg-clip-text text-h1 font-bold leading-none text-transparent">
        {label}
      </span>
      <h3 className="text-h3 text-text">{title}</h3>
      {description ? <p className="text-body text-text-muted">{description}</p> : null}
    </Card>
  );
}
