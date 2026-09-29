-- AUTO WIND — шема на базата (Supabase / PostgreSQL)
-- Целосно оваа содржина е веќе извршена во Supabase проектот на AUTO WIND.
-- Ако креираш нов Supabase проект (на пример за нов сајт), изврши го овој фајл
-- во Supabase → SQL Editor за да се создаде истата структура.

create extension if not exists pgcrypto;

-- ---------- возила ----------
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                      -- SEO адреса, на пр. bmw-320d-2019
  brand text not null,
  model text not null,
  version text,
  year integer not null,
  price_eur numeric,
  price_mkd numeric,
  mileage_km integer,
  fuel text,
  transmission text,
  engine text,
  power_kw integer,
  power_hp integer,
  drive text,
  color text,
  euro_standard text,
  registration text,
  description text,
  equipment text[] default '{}',
  status text not null default 'available',        -- available | reserved | sold
  featured boolean not null default false,         -- истакнато на почетна
  sort_order integer not null default 0,           -- редослед во понудата
  cover_url text,                                  -- главна фотографија
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- фотографии на возило ----------
create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  storage_path text,                               -- патека во Supabase Storage (за бришење)
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- контакт податоци на сајтот ----------
create table if not exists public.site_settings (
  id integer primary key,
  phone_display text,
  phone_e164 text,
  viber text,
  whatsapp text,
  email text,
  address text,
  hours text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create index if not exists vehicles_status_idx on public.vehicles (status);
create index if not exists vehicles_sort_idx on public.vehicles (sort_order, created_at desc);
create index if not exists vehicle_images_vehicle_idx on public.vehicle_images (vehicle_id, sort_order);

-- ---------- пристап ----------
-- Сајтот чита само преку јавниот (anon) клуч. Сите измени одат преку admin панелот
-- кој користи service_role клуч на серверот — затоа овде има само политики за читање.
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.site_settings enable row level security;

create policy "public read vehicles" on public.vehicles
  for select to anon, authenticated using (true);
create policy "public read vehicle images" on public.vehicle_images
  for select to anon, authenticated using (true);
create policy "public read site settings" on public.site_settings
  for select to anon, authenticated using (true);

-- автоматско ажурирање на updated_at
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger vehicles_touch before update on public.vehicles
  for each row execute function public.touch_updated_at();

-- ---------- простор за фотографии ----------
insert into storage.buckets (id, name, public)
  values ('vehicle-photos', 'vehicle-photos', true)
  on conflict (id) do update set public = true;

create policy "public read vehicle photos" on storage.objects
  for select to anon, authenticated using (bucket_id = 'vehicle-photos');

-- ---------- контакт податоци (пример) ----------
insert into public.site_settings (id, phone_display, phone_e164, viber, whatsapp)
  values (1, '+389 78 262 045', '+38978262045', '+38978262045', '+38978262045')
  on conflict (id) do nothing;

