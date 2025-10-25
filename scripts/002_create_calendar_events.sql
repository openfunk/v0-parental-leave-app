-- Create calendar_events table for managing appointments and activities
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  date date not null,
  time text,
  type text not null check (type in ('appointment', 'activity', 'reminder', 'milestone')),
  location text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.calendar_events enable row level security;

-- RLS Policies
create policy "Users can view their own calendar events"
  on public.calendar_events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own calendar events"
  on public.calendar_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own calendar events"
  on public.calendar_events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own calendar events"
  on public.calendar_events for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists calendar_events_user_id_idx on public.calendar_events(user_id);
create index if not exists calendar_events_date_idx on public.calendar_events(date);
