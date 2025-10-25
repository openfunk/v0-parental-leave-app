-- Create checklist_items table for pre-leaving checklist
create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.checklist_items enable row level security;

-- RLS Policies
create policy "Users can view their own checklist items"
  on public.checklist_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own checklist items"
  on public.checklist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own checklist items"
  on public.checklist_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own checklist items"
  on public.checklist_items for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists checklist_items_user_id_idx on public.checklist_items(user_id);
