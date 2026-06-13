-- WEFLOW Supabase 스키마 — Supabase 대시보드 > SQL Editor 에 붙여넣고 Run.
-- 여러 번 실행해도 안전(idempotent). 컬럼명은 앱 모델과 동일한 camelCase(따옴표).

-- ─────────────────────────────── 테이블 ───────────────────────────────
create table if not exists public.reservations (
  id            uuid primary key default gen_random_uuid(),
  status        text not null default '대기' check (status in ('대기','진행중','완료')),
  name          text not null,
  phone         text not null,
  "desiredDate" text not null,
  "desiredTime" text not null,
  "isManualTime" boolean not null default false,
  "projectType" text not null,
  industry      text not null,
  note          text,
  agreed        boolean not null default true,
  "createdAt"   timestamptz not null default now(),
  "updatedAt"   timestamptz
);

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  status        text not null default '대기' check (status in ('대기','진행중','완료')),
  name          text not null,
  phone         text not null,
  "projectType" text not null,
  industry      text not null,
  note          text,
  source        text not null check (source in ('diagnosis','landing','review_modal','cases')),
  agreed        boolean not null default true,
  "createdAt"   timestamptz not null default now(),
  "updatedAt"   timestamptz
);

-- ─────────────────────────────── RLS ───────────────────────────────
-- 공개 폼: 익명(anon) INSERT 만 허용(SELECT 불가 → PII 보호).
-- 관리자(authenticated): 조회/수정/삭제 모두 허용.
alter table public.reservations enable row level security;
alter table public.inquiries    enable row level security;

drop policy if exists "anon insert reservations" on public.reservations;
drop policy if exists "auth read reservations"   on public.reservations;
drop policy if exists "auth update reservations" on public.reservations;
drop policy if exists "auth delete reservations" on public.reservations;
create policy "anon insert reservations" on public.reservations for insert to anon          with check (true);
create policy "auth read reservations"   on public.reservations for select to authenticated using (true);
create policy "auth update reservations" on public.reservations for update to authenticated using (true) with check (true);
create policy "auth delete reservations" on public.reservations for delete to authenticated using (true);

drop policy if exists "anon insert inquiries" on public.inquiries;
drop policy if exists "auth read inquiries"   on public.inquiries;
drop policy if exists "auth update inquiries" on public.inquiries;
drop policy if exists "auth delete inquiries" on public.inquiries;
create policy "anon insert inquiries" on public.inquiries for insert to anon          with check (true);
create policy "auth read inquiries"   on public.inquiries for select to authenticated using (true);
create policy "auth update inquiries" on public.inquiries for update to authenticated using (true) with check (true);
create policy "auth delete inquiries" on public.inquiries for delete to authenticated using (true);

-- ─────────────────────────────── Realtime ───────────────────────────────
-- 관리자 대시보드 크로스 디바이스 실시간 반영(이미 추가돼 있으면 건너뜀).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reservations'
  ) then
    alter publication supabase_realtime add table public.reservations;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'inquiries'
  ) then
    alter publication supabase_realtime add table public.inquiries;
  end if;
end $$;
