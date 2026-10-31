-- Run this once in the Supabase SQL editor. Data is never directly readable by browsers.
create extension if not exists pgcrypto;

create table if not exists public.km_games (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_user_id uuid not null,
  status text not null default 'waiting' check (status in ('waiting','active','finished')),
  winner text check (winner in ('hunters','shadows','cancelled')),
  center_lat double precision not null check (center_lat between -90 and 90),
  center_lng double precision not null check (center_lng between -180 and 180),
  radius_m integer not null check (radius_m between 100 and 100000),
  duration_s integer not null check (duration_s between 300 and 10800),
  headstart_s integer not null check (headstart_s between 0 and 600),
  reveal_s integer not null check (reveal_s between 30 and 600),
  shrink_s integer not null check (shrink_s between 60 and 1800),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create table if not exists public.km_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.km_games(id) on delete cascade,
  user_id uuid not null,
  name text not null check (char_length(name) between 1 and 24),
  role text not null check (role in ('hunter','shadow')),
  captured_at timestamptz,
  joined_at timestamptz not null default now(),
  unique(game_id, user_id)
);

create table if not exists public.km_positions (
  player_id uuid primary key references public.km_players(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  accuracy_m real not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.km_tag_requests (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.km_games(id) on delete cascade,
  hunter_player_id uuid not null references public.km_players(id) on delete cascade,
  shadow_player_id uuid not null references public.km_players(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists km_players_game_idx on public.km_players(game_id);
create index if not exists km_tag_requests_game_idx on public.km_tag_requests(game_id);

alter table public.km_games enable row level security;
alter table public.km_players enable row level security;
alter table public.km_positions enable row level security;
alter table public.km_tag_requests enable row level security;
-- NO public RLS policies: all room access is checked by the server Edge Function.
revoke all on public.km_games from anon, authenticated;
revoke all on public.km_players from anon, authenticated;
revoke all on public.km_positions from anon, authenticated;
revoke all on public.km_tag_requests from anon, authenticated;
