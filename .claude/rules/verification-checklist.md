# WEFLOW 검증 체크리스트 (verification checklist)

> 작업 완료 전 점검. 단계별로 해당 항목만 골라 확인하고, 최종 QA(P12)에서 전체 점검한다.
> 명령: `npm run build` · `npm run lint` · `npm run typecheck`.

## A. 페이지 접근
- [ ] `/` `/services` `/pricing` `/cases` `/cases/[slug]` `/reservation` `/diagnosis` `/landing` `/admin` `/privacy` `/terms` 접근 가능, 에러 없음.
- [ ] 모든 페이지에 공통 셸(Header + Footer + BottomBar) 표시. (admin은 독립 셸 — 의도된 예외)

## B. CTA / 링크
- [ ] 네비 6개 라우팅 정확.
- [ ] 홈 히어로 3 CTA → `/diagnosis` `/cases` `/landing`.
- [ ] 홈 살펴보기/더보기/썸네일/진단버튼/후기더보기 동작(§8 라우팅표).
- [ ] 케이스 자세히보기 → 내부 `/cases/[slug]`(외부 데모 링크 아님), 더보기 → 문의 모달.
- [ ] 랜딩 CTA 2개 + sticky 폼 동작.
- [ ] Footer 개인정보처리방침/이용약관 → 실제 페이지(빈 `#` 아님).
- [ ] Footer/BottomBar 외부링크(전화/카카오/블로그/인스타/페북) 정확, 새 탭.
- [ ] dead link 0건, `weflow-*.vercel.app` 데모 링크로 가는 CTA 0건.

## C. 모바일
- [ ] 320·390·414px에서 모든 섹션 표시(PC와 동일 콘텐츠).
- [ ] 글자/이미지 잘림, 가로 스크롤 깨짐, 렉 없음.
- [ ] 홈 제작진행과정↔6단계 모바일 세로 스택, 가격 1열, 관리자 테이블 가로 스크롤/카드형, 랜딩 sticky→inline.
- [ ] BottomBar 항상 노출·콘텐츠 안 가림, 탭 타깃 ≥44px. 마퀴 `prefers-reduced-motion` 존중.

## D. 폼 제출
- [ ] **예약 폼** 제출: 달력 + 20슬롯(5×4) + 직접입력, 오늘이면 과거 슬롯 비활성, 필수 검증(이름/연락처/제작종류/업종/동의), 제출 성공.
- [ ] **무료진단 폼** 제출: 필드/검증/제출 성공.
- [ ] 랜딩 sticky 폼 + 문의 모달 제출 성공.
- [ ] 신규 레코드 기본 상태 = **대기**.

## E. 관리자
- [ ] 로그인 게이트(미인증 차단, 정상 계정 진입, 오류 계정 거부), 로그아웃, 새로고침 동작.
- [ ] **예약 목록** 표시(상태·이름·연락처·접수일·희망일정·관리).
- [ ] **문의 목록** 표시(상태·이름·연락처·접수일·관리).
- [ ] 상태 변경(완료/진행중) 가능 + 실시간 반영 + 영속.
- [ ] 삭제 가능(확인 후) + 실시간 반영.
- [ ] 상세보기(아래 화살표) → 제작종류/업종/추가요청사항 표시(예약·문의 모두).
- [ ] 상태 탭 대기/진행중/완료/전체 필터 정확.
- [ ] **엑셀 다운로드**: 예약 개별 / 문의 개별 / **전체 한 파일(예약·문의 2시트)** — 한글 정상.

## F. 빌드 / 테스트 / 품질
- [ ] `npm run build` 성공.
- [ ] `npm run lint` 성공(에러 0).
- [ ] `npm run typecheck` 성공(에러 0).
- [ ] **`npm run test` green** + (E2E 단계면) `npm run test:e2e` green.
- [ ] **커버리지 ≥80%**: `npm run test:coverage` 통과(lines·functions·branches·statements 모두 ≥80%).
- [ ] **PDF 규정값 단언 테스트 존재**: 가격 8카드·시간 20슬롯(과거 비활성)·폼 필수/동의·CTA 라우트(§8)·상태/삭제/상세/엑셀·제출→관리자 반영.
- [ ] 콘솔 에러/경고 없음.
- [ ] FSD import 방향(app→views→widgets→features→entities→shared) 위반 0, 슬라이스 public API(`index.ts`) 경유.

## G. 디자인 시스템
- [ ] **Pretendard 폰트 적용**(computed font-family 확인, FOUT/CLS 없음).
- [ ] **하드코딩 색상(hex) 0건**: `grep -rnE '#[0-9a-fA-F]{3,8}' src | grep -v globals.css` → 0.
- [ ] WEFLOW 브랜드 토큰만 사용(brand-cyan/blue·surface·text·accent·semantic).
- [ ] 그라디언트 0건: `grep -rn 'gradient' src` → 0.
- [ ] 그림자 최대 1단계, 5색 이상 동시 강조 없음, 다크 테마 잔재 없음.
- [ ] **컴포넌트별 hover / focus / active 상태 구현**(버튼·링크·카드·탭·입력).
- [ ] 4px 간격 그리드 준수.

## H. 배포 / 데이터 영속 (핵심)
- [ ] **배포 환경에서 다른 기기/브라우저로 제출한 예약·문의가 관리자에 실시간 반영**(Supabase Realtime). localStorage 단독으로는 미충족 — 백엔드 검증 필수.
- [ ] 새로고침/재접속 후 데이터 유지.
- [ ] 시크릿(Supabase 키·관리자 계정)이 소스/깃에 노출되지 않음(ENV).
