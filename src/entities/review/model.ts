export type Review = {
  id: string;
  author: string;
  business: string;
  industry: string;
  rating: 5;
  quote: string;
};

export const REVIEWS: Review[] = [
  {
    id: "review-pt",
    author: "김도윤 대표",
    business: "코어핏 PT스튜디오",
    industry: "PT샵",
    rating: 5,
    quote: "문의 버튼 위치 바꾸고 상담 문의가 확실히 늘었어요.",
  },
  {
    id: "review-cafe",
    author: "이서연 사장",
    business: "모먼트 로스터리",
    industry: "카페",
    rating: 5,
    quote: "수정 요청도 빠르게 처리해주셔서 만족합니다.",
  },
  {
    id: "review-interior",
    author: "박준호 실장",
    business: "온하우스 인테리어",
    industry: "인테리어 업체",
    rating: 5,
    quote: "디자인보다 문의 구조를 신경 써주는 게 좋았습니다.",
  },
  {
    id: "review-pilates",
    author: "한지수 대표",
    business: "밸런스 필라테스",
    industry: "필라테스",
    rating: 5,
    quote: "랜딩페이지 제작 후 상담 문의가 늘었어요.",
  },
  {
    id: "review-tax",
    author: "정민아 세무사",
    business: "바른 세무회계",
    industry: "세무사 사무소",
    rating: 5,
    quote: "광고 연결까지 한 번에 진행돼서 편했어요.",
  },
  {
    id: "review-hair",
    author: "오세림 원장",
    business: "살롱 드 미",
    industry: "미용실",
    rating: 5,
    quote: "모바일 화면이 훨씬 보기 좋아졌어요.",
  },
  {
    id: "review-realtor",
    author: "강태현 대표",
    business: "더드림 공인중개사",
    industry: "공인중개사",
    rating: 5,
    quote: "홈페이지 만들고 끝이 아니라 관리도 해줘요.",
  },
  {
    id: "review-study-cafe",
    author: "윤서준 점장",
    business: "포커스 스터디카페",
    industry: "스터디카페",
    rating: 5,
    quote: "SEO 부분까지 신경 써서 만족합니다.",
  },
];
