# WEFLOW 디자인 시스템 (브랜드 컬러 + 토스식 구조)

> **컬러/비주얼 identity = WEFLOW 브랜드**(아래 §2, 실제 reference 페이지 `weflow-web.vercel.app`에서 추출). **구조 원칙 = 토스식**(타이포·간격·컴포넌트 일관성·접근성 상태·명확한 위계).
> 색상·간격·타이포는 **토큰**으로만 사용하고 컴포넌트에 hex/px를 하드코딩하지 않는다.
> 스택: Next.js 16 + React 19 + **Tailwind CSS v4**. 토큰은 `src/app/globals.css`의 `@theme` 블록에 정의(v4는 `tailwind.config.js` 기본 없음).

---

## 1. 비주얼 방향
- **WEFLOW 브랜드 룩**: 다크 네이비 베이스 + **시안→블루 그라디언트** 시그니처 + **앰버 프리미엄 액센트**.
- **인트로/랜딩/히어로는 화려하고 예쁘게**: 풀블리드 그라디언트 배경, 시안 글로우, 큰 fluid 타이포, 진입 애니메이션, 도트그리드 패턴 등 적극 사용. "깔끔하게(밋밋하게)"가 아니라 **임팩트 있게**.
- **콘텐츠/폼/관리자는 토스식으로 정돈**: 명확한 위계, 충분한 여백, 일관된 카드/입력, 가독성 우선(글로우 남용 금지).
- 어디서나 **강한 반응형**(§8) + 부드러운 모션(§9).

---

## 2. 색상 토큰 (WEFLOW 브랜드 — reference 추출)

> 네이밍은 `--color-<role>`. Tailwind v4 `@theme`에 정의하면 `bg-*`/`text-*`/`border-*` 유틸이 자동 생성된다.

### 브랜드
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-brand-cyan` | `#22d3ee` | 시그니처 시안(그라디언트 시작, 글로우, 강조) |
| `--color-brand-blue` | `#2563eb` | 시그니처 블루(그라디언트 끝, 주 버튼) |
| `--color-primary` | `#2563eb` | 주 버튼/링크/포커스 |
| `--color-primary-soft` | `#54a2ff` | 보조 블루/호버 강조 |
| `--color-accent` | `#f59e0b` | 프리미엄/크라운 액센트(앰버) |
| `--color-accent-deep` | `#d97706` | 앰버 그라디언트 끝 |

### 배경 / 표면 (다크)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#0a0f1e` | 페이지 베이스 |
| `--color-bg-deep` | `#080d1a` | 더 깊은 섹션/푸터 |
| `--color-surface` | `#0f172a` | 카드 표면 |
| `--color-surface-2` | `#1e293b` | 상승 카드/입력 표면 |

### 텍스트 / 보더
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-text` | `#f1f5f9` | 본문 강조(라이트) |
| `--color-text-muted` | `#90a1b9` | 보조 텍스트 |
| `--color-text-subtle` | `#62748e` | 캡션/비활성 |
| `--color-border` | `#1e293b` | 카드/입력 테두리(기본) |
| `--color-border-strong` | `#334155` | 구분선/강한 테두리 |

### Semantic (상태)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-success` | `#22c55e` | 성공/완료 |
| `--color-warning` | `#ff8b1a` | 경고/진행중 |
| `--color-danger` | `#fb2c36` | 위험/삭제 |

> 상태 뱃지: 대기 = `text-muted`/slate, 진행중 = `warning`, 완료 = `success`.

### 시그니처 그라디언트 / 글로우
| 토큰 | 값 |
|---|---|
| `--gradient-brand` | `linear-gradient(135deg,#22d3ee 0%,#2563eb 100%)` (CTA·강조) |
| `--gradient-card` | `linear-gradient(135deg,#1e293b 0%,#0f172a 100%)` (카드) |
| `--gradient-premium` | `linear-gradient(135deg,#f59e0b 0%,#d97706 100%)` (크라운/MASTER·WEFLOW CARE) |
| `--glow-brand` | `0 0 24px rgba(34,211,238,.35)` (CTA/hover 시안 글로우) |

