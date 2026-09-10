-- Create the core tables that every other script assumes already exist.
-- Run this FIRST, before 001-006.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  display_name text,
  created_at timestamp with time zone default now()
);

create table if not exists public.user_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  country text,
  city text,
  phone text,
  created_at timestamp with time zone default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  birth_date date not null,
  gender text,
  created_at timestamp with time zone default now()
);

create table if not exists public.parental_leave (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid references public.children(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  leave_type text,
  created_at timestamp with time zone default now()
);

create index if not exists user_details_user_id_idx on public.user_details(user_id);
create index if not exists children_user_id_idx on public.children(user_id);
create index if not exists parental_leave_user_id_idx on public.parental_leave(user_id);
create index if not exists parental_leave_child_id_idx on public.parental_leave(child_id);

-- RLS is enabled and policies are created separately in
-- 004_add_rls_to_existing_tables.sql, so leave these tables open here.
