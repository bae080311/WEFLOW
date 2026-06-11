export type Review = {
  id: string;
  author: string;
  business: string;
  industry: string;
  rating: 5;
  quote: string;
};

export const reviews: Review[] = [
  {
    id: "review-pt",
    author: "김도윤 대표",
    business: "코어핏 PT스튜디오",
    industry: "PT샵",
    rating: 5,
    quote:
      "랜딩 오픈 3일 만에 상담 문의가 두 배로 늘었어요. 문의 버튼 위치까지 신경 써준 게 컸습니다.",
  },
  {
    id: "review-cafe",
    author: "이서연 사장",
    business: "모먼트 로스터리",
    industry: "카페",
    rating: 5,
    quote:
      "홈페이지부터 인스타·블로그 운영까지 한 번에 맡겼더니 매장에만 집중할 수 있어 만족합니다.",
  },
  {
    id: "review-interior",
    author: "박준호 실장",
    business: "온하우스 인테리어",
    industry: "인테리어 업체",
    rating: 5,
    quote: "견적 문의 폼이 깔끔해서 실제 계약으로 이어지는 비율이 확실히 좋아졌습니다.",
  },
  {
    id: "review-tax",
    author: "정민아 세무사",
    business: "바른 세무회계",
    industry: "세무사 사무소",
    rating: 5,
    quote: "검색 상단에 노출되면서 지역 고객 유입이 꾸준히 늘었어요. 운영 관리까지 믿고 맡깁니다.",
  },
  {
    id: "review-academy",
    author: "최현우 원장",
    business: "더하기 입시학원",
    industry: "입시학원",
    rating: 5,
    quote: "상담 신청 구조를 다시 설계해 주셔서 학부모 문의 전환율이 눈에 띄게 올랐습니다.",
  },
  {
    id: "review-pilates",
    author: "한지수 대표",
    business: "밸런스 필라테스",
    industry: "필라테스",
    rating: 5,
    quote: "제작 속도도 빠르고 광고 연동까지 매끄러워서 오픈 초기에 회원 모집이 수월했어요.",
  },
];