> 그라디언트는 **이 3종(시안→블루 / 카드 / 앰버)만** 사용. 임의 다색 그라디언트 금지. 글로우는 브랜드 액센트로 절제 사용.

---

## 3. 타이포그래피 (토스식)
- **폰트**: `Pretendard` (fallback `Apple SD Gothic Neo`, `system-ui`, sans-serif).
- **weight 3단계**: 400 / 500 / 700.
- 본문: 모바일 15 / 데스크탑 16. 제목 스케일 28 > 22 > 18 > 16. **히어로 제목은 fluid**(`clamp(28px, 6vw, 56px)`).
- line-height: 제목 1.25, 본문 1.6.

| 토큰 | size | weight |
|---|---|---|
| `--text-hero` | clamp(28,6vw,56) | 700 |
| `--text-h1` | 28 | 700 |
| `--text-h2` | 22 | 700 |
| `--text-h3` | 18 | 700 |
| `--text-body` | 16(15 mobile) | 400 |
| `--text-caption` | 13 | 400 |

---

## 4. 간격 시스템 (4px 그리드 — 토스식)
허용 스텝: **4·8·12·16·20·24·32·40·48·64·80·96**(px). 섹션 세로 패딩은 모바일 48~64 / 데스크탑 80~120.

| 토큰 | 값 | | 토큰 | 값 |
|---|---|---|---|---|
| `--space-1` | 4 | | `--space-8` | 32 |
| `--space-2` | 8 | | `--space-10` | 40 |
| `--space-3` | 12 | | `--space-12` | 48 |
| `--space-4` | 16 | | `--space-16` | 64 |
| `--space-5` | 20 | | `--space-20` | 80 |
| `--space-6` | 24 | | `--space-24` | 96 |

- radius: 버튼/입력 10~12, 카드 16, pill 9999.
- 컨테이너 max-width 1200, 좌우 패딩 모바일 20 / 데스크탑 24~40.

---

## 5. 컴포넌트 variant

### Button
- variant: **gradient(primary CTA)** / **solid(blue)** / **outlined** / **ghost**.
  - gradient: `--gradient-brand` 배경 + white text, hover 시 `--glow-brand` 강화. (히어로/주요 CTA)
  - solid: bg `primary` → hover `primary-soft`. outlined: 1px `border-strong`, text `text`; hover bg `surface-2`. ghost: 투명, text `text-muted`; hover bg `surface`.
- size sm(h36)/md(h44)/lg(h52). radius 12. focus-visible: 2px `brand-cyan` ring.

### Card
- bg `surface`(또는 `--gradient-card`), 1px `border`, **radius 16**, padding 20~24.
- hover(인터랙티브): 테두리 `brand-cyan` 20% + 은은한 시안 글로우 1단계. 프리미엄 카드는 `--gradient-premium` 보더/뱃지 + 크라운.

### Input / Select / Textarea
- bg `surface-2`, 1px `border`, radius 10, text `text`, placeholder `text-subtle`.
- focus: 테두리 `brand-cyan` + 2px 시안 ring. error: 테두리 `danger`.

### Badge / Chip
- pill(radius 9999), 13px. 기본 bg `surface-2`/text `text-muted`. 강조 칩은 `brand-cyan` 보더 + 시안 텍스트.

### 공통 인터랙션 (필수)
- **모든 인터랙티브 요소에 hover / focus(-visible) / active 상태** 명시. transition 150~250ms.

---

## 6. Pretendard 적용법
권장: **self-host woff2 + `next/font/local`**(FOUT/CLS 방지).
```ts
// src/app/fonts.ts
import localFont from 'next/font/local';
export const pretendard = localFont({
  src: [
    { path: '../shared/fonts/Pretendard-Regular.woff2', weight: '400' },
    { path: '../shared/fonts/Pretendard-Medium.woff2',  weight: '500' },
    { path: '../shared/fonts/Pretendard-Bold.woff2',    weight: '700' },
  ],
  variable: '--font-pretendard', display: 'swap',
});
```
- `layout.tsx`의 `<html className={pretendard.variable}>`, `globals.css`에서 `--font-sans: var(--font-pretendard), 'Apple SD Gothic Neo', system-ui, sans-serif;`.

