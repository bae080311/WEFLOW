import { ReviewCard, REVIEWS, type Review } from "@/entities/review";
import { cn } from "@/shared/lib";

export type ReviewMarqueeProps = {
  reviews?: Review[];
  className?: string;
};

// 한 줄(리뷰 절반)을 2벌 렌더(둘째 벌 aria-hidden)해 끊김 없이 -50% 이동.
function MarqueeRow({ reviews, reverse }: { reviews: Review[]; reverse?: boolean }) {
  return (
    <ul
      className={cn(
        "flex w-max gap-4 motion-reduce:animate-none",
        reverse ? "marquee-reverse" : "animate-marquee",
      )}
    >
      {reviews.map((review) => (
        <li key={review.id} className="w-[280px] shrink-0 sm:w-[320px]">
          <ReviewCard review={review} className="h-full" />
        </li>
      ))}
      {reviews.map((review) => (
        <li key={`${review.id}-dup`} className="w-[280px] shrink-0 sm:w-[320px]" aria-hidden>
          <ReviewCard review={review} className="h-full" />
        </li>
      ))}
    </ul>
  );
}

// 후기 무한 마퀴(2줄) — 위 줄/아래 줄을 서로 반대 방향으로 흘린다.
// prefers-reduced-motion 은 globals.css 전역 블록이 정지시킨다(추가 JS 불필요).
export function ReviewMarquee({ reviews = REVIEWS, className }: ReviewMarqueeProps) {
  const half = Math.ceil(reviews.length / 2);
  const rowTop = reviews.slice(0, half);
  const rowBottom = reviews.slice(half);

  return (
    <div
      className={cn("marquee-mask relative flex w-full flex-col gap-4 overflow-hidden", className)}
    >
      <MarqueeRow reviews={rowTop} />
      <MarqueeRow reviews={rowBottom} reverse />
    </div>
  );
}
