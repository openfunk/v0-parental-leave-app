-- Create growth_entries table for tracking child growth measurements
create table if not exists public.growth_entries (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight numeric(5,2),
  height numeric(5,2),
  head_circumference numeric(5,2),
  notes text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.growth_entries enable row level security;

-- RLS Policies
create policy "Users can view their own growth entries"
  on public.growth_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own growth entries"
  on public.growth_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own growth entries"
  on public.growth_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own growth entries"
  on public.growth_entries for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists growth_entries_child_id_idx on public.growth_entries(child_id);
create index if not exists growth_entries_user_id_idx on public.growth_entries(user_id);
