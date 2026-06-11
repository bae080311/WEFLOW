import { Star } from "lucide-react";
import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { Review } from "../model";

export type ReviewCardProps = {
  review: Review;
  className?: string;
};

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <div className="flex gap-1" aria-label={`별점 ${review.rating}점`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="size-4 fill-accent text-accent" aria-hidden />
        ))}
      </div>
      <p className="text-body text-text">{review.quote}</p>
      <p className="text-caption text-text-muted">
        {review.author} · {review.business} · {review.industry}
      </p>
    </Card>
  );
}
