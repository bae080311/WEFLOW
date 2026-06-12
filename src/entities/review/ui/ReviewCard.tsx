import { Quote, Star } from "lucide-react";
import { cn } from "@/shared/lib";
import type { Review } from "../model";

export type ReviewCardProps = {
  review: Review;
  className?: string;
};

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <figure
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-card border border-border bg-surface/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-brand-cyan/40",
        className,
      )}
    >
      <Quote
        className="pointer-events-none absolute right-4 top-4 size-9 text-brand-cyan/15"
        aria-hidden
      />
      <div className="flex gap-1" aria-label={`별점 ${review.rating}점`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="size-4 fill-accent text-accent" aria-hidden />
        ))}
      </div>
      <blockquote className="text-body text-text">{review.quote}</blockquote>
      <figcaption className="mt-auto text-caption text-text-muted">
        {review.author} · {review.business} · {review.industry}
      </figcaption>
    </figure>
  );
}
