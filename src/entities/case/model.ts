export type Case = {
  slug: string;
  industry: string;
  image: string;
  summary: string;
};

const rawCases: { slug: string; industry: string; file: string }[] = [
  { slug: "pt-shop", industry: "PT샵", file: "PT샵" },
  { slug: "pilates", industry: "필라테스", file: "필라테스" },
  { slug: "gym", industry: "헬스장", file: "헬스장" },
  { slug: "insurance", industry: "보험설계", file: "보험설계" },
  { slug: "law-office", industry: "법률 사무소", file: "법률사무소" },
  { slug: "car-detailing", industry: "자동차 디테일링", file: "자동차디테일링" },
  { slug: "rental-car", industry: "렌터카 업체", file: "렌터카업체" },
  { slug: "wedding-snap", industry: "웨딩/스냅 업체", file: "웨딩스냅업체" },
  { slug: "tax-office", industry: "세무사 사무소", file: "세무사사무소" },
  { slug: "realtor", industry: "공인중개사", file: "공인중개사" },
  { slug: "cafe", industry: "카페", file: "카페" },
  { slug: "hair-salon", industry: "미용실", file: "미용실" },
  { slug: "nail-shop", industry: "네일샵", file: "네일샵" },
  { slug: "smb-homepage", industry: "소상공인 기업형 홈페이지", file: "소상공인기업형홈페이지" },
  { slug: "skincare", industry: "피부관리샵", file: "피부관리샵" },
  { slug: "waxing", industry: "왁싱샵", file: "왁싱샵" },
  { slug: "semi-permanent", industry: "반영구샵", file: "반영구샵" },
  { slug: "pet-grooming", industry: "애견미용", file: "애견미용" },
  { slug: "pet-supplies", industry: "반려동물 용품점", file: "반려동물용품점" },
  { slug: "interior", industry: "인테리어 업체", file: "인테리어업체" },
  { slug: "moving", industry: "이사 업체", file: "이사업체" },
  { slug: "kids-cafe", industry: "키즈카페", file: "키즈카페" },
  { slug: "study-cafe", industry: "스터디카페", file: "스터디카페" },
  { slug: "english-academy", industry: "영어학원", file: "영어학원" },
  { slug: "math-academy", industry: "수학학원", file: "수학학원" },
  { slug: "entrance-academy", industry: "입시학원", file: "입시학원" },
  { slug: "private-tutoring", industry: "개인과외", file: "개인과외" },
  { slug: "cleaning", industry: "청소업체", file: "청소업체" },
];

export const cases: Case[] = rawCases.map(({ slug, industry, file }) => ({
  slug,
  industry,
  image: `/cases_${file}.jpg`,
  summary: `${industry} 업종에 맞춘 문의 전환 최적화 홈페이지 제작 사례입니다.`,
}));

export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
