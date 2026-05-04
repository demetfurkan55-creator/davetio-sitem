-- Token ile erişilen LCV / davetiye panelleri (API service_role ile yazar)
create table if not exists public.davetio_panels (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  draft jsonb not null,
  rsvp_guests jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists davetio_panels_token_idx on public.davetio_panels (token);

alter table public.davetio_panels enable row level security;

-- İstemci doğrudan DB kullanmıyor; tüm erişim API (service_role) üzerinden.
