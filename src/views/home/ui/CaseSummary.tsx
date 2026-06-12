"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { getCaseBySlug, type Case } from "@/entities/case";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import { CASE_SUMMARY_SLUGS } from "../config/homeContent";

const SUMMARY_CASES: Case[] = CASE_SUMMARY_SLUGS.map((slug) => getCaseBySlug(slug)).filter(
  (c): c is Case => c != null,
);

// 카카오식 확장 패널(이미지 아코디언) — 호버/포커스하면 해당 사례가 크게 펼쳐지고 나머지는 좁아진다.
export function CaseSummary() {
  const [active, setActive] = useState(0);
  const count = SUMMARY_CASES.length;

  return (
    <Section bg="deep" className="relative isolate overflow-hidden">
      <div className="section-aura opacity-60" aria-hidden />
      <Container className="relative flex flex-col gap-10">
        <Reveal className="flex flex-col gap-4">
          <SectionHeader
            size="lg"
            eyebrow="SUCCESS CASES"
            title="다양한 업종의 성공 사례를 확인하세요."
            description="카드를 hover 하면 해당 사례가 크게 펼쳐집니다. 업종별 전환 최적화 사례를 직접 확인하세요."
          />
        </Reveal>

        <ul className="flex h-[560px] flex-col gap-3 md:h-[72vh] md:max-h-[760px] md:flex-row">
          {SUMMARY_CASES.map((c, idx) => {
            const isActive = idx === active;
            return (
              <li
                key={c.slug}
                data-case-panel
                data-active={isActive}
                onMouseEnter={() => setActive(idx)}
                onFocus={() => setActive(idx)}
                onClick={() => setActive(idx)}
                className={cn(
                  "group relative overflow-hidden rounded-card transition-[flex-grow,flex-basis] duration-500 ease-out",
                  isActive ? "flex-[5]" : "flex-[1]",
                )}
              >
                <Image
                  src={c.image}
                  alt={`${c.industry} 제작 사례`}
                  fill
                  sizes={
                    isActive ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 15vw"
                  }
                  className={cn(
                    "object-cover transition-transform duration-700 ease-out motion-reduce:transition-none",
                    isActive ? "scale-105" : "scale-100",
                  )}
                  priority={idx === 0}
                />
                <div
                  className="scrim-dark-strong pointer-events-none absolute inset-0"
                  aria-hidden
                />

                {/* 펼쳐진 상태 콘텐츠 */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col justify-end gap-2 p-6 transition-opacity duration-300 md:p-8",
                    isActive ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <span className="inline-flex w-fit items-center rounded-full border border-brand-cyan/40 bg-bg-deep/60 px-3 py-1 text-caption font-medium text-brand-cyan backdrop-blur-sm">
                    {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </span>
                  <h3 className="text-h1 font-bold leading-tight text-text md:text-hero md:leading-[1.1]">
                    {c.industry}
                  </h3>
                  <p className="max-w-xl text-body text-text">{c.summary}</p>
                  <Link
                    href={ROUTES.caseDetail(c.slug)}
                    className="mt-1 inline-flex w-fit items-center gap-1 text-body font-medium text-brand-cyan underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    자세히 보기
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>

                {/* 접힌 상태 라벨(모바일=가로, 데스크탑=세로) */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300",
                    isActive ? "opacity-0" : "opacity-100",
                  )}
                  aria-hidden
                >
                  <span className="text-h3 font-bold text-text [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl]">
                    {c.industry}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={ROUTES.cases} variant="outlined" size="lg" className="w-full sm:flex-1">
            살펴보기
          </Button>
          <Button href={ROUTES.diagnosis} variant="gradient" size="lg" className="w-full sm:flex-1">
            무료진단 받기
          </Button>
        </div>
      </Container>
    </Section>
  );
}
