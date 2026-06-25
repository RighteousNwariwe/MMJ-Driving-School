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
-- 3. Create gallery_items table for photo gallery
-- ============================================
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_path text not null,        -- storage key in 'MMJ Pictures' bucket
  approved boolean default false,  -- admin must approve before showing
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Grant permissions
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

-- Enable Row Level Security
alter table public.gallery_items enable row level security;

-- Public can read only approved gallery items
create policy "public read approved gallery" on public.gallery_items 
  for select using (approved = true);

-- Admins can read all gallery items
create policy "admins read all gallery" on public.gallery_items
  for select to authenticated using (public.has_role(auth.uid(),'admin'));

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
-- 6. Create reviews table for user reviews
-- ============================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  rating int default 5 check (rating >= 1 and rating <= 5),
  text text not null,
  approved boolean default false,  -- admin must approve before showing
  created_at timestamptz default now()
);

-- Grant permissions
grant select on public.reviews to anon, authenticated;
grant insert, update on public.reviews to authenticated;
grant all on public.reviews to service_role;

-- Enable Row Level Security
alter table public.reviews enable row level security;

-- Public can read only approved reviews
create policy "public read approved reviews" on public.reviews 
  for select using (approved = true);

-- Admins can read all reviews
create policy "admins read all reviews" on public.reviews
  for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- Authenticated users can insert their own reviews
create policy "users insert reviews" on public.reviews
  for insert to authenticated with check (user_id = auth.uid());

-- Admins can manage reviews
create policy "admins manage reviews" on public.reviews
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- ============================================
-- 7. Insert initial reviews
-- ============================================
insert into public.reviews (user_id, name, rating, text, approved) values
  (null, 'Sherley', 5, 'I will to take this opportunity to thank MMJ driving school team more especially Jimmy and Jacob wow guys you done a very good job of teaching me how to driver i know it wasn''t easy but yes we did together one More time buti Jimmy you deserve Bells. Thank you so much may God bless you', true),
  (null, 'Nqobile', 5, 'I''d like to take this opportunity and thank MMJ driving School more specially to my instructor Mr Moloisi (Jimmy), you have been so patient with me from the beginning, very humble and with that I was able to learn fast, you even believed in me when I didn''t. Today I passed my driving licence code B even though people told me it was hard to pass it but you made it easy for me. Thank you very much. I will always recommend anyone to come have lessons with you because you''re the best teacher. Super proud. Thank you.', true),
  (null, 'Zamaswazi', 5, 'Jimmy is such a great instructor, patient and teaches you important details to ensure a great and east driving experience.', true),
  (null, 'Siyabonga', 5, 'The journey from fear to confidence in driving was made possible by MMJ''s exceptional patience and effective lessons. Obtaining my license today feels like a significant achievement, and I credit MMJ Driving School for teaching me so well that I succeeded in passing the test on my first attempt. For those hesitant about learning to drive, I enthusiastically recommend this driving school. The thought of starting can be daunting, but MMJ Driving School creates a supportive environment that fosters learning and boosts confidence. Their approach is truly commendable. Shout out to Jimmy and Jacob, Ngiyabonga kakhulu.', true),
  (null, 'ndivhuwo', 5, 'Great place to do your driving lessons, the driving lesson instructors are very patient and good at they''re job so i highly recommend for first timer. Thank you for the wonderful service', true),
  (null, 'Mbali', 5, 'Very patient and there''s no way you won''t learn, if mj could see how I drive now he''d be absolutely mortified', true),
  (null, 'Tracy', 5, 'Did my license (code 10) with MMJ driving school. Very professional and well mannered instructors. I highly recommend', true),
  (null, 'Kelebogile', 5, 'The instructor was very patient, they made learning how to park easy. He is good teacher, Highly recommend', true),
  (null, 'Zama', 5, 'Very awesome experience I had with MMJ. He is very patient and you can tell from His teachings that He know''s his story. The whole experience was enjoyable with him. I''m happy', true),
  (null, 'user', 5, 'Excellent teacher. Patient and very punctual. I miss his lesson every time when I''m driving.', true),
  (null, 'Ofentse', 5, 'I absolutely enjoyed driving with MJ. He is patient, attentive and very helpful. 5* service.', true),
  (null, 'Tracey', 5, 'Communication with clients is excellent, always keeps me up to date with events going on, great accommodating skills in terms of when I can be free, very patient', true),
  (null, 'Khethiwe', 5, 'MMJ always keep their clients updated and always professional. So far I''m grateful and happy', true),
  (null, 'Wanda', 5, 'Amazing experience, the instructor is very patient. They go out of their way to make sure you are ready for your test.', true),
  (null, 'Stephina', 5, 'Great service ever. They communicate with clients pretty well and pay attention to each and everyone. Very certisfying service', true),
  (null, 'Maharela', 5, 'I had a good experience with this driving school, they were very patient with me, taught me everything I needed to to know with driving, they very strict with time management alway make sure that you learn something before going home n I passed n got my driving licence on first attempt', true),
  (null, 'Tholakele', 5, 'Instructor is very patient and has taught me driving very well now I have my driving licence Code: C1', true);

-- ============================================
-- 8. Storage policies for MMJ Pictures bucket
-- ============================================

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
