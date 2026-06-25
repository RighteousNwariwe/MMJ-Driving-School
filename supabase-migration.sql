-- MMJ Driving School - Supabase Migration Script
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Create custom role enum
-- ============================================
create type public.app_role as enum ('admin', 'user');

-- ============================================
-- 2. Create user_roles table for role management
-- ============================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique(user_id, role)
);

-- Grant permissions
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

-- Enable Row Level Security
alter table public.user_roles enable row level security;

-- Users can read their own roles
create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

-- ============================================
-- 3. Create has_role function for role checking
-- ============================================
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean 
language sql 
stable 
security definer 
set search_path=public 
as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- ============================================
-- 4. Create gallery_items table for photo gallery
-- ============================================
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_path text not null,        -- storage key in 'MMJ Pictures' bucket
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Grant permissions
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

-- Enable Row Level Security
alter table public.gallery_items enable row level security;

-- Public can read gallery
create policy "public read gallery" on public.gallery_items 
  for select using (true);

-- Admins can manage gallery
create policy "admins manage gallery" on public.gallery_items
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- ============================================
-- 5. Create contact_messages table for contact form
-- ============================================
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null, 
  email text not null, 
  phone text, 
  message text not null,
  course text,
  created_at timestamptz default now()
);

-- Grant permissions
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;

-- Enable Row Level Security
alter table public.contact_messages enable row level security;

-- Anyone can send messages
create policy "anyone send message" on public.contact_messages 
  for insert with check (true);

-- Admins can read messages
create policy "admins read messages" on public.contact_messages
  for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- ============================================
-- 6. Storage policies for MMJ Pictures bucket
-- ============================================
-- Make sure the bucket exists first, then run these policies:

-- Public can read images
create policy "public read MMJ pics" on storage.objects 
  for select using (bucket_id = 'MMJ Pictures');

-- Admins can upload images
create policy "admins upload MMJ pics" on storage.objects 
  for insert to authenticated
  with check (bucket_id='MMJ Pictures' and public.has_role(auth.uid(),'admin'));

-- Admins can delete images
create policy "admins delete MMJ pics" on storage.objects 
  for delete to authenticated
  using (bucket_id='MMJ Pictures' and public.has_role(auth.uid(),'admin'));

-- ============================================
-- 7. Grant yourself admin access
-- ============================================
-- After signing up once, run this to make yourself an admin:
-- Replace 'YOUR_AUTH_USER_ID' with your actual user ID from auth.users

-- insert into public.user_roles(user_id, role)
-- values ('YOUR_AUTH_USER_ID', 'admin');

-- To find your user ID, run:
-- select id, email from auth.users;
