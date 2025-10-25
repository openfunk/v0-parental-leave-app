-- Add RLS policies to existing tables

-- Children table RLS
alter table public.children enable row level security;

create policy "Users can view their own children"
  on public.children for select
  using (auth.uid() = user_id);

create policy "Users can insert their own children"
  on public.children for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own children"
  on public.children for update
  using (auth.uid() = user_id);

create policy "Users can delete their own children"
  on public.children for delete
  using (auth.uid() = user_id);

-- Profiles table RLS
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- User details table RLS
alter table public.user_details enable row level security;

create policy "Users can view their own details"
  on public.user_details for select
  using (auth.uid() = user_id);

create policy "Users can insert their own details"
  on public.user_details for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own details"
  on public.user_details for update
  using (auth.uid() = user_id);

-- Parental leave table RLS
alter table public.parental_leave enable row level security;

create policy "Users can view their own parental leave"
  on public.parental_leave for select
  using (auth.uid() = user_id);

create policy "Users can insert their own parental leave"
  on public.parental_leave for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own parental leave"
  on public.parental_leave for update
  using (auth.uid() = user_id);

create policy "Users can delete their own parental leave"
  on public.parental_leave for delete
  using (auth.uid() = user_id);