---

## 7. Tailwind v4 `@theme` (다크 + 브랜드 그라디언트)
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-cyan: #22d3ee;
  --color-brand-blue: #2563eb;
  --color-primary: #2563eb;
  --color-primary-soft: #54a2ff;
  --color-accent: #f59e0b;
  --color-accent-deep: #d97706;
  --color-bg: #0a0f1e;
  --color-bg-deep: #080d1a;
  --color-surface: #0f172a;
  --color-surface-2: #1e293b;
  --color-text: #f1f5f9;
  --color-text-muted: #90a1b9;
  --color-text-subtle: #62748e;
  --color-border: #1e293b;
  --color-border-strong: #334155;
  --color-success: #22c55e;
  --color-warning: #ff8b1a;
  --color-danger: #fb2c36;
  --radius-card: 16px;
  --font-sans: var(--font-pretendard), 'Apple SD Gothic Neo', system-ui, sans-serif;
}

/* 브랜드 유틸(@theme 외 헬퍼) */
.bg-gradient-brand   { background: linear-gradient(135deg,#22d3ee 0%,#2563eb 100%); }
.bg-gradient-card    { background: linear-gradient(135deg,#1e293b 0%,#0f172a 100%); }
.bg-gradient-premium { background: linear-gradient(135deg,#f59e0b 0%,#d97706 100%); }
.glow-brand          { box-shadow: 0 0 24px rgba(34,211,238,.35); }
.dot-grid            { background-image: radial-gradient(rgba(148,163,184,.07) 1px, transparent 1px); background-size: 24px 24px; }

body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
html { scroll-behavior: smooth; }
```
- 토큰 정의 후 `bg-bg text-text border-border bg-surface` 등 유틸로 사용. **컴포넌트에 hex 직접 입력 금지**(토큰/브랜드 헬퍼 클래스만). `color-guard` 훅이 `globals.css` 외 hex를 경고한다.

---

## 8. 반응형 (강하게)
- 브레이크포인트(Tailwind 기본): `sm 640 / md 768 / lg 1024 / xl 1280`.
- **모바일 퍼스트**: 1열 → `md`/`lg`에서 다열. 히어로 fluid 타이포(`clamp`), 컨테이너 max-w-[1200px] + 반응형 패딩.
- 페이지별: 홈 "제작진행과정↔6단계" 데스크탑 2열 / 모바일 세로 스택. 가격 1열(데스크탑도 1열 유지 가능). 케이스 1열(모바일)→2~3열(데스크탑) 선택. 관리자 테이블 데스크탑 표 / 모바일 가로 스크롤 또는 카드. 랜딩 우측 sticky 폼 → 모바일 본문 아래 inline.
- 이미지 `next/image` 반응형 sizes, 잘림/가로 스크롤/렉 없음. 360·390·414·768·1024·1280px 점검. 탭 타깃 ≥44px.

---

## 9. 모션
- 진입: `fadeInUp`(섹션/카드, IntersectionObserver). 후기 마퀴 무한 스크롤. hover 글로우/스케일(살짝). 모달 `modalIn`.
- transition 150~250ms, ease-out. **`prefers-reduced-motion` 존중**(애니메이션/마퀴 정지). 성능 위해 transform/opacity 위주.

---

## 10. 금지 / 주의 패턴
- 🚫 **임의 다색 그라디언트** — 그라디언트는 §2의 3종(시안→블루/카드/앰버)만.
- 🚫 **글로우/그림자 남용** — 브랜드 액센트로 절제. 콘텐츠/폼/표는 정돈된 면 위주(과한 글로우 금지).
- 🚫 **5색 이상 동시 강조** — 기본 = 시안/블루 + 슬레이트 스케일 + 필요한 1 액센트(앰버) + 1 semantic.
- 🚫 **하드코딩 hex**(토큰/브랜드 헬퍼만), weight 400/500/700 외, 4px 그리드 외 임의 간격.
- 🚫 **불필요한 아이콘 남발** — 의미 있는 곳에만.
- ✅ 가독성·위계는 항상 유지(다크 배경에서 대비 충분히).
